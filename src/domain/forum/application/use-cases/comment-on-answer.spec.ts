import { InMemoryAnswerCommentsRepository } from "test/repositories/In-memory-answer-comments-repository";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { CommentOnAnswerUseCase } from "./comment-on-answer";
import { makeAnswer } from "test/factories/make-answer";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CommentOnAnswerUseCase;

describe(`Create a comment on answer`, () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository
    );
    sut = new CommentOnAnswerUseCase(
      inMemoryAnswerCommentsRepository,
      inMemoryAnswersRepository
    );
  });

  it("should be able to comment on an answer", async () => {
    const answer = makeAnswer({});

    await inMemoryAnswersRepository.create(answer);

    await sut.execute({
      authorId: "Author-1",
      answerId: answer.id.toString(),
      content: "content-1",
    });

    expect(inMemoryAnswerCommentsRepository.items[0]).toMatchObject({
      content: "content-1",
    });
  });
});
