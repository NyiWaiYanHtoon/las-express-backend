import { Kafka } from "kafkajs";
const kafka = new Kafka({
    clientId: "las-producer",
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_API_KEY,
        password: process.env.KAFKA_SECRET_KEY,
    },
});
export const producer = kafka.producer();
export const connectProducer = async () => {
    try {
        await producer.connect();
        console.log("Kafka producer connected");
    }
    catch (err) {
        console.log("Failed to connect Kafka producer", err);
    }
};
