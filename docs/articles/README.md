# MCP Server 3.0.0 Release Article

This directory contains the article content for the CRAN/E 3.0.0 release announcement, which introduces the Model Context Protocol (MCP) server integration.

## Files

- **mcp-server-release-3.0.0.json** - Complete article content in JSON format matching the press_articles schema
- **insert-mcp-article.sql** - SQL script to insert the article into the Supabase database
- **validate-article.mjs** - Node.js validation script to verify article structure
- **README.md** - This documentation file

## Article Overview

**Title:** Introducing MCP Server: AI-Powered Access to CRAN Packages

**Slug:** `mcp-server-release-3-0-0`

**Type:** news

**Categories:** announcement

The article covers:
- Introduction to Model Context Protocol (MCP)
- CRAN/E's MCP implementation details
- Available resources (packages and authors)
- Search tools for AI assistants
- Integration examples and configuration
- Benefits for developers
- Technical implementation details
- Getting started guide

## Validation

Before inserting the article, you can validate its structure:

```bash
cd docs/articles
node validate-article.mjs
```

This will check:
- Required fields are present
- Field types are correct
- Section structure is valid
- Author information is complete
- Dates are properly formatted

## How to Add This Article to CRAN/E

### Option 1: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `insert-mcp-article.sql`
4. Paste and execute the SQL script
5. The article will be immediately available at `/press/news/mcp-server-release-3-0-0`

### Option 2: Using Supabase CLI

```bash
# Make sure you're logged in to Supabase
supabase login

# Link to your project (if not already linked)
supabase link --project-ref your-project-ref

# Execute the SQL script
supabase db push < docs/articles/insert-mcp-article.sql
```

### Option 3: Programmatic Insert

If you prefer to insert the article programmatically, you can use the JSON file with the Supabase client:

```typescript
import { supabase } from './app/data/supabase.server';
import articleData from './docs/articles/mcp-server-release-3.0.0.json';

// Insert author if not exists
await supabase.from('press_authors').upsert({
  slug: 'crane-team',
  name: 'CRAN/E Team'
});

// Insert article
await supabase.from('press_articles').insert({
  slug: articleData.slug,
  title: articleData.title,
  subline: articleData.subline,
  type: articleData.type,
  categories: articleData.categories,
  publish_state: articleData.publish_state,
  created_at: articleData.created_at,
  synopsis_html: articleData.synopsis_html,
  sections: articleData.sections
});

// Link article to author
await supabase.from('press_article_authors').insert({
  press_article_slug: articleData.slug,
  author_slug: 'crane-team'
});
```

## Verification

After inserting the article, you can verify it's working by:

1. Visiting `/press/news` - The article should appear in the news listing
2. Visiting `/press/news/mcp-server-release-3-0-0` - The full article should be displayed
3. Checking the article preview includes the synopsis and metadata

## Article Structure

The article follows the CRAN/E article schema:

```typescript
{
  slug: string;              // URL-friendly identifier
  title: string;             // Article headline
  subline: string;           // Brief description
  type: 'news' | 'magazine'; // Article category
  categories: string[];      // Tags (e.g., 'announcement')
  publish_state: 'draft' | 'published';
  created_at: string;        // ISO 8601 timestamp
  synopsis_html: string;     // HTML preview for listing pages
  sections: Array<{          // Main article content
    headline: string;
    fragment: string;        // URL fragment for anchors
    fragmentHeadline?: string; // Optional shorter heading for nav
    body: Array<{
      type: 'html' | 'image';
      value: string | { src: string; caption: string };
    }>;
  }>;
}
```

## Notes

- **⚠️ IMPORTANT:** The article date is currently set to December 21, 2025. This is a placeholder date that **must be updated** to the actual publication date before inserting into the database. Update both the JSON file and SQL script with the correct date.
- The publish_state is set to 'published' - change to 'draft' if you want to preview first
- All internal links use relative paths (e.g., `/mcp`, `/about`)
- External links are properly marked for MCP documentation and related resources
- The article includes proper HTML structure with headings, lists, code blocks, and links

## Related Files

- `/web/app/routes/_page.mcp._index.tsx` - MCP documentation page
- `/web/app/mcp/mcp.server.ts` - MCP server implementation
- `/docs/mcp.md` - MCP technical documentation
- `/web/app/routes/_page.press.$articleType._index.tsx` - News overview page
- `/web/app/routes/_page.press.$articleType._article.$articleSlug._index.tsx` - Article detail page
