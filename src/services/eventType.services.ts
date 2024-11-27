import { PrismaClient } from '@prisma/client';
import { EventType } from '@prisma/client';
import HttpException from '../utils/http-exception';

const prisma = new PrismaClient();

const getEventTypeById = async (id: string) => {
  return await prisma.eventType.findUnique({ where: { id: +id } });
};

export const getEventTypes = async () => {
  return await prisma.eventType.findMany();
};

export const createEventType = async (eventType: EventType) => {
  const newEventType = await prisma.eventType.create({ data: eventType });
  return newEventType;
};

export const deleteEventType = async (userId: string) => {
  const eventType = await getEventTypeById(userId);
  if (!eventType) throw new HttpException(404, 'EventType is not found');
  await prisma.eventType.delete({ where: { id: +userId } });
};
