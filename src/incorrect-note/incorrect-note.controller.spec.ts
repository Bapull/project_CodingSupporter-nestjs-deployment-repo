import { Test, TestingModule } from '@nestjs/testing';
import { IncorrectNoteController } from './incorrect-note.controller';
import { IncorrectNoteService } from './incorrect-note.service';

describe('IncorrectNoteController', () => {
  let controller: IncorrectNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncorrectNoteController],
      providers: [IncorrectNoteService],
    }).compile();

    controller = module.get<IncorrectNoteController>(IncorrectNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
