import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface AnswerAttachemntProps {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachemnt extends Entity<AnswerAttachemntProps> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: AnswerAttachemntProps, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachemnt(props, id)

    return answerAttachment
  }
}
