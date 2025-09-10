import { AppModule } from "@/infra/app.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { StudentFactory } from "test/factories/make-student";
import { AnswerFactory } from "test/factories/make-answer";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";

describe("Edit answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        QuestionFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);
    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();
    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });
    const questionId = question.id;

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      content: "Answer Content",
      questionId,
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    });
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "Answer New Content",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "Answer New Content",
      },
      select: {
        id: true,
        attachments: {
          select: {
            id: true,
          },
        },
      },
    });

    expect(answerOnDatabase).toBeTruthy();
    expect(answerOnDatabase?.attachments).toHaveLength(2);
    expect(answerOnDatabase?.attachments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: attachment1.id.toString() }),
        expect.objectContaining({ id: attachment3.id.toString() }),
      ])
    );
  });
});
