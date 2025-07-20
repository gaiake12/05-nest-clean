import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface QuestionAttachemntProps {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachemnt extends Entity<QuestionAttachemntProps> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: QuestionAttachemntProps, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachemnt(props, id)

    return questionAttachment
  }
}
