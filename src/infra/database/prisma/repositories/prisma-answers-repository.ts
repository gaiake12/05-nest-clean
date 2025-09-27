import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    });
  }
  async create(answer: Answer): Promise<void> {
    const prismaAnswer = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data: prismaAnswer,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems()
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer): Promise<Answer> {
    const prismaAnswer = PrismaAnswerMapper.toPrisma(answer);

    const updatedAnswer = await this.prisma.answer.update({
      where: { id: prismaAnswer.id },
      data: prismaAnswer,
    });

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems()
    );

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems()
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);

    return PrismaAnswerMapper.toDomain(updatedAnswer);
  }

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    if (!answer) {
      return null;
    }

    return PrismaAnswerMapper.toDomain(answer);
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      take: 20,
      skip: (page - 1) * 20,
      where: { questionId },
    });

    return answers.map((answer) => PrismaAnswerMapper.toDomain(answer));
  }
}
