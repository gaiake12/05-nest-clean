import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachemnt } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachemnt[] = []

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachemnt[]> {
    const attachments = this.items.filter(
      (attachment) => attachment.answerId.toString() === answerId,
    )

    return attachments
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter((attachment) => {
      return attachment.answerId.toString() !== answerId
    })

    this.items = answerAttachments
  }
}
