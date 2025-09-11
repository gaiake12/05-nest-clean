import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === answerComment.id
    );

    this.items.splice(questionIndex, 1);
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => {
      return item.id.toString() === id;
    });

    if (!answerComment) {
      return null;
    }

    return answerComment;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const asnwerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return asnwerComments;
  }

  async findManyByAnswerIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map((item) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(item.authorId)
        );

        if (!author) {
          throw new Error(
            `Author with ID ${item.authorId.toString()} does not exist`
          );
        }

        return CommentWithAuthor.create({
          commentId: item.id,
          content: item.content,
          authorId: item.authorId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          author: author.name,
        });
      });

    return answerComments;
  }
}
