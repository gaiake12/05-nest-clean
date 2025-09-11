import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { InMemoryStudentsRepository } from "./in-memory-students-repository";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === questionComment.id
    );

    this.items.splice(questionIndex, 1);
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => {
      return item.id.toString() === id;
    });

    if (!questionComment) {
      return null;
    }

    return questionComment;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { page }: PaginationParams
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
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
          commentId: item.id.toString(),
          content: item.content,
          authorId: item.authorId.toString(),
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          author: author.name,
        });
      });

    return questionComments;
  }
}
