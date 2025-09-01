import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/quesion-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

Injectable();
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}
  async findManyByQuestionId(
    questionId: string
  ): Promise<QuestionAttachment[]> {
    const questionsAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionsAttachments.map((questionAttachment) =>
      PrismaQuestionAttachmentMapper.toDomain(questionAttachment)
    );
  }
  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
