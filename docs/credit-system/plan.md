# Credit System Implementation Plan

## Goals

1. **✅ Daily Credit Allocation & Tracking** – automatically grant every user a fixed number of free credits every 24 h and record the allocation in an auditable ledger. **[IMPLEMENTED]**
2. **🚧 Credit Purchase System (Multiple Payment Methods)** – allow users to buy extra credits via Stripe (phase 1) and other providers later, with secure balance updates on successful payment. **[IN PROGRESS]**

---

## Implementation Status

### ✅ **COMPLETED: Daily Credit Allocation**

**Files Implemented:**
- `src/features/credits/allocation/constants/creditDefaults.ts` - Credit tiers and mock data service
- `src/features/credits/allocation/services/scheduler.ts` - Cron scheduler with node-cron
- `src/app/api/credit-reset/route.ts` - API endpoint for reset operations
- `src/features/credits/allocation/hooks/useCreditReset.ts` - React hook for state management
- `src/features/credits/allocation/components/ResetToast.tsx` - Toast notifications
- `src/features/credits/allocation/services/initScheduler.ts` - Scheduler initialization
- `src/app/layout.tsx` - Integrated scheduler startup

| Item | Implementation Detail | Status |
|------|----------------------|--------|
| Trigger | ✅ `node-cron` scheduler running at 00:00 Asia/Singapore timezone | **DONE** |
| Process | ✅ Mock `CreditService.resetAllUserCredits()` with tiered system:<br>- Free: 10 credits<br>- Premium: 50 credits<br>- Pro: 200 credits | **DONE** |
| Constants | ✅ `CREDIT_TIERS` object with configurable daily limits | **DONE** |
| Authentication | ✅ `CRON_SECRET` environment variable protection | **DONE** |
| Monitoring | ✅ Console logging, error handling, scheduler status API | **DONE** |
| Frontend Integration | ✅ React hook, toast notifications, manual reset capability | **DONE** |

**Environment Variables:**
- `CRON_SECRET` - Authentication for API calls
- `ENABLE_CREDIT_SCHEDULER=true` - Enable in development
- `NEXT_PUBLIC_APP_URL` - App URL (optional)

---

## Backend Design (Original Plan)

### 1. Daily Credit Allocation - LEGACY REFERENCE

| Item | Detail |
|------|--------|
| Trigger | Server-side cron job (e.g. Cloud scheduler / GitHub Actions / Vercel Cron) every 00:00 UTC |
| Process | 1. Fetch all `users`.<br>2. Inside a DB transaction:<br>&nbsp;&nbsp;a. `UPDATE user_credits SET balance = balance + DAILY_FREE_CREDITS WHERE user_id = ?`<br>&nbsp;&nbsp;b. `INSERT INTO credit_transactions (user_id, amount, type, metadata)` with `type = 'DAILY_ALLOCATION'`. |
| Constants | `DAILY_FREE_CREDITS = 5` (configurable via env) |
| Idempotency | Job records last‐run timestamp; skip if already executed for current date |
| Monitoring | Log success/failure, expose Prom / OpenTelemetry metrics |

### 2. Credit Purchase Flow

| Step | Endpoint / Actor | Description |
|------|------------------|-------------|
| A | `GET /api/credits/packages` | Retrieve available packages (price, credit amount) stored in `credit_packages` table or static config. |
| B | `POST /api/credits/purchase` | Authenticated request with `packageId`. Server creates Stripe Checkout Session & returns `sessionId`. |
| C | Frontend | Redirects user to Stripe Checkout using Stripe JS. |
| D | Stripe → `POST /api/webhooks/stripe` | Listen for `checkout.session.completed`. Verify signature. |
| E | Server | Inside DB transaction:<br>1. Map `session.customer_email` → `user_id`.<br>2. Increment `user_credits.balance` by package amount.<br>3. Insert `credit_transactions` with `type = 'PURCHASE'` & provider metadata. |
| F | Frontend | Stripe redirects to `/purchase/success` or `/purchase/cancel`. Success page triggers balance refresh and shows snackbar. |

Security notes:
* Webhook endpoint protected with Stripe signing secret.
* All balance changes wrapped in DB transactions & use row-level locking to avoid race conditions.

---

## Database Touch-Points

### Tables / Collections
* **PostgreSQL**
  * `user_credits (user_id PK, balance INT NOT NULL DEFAULT 0)`
  * `credit_transactions (id PK, user_id FK, amount INT, type ENUM, provider JSONB, created_at TIMESTAMPTZ)`
* **MongoDB**
  * No change; reporting data can be mirrored if needed.

### Enum `credit_transactions.type`
`DAILY_ALLOCATION`, `PURCHASE`, `MANUAL_ADJUST`, `CONSUMPTION`

---

## Frontend Work

1. `useUserCredits` hook – fetch & subscribe to current balance.
2. Navigation badge – show remaining credits.
3. `BuyCredits.tsx` – list packages, call purchase endpoint, handle redirect.
4. Success & cancel pages with friendly messaging.
5. Snackbar (`ConversionSnackBar.tsx`) to confirm balance updates.

---

---

## 🚧 **MISSING COMPONENTS & FUTURE WORK**

### **Critical Missing for Database Integration:**
1. **Database Schema Implementation**
   - Replace mock `CreditService` with actual PostgreSQL/MongoDB queries
   - Implement `user_credits` and `credit_transactions` tables
   - Add proper foreign key relationships and indexes

2. **Idempotency & Transaction Safety**
   - Add last-run timestamp tracking to prevent duplicate resets
   - Implement proper database transactions for atomic operations
   - Add row-level locking to prevent race conditions

3. **User Authentication Integration**
   - Connect with actual user authentication system
   - Map authenticated users to credit records
   - Handle user creation/deletion scenarios

### **Credit Purchase System (Not Started):**
- `GET /api/credits/packages` endpoint
- `POST /api/credits/purchase` with Stripe integration
- Stripe webhook handler at `/api/webhooks/stripe`
- Frontend purchase flow components
- Success/cancel pages

### **Frontend Integration Gaps:**
- `useUserCredits` hook for balance fetching
- Navigation badge showing remaining credits
- Credit consumption tracking in app features
- Balance refresh after purchases

### **Production Considerations:**
1. **Monitoring & Alerting**
   - Prometheus/OpenTelemetry metrics
   - Failed reset notification system
   - Credit balance monitoring dashboards

2. **Testing Infrastructure**
   - Unit tests for scheduler and API endpoints
   - Integration tests for credit reset flow
   - Load testing for concurrent reset operations

3. **Deployment & Scaling**
   - Ensure single scheduler instance in multi-server deployments
   - Database connection pooling for reset operations
   - Graceful scheduler shutdown handling

---

## Ops / Dev Notes

### **Current Environment Variables:**
* `CRON_SECRET` - API authentication token
* `ENABLE_CREDIT_SCHEDULER` - Enable scheduler in development
* `NEXT_PUBLIC_APP_URL` - Application URL for API calls

### **Future Environment Variables:**
* `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Payment processing
* `DATABASE_URL` - Database connection string
* `DAILY_FREE_CREDITS` - Configurable daily credit amounts

### **Testing Strategy:**
* Use Stripe test keys for payment testing
* Write integration tests for webhook & cron job
* Mock time for scheduler testing
* Database transaction testing

### **Future Enhancements:**
* PayPal & Apple Pay integration via Stripe
* Promotional bonus credits system
* Tiered subscription plans
* Credit expiration policies
* Usage analytics and reporting
