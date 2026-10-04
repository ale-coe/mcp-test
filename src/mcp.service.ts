import { Injectable } from '@nestjs/common';
import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client';
import ollama, { type Message, type Tool } from 'ollama';

@Injectable()
export class McpService {
  async makeMcpCall(prompt: string) {
    const transport = this.getTransport();
    const mcpClient = await this.getMcpClient(transport);
    const messages = this.getMessages(prompt);
    const tools = await this.getTools(mcpClient);

    try {
      for (let round = 0; round < 2; round++) {
        const response = await ollama.chat({
          model: 'qwen3.5:0.8b',
          messages,
          tools,
          stream: false,
          think: true,
        });

        const assistantMessage = response.message;

        const toolCalls = assistantMessage.tool_calls ?? [];
        if (toolCalls.length === 0) {
          console.log('62 Qwen:', assistantMessage.content);
          break;
        }

        for (const call of toolCalls) {
          const { name, arguments: args } = call.function;

          const result = await mcpClient.callTool({
            name,
            arguments: args,
          });

          console.log(result);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      await transport.terminateSession().catch(() => {});
      await mcpClient.close();
    }
  }

  private getTransport() {
    return new StreamableHTTPClientTransport(
      new URL('http://localhost:3000/mcp'),
    );
  }

  private async getMcpClient(transport: StreamableHTTPClientTransport) {
    const mcpClient = new Client({
      name: 'local-qwen-agent',
      version: '1.0.0',
    });

    await mcpClient.connect(transport);

    return mcpClient;
  }

  private async getTools(mcpClient: Client): Promise<Tool[]> {
    const { tools } = await mcpClient.listTools();

    return tools.map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description ?? '',
        parameters: tool.inputSchema as Tool['function']['parameters'],
      },
    }));
  }

  private getMessages(prompt: string): Message[] {
    return [
      {
        role: 'user',
        content: 'Greet a random name you came up with',
      },
    ];
  }
}
