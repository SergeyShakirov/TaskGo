# Starts the backend server (Node.js/Express)
Write-Host "[TaskGo] Starting backend server..."
cd ../backend
npx cross-env NODE_ENV=development npx ts-node src/index.ts
