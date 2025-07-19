import express from "express";
import { selectUserStats } from "../utils/select-user-with-stats";

const router = express.Router();

router.get("/", async (req, res) => {

  const page = parseInt(req.query.page as string) || 1;
  const pageSize = 10;
  const search = (req.query.search as string) || "";

  try {
    const result = await selectUserStats((page - 1) * pageSize, pageSize, search);
    if(!result) return res.status(500).send("Something went wrong!");
    res.status(200).json(result);
  } catch (err) {
    console.log("Error fetching users", err);
    res.status(500).send("Something went wrong!");
  }
});

export default router;
