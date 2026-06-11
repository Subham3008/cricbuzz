import User from "./user.model.js";

// asyncHandler wraps any async controller function.
// It catches errors automatically and passes them to Express error handler.
// This way we don't need to write try/catch in every controller.
function asyncHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// GET /api/user/me
// Returns the profile of the currently logged-in user.
// req.user is set by the auth middleware before this runs.
export const getMe = asyncHandler(async function (req, res) {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// GET /api/user/:id
// Returns a basic public profile for any user by their ID.
// Only sends back: name, avatar, role, createdAt.
export const getPublicProfile = asyncHandler(async function (req, res) {
  const user = await User.findById(req.params.id).select(
    "name avatar role createdAt"
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
