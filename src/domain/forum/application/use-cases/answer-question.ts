import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'
import { AnswerAttachemnt } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachemntList } from '../../enterprise/entities/asnwer-attachment-list'

interface AnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const questionAttachments = attachmentsIds.map((id) => {
      return AnswerAttachemnt.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachemntList(questionAttachments)

    await this.answersRepository.create(answer)

    return right({ answer })
  }
}
