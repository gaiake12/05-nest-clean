import { WatchedList } from '@/core/entities/watched-list'
import { QuestionAttachemnt } from './question-attachment'

export class QuestionAttachemntList extends WatchedList<QuestionAttachemnt> {
  compareItems(a: QuestionAttachemnt, b: QuestionAttachemnt): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
