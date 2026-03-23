import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Res,
  Req,
  UseGuards,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { AnswerRequestDto } from './dtos/request/answer.request.dto';
import { AnswerResponseDto } from './dtos/response/answer.response.dto';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CsrfInterceptor } from '@tekuconcept/nestjs-csrf';
import { AppService } from './app.service';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Controller()
@UseInterceptors(CsrfInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInitHello(): string {
    return this.appService.getHello();
  }

  // @Get('users')
  // @UseGuards(AuthGuard('jwt'), RolesGuard)
  // @Roles('admin')
  getHello(
    // @Param('id') id,
    // @Query('name') name,
    // @Query('age') age,
    @Req() req,
    @Res() res,
  ) {
    // const data = `User with ID ${id} and Name : ${name} and Age: ${age}`;
    const data = `User with ID `;
    res.status(200).json({
      data: data,
    });
  }

  // @Post('/answer')
  // answerQuestion(
  //   @Body() answerRequestDto: AnswerRequestDto,
  // ): AnswerResponseDto {
  //   return {
  //     answer: answerRequestDto.answer,
  //   };
  // }
}
