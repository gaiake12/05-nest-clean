import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/quesion-attachments-repository'
import { QuestionAttachemnt } from '@/domain/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachemnt[] = []

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachemnt[]> {
    const attachments = this.items.filter(
      (attachment) => attachment.questionId.toString() === questionId,
    )

    return attachments
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter((attachment) => {
      return attachment.questionId.toString() !== questionId
    })

    this.items = questionAttachments
  }
}
