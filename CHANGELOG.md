# Changelog

All notable changes to the Director Value Business Directory project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2025-08-23

### Added
- **MCP (Model Context Protocol) Server** - Complete integration server for external AI tools
  - 11 comprehensive management tools for businesses, users, reviews, leads, and categories
  - Business management (CRUD operations, approval system, search)
  - User management and analytics (create, update, delete, comprehensive metrics)
  - Review and lead management with proper validation
  - Category management and search capabilities
  - TypeScript implementation with strict type checking
  - Zod validation for all inputs and outputs
  - Prisma integration for database operations
  - Comprehensive documentation and setup scripts
  - Excluded from Vercel deployment to prevent build issues

### Technical Details
- MCP server runs independently from main application
- Custom MCP protocol implementation (no SDK dependencies)
- Full integration with existing Prisma schema
- Environment-based configuration with safety checks
- Build system with TypeScript compilation and source maps

### Files Added
- `mcp/` - Complete MCP server directory structure
- `mcp/src/index.ts` - Main MCP server implementation
- `mcp/package.json` - MCP server dependencies and scripts
- `mcp/README.md` - Comprehensive usage documentation
- `mcp/scripts/setup.js` - Automated environment setup
- `mcp/.gitignore` - Version control exclusions
- `CHANGELOG.md` - This changelog file

### Infrastructure
- Updated `.vercelignore` to exclude MCP server from deployment
- Version bump from 1.1.0 to 1.2.0

## [1.1.0] - Previous Release
- Base business directory functionality
- Authentication system with NextAuth
- Prisma database integration
- Business listings and categories
- Review system
- Dashboard functionality

## [1.0.0] - Initial Release
- Initial project setup
- Core business directory features
