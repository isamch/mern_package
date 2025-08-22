import { verifyToken } from "../utils/jwt.js";

export const authMiddleware = (req, res, next) => {

  let token;
  if (req.headers.client === 'not-browser') {
    token = req.headers.authorization;
  } else {
    token = req.cookies['Authorization'];
  }

  if (!token) {
    throw { message: "Unauthorized: Token not found", statusCode: 403 };
  }

  if (token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  const jwtVerified = verifyToken(userToken);

  if (!jwtVerified) {
    throw { message: "Invalid or expired token", statusCode: 401 };
  }

  req.user = jwtVerified;

  next();

};
