import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import z from "zod";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";

const editAnswerBodySchema = z.object({
  content: z.string(),
  attachmentsIds: z.array(z.string()).default([]),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);
type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { content, attachmentsIds } = body;

    const result = await this.editAnswer.execute({
      authorId: user.sub,
      answerId,
      content,
      attachmentsIds,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
