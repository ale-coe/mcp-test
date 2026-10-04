import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './database/entities/message.entity.js';
import { DbService } from './database/db.service.js';
import {
  MCP_STRATEGY,
  McpStrategy,
  StreamableHttpTransport,
} from '@rekog/mcp-nest';
import { MCPController } from './mcp.controller.js';
import { User } from './database/entities/user.entity.js';
import { McpClientService } from './mcp-client.service.js';

export const mcp = new McpStrategy({
  name: 'my-mcp-server',
  version: '1.0.0',
  transports: [new StreamableHttpTransport()],
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'test',
      password: 'test001',
      database: 'testdb',
      entities: [Message, User],
      synchronize: true,
    }),
  ],
  controllers: [AppController, MCPController],
  providers: [
    AppService,
    DbService,
    McpClientService,
    { provide: MCP_STRATEGY, useValue: mcp },
  ],
})
export class AppModule {}
