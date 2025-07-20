import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/@types/optional'
import dayjs from 'dayjs'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { QuestionAttachemntList } from './question-attachement-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  title: string
  content: string
  authorId: UniqueEntityID
  slug: Slug
  bestAnswerId?: UniqueEntityID
  attachments: QuestionAttachemntList
  createdAt: Date
  updatedAt?: Date
}

export class Question extends AggregateRoot<QuestionProps> {
  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get authorId() {
    return this.props.authorId
  }

  get slug() {
    return this.props.slug
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
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

  get isNew(): boolean {
    return dayjs().diff(this.props.createdAt) <= 3
  }

  get exerpt() {
    return this.props.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (
      (bestAnswerId && this.props.bestAnswerId === undefined) ||
      (bestAnswerId && !this.props.bestAnswerId?.equals(bestAnswerId))
    ) {
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.touch()
  }

  set attachments(attachments: QuestionAttachemntList) {
    this.props.attachments = attachments
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachemntList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
