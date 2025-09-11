import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comment-with-author";
import { User as PrismaUser, Comment as PrismaComment } from "@prisma/client";

type PrismaCommentWithAuthor = Pick<
  PrismaComment,
  "id" | "content" | "createdAt" | "updatedAt"
> & {
  author: Pick<PrismaUser, "id" | "name">;
};

export class PrismaCommentWithAuthorMapper {
  static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
    return CommentWithAuthor.create({
      commentId: new UniqueEntityID(raw.id),
      content: raw.content,
      authorId: new UniqueEntityID(raw.author.id),
      createdAt: raw.createdAt,
      author: raw.author.name,
      updatedAt: raw.updatedAt,
    });
  }
}
