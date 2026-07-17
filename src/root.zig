//! Fast, dependency-free commit message linting.
pub const config = @import("config.zig");
pub const linting = @import("lint.zig");
pub const version = @import("build_options").version;

test {
    _ = config;
    _ = linting;
}
