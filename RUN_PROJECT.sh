#!/usr/bin/env bash
echo "====================================================================="
echo "   THOOGUDEEPA DONNE BIRYANI MANE - ALL-IN-ONE RESTAURANT SUITE"
echo "====================================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found: $(node -v)"
echo ""

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR/customer-next"

if [ ! -d "node_modules" ]; then
    echo "First time run detected. Installing dependencies..."
    npm install
fi

echo ""
echo "Starting Next.js Development Server on Port 3001..."
echo "Available Portals:"
echo "  - Customer App:    http://localhost:3001/"
echo "  - Kitchen KDS:     http://localhost:3001/kitchen/"
echo "  - Waiter Suite:    http://localhost:3001/waiter/"
echo "  - Manager HQ:      http://localhost:3001/manager/"
echo ""

if command -v open &> /dev/null; then
    open "http://localhost:3001/"
elif command -v xdg-open &> /dev/null; then
    xdg-open "http://localhost:3001/"
fi

npm run dev
