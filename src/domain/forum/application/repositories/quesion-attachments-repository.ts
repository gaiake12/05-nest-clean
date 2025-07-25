import { QuestionAttachemnt } from '../../enterprise/entities/question-attachment'

export interface QuestionAttachmentsRepository {
  findManyByQuestionId(questionId: string): Promise<QuestionAttachemnt[]>
  deleteManyByQuestionId(questionId: string): Promise<void>
}
