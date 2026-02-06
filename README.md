# QR-Based Visa/Application Verification System

A secure, tamper-proof QR-based verification system similar to PakVisa/NADRA online verification.

## Features

- ✅ Online visa application form
- ✅ Automatic QR code generation
- ✅ Unique reference numbers (VIS-YYYY-XXXXXX format)
- ✅ Public verification page
- ✅ Passport number masking for privacy
- ✅ Verification count tracking
- ✅ Rate limiting & security headers
- ✅ Input validation

## Quick Start

### Prerequisites

- **Node.js** (v16+)
- **MongoDB** (running locally or MongoDB Atlas)

### Installation

```bash
# Clone or navigate to project
cd "Qr based identification system"

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
# Configure your MongoDB URI

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/qr_verification
BASE_URL=http://localhost:3000
NODE_ENV=development
```

## Usage

### 1. Submit Application

Open http://localhost:3000 and fill out the visa application form.

### 2. Receive QR Code

After submission, you'll receive:

- A unique reference number (e.g., `VIS-2026-A3B2C1`)
- A QR code containing the verification URL

### 3. Verify Application

Scan the QR code or visit the verification URL to see authenticated application details.

## API Endpoints

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/applications`            | Submit new application |
| GET    | `/api/verify/:referenceNumber` | Verify application     |

## Project Structure

```
├── server/
│   ├── config/db.js          # MongoDB connection
│   ├── models/Application.js # Schema
│   ├── controllers/          # Business logic
│   ├── routes/               # API routes
│   └── server.js             # Express app
├── public/                 # Frontend
│   ├── index.html            # Application form
│   ├── verify.html           # Verification page
│   ├── css/styles.css        # Styling
│   └── js/                   # Frontend scripts
└── package.json
```

## 🤝 Collaboration Guide

How to work with a partner on this project.

### 1. Shared Database (Recommended)

To ensure you and your partner see the same data:

1. Go to **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** and create a free account.
2. Create a new Cluster (FREE tier).
3. In **Database Access**, create a user (e.g., `admin`) and password.
4. In **Network Access**, allow access from anywhere (`0.0.0.0/0`) for development.
5. Get the connection string (Driver: Node.js) which looks like:
   `mongodb+srv://admin:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority`
6. **Both partners** must paste this string into their local `.env` file as `MONGODB_URI`.

### 2. Git Workflow

1. **Clone** the repo:
   ```bash
   git clone https://github.com/SaadAhmadCS/Qr-based-identification-system.git
   ```
2. **Before starting work**, always pull latest changes:
   ```bash
   git pull origin main
   ```
3. **Make changes**, then commit and push:
   ```bash
   git add .
   git commit -m "Added new feature"
   git push origin main
   ```

## 🚀 Deployment

### Option 1: Render (Easiest)

1. Push your code to GitHub.
2. Go to **[Render.com](https://render.com)** and sign up.
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: (Your Atlas connection string)
   - `NODE_ENV`: `production`
   - `BASE_URL`: (Your Render URL, e.g., `https://myapp.onrender.com`)

### Option 2: Railway

Similar to Render, simply connect GitHub and add variables.

## Security

- Rate limiting: 100 requests per 15 minutes
- Helmet.js security headers
- Input validation with express-validator
- Passport number masking in verification
- QR code contains only URL, not actual data

## License

MIT
