import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/quesion-attachments-repository";
import { QuestionAttachemnt } from "@/domain/forum/enterprise/entities/question-attachment";
import { Injectable } from "@nestjs/common";

Injectable();
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  findManyByQuestionId(questionId: string): Promise<QuestionAttachemnt[]> {
    throw new Error("Method not implemented.");
  }
  deleteManyByQuestionId(questionId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
