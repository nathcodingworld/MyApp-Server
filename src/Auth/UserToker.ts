import jwt from "jsonwebtoken";

const secret = process.env.SECRET;

export function CreateToken(user: any) {
  return jwt.sign(
    {
      userid: user._id.toString(),
      email: user.email,
      username: user.userName,
      propic: user.avatar,
      bio: user.description,
    },
    secret,
    { expiresIn: "1h" }
  );
}

export function VerifyToken(authHeader: any) {
  const token = authHeader.split(" ")[1];
  return jwt.verify(token, secret);
}
