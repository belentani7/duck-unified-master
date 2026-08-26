#!/bin/bash

# Duck Studio Build Script

set -e

echo "🦆 Building Duck Studio..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Type checking
echo "🔍 Type checking..."
pnpm check

# Linting
echo "✨ Linting..."
pnpm format --check

# Testing
echo "🧪 Running tests..."
pnpm test --run

# Build
echo "🔨 Building application..."
pnpm build

echo "✅ Build complete!"
echo "📦 Dist ready at: ./dist"
