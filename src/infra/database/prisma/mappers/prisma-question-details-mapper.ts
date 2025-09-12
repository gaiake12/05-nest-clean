import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import {
  User as PrismaUser,
  Question as PrismaQuestion,
  Attachment as PrismaAttachment,
} from "@prisma/client";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";

type PrismaQuestionDetails = PrismaQuestion & {
  author: Pick<PrismaUser, "id" | "name">;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      questionId: new UniqueEntityID(raw.id),
      content: raw.content,
      authorId: new UniqueEntityID(raw.author.id),
      createdAt: raw.createdAt,
      author: raw.author.name,
      updatedAt: raw.updatedAt,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      title: raw.title,
      slug: Slug.create(raw.slug),
    });
  }
}
