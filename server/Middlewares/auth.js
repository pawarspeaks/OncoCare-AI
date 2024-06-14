import jwt from "jsonwebtoken";

const isAuthenticatedUser = (req, res, next) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(500).send({ success: false, message: "Please Login To Make Session" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.cookie(process.env.COOKIE_NAME, "", { expires: new Date(0) });
            return res.status(500).send({ success: false, message: "Wrong Cookie" });
        } else {
            req.userId = decoded._id;
            next();
        }
    });
};

const isAuthenticatedHospital = (req, res, next) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(500).send({ success: false, message: "Please Login To Make Session" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.cookie(process.env.COOKIE_NAME, "", { expires: new Date(0) });
            return res.status(500).send({ success: false, message: "Wrong Cookie" });
        } else {
            req.hospital_id = decoded._id;
            next();
        }
    });
};

const isAuthenticatedAdmin = (req, res, next) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(500).send({ success: false, message: "Please Login To Make Session" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            res.cookie(process.env.COOKIE_NAME, "", { expires: new Date(0) });
            return res.status(500).send({ success: false, message: "Wrong Cookie" });
        } else {
            req.AdminId = decoded._id;
            next();
        }
    });
};

const isVerifiedHospital = (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        } else {
            return res.status(200).json({ success: true, user: decoded });
        }
    });
};

const isVerifiedUser = (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        } else {
            return res.status(200).json({ success: true, user: decoded });
        }
    });
};

const isVerifiedAdmin = (req, res) => {
    const token = req.cookies[process.env.COOKIE_NAME];
    if (!token) return res.status(401).json({ success: false, message: "Not authenticated" });

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        } else {
            return res.status(200).json({ success: true, user: decoded });
        }
    });
};

export { isAuthenticatedUser, isAuthenticatedHospital, isAuthenticatedAdmin, isVerifiedHospital, isVerifiedUser, isVerifiedAdmin };
