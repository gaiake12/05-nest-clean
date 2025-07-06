import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: error.format(),
          message: 'Validation failed',
          statusCode: 400,
        })
      }

      throw new BadRequestException('Validation faild')
    }

    return value
  }
}
