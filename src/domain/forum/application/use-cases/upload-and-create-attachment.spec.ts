import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";
import { InvalidAttachmentType } from "./errors/invalid-attachment-type";

describe("Upload and create attachment", () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
  let fakeUploader: FakeUploader;
  let sut: UploadAndCreateAttachmentUseCase;

  beforeAll(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader
    );
  });

  it("should be able to upload and create an attachment", async () => {
    const result = await sut.execute({
      fileName: "profile.png",
      fileType: "image/png",
      body: Buffer.from("test"),
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });

    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: "profile.png",
        url: expect.any(String),
      })
    );
  });

  it("should not be able to upload an attachment with an invalid file type", async () => {
    const result = await sut.execute({
      fileName: "profile.mp3",
      fileType: "audio/mpeg",
      body: Buffer.from(""),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
