import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachemnt } from '@/domain/forum/enterprise/entities/answer-attachment'

export function makeAnswerAttachment(
  override: Partial<AnswerAttachemnt>,
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachemnt.create(
    {
      attachmentId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerAttachment
}
