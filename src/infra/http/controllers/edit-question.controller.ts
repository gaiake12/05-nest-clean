import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UsePipes,
} from "@nestjs/common";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") questionId: string,
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      questionId,
      authorId: userId,
      title,
      content,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
