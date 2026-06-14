# FinLearnX – API Testing Guide with Postman

## Setup

### 1. Import Collection
1. Open Postman → Import → Upload `FinLearnX_API_Collection.json`
2. Collection variables are pre-configured: `baseUrl` and `token`

### 2. Start Backend
```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### 3. Setup PostgreSQL
```sql
CREATE DATABASE finlearnx;
```
Update `application.properties` with your DB credentials.

---

## Testing Workflow

### Step 1 — Authentication
Run in order:
1. **Register User** → Creates account, auto-saves JWT token
2. **Login User** → Gets JWT, auto-saves to `{{token}}` variable
3. **Unauthorized Access** → Verify 401 without token

### Step 2 — Stock Simulator
1. **Get All Stocks** → Public endpoint, no auth needed
2. **Buy Stock** → Uses saved JWT token
3. **Sell Stock** → Verify P&L calculation
4. **Buy - Insufficient Balance** → Verify 400 error
5. **Get Portfolio** → Verify holdings updated
6. **Get Transactions** → Verify trade history

### Step 3 — Budget Tracker
1. **Add Expense** → Add Food expense
2. **Add Expense - Validation** → Verify 400 for invalid data
3. **Get All Expenses** → Verify list
4. **Get Category Totals** → Verify aggregation
5. **Delete Expense** → Verify removal

### Step 4 — SIP Calculator
1. **Calculate SIP** → Verify future corpus > total invested
2. **Validation Error** → Verify 400 for invalid inputs
3. **Save Calculation** → Persist to DB
4. **Get History** → Verify saved calculations

### Step 5 — Learning Hub
1. **Save Progress (60%)** → Partial progress
2. **Complete Course (100%)** → Triggers completion notification
3. **Submit Quiz - Pass** → Score ≥ 60%, badge earned
4. **Submit Quiz - Fail** → Score < 60%
5. **Get Progress Map** → All course progress

### Step 6 — Premium Courses (Individual Unlock)
1. **Get Unlocked** → Initially empty
2. **Check Access** → Returns `unlocked: false`
3. **Unlock value-investing** → Only this course unlocked
4. **Check Access Again** → Returns `unlocked: true`
5. **Unlock wealth-psychology** → Second course unlocked
6. **Verify trading-psychology Still Locked** → Individual unlock confirmed

### Step 7 — Notifications
1. **Get All** → Should have notifications from trades/unlocks
2. **Get Unread** → Only unread ones
3. **Get Count** → Unread count number
4. **Mark All Read** → Mark as read
5. **Verify Count = 0** → Confirm all read
6. **Clear All** → Delete all notifications

### Step 8 — Global Search
1. **Search SIP** → Returns SIP courses
2. **Search RELIANCE** → Returns stock
3. **Search premium** → Returns premium courses
4. **Search nothing** → Returns empty results

---

## Expected HTTP Status Codes

| Scenario | Status |
|----------|--------|
| Successful operation | 200 OK |
| Resource created | 200 OK (or 201) |
| Validation error | 400 Bad Request |
| Unauthorized (no token) | 401 Unauthorized |
| Forbidden (wrong role) | 403 Forbidden |
| Resource not found | 400 Bad Request |
| Server error | 500 Internal Server Error |

---

## Running All Tests

In Postman:
1. Click collection name → **Run Collection**
2. Select all requests
3. Click **Run FinLearnX API Collection**
4. View results — all tests should pass ✅

---

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `baseUrl` | `http://localhost:8080/api` | Backend base URL |
| `token` | Auto-set on login | JWT Bearer token |

---

## API Endpoints Summary

### Authentication
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/health` | No |

### User
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/user/profile` | Yes |
| PUT | `/api/user/profile` | Yes |

### Stocks
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/stocks/public/list` | No |
| GET | `/api/stocks/public/{symbol}` | No |
| GET | `/api/stocks/public/{symbol}/history` | No |
| POST | `/api/trading/trade` | Yes |
| GET | `/api/trading/portfolio` | Yes |
| GET | `/api/trading/transactions` | Yes |
| GET | `/api/trading/wallet` | Yes |

### Budget
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/expenses` | Yes |
| GET | `/api/expenses` | Yes |
| GET | `/api/expenses/categories` | Yes |
| GET | `/api/expenses/total` | Yes |
| DELETE | `/api/expenses/{id}` | Yes |

### SIP
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/sip/calculate` | Yes |
| POST | `/api/sip/save` | Yes |
| GET | `/api/sip/history` | Yes |

### Courses
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/courses/progress` | Yes |
| POST | `/api/courses/progress/{courseId}` | Yes |
| POST | `/api/courses/quiz/{courseId}` | Yes |
| GET | `/api/courses/progress/list` | Yes |

### Premium
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/premium/unlock/{courseId}` | Yes |
| GET | `/api/premium/unlocked` | Yes |
| GET | `/api/premium/check/{courseId}` | Yes |

### Notifications
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/notifications` | Yes |
| GET | `/api/notifications/unread` | Yes |
| GET | `/api/notifications/count` | Yes |
| PUT | `/api/notifications/read-all` | Yes |
| PUT | `/api/notifications/{id}/read` | Yes |
| DELETE | `/api/notifications` | Yes |

### Quiz
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/quiz/submit` | Yes |
| GET | `/api/quiz/results` | Yes |
| GET | `/api/quiz/results/{courseId}` | Yes |

### Search
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/search/public?q={query}` | No |
| GET | `/api/search?q={query}` | Yes |
