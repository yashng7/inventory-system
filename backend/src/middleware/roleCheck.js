// Check if user has required role
const authorize = (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized. Please login first.'
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. This resource requires ${roles.join(' or ')} role.`,
          yourRole: req.user.role
        });
      }
  
      next();
    };
  };
  
  module.exports = { authorize };