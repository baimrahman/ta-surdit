import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/http-exception";

export const errorResponseHandler = (
  err: HttpException | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // @ts-ignore
  if (err && err.statusCode) {
    // @ts-ignore
    res.status(err.statusCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
};
