const std = @import("std");
const config = @import("config.zig");

pub const Rule = enum {
    body_leading_blank,
    body_max_line_length,
    footer_leading_blank,
    footer_max_line_length,
    header_max_length,
    header_trim,
    scope_case,
    subject_case,
    subject_empty,
    subject_exclamation_mark,
    subject_full_stop,
    type_case,
    type_empty,
    type_enum,

    pub fn name(rule: Rule) []const u8 {
        return switch (rule) {
            .body_leading_blank => "body-leading-blank",
            .body_max_line_length => "body-max-line-length",
            .footer_leading_blank => "footer-leading-blank",
            .footer_max_line_length => "footer-max-line-length",
            .header_max_length => "header-max-length",
            .header_trim => "header-trim",
            .scope_case => "scope-case",
            .subject_case => "subject-case",
            .subject_empty => "subject-empty",
            .subject_exclamation_mark => "subject-exclamation-mark",
            .subject_full_stop => "subject-full-stop",
            .type_case => "type-case",
            .type_empty => "type-empty",
            .type_enum => "type-enum",
        };
    }
};

pub const Issue = struct {
    severity: config.Severity,
    rule: Rule,
    message: []const u8,
};

pub const Report = struct {
    storage: [14]Issue = undefined,
    len: usize = 0,
    errors: usize = 0,
    warnings: usize = 0,

    pub fn issues(report: *const Report) []const Issue {
        return report.storage[0..report.len];
    }

    fn add(report: *Report, severity: config.Severity, rule: Rule, message: []const u8) void {
        if (severity == .disabled) return;
        report.storage[report.len] = .{ .severity = severity, .rule = rule, .message = message };
        report.len += 1;
        if (severity == .err) report.errors += 1 else report.warnings += 1;
    }
};

const ParsedMessage = struct {
    header: []const u8,
    commit_type: []const u8 = "",
    scope: []const u8 = "",
    subject: []const u8 = "",
    body: ?[]const u8 = null,
    footer: ?[]const u8 = null,
    body_leading_blank: bool = true,
    footer_leading_blank: bool = true,
    has_bang: bool = false,
};

pub fn lint(message: []const u8, rules: config.Config) !Report {
    if (!std.unicode.utf8ValidateSlice(message)) return error.InvalidUtf8;
    const parsed = parseMessage(message);
    var report: Report = .{};

    checkPlain(&report, rules.body_leading_blank, .body_leading_blank, parsed.body == null or parsed.body_leading_blank, "body must have a leading blank line");
    checkLimitLines(&report, rules.body_max_line_length, .body_max_line_length, parsed.body, "body line exceeds the maximum length");
    checkPlain(&report, rules.footer_leading_blank, .footer_leading_blank, parsed.footer == null or parsed.footer_leading_blank, "footer must have a leading blank line");
    checkLimitLines(&report, rules.footer_max_line_length, .footer_max_line_length, parsed.footer, "footer line exceeds the maximum length");
    checkLimit(&report, rules.header_max_length, .header_max_length, try codepointLen(parsed.header), "header exceeds the maximum length");
    checkPlain(&report, rules.header_trim, .header_trim, std.mem.eql(u8, parsed.header, std.mem.trim(u8, parsed.header, " \t")), "header must not have leading or trailing whitespace");
    checkCases(&report, rules.scope_case, .scope_case, parsed.scope, "scope has an invalid case");
    checkCases(&report, rules.subject_case, .subject_case, parsed.subject, "subject has an invalid case");
    checkPlain(&report, rules.subject_empty, .subject_empty, parsed.subject.len == 0, "subject must not be empty");
    checkPlain(&report, rules.subject_exclamation_mark, .subject_exclamation_mark, parsed.has_bang, "header must not use a breaking-change exclamation mark");
    checkString(&report, rules.subject_full_stop, .subject_full_stop, std.mem.endsWith(u8, parsed.subject, rules.subject_full_stop.value), "subject has an invalid full stop");
    checkCases(&report, rules.type_case, .type_case, parsed.commit_type, "type has an invalid case");
    checkPlain(&report, rules.type_empty, .type_empty, parsed.commit_type.len == 0, "type must not be empty");
    checkEnum(&report, rules.type_enum, .type_enum, parsed.commit_type, "type is not allowed");

    return report;
}

fn conditionPasses(condition: config.Condition, predicate: bool) bool {
    return if (condition == .always) predicate else !predicate;
}

fn checkPlain(report: *Report, rule: config.PlainRule, id: Rule, predicate: bool, message: []const u8) void {
    if (rule.severity != .disabled and !conditionPasses(rule.condition, predicate)) report.add(rule.severity, id, message);
}

fn checkLimit(report: *Report, rule: config.LimitRule, id: Rule, actual: usize, message: []const u8) void {
    if (rule.severity != .disabled and !conditionPasses(rule.condition, actual <= rule.value)) report.add(rule.severity, id, message);
}

fn checkLimitLines(report: *Report, rule: config.LimitRule, id: Rule, text: ?[]const u8, message: []const u8) void {
    if (rule.severity == .disabled or text == null) return;
    var valid = true;
    var lines = std.mem.splitScalar(u8, text.?, '\n');
    while (lines.next()) |raw_line| {
        const line = trimCarriageReturn(raw_line);
        if (codepointLen(line) catch unreachable > rule.value) {
            valid = false;
            break;
        }
    }
    if (!conditionPasses(rule.condition, valid)) report.add(rule.severity, id, message);
}

fn checkString(report: *Report, rule: config.StringRule, id: Rule, predicate: bool, message: []const u8) void {
    if (rule.severity != .disabled and !conditionPasses(rule.condition, predicate)) report.add(rule.severity, id, message);
}

fn checkCases(report: *Report, rule: config.CaseRule, id: Rule, text: []const u8, message: []const u8) void {
    if (rule.severity == .disabled or text.len == 0) return;
    var matches = false;
    for (rule.values) |case| {
        if (matchesCase(text, case)) {
            matches = true;
            break;
        }
    }
    if (!conditionPasses(rule.condition, matches)) report.add(rule.severity, id, message);
}

fn checkEnum(report: *Report, rule: config.EnumRule, id: Rule, text: []const u8, message: []const u8) void {
    if (rule.severity == .disabled or text.len == 0) return;
    var found = false;
    for (rule.values) |allowed| {
        if (std.mem.eql(u8, text, allowed)) {
            found = true;
            break;
        }
    }
    if (!conditionPasses(rule.condition, found)) report.add(rule.severity, id, message);
}

fn matchesCase(text: []const u8, target: config.Case) bool {
    return switch (target) {
        .lower => hasNoAsciiUpper(text),
        .upper => isAsciiUpper(text),
        .sentence => firstAsciiLetterIsUpper(text),
        .start => isStartCase(text),
        .pascal => firstAsciiLetterIsUpper(text) and std.mem.indexOfAny(u8, text, " -_\t") == null,
    };
}

fn hasNoAsciiUpper(text: []const u8) bool {
    for (text) |byte| if (std.ascii.isUpper(byte)) return false;
    return true;
}

fn isAsciiUpper(text: []const u8) bool {
    var found = false;
    for (text) |byte| {
        if (std.ascii.isLower(byte)) return false;
        if (std.ascii.isUpper(byte)) found = true;
    }
    return found;
}

fn firstAsciiLetterIsUpper(text: []const u8) bool {
    for (text) |byte| {
        if (std.ascii.isAlphabetic(byte)) return std.ascii.isUpper(byte);
    }
    return false;
}

fn isStartCase(text: []const u8) bool {
    var word_start = true;
    var found = false;
    for (text) |byte| {
        if (std.ascii.isAlphabetic(byte)) {
            found = true;
            if (word_start and !std.ascii.isUpper(byte)) return false;
            word_start = false;
        } else if (byte == ' ' or byte == '-' or byte == '_' or byte == '\t') {
            word_start = true;
        }
    }
    return found;
}

fn parseMessage(source: []const u8) ParsedMessage {
    const newline = std.mem.indexOfScalar(u8, source, '\n') orelse source.len;
    const header = trimCarriageReturn(source[0..newline]);
    var result: ParsedMessage = .{ .header = header };
    parseHeader(&result);

    if (newline == source.len) return result;
    const rest_start = newline + 1;
    const footer_start = findFooterStart(source, rest_start);
    if (footer_start) |start| {
        result.footer = source[start..trimTrailingBlankLines(source, start)];
        result.footer_leading_blank = start > rest_start and previousLineIsBlank(source, start);
    }

    const body_end = footer_start orelse source.len;
    const body_region = source[rest_start..body_end];
    if (hasNonBlankLine(body_region)) {
        result.body = body_region;
        const first_end = std.mem.indexOfScalar(u8, body_region, '\n') orelse body_region.len;
        result.body_leading_blank = trimCarriageReturn(body_region[0..first_end]).len == 0;
    }
    return result;
}

fn parseHeader(result: *ParsedMessage) void {
    const separator = std.mem.indexOf(u8, result.header, ": ") orelse return;
    var prefix = result.header[0..separator];
    result.subject = result.header[separator + 2 ..];
    if (std.mem.endsWith(u8, prefix, "!")) {
        result.has_bang = true;
        prefix = prefix[0 .. prefix.len - 1];
    }

    if (std.mem.indexOfScalar(u8, prefix, '(')) |open| {
        if (!std.mem.endsWith(u8, prefix, ")")) return resetHeaderParts(result);
        const commit_type = prefix[0..open];
        if (!isWord(commit_type)) return resetHeaderParts(result);
        result.commit_type = commit_type;
        result.scope = prefix[open + 1 .. prefix.len - 1];
    } else {
        if (!isWord(prefix)) return resetHeaderParts(result);
        result.commit_type = prefix;
    }
}

fn resetHeaderParts(result: *ParsedMessage) void {
    result.commit_type = "";
    result.scope = "";
    result.subject = "";
    result.has_bang = false;
}

fn isWord(text: []const u8) bool {
    if (text.len == 0) return false;
    for (text) |byte| if (!std.ascii.isAlphanumeric(byte) and byte != '_') return false;
    return true;
}

fn findFooterStart(source: []const u8, rest_start: usize) ?usize {
    const content_end = trimTrailingBlankLines(source, rest_start);
    if (content_end <= rest_start) return null;

    var paragraph_start = rest_start;
    var cursor = rest_start;
    while (cursor < content_end) {
        const line_end = std.mem.indexOfScalarPos(u8, source, cursor, '\n') orelse content_end;
        const bounded_end = @min(line_end, content_end);
        if (trimCarriageReturn(source[cursor..bounded_end]).len == 0 and line_end < content_end) {
            paragraph_start = line_end + 1;
        }
        if (line_end >= content_end) break;
        cursor = line_end + 1;
    }

    const first_end = std.mem.indexOfScalarPos(u8, source, paragraph_start, '\n') orelse content_end;
    const first = trimCarriageReturn(source[paragraph_start..@min(first_end, content_end)]);
    return if (isTrailerLine(first)) paragraph_start else null;
}

fn isTrailerLine(line: []const u8) bool {
    if (std.mem.startsWith(u8, line, "BREAKING CHANGE:") or std.mem.startsWith(u8, line, "BREAKING-CHANGE:")) return true;
    const colon = std.mem.indexOfScalar(u8, line, ':');
    const hash = std.mem.indexOf(u8, line, " #");
    const delimiter = colon orelse hash orelse return false;
    if (delimiter == 0) return false;
    for (line[0..delimiter]) |byte| if (!std.ascii.isAlphanumeric(byte) and byte != '-') return false;
    return true;
}

fn trimTrailingBlankLines(source: []const u8, minimum: usize) usize {
    var end = source.len;
    while (end > minimum and (source[end - 1] == '\n' or source[end - 1] == '\r')) end -= 1;
    return end;
}

fn previousLineIsBlank(source: []const u8, start: usize) bool {
    if (start == 0) return false;
    const previous_end = start - 1;
    const previous_start = if (std.mem.lastIndexOfScalar(u8, source[0..previous_end], '\n')) |index| index + 1 else 0;
    return trimCarriageReturn(source[previous_start..previous_end]).len == 0;
}

fn hasNonBlankLine(text: []const u8) bool {
    var lines = std.mem.splitScalar(u8, text, '\n');
    while (lines.next()) |line| if (trimCarriageReturn(line).len != 0) return true;
    return false;
}

fn trimCarriageReturn(text: []const u8) []const u8 {
    return if (std.mem.endsWith(u8, text, "\r")) text[0 .. text.len - 1] else text;
}

fn codepointLen(text: []const u8) !usize {
    return std.unicode.utf8CountCodepoints(text);
}

test "conventional accepts a valid commit" {
    const report = try lint("feat(parser): add fast parser", config.conventional());
    try std.testing.expectEqual(@as(usize, 0), report.len);
}

test "conventional reports type subject and full stop errors" {
    const report = try lint("wat: Add parser.", config.conventional());
    try std.testing.expectEqual(@as(usize, 3), report.errors);
    try std.testing.expectEqualStrings("subject-case", report.issues()[0].rule.name());
    try std.testing.expectEqualStrings("subject-full-stop", report.issues()[1].rule.name());
    try std.testing.expectEqualStrings("type-enum", report.issues()[2].rule.name());
}

test "angular rejects chore uppercase scope and bang" {
    const report = try lint("chore(Core)!: change API", config.angular());
    try std.testing.expectEqual(@as(usize, 3), report.errors);
}

test "leading blank warnings and line limits" {
    const report = try lint("feat: add parser\nbody without blank", config.conventional());
    try std.testing.expectEqual(@as(usize, 1), report.warnings);
    try std.testing.expectEqualStrings("body-leading-blank", report.issues()[0].rule.name());
}

test "recognizes footer trailers" {
    const parsed = parseMessage("feat: add parser\n\nbody\n\nBREAKING CHANGE: API changed");
    try std.testing.expect(parsed.body != null);
    try std.testing.expect(parsed.footer != null);
    try std.testing.expect(parsed.footer_leading_blank);
}

test "validates unicode and counts code points" {
    var rules = config.conventional();
    rules.header_max_length.value = 8;
    const report = try lint("feat: 你好", rules);
    try std.testing.expectEqual(@as(usize, 0), report.errors);
    try std.testing.expectError(error.InvalidUtf8, lint("feat: \xff", rules));
}

test "lint all generated messages" {
    const report = try lint("Merge branch 'main'", config.conventional());
    try std.testing.expect(report.errors > 0);
}

test "disabled and never overrides work" {
    var rules = config.conventional();
    rules.type_enum.severity = .disabled;
    rules.header_trim.condition = .never;
    const report = try lint("wat: subject", rules);
    try std.testing.expectEqual(@as(usize, 1), report.errors);
    try std.testing.expectEqual(Rule.header_trim, report.issues()[0].rule);
}

test "start case rejects a lowercase word after a separator" {
    try std.testing.expect(!matchesCase("Some message", .start));
    try std.testing.expect(!matchesCase("123", .start));
}

fn expectOnlyRule(message: []const u8, rules: config.Config, expected: Rule) !void {
    const report = try lint(message, rules);
    try std.testing.expectEqual(@as(usize, 1), report.len);
    try std.testing.expectEqual(expected, report.issues()[0].rule);
}

test "every supported rule can produce a finding" {
    var rules: config.Config = .{};

    rules.body_leading_blank = .{ .severity = .err, .condition = .always };
    try expectOnlyRule("feat: subject\nbody", rules, .body_leading_blank);
    rules = .{};

    rules.body_max_line_length = .{ .severity = .err, .condition = .always, .value = 3 };
    try expectOnlyRule("feat: subject\n\nlong", rules, .body_max_line_length);
    rules = .{};

    rules.footer_leading_blank = .{ .severity = .err, .condition = .always };
    try expectOnlyRule("feat: subject\nRefs: #1", rules, .footer_leading_blank);
    rules = .{};

    rules.footer_max_line_length = .{ .severity = .err, .condition = .always, .value = 6 };
    try expectOnlyRule("feat: subject\n\nRefs: #123", rules, .footer_max_line_length);
    rules = .{};

    rules.header_max_length = .{ .severity = .err, .condition = .always, .value = 5 };
    try expectOnlyRule("feat: subject", rules, .header_max_length);
    rules = .{};

    rules.header_trim = .{ .severity = .err, .condition = .always };
    try expectOnlyRule(" feat: subject ", rules, .header_trim);
    rules = .{};

    rules.scope_case = .{ .severity = .err, .condition = .always, .values = &.{.lower} };
    try expectOnlyRule("feat(Core): subject", rules, .scope_case);
    rules = .{};

    rules.subject_case = .{ .severity = .err, .condition = .never, .values = &.{.sentence} };
    try expectOnlyRule("feat: Subject", rules, .subject_case);
    rules = .{};

    rules.subject_empty = .{ .severity = .err, .condition = .never };
    try expectOnlyRule("feat: ", rules, .subject_empty);
    rules = .{};

    rules.subject_exclamation_mark = .{ .severity = .err, .condition = .never };
    try expectOnlyRule("feat!: subject", rules, .subject_exclamation_mark);
    rules = .{};

    rules.subject_full_stop = .{ .severity = .err, .condition = .never, .value = "." };
    try expectOnlyRule("feat: subject.", rules, .subject_full_stop);
    rules = .{};

    rules.type_case = .{ .severity = .err, .condition = .always, .values = &.{.lower} };
    try expectOnlyRule("FEAT: subject", rules, .type_case);
    rules = .{};

    rules.type_empty = .{ .severity = .err, .condition = .never };
    try expectOnlyRule(": subject", rules, .type_empty);
    rules = .{};

    rules.type_enum = .{ .severity = .err, .condition = .always, .values = &.{"feat"} };
    try expectOnlyRule("fix: subject", rules, .type_enum);
}

fn fuzzLint(input: []const u8) !void {
    _ = lint(input, config.conventional()) catch |err| switch (err) {
        error.InvalidUtf8 => return,
        else => return err,
    };
}

test "fuzz message parser" {
    try fuzzLint("feat: valid");
    try fuzzLint("feat: \xff");
    try std.testing.fuzz({}, struct {
        fn testOne(_: void, smith: *std.testing.Smith) !void {
            var input: [255]u8 = undefined;
            const len = smith.value(u8);
            smith.bytes(input[0..len]);
            try fuzzLint(input[0..len]);
        }
    }.testOne, .{});
}
