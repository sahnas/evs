import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ExamsService } from './exam.service';
import { CreateExamDto } from './exam.dto';
import { Exam } from './exam.interface';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {
    const testData: Exam[] = [
      {
        student: { first_name: 'Isabella', last_name: 'S' },
        meeting_point: 'En attente',
        date: new Date().toISOString(),
        status: 'Recherche de place',
      },
      {
        student: { first_name: 'Franziska', last_name: 'S' },
        meeting_point: 'Martigues-B',
        date: '2024-06-16T14:00:00Z',
        status: 'Confirmé',
      },
      {
        student: { first_name: 'Lucas', last_name: 'R' },
        meeting_point: 'Martigues-B',
        date: '2024-06-21T17:00:00Z',
        status: 'A organiser',
      },
      {
        student: { first_name: 'Léo', last_name: 'C' },
        meeting_point: 'Martigues-B',
        date: '2024-05-26T13:00:00Z',
        status: 'Annulé',
      },
    ];

    testData.forEach((exam) => this.examsService.createExam(exam));
  }

  @Get()
  getExams(): Exam[] {
    return this.examsService.getExams();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  createExam(@Body() createExamDto: CreateExamDto): Exam {
    return this.examsService.createExam(createExamDto);
  }
}
