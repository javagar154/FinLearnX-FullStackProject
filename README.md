# 🚀 FinLearnX – Personal Finance Learning & Trading Simulator

A production-ready full-stack fintech SaaS platform combining financial education, stock trading simulation, SIP planning, budget tracking, and portfolio analytics.

---

## 🎯 Features

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | JWT login/signup, protected routes, BCrypt encryption |
| 📊 **Dashboard** | Portfolio overview, P&L analytics, market movers, charts |
| 📈 **Stock Simulator** | 50+ Indian & global stocks, live price simulation, buy/sell |
| 💼 **Portfolio** | Holdings tracker, sector allocation, P&L per stock |
| 🧮 **SIP Calculator** | Monthly/lumpsum calculator, wealth growth charts, comparison table |
| 💳 **Budget Tracker** | Expense categories, circular progress, monthly reports |
| 📚 **Learning Hub** | 6 finance courses, PDF-style viewer, progress tracking |
| 🧠 **Quiz System** | MCQ quizzes, score calculation, completion certificates |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — SPA with React Router v6
- **Recharts** — Interactive financial charts
- **Framer Motion** — Smooth animations
- **React Circular Progressbar** — Budget progress indicators
- **React Toastify** — Notifications

### Backend
- **Spring Boot 3.2** — REST API
- **Spring Security + JWT** — Authentication & authorization
- **Spring Data JPA + Hibernate** — ORM
- **PostgreSQL** — Relational database
- **BCrypt** — Password encryption
- **Lombok** — Boilerplate reduction

### DevOps
- **Docker + Docker Compose** — Containerization
- **AWS** — Cloud deployment (ECS, RDS, S3, CloudFront)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL 15+
- Maven 3.9+

### 1. Clone & Setup Database
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE finlearnx;"
psql -U postgres -d finlearnx -f backend/src/main/resources/schema.sql
```

### 2. Configure Backend
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/finlearnx
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 3. Run Backend
```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### 4. Run Frontend
```bash
cd frontend
npm install
npm start
# App available at http://localhost:3000
```

### 5. Docker Compose (All-in-one)
```bash
# Update password in docker-compose.yml, then:
docker-compose up --build
# App: http://localhost:3000
# API: http://localhost:8080
```

---

## 🔑 Demo Login
```
Email: demo@finlearnx.com
Password: demo123
```
Or click **"Try Demo Account"** on the login page.

---

## 📁 Project Structure

```
FinLearnX/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── pages/               # Dashboard, Stocks, SIP, Budget, Learn, Quiz, Portfolio
│   │   ├── components/          # Layout (Sidebar, Topbar), Common
│   │   ├── context/             # AuthContext
│   │   ├── data/                # stocks.js, courses.js (50+ stocks, 6 courses)
│   │   └── services/            # Axios API client
│   ├── Dockerfile
│   └── nginx.conf
│
├── backend/                     # Spring Boot API
│   └── src/main/java/com/finlearnx/
│       ├── controller/          # Auth, Trading, Expense, SIP, Quiz, User, Stock
│       ├── service/             # Business logic layer
│       ├── entity/              # JPA entities (User, Portfolio, Transaction, Expense...)
│       ├── repository/          # Spring Data JPA repositories
│       ├── security/            # JWT filter, SecurityConfig, UserDetailsService
│       ├── dto/                 # Request/Response DTOs
│       └── exception/           # Global exception handler
│
├── aws/                         # AWS deployment guide
├── docker-compose.yml
└── README.md
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |

### Trading
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/trading/trade` | Buy or sell stock |
| GET | `/api/trading/portfolio` | Get holdings |
| GET | `/api/trading/transactions` | Transaction history |
| GET | `/api/trading/wallet` | Wallet balance |

### Stocks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/public/list` | All stocks (live prices) |
| GET | `/api/stocks/public/{symbol}` | Single stock |
| GET | `/api/stocks/public/{symbol}/history` | Price history |

### SIP Calculator
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sip/calculate` | Calculate SIP returns |
| POST | `/api/sip/save` | Save calculation |
| GET | `/api/sip/history` | Saved calculations |

### Budget / Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/expenses` | Add expense |
| GET | `/api/expenses` | All expenses |
| GET | `/api/expenses/categories` | Category totals |
| DELETE | `/api/expenses/{id}` | Delete expense |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/submit` | Submit quiz answers |
| GET | `/api/quiz/results` | All quiz results |
| GET | `/api/quiz/results/{courseId}` | Best result for course |

---

## 🎨 Design System

- **Background**: Deep navy `#0a0a1a`
- **Cards**: Glassmorphism with `backdrop-filter: blur(20px)`
- **Profit**: Neon green `#00ff88`
- **Loss**: Red `#ff4757`
- **Accent**: Indigo `#6366f1` + Purple `#8b5cf6`
- **Font**: Inter / Outfit
- **Radius**: 12px–20px rounded corners

---

## 📚 Courses Available

1. 📈 SIP Basics & Mutual Funds
2. 📊 Stock Market Fundamentals
3. ₿ Cryptocurrency Basics
4. 💰 Budget Planning & Personal Finance
5. 🛡️ Risk Management in Investing
6. 🏆 Financial Discipline & Wealth Building

---

## 🌐 AWS Deployment

See [`aws/deploy.md`](aws/deploy.md) for full deployment guide using:
- **ECS Fargate** for backend containers
- **RDS PostgreSQL** for managed database
- **S3 + CloudFront** for frontend CDN
- **Secrets Manager** for credentials

---

## 📄 License

MIT License — Free to use for educational and commercial purposes.

---

Built with ❤️ for financial literacy and learning.
