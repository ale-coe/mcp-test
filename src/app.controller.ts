import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { GetMessageDto } from './dto/get-message.dto.js';
import { GetUserIdDto } from './dto/get-user-id.dto.js';
import { PostPromptDto } from './dto/post-prompt.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('messages')
  getMessages(@Query() query: GetMessageDto) {
    return this.appService.getMessages(query);
  }

  @Delete('message/:messageId')
  deleteMessage(@Param('messageId') messageId: number) {
    return this.appService.deleteMessage(messageId);
  }

  @Get('userid')
  getUserIdByName(@Query() query: GetUserIdDto) {
    return this.appService.getUserIdByName(query.userName);
  }

  @Post('prompt')
  async postPrompt(@Body() body: PostPromptDto) {
    await this.appService.postPrompt(body);
  }
}
