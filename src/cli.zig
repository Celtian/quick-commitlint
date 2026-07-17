const std = @import("std");

const color = struct {
    const reset = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const bright_cyan = "\x1b[96m";
};

pub const Options = struct {
    config_path: ?[]const u8 = null,
    message_path: ?[]const u8 = null,
};

pub const InvalidArgument = union(enum) {
    unknown: []const u8,
    missing_value: []const u8,
    duplicate_config,
    multiple_inputs,
};

pub const Action = union(enum) {
    help,
    version,
    lint: Options,
    invalid: InvalidArgument,
};

pub fn parse(args: anytype) Action {
    var options: Options = .{};
    var positional_only = false;

    while (args.next()) |arg| {
        if (!positional_only and std.mem.eql(u8, arg, "--")) {
            positional_only = true;
        } else if (!positional_only and (std.mem.eql(u8, arg, "--help") or std.mem.eql(u8, arg, "-h"))) {
            return .help;
        } else if (!positional_only and (std.mem.eql(u8, arg, "--version") or std.mem.eql(u8, arg, "-V"))) {
            return .version;
        } else if (!positional_only and (std.mem.eql(u8, arg, "--config") or std.mem.eql(u8, arg, "-c"))) {
            if (options.config_path != null) return .{ .invalid = .duplicate_config };
            const value = args.next() orelse return .{ .invalid = .{ .missing_value = arg } };
            if (std.mem.startsWith(u8, value, "-")) return .{ .invalid = .{ .missing_value = arg } };
            options.config_path = value;
        } else if (!positional_only and std.mem.startsWith(u8, arg, "-")) {
            return .{ .invalid = .{ .unknown = arg } };
        } else if (options.message_path == null) {
            options.message_path = arg;
        } else {
            return .{ .invalid = .multiple_inputs };
        }
    }

    return .{ .lint = options };
}

pub fn writeHelp(writer: anytype) !void {
    try writer.writeAll(
        "\n" ++ color.bright_cyan ++ "Quick Commitlint" ++ color.reset ++
            "\n\n" ++ color.yellow ++ "Usage:" ++ color.reset ++
            "\n  quick-commitlint [options] [commit-message-file]" ++
            "\n\nWhen no commit-message-file is provided, the message is read from stdin." ++
            "\n\n" ++ color.yellow ++ "Options:" ++ color.reset ++
            "\n  " ++ color.green ++ "-c, --config <path>" ++ color.reset ++
            "  Use an explicit JSON configuration file." ++
            "\n  " ++ color.green ++ "-h, --help" ++ color.reset ++
            "           Display usage information." ++
            "\n  " ++ color.green ++ "-V, --version" ++ color.reset ++
            "        Display the installed version." ++
            "\n\n",
    );
}

pub fn writeInvalidArgument(writer: anytype, invalid: InvalidArgument) !void {
    switch (invalid) {
        .unknown => |arg| try writer.print(color.red ++ "error" ++ color.reset ++ ": unknown argument '{s}'\n", .{arg}),
        .missing_value => |arg| try writer.print(color.red ++ "error" ++ color.reset ++ ": option '{s}' requires a value\n", .{arg}),
        .duplicate_config => try writer.writeAll(color.red ++ "error" ++ color.reset ++ ": --config may only be specified once\n"),
        .multiple_inputs => try writer.writeAll(color.red ++ "error" ++ color.reset ++ ": only one commit-message-file may be specified\n"),
    }
}

const TestIterator = struct {
    args: []const []const u8,
    index: usize = 0,

    fn next(iterator: *TestIterator) ?[]const u8 {
        if (iterator.index == iterator.args.len) return null;
        defer iterator.index += 1;
        return iterator.args[iterator.index];
    }
};

fn parseTest(args: []const []const u8) Action {
    var iterator: TestIterator = .{ .args = args };
    return parse(&iterator);
}

test "defaults to stdin and discovered config" {
    const options = parseTest(&.{}).lint;
    try std.testing.expectEqual(null, options.config_path);
    try std.testing.expectEqual(null, options.message_path);
}

test "parses config and message paths" {
    const options = parseTest(&.{ "-c", "config.json", "COMMIT_EDITMSG" }).lint;
    try std.testing.expectEqualStrings("config.json", options.config_path.?);
    try std.testing.expectEqualStrings("COMMIT_EDITMSG", options.message_path.?);
}

test "help and version stop parsing" {
    try std.testing.expectEqual(.help, std.meta.activeTag(parseTest(&.{"--help"})));
    try std.testing.expectEqual(.version, std.meta.activeTag(parseTest(&.{"-V"})));
}

test "rejects invalid arguments" {
    try std.testing.expectEqualStrings("--wat", parseTest(&.{"--wat"}).invalid.unknown);
    try std.testing.expectEqualStrings("--config", parseTest(&.{"--config"}).invalid.missing_value);
    try std.testing.expectEqual(.duplicate_config, std.meta.activeTag(parseTest(&.{ "-c", "a", "-c", "b" }).invalid));
    try std.testing.expectEqual(.multiple_inputs, std.meta.activeTag(parseTest(&.{ "a", "b" }).invalid));
}

test "double dash permits a path beginning with dash" {
    try std.testing.expectEqualStrings("-message", parseTest(&.{ "--", "-message" }).lint.message_path.?);
}

test "help is colored and documents the interface" {
    var output: std.Io.Writer.Allocating = .init(std.testing.allocator);
    defer output.deinit();
    try writeHelp(&output.writer);
    const text = output.writer.buffered();
    try std.testing.expect(std.mem.indexOf(u8, text, "quick-commitlint") != null);
    try std.testing.expect(std.mem.indexOf(u8, text, "--config") != null);
    try std.testing.expect(std.mem.indexOf(u8, text, color.bright_cyan) != null);
    try std.testing.expect(std.mem.indexOf(u8, text, color.yellow) != null);
    try std.testing.expect(std.mem.indexOf(u8, text, color.green) != null);
}
