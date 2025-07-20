import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should be able to delete an answer', async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(answer)

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({ authorId: 'author-1', answerId: 'answer-1' })

    expect(inMemoryAnswersRepository.items).toHaveLength(0)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer from another user', async () => {
    const answer = makeAnswer(
      { authorId: new UniqueEntityID('author-1') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
