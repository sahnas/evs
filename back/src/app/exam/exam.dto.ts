import {
  IsString,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StudentDto {
  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;
}

export class CreateExamDto {
  @ValidateNested()
  @Type(() => StudentDto)
  @IsNotEmpty()
  student!: StudentDto;

  @IsString()
  meeting_point?: string;

  @IsDateString()
  date?: string;

  @IsEnum(['A organiser', 'Annulé', 'Recherche de place', 'Confirmé'])
  status?: 'A organiser' | 'Annulé' | 'Recherche de place' | 'Confirmé' =
    'A organiser';
}
