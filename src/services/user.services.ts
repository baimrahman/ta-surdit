import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';
import HttpException from '../utils/http-exception';

const prisma = new PrismaClient();

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id: +id } });
};

export const getUsers = async () => {
  return await prisma.user.findMany();
};

export const createUser = async (user: User) => {
  const isUserExist = !!(await prisma.user.findUnique({
    where: { email: user.email },
  }));
  if (isUserExist) throw new HttpException(409, 'Email already registered!');
  const newUser = await prisma.user.create({ data: user });
  return newUser;
};

export const deleteUser = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) throw new HttpException(404, 'User is not found');
  await prisma.user.delete({ where: { id: +userId } });
};
