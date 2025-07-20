import { Optional } from '@/core/@types/optional'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Comment, CommentProps } from './comment'

export interface QuestionCommentProps extends CommentProps {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return questionComment
  }
}
