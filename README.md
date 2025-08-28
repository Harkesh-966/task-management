
# Project Setup & Deployment Guide

> Generated on 2025-08-28 UTC

## Prerequisites
- Node.js LTS (v18+ recommended)
- Git
- - AWS CLI v2 and AWS account (for backend deploy)
- AWS CDK v2 (`npm i -g aws-cdk`)

## Repository Layout
```
/backend   # API/Lambda + CDK (deploys to AWS)
/frontend  # Angular app (local dev)
```

## First-Time Setup
```bash
# clone your repo
git clone <YOUR_REPO_URL>.git
cd <your-repo>

# install dependencies
cd backend
npm install
cd ../frontend
npm install
```

---

# Backend (API / AWS CDK)
- Package: **cdk-setup**
- Lambda entry (detected): `backend/lambda/src/index.ts`
- TypeScript detected

## Environment Variables
Create a `.env` file in `/backend` (or set in your shell/CI). Keys detected in code:
- `CDK_DEFAULT_ACCOUNT=`
- `CDK_DEFAULT_REGION=`
- `IS_LOCAL=`
- `NODE_ENV=`

> Load `.env` locally using a tool like `dotenv-cli` or ensure your start script loads it. For AWS Lambda, set env vars in the CDK stack for the function.

## Run Locally
```bash
cd backend
npm run build
npm run start
# Server should print its local URL (e.g., http://localhost:3000)
```

**Available npm scripts (backend):**
- `build` → `tsc`
- `watch` → `tsc -w`
- `test` → `jest`
- `cdk` → `cdk`

## Deploy to AWS (CDK)
```bash
# one-time (per account/region)
aws configure
cd backend
# Set your default region, e.g. ap-south-1
cdk bootstrap

# synthesize & deploy
cdk synth
cdk deploy
```

- Update the stack to set Lambda environment variables as needed.
- CDK config file detected at: `backend/cdk.json`

### Troubleshooting (Backend)
- **CDK AccessDenied / BlockPublicPolicy:** Ensure your IAM user/role has permissions and S3 Block Public Access isn't blocking your deployment artifacts.
- **Lambda 404/Timeouts:** Check function logs in CloudWatch; verify the Lambda handler path matches CDK `handler` and bundling entry.
- **CORS errors:** Configure CORS on API Gateway/HttpApi and your frontend dev server proxy if needed.

---

# Frontend (Angular) — Local Only
- Angular projects detected: task-manager-angular

## Run Locally
```bash
cd frontend
npm run start
# Open the URL printed in the terminal (e.g., http://localhost:4200)
```

## Build for Production (optional)
```bash
cd frontend
npm run build
# Output will be in the dist/ directory (Angular)
```

**Available npm scripts (frontend):**
- `start` → `ng serve`
- `build` → `ng build`
- `test` → `ng test`

---

## Useful Tips
- Commit this README at repo root so teammates see it immediately.
- For stable local ports, set them via scripts or env (e.g., `PORT=3000`).
- Keep `.env` out of Git by adding it to `.gitignore`.