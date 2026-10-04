import { Injectable, Logger } from '@nestjs/common';
import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client';
import ollama, { type Message, type Tool } from 'ollama';

@Injectable()
export class McpClientService {
  private readonly logger = new Logger(McpClientService.name);

  async makeMcpCall(prompt: string) {
    const transport = this.getTransport();
    const mcpClient = await this.getMcpClient(transport);
    const messages = this.getMessages(prompt);
    const tools = await this.getTools(mcpClient);

    this.logger.debug(`Found tools: ${tools.map((t) => t.function.name)}`);

    try {
      // the amount of rounds is how many back and forth messaging there is
      for (let round = 0; round < 4; round++) {
        const response = await ollama.chat({
          model: 'qwen3.5:0.8b',
          messages,
          tools,
          stream: false,
          think: true,
        });
        messages.push(response.message);

        const toolCalls = response.message.tool_calls ?? [];
        if (toolCalls.length === 0) {
          this.logger.debug(
            `No further tool calls found, final message: ${response.message.content}`,
          );
          return response.message.content;
        }

        this.logger.debug(
          `Tools to call: ${toolCalls.map((t) => t.function.name)}`,
        );
        for (const call of toolCalls) {
          const { name, arguments: args } = call.function;
          const result = await mcpClient.callTool({
            name,
            arguments: args,
          });
          messages.push({
            role: 'tool',
            tool_name: name,
            content: JSON.stringify({
              isError: result.isError ?? false,
              content: result.content,
              structuredContent: result.structuredContent,
            }),
          });

          this.logger.debug(
            `Called tool: ${name}, result: ${JSON.stringify(result)}`,
          );
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
    this.logger.debug(`Prompting with: '${prompt}'`);
    return [
      {
        role: 'system',
        content: `You are an assistant operating within an MCP (Model Context Protocol) workflow.
The result returned by the most recent tool call contains the data the user is interested in.
Your primary responsibility is to pass this result through to the user as your final assistant message.

Follow these rules strictly:
1) Treat the output of the last successfully completed tool call as the authoritative response.
2) Preserve the original structured data, including all fields, values, data types, arrays, objects, and nesting.
3) Do not summarize, reinterpret, simplify, truncate, or omit any data.
4) Do not convert structured data into natural language.
5) If the tool returns JSON, return the JSON directly, preserving its structure and validity.
6) Do not add introductory text, explanations, conclusions, or Markdown code fences around the result.
7) Exclude MCP protocol metadata that is not part of the actual data payload.
8) Your final assistant message MUST contain only the structured result from the last tool call.

The goal is lossless delivery of the tool result to the user, not generating a conversational response.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];
  }
}
