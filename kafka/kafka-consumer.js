import { Kafka } from "kafkajs";
import dotenv from "dotenv";
dotenv.config();
const kafka = new Kafka({
    clientId: "las-consumer",
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_SECRET_KEY,
    },
});
export const consumer = kafka.consumer({ groupId: "las-group" });
