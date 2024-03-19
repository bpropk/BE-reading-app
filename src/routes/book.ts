import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const bookController = require("@controllers/bookController.controller");
const authMiddleware = require("@middlewares/authMiddleware.controller");

// List book
router.get("/list/", authMiddleware.userAuth, (req: Request, res: Response) => {
  bookController.getAllBookInfo(req, res);
});

// Book detail
router.get(
  "/detail/:id",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    bookController.bookDetailInfo(req, res);
  }
);

// Reed Epub
router.get("/detail.epub", (req: Request, res: Response) => {
  bookController.readBook(req, res);
});

// Add library
router.post("/add", authMiddleware.userAuth, (req: Request, res: Response) => {
  bookController.addLibrary(req, res);
});

// Add Review Book
router.post(
  "/review",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    bookController.addReview(req, res);
  }
);

// Add Like
router.post(
  "/review/like",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    bookController.likeReview(req, res);
  }
);

router.get(
  "/review/:bookId",
  authMiddleware.userAuth,
  (req: Request, res: Response) => {
    bookController.allreview(req, res);
  }
);

module.exports = router;

export {};
