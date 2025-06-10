import { MinLength } from 'class-validator';

export class CreateCatDto {
  @MinLength(3)
  name: string;

  color: string;
}
