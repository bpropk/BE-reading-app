import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const authenticationController = require("@controllers/authController.controller");

/* POST register */
router.post("/register", (req: Request, res: Response) => {
  authenticationController.create(req, res);
});

/* POST login */
router.post("/login", (req: Request, res: Response) => {
  authenticationController.login(req, res);
});

/* POST change password */
router.post("/change-password", (req: Request, res: Response) => {
  authenticationController.changePassword(req, res);
});

/* POST forgot password */
router.post("/forgot-password", (req: Request, res: Response) => {
  authenticationController.forgotPassword(req, res);
});

router.post("/verify-forgot-password", (req: Request, res: Response) => {
  authenticationController.verifyForgotPassword(req, res);
});

module.exports = router;

export {};
