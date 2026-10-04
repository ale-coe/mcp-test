import {
  Client,
  StreamableHTTPClientTransport,
} from '@modelcontextprotocol/client';
import ollama, { type Message, type Tool } from 'ollama';

const mcp = new Client({
  name: 'local-qwen-agent',
  version: '1.0.0',
});

const transport = new StreamableHTTPClientTransport(
  new URL('http://localhost:3000/mcp'),
);



try {
  const { tools } = await mcp.listTools();
  console.log(tools);
  console.log('----------------------------------------');
  const ollamaTools: Tool[] = tools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description ?? '',
      parameters: tool.inputSchema as Tool['function']['parameters'],
    },
  }));

  const messages: Message[] = [
    {
      role: 'user',
      content:
        'Greet a random name you came up with, as a result tell me the ascii representation that you received in the following format: "{no: ASCII_REPRESENTATION}"',
    },
  ];

  for (let round = 0; round < 2; round++) {
    console.log(`${round + 1}round`);
    // console.log(ollamaTools);
    // console.log('----------------------------------------');
    const response = await ollama.chat({
      model: 'qwen3.5:0.8b',
      messages,
      tools: ollamaTools,
      stream: false,
      // think: false,
    });

    // console.log(response);
    // console.log('----------------------------------------');
    const assistantMessage = response.message;

    // Preserve the assistant's message, including
    // any tool calls it requested.
    messages.push(assistantMessage);

    console.log(response.message);
    const toolCalls = assistantMessage.tool_calls ?? [];
    // console.log('62 Qwen:', assistantMessage.content);
    // No tool calls -> model has produced its final answer.
    if (toolCalls.length === 0) {
      //   console.log('62 Qwen:', assistantMessage.content);
      break;
    }

    // 6. Execute requested tools through the MCP client.

    for (const call of toolCalls) {
      console.log(`calling tool`);
      const { name, arguments: args } = call.function;

      console.log('Executing MCP tool:', name, args);

      // Only allow advertised tools.
      if (!tools.some((t) => t.name === name)) {
        throw new Error(`Unknown MCP tool: ${name}`);
      }

      const result = await mcp.callTool({
        name,
        arguments: args,
      });

      console.log(result);

      // 7. Feed the tool result back into the conversation.
      // Include the error status so Qwen can distinguish
      // failed execution from successful results.

      messages.push({
        role: 'tool',
        tool_name: name,
        content: JSON.stringify({
          isError: result.isError ?? false,
          content: result.content,
          structuredContent: result.structuredContent,
        }),
      });
    }

    // The loop now calls Qwen again with the additional
    // tool-result messages.
  }
} catch (error) {
  console.error(error);
} finally {
  await transport.terminateSession().catch(() => {});
  await mcp.close();
}
