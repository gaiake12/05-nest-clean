import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { StudentFactory } from "test/factories/make-student";
import { DatabaseModule } from "@/infra/database/database.module";
import { QuestionFactory } from "test/factories/make-question";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { CacheModule } from "@/infra/cache/cache.module";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";

describe("Fetch question (E2E)", () => {
  let app: INestApplication;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionFactory: QuestionFactory;
  let cache: CacheRepository;
  let questionsRepository: QuestionsRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionsRepository = moduleRef.get(QuestionsRepository);
    cache = moduleRef.get(CacheRepository);

    await app.init();
  });

  it("should cache question details", async () => {
    const user = await studentFactory.makePrismaStudent();

    const attachment = await attachmentFactory.makePrismaAttachment({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    const cachedQuestionDetails = await cache.get(`question:${slug}:details`);

    if (!cachedQuestionDetails) {
      throw new Error("Question details not found in cache");
    }

    expect(JSON.parse(cachedQuestionDetails)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      })
    );
  });

  it("should return cached question details on subsequent calls", async () => {
    const user = await studentFactory.makePrismaStudent();

    const attachment = await attachmentFactory.makePrismaAttachment({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    let cachedQuestionDetails = await cache.get(`question:${slug}:details`);

    expect(cachedQuestionDetails).toBeNull();

    await questionsRepository.findDetailsBySlug(slug);

    const questionDetails = await questionsRepository.findDetailsBySlug(slug);

    cachedQuestionDetails = await cache.get(`question:${slug}:details`);

    if (!cachedQuestionDetails) {
      throw new Error("Question details not found in cache");
    }

    expect(JSON.parse(cachedQuestionDetails)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      })
    );
  });

  it("should reset question details cache when question is updated", async () => {
    const user = await studentFactory.makePrismaStudent();

    const attachment = await attachmentFactory.makePrismaAttachment({});

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const slug = question.slug.value;

    await cache.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true })
    );

    await questionsRepository.save(question);

    const cachedQuestionDetails = await cache.get(`question:${slug}:details`);

    expect(cachedQuestionDetails).toBeNull();
  });
});
