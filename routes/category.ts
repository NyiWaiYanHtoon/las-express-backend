import express, { Request, Response } from "express";
import { selectCategory } from "../utils/select-category";

const router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await selectCategory();
    if(!categories) res.status(500).send("Something went wrong!")
    res.status(200).json({ categories });
  } catch (error) {
    console.log("Error fetching categories:", error);
    res.status(500).send("Something went wrong!");
  }
});

export default router;
