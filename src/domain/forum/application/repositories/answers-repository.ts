import { PaginationParams } from "@/core/repositories/pagination-params";
import { Answer } from "../../enterprise/entities/answer";

export abstract class AnswersRepository {
  abstract delete(answer: Answer): Promise<void>;
  abstract create(answer: Answer): Promise<void>;
  abstract save(answer: Answer): Promise<Answer>;
  abstract findById(id: string): Promise<Answer | null>;
  abstract findManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams
  ): Promise<Answer[]>;
}
