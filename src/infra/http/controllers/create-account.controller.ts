import {
  ConflictException,
  HttpCode,
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { hash } from "bcryptjs";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import z from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";

const createAccountBodySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }

    const { student } = result.value;

    return student;
  }
}
