import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const bookController = require("@controllers/bookController.controller");
const authMiddleware = require("@middlewares/authMiddleware.controller");

router.get("/list/", authMiddleware.userAuth, (req: Request, res: Response) => {
  bookController.getAllBookInfo(req, res);
});

router.get("/detail.epub", (req: Request, res: Response) => {
  bookController.readBook(req, res);
});

module.exports = router;

export {};
