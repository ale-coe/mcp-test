import { Injectable, NotFoundException } from '@nestjs/common';
import { Between, FindOptionsWhere, LessThan, MoreThan } from 'typeorm';
import { DbService } from './database/db.service.js';
import { Message } from './database/entities/message.entity.js';
import { User } from './database/entities/user.entity.js';
import { GetMessageDto } from './dto/get-message.dto.js';
import { PostPromptDto } from './dto/post-prompt.dto.js';
import { McpService } from './mcp.service.js';

@Injectable()
export class AppService {
  constructor(
    private readonly dbService: DbService,
    private readonly mcpService: McpService,
  ) {}

  getMessages(query: GetMessageDto) {
    const where: FindOptionsWhere<Message> = {
      ...(query.userId ? { userId: query.userId } : {}),
      ...(query.startDate && query.endDate
        ? { releaseDate: Between(query.startDate, query.endDate) }
        : {}),
      ...(query.startDate && !query.endDate
        ? { releaseDate: MoreThan(query.startDate) }
        : {}),
      ...(!query.startDate && query.endDate
        ? { releaseDate: LessThan(query.endDate) }
        : {}),
    };

    return this.dbService.getRepo(Message).find({
      select: { content: true, releaseDate: true },
      where: { ...where, deleted: false },
    });
  }

  deleteMessage(messageId: number) {
    this.dbService.getRepo(Message).update({ messageId }, { deleted: true });
  }

  async getUserIdByName(name: string) {
    const user = await this.dbService
      .getRepo(User)
      .findOne({ select: { userId: true }, where: { name } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async postPrompt(body: PostPromptDto) {
    await this.mcpService.makeMcpCall(body.prompt);
  }
}
