import { InMemoryAnswerCommentsRepository } from 'test/repositories/In-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Question Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to delete a question comment', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    })

    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question comment from another user', async () => {
    const answerComment = makeAnswerComment()

    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      authorId: 'author-2',
      answerCommentId: answerComment.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
