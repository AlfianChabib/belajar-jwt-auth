import { NextFunction, Request, Response } from "express";

export const inputValidator =
  (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      return res.status(400).json({
        code: 400,
        message: error.message || error,
      });
    }
  };
