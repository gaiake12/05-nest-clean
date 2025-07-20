import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachemnt } from './answer-attachment'

export class AnswerAttachemntList extends WatchedList<AnswerAttachemnt> {
  compareItems(a: AnswerAttachemnt, b: AnswerAttachemnt): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
