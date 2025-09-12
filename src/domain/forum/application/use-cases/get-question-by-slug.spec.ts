import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";
import { makeQuestion } from "test/factories/make-question";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { makeStudent } from "test/factories/make-student";
import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;

let sut: GetQuestionBySlugUseCase;

describe("Get Question By Slug", () => {
  beforeEach(async () => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to get a question by slug", async () => {
    const student = makeStudent({
      name: "John Doe",
    });

    inMemoryStudentsRepository.items.push(student);

    const attachment = makeAttachment({
      title: "Attachment 1",
    });

    inMemoryAttachmentsRepository.items.push(attachment);

    const newQuestion = makeQuestion({
      authorId: student.id,
      slug: Slug.create("example-question"),
    });

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: attachment.id,
      })
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      slug: "example-question",
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      question: expect.objectContaining({
        title: newQuestion.title,
        author: student.name,
        attachments: [attachment],
      }),
    });
  });
});
