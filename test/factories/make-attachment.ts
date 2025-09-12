import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID
) {
  return Attachment.create({
    title: faker.lorem.sentence(),
    url: faker.internet.url(),
    ...override,
  });
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAttachment(override: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(override);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
