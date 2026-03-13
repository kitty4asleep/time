import { Server } from “@modelcontextprotocol/sdk/server/index.js”;
import { SSEServerTransport } from “@modelcontextprotocol/sdk/server/sse.js”;
import express from “express”;

const app = express();
const PORT = process.env.PORT || 3000;

app.get(”/sse”, async (req, res) => {
const transport = new SSEServerTransport(”/message”, res);
const server = new Server(
{
name: “time-server”,
version: “1.0.0”,
},
{
capabilities: {
tools: {},
},
}
);

server.setRequestHandler(“tools/list”, async () => {
return {
tools: [
{
name: “get_time”,
description: “Get current time”,
inputSchema: {
type: “object”,
properties: {}
}
}
]
};
});

server.setRequestHandler(“tools/call”, async (request) => {
const { name } = request.params;

```
if (name === "get_time") {
  const now = new Date();
  return {
    content: [{
      type: "text",
      text: `Current time: ${now.toISOString()}\nBeijing time: ${now.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`
    }]
  };
}

return {
  content: [{
    type: "text",
    text: "Unknown tool"
  }],
  isError: true
};
```

});

await server.connect(transport);
});

app.post(”/message”, express.json(), (req, res) => {
res.status(200).end();
});

app.get(”/”, (req, res) => {
res.json({ status: “ok”, message: “Time MCP server running” });
});

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
