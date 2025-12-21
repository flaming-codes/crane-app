#!/usr/bin/env node
/**
 * Validation script for the MCP article JSON
 * This script validates that the article structure matches the expected schema
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the article JSON
const articlePath = join(__dirname, 'mcp-server-release-3.0.0.json');
const articleData = JSON.parse(readFileSync(articlePath, 'utf-8'));

console.log('🔍 Validating MCP article structure...\n');

// Validation checks
const errors = [];
const warnings = [];

// Required fields
if (!articleData.slug) errors.push('Missing required field: slug');
if (!articleData.title) errors.push('Missing required field: title');
if (!articleData.type) errors.push('Missing required field: type');
if (!articleData.categories) errors.push('Missing required field: categories');
if (!articleData.synopsis_html) errors.push('Missing required field: synopsis_html');
if (!articleData.sections) errors.push('Missing required field: sections');

// Type validation
if (articleData.type && !['news', 'magazine'].includes(articleData.type)) {
  errors.push(`Invalid type: ${articleData.type}. Must be 'news' or 'magazine'`);
}

// Categories validation
if (articleData.categories && !Array.isArray(articleData.categories)) {
  errors.push('categories must be an array');
} else if (articleData.categories) {
  const validCategories = ['general', 'announcement'];
  articleData.categories.forEach(cat => {
    if (!validCategories.includes(cat)) {
      warnings.push(`Unknown category: ${cat}. Valid categories are: ${validCategories.join(', ')}`);
    }
  });
}

// Publish state validation
if (articleData.publish_state && !['draft', 'published'].includes(articleData.publish_state)) {
  errors.push(`Invalid publish_state: ${articleData.publish_state}. Must be 'draft' or 'published'`);
}

// Sections validation
if (articleData.sections && !Array.isArray(articleData.sections)) {
  errors.push('sections must be an array');
} else if (articleData.sections) {
  articleData.sections.forEach((section, index) => {
    if (!section.headline) {
      errors.push(`Section ${index} missing required field: headline`);
    }
    if (!section.fragment) {
      errors.push(`Section ${index} missing required field: fragment`);
    }
    if (!section.body) {
      errors.push(`Section ${index} missing required field: body`);
    } else if (!Array.isArray(section.body)) {
      errors.push(`Section ${index} body must be an array`);
    } else {
      section.body.forEach((content, contentIndex) => {
        if (!content.type) {
          errors.push(`Section ${index}, content ${contentIndex} missing required field: type`);
        } else if (!['html', 'image'].includes(content.type)) {
          errors.push(`Section ${index}, content ${contentIndex} invalid type: ${content.type}`);
        }
        if (!content.value) {
          errors.push(`Section ${index}, content ${contentIndex} missing required field: value`);
        }
        if (content.type === 'image' && typeof content.value !== 'object') {
          errors.push(`Section ${index}, content ${contentIndex} image value must be an object with src and caption`);
        }
      });
    }
  });
}

// Authors validation
if (articleData.authors && !Array.isArray(articleData.authors)) {
  errors.push('authors must be an array');
} else if (articleData.authors) {
  articleData.authors.forEach((author, index) => {
    if (!author.name) {
      errors.push(`Author ${index} missing required field: name`);
    }
    if (!author.slug) {
      errors.push(`Author ${index} missing required field: slug`);
    }
  });
}

// Date validation
if (articleData.created_at) {
  try {
    const date = new Date(articleData.created_at);
    if (isNaN(date.getTime())) {
      errors.push('created_at is not a valid ISO 8601 date');
    }
  } catch (e) {
    errors.push('created_at is not a valid ISO 8601 date');
  }
}

// Output results
console.log('📊 Validation Results:\n');
console.log(`✅ Valid fields: ${Object.keys(articleData).length}`);
console.log(`📝 Sections: ${articleData.sections?.length || 0}`);
console.log(`👥 Authors: ${articleData.authors?.length || 0}`);
console.log(`🏷️  Categories: ${articleData.categories?.join(', ') || 'none'}`);
console.log(`📅 Created: ${articleData.created_at || 'not set'}`);
console.log(`🔗 Slug: ${articleData.slug || 'not set'}`);
console.log(`📄 Type: ${articleData.type || 'not set'}`);
console.log(`📢 Publish state: ${articleData.publish_state || 'not set'}\n`);

if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(warning => console.log(`   - ${warning}`));
  console.log();
}

if (errors.length > 0) {
  console.log('❌ Errors:');
  errors.forEach(error => console.log(`   - ${error}`));
  console.log();
  process.exit(1);
} else {
  console.log('✅ Article structure is valid!\n');
  console.log('📋 Next steps:');
  console.log('   1. Review the article content in mcp-server-release-3.0.0.json');
  console.log('   2. Execute the SQL script: insert-mcp-article.sql');
  console.log('   3. Verify the article appears at /press/news/mcp-server-release-3-0-0');
  process.exit(0);
}
