import moment from 'moment-timezone';
import cron from 'node-cron';
import axios from 'axios';
import { EventType, Message, PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

interface ApiRes {
  status: string;
  sentTime: string;
}

const sendToApi = async (status: string, timezone?: string | null) => {
  const query: { status: string; user_id?: {} } = { status };
  if (timezone) {
    query.user_id = { is: { timezone } };
  }
  const messages = await prisma.message.findMany({
    where: query,
    include: {
      user_id: true,
      event_type_id: true,
    },
  });

  // Call Send Messages
  messages.forEach((v) => {
    const maxTry = 3;
    let retryCount = 0;

    const makeCall = async (
      message: Message & { user_id: User; event_type_id: EventType }
    ) => {
      try {
        // send api
        const { data } = await axios.post<ApiRes>(
          'https://email-service.digitalenvision.com.au/send-email',
          {
            email: message.user_id.email,
            message: `Hey ${message.user_id.first_name} ${message.user_id.last_name}, ${message.event_type_id.greeting}!`,
          }
        );

        // If success set status success
        await prisma.message.update({
          where: { id: message.id },
          data: {
            status: data.status,
            sent_time: data.sentTime,
          },
        });
      } catch (error) {
        // If Error set status challenge
        await prisma.message.update({
          where: { id: message.id },
          data: { status: 'challenge' },
        });
        if (retryCount < maxTry) {
          retryCount++;
          makeCall(message);
        }
      }
    };

    makeCall(v);

    // Call Api
  });
};

const messagePrepareAndSend = () => {
  const timezones = moment.tz.names();
  timezones.forEach(async (v) => {
    const timeNow = moment().tz(v);

    // Find User Birthday is today
    if (timeNow.hour() === 0) {
      const events = await prisma.event.findMany({
        where: {
          date: { startsWith: `${timeNow.date()}-${timeNow.month() + 1}` },
          user_id: {
            is: {
              timezone: v,
            },
          },
        },
      });

      await prisma.message.createMany({
        data: events.map((event) => {
          return {
            userId: event.userId,
            eventId: event.id,
            eventTypeId: event.eventTypeId,
            status: 'init',
          };
        }),
      });
    }
    // Send Message at 9
    if (timeNow.hour() === 9) {
      sendToApi('init', v);
    }
  });
};

export const startSendMessage = () => {
  console.log('Message service start');
  cron.schedule('0 */1 * * *', messagePrepareAndSend);

  cron.schedule('*/15 * * * *', () => {
    sendToApi('challenge');
  });
};
