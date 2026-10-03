import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service.js';
import { GetMessageDto } from './dto/get-message.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('messages')
  getMessages(@Query() query: GetMessageDto) {
    return this.appService.getMessages(query);
  }

  @Delete('message/:id')
  deleteMessage(@Param('id') id: number) {
    return this.appService.deleteMessage(id);
  }
}
