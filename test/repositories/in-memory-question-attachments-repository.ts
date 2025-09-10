import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const attachments = this.items.filter(
      (attachment) => attachment.questionId.toString() === questionId
    );

    return attachments;
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    const questionAttachments = this.items.filter((attachment) => {
      return attachment.questionId.toString() !== questionId;
    });

    this.items = questionAttachments;
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item));
    });
  }
}
