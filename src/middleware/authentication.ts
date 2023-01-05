import { Request, Response, NextFunction } from "express";
import jwt_decode, { JwtPayload } from "jwt-decode";

const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization!.substring(7);
    try {
      const decoded = jwt_decode<JwtPayload>(token);

      if (decoded?.exp && decoded?.exp > Date.now() / 1000) {
        next();
      } else {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export { authentication };
