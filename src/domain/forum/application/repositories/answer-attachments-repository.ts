import { AnswerAttachemnt } from '../../enterprise/entities/answer-attachment'

export interface AnswerAttachmentsRepository {
  findManyByAnswerId(answerId: string): Promise<AnswerAttachemnt[]>
  deleteManyByAnswerId(answerId: string): Promise<void>
}
