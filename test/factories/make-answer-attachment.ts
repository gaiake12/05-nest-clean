import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeAnswerAttachment(
  override: Partial<AnswerAttachment>,
  id?: UniqueEntityID
) {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id
  );

  return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerAttachment(
    override: Partial<AnswerAttachment> = {}
  ): Promise<AnswerAttachment> {
    const answerAttachment = makeAnswerAttachment(override);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toString(),
      },
      data: {
        answerId: answerAttachment.answerId.toString(),
      },
    });

    return answerAttachment;
  }
}
