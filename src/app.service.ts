import { Injectable } from '@nestjs/common';
import { GetMessageDto } from './dto/get-message.dto.js';
import { DbService } from './database/db.service.js';
import { Between, FindOptionsWhere, LessThan, MoreThan } from 'typeorm';
import { Message } from './database/message.entity.js';

@Injectable()
export class AppService {
  constructor(private readonly dbService: DbService) {}

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

    return this.dbService.getRepo(Message).find({ where });
  }

  deleteMessage(id: number) {}
}
