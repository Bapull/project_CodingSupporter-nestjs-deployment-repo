import { PartialType } from '@nestjs/mapped-types';
import { CreateIncorrectNoteDto } from './create-incorrect-note.dto';

export class UpdateIncorrectNoteDto extends PartialType(CreateIncorrectNoteDto) {
  
}
