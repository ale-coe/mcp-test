import { McpController, Tool, McpContext } from '@rekog/mcp-nest';
import { Ctx, Payload } from '@nestjs/microservices';
import { z } from 'zod';
import { Logger } from '@nestjs/common';

// get alex's messages (get userid from name, get messages via userid)
// get all messages between 2 dates
// delete my messages

@McpController()
export class MCPController {
  constructor(private readonly logger: Logger) {}

  @Tool({
    name: 'greeting-tool',
    description: 'Returns a greeting with progress updates',
    parameters: z.object({ name: z.string().default('World') }),
  })
  async sayHello(@Payload() { name }: { name: string }) {
    const text = `Hello, ${name}, nice to meet you!`;
    this.logger.log(`Received name ${name}, responding with: ${text}`);
    return { content: [{ type: 'text', text }] };
  }
}
