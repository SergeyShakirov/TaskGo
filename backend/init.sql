-- Initial setup for TaskGo database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create additional indexes for better performance
-- These will be created automatically by Sequelize, but can be customized here

-- Example: Full-text search index for tasks
-- CREATE INDEX IF NOT EXISTS idx_tasks_search 
-- ON tasks USING gin(to_tsvector('russian', title || ' ' || short_description));

-- Example: Compound index for user tasks
-- CREATE INDEX IF NOT EXISTS idx_tasks_user_status 
-- ON tasks(client_id, status, created_at);

-- Example: Index for category-based queries
-- CREATE INDEX IF NOT EXISTS idx_tasks_category_priority 
-- ON tasks(category_id, priority, created_at);

-- Set timezone
SET timezone TO 'UTC';

-- Optional: Create additional schemas for future use
-- CREATE SCHEMA IF NOT EXISTS analytics;
-- CREATE SCHEMA IF NOT EXISTS logs;
