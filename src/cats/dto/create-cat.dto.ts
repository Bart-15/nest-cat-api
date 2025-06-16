import { IsString, IsInt, MinLength } from 'class-validator';

export class CreateCatDto {
  @MinLength(3)
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
