import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { JwtService } from "@nestjs/jwt";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { NotificationFactory } from "test/factories/make-notification";

describe("Read notification (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let notificationFactory: NotificationFactory;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, NotificationFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    prisma = moduleRef.get(PrismaService);
    notificationFactory = moduleRef.get(NotificationFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PATCH] /notifications/:notificationId/read", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const notificationId = notification.id.toString();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toString(),
      },
    });

    expect(notificationOnDatabase?.readAt).toEqual(expect.any(Date));
  });
});
