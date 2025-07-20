import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  delete(answer: Answer): Promise<void>
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<Answer>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    paginationParams: PaginationParams,
  ): Promise<Answer[]>
}
