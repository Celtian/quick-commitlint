//! Fast, dependency-free commit message linting.
pub const config = @import("config.zig");
pub const linting = @import("lint.zig");
pub const version = @import("version.zig").value;

test {
    _ = config;
    _ = linting;
}
