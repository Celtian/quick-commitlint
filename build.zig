const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.standardTargetOptions(.{});
    const optimize = b.standardOptimizeOption(.{});

    const lib = b.addModule("quick_commitlint", .{
        .root_source_file = b.path("src/root.zig"),
        .target = target,
        .optimize = optimize,
    });
    const cli = b.createModule(.{
        .root_source_file = b.path("src/cli.zig"),
        .target = target,
        .optimize = optimize,
    });

    const exe = b.addExecutable(.{
        .name = "quick-commitlint",
        .root_module = b.createModule(.{
            .root_source_file = b.path("src/main.zig"),
            .target = target,
            .optimize = optimize,
            .link_libc = false,
            .single_threaded = true,
            .strip = optimize != .Debug,
            .imports = &.{
                .{ .name = "cli", .module = cli },
                .{ .name = "quick_commitlint", .module = lib },
            },
        }),
    });
    b.installArtifact(exe);

    const run_step = b.step("run", "Run quick-commitlint");
    const run = b.addRunArtifact(exe);
    run_step.dependOn(&run.step);
    run.step.dependOn(b.getInstallStep());
    if (b.args) |args| run.addArgs(args);

    const lib_tests = b.addTest(.{ .root_module = lib });
    const cli_tests = b.addTest(.{ .root_module = cli });
    const test_step = b.step("test", "Run unit tests");
    test_step.dependOn(&b.addRunArtifact(lib_tests).step);
    test_step.dependOn(&b.addRunArtifact(cli_tests).step);

    const fuzz_tests = b.addTest(.{
        .name = "quick-commitlint-fuzz",
        .root_module = lib,
        .use_llvm = true,
    });
    const fuzz_step = b.step("fuzz", "Build parser fuzz test executable");
    fuzz_step.dependOn(&b.addInstallArtifact(fuzz_tests, .{
        .dest_dir = .{ .override = .{ .custom = "fuzz-tests" } },
    }).step);
}
