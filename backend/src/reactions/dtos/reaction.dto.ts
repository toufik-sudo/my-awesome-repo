import { IsString } from 'class-validator';

export class CreateReactionDto {
  @IsString()
  type: string; // 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry'

  @IsString()
  targetType: string; // 'comment', 'post', etc.

  @IsString()
  targetId: string;
}
