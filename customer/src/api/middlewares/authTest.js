const jwt = require('jsonwebtoken');

export const verifyToken = (req, res, next) => {
    const token = req.cookies["auth_token"];
    
    if(!token) {
        return res.status(401).json({message: "No token, authorization denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({message: "unauthorized"});
    }
};

export const setAuthToken = (res, userId) => {
    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" }
    );
  
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 86400000, // 1 day in milliseconds
    });
  
    return token;
  };

