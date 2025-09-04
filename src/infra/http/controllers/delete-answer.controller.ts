import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt-strategy";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private readonly deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const result = await this.deleteAnswer.execute({
      authorId: user.sub,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
