const std = @import("std");
const cli = @import("cli");
const quick = @import("quick_commitlint");

const color = struct {
    const reset = "\x1b[0m";
    const red = "\x1b[31m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const cyan = "\x1b[36m";
    const dim_cyan = "\x1b[2;36m";
};

const message_limit = 1024 * 1024;
const config_limit = 256 * 1024;
const config_name = ".quick-commitlint.json";

pub fn main(init: std.process.Init) !void {
    var args = try init.minimal.args.iterateAllocator(init.gpa);
    defer args.deinit();
    _ = args.next();

    switch (cli.parse(&args)) {
        .help => try writeHelp(init.io),
        .version => try writeVersion(init.io),
        .invalid => |invalid| {
            var buffer: [4096]u8 = undefined;
            var writer = std.Io.File.stderr().writer(init.io, &buffer);
            try cli.writeInvalidArgument(&writer.interface, invalid);
            try writer.interface.flush();
            std.process.exit(2);
        },
        .lint => |options| execute(init, options) catch |err| {
            var buffer: [4096]u8 = undefined;
            var writer = std.Io.File.stderr().writer(init.io, &buffer);
            try writer.interface.print(color.red ++ "error" ++ color.reset ++ ": {s}\n", .{@errorName(err)});
            try writer.interface.flush();
            std.process.exit(2);
        },
    }
}

fn execute(init: std.process.Init, options: cli.Options) !void {
    const started: std.Io.Clock.Timestamp = .now(init.io, .awake);
    const message = if (options.message_path) |path|
        try readFileAlloc(init.gpa, init.io, path, message_limit)
    else
        try readStdinAlloc(init.gpa, init.io, message_limit);
    defer init.gpa.free(message);

    var loaded: ?quick.config.Loaded = null;
    defer if (loaded) |*value| value.deinit();

    if (options.config_path) |path| {
        const source = try readFileAlloc(init.gpa, init.io, path, config_limit);
        defer init.gpa.free(source);
        loaded = try quick.config.parse(init.gpa, source);
    } else if (try discoverConfig(init.gpa, init.io)) |path| {
        defer init.gpa.free(path);
        const source = try readFileAlloc(init.gpa, init.io, path, config_limit);
        defer init.gpa.free(source);
        loaded = try quick.config.parse(init.gpa, source);
    }

    const rules = if (loaded) |*value| value.value else quick.config.conventional();
    const report = try quick.linting.lint(message, rules);
    const elapsed = started.untilNow(init.io);
    const elapsed_ms = @as(f64, @floatFromInt(elapsed.raw.nanoseconds)) / std.time.ns_per_ms;

    var buffer: [4096]u8 = undefined;
    var writer = std.Io.File.stderr().writer(init.io, &buffer);
    try writer.interface.writeByte('\n');
    for (report.issues()) |issue| {
        const symbol = if (issue.severity == .err) "✖" else "⚠";
        const symbol_color = if (issue.severity == .err) color.red else color.yellow;
        try writer.interface.print("  {s}{s}{s}  {s}  {s}[{s}]{s}\n", .{
            symbol_color,
            symbol,
            color.reset,
            issue.message,
            color.cyan,
            issue.rule.name(),
            color.reset,
        });
    }

    if (report.len > 0) try writer.interface.writeByte('\n');
    const summary_symbol = if (report.errors > 0) "✖" else if (report.warnings > 0) "⚠" else "✔";
    const summary_color = if (report.errors > 0) color.red else if (report.warnings > 0) color.yellow else color.green;
    const error_suffix = if (report.errors == 1) "" else "s";
    const warning_suffix = if (report.warnings == 1) "" else "s";
    try writer.interface.print("  {s}{s}{s}  {s}{d} error{s}{s} · {s}{d} warning{s}{s} · {s}{d:.2} ms{s}\n\n", .{
        summary_color,
        summary_symbol,
        color.reset,
        color.red,
        report.errors,
        error_suffix,
        color.reset,
        color.yellow,
        report.warnings,
        warning_suffix,
        color.reset,
        color.dim_cyan,
        elapsed_ms,
        color.reset,
    });
    try writer.interface.flush();
    if (report.errors > 0) std.process.exit(1);
}

fn readFileAlloc(allocator: std.mem.Allocator, io: std.Io, path: []const u8, limit: usize) ![]u8 {
    const file = try std.Io.Dir.cwd().openFile(io, path, .{});
    defer file.close(io);
    var buffer: [4096]u8 = undefined;
    var reader = file.reader(io, &buffer);
    return reader.interface.allocRemaining(allocator, .limited(limit));
}

fn readStdinAlloc(allocator: std.mem.Allocator, io: std.Io, limit: usize) ![]u8 {
    var buffer: [4096]u8 = undefined;
    var reader = std.Io.File.stdin().readerStreaming(io, &buffer);
    return reader.interface.allocRemaining(allocator, .limited(limit));
}

fn discoverConfig(allocator: std.mem.Allocator, io: std.Io) !?[]u8 {
    const cwd = try std.process.currentPathAlloc(io, allocator);
    defer allocator.free(cwd);
    var directory: []const u8 = cwd;

    while (true) {
        const candidate = try std.fs.path.join(allocator, &.{ directory, config_name });
        if (std.Io.Dir.openFileAbsolute(io, candidate, .{})) |file| {
            file.close(io);
            return candidate;
        } else |err| switch (err) {
            error.FileNotFound => allocator.free(candidate),
            else => {
                allocator.free(candidate);
                return err;
            },
        }

        const parent = std.fs.path.dirname(directory) orelse break;
        if (std.mem.eql(u8, parent, directory)) break;
        directory = parent;
    }
    return null;
}

fn writeHelp(io: std.Io) !void {
    var buffer: [4096]u8 = undefined;
    var writer = std.Io.File.stdout().writer(io, &buffer);
    try cli.writeHelp(&writer.interface);
    try writer.interface.flush();
}

fn writeVersion(io: std.Io) !void {
    var buffer: [128]u8 = undefined;
    var writer = std.Io.File.stdout().writer(io, &buffer);
    try writer.interface.print("quick-commitlint {s}\n", .{quick.version});
    try writer.interface.flush();
}
