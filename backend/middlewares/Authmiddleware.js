const JwtSecret = require("../config.js");

const jwt = require("jsonwebtoken");

//middleware to check if the user is authenticated

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log(authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];
    //console.log(token);
        try {
            const decoded = jwt.verify(token, JwtSecret);
           // console.log(decoded);
            req.userid = decoded.userid;
            //console.log("started transaction");
            next();

        } catch (err) {
            return res.status(403).json({});
        }
    }

module.exports = authMiddleware;

