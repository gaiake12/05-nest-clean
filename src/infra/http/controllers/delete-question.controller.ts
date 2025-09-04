import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { UserPayload } from "@/infra/auth/jwt-strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private readonly deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @Param("id") questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      questionId,
      authorId: userId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
