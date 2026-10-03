import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './database/message.entity.js';
import { DbService } from './database/db.service.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'test',
      password: 'test001',
      database: 'testdb',
      entities: [Message],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DbService],
})
export class AppModule {}
