import { TestingRepository } from './testing.repository';
import { Controller, Delete, HttpCode } from '@nestjs/common';

@Controller('testing')
export class TestingController {
  constructor(protected testingRepository: TestingRepository) {}

  @HttpCode(204)
  @Delete('all-data')
  async deleteAllBase() {
    await this.testingRepository.deleteAllCollection();
  }
}
