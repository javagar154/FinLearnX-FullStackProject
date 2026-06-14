-- FinLearnX Complete Database Schema v2
-- PostgreSQL

-- ─── Users ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    password        VARCHAR(255)  NOT NULL,
    role            VARCHAR(20)   NOT NULL DEFAULT 'USER',
    wallet_balance  DECIMAL(15,2) NOT NULL DEFAULT 100000.00,
    active          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP
);

-- ─── Portfolio ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolios (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol        VARCHAR(20)   NOT NULL,
    stock_name    VARCHAR(200)  NOT NULL,
    quantity      INTEGER       NOT NULL CHECK (quantity > 0),
    average_price DECIMAL(15,4) NOT NULL,
    created_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP,
    UNIQUE(user_id, symbol)
);

-- ─── Transactions ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    symbol       VARCHAR(20)   NOT NULL,
    stock_name   VARCHAR(200)  NOT NULL,
    type         VARCHAR(10)   NOT NULL CHECK (type IN ('BUY','SELL')),
    quantity     INTEGER       NOT NULL CHECK (quantity > 0),
    price        DECIMAL(15,4) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    created_at   TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Expenses ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category    VARCHAR(50)   NOT NULL,
    description VARCHAR(255)  NOT NULL,
    amount      DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    date        DATE          NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Income ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS income (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monthly_amount DECIMAL(12,2) NOT NULL CHECK (monthly_amount > 0),
    updated_at     TIMESTAMP     NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ─── SIP History ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sip_history (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monthly_amount   DECIMAL(12,2) NOT NULL,
    annual_rate      DECIMAL(5,2)  NOT NULL,
    duration_years   INTEGER       NOT NULL,
    total_invested   DECIMAL(15,2) NOT NULL,
    expected_returns DECIMAL(15,2) NOT NULL,
    future_corpus    DECIMAL(15,2) NOT NULL,
    calculated_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Quiz Results ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_results (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id       VARCHAR(100)  NOT NULL,
    score           INTEGER       NOT NULL,
    total_questions INTEGER       NOT NULL,
    percentage      DECIMAL(5,2)  NOT NULL,
    passed          BOOLEAN       NOT NULL,
    completed_at    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── Course Progress ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_progress (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id        VARCHAR(100) NOT NULL,
    progress_percent INTEGER      NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    pages_read       INTEGER      NOT NULL DEFAULT 0,
    completed        BOOLEAN      NOT NULL DEFAULT FALSE,
    quiz_score       INTEGER,
    last_accessed_at TIMESTAMP    NOT NULL DEFAULT NOW(),
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ─── Premium Unlocks ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS premium_unlocks (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id      VARCHAR(100)  NOT NULL,
    payment_status VARCHAR(20)   NOT NULL DEFAULT 'COMPLETED',
    amount_paid    DECIMAL(10,2) NOT NULL DEFAULT 100.00,
    unlocked_at    TIMESTAMP     NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

-- ─── Notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(20)  NOT NULL DEFAULT 'info',
    title      VARCHAR(200) NOT NULL,
    message    VARCHAR(500) NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_portfolios_user       ON portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user     ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created  ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user         ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date         ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_sip_history_user      ON sip_history(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user     ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user  ON course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_unlocks_user  ON premium_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read    ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);
