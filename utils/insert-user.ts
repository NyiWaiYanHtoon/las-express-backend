import { PrismaClient, User, UserRole} from '@prisma/client';

const prisma = new PrismaClient();

export async function insertUser(email: string, role: UserRole = 'user'):  Promise< User | null >{
  try {
    
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return existingUser;
    }

    // Insert the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        role,
      },
    });
    console.log('New user created:', newUser.email);
    return newUser;
    
  } catch (error) {
    console.log('Error inserting user:', error);
    return null;
  }
}
