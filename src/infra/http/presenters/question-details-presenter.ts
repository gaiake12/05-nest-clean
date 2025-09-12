import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
  static toHTTP(question: QuestionDetails) {
    return {
      id: question.questionId.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      author: question.author,
      attachments: question.attachments.map(AttachmentPresenter.toHTTP),
    };
  }
}
