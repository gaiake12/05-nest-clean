import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<Question>
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(paginationParams: PaginationParams): Promise<Question[]>
}
