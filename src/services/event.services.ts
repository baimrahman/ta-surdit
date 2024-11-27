import { PrismaClient } from '@prisma/client';
import { Event } from '@prisma/client';
import HttpException from '../utils/http-exception';

const prisma = new PrismaClient();

const getEventById = async (id: string) => {
  return await prisma.event.findUnique({ where: { id: +id } });
};

export const getEvents = async () => {
  return await prisma.event.findMany();
};

export const createEvent = async (event: Event) => {
  const newEvent = await prisma.event.create({ data: event });
  return newEvent;
};

export const deleteEvent = async (userId: string) => {
  const event = await getEventById(userId);
  if (!event) throw new HttpException(404, 'Event is not found');
  await prisma.event.delete({ where: { id: +userId } });
};
