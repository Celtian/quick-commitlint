const std = @import("std");

pub const Severity = enum(u2) { disabled = 0, warning = 1, err = 2 };
pub const Condition = enum { always, never };
pub const Case = enum { lower, upper, sentence, start, pascal };

pub const PlainRule = struct {
    severity: Severity = .disabled,
    condition: Condition = .always,
};

pub const LimitRule = struct {
    severity: Severity = .disabled,
    condition: Condition = .always,
    value: usize = 0,
};

pub const StringRule = struct {
    severity: Severity = .disabled,
    condition: Condition = .always,
    value: []const u8 = "",
};

pub const CaseRule = struct {
    severity: Severity = .disabled,
    condition: Condition = .always,
    values: []const Case = &.{},
};

pub const EnumRule = struct {
    severity: Severity = .disabled,
    condition: Condition = .always,
    values: []const []const u8 = &.{},
};

pub const Config = struct {
    body_leading_blank: PlainRule = .{},
    body_max_line_length: LimitRule = .{},
    footer_leading_blank: PlainRule = .{},
    footer_max_line_length: LimitRule = .{},
    header_max_length: LimitRule = .{},
    header_trim: PlainRule = .{},
    scope_case: CaseRule = .{},
    subject_case: CaseRule = .{},
    subject_empty: PlainRule = .{},
    subject_exclamation_mark: PlainRule = .{},
    subject_full_stop: StringRule = .{},
    type_case: CaseRule = .{},
    type_empty: PlainRule = .{},
    type_enum: EnumRule = .{},
};

const conventional_types = [_][]const u8{
    "build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test",
};
const angular_types = [_][]const u8{
    "build", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test",
};
const forbidden_subject_cases = [_]Case{ .sentence, .start, .pascal, .upper };
const lower_case = [_]Case{.lower};

pub fn conventional() Config {
    return .{
        .body_leading_blank = .{ .severity = .warning, .condition = .always },
        .body_max_line_length = .{ .severity = .err, .condition = .always, .value = 100 },
        .footer_leading_blank = .{ .severity = .warning, .condition = .always },
        .footer_max_line_length = .{ .severity = .err, .condition = .always, .value = 100 },
        .header_max_length = .{ .severity = .err, .condition = .always, .value = 100 },
        .header_trim = .{ .severity = .err, .condition = .always },
        .subject_case = .{ .severity = .err, .condition = .never, .values = &forbidden_subject_cases },
        .subject_empty = .{ .severity = .err, .condition = .never },
        .subject_full_stop = .{ .severity = .err, .condition = .never, .value = "." },
        .type_case = .{ .severity = .err, .condition = .always, .values = &lower_case },
        .type_empty = .{ .severity = .err, .condition = .never },
        .type_enum = .{ .severity = .err, .condition = .always, .values = &conventional_types },
    };
}

pub fn angular() Config {
    return .{
        .body_leading_blank = .{ .severity = .warning, .condition = .always },
        .footer_leading_blank = .{ .severity = .warning, .condition = .always },
        .header_max_length = .{ .severity = .err, .condition = .always, .value = 72 },
        .scope_case = .{ .severity = .err, .condition = .always, .values = &lower_case },
        .subject_case = .{ .severity = .err, .condition = .never, .values = &forbidden_subject_cases },
        .subject_empty = .{ .severity = .err, .condition = .never },
        .subject_exclamation_mark = .{ .severity = .err, .condition = .never },
        .subject_full_stop = .{ .severity = .err, .condition = .never, .value = "." },
        .type_case = .{ .severity = .err, .condition = .always, .values = &lower_case },
        .type_empty = .{ .severity = .err, .condition = .never },
        .type_enum = .{ .severity = .err, .condition = .always, .values = &angular_types },
    };
}

const RawRules = struct {
    @"body-leading-blank": ?std.json.Value = null,
    @"body-max-line-length": ?std.json.Value = null,
    @"footer-leading-blank": ?std.json.Value = null,
    @"footer-max-line-length": ?std.json.Value = null,
    @"header-max-length": ?std.json.Value = null,
    @"header-trim": ?std.json.Value = null,
    @"scope-case": ?std.json.Value = null,
    @"subject-case": ?std.json.Value = null,
    @"subject-empty": ?std.json.Value = null,
    @"subject-exclamation-mark": ?std.json.Value = null,
    @"subject-full-stop": ?std.json.Value = null,
    @"type-case": ?std.json.Value = null,
    @"type-empty": ?std.json.Value = null,
    @"type-enum": ?std.json.Value = null,
};

const RawConfig = struct {
    preset: ?[]const u8 = null,
    rules: ?RawRules = null,
};

pub const Loaded = struct {
    arena: std.heap.ArenaAllocator,
    value: Config,

    pub fn deinit(loaded: *Loaded) void {
        loaded.arena.deinit();
        loaded.* = undefined;
    }
};

pub fn parse(allocator: std.mem.Allocator, source: []const u8) !Loaded {
    var arena = std.heap.ArenaAllocator.init(allocator);
    errdefer arena.deinit();

    const raw = try std.json.parseFromSliceLeaky(RawConfig, arena.allocator(), source, .{
        .allocate = .alloc_always,
        .duplicate_field_behavior = .@"error",
        .ignore_unknown_fields = false,
        .max_value_len = source.len,
    });

    var value = if (raw.preset) |preset|
        if (std.mem.eql(u8, preset, "conventional")) conventional() else if (std.mem.eql(u8, preset, "angular")) angular() else return error.UnsupportedPreset
    else
        conventional();

    if (raw.rules) |rules| try applyRules(arena.allocator(), &value, rules);
    return .{ .arena = arena, .value = value };
}

fn applyRules(allocator: std.mem.Allocator, result: *Config, rules: RawRules) !void {
    if (rules.@"body-leading-blank") |value| result.body_leading_blank = try parsePlain(value);
    if (rules.@"body-max-line-length") |value| result.body_max_line_length = try parseLimit(value);
    if (rules.@"footer-leading-blank") |value| result.footer_leading_blank = try parsePlain(value);
    if (rules.@"footer-max-line-length") |value| result.footer_max_line_length = try parseLimit(value);
    if (rules.@"header-max-length") |value| result.header_max_length = try parseLimit(value);
    if (rules.@"header-trim") |value| result.header_trim = try parsePlain(value);
    if (rules.@"scope-case") |value| result.scope_case = try parseCases(allocator, value, false);
    if (rules.@"subject-case") |value| result.subject_case = try parseCases(allocator, value, true);
    if (rules.@"subject-empty") |value| result.subject_empty = try parsePlain(value);
    if (rules.@"subject-exclamation-mark") |value| result.subject_exclamation_mark = try parsePlain(value);
    if (rules.@"subject-full-stop") |value| result.subject_full_stop = try parseString(value);
    if (rules.@"type-case") |value| result.type_case = try parseCases(allocator, value, false);
    if (rules.@"type-empty") |value| result.type_empty = try parsePlain(value);
    if (rules.@"type-enum") |value| result.type_enum = try parseEnum(allocator, value);
}

fn items(value: std.json.Value) ![]const std.json.Value {
    return switch (value) {
        .array => |array| array.items,
        else => error.InvalidRuleTuple,
    };
}

fn severity(value: std.json.Value) !Severity {
    const number = switch (value) {
        .integer => |integer| integer,
        else => return error.InvalidRuleTuple,
    };
    return switch (number) {
        0 => .disabled,
        1 => .warning,
        2 => .err,
        else => error.InvalidRuleTuple,
    };
}

fn condition(value: std.json.Value) !Condition {
    const text = switch (value) {
        .string => |string| string,
        else => return error.InvalidRuleTuple,
    };
    if (std.mem.eql(u8, text, "always")) return .always;
    if (std.mem.eql(u8, text, "never")) return .never;
    return error.InvalidRuleTuple;
}

fn header(tuple: []const std.json.Value, expected_len: usize) !struct { Severity, Condition } {
    if (tuple.len == 1) {
        const level = try severity(tuple[0]);
        if (level != .disabled) return error.InvalidRuleTuple;
        return .{ level, .always };
    }
    if (tuple.len != expected_len) return error.InvalidRuleTuple;
    return .{ try severity(tuple[0]), try condition(tuple[1]) };
}

fn parsePlain(value: std.json.Value) !PlainRule {
    const tuple = try items(value);
    const parsed = try header(tuple, 2);
    return .{ .severity = parsed[0], .condition = parsed[1] };
}

fn parseLimit(value: std.json.Value) !LimitRule {
    const tuple = try items(value);
    const parsed = try header(tuple, 3);
    if (tuple.len == 1) return .{ .severity = .disabled };
    const limit = switch (tuple[2]) {
        .integer => |integer| integer,
        else => return error.InvalidRuleTuple,
    };
    if (limit < 0) return error.InvalidRuleTuple;
    return .{ .severity = parsed[0], .condition = parsed[1], .value = @intCast(limit) };
}

fn parseString(value: std.json.Value) !StringRule {
    const tuple = try items(value);
    const parsed = try header(tuple, 3);
    if (tuple.len == 1) return .{ .severity = .disabled };
    const text = switch (tuple[2]) {
        .string => |string| string,
        else => return error.InvalidRuleTuple,
    };
    if (text.len == 0) return error.InvalidRuleTuple;
    return .{ .severity = parsed[0], .condition = parsed[1], .value = text };
}

fn parseCase(value: std.json.Value) !Case {
    const text = switch (value) {
        .string => |string| string,
        else => return error.InvalidRuleTuple,
    };
    if (std.mem.eql(u8, text, "lower-case")) return .lower;
    if (std.mem.eql(u8, text, "upper-case")) return .upper;
    if (std.mem.eql(u8, text, "sentence-case")) return .sentence;
    if (std.mem.eql(u8, text, "start-case")) return .start;
    if (std.mem.eql(u8, text, "pascal-case")) return .pascal;
    return error.InvalidRuleTuple;
}

fn parseCases(allocator: std.mem.Allocator, value: std.json.Value, allow_array: bool) !CaseRule {
    const tuple = try items(value);
    const parsed = try header(tuple, 3);
    if (tuple.len == 1) return .{ .severity = .disabled };

    var values: []Case = undefined;
    switch (tuple[2]) {
        .string => {
            values = try allocator.alloc(Case, 1);
            values[0] = try parseCase(tuple[2]);
        },
        .array => |array| {
            if (!allow_array or array.items.len == 0) return error.InvalidRuleTuple;
            values = try allocator.alloc(Case, array.items.len);
            for (array.items, 0..) |item, index| values[index] = try parseCase(item);
        },
        else => return error.InvalidRuleTuple,
    }
    return .{ .severity = parsed[0], .condition = parsed[1], .values = values };
}

fn parseEnum(allocator: std.mem.Allocator, value: std.json.Value) !EnumRule {
    const tuple = try items(value);
    const parsed = try header(tuple, 3);
    if (tuple.len == 1) return .{ .severity = .disabled };
    const array = switch (tuple[2]) {
        .array => |array| array,
        else => return error.InvalidRuleTuple,
    };
    if (array.items.len == 0) return error.InvalidRuleTuple;
    const values = try allocator.alloc([]const u8, array.items.len);
    for (array.items, 0..) |item, index| {
        values[index] = switch (item) {
            .string => |string| string,
            else => return error.InvalidRuleTuple,
        };
        if (values[index].len == 0) return error.InvalidRuleTuple;
    }
    return .{ .severity = parsed[0], .condition = parsed[1], .values = values };
}

test "loads conventional by default" {
    var loaded = try parse(std.testing.allocator, "{}");
    defer loaded.deinit();
    try std.testing.expectEqual(@as(usize, 100), loaded.value.header_max_length.value);
    try std.testing.expectEqual(Severity.err, loaded.value.type_enum.severity);
}

test "loads angular and applies overrides" {
    var loaded = try parse(std.testing.allocator,
        \\{"preset":"angular","rules":{"header-max-length":[2,"always",80],"subject-full-stop":[0]}}
    );
    defer loaded.deinit();
    try std.testing.expectEqual(@as(usize, 80), loaded.value.header_max_length.value);
    try std.testing.expectEqual(Severity.disabled, loaded.value.subject_full_stop.severity);
    try std.testing.expectEqual(Severity.err, loaded.value.subject_exclamation_mark.severity);
}

test "rejects unknown duplicate and malformed configuration" {
    try std.testing.expectError(error.UnknownField, parse(std.testing.allocator, "{\"unknown\":true}"));
    try std.testing.expectError(error.DuplicateField, parse(std.testing.allocator, "{\"preset\":\"angular\",\"preset\":\"conventional\"}"));
    try std.testing.expectError(error.UnsupportedPreset, parse(std.testing.allocator, "{\"preset\":\"other\"}"));
    try std.testing.expectError(error.InvalidRuleTuple, parse(std.testing.allocator, "{\"rules\":{\"header-max-length\":[2,\"always\",-1]}}"));
    try std.testing.expectError(error.UnknownField, parse(std.testing.allocator, "{\"rules\":{\"custom-rule\":[2,\"always\"]}}"));
    try std.testing.expectError(error.DuplicateField, parse(std.testing.allocator, "{\"rules\":{\"type-empty\":[0],\"type-empty\":[2,\"never\"]}}"));
}

test "fuzz strict configuration parser" {
    try std.testing.fuzz({}, struct {
        fn testOne(_: void, smith: *std.testing.Smith) !void {
            var input: [255]u8 = undefined;
            const len = smith.value(u8);
            smith.bytes(input[0..len]);
            var loaded = parse(std.testing.allocator, input[0..len]) catch return;
            loaded.deinit();
        }
    }.testOne, .{});
}
