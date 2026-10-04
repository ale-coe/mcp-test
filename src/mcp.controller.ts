import { McpController, Tool, McpContext } from '@rekog/mcp-nest';
import { Ctx, Payload } from '@nestjs/microservices';
import { z } from 'zod';
import { Logger } from '@nestjs/common';
import { AppService } from './app.service.js';

// get someone's messages (get userid from name, get messages via userid)
// get all messages between 2 dates
// delete my messages

@McpController()
export class MCPController {
  private readonly logger = new Logger(McpController.name);

  constructor(private readonly appService: AppService) {}

  @Tool({
    name: 'greeting-tool',
    description: 'Returns a greeting with progress updates',
    parameters: z.object({ name: z.string().default('World') }),
  })
  async sayHello(@Payload() { name }: { name: string }) {
    const text = `Hello, ${name}, nice to meet you!`;
    this.logger.debug(`Received name ${name}, responding with: ${text}`);
    return { content: [{ type: 'text', text }] };
  }

  @Tool({
    name: 'get-user-id-by-user-name',
    description: 'Returns the userId of a user for a given userName',
    parameters: z.object({ userName: z.string() }),
    outputSchema: z.object({ userId: z.number().nullable() }),
  })
  async getUserIdByUserName(@Payload() { userName }: { userName: string }) {
    try {
      const result = await this.appService.getUserIdByName(userName);
      this.logger.debug(
        `Found userId ${result.userId} for userName ${userName}`,
      );
      return { userId: result.userId };
    } catch (error) {
      this.logger.error(`Found no userId for userName ${userName}`);
      return { userId: null };
    }
  }

  @Tool({
    name: 'get-messages-for-user-by-user-id',
    description: 'Returns all messages for a given userId',
    parameters: z.object({ userId: z.number() }),
    // outputSchema: z.array(
    //   z.object({ content: z.string(), releaseDate: z.date() }),
    // ),
  })
  async getMessagesForUserByUserId(@Payload() { userId }: { userId: number }) {
    const result = await this.appService.getMessages({ userId });
    this.logger.debug(`Found ${result.length} messages for userId ${userId}`);
    return result;
  }
}
