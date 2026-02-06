# Client Requirements & System Specification: QR-Based Verification System

## 1. Executive Summary

The client requires a **secure, digital verification system** for visa applications, modeled after high-standard government systems like NADRA/PakVisa. The core objective is to replace manual, easily forged paper verification with a **tamper-proof digital handshake**: a QR code that, when scanned, instantly verifies the authenticity of a document against a centralized, secure database.

## 2. Client Vision & Desired User Experience

### From the Client's Perspective (The Admin/Govt Body)

- **Problem:** Paper visas can be forged. Manual checking is slow and prone to error.
- **Solution:** A system where every valid application has a cryptographic-like link (QR code) to the truth (the database).
- **Key Requirement:** "Tamper-proof." The QR code itself must not contain the data (which could be modified). It must contain a _pointer_ (URL) to the official server.
- **Brand Image:** The system must look professional, trustworthy, and modern (Glassmorphism, clean UI).

### From the End-User's Perspective (The Applicant)

1.  **Submission:** I visit the portal, fill out my details (Passport, Dates, etc.), and hit submit.
2.  **Instant Gratification:** I immediately get a digital receipt – a reference number and a unique QR code.
3.  **Usage:** I can save this image. When I travel, an official simply scans my phone.
4.  **Trust:** I see my data on the official verification page, proving my visa is valid.

### From the Verifier's Perspective (Border Control/Official)

1.  **Action:** I see a traveler with a visa/QR code.
2.  **Verification:** I scan it with any standard smartphone camera or QR scanner.
3.  **Result:** The official domain (`verify.yoursystem.com`) loads. I see "Verified ✅" and the _actual_ database records, not what is printed on the paper.
4.  **Security:** I see specific security markers (e.g., partial passport masking) that match the physical document I'm holding.

---

## 3. Technical System Flow

### Phase 1: Data Ingestion (Application Submission)

1.  **User Input:** Client submits form via `POST /api/applications`.
2.  **Validation:** Server validates all fields (e.g., strict regex for Passport Numbers, ISO8601 for Dates).
3.  **Reference Generation:** System generates a unique, human-readable ID (e.g., `VIS-2026-X9Y8Z7`).
    - _Logic ensures no duplicates (collision checks)._
4.  **QR Strategy:**
    - **Bad Approach:** Encoding JSON data in QR. (Insecure, easy to forge).
    - **Our Approach:** Encoding a **Verification URL** in QR.
    - _Payload:_ `https://yourdomain.com/verify.html?ref=VIS-2026-X9Y8Z7`
5.  **Persistence:** Data + Metadata (IP, Timestamp) saved to MongoDB.
6.  **Response:** Client receives the Reference ID and the generic Base64 QR Image.

### Phase 2: Verification (The "Handshake")

1.  **Trigger:** QR Code is scanned. Browser opens the embedded URL.
2.  **Frontend Logic:** `verify.html` parses the `?ref=` query parameter.
3.  **API Call:** Frontend calls `GET /api/verify/:refNumber`.
4.  **Backend Logic:**
    - Database lookup for `referenceNumber`.
    - **Security Check:** Is the application `isActive`? Has it been revoked?
    - **Audit Logging:** Backend increments `verificationCount` and timestamps `lastVerifiedAt`. (Crucial for detecting suspicious activity—e.g., a single visa verified 500 times in 1 hour).
    - **Privacy Filtering:** Sensitive data (full Passport Number) is **masked** (e.g., `AB*****89`) before sending to frontend.
5.  **Display:** Frontend renders the "Verified" badge and details.

---

## 4. Edge Case Handling (The "What Ifs")

The system is designed to handle failure states gracefully and securely.

### 🔴 Security Edge Cases

| Scenario                                                                | System Response                                                                                                             |
| :---------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **Forged QR Code:** Attacker creates a fake QR pointing to a fake site. | **Mitigation:** Verification URL is physically checked. SSL/TLS (HTTPS) provides domain assurance.                          |
| **Brute Force Attack:** Bot tries to guess Reference Numbers.           | **Mitigation:** Rate Limiting (100 daily reqs/IP). Reference IDs are non-sequential (partially random) to prevent guessing. |
| **Tampered URL:** User changes `?ref=VIS-123` to `?ref=VIS-999`.        | **Mitigation:** Backend returns 404 Not Found. Frontend displays large red "Verification Failed" error.                     |
| **Data Scraping:** Competitor tries to scrape all visas.                | **Mitigation:** Passport numbers are masked. Only essential verification info is shown.                                     |

### 🟡 Functional Edge Cases

| Scenario                                                | System Response                                                                                           |
| :------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Database Down:** MongoDB connection lost.             | **Response:** API returns 500 Error. Frontend shows "System Temporarily Unavailable" (not a raw crash).   |
| **Invalid Input:** User enters future birth date.       | **Response:** API Validator rejects request with specific error: "Date of Birth cannot be in the future." |
| **Network Slow:** QR scan on bad verification internet. | **Response:** Frontend shows loading spinner skeleton UI until timeout.                                   |

---

## 5. Technology Stack Implementation Details

### Backend: Node.js + Express

- **Why:** High performance for I/O heavy operations (handling thousands of concurrent verifications).
- **Structure:** MVC (Model-View-Controller) for clean code separation.
- **Security Middleware:**
  - `Helmet`: Hides server info (Prevents "X-Powered-By" attacks).
  - `Cors`: Restricts API access to trusted domains.
  - `Express-Rate-Limit`: Anti-DDoS protection.

### Database: MongoDB (NoSQL)

- **Why:** Flexible schema allows easy addition of new visa fields (e.g., "Vaccination Status") without breaking existing records.
- **Schema Design:**
  - `referenceNumber`: Indexed (Unique) for O(1) fast lookup speeds.
  - `verificationToken`: Internal-only field for future advanced crypto-validation.
  - `logs`: Embedded array for tracking history.

### Frontend: Vanilla JS + CSS3

- **Why:** "Simple web pages" requirement. React/Angular would be overkill and increase load times for simple verification on mobile data.
- **Design:** Glassmorphism (Translucent cards) to convey "Modern/High-Tech" feel requested by client.

---

## 6. Deployment & Deliverable Strategy

To satisfy the client's request for a "ready-to-handover" project:

1.  **Environment Agnostic:** Uses `.env` for configuration. API URLs change dynamically between Dev (`localhost`) and Prod (`api.gov.xx`) without code changes.
2.  **Documentation:** `README.md` includes simple usage instructions for non-technical client staff.
3.  **Portability:** The entire system is Docker-ready (conceptually) and runs with a simple `npm start`.

This specification covers the full breadth of the client's request, from the high-level user need to the low-level database index strategy.
