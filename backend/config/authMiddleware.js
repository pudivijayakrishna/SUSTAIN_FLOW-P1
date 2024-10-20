import jwt from 'jsonwebtoken';
import { secretKey } from './jwtConfig.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }
    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(403).json({ message: "Invalid token!" });
        }
        req.user = user;
        next();
    });
};

// Authentication middleware for Donor role
export const authenticateDonorToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }
    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err || user.role !== 'donor') {
            return res.status(403).json({ message: "Access Forbidden! Invalid token or role." });
        }
        req.user = user;
        next();
    });
};

// Authentication middleware for NGO role
export const authenticateNgoToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }
    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err || user.role !== 'ngo') {
            return res.status(403).json({ message: "Access Forbidden! Invalid token or role." });
        }
        req.user = user;
        next();
    });
};

// Authentication middleware for Compost Agency role
export const authenticateAgencyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }
    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err || user.role !== 'compostAgency') {
            return res.status(403).json({ message: "Access Forbidden! Invalid token or role." });
        }
        req.user = user;
        next();
    });
};
