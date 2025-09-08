export class InvalidAttachmentType extends Error {
  constructor(type: string) {
    super(`File type ${type} is not valid`);
  }
}
