import { Test, TestingModule } from '@nestjs/testing';
import { ExamsService } from './exam.service';
import { CreateExamDto } from './exam.dto';

describe('ExamsService', () => {
  let service: ExamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamsService],
    }).compile();

    service = module.get<ExamsService>(ExamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getExams', () => {
    it('should return an empty array by default', () => {
      const result = service.getExams();
      expect(result).toEqual([]);
    });

    it('should return all exams after creating some', () => {
      const exam1: CreateExamDto = {
        student: { first_name: 'John', last_name: 'Doe' },
      };
      const exam2: CreateExamDto = {
        student: { first_name: 'Jane', last_name: 'Smith' },
        status: 'Confirmé',
      };

      service.createExam(exam1);
      service.createExam(exam2);

      const result = service.getExams();
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('A organiser');
      expect(result[1].status).toBe('Confirmé');
    });
  });

  describe('createExam', () => {
    it('should create a new exam with required fields only', () => {
      const examDto: CreateExamDto = {
        student: { first_name: 'John', last_name: 'Doe' },
      };

      const result = service.createExam(examDto);
      expect(result).toBeDefined();
      expect(result.student).toEqual(examDto.student);
      expect(result.status).toBe('A organiser');
    });

    it('should create a new exam with all fields', () => {
      const examDto: CreateExamDto = {
        student: { first_name: 'John', last_name: 'Doe' },
        meeting_point: 'Paris',
        date: '2024-03-01T10:00:00Z',
        status: 'Confirmé',
      };

      const result = service.createExam(examDto);
      expect(result).toEqual(examDto);
    });

    it('should add the exam to the list', () => {
      const examDto: CreateExamDto = {
        student: { first_name: 'John', last_name: 'Doe' },
      };

      service.createExam(examDto);
      const allExams = service.getExams();

      expect(allExams).toHaveLength(1);
      expect(allExams[0].student).toEqual(examDto.student);
      expect(allExams[0].status).toBe('A organiser');
    });
  });
});
