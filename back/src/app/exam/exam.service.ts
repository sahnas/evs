import { Injectable } from '@nestjs/common';
import { Exam } from './exam.interface';
import { CreateExamDto } from './exam.dto';

@Injectable()
export class ExamsService {
  private exams: Exam[] = [];

  getExams(): Exam[] {
    return this.exams;
  }

  createExam(createExamDto: CreateExamDto): Exam {
    const exam: Exam = {
      ...createExamDto,
      status: createExamDto.status || 'A organiser',
    };
    this.exams.push(exam);
    return exam;
  }
}
