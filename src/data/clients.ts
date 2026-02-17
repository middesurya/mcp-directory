export interface Client {
  id: string;
  name: string;
  description: string;
  icon: string;
  website: string;
  configPath: {
    macos: string;
    windows: string;
    linux: string;
  };
  configFormat: "standard" | "cline" | "continue";
  features: string[];
}

export const clients: Client[] = [
  {
    id: "claude-desktop",
    name: "Claude Desktop",
    description: "Anthropic's official desktop app for Claude AI with native MCP support",
    icon: "🤖",
    website: "https://claude.ai/download",
    configPath: {
      macos: "~/Library/Application Support/Claude/claude_desktop_config.json",
      windows: "%APPDATA%\\Claude\\claude_desktop_config.json",
      linux: "~/.config/Claude/claude_desktop_config.json",
    },
    configFormat: "standard",
    features: ["Native MCP support", "Desktop integration", "File access"],
  },
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor with built-in MCP integration for enhanced coding",
    icon: "⚡",
    website: "https://cursor.sh",
    configPath: {
      macos: "~/.cursor/mcp.json",
      windows: "%USERPROFILE%\\.cursor\\mcp.json",
      linux: "~/.cursor/mcp.json",
    },
    configFormat: "standard",
    features: ["Code completion", "AI chat", "Codebase context"],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "Codeium's AI IDE with powerful MCP server support",
    icon: "🏄",
    website: "https://codeium.com/windsurf",
    configPath: {
      macos: "~/.windsurf/mcp.json",
      windows: "%USERPROFILE%\\.windsurf\\mcp.json",
      linux: "~/.windsurf/mcp.json",
    },
    configFormat: "standard",
    features: ["Agentic AI", "Flows", "Multi-file editing"],
  },
  {
    id: "cline",
    name: "Cline",
    description: "Autonomous coding agent for VS Code with MCP capabilities",
    icon: "📝",
    website: "https://github.com/cline/cline",
    configPath: {
      macos: "VS Code Settings → Extensions → Cline → MCP Servers",
      windows: "VS Code Settings → Extensions → Cline → MCP Servers",
      linux: "VS Code Settings → Extensions → Cline → MCP Servers",
    },
    configFormat: "cline",
    features: ["Autonomous coding", "Terminal access", "Browser use"],
  },
  {
    id: "continue",
    name: "Continue",
    description: "Open-source AI code assistant for VS Code and JetBrains",
    icon: "▶️",
    website: "https://continue.dev",
    configPath: {
      macos: "~/.continue/config.json",
      windows: "%USERPROFILE%\\.continue\\config.json",
      linux: "~/.continue/config.json",
    },
    configFormat: "continue",
    features: ["Multi-model support", "Custom context", "IDE integration"],
  },
];

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id);
}

export function getAllClients(): Client[] {
  return clients;
}
