import { Request, Response } from "express";
import { param } from "express-validator";
const { UserStatus } = require("../utils/enum/user");

const express = require("express");
const router = express.Router();
const authMiddleware = require("@middlewares/authMiddleware.controller");
const adminController = require("@controllers/adminController.controller");

/* GET user */
router.get(
  "/users",
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.listAccount(req, res);
  }
);

router.get(
  "/users/:userId",
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.detailAccount(req, res);
  }
);

router.post(
  "/users/:userId/:status",
  param("status").isIn([
    UserStatus.Active,
    UserStatus.Unactive,
    UserStatus.WaitingUpdate,
    UserStatus.Locked,
  ]),
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.updateStatus(req, res);
  }
);

router.get(
  "/transactions",
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.listTransaction(req, res);
  }
);

router.post(
  "/transactions/:transactionId/accept",
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.acceptTransaction(req, res);
  }
);

router.post(
  "/transactions/:transactionId/decline",
  authMiddleware.adminAuth,
  (req: Request, res: Response) => {
    adminController.declineTransaction(req, res);
  }
);

module.exports = router;

export {};
