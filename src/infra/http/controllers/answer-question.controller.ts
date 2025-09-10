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
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";

const answerQuestionBodySchema = z.object({
  content: z.string(),
  attachments: z.array(z.string().uuid()).default([]),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @Param("questionId") questionId: string,
    @Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, attachments } = body;
    const userId = user.sub;

    const result = await this.answerQuestion.execute({
      authorId: userId,
      questionId,
      content,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
