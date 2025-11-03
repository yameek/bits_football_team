# Football Team Treasury - Development Todo List

## Project Overview
Backend-first development using NestJS, PostgreSQL (Docker), TypeORM with native execution (npm run dev) for fast iteration.

**Current Status**: Step 7 Complete - Session Finalization Logic Implemented ✅

---

## ✅ Completed Tasks (Steps 1-7)

### Step 1: ✅ Setup NestJS + Docker
- [x] Initialize NestJS project with TypeScript
- [x] Configure PostgreSQL 17-alpine in Docker (port 5432)
- [x] Setup environment variables (.env)
- [x] Create database schema with init-db.sql
- [x] Backend runs natively on port 3000 (hot-reload enabled)
- [x] Docker only runs PostgreSQL database

### Step 2: ✅ Configure Swagger/OpenAPI
- [x] Setup Swagger UI at `/api` endpoint
- [x] Configure API documentation with tags
- [x] Add security schemes (for future auth)
- [x] Add validation examples to DTOs
- [x] Interactive API testing available at http://localhost:3000/api

### Step 3: ✅ Create TypeORM Entities
- [x] Define 8 entities with proper relations:
  - Member (balance tracking, status)
  - Field (GPS coordinates, Google Maps link)
  - Category (transaction categories with colors)
  - Session (practice/match with cost breakdown)
  - Attendance (present/late/absent with charges)
  - Transaction (contributions, fees, payments)
  - User (for future authentication)
  - AuditLog (for future audit trail)
- [x] Add enums: SessionType, SessionStatus, AttendanceStatus, TransactionType, TransactionMethod
- [x] Configure relations: ManyToOne, OneToMany
- [x] Database initialized with 5 sample categories

### Step 4: ✅ Members Module - CRUD + Contributions
- [x] Create DTOs: CreateMemberDto, UpdateMemberDto, AddContributionDto
- [x] Implement MembersService with 9 operations
- [x] Implement MembersController with Swagger decorators
- [x] **Endpoints (9 total)**:
  - `POST /members` - Create new member
  - `GET /members` - Get all members
  - `GET /members/:id` - Get member by ID
  - `PUT /members/:id` - Update member
  - `DELETE /members/:id` - Delete member
  - `POST /members/:id/contributions` - Add contribution (increases balance)
  - `GET /members/:id/transactions` - View member transaction history
  - `GET /members/:id/attendance` - View member attendance records
  - `GET /members/team-balance` - Get team balance summary
- [x] **Tested**: Created 3 members, added $100 contribution to Bob Wilson

### Step 5: ✅ Fields & Categories Modules
- [x] **Fields Module**:
  - GPS coordinates validation (latitude: -90 to 90, longitude: -180 to 180)
  - Google Maps link support
  - Full CRUD operations (5 endpoints)
- [x] **Categories Module**:
  - Color validation with regex (#RRGGBB format)
  - Transaction categorization for reporting
  - Full CRUD operations (5 endpoints)
- [x] **Tested**: Created 1 field (Central Stadium) and 6 categories (5 sample + Equipment)

### Step 6: ✅ Sessions Module - CRUD + Attendance
- [x] Create DTOs: CreateSessionDto, UpdateSessionDto, BulkAttendanceDto, OnFieldCollectionDto
- [x] Implement SessionsService with complex business logic
- [x] Implement SessionsController with 10 endpoints
- [x] **Endpoints (10 total)**:
  - `POST /sessions` - Create session with field and cost breakdown
  - `GET /sessions` - Get all sessions (filters: status, from date, to date)
  - `GET /sessions/:id` - Get session by ID with field relation
  - `PUT /sessions/:id` - Update session (blocked if completed)
  - `DELETE /sessions/:id` - Delete session (blocked if completed)
  - `POST /sessions/:id/attendance/bulk` - Mark attendance for multiple members
  - `GET /sessions/:id/attendance` - Get attendance records with member details
  - `POST /sessions/:id/onfield-collection` - Record on-field payments (members/guests)
  - `GET /sessions/:id/total-cost` - Calculate total session cost
  - `POST /sessions/:id/finalize` - Finalize session and charge attendees
- [x] **Tested**: Created 2 sessions, marked attendance, recorded on-field payments

### Step 7: ✅ Session Finalization Logic
- [x] Implement `finalizeSession()` method with business rules
- [x] **BR-01**: Calculate per-head fee (total cost / number of attendees)
- [x] **BR-02**: Round to nearest $0.25 using `Math.round(fee * 4) / 4`
- [x] **BR-03**: Only charge members who attended (status: present or late)
- [x] Auto-deduct fees from member balances
- [x] Create `session_fee` transactions for audit trail
- [x] Update attendance records with `charged_amount`
- [x] Change session status to `completed`
- [x] Validation: Prevent duplicate finalization
- [x] **Test Results**:
  - Session 1: $165 / 2 attendees = $82.50 ✅
  - Session 3: $253 / 3 attendees = $84.333... → $84.25 (rounded) ✅
  - Bob Wilson: $100 - $84.25 = $15.75 ✅
  - John & Jane: -$166.75 each ✅
  - Team balance: -$317.75 ✅

---

## 🔄 In Progress

### Step 8: Transactions Module
**Description**: Implement comprehensive transaction management with filtering and detailed views

**Tasks**:
- [ ] Create DTOs (if needed for filtering)
- [ ] Implement TransactionsService:
  - `findAll()` with filters (memberId, categoryId, sessionId, type, dateRange)
  - `findOne()` with full relations
  - Statistics methods (total by type, total by category, date range totals)
- [ ] Implement TransactionsController
- [ ] **Endpoints to create**:
  - `GET /transactions` - Get all transactions with filters
  - `GET /transactions/:id` - Get transaction by ID with relations
  - `GET /transactions/stats/by-type` - Get totals grouped by transaction type
  - `GET /transactions/stats/by-category` - Get totals grouped by category
  - `GET /transactions/stats/by-member` - Get totals per member
- [ ] Create TransactionsModule
- [ ] Register in AppModule
- [ ] Test all endpoints with existing data (6 transactions created)

**Database Context**:
- Current transactions in DB:
  - 2x session_fee (John & Jane from session 1)
  - 2x session_fee (John, Jane, Bob from session 3)
  - 2x onfield_payment (John $82.50, Guest $25)
  - 1x contribution (Bob $100)

---

## ⏳ Pending Tasks (Steps 9-12)

### Step 9: Financial Reports & Analytics
**Description**: Advanced reporting endpoints for financial insights

**Tasks**:
- [ ] Create reports service or extend existing services
- [ ] Implement report generation methods
- [ ] **Endpoints to create**:
  - `GET /reports/team-balance` - Enhanced team balance with history
  - `GET /reports/member-balance-history` - Balance changes over time
  - `GET /reports/spending-by-category` - Spending breakdown by category
  - `GET /reports/session-costs` - Session cost analytics and trends
  - `GET /reports/attendance-summary` - Attendance statistics
- [ ] Add date range filtering (from, to query params)
- [ ] Consider charting data format (for frontend graphs)
- [ ] Test with historical data

**Notes**: May need to create a dedicated ReportsModule or add to existing modules

---

### Step 10: Advanced Validation & Error Handling
**Description**: Add business logic validations and error handling

**Tasks**:
- [ ] **Balance validation**:
  - Prevent negative balances on deductions (configurable threshold)
  - Warning when balance goes below threshold
- [ ] **Date validation**:
  - Validate date ranges (from < to)
  - Prevent scheduling sessions in the past
  - Validate session end time > start time
- [ ] **Session validation**:
  - Check session status before attendance marking
  - Check session status before on-field collections
  - Prevent updates to completed sessions
- [ ] **Concurrent transaction handling**:
  - Add database locks for balance updates
  - Use TypeORM transactions for atomic operations
  - Handle race conditions in finalization
- [ ] **Custom exception filters**:
  - Create domain-specific exceptions
  - Improve error messages for frontend
- [ ] Add global validation pipe configuration
- [ ] Test edge cases and error scenarios

---

### Step 11: Unit & Integration Tests
**Description**: Comprehensive test coverage for all modules

**Tasks**:
- [ ] **Unit Tests** (Services):
  - MembersService: CRUD, contributions, balance calculations
  - SessionsService: finalization logic, fee calculation, rounding
  - CategoriesService, FieldsService: basic CRUD
  - TransactionsService: filtering, statistics
- [ ] **Integration Tests** (Controllers):
  - Test all endpoints with real database (test container)
  - Test authentication when implemented
  - Test error responses (404, 400, 409)
- [ ] **Business Logic Tests**:
  - Rounding to $0.25 (test edge cases: $10.12 → $10.00, $10.13 → $10.25)
  - Fee calculation with different attendee counts
  - Balance updates during contributions/deductions
  - Concurrent finalization attempts
- [ ] **Edge Case Tests**:
  - Empty results (no members, no sessions)
  - Division by zero (0 attendees - should error)
  - Negative amounts
  - Very large numbers (overflow testing)
- [ ] Setup test database configuration
- [ ] Add test scripts to package.json
- [ ] Aim for >80% code coverage

---

### Step 12: Export Functionality
**Description**: CSV/Excel export for transactions, attendance, and reports

**Tasks**:
- [ ] Install export libraries (csv-writer, exceljs)
- [ ] Create export service/utility
- [ ] **Endpoints to create**:
  - `GET /exports/transactions` - Export transactions to CSV/Excel
  - `GET /exports/attendance` - Export attendance records
  - `GET /exports/financial-report` - Export financial summary
  - `GET /exports/member-balances` - Export member balance sheet
- [ ] Add date range filters to exports
- [ ] Add format query param (csv or excel)
- [ ] Stream large exports (don't load all in memory)
- [ ] Add proper headers and formatting
- [ ] Test with large datasets

---

## 🚀 Future Work (Steps 13-18)

### Step 13: Authentication & Authorization
- Implement JWT authentication
- Create users module
- Add role-based access control (admin, member)
- Protect endpoints with guards
- Hash passwords with bcrypt

### Step 14: Frontend Setup - Next.js
- Initialize Next.js with TypeScript
- Setup TailwindCSS
- Configure API client (Axios/Fetch)
- Setup routing structure
- Create layout components

### Step 15: Frontend - Members & Sessions UI
- Build members list/form components
- Create sessions calendar view
- Implement attendance marking interface
- Build on-field collection form
- Add responsive design

### Step 16: Frontend - Dashboard & Reports
- Build dashboard with charts (Chart.js/Recharts)
- Team balance overview card
- Spending by category pie chart
- Session cost trends line chart
- Member balance cards
- Date range pickers

### Step 17: Frontend - Forms & Validation
- Add member form (React Hook Form + Zod)
- Schedule session form with field selection
- Mark attendance form (checkbox list)
- Record contribution form
- Client-side validation matching backend DTOs

### Step 18: Deployment & Documentation
- Create production docker-compose.yml
- Deploy backend (Docker/Railway/Render)
- Deploy frontend (Vercel/Netlify)
- Write API documentation (extend Swagger)
- Create user guide for treasury management
- Add README with setup instructions

---

## 📊 Current Backend Status

### Summary
- **Total Modules**: 4 (Members, Categories, Fields, Sessions)
- **Total Endpoints**: 31
  - Members: 9 endpoints ✅
  - Categories: 5 endpoints ✅
  - Fields: 5 endpoints ✅
  - Sessions: 10 endpoints ✅
  - Transactions: 0 endpoints (next step)
- **Database Tables**: 8 (all created)
- **Sample Data**:
  - 3 members (Bob: $15.75, John: -$166.75, Jane: -$166.75)
  - 1 field (Central Stadium)
  - 6 categories
  - 3 sessions (2 completed, 1 planned)
  - 6 attendance records
  - 7 transactions
- **Team Balance**: -$317.75

### Key Features Implemented
✅ Member balance tracking  
✅ Contribution management  
✅ Session scheduling (practice/match)  
✅ Attendance tracking (present/late/absent)  
✅ On-field payment collection (members/guests)  
✅ Automatic fee calculation with rounding ($0.25)  
✅ Auto-deduction from member balances  
✅ Transaction audit trail  
✅ Swagger API documentation  

### Business Rules Validated
✅ BR-01: Per-head fee = total cost / attendees  
✅ BR-02: Round to nearest $0.25  
✅ BR-03: Only charge attendees (not absent members)  

---

## 🛠️ Technical Stack

**Backend**:
- NestJS 10+
- TypeORM 0.3.27
- PostgreSQL 17-alpine
- class-validator & class-transformer
- @nestjs/swagger

**Development**:
- Backend: `npm run dev` (native Node.js with hot-reload)
- Database: Docker Compose (PostgreSQL only)
- API Docs: http://localhost:3000/api

**Testing** (to be added):
- Jest
- Supertest
- Test containers (PostgreSQL)

---

## 📝 Notes for Continuation

### Important Patterns Established
1. **DTO Structure**: camelCase in DTOs, snake_case in entities
2. **Service Pattern**: All business logic in services, controllers are thin
3. **Validation**: Use class-validator decorators in DTOs
4. **Relations**: Use entity objects in create() instead of _id fields
5. **Error Handling**: Use NestJS built-in exceptions (NotFoundException, BadRequestException)
6. **Swagger**: Comprehensive decorators on all endpoints

### Common Issues & Solutions
- **TypeORM create() type errors**: Use entity relations instead of foreign key IDs
- **Nullable fields**: Use `undefined` in TypeORM, not `null` (unless field is nullable in TypeScript)
- **Enum usage**: Import and use enum constants, not string literals
- **Balance calculations**: Always convert to Number() before arithmetic

### Next Session Checklist
1. ✅ Database is running: `docker compose ps`
2. ✅ Backend is running: `npm run dev`
3. ✅ Check current data: `curl http://localhost:3000/members | jq .`
4. Start implementing Transactions module (Step 8)

---

## 🎯 Project Goals Recap

**Primary Objective**: Build a web application to manage football team treasury and session management

**Core Features**:
- Track member contributions and balances
- Schedule practice/match sessions
- Record attendance
- Calculate and charge session fees automatically
- Collect on-field payments
- Generate financial reports
- Export data for record-keeping

**Target Users**: Football team treasurer/administrator

---

**Last Updated**: November 2, 2025  
**Current Branch**: orm_setup  
**Next Step**: Implement Transactions Module (Step 8)
