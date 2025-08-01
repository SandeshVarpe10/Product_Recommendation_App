const jwt = require('jsonwebtoken');
const SECRET_KEY = "#4545#";

exports.getUserFromToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            req.user = decoded;
        } catch (err) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    next();
};