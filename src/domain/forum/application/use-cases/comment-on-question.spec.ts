import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { CommentOnQuestionUseCase } from "./comment-on-question";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: CommentOnQuestionUseCase;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
describe("Comment on Question", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository
    );
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository
    );
  });

  it("should be able to comment on a question", async () => {
    const question = makeQuestion({}, new UniqueEntityID("question-1"));

    await inMemoryQuestionsRepository.create(question);

    await sut.execute({
      authorId: "author-2",
      questionId: "question-1",
      content: "comment content",
    });

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      "comment content"
    );
  });
});
