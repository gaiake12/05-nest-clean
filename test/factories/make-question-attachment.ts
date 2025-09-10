import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export function makeQuestionAttachment(
  override: Partial<QuestionAttachment>,
  id?: UniqueEntityID
) {
  const questionAttachment = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id
  );

  return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionAttachment(
    override: Partial<QuestionAttachment> = {}
  ): Promise<QuestionAttachment> {
    const questionAttachment = makeQuestionAttachment(override);

    await this.prisma.attachment.update({
      where: {
        id: questionAttachment.attachmentId.toString(),
      },
      data: {
        questionId: questionAttachment.questionId.toString(),
      },
    });

    return questionAttachment;
  }
}
