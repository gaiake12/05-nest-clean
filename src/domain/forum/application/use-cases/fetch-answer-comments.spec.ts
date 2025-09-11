import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";
import { InMemoryAnswerCommentsRepository } from "test/repositories/In-memory-answer-comments-repository";
import { makeAnswerComment } from "test/factories/make-answer-comment";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { makeStudent } from "test/factories/make-student";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch Answer Comments Use Case", () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository
    );
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it("should be able to fetch answer comments", async () => {
    const student = makeStudent({});

    inMemoryStudentsRepository.items.push(student);

    const answerComment1 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });
    const answerComment2 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });
    const answerComment3 = makeAnswerComment({
      answerId: new UniqueEntityID("answer-1"),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(answerComment1);
    await inMemoryAnswerCommentsRepository.create(answerComment2);
    await inMemoryAnswerCommentsRepository.create(answerComment3);

    const result = await sut.execute({
      page: 1,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ authorId: student.id }),
        expect.objectContaining({ authorId: student.id }),
        expect.objectContaining({ authorId: student.id }),
      ])
    );
  });

  it("should be able to fetch paginated answer comments", async () => {
    const student = makeStudent({});

    inMemoryStudentsRepository.items.push(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID("answer-1"),
          authorId: student.id,
        })
      );
    }

    const result = await sut.execute({
      page: 2,
      answerId: "answer-1",
    });

    expect(result.value?.comments).toHaveLength(2);
  });
});
