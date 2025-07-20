import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachemnt } from '@/domain/forum/enterprise/entities/question-attachment'

export function makeQuestionAttachment(
  override: Partial<QuestionAttachemnt>,
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachemnt.create(
    {
      attachmentId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return questionAttachment
}
