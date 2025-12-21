-- SQL script to insert the MCP 3.0.0 release article
-- Execute this in your Supabase SQL editor or via Supabase CLI

-- First, ensure the author exists
INSERT INTO press_authors (slug, name)
VALUES ('crane-team', 'CRAN/E Team')
ON CONFLICT (slug) DO NOTHING;

-- Insert the article
INSERT INTO press_articles (
  slug,
  title,
  subline,
  type,
  categories,
  publish_state,
  created_at,
  synopsis_html,
  sections
)
VALUES (
  'mcp-server-release-3-0-0',
  'Introducing MCP Server: AI-Powered Access to CRAN Packages',
  'CRAN/E 3.0.0 brings Model Context Protocol integration for seamless AI-powered R package discovery',
  'news',
  ARRAY['announcement']::press_article_category[],
  'published',
  '2025-12-21T00:00:00.000Z',
  '<p>We''re excited to announce CRAN/E 3.0.0, featuring a groundbreaking Model Context Protocol (MCP) server that enables AI assistants and development tools to access our comprehensive R package database programmatically. This integration transforms how developers discover and work with CRAN packages, bringing intelligent, context-aware assistance directly into your workflow.</p>',
  '[
    {
      "headline": "What is Model Context Protocol?",
      "fragment": "what-is-mcp",
      "fragmentHeadline": "What is MCP?",
      "body": [
        {
          "type": "html",
          "value": "<p>Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect to external data sources and tools. It provides a universal way for AI models to access real-time information beyond their training data, making them more useful and accurate for specialized tasks.</p><p>With MCP, AI assistants can query databases, search APIs, and retrieve structured data without requiring custom integrations for each tool. This standardized approach means that any MCP-compatible AI assistant can immediately leverage CRAN/E''s data without additional development work.</p>"
        }
      ]
    },
    {
      "headline": "CRAN/E''s MCP Implementation",
      "fragment": "implementation",
      "body": [
        {
          "type": "html",
          "value": "<p>Our MCP server provides a comprehensive interface to CRAN/E''s database, exposing the same rich metadata and search capabilities available on our web interface. The server is available at <code>/api/mcp</code> and follows the MCP specification for seamless integration with compatible clients.</p><h3>Resources</h3><p>The MCP server exposes two main resource types that provide structured access to CRAN data:</p><ul><li><strong>Package resources</strong> (<code>cran://package/{name}</code>) - Access detailed metadata for any CRAN package including dependencies, authors, download statistics, and release information</li><li><strong>Author resources</strong> (<code>cran://author/{name}</code>) - Retrieve comprehensive author profiles with their associated packages and contributions to the R ecosystem</li></ul><p>Both resources include enriched metadata with direct URLs to CRAN/E pages for quick reference, making it easy to transition from AI-assisted discovery to detailed exploration on our website.</p>"
        }
      ]
    },
    {
      "headline": "Search Tools for AI Assistants",
      "fragment": "tools",
      "body": [
        {
          "type": "html",
          "value": "<p>Beyond static resource access, our MCP server provides five powerful search tools that enable flexible, real-time querying of the CRAN database:</p><h3>search_packages</h3><p>Search for R packages by name, description, or keywords. Returns up to 10 enriched package records including metadata, download statistics, and trending status. Perfect for discovering packages relevant to specific tasks or domains.</p><h3>search_authors</h3><p>Find R package authors and maintainers by name. Results include author profiles with their package contributions and roles in the R ecosystem. Useful for exploring the work of specific developers or research teams.</p><h3>search_universal</h3><p>Combined search across both packages and authors when intent is ambiguous. This tool provides comprehensive results when you''re not sure whether you''re looking for a specific package or the people behind it.</p><h3>search_related_packages</h3><p>Discover packages related to a seed package by analyzing its title and description. This tool helps find alternatives, complementary packages, or packages in the same domain without requiring exact keyword matches.</p><p>All search tools return structured data with consistent formatting, making them easy for AI models to process and present to users naturally.</p>"
        }
      ]
    },
    {
      "headline": "Integration Examples",
      "fragment": "integration",
      "body": [
        {
          "type": "html",
          "value": "<p>Setting up CRAN/E''s MCP server with your AI assistant is straightforward. Here''s how to get started:</p><h3>Configuration</h3><p>Add the following to your MCP client configuration (such as VS Code with GitHub Copilot or Claude Desktop):</p><pre><code>{\n  \"cran-mcp\": {\n    \"type\": \"http\",\n    \"url\": \"https://cran-e.com/api/mcp\"\n  }\n}</code></pre><h3>Usage Examples</h3><p>Once configured, you can ask your AI assistant questions like:</p><ul><li>\"What packages are available for time series forecasting in R?\"</li><li>\"Show me details about the ggplot2 package\"</li><li>\"Who maintains the tidyverse packages?\"</li><li>\"Find packages related to dplyr\"</li><li>\"What are the most popular packages for machine learning?\"</li></ul><p>The AI assistant will use CRAN/E''s MCP server to retrieve real-time data and provide accurate, up-to-date responses with direct links to package pages for further exploration.</p>"
        }
      ]
    },
    {
      "headline": "Benefits for Developers",
      "fragment": "benefits",
      "body": [
        {
          "type": "html",
          "value": "<p>The MCP integration brings several key benefits to R developers and data scientists:</p><h3>Smarter Package Discovery</h3><p>AI assistants can now provide context-aware package recommendations based on your specific needs, project requirements, and use cases. No more manual searching through CRAN''s 20,000+ packages.</p><h3>Real-Time Information</h3><p>Get instant access to the latest package metadata, download statistics, and trending information. The MCP server queries CRAN/E''s live database, ensuring you always have current data.</p><h3>Workflow Integration</h3><p>With MCP support in popular tools like VS Code and Claude Desktop, CRAN package discovery becomes a natural part of your development workflow. No context switching required.</p><h3>Dependency Analysis</h3><p>AI assistants can help analyze package dependencies, identify potential conflicts, and suggest compatible versions—all through natural language queries.</p><h3>Enhanced Learning</h3><p>For developers new to R or exploring new domains, AI-assisted package discovery provides guided learning with explanations of what each package does and when to use it.</p>"
        }
      ]
    },
    {
      "headline": "Technical Details",
      "fragment": "technical-details",
      "body": [
        {
          "type": "html",
          "value": "<p>For developers interested in the implementation:</p><ul><li><strong>Protocol:</strong> HTTP-based MCP transport with SSE support for streaming responses</li><li><strong>Endpoint:</strong> <code>/api/mcp</code> (hosted as a Remix route)</li><li><strong>Version:</strong> MCP 1.1.0</li><li><strong>Authentication:</strong> Public endpoint, no authentication required</li><li><strong>Rate limiting:</strong> Fair use policy applies</li><li><strong>Response format:</strong> Structured JSON with both text and structured content fields</li></ul><p>The server implementation uses the <code>@modelcontextprotocol/sdk</code> package and integrates directly with CRAN/E''s existing data services, ensuring consistent behavior between the web interface and MCP endpoints.</p><p>All MCP tools are marked as read-only and open-world, indicating they don''t modify data and can query information beyond a fixed dataset. This makes them ideal for AI assistants that need safe, expansive access to CRAN package information.</p>"
        }
      ]
    },
    {
      "headline": "Get Started Today",
      "fragment": "get-started",
      "body": [
        {
          "type": "html",
          "value": "<p>Ready to enhance your R development workflow with AI-powered package discovery? Visit our <a href=\"/mcp\">MCP documentation page</a> for detailed setup instructions and integration guides for popular tools.</p><p>The MCP server is available now at <code>https://cran-e.com/api/mcp</code> for all users. No registration or API keys required—just add it to your MCP client configuration and start exploring CRAN packages with AI assistance.</p><h3>Resources</h3><ul><li><a href=\"/mcp\">CRAN/E MCP Documentation</a> - Complete setup guide and API reference</li><li><a href=\"https://modelcontextprotocol.io\">Model Context Protocol</a> - Learn about the MCP standard</li><li><a href=\"https://code.visualstudio.com/docs/copilot/customization/mcp-servers\">VS Code MCP Setup</a> - Configure MCP in Visual Studio Code</li><li><a href=\"https://github.com/flaming-codes/crane-app\">CRAN/E on GitHub</a> - View the source code and contribute</li></ul><p>We''re excited to see how this integration enhances the R development experience. If you have feedback or suggestions, please reach out through our GitHub repository or contact us directly.</p>"
        }
      ]
    }
  ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subline = EXCLUDED.subline,
  synopsis_html = EXCLUDED.synopsis_html,
  sections = EXCLUDED.sections,
  updated_at = NOW();

-- Link the article to the author
INSERT INTO press_article_authors (press_article_slug, author_slug)
VALUES ('mcp-server-release-3-0-0', 'crane-team')
ON CONFLICT (press_article_slug, author_slug) DO NOTHING;
