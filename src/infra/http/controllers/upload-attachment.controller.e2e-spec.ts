import { Test } from "@nestjs/testing";
import { StudentFactory } from "test/factories/make-student";
import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { DatabaseModule } from "@/infra/database/database.module";

describe("Updaload attachment (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, JwtService],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);

    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test("[POST] /attachments", async () => {
    const student = await studentFactory.makePrismaStudent();

    const accessToken = await jwt.signAsync({ sub: student.id.toString() });

    const response = await request(app.getHttpServer())
      .post("/attachments")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("file", "./test/e2e/sample-upload.jpg");

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
