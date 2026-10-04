import { IsString } from 'class-validator';

export class PostPromptDto {
  @IsString()
  prompt: string;
}
