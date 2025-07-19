import express from "express";
import { producer } from "../kafka/kafka-producer";
const router = express.Router();
router.post("/produce", async (req, res) => {
    const { topic, data } = req.body;
    if (!topic || !data) {
        return res.status(400).send("Something went wrong!");
    }
    try {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(data) }],
        });
        res.status(200).json({ message: "Message sent" });
    }
    catch (err) {
        console.log("Kafka produce error:", err);
        res.status(500).send("Something went wrong!");
    }
});
export default router;
