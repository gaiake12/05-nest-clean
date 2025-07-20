import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const updatedNotification = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(updatedNotification.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const updatedNotification = await sut.execute({
      recipientId: '1',
      notificationId: notification.id.toString(),
    })

    expect(updatedNotification.isLeft()).toBe(true)
    expect(updatedNotification.value).toBeInstanceOf(NotAllowedError)
  })
})
