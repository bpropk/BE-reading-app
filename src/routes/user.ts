import { Request, Response } from "express";

const express = require("express");
const router = express.Router();

const authMiddleware = require("@middlewares/authMiddleware.controller");
const userController = require("@controllers/userController.controller");

router.get(
  "/detail",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    userController.personalInfo(req, res);
  }
);

router.get(
  "/library",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    userController.getUserLibrary(req, res);
  }
);
// router.post(
//   "/deposit",
//   authMiddleware.userAuth,
//   (req: Request, res: Response) => {
//     userController.depositMoneyIntoWallet(req, res);
//   }
// );

// router.post(
//   "/widthdraw",
//   authMiddleware.userAuth,
//   (req: Request, res: Response) => {
//     userController.widthdrawMoney(req, res);
//   }
// );

// router.post(
//   "/transfer",
//   authMiddleware.userAuth,
//   (req: Request, res: Response) => {
//     userController.transferMoney(req, res);
//   }
// );

// router.post("/buy", authMiddleware.userAuth, (req: Request, res: Response) => {
//   userController.buyPhoneCard(req, res);
// });

// router.get(
//   "/history",
//   authMiddleware.userAuth,
//   (req: Request, res: Response) => {
//     userController.historyTransaction(req, res);
//   }
// );

// router.get(
//   "/history/:id",
//   authMiddleware.userAuth,
//   (req: Request, res: Response) => {
//     userController.historyTransactionDetail(req, res);
//   }
// );

module.exports = router;

export {};
