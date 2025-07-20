import { Optional } from '@/core/@types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachemntList } from './asnwer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedEvent } from '../events/answer-created-event'

export interface AnswerProps {
  content: string
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  attachments: AnswerAttachemntList
  createdAt: Date
  updatedAt?: Date
}

export class Answer extends AggregateRoot<AnswerProps> {
  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get exerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set attachments(attachments: AnswerAttachemntList) {
    this.props.attachments = attachments
    this.touch()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new AnswerAttachemntList(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
