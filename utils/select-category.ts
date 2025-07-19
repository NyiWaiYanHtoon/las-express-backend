import { Category, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function selectCategory(): Promise<Category[] | null> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" }, 
    });
    if(!categories) return null
    return categories;
  } catch (error) {
    console.log("Error fetching categories:", error);
    return null;
  }
}
