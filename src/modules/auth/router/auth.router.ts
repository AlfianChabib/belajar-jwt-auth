import { Router } from "express";
import { inputValidator } from "../../../common/helpers/validator.helper";
import { login, register, registerSchema } from "../handler/auth.handler";

const authRouter = Router();

authRouter.post("/register", inputValidator(registerSchema), register);
authRouter.post("/login", login);

export default authRouter;
