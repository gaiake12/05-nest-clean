import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository,
  ) {}

  async delete(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(answerIndex, 1)

    await this.inMemoryAnswerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    )
  }

  async create(answer: Answer) {
    this.items.push(answer)

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[answerIndex] = answer

    const editedAnswer = this.items[answerIndex]

    DomainEvents.dispatchEventsForAggregate(answer.id)

    return editedAnswer
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }
}
