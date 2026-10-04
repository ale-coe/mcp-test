# OLLAMA
- ollama run qwen3.5:0.8b

# MCP
- get all tools

curl --location 'http://localhost:3000/mcp' \
--header 'Accept: application/json,text/event-stream' \
--header 'Content-Type: application/json' \
--data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
}'

- example

curl --location 'http://localhost:3000/prompt' \
--header 'Content-Type: application/json' \
--data '{
    "prompt": "Show me every message Alice wrote"
}'