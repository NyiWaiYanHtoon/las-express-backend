export function getTimestampFilter(timestamp: string): { gte: Date } | undefined {
  
  console.log(timestamp);
   
  const now = new Date();

  if (timestamp === "today") {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    return { gte: start };
  }

  if (timestamp === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - 7);
    return { gte: start };
  }

  return undefined;
}