import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  ) {}

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id
    );

    this.items.splice(questionIndex, 1);

    await this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString()
    );
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id
    );

    this.items[questionIndex] = question;

    const editedQuestion = this.items[questionIndex];

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string) {
    const question = this.items.find((item) => {
      return item.id.toString() === id;
    });

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }
}
