import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";
import { DomainEvents } from "@/core/events/domain-events";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";

export class InMemoryStudentsRepository implements StudentsRepository {
  public items: Student[] = [];

  async create(student: Student) {
    this.items.push(student);

    DomainEvents.dispatchEventsForAggregate(student.id);
  }

  async findByEmail(email: string) {
    const student = this.items.find((item) => {
      return item.email === email;
    });

    if (!student) {
      return null;
    }

    return student;
  }
}
