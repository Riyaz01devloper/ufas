function authorize(roles) {
  return function (req, res, next) {
    const user = req.user;
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    next();
  };
}

export default authorize;
