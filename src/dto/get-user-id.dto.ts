import { IsString } from 'class-validator';

export class GetUserIdDto {
  @IsString()
  userName: string;
}
