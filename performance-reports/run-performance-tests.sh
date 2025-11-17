#!/bin/bash

# Performance Testing Script for Book.tsx CRO Implementation
# Usage: ./run-performance-tests.sh

set -e

echo "========================================"
echo "Book.tsx Performance Testing Suite"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running from correct directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must run from project root${NC}"
    exit 1
fi

# Step 1: Build the project
echo -e "${YELLOW}[1/5] Building project...${NC}"
npm run build

# Step 2: Start preview server in background
echo -e "${YELLOW}[2/5] Starting preview server...${NC}"
npm run preview &
PREVIEW_PID=$!
sleep 5

# Step 3: Wait for server to be ready
echo -e "${YELLOW}[3/5] Waiting for server...${NC}"
max_attempts=20
attempt=0
while ! curl -s http://localhost:4173 > /dev/null; do
    sleep 1
    attempt=$((attempt + 1))
    if [ $attempt -gt $max_attempts ]; then
        echo -e "${RED}Error: Server did not start${NC}"
        kill $PREVIEW_PID 2>/dev/null || true
        exit 1
    fi
done
echo -e "${GREEN}Server ready!${NC}"

# Step 4: Run Lighthouse audits
echo -e "${YELLOW}[4/5] Running Lighthouse audits...${NC}"

# Desktop audit
echo "Running desktop audit for /book..."
npx lighthouse http://localhost:4173/book \
    --preset=desktop \
    --output=html \
    --output-path=./performance-reports/lighthouse-book-desktop.html \
    --quiet

# Mobile audit
echo "Running mobile audit for /book..."
npx lighthouse http://localhost:4173/book \
    --preset=mobile \
    --output=html \
    --output-path=./performance-reports/lighthouse-book-mobile.html \
    --quiet

# Home page for comparison
echo "Running desktop audit for / (comparison)..."
npx lighthouse http://localhost:4173/ \
    --preset=desktop \
    --output=html \
    --output-path=./performance-reports/lighthouse-home-desktop.html \
    --quiet

echo -e "${GREEN}Lighthouse audits complete!${NC}"

# Step 5: Run Lighthouse CI (if configured)
if command -v lhci &> /dev/null && [ -f ".lighthouserc.json" ]; then
    echo -e "${YELLOW}[5/5] Running Lighthouse CI...${NC}"
    npx lhci autorun --config=.lighthouserc.json || true
else
    echo -e "${YELLOW}[5/5] Skipping Lighthouse CI (not configured)${NC}"
fi

# Cleanup
echo ""
echo -e "${YELLOW}Cleaning up...${NC}"
kill $PREVIEW_PID 2>/dev/null || true

# Results
echo ""
echo "========================================"
echo -e "${GREEN}Performance Testing Complete!${NC}"
echo "========================================"
echo ""
echo "Reports generated:"
echo "  - performance-reports/lighthouse-book-desktop.html"
echo "  - performance-reports/lighthouse-book-mobile.html"
echo "  - performance-reports/lighthouse-home-desktop.html"
echo ""
echo "View reports:"
echo "  open performance-reports/lighthouse-book-desktop.html"
echo ""
echo "Manual tests:"
echo "  1. Scroll performance: open performance-reports/scroll-performance-test.html"
echo "  2. Visual inspection: npm run dev (check sticky CTA, sidebar, etc.)"
echo ""
echo "Next steps:"
echo "  1. Review lighthouse reports (target: Performance >90)"
echo "  2. Check Core Web Vitals (LCP <2.5s, CLS <0.1, INP <200ms)"
echo "  3. Test on real mobile devices"
echo "  4. Compare with baseline (original Book.tsx)"
echo ""
