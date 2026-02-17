"use client";

import { useState } from "react";
import { Check, Copy, Monitor, Apple, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ConfigGeneratorProps {
  serverId: string;
  serverName: string;
  npmPackage?: string | null;
}

type ClientType = "claude-desktop" | "cursor" | "windsurf" | "cline" | "continue";
type OsType = "macos" | "windows" | "linux";

const clients: { id: ClientType; name: string; icon: string }[] = [
  { id: "claude-desktop", name: "Claude Desktop", icon: "🤖" },
  { id: "cursor", name: "Cursor", icon: "⚡" },
  { id: "windsurf", name: "Windsurf", icon: "🏄" },
  { id: "cline", name: "Cline (VS Code)", icon: "📝" },
  { id: "continue", name: "Continue (VS Code)", icon: "▶️" },
];

const configPaths: Record<ClientType, Record<OsType, string>> = {
  "claude-desktop": {
    macos: "~/Library/Application Support/Claude/claude_desktop_config.json",
    windows: "%APPDATA%\\Claude\\claude_desktop_config.json",
    linux: "~/.config/Claude/claude_desktop_config.json",
  },
  cursor: {
    macos: "~/.cursor/mcp.json",
    windows: "%USERPROFILE%\\.cursor\\mcp.json",
    linux: "~/.cursor/mcp.json",
  },
  windsurf: {
    macos: "~/.windsurf/mcp.json",
    windows: "%USERPROFILE%\\.windsurf\\mcp.json",
    linux: "~/.windsurf/mcp.json",
  },
  cline: {
    macos: "VS Code Settings → Extensions → Cline → MCP Servers",
    windows: "VS Code Settings → Extensions → Cline → MCP Servers",
    linux: "VS Code Settings → Extensions → Cline → MCP Servers",
  },
  continue: {
    macos: "~/.continue/config.json",
    windows: "%USERPROFILE%\\.continue\\config.json",
    linux: "~/.continue/config.json",
  },
};

function generateConfig(
  client: ClientType,
  serverId: string,
  npmPackage?: string | null
): string {
  const packageName = npmPackage || `@modelcontextprotocol/server-${serverId}`;

  if (client === "cline") {
    // Cline uses a different format in VS Code settings
    return JSON.stringify(
      {
        "cline.mcpServers": {
          [serverId]: {
            command: "npx",
            args: ["-y", packageName],
          },
        },
      },
      null,
      2
    );
  }

  if (client === "continue") {
    // Continue has its own config format
    return JSON.stringify(
      {
        mcpServers: [
          {
            name: serverId,
            command: "npx",
            args: ["-y", packageName],
          },
        ],
      },
      null,
      2
    );
  }

  // Standard format for Claude Desktop, Cursor, Windsurf
  return JSON.stringify(
    {
      mcpServers: {
        [serverId]: {
          command: "npx",
          args: ["-y", packageName],
        },
      },
    },
    null,
    2
  );
}

export function ConfigGenerator({
  serverId,
  serverName,
  npmPackage,
}: ConfigGeneratorProps) {
  const [selectedClient, setSelectedClient] = useState<ClientType>("claude-desktop");
  const [selectedOs, setSelectedOs] = useState<OsType>("macos");
  const [copied, setCopied] = useState(false);

  const config = generateConfig(selectedClient, serverId, npmPackage);
  const configPath = configPaths[selectedClient][selectedOs];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Client & OS Selection */}
      <div className="flex flex-wrap gap-3">
        <Select
          value={selectedClient}
          onValueChange={(value) => setSelectedClient(value as ClientType)}
        >
          <SelectTrigger className="w-[180px] bg-muted/50 border-border/50">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                <span className="flex items-center gap-2">
                  <span>{client.icon}</span>
                  <span>{client.name}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex rounded-lg border border-border/50 bg-muted/50 p-1">
          <button
            onClick={() => setSelectedOs("macos")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedOs === "macos"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Apple className="h-3.5 w-3.5" />
            macOS
          </button>
          <button
            onClick={() => setSelectedOs("windows")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedOs === "windows"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Monitor className="h-3.5 w-3.5" />
            Windows
          </button>
          <button
            onClick={() => setSelectedOs("linux")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              selectedOs === "linux"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            Linux
          </button>
        </div>
      </div>

      {/* Config Path */}
      <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground mb-1">Config file location:</p>
        <code className="text-sm font-mono text-primary break-all">{configPath}</code>
      </div>

      {/* Config Code Block */}
      <div className="relative">
        <div className="overflow-hidden rounded-lg border border-border bg-zinc-950">
          <div className="flex items-center justify-between border-b border-border/50 bg-zinc-900/50 px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              {selectedClient === "cline" ? "settings.json" : "config.json"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-7 gap-1.5 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="overflow-x-auto p-4 text-sm">
            <code className="font-mono text-zinc-100">{config}</code>
          </pre>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Step 1:</strong> Copy the configuration above
        </p>
        <p>
          <strong>Step 2:</strong>{" "}
          {selectedClient === "cline"
            ? "Open VS Code Settings, search for 'Cline MCP', and paste"
            : `Open or create the config file at the path shown above`}
        </p>
        <p>
          <strong>Step 3:</strong> Merge with existing config (add to mcpServers object) or replace if new
        </p>
        <p>
          <strong>Step 4:</strong> Restart your {clients.find((c) => c.id === selectedClient)?.name} application
        </p>
      </div>
    </div>
  );
}
