import { ActionType, PrismaClient } from "@prisma/client";
import { consumer } from "./kafka/kafka-consumer";
import { insertAction } from "./utils/insert-action";
const TOPICS: { [key: string]: ActionType } = {
  "video-visit": "visit",
  "video-view": "view",
  "video-complete": "complete",
};

const prisma = new PrismaClient();

async function runConsumer() {
  await consumer.connect();
  for (const topic of Object.keys(TOPICS)) {
    await consumer.subscribe({ topic, fromBeginning: false });
  }

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        const parsed = JSON.parse(message.value?.toString() || "{}");
        const { videoId, userId } = parsed;

        if (!videoId || !userId) {
          console.log(`Invalid message for topic ${topic}:`, parsed);
          return;
        }

        const actionType = TOPICS[topic];

        const action = await insertAction(actionType, videoId, userId)
        if(!action) console.log("Error inserting action:");

        console.log(`Created action '${actionType}' for video ${videoId} by user ${userId}`);
      } catch (err) {
        console.log("Error processing message:", err);
      }
    },
  });
}

runConsumer().catch(console.error);