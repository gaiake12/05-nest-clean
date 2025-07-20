import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachemnt } from '../../enterprise/entities/question-attachment'
import { QuestionAttachemntList } from '../../enterprise/entities/question-attachement-list'

interface CreateQuestionUseCaseRequest {
  authorId: string
  content: string
  title: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      content,
      title,
    })

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachemnt.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachemntList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
