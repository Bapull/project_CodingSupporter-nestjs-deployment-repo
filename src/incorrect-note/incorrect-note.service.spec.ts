import { Test, TestingModule } from '@nestjs/testing';
import { IncorrectNoteService } from './incorrect-note.service';

describe('IncorrectNoteService', () => {
  let service: IncorrectNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IncorrectNoteService],
    }).compile();

    service = module.get<IncorrectNoteService>(IncorrectNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
