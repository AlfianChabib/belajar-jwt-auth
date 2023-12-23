import { Request, Response } from "express";
import { object, string } from "yup";
import { compare, hash } from "../../../common/helpers/bycript.helper";
import prismaDb from "../../../config/db/prisma.db";
import { sign } from "jsonwebtoken";

export interface registerPayload {
  username: string;
  email: string;
  password: string;
}

// VALIDATOR YUP
export const registerSchema = object({
  body: object({
    username: string()
      .min(6, "Minimum length of username is 16")
      .max(30, "Maximum length of username is 30")
      .required("Username is required"),
    email: string().email("Invalid email format").required("Email is required"),
    password: string()
      .min(6, "Minimum length of password is 16")
      .max(16, "Maximum length of password is 16")
      .required("Password is required"),
  }),
});

export const register = async (req: Request, res: Response) => {
  try {
    const payload: registerPayload = {
      ...req.body,
      password: hash(req.body.password),
    };

    await prismaDb.user.create({
      data: payload,
    });

    return res.status(201).json({
      code: 201,
      message: `User ${payload.username} has been created`,
    });
  } catch (error: any) {
    console.log("@@@ register error :", error.message || error);
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if ((!username && !email) || !password) {
    return res.status(400).json({
      code: 400,
      message: "username or email and password is required",
    });
  }
  const condition: { username?: string; email?: string } = {};

  if (username) {
    condition.username = username;
  }

  if (email) {
    condition.email = email;
  }

  const user = await prismaDb.user.findFirst({
    where: condition,
  });

  if (!user) {
    return res.status(404).json({
      code: 404,
      message: "User not found",
    });
  }

  const isValidUSerPassword = compare(password, user.password);

  if (!isValidUSerPassword) {
    return res.status(400).json({
      code: 400,
      message: "Invalid Username or password",
    });
  }

  const JWT_SECRET = process.env.JWT_SECRET || "secretkey";
  const generatedToken = sign(
    { id: user.id, username: user.username, email: user.email },
    JWT_SECRET
  );

  return res.status(200).json({
    code: 200,
    message: "Login success",
    data: {
      token: generatedToken,
    },
  });
};
