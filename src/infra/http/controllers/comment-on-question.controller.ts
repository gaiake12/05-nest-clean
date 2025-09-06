import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import z from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @Param("questionId") questionId: string,
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.commentOnQuestion.execute({
      authorId: userId,
      questionId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
