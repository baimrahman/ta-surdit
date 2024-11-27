import { PrismaClient } from '@prisma/client';
import { Message } from '@prisma/client';
import HttpException from '../utils/http-exception';

const prisma = new PrismaClient();

const getUserById = async (id: string) => {
  return await prisma.message.findUnique({ where: { id: +id } });
};

export const getUsers = async () => {
  return await prisma.message.findMany();
};

export const createUser = async (message: Message) => {
  const newMessage = await prisma.message.create({ data: message });
  return newMessage;
};

export const deleteMessage = async (messageId: string) => {
  const message = await getUserById(messageId);
  if (!message) throw new HttpException(404, 'User is not found');
  await prisma.message.delete({ where: { id: +messageId } });
};