import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateIncorrectNoteDto{
  @IsInt()
  mentoId:  number;
  @IsInt()
  studentId: number;
  @IsInt()
  errorType: number; 
  @IsString()
  language: string;
  @IsString()
  noteName: string;
  @IsString()
  chatName: string;
}
