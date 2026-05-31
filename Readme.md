# 🔍 GitHub Profile Analyzer API

A REST API that analyzes any public GitHub profile using the GitHub API and stores useful insights in a MySQL database.

## 📌 Features

- Fetch and analyze any public GitHub user profile
- Stores derived insights:
  - Public repository count
  - Followers & following count
  - Total stars across all repos
  - Top 3 programming languages
  - Most active repository
  - Account age (in days)
  - Activity score (weighted metric based on followers, stars, repos)
- Upsert logic — re-analyzing a profile updates existing data, no duplicates
- Clean error handling for invalid users, rate limits, and unknown routes

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (mysql2)
- **HTTP Client**: Axios
- **Third-party API**: GitHub REST API v3

## 📁 Project Structure

```
github-analyzer/
├── src/
│   ├── controllers/
│   │   └── profileController.js   # Request handlers
│   ├── routes/
│   │   └── profileRoutes.js       # API route definitions
│   ├── services/
│   │   └── githubService.js       # GitHub API calls + insight computation
│   ├── db/
│   │   └── connection.js          # MySQL pool + connection
│   └── middleware/
│       └── errorHandler.js        # Global error handler
├── schema.sql                     # Database schema
├── .env.example                   # Environment variable template
├── index.js                       # Entry point
└── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Abhinavv-933/github-profile-analyzer.git
cd github-profile-analyzer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Fill in your values in `.env`:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=github_analyzer
GITHUB_TOKEN=your_github_token_here  # optional but recommended
```

> 💡 Get a free GitHub token at [github.com/settings/tokens](https://github.com/settings/tokens) — increases rate limit from 60 to 5000 req/hr

### 4. Setup the database
- Create a MySQL database named `github_analyzer`
- Run the schema file:
```bash
mysql -u root -p < schema.sql
```
Or paste the contents of `schema.sql` directly into MySQL Workbench and execute.

### 5. Start the server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

## 🚀 API Endpoints

### Health Check
```
GET /health
```
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

### Analyze a GitHub Profile
```
POST /api/analyze/:username
```
Fetches data from GitHub, computes insights, and stores in DB. Re-analyzing updates existing record.

**Example:** `POST /api/analyze/Abhinavv-933`

**Response:**
```json
{
  "success": true,
  "message": "Profile analyzed and stored",
  "data": {
    "username": "Abhinavv-933",
    "total_stars": 0,
    "top_languages": ["JavaScript", "TypeScript", "C++"],
    "most_active_repo": null,
    "account_age_days": 1009,
    "activity_score": 27
  }
}
```

---

### Get All Analyzed Profiles
```
GET /api/profiles
```
Returns all stored profiles sorted by most recently analyzed.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [...]
}
```

---

### Get Single Profile
```
GET /api/profiles/:username
```
Fetch a previously analyzed profile from the database.

**Example:** `GET /api/profiles/Abhinavv-933`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "Abhinavv-933",
    "name": "Abhinav Dwivedi",
    "bio": null,
    "location": null,
    "public_repos": 9,
    "followers": 2,
    "following": 3,
    "total_stars": 0,
    "top_languages": ["JavaScript", "TypeScript", "C++"],
    "most_active_repo": null,
    "profile_url": "https://github.com/Abhinavv-933",
    "account_age_days": 1009,
    "activity_score": 27,
    "analyzed_at": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### Delete a Profile
```
DELETE /api/profiles/:username
```

**Response:**
```json
{
  "success": true,
  "message": "Profile Abhinavv-933 deleted"
}
```

---

## ❌ Error Responses

| Scenario | Status | Error |
|---|---|---|
| GitHub user not found | 404 | `"GitHub user not found"` |
| GitHub rate limit hit | 403 | `"GitHub API rate limit exceeded"` |
| Profile not in DB | 404 | `"Profile not found. Analyze it first."` |
| Unknown route | 404 | `"Route not found"` |
| Server error | 500 | `"Internal server error"` |

## 🗄️ Database Schema

See [`schema.sql`](./schema.sql) for the full schema.

Key columns in the `profiles` table:

| Column | Type | Description |
|---|---|---|
| `username` | VARCHAR | Unique GitHub username |
| `public_repos` | INT | Number of public repositories |
| `followers` | INT | Follower count |
| `total_stars` | INT | Sum of stars across all repos |
| `top_languages` | JSON | Top 3 languages by repo count |
| `most_active_repo` | VARCHAR | Repo with highest stars + forks |
| `account_age_days` | INT | Days since GitHub account creation |
| `activity_score` | INT | `(followers×3) + (stars×2) + (repos×1)` |
| `analyzed_at` | TIMESTAMP | Last analysis timestamp |

## 🌐 Live API

`Coming soon`

## 👤 Author

**Abhinav Dwivedi**  
[GitHub](https://github.com/Abhinavv-933) • [Portfolio](https://portfolio-abhinav.vercel.app)