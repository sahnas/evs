import { Module } from '@nestjs/common';

import { ExamsController } from './exam/exam.controller';
import { ExamsService } from './exam/exam.service';

@Module({
  imports: [],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class AppModule {}
