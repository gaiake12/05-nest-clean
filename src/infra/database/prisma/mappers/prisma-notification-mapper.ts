import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Notification } from "@/domain/notification/enterprise/entities/notification";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Prisma, Notification as PrismaNotification } from "@prisma/client";

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        content: raw.content,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
        recipientId: new UniqueEntityID(raw.recipientId),
        title: raw.title,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    notification: Notification
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}
