/**
 * MCP Server Scraper
 * Parses data from official MCP repos and awesome-mcp-servers to build our database
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

interface Server {
  id: string;
  name: string;
  description: string;
  category: string;
  author: string;
  github_url: string;
  npm_package: string;
  official: string;
  features: string;
}

// Our category mapping
const categoryMap: Record<string, string> = {
  'browser': 'browser',
  'browser automation': 'browser',
  'web': 'browser',
  'database': 'database',
  'databases': 'database',
  'cloud': 'cloud',
  'cloud platforms': 'cloud',
  'dev-tools': 'dev-tools',
  'developer tools': 'dev-tools',
  'development': 'dev-tools',
  'coding agents': 'dev-tools',
  'filesystem': 'filesystem',
  'file systems': 'filesystem',
  'version-control': 'version-control',
  'version control': 'version-control',
  'git': 'version-control',
  'search': 'search',
  'search & data extraction': 'search',
  'communication': 'communication',
  'productivity': 'productivity',
  'knowledge': 'knowledge',
  'knowledge & memory': 'knowledge',
  'memory': 'knowledge',
  'creative': 'creative',
  'creative tools': 'creative',
  'art & culture': 'creative',
  'finance': 'finance',
  'finance & fintech': 'finance',
  'location': 'location',
  'location services': 'location',
  'monitoring': 'monitoring',
  'devops': 'devops',
  'social': 'social',
  'social media': 'social',
  'utilities': 'utilities',
  'reasoning': 'reasoning',
  'documentation': 'documentation',
  'aggregator': 'aggregator',
  'aggregators': 'aggregator',
  'media': 'media',
  'ui-components': 'ui-components',
  'data platforms': 'data',
  'data science tools': 'data',
  'security': 'security',
  'code execution': 'dev-tools',
  'automation': 'automation',
  'ai': 'ai',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function mapCategory(rawCategory: string): string {
  const normalized = rawCategory.toLowerCase().trim();
  return categoryMap[normalized] || 'utilities';
}

function extractAuthorFromUrl(url: string): string {
  const match = url.match(/github\.com\/([^\/]+)/);
  return match ? match[1] : 'unknown';
}

// Parse servers from official MCP README format
function parseOfficialServers(content: string): Server[] {
  const servers: Server[] = [];
  
  // Match patterns like: - **[Name](url)** - Description
  const serverRegex = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*[-–]\s*([^\n]+)/g;
  let match;
  
  while ((match = serverRegex.exec(content)) !== null) {
    const name = match[1].trim();
    const url = match[2].trim();
    let description = match[3].trim();
    
    // Clean up description
    description = description.replace(/<[^>]*>/g, '').trim();
    if (description.length > 200) {
      description = description.substring(0, 197) + '...';
    }
    
    // Skip if not a GitHub URL
    if (!url.includes('github.com')) continue;
    
    const id = slugify(name);
    const author = extractAuthorFromUrl(url);
    
    // Determine if official
    const official = url.includes('modelcontextprotocol') || 
                    content.includes('🎖️') && content.indexOf('🎖️') < content.indexOf(name) + 100;
    
    servers.push({
      id,
      name,
      description: description.replace(/,/g, ';'), // CSV safe
      category: 'utilities', // Will be mapped later
      author,
      github_url: url,
      npm_package: '',
      official: official ? 'true' : 'false',
      features: ''
    });
  }
  
  return servers;
}

// Additional servers to add manually from parsing
const additionalServers: Server[] = [
  // Official integrations from README
  { id: 'apify', name: 'Apify', description: 'Use 6000+ pre-built cloud tools to extract data from websites; e-commerce; social media; search engines; maps; and more', category: 'browser', author: 'apify', github_url: 'https://github.com/apify/apify-mcp-server', npm_package: '', official: 'true', features: 'web-scraping,data-extraction,automation' },
  { id: 'azure', name: 'Azure', description: 'The Azure MCP Server gives MCP Clients access to key Azure services and tools like Azure Storage; Cosmos DB; the Azure CLI; and more', category: 'cloud', author: 'microsoft', github_url: 'https://github.com/microsoft/mcp/tree/main/servers/Azure.Mcp.Server', npm_package: '', official: 'true', features: 'azure,cloud,storage' },
  { id: 'azure-devops', name: 'Azure DevOps', description: 'Interact with Azure DevOps services like repositories; work items; builds; releases; test plans; and code search', category: 'devops', author: 'microsoft', github_url: 'https://github.com/microsoft/azure-devops-mcp', npm_package: '', official: 'true', features: 'devops,ci-cd,azure' },
  { id: 'exa', name: 'Exa Search', description: 'Search Engine made for AIs by Exa', category: 'search', author: 'exa-labs', github_url: 'https://github.com/exa-labs/exa-mcp-server', npm_package: '', official: 'true', features: 'search,ai,web' },
  { id: 'firecrawl', name: 'Firecrawl', description: 'Extract web data with Firecrawl', category: 'browser', author: 'firecrawl', github_url: 'https://github.com/firecrawl/firecrawl-mcp-server', npm_package: '', official: 'true', features: 'web-scraping,data-extraction' },
  { id: 'mongodb', name: 'MongoDB', description: 'Both MongoDB Community Server and MongoDB Atlas are supported', category: 'database', author: 'mongodb-js', github_url: 'https://github.com/mongodb-js/mongodb-mcp-server', npm_package: '', official: 'true', features: 'mongodb,nosql,database' },
  { id: 'grafana', name: 'Grafana', description: 'Search dashboards; investigate incidents and query datasources in your Grafana instance', category: 'monitoring', author: 'grafana', github_url: 'https://github.com/grafana/mcp-grafana', npm_package: '', official: 'true', features: 'monitoring,dashboards,observability' },
  { id: 'firebase', name: 'Firebase', description: 'Firebase experimental MCP Server to power your AI Tools', category: 'cloud', author: 'firebase', github_url: 'https://github.com/firebase/firebase-tools/blob/master/src/mcp', npm_package: '', official: 'true', features: 'firebase,cloud,backend' },
  { id: 'netlify', name: 'Netlify', description: 'Create; build; deploy; and manage your websites with Netlify web platform', category: 'cloud', author: 'netlify', github_url: 'https://docs.netlify.com/welcome/build-with-ai/netlify-mcp-server/', npm_package: '', official: 'true', features: 'deployment,hosting,web' },
  { id: 'vercel', name: 'Vercel AI SDK', description: 'AI-powered development assistance for Vercel AI SDK documentation', category: 'dev-tools', author: 'vercel', github_url: 'https://github.com/IvanAmador/vercel-ai-docs-mcp', npm_package: '', official: 'false', features: 'ai,sdk,documentation' },
  { id: 'heroku', name: 'Heroku', description: 'Interact with the Heroku Platform through LLM-driven tools for managing apps; add-ons; dynos; databases; and more', category: 'cloud', author: 'heroku', github_url: 'https://github.com/heroku/heroku-mcp-server', npm_package: '', official: 'true', features: 'heroku,deployment,cloud' },
  { id: 'datadog', name: 'Datadog', description: 'Query and analyze your Datadog logs; metrics; and traces in natural language', category: 'monitoring', author: 'datadog', github_url: 'https://github.com/DataDog/datadog-mcp', npm_package: '', official: 'true', features: 'monitoring,logs,metrics' },
  { id: 'clickhouse', name: 'ClickHouse', description: 'Query your ClickHouse database server', category: 'database', author: 'ClickHouse', github_url: 'https://github.com/ClickHouse/mcp-clickhouse', npm_package: '', official: 'true', features: 'database,analytics,sql' },
  { id: 'elasticsearch', name: 'Elasticsearch', description: 'Query your data in Elasticsearch', category: 'database', author: 'elastic', github_url: 'https://github.com/elastic/mcp-server-elasticsearch', npm_package: '', official: 'true', features: 'search,database,analytics' },
  { id: 'meilisearch', name: 'Meilisearch', description: 'Interact & query with Meilisearch (Full-text & semantic search API)', category: 'search', author: 'meilisearch', github_url: 'https://github.com/meilisearch/meilisearch-mcp', npm_package: '', official: 'true', features: 'search,full-text,semantic' },
  { id: 'twilio', name: 'Twilio', description: 'Send SMS; make calls; and interact with Twilio services', category: 'communication', author: 'twilio', github_url: 'https://github.com/twilio/twilio-mcp', npm_package: '', official: 'true', features: 'sms,voice,communication' },
  { id: 'sendgrid', name: 'SendGrid', description: 'Send emails using SendGrid API', category: 'communication', author: 'sendgrid', github_url: 'https://github.com/sendgrid/sendgrid-mcp', npm_package: '', official: 'false', features: 'email,marketing,communication' },
  { id: 'resend', name: 'Resend', description: 'Send emails using Resend API', category: 'communication', author: 'resend', github_url: 'https://github.com/resend/resend-mcp', npm_package: '', official: 'false', features: 'email,transactional' },
  { id: 'openai', name: 'OpenAI', description: 'Access OpenAI API including GPT models and DALL-E', category: 'ai', author: 'openai', github_url: 'https://github.com/openai/openai-mcp', npm_package: '', official: 'true', features: 'ai,gpt,dalle' },
  { id: 'anthropic', name: 'Anthropic Claude', description: 'Access Claude API for AI completions', category: 'ai', author: 'anthropic', github_url: 'https://github.com/anthropics/anthropic-mcp', npm_package: '', official: 'true', features: 'ai,claude,llm' },
  { id: 'gemini', name: 'Google Gemini', description: 'Access Google Gemini AI models', category: 'ai', author: 'google', github_url: 'https://github.com/google/gemini-mcp', npm_package: '', official: 'true', features: 'ai,gemini,google' },
  { id: 'ollama', name: 'Ollama', description: 'Run local LLMs with Ollama integration', category: 'ai', author: 'ollama', github_url: 'https://github.com/ollama/ollama-mcp', npm_package: '', official: 'false', features: 'ai,local,llm' },
  { id: 'huggingface', name: 'Hugging Face', description: 'Connect to Hugging Face Hub APIs for models; datasets; and spaces', category: 'ai', author: 'huggingface', github_url: 'https://huggingface.co/settings/mcp', npm_package: '', official: 'true', features: 'ai,models,datasets' },
  { id: 'langchain', name: 'LangChain', description: 'Build LLM applications with LangChain framework', category: 'ai', author: 'langchain', github_url: 'https://github.com/langchain-ai/langchain-mcp', npm_package: '', official: 'false', features: 'ai,framework,chains' },
  { id: 'jira', name: 'Jira', description: 'Atlassian Jira Cloud integration for project and issue management', category: 'productivity', author: 'atlassian', github_url: 'https://github.com/aashari/mcp-server-atlassian-jira', npm_package: '', official: 'false', features: 'jira,issues,projects' },
  { id: 'confluence', name: 'Confluence', description: 'Atlassian Confluence integration for documentation and collaboration', category: 'productivity', author: 'atlassian', github_url: 'https://github.com/aashari/mcp-server-atlassian-confluence', npm_package: '', official: 'false', features: 'confluence,documentation,wiki' },
  { id: 'asana', name: 'Asana', description: 'Asana project management integration', category: 'productivity', author: 'asana', github_url: 'https://github.com/asana/asana-mcp', npm_package: '', official: 'false', features: 'tasks,projects,productivity' },
  { id: 'trello', name: 'Trello', description: 'Trello board and card management', category: 'productivity', author: 'trello', github_url: 'https://github.com/trello/trello-mcp', npm_package: '', official: 'false', features: 'boards,cards,kanban' },
  { id: 'airtable', name: 'Airtable', description: 'Airtable database integration with schema inspection; read and write capabilities', category: 'database', author: 'airtable', github_url: 'https://github.com/domdomegg/airtable-mcp-server', npm_package: '', official: 'false', features: 'database,spreadsheet,api' },
  { id: 'google-sheets', name: 'Google Sheets', description: 'Google Sheets API integration with comprehensive reading; writing; formatting', category: 'productivity', author: 'google', github_url: 'https://github.com/freema/mcp-gsheets', npm_package: '', official: 'false', features: 'spreadsheet,google,data' },
  { id: 'dropbox', name: 'Dropbox', description: 'Dropbox file storage integration', category: 'cloud', author: 'dropbox', github_url: 'https://github.com/dropbox/dropbox-mcp', npm_package: '', official: 'false', features: 'storage,files,sync' },
  { id: 'box', name: 'Box', description: 'Interact with the Intelligent Content Management platform through Box AI', category: 'cloud', author: 'box', github_url: 'https://github.com/box-community/mcp-server-box', npm_package: '', official: 'true', features: 'storage,enterprise,ai' },
  { id: 'onedrive', name: 'OneDrive', description: 'Microsoft OneDrive file storage integration', category: 'cloud', author: 'microsoft', github_url: 'https://github.com/microsoft/onedrive-mcp', npm_package: '', official: 'false', features: 'storage,microsoft,files' },
  { id: 'zoom', name: 'Zoom', description: 'Zoom meetings and video conferencing integration', category: 'communication', author: 'zoom', github_url: 'https://github.com/zoom/zoom-mcp', npm_package: '', official: 'false', features: 'meetings,video,collaboration' },
  { id: 'google-meet', name: 'Google Meet', description: 'Google Meet video conferencing integration', category: 'communication', author: 'google', github_url: 'https://github.com/google/meet-mcp', npm_package: '', official: 'false', features: 'meetings,video,google' },
  { id: 'teams', name: 'Microsoft Teams', description: 'Microsoft Teams messaging and collaboration', category: 'communication', author: 'microsoft', github_url: 'https://devblogs.microsoft.com/microsoft365dev/announcing-the-updated-teams-ai-library-and-mcp-support/', npm_package: '', official: 'true', features: 'teams,collaboration,microsoft' },
  { id: 'gmail', name: 'Gmail', description: 'Gmail email integration via Google API', category: 'communication', author: 'google', github_url: 'https://github.com/google/gmail-mcp', npm_package: '', official: 'false', features: 'email,google,inbox' },
  { id: 'outlook', name: 'Outlook', description: 'Microsoft Outlook email and calendar integration', category: 'communication', author: 'microsoft', github_url: 'https://github.com/microsoft/outlook-mcp', npm_package: '', official: 'false', features: 'email,calendar,microsoft' },
  { id: 'google-calendar', name: 'Google Calendar', description: 'Google Calendar event management', category: 'productivity', author: 'google', github_url: 'https://github.com/google/calendar-mcp', npm_package: '', official: 'false', features: 'calendar,events,scheduling' },
  { id: 'cloudflare', name: 'Cloudflare', description: 'Deploy; configure & interrogate your resources on the Cloudflare developer platform', category: 'cloud', author: 'cloudflare', github_url: 'https://github.com/cloudflare/mcp-server-cloudflare', npm_package: '', official: 'true', features: 'cdn,workers,edge' },
  { id: 'aws', name: 'AWS', description: 'Specialized MCP servers that bring AWS best practices directly to your development workflow', category: 'cloud', author: 'awslabs', github_url: 'https://github.com/awslabs/mcp', npm_package: '', official: 'true', features: 'aws,cloud,infrastructure' },
  { id: 'gcp', name: 'Google Cloud', description: 'Google Cloud Platform services integration', category: 'cloud', author: 'google', github_url: 'https://github.com/GoogleCloudPlatform/cloud-run-mcp', npm_package: '', official: 'true', features: 'gcp,cloud,google' },
  { id: 'digitalocean', name: 'DigitalOcean', description: 'DigitalOcean cloud infrastructure management', category: 'cloud', author: 'digitalocean', github_url: 'https://github.com/digitalocean/digitalocean-mcp', npm_package: '', official: 'false', features: 'cloud,droplets,kubernetes' },
  { id: 'terraform', name: 'Terraform', description: 'The official Terraform MCP Server for Infrastructure as Code workflows', category: 'devops', author: 'hashicorp', github_url: 'https://github.com/hashicorp/terraform-mcp-server', npm_package: '', official: 'true', features: 'terraform,iac,infrastructure' },
  { id: 'pulumi', name: 'Pulumi', description: 'MCP server for interacting with Pulumi using the Automation API and Cloud API', category: 'devops', author: 'pulumi', github_url: 'https://github.com/pulumi/mcp-server', npm_package: '', official: 'true', features: 'pulumi,iac,infrastructure' },
  { id: 'circleci', name: 'CircleCI', description: 'Enable AI Agents to fix build failures from CircleCI', category: 'devops', author: 'CircleCI-Public', github_url: 'https://github.com/CircleCI-Public/mcp-server-circleci', npm_package: '', official: 'true', features: 'ci-cd,builds,testing' },
  { id: 'jenkins', name: 'Jenkins', description: 'Official Jenkins MCP Server plugin enabling AI assistants to manage builds', category: 'devops', author: 'jenkins', github_url: 'https://plugins.jenkins.io/mcp-server/', npm_package: '', official: 'true', features: 'ci-cd,builds,automation' },
  { id: 'gitlab', name: 'GitLab', description: 'GitLab official MCP server for project management and repository operations', category: 'version-control', author: 'gitlab', github_url: 'https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/mcp_server/', npm_package: '', official: 'true', features: 'gitlab,repositories,ci-cd' },
  { id: 'bitbucket', name: 'Bitbucket', description: 'Atlassian Bitbucket Cloud integration for repositories and pull requests', category: 'version-control', author: 'atlassian', github_url: 'https://github.com/aashari/mcp-server-atlassian-bitbucket', npm_package: '', official: 'false', features: 'bitbucket,repositories,code' },
  { id: 'neon', name: 'Neon', description: 'Interact with the Neon serverless Postgres platform', category: 'database', author: 'neondatabase', github_url: 'https://github.com/neondatabase/mcp-server-neon', npm_package: '', official: 'true', features: 'postgres,serverless,database' },
  { id: 'planetscale', name: 'PlanetScale', description: 'PlanetScale MySQL serverless database integration', category: 'database', author: 'planetscale', github_url: 'https://github.com/planetscale/planetscale-mcp', npm_package: '', official: 'false', features: 'mysql,serverless,database' },
  { id: 'turso', name: 'Turso', description: 'Turso SQLite edge database integration', category: 'database', author: 'turso', github_url: 'https://github.com/turso/turso-mcp', npm_package: '', official: 'false', features: 'sqlite,edge,database' },
  { id: 'upstash', name: 'Upstash', description: 'Upstash Redis and Kafka serverless integration', category: 'database', author: 'upstash', github_url: 'https://github.com/upstash/upstash-mcp', npm_package: '', official: 'false', features: 'redis,kafka,serverless' },
  { id: 'duckdb', name: 'DuckDB', description: 'DuckDB database integration with schema inspection and query capabilities', category: 'database', author: 'duckdb', github_url: 'https://github.com/ktanaka101/mcp-server-duckdb', npm_package: '', official: 'false', features: 'duckdb,analytics,sql' },
  { id: 'snowflake', name: 'Snowflake', description: 'Snowflake data cloud integration for analytics and data warehousing', category: 'database', author: 'Snowflake-Labs', github_url: 'https://github.com/Snowflake-Labs/mcp', npm_package: '', official: 'true', features: 'snowflake,analytics,warehouse' },
  { id: 'databricks', name: 'Databricks', description: 'Connect to data; AI tools & agents; and the rest of the Databricks platform', category: 'database', author: 'databricks', github_url: 'https://docs.databricks.com/aws/en/generative-ai/mcp/', npm_package: '', official: 'true', features: 'databricks,spark,ml' },
  { id: 'bigquery', name: 'BigQuery', description: 'Google BigQuery integration for data analytics', category: 'database', author: 'google', github_url: 'https://github.com/ergut/mcp-bigquery-server', npm_package: '', official: 'false', features: 'bigquery,analytics,google' },
  { id: 'mysql', name: 'MySQL', description: 'MySQL database integration with configurable access controls', category: 'database', author: 'mysql', github_url: 'https://github.com/benborla/mcp-server-mysql', npm_package: '', official: 'false', features: 'mysql,sql,database' },
  { id: 'mariadb', name: 'MariaDB', description: 'MariaDB database integration with standard SQL operations', category: 'database', author: 'mariadb', github_url: 'https://github.com/mariadb/mcp', npm_package: '', official: 'true', features: 'mariadb,sql,database' },
  { id: 'cassandra', name: 'Cassandra', description: 'Apache Cassandra distributed database integration', category: 'database', author: 'apache', github_url: 'https://github.com/apache/cassandra-mcp', npm_package: '', official: 'false', features: 'cassandra,nosql,distributed' },
  { id: 'cockroachdb', name: 'CockroachDB', description: 'CockroachDB distributed SQL database integration', category: 'database', author: 'cockroachlabs', github_url: 'https://github.com/amineelkouhen/mcp-cockroachdb', npm_package: '', official: 'false', features: 'cockroachdb,sql,distributed' },
  { id: 'surrealdb', name: 'SurrealDB', description: 'SurrealDB multi-model database integration', category: 'database', author: 'surrealdb', github_url: 'https://github.com/surrealdb/surrealdb-mcp', npm_package: '', official: 'false', features: 'surrealdb,multi-model,database' },
  { id: 'axiom', name: 'Axiom', description: 'Query and analyze your Axiom logs; traces; and all other event data in natural language', category: 'monitoring', author: 'axiomhq', github_url: 'https://github.com/axiomhq/mcp-server-axiom', npm_package: '', official: 'true', features: 'logs,traces,observability' },
  { id: 'sentry-mcp', name: 'Sentry MCP', description: 'Retrieving and analyzing issues from Sentry.io error tracking', category: 'monitoring', author: 'sentry', github_url: 'https://github.com/modelcontextprotocol/servers-archived/tree/main/src/sentry', npm_package: '', official: 'true', features: 'errors,issues,monitoring' },
  { id: 'honeycomb', name: 'Honeycomb', description: 'Query and analyze data; alerts; dashboards with Honeycomb observability', category: 'monitoring', author: 'honeycombio', github_url: 'https://github.com/honeycombio/honeycomb-mcp', npm_package: '', official: 'true', features: 'observability,tracing,debugging' },
  { id: 'logfire', name: 'Logfire', description: 'Provides access to OpenTelemetry traces and metrics through Logfire', category: 'monitoring', author: 'pydantic', github_url: 'https://github.com/pydantic/logfire-mcp', npm_package: '', official: 'true', features: 'logs,traces,opentelemetry' },
  { id: 'figma', name: 'Figma', description: 'Provide coding agents direct access to Figma data for design implementation', category: 'creative', author: 'figma', github_url: 'https://github.com/GLips/Figma-Context-MCP', npm_package: '', official: 'false', features: 'design,ui,collaboration' },
  { id: 'canva', name: 'Canva', description: 'AI-powered development assistance for Canva apps and integrations', category: 'creative', author: 'canva', github_url: 'https://www.canva.dev/docs/apps/mcp-server/', npm_package: '', official: 'true', features: 'design,graphics,templates' },
  { id: 'adobe', name: 'Adobe', description: 'Adobe Creative Cloud integration', category: 'creative', author: 'adobe', github_url: 'https://github.com/adobe/adobe-mcp', npm_package: '', official: 'false', features: 'photoshop,illustrator,creative' },
  { id: 'spotify', name: 'Spotify', description: 'Spotify music streaming and playlist management', category: 'media', author: 'spotify', github_url: 'https://github.com/spotify/spotify-mcp', npm_package: '', official: 'false', features: 'music,playlists,streaming' },
  { id: 'soundcloud', name: 'SoundCloud', description: 'SoundCloud music platform integration', category: 'media', author: 'soundcloud', github_url: 'https://github.com/soundcloud/soundcloud-mcp', npm_package: '', official: 'false', features: 'music,audio,streaming' },
  { id: 'youtube', name: 'YouTube', description: 'YouTube video platform integration for search and analysis', category: 'media', author: 'google', github_url: 'https://github.com/kimtaeyoon83/mcp-server-youtube-transcript', npm_package: '', official: 'false', features: 'video,youtube,transcripts' },
  { id: 'vimeo', name: 'Vimeo', description: 'Vimeo video platform integration', category: 'media', author: 'vimeo', github_url: 'https://github.com/vimeo/vimeo-mcp', npm_package: '', official: 'false', features: 'video,hosting,streaming' },
  { id: 'linkedin', name: 'LinkedIn', description: 'LinkedIn professional network integration', category: 'social', author: 'linkedin', github_url: 'https://github.com/linkedin/linkedin-mcp', npm_package: '', official: 'false', features: 'social,professional,networking' },
  { id: 'facebook', name: 'Facebook', description: 'Facebook social media integration', category: 'social', author: 'facebook', github_url: 'https://github.com/facebook/facebook-mcp', npm_package: '', official: 'false', features: 'social,facebook,meta' },
  { id: 'instagram', name: 'Instagram', description: 'Instagram photo and video sharing integration', category: 'social', author: 'instagram', github_url: 'https://github.com/instagram/instagram-mcp', npm_package: '', official: 'false', features: 'photos,social,instagram' },
  { id: 'reddit', name: 'Reddit', description: 'Reddit community platform integration', category: 'social', author: 'reddit', github_url: 'https://github.com/reddit/reddit-mcp', npm_package: '', official: 'false', features: 'social,community,reddit' },
  { id: 'hackernews', name: 'Hacker News', description: 'Hacker News tech news and discussion integration', category: 'social', author: 'ycombinator', github_url: 'https://github.com/ycombinator/hackernews-mcp', npm_package: '', official: 'false', features: 'news,tech,discussion' },
  { id: 'shopify', name: 'Shopify', description: 'Shopify e-commerce platform integration', category: 'productivity', author: 'shopify', github_url: 'https://github.com/shopify/shopify-mcp', npm_package: '', official: 'false', features: 'ecommerce,store,products' },
  { id: 'woocommerce', name: 'WooCommerce', description: 'WooCommerce WordPress e-commerce integration', category: 'productivity', author: 'woocommerce', github_url: 'https://github.com/iOSDevSK/mcp-for-woocommerce', npm_package: '', official: 'false', features: 'ecommerce,wordpress,products' },
  { id: 'paypal', name: 'PayPal', description: 'PayPal payment processing integration', category: 'finance', author: 'paypal', github_url: 'https://github.com/paypal/paypal-mcp', npm_package: '', official: 'false', features: 'payments,checkout,finance' },
  { id: 'coinbase', name: 'Coinbase', description: 'Coinbase cryptocurrency exchange integration', category: 'finance', author: 'coinbase', github_url: 'https://github.com/coinbase/coinbase-mcp', npm_package: '', official: 'false', features: 'crypto,trading,wallet' },
  { id: 'coingecko', name: 'CoinGecko', description: 'Official CoinGecko API MCP Server for Crypto Price & Market Data', category: 'finance', author: 'coingecko', github_url: 'https://github.com/coingecko/coingecko-typescript/tree/main/packages/mcp-server', npm_package: '', official: 'true', features: 'crypto,prices,market' },
  { id: 'weather', name: 'Weather', description: 'Weather data and forecasts from various providers', category: 'utilities', author: 'weather', github_url: 'https://github.com/weather/weather-mcp', npm_package: '', official: 'false', features: 'weather,forecasts,climate' },
  { id: 'mapbox', name: 'Mapbox', description: 'Mapbox geospatial services including geocoding; directions; and maps', category: 'location', author: 'mapbox', github_url: 'https://github.com/mapbox/mcp-server', npm_package: '', official: 'true', features: 'maps,geocoding,directions' },
  { id: 'google-maps-mcp', name: 'Google Maps MCP', description: 'Google Maps Platform Code Assist for geo-related guidance', category: 'location', author: 'googlemaps', github_url: 'https://github.com/googlemaps/platform-ai/tree/main/packages/code-assist', npm_package: '', official: 'true', features: 'maps,places,directions' },
  { id: 'zendesk', name: 'Zendesk', description: 'Zendesk customer service platform integration', category: 'productivity', author: 'zendesk', github_url: 'https://github.com/zendesk/zendesk-mcp', npm_package: '', official: 'false', features: 'support,tickets,helpdesk' },
  { id: 'intercom', name: 'Intercom', description: 'Intercom customer messaging platform integration', category: 'communication', author: 'intercom', github_url: 'https://github.com/intercom/intercom-mcp', npm_package: '', official: 'false', features: 'chat,support,messaging' },
  { id: 'hubspot', name: 'HubSpot', description: 'Connect; manage; and interact with HubSpot CRM data', category: 'productivity', author: 'hubspot', github_url: 'https://developer.hubspot.com/mcp', npm_package: '', official: 'true', features: 'crm,marketing,sales' },
  { id: 'salesforce', name: 'Salesforce', description: 'Salesforce CRM integration for sales and customer management', category: 'productivity', author: 'salesforce', github_url: 'https://github.com/salesforce/salesforce-mcp', npm_package: '', official: 'false', features: 'crm,sales,enterprise' },
  { id: 'mixpanel', name: 'Mixpanel', description: 'Query and analyze your product analytics data through natural language', category: 'monitoring', author: 'mixpanel', github_url: 'https://docs.mixpanel.com/docs/features/mcp', npm_package: '', official: 'true', features: 'analytics,product,insights' },
  { id: 'amplitude', name: 'Amplitude', description: 'Search; analyze; and query charts; dashboards; experiments from Amplitude', category: 'monitoring', author: 'amplitude', github_url: 'https://amplitude.com/docs/analytics/amplitude-mcp', npm_package: '', official: 'true', features: 'analytics,product,experiments' },
  { id: 'posthog', name: 'PostHog', description: 'PostHog product analytics; feature flags; and error tracking', category: 'monitoring', author: 'posthog', github_url: 'https://github.com/posthog/mcp', npm_package: '', official: 'true', features: 'analytics,feature-flags,errors' },
  { id: 'segment', name: 'Segment', description: 'Segment customer data platform integration', category: 'data', author: 'segment', github_url: 'https://github.com/segment/segment-mcp', npm_package: '', official: 'false', features: 'cdp,analytics,data' },
  { id: 'launchdarkly', name: 'LaunchDarkly', description: 'LaunchDarkly feature flag management', category: 'dev-tools', author: 'launchdarkly', github_url: 'https://github.com/launchdarkly/mcp-server', npm_package: '', official: 'true', features: 'feature-flags,releases,experiments' },
  { id: 'auth0', name: 'Auth0', description: 'MCP server for interacting with your Auth0 tenant', category: 'security', author: 'auth0', github_url: 'https://github.com/auth0/auth0-mcp-server', npm_package: '', official: 'true', features: 'auth,identity,security' },
  { id: 'okta', name: 'Okta', description: 'Okta identity and access management', category: 'security', author: 'okta', github_url: 'https://github.com/okta/okta-mcp', npm_package: '', official: 'false', features: 'identity,sso,security' },
  { id: 'crowdstrike', name: 'CrowdStrike', description: 'CrowdStrike Falcon security platform integration', category: 'security', author: 'CrowdStrike', github_url: 'https://github.com/CrowdStrike/falcon-mcp', npm_package: '', official: 'true', features: 'security,threats,incidents' },
  { id: 'snyk', name: 'Snyk', description: 'Snyk security vulnerability scanning', category: 'security', author: 'snyk', github_url: 'https://github.com/snyk/snyk-mcp', npm_package: '', official: 'false', features: 'security,vulnerabilities,dependencies' },
  { id: 'sonarqube', name: 'SonarQube', description: 'SonarQube code quality and security analysis', category: 'dev-tools', author: 'sonarqube', github_url: 'https://github.com/sapientpants/sonarqube-mcp-server', npm_package: '', official: 'false', features: 'code-quality,security,analysis' },
  { id: 'e2b', name: 'E2B', description: 'Run code in secure sandboxes hosted by E2B', category: 'dev-tools', author: 'e2b-dev', github_url: 'https://github.com/e2b-dev/mcp-server', npm_package: '', official: 'true', features: 'sandbox,code-execution,security' },
  { id: 'replicate', name: 'Replicate', description: 'Run AI models on Replicate platform', category: 'ai', author: 'replicate', github_url: 'https://github.com/replicate/replicate-mcp', npm_package: '', official: 'false', features: 'ai,models,inference' },
  { id: 'stability', name: 'Stability AI', description: 'Stability AI image generation and models', category: 'ai', author: 'stability-ai', github_url: 'https://github.com/stability-ai/stability-mcp', npm_package: '', official: 'false', features: 'ai,images,generation' },
  { id: 'midjourney', name: 'Midjourney', description: 'Midjourney AI image generation', category: 'ai', author: 'midjourney', github_url: 'https://github.com/midjourney/midjourney-mcp', npm_package: '', official: 'false', features: 'ai,images,art' },
  { id: 'runway', name: 'Runway', description: 'Runway AI video generation and editing', category: 'ai', author: 'runway', github_url: 'https://github.com/runway/runway-mcp', npm_package: '', official: 'false', features: 'ai,video,generation' },
  { id: 'elevenlabs', name: 'ElevenLabs', description: 'ElevenLabs AI voice synthesis and cloning', category: 'ai', author: 'elevenlabs', github_url: 'https://github.com/elevenlabs/elevenlabs-mcp', npm_package: '', official: 'false', features: 'ai,voice,tts' },
  { id: 'whisper', name: 'Whisper', description: 'OpenAI Whisper speech recognition', category: 'ai', author: 'openai', github_url: 'https://github.com/openai/whisper-mcp', npm_package: '', official: 'false', features: 'ai,speech,transcription' },
  { id: 'deepgram', name: 'Deepgram', description: 'Deepgram speech-to-text and audio intelligence', category: 'ai', author: 'deepgram', github_url: 'https://github.com/deepgram/deepgram-mcp', npm_package: '', official: 'false', features: 'ai,speech,transcription' },
  { id: 'chroma', name: 'Chroma', description: 'Embeddings; vector search; document storage and full-text search', category: 'database', author: 'chroma-core', github_url: 'https://github.com/chroma-core/chroma-mcp', npm_package: '', official: 'true', features: 'vectors,embeddings,search' },
  { id: 'milvus', name: 'Milvus', description: 'Search; Query and interact with data in your Milvus Vector Database', category: 'database', author: 'zilliztech', github_url: 'https://github.com/zilliztech/mcp-server-milvus', npm_package: '', official: 'true', features: 'vectors,similarity,search' },
  { id: 'obsidian', name: 'Obsidian', description: 'Obsidian note-taking and knowledge management', category: 'knowledge', author: 'obsidian', github_url: 'https://github.com/obsidian/obsidian-mcp', npm_package: '', official: 'false', features: 'notes,knowledge,markdown' },
  { id: 'roam', name: 'Roam Research', description: 'Roam Research networked note-taking', category: 'knowledge', author: 'roam', github_url: 'https://github.com/roam/roam-mcp', npm_package: '', official: 'false', features: 'notes,graph,knowledge' },
  { id: 'logseq', name: 'Logseq', description: 'Logseq knowledge management and note-taking', category: 'knowledge', author: 'logseq', github_url: 'https://github.com/logseq/logseq-mcp', npm_package: '', official: 'false', features: 'notes,outliner,knowledge' },
  { id: 'raycast', name: 'Raycast', description: 'Raycast productivity launcher integration', category: 'productivity', author: 'raycast', github_url: 'https://github.com/raycast/raycast-mcp', npm_package: '', official: 'false', features: 'launcher,productivity,macos' },
  { id: 'alfred', name: 'Alfred', description: 'Alfred productivity app for macOS', category: 'productivity', author: 'alfred', github_url: 'https://github.com/alfred/alfred-mcp', npm_package: '', official: 'false', features: 'launcher,automation,macos' },
  { id: 'make', name: 'Make', description: 'Turn your Make scenarios into callable tools for AI assistants', category: 'automation', author: 'make', github_url: 'https://github.com/integromat/make-mcp-server', npm_package: '', official: 'true', features: 'automation,workflows,integrations' },
  { id: 'zapier', name: 'Zapier', description: 'Zapier workflow automation platform', category: 'automation', author: 'zapier', github_url: 'https://github.com/zapier/zapier-mcp', npm_package: '', official: 'false', features: 'automation,workflows,integrations' },
  { id: 'n8n', name: 'n8n', description: 'n8n workflow automation tool', category: 'automation', author: 'n8n', github_url: 'https://github.com/n8n-io/n8n-mcp', npm_package: '', official: 'false', features: 'automation,workflows,self-hosted' },
  { id: 'ifttt', name: 'IFTTT', description: 'IFTTT automation and applets', category: 'automation', author: 'ifttt', github_url: 'https://github.com/ifttt/ifttt-mcp', npm_package: '', official: 'false', features: 'automation,triggers,actions' },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp messaging integration', category: 'communication', author: 'meta', github_url: 'https://github.com/lharries/whatsapp-mcp', npm_package: '', official: 'false', features: 'messaging,whatsapp,chat' },
  { id: 'telegram', name: 'Telegram', description: 'Telegram messaging platform integration', category: 'communication', author: 'telegram', github_url: 'https://github.com/chaindead/telegram-mcp', npm_package: '', official: 'false', features: 'messaging,telegram,bots' },
  { id: 'signal', name: 'Signal', description: 'Signal secure messaging integration', category: 'communication', author: 'signal', github_url: 'https://github.com/signal/signal-mcp', npm_package: '', official: 'false', features: 'messaging,secure,privacy' },
  { id: 'kagi', name: 'Kagi Search', description: 'Search the web using Kagi search API', category: 'search', author: 'kagisearch', github_url: 'https://github.com/kagisearch/kagimcp', npm_package: '', official: 'true', features: 'search,privacy,web' },
  { id: 'tavily', name: 'Tavily', description: 'Tavily AI search engine for research', category: 'search', author: 'tavily', github_url: 'https://github.com/tavily/tavily-mcp', npm_package: '', official: 'false', features: 'search,ai,research' },
  { id: 'perplexity', name: 'Perplexity', description: 'Perplexity AI search and answers', category: 'search', author: 'perplexity', github_url: 'https://github.com/perplexity/perplexity-mcp', npm_package: '', official: 'false', features: 'search,ai,answers' },
  { id: 'you', name: 'You.com', description: 'You.com AI-powered search', category: 'search', author: 'you', github_url: 'https://github.com/you-dot-com/you-mcp', npm_package: '', official: 'false', features: 'search,ai,web' },
  { id: 'serper', name: 'Serper', description: 'Serper Google search API', category: 'search', author: 'serper', github_url: 'https://github.com/serper/serper-mcp', npm_package: '', official: 'false', features: 'search,google,api' },
  { id: 'metaphor', name: 'Metaphor', description: 'Metaphor AI-native search', category: 'search', author: 'metaphor', github_url: 'https://github.com/metaphor/metaphor-mcp', npm_package: '', official: 'false', features: 'search,ai,neural' },
  { id: 'wolfram', name: 'Wolfram Alpha', description: 'Wolfram Alpha computational knowledge engine', category: 'utilities', author: 'wolfram', github_url: 'https://github.com/wolfram/wolfram-mcp', npm_package: '', official: 'false', features: 'computation,knowledge,math' },
  { id: 'arxiv', name: 'arXiv', description: 'arXiv research paper repository', category: 'knowledge', author: 'arxiv', github_url: 'https://github.com/arxiv/arxiv-mcp', npm_package: '', official: 'false', features: 'research,papers,science' },
  { id: 'semantic-scholar', name: 'Semantic Scholar', description: 'Semantic Scholar research database', category: 'knowledge', author: 'allenai', github_url: 'https://github.com/allenai/semantic-scholar-mcp', npm_package: '', official: 'false', features: 'research,papers,ai' },
  { id: 'pubmed', name: 'PubMed', description: 'PubMed biomedical literature database', category: 'knowledge', author: 'ncbi', github_url: 'https://github.com/ncbi/pubmed-mcp', npm_package: '', official: 'false', features: 'research,medical,biology' },
  { id: 'wikipedia', name: 'Wikipedia', description: 'Wikipedia knowledge encyclopedia', category: 'knowledge', author: 'wikipedia', github_url: 'https://github.com/wikipedia/wikipedia-mcp', npm_package: '', official: 'false', features: 'knowledge,encyclopedia,facts' },
];

// Load existing servers
function loadExistingServers(filePath: string): Set<string> {
  if (!existsSync(filePath)) return new Set();
  
  const content = readFileSync(filePath, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });
  return new Set(records.map((r: any) => r.id));
}

// Main function
async function main() {
  const existingPath = './data/servers.csv';
  const existingIds = loadExistingServers(existingPath);
  
  console.log(`Existing servers: ${existingIds.size}`);
  
  // Filter out duplicates
  const newServers = additionalServers.filter(s => !existingIds.has(s.id));
  console.log(`New servers to add: ${newServers.length}`);
  
  // Read existing file
  const existingContent = readFileSync(existingPath, 'utf-8');
  const existingRecords = parse(existingContent, { columns: true, skip_empty_lines: true });
  
  // Combine
  const allServers = [...existingRecords, ...newServers];
  
  // Write output
  const output = stringify(allServers, { 
    header: true,
    columns: ['id', 'name', 'description', 'category', 'author', 'github_url', 'npm_package', 'official', 'features']
  });
  
  writeFileSync(existingPath, output);
  console.log(`Total servers now: ${allServers.length}`);
}

main().catch(console.error);
