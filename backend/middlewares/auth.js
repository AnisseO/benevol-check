import jwt from 'jsonwebtoken';

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decodedToken.id, role: decodedToken.role };
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentification échouée" });
  }
};