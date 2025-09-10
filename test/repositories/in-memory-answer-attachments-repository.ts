import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
    const attachments = this.items.filter(
      (attachment) => attachment.answerId.toString() === answerId
    );

    return attachments;
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    const answerAttachments = this.items.filter((attachment) => {
      return attachment.answerId.toString() !== answerId;
    });

    this.items = answerAttachments;
  }

  async createMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });
  }
}
