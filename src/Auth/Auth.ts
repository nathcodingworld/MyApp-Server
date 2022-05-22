import { VerifyToken } from "./UserToker";

const auth = (req: any, res: any, next: () => void) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  let decodeToken: any;
  try {
    decodeToken = VerifyToken(authHeader);
  } catch (err: any) {
    req.isAuth = false;
    return next();
  }
  if (!decodeToken) {
    req.isAuth = false;
    return next();
  }
  req.userId = decodeToken.userId;
  req.isAuth = true;
  next();
};

export default auth;
