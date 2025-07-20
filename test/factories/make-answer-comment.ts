import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'

export function makeAnswerComment(
  override?: Partial<AnswerCommentProps>,
  id?: UniqueEntityID,
): AnswerComment {
  const answerComment = AnswerComment.create(
    {
      authorId: new UniqueEntityID(),
      content: 'content-1',
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerComment
}
