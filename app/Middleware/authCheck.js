const jwt = require('jsonwebtoken');
const { errorCode } = require('../Helper/response');
// For API routes - returns JSON

const authCheck = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers['x-access-token']
        if (!token) {
            return res.status(errorCode.notFound).json({
                status: errorCode.unauthorized,
                message: "Unauthorized User - Access Denied"
            })
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRECT||'WEBSKITTERPROJECTSDLCHILOKNLUIKD');
        // req.user = {
        //     _id: decoded._id,
        //     username: decoded.username,
        //     role: decoded.role,
        //     email:decoded.email
        // };

        req.user=decoded;

        res.locals.user = req.user;

        next();
    } catch (error) {
        res.clearCookie('token');
        return res.status(errorCode.serverError).json({
            status: errorCode.serverError,
            message: "Invalid or expired token.",
            error: error.message
        });
    }
};
// For EJS / View routes - redirects on failure
const authCheckView = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers["x-access-token"];

        if (!token) {
            res.redirect("/admin/loginpage");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRECT || "WEBSKITTERPROJECTSDLCHILOKNLUIKD"
        );

        req.user = decoded;

        res.locals.user = req.user;

        next();
    } catch (error) {
        console.error("Auth Check Error:", error);
        res.clearCookie("token");
        return res.redirect("/admin/loginpage");
    }
};
// Export both middlewares

module.exports = {
    authCheck,
    authCheckView
};

