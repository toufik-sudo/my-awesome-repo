import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  targetType: string;

  @IsString()
  targetId: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsArray()
  media?: { id: string; type: string; url: string; thumbnail?: string }[];

  @IsOptional()
  @IsArray()
  mentions?: { userId: string; name: string; startIndex: number; endIndex: number }[];
}

export class UpdateCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  media?: { id: string; type: string; url: string; thumbnail?: string }[];
}
