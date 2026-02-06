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
├── public/
│   ├── index.html            # Application form
│   ├── verify.html           # Verification page
│   ├── css/styles.css        # Styling
│   └── js/                   # Frontend scripts
└── package.json
```

## Security

- Rate limiting: 100 requests per 15 minutes
- Helmet.js security headers
- Input validation with express-validator
- Passport number masking in verification
- QR code contains only URL, not actual data

## License

MIT
