#!/bin/bash

# Duck Studio Database Setup Script

set -e

echo "🦆 Setting up Duck Studio Database..."

# Check MySQL connection
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL client not found. Install MySQL or use Docker."
    exit 1
fi

# Load .env
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

DB_URL=${DATABASE_URL}
DB_USER=$(echo $DB_URL | sed 's/.*:\/\/\([^:]*\).*/\1/')
DB_PASS=$(echo $DB_URL | sed 's/.*:\/\/[^:]*:\([^@]*\).*/\1/')
DB_HOST=$(echo $DB_URL | sed 's/.*@\([^:]*\).*/\1/')
DB_NAME=$(echo $DB_URL | sed 's/.*\/\([^?]*\).*/\1/')

echo "📍 Connecting to: $DB_HOST"
echo "📊 Database: $DB_NAME"

# Create database
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

echo "✅ Database created"

# Run migrations
pnpm db:push

echo "✅ Migrations applied"

# Seed data
if [ -f scripts/seed.ts ]; then
    pnpm tsx scripts/seed.ts
    echo "✅ Seed data loaded"
fi

echo "✨ Database setup complete!"
