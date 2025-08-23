# Director Value MCP Server

A Model Context Protocol (MCP) server for the Director Value business directory application. This server provides AI assistants with tools to interact with your business data, manage listings, handle reviews, and perform administrative tasks.

## 🚀 Quick Start

1. **Navigate to the MCP directory**:
   ```bash
   cd mcp
   ```

2. **Run setup**:
   ```bash
   npm run setup
   npm install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `DATABASE_URL` to match your main project's database.

4. **Generate Prisma client and build**:
   ```bash
   npx prisma generate
   npm run build
   ```

5. **Start the server**:
   ```bash
   npm run dev  # Development mode
   # or
   npm start    # Production mode
   ```

## ⚠️ Important Notes

- **Excluded from Vercel**: This MCP server is excluded from Vercel deployment via `.vercelignore` to prevent build failures
- **Database Connection**: Uses the same database as your main application
- **Local Development**: Designed to run locally alongside your main application

## 🛠 Features

### Business Management
- **Search & Filter Businesses**: Query by name, category, location, status, plan type
- **Business Details**: Comprehensive business information with reviews and leads
- **Analytics**: Business-specific and platform-wide analytics

### Category Management
- **List Categories**: Browse category hierarchy with business counts
- **Category Details**: Get category information and associated businesses

### Review Management
- **Search Reviews**: Filter by business, user, rating, visibility
- **Review Analytics**: Review metrics and trends

### Lead Management
- **Search Leads**: Filter by business, status, priority, source
- **Lead Analytics**: Lead conversion and tracking metrics

### User Management
- **Search Users**: Find users by email, name, role, activity patterns
- **User Details**: Comprehensive user profiles with businesses and reviews
- **User Analytics**: Individual user activity and engagement metrics
- **Role Management**: Filter and analyze users by role (Admin, Business Owner, etc.)
- **Activity Tracking**: Monitor user actions, reviews, and business management

### User Management
- **Search Users**: Find users by email and role
- **User Analytics**: User activity and engagement metrics

### Analytics & Reporting
- **Platform Analytics**: Overall KPIs and metrics
- **Business Analytics**: Individual business performance
- **Trend Analysis**: Date-based filtering and analysis

## 📋 Available Tools

### Business Tools
- `search_businesses` - Search and filter business listings
- `get_business_details` - Get detailed business information

### Category Tools
- `list_categories` - List business categories with hierarchy

### Review Tools
- `search_reviews` - Search and filter reviews

### Lead Tools
- `search_leads` - Search and filter leads

### User Tools
- `search_users` - Search users by email, name, role, and activity
- `get_user_details` - Get comprehensive user information and activity
- `get_user_by_email` - Find a specific user by email address
- `get_user_analytics` - Get detailed analytics for a specific user
- `get_users_by_role` - Get all users with a specific role (Admin, Business Owner, etc.)

### Analytics Tools
- `get_analytics_summary` - Platform-wide analytics
- Plus more administrative and management tools

## 🔧 Usage with MCP Clients

### Claude Desktop
Add to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "directorvalue": {
      "command": "node",
      "args": ["c:/Projects/websites/directorvalue.com/mcp/dist/index.js"],
      "env": {
        "DATABASE_URL": "your_database_url_here"
      }
    }
  }
}
```

### Other MCP Clients
The server communicates via stdio and follows the MCP protocol specification.

## 💡 Example Queries

### Business Operations
```
"Find all VIP businesses in London"
"Show me pending business approvals"
"Get analytics for the platform this month"
"List all restaurant categories"
```

### User Management
```
"Find all users with ADMIN role"
"Show me business owners who joined this month"
"Get details for user with email john@example.com"
"Find users who have written reviews but don't own businesses"
"Show me the most active users by review count"
"Get analytics for a specific user's activity"
```

### Lead & Review Management
```
"Show recent high-priority leads"
"Find businesses with low ratings that need attention"
"List all 1-star reviews from this week"
"Show leads that haven't been contacted yet"
```

## 🔒 Security & Permissions

- Direct database access - ensure proper network security
- No built-in authentication - consider adding for production use
- Admin functions available - restrict access appropriately
- Follows your existing Prisma schema and permissions

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` matches your main project
2. **Prisma Schema**: Run setup script and `npx prisma generate` after schema changes
3. **Build Errors**: Check TypeScript compilation with `npm run typecheck`
4. **MCP Client**: Verify client configuration and server output

### Debug Mode
```bash
npm run dev  # Shows detailed logs and auto-reloads
```

## 📁 Project Structure

```
mcp/
├── src/
│   └── index.ts          # Main MCP server implementation
├── scripts/
│   └── setup.js          # Setup script to copy Prisma schema
├── prisma/
│   └── schema.prisma     # Copied from main project
├── dist/                 # Built output
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 🚧 Development

### Adding New Tools
1. Define the tool schema in the `tools` array
2. Add the handler in the `callTool` switch statement
3. Include proper validation and error handling
4. Update this README

### Building
```bash
npm run build      # Compile TypeScript
npm run typecheck  # Check types only
npm run dev        # Development with auto-reload
```

## 📖 License

Same as the main Director Value project.
