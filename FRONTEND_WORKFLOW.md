# Frontend Development Workflow & Specifications

**Project**: BITS Football Team Treasury Management System  
**Version**: 1.0  
**Date**: November 4, 2025  
**Purpose**: Complete frontend development guide with precise workflows

---

## 📋 Table of Contents

1. [Application Overview](#application-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Page Structure & Navigation](#page-structure--navigation)
4. [Detailed Workflows](#detailed-workflows)
5. [UI Components Specifications](#ui-components-specifications)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Form Validations](#form-validations)
9. [Error Handling](#error-handling)
10. [Real-time Updates](#real-time-updates)

---

## Application Overview

### Tech Stack Recommendations
- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: TanStack Query (React Query) + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts or Chart.js
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **HTTP Client**: Axios or Fetch API

### Key Features
1. Dashboard with real-time metrics
2. Member management with PIN authentication
3. Session scheduling and management
4. Attendance marking (mobile-optimized)
5. Financial transactions tracking
6. Alerts and notifications
7. Reports and analytics
8. Guest management

---

## User Roles & Permissions

### 1. Admin (Full Access)
- Manage all members
- Manage all sessions
- Manage all transactions
- View all reports
- Manage settings
- Resolve alerts

### 2. Treasurer (Financial Focus)
- Manage members
- Record contributions
- Manage sessions
- Mark attendance
- Finalize sessions
- View financial reports

### 3. Manager/Coach (Operational Focus)
- Create sessions
- Mark attendance
- View member list
- View session reports
- Add guests

### 4. Member (Limited Access)
- View own balance
- View own transactions
- View own attendance
- View upcoming sessions

### 5. Viewer (Read-Only)
- View dashboard
- View reports
- View member list (no details)

---

## Page Structure & Navigation

### Main Navigation Menu

```
┌─────────────────────────────────────┐
│ 🏠 Dashboard                        │
│ 👥 Members                          │
│ ⚽ Sessions                          │
│ 💰 Transactions                     │
│ 🔔 Alerts                           │
│ 📊 Reports                          │
│ ⚙️  Settings                        │
│ 👤 Profile                          │
└─────────────────────────────────────┘
```

### Page Hierarchy

```
/
├── dashboard/
│   └── (Dashboard Home)
│
├── members/
│   ├── (Members List)
│   ├── new
│   ├── [id]/
│   │   ├── (Member Details)
│   │   ├── edit
│   │   ├── transactions
│   │   └── attendance
│   └── pin-lookup
│
├── sessions/
│   ├── (Sessions List)
│   ├── calendar
│   ├── new
│   ├── [id]/
│   │   ├── (Session Details)
│   │   ├── edit
│   │   ├── attendance
│   │   └── finalize
│   └── upcoming
│
├── transactions/
│   ├── (Transactions List)
│   ├── bulk-payment
│   └── statistics
│
├── guests/
│   ├── (Guests List)
│   └── [id]/convert
│
├── alerts/
│   └── (Alerts List)
│
├── reports/
│   ├── team-balance
│   ├── member-balances
│   ├── spending-by-category
│   ├── session-costs
│   └── attendance-summary
│
└── settings/
    ├── general
    ├── thresholds
    └── categories
```

---

## Detailed Workflows

### Workflow 1: Dashboard Overview

**Purpose**: Quick overview of team financial health and upcoming activities

**Page**: `/dashboard`

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│  Header: "Dashboard" + Date Range Picker                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ Team       │  │ Active     │  │ Upcoming   │           │
│  │ Balance    │  │ Members    │  │ Sessions   │           │
│  │ -500 BDT   │  │ 12         │  │ 3          │           │
│  │ 🔴 Below   │  │ ✅         │  │ ⏰         │           │
│  │ Threshold  │  │            │  │            │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │ Pending    │  │ Low        │  │ Fines      │           │
│  │ Fines      │  │ Balance    │  │ Applied    │           │
│  │ 3          │  │ Alerts: 5  │  │ This Month │           │
│  │ ⚠️         │  │ 🔴         │  │ 2          │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Active Alerts (Critical)                                   │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🔴 Treasury balance below 5000 BDT threshold          │ │
│  │ 🟡 5 members have balance below 250 BDT               │ │
│  │ 🟠 3 fines applied for consecutive absences           │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Upcoming Sessions                                          │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Nov 5, 6:00 PM - Practice at Central Stadium         │ │
│  │ Nov 7, 7:00 PM - Match at Sports Complex             │ │
│  │ Nov 10, 6:00 PM - Practice at Central Stadium        │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Recent Activity (Last 10 transactions)                     │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Nov 4 - Member #7 created (-500 BDT surcharge)       │ │
│  │ Nov 3 - Session #8 finalized (3 members, 800 BDT)    │ │
│  │ Nov 3 - Fine applied to Member #3 (-10 BDT)          │ │
│  │ Nov 2 - Bulk payment: Member #1 paid for 2 (500 BDT)│ │
│  └───────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**API Calls**:
```typescript
// Dashboard data
GET /reports/team-balance
GET /members (count active)
GET /sessions?status=planned&from=today
GET /alerts/unresolved
GET /transactions?limit=10&sort=desc
GET /members (filter balance < 250)
```

**State Management**:
- Auto-refresh every 30 seconds
- Show loading skeleton on initial load
- Cache data for 30 seconds
- Show "Updated X seconds ago" timestamp

**User Actions**:
- Click metric card → Navigate to relevant page
- Click alert → Navigate to alerts page with filter
- Click session → Navigate to session details
- Click transaction → Navigate to transaction details

---

### Workflow 2: Create New Member

**Purpose**: Add a new team member with automatic surcharge

**Page**: `/members/new`

**Step-by-Step Flow**:

**Step 1: Form Display**
```
┌─────────────────────────────────────────┐
│  Create New Member                      │
├─────────────────────────────────────────┤
│                                          │
│  Name *                                  │
│  [________________]                      │
│                                          │
│  Contact Number *                        │
│  [+880__________]                        │
│                                          │
│  PIN (4-6 digits)                        │
│  [______]  [Generate Random]             │
│                                          │
│  Status                                  │
│  ( ) Active  ( ) Inactive                │
│                                          │
│  ⚠️  New Member Surcharge                │
│  500 BDT will be charged automatically   │
│  Member starts with balance: -500 BDT    │
│                                          │
│  [Cancel]  [Create Member]               │
│                                          │
└─────────────────────────────────────────┘
```

**Step 2: Validation**
- Name: Required, min 2 chars, max 100 chars
- Contact: Required, valid phone format (+880...)
- PIN: Optional, 4-6 digits, unique check on blur
- Status: Default "active"

**Step 3: Submit**
```typescript
POST /members
{
  "name": "John Doe",
  "contactNumber": "+8801712345678",
  "pin": "1234",
  "status": "active"
}
```

**Step 4: Response Handling**
```typescript
// Success Response
{
  "id": 10,
  "name": "John Doe",
  "balance": "-500.00",  // Surcharge applied
  "pin": "1234",
  "status": "active",
  "created_at": "2025-11-04T..."
}

// Actions on success:
1. Show success toast: "Member created with 500 BDT surcharge"
2. Navigate to member details: /members/10
3. Invalidate members list cache
```

**Step 5: Error Handling**
```typescript
// Duplicate PIN error
{
  "statusCode": 409,
  "message": "PIN already exists"
}
// Action: Show error under PIN field, allow retry

// Validation error
{
  "statusCode": 400,
  "message": ["name must be longer than 2 characters"]
}
// Action: Show errors under respective fields
```

**Quick Actions** (After Creation):
- "Add Contribution" button → Open contribution modal
- "View Transactions" button → Navigate to transactions
- "Print Member Card" → Generate PDF with name, PIN, QR code

---

### Workflow 3: Session Creation & Management

**Purpose**: Create and manage practice/match sessions

**Page**: `/sessions/new`

**Form Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Create New Session                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Session Type *                                      │
│  ( ) Practice  ( ) Match                            │
│                                                      │
│  Field *                                             │
│  [Select Field ▼]                                   │
│  └─ Central Stadium                                 │
│     Sports Complex                                   │
│     University Ground                                │
│                                                      │
│  Date & Time *                                       │
│  [2025-11-05] [18:00]                               │
│                                                      │
│  Cost Breakdown                                      │
│  ┌───────────────────────────────────────┐          │
│  │ Field Cost:        [600] BDT         │          │
│  │ Transport Cost:    [100] BDT         │          │
│  │ Drinks Cost:       [50]  BDT         │          │
│  │ Emergency Fund:    [50]  BDT         │          │
│  │ ─────────────────────────────         │          │
│  │ Total:             800 BDT            │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Notes (Optional)                                    │
│  [_____________________________]                     │
│                                                      │
│  [Cancel]  [Create Session]                         │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /sessions
{
  "fieldId": 1,
  "sessionType": "practice",
  "scheduledDate": "2025-11-05T18:00:00Z",
  "fieldCost": 600,
  "transportCost": 100,
  "drinksCost": 50,
  "emergencyFund": 50,
  "notes": "Regular practice session"
}
```

**Success Actions**:
1. Show toast: "Session created successfully"
2. Navigate to: `/sessions/[id]/attendance`
3. Prompt: "Would you like to mark attendance now?"

---

### Workflow 4: Mark Attendance (Mobile-Optimized)

**Purpose**: Quick attendance marking, especially on mobile/tablet at the field

**Page**: `/sessions/[id]/attendance`

**Mobile Layout** (Tablet/Phone friendly):
```
┌─────────────────────────────────────┐
│ ⚽ Session Attendance                │
│ Practice - Nov 5, 6:00 PM           │
├─────────────────────────────────────┤
│ Quick Search (by PIN or Name)       │
│ [🔍 Enter PIN or Name...]           │
├─────────────────────────────────────┤
│                                      │
│ Members (Tap to toggle)              │
│                                      │
│ ┌──────────────────────────────────┐│
│ │ ✅ Ahmed Hassan                  ││
│ │    PIN: 1001 | Balance: 200 BDT ││
│ │    [Present] [Late] [Absent]    ││
│ └──────────────────────────────────┘│
│                                      │
│ ┌──────────────────────────────────┐│
│ │ ⏰ Sara Ahmed                     ││
│ │    PIN: 1002 | Balance: -50 BDT ││
│ │    [Present] [Late] [Absent]    ││
│ └──────────────────────────────────┘│
│                                      │
│ ┌──────────────────────────────────┐│
│ │ ❌ Bob Wilson                     ││
│ │    PIN: 1003 | Balance: 15 BDT  ││
│ │    [Present] [Late] [Absent]    ││
│ └──────────────────────────────────┘│
│                                      │
│ ... (scroll for more)                │
│                                      │
├─────────────────────────────────────┤
│ Summary                              │
│ Present: 8 | Late: 2 | Absent: 2    │
│                                      │
│ [+ Add Guest]  [Save Attendance]    │
│                                      │
└─────────────────────────────────────┘
```

**Quick PIN Lookup Flow**:
```
User enters PIN: "1234"
  ↓
Auto-search member by PIN
  ↓
Highlight member in list
  ↓
User taps status (Present/Late/Absent)
  ↓
Visual feedback (checkmark animation)
  ↓
Auto-scroll to next member
```

**API Calls**:
```typescript
// Get session and existing attendance
GET /sessions/[id]/attendance

// Search by PIN
GET /members/by-pin/1234

// Bulk update attendance
POST /sessions/[id]/attendance/bulk
{
  "attendances": [
    {"memberId": 1, "status": "present"},
    {"memberId": 2, "status": "late"},
    {"memberId": 3, "status": "absent"}
  ]
}
```

**Smart Features**:
- **Offline Mode**: Save to local storage, sync when online
- **Bulk Actions**: "Mark all present" button
- **Quick Filters**: Show only unmarked, show warnings (low balance)
- **Voice Input**: "Mark John Doe as present"
- **Auto-save**: Save every 30 seconds automatically

**Warnings Display**:
```
⚠️  Ahmed Hassan will have balance below 250 BDT after this session
⚠️  Bob Wilson has 1 consecutive absence (will be fined on 2nd)
```

---

### Workflow 5: Session Finalization

**Purpose**: Calculate and charge fees to attendees

**Page**: `/sessions/[id]/finalize`

**Pre-Finalization Summary**:
```
┌─────────────────────────────────────────────────────┐
│  Finalize Session #8                                 │
│  Practice - Nov 5, 6:00 PM                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Session Costs                                       │
│  ┌───────────────────────────────────────┐          │
│  │ Field:         600 BDT               │          │
│  │ Transport:     100 BDT               │          │
│  │ Drinks:        50 BDT                │          │
│  │ Emergency:     50 BDT                │          │
│  │ ─────────────────────                │          │
│  │ Total:         800 BDT               │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Attendance Summary                                  │
│  ┌───────────────────────────────────────┐          │
│  │ Present:       8 members             │          │
│  │ Late:          2 members             │          │
│  │ Guests:        1 guest               │          │
│  │ ─────────────────────                │          │
│  │ Total People:  11                    │          │
│  │                                       │          │
│  │ Per Head Fee:  800 ÷ 11 = 72.73     │          │
│  │ Rounded:       72.75 BDT             │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Members to be Charged (10)                         │
│  ┌───────────────────────────────────────┐          │
│  │ Ahmed Hassan   72.75 BDT             │          │
│  │   Balance: 200.00 → 127.25 ✅        │          │
│  │                                       │          │
│  │ Sara Ahmed     72.75 BDT             │          │
│  │   Balance: -50.00 → -122.75 ⚠️       │          │
│  │   Will be below threshold!           │          │
│  │                                       │          │
│  │ ... (8 more)                         │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Absent Members (2)                                 │
│  ┌───────────────────────────────────────┐          │
│  │ ❌ Bob Wilson (Consecutive: 2)        │          │
│  │    Fine will be applied: 14.55 BDT   │          │
│  │                                       │          │
│  │ ❌ John Doe (Consecutive: 1)          │          │
│  │    No fine (below limit)             │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Alerts That Will Be Created                        │
│  🔴 1 member will be below 250 BDT threshold        │
│  🟠 1 fine will be applied                          │
│  🔵 Treasury balance will be -500 BDT               │
│                                                      │
│  ⚠️  This action cannot be undone!                  │
│                                                      │
│  [Cancel]  [Finalize Session]                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**API Call**:
```typescript
POST /sessions/[id]/finalize

// Response
{
  "session": {...},
  "totalCost": 800,
  "perHeadFee": 72.75,
  "attendeeCount": 10,
  "guestCount": 1,
  "chargedAmount": 727.50,
  "transactionsCreated": 10,
  "finesApplied": 1,
  "alertsGenerated": 3,
  "absentMembers": 2
}
```

**Post-Finalization Actions**:
1. Show success modal with summary
2. Update session status badge to "Completed"
3. Refresh balances in background
4. Navigate to session details
5. Show notification: "Session finalized. 10 members charged, 1 fine applied"

---

### Workflow 6: Add Guest to Session

**Purpose**: Add non-member attendees to session

**UI**: Modal/Sheet from attendance page

```
┌─────────────────────────────────────┐
│  Add Guest to Session                │
├─────────────────────────────────────┤
│                                      │
│  Guest Name *                        │
│  [________________]                  │
│                                      │
│  Contact Number                      │
│  [+880__________]                    │
│                                      │
│  Brought By *                        │
│  [Select Member ▼]                  │
│  └─ Ahmed Hassan                    │
│     Sara Ahmed                       │
│     ...                              │
│                                      │
│  Paid By                             │
│  [Select Member ▼]                  │
│  └─ Same as brought by              │
│     Ahmed Hassan                     │
│     ...                              │
│                                      │
│  Amount Paid (On-field)              │
│  [0] BDT                             │
│                                      │
│  Notes                               │
│  [_____________________________]     │
│                                      │
│  💡 Guest will be included in fee   │
│     calculation but not charged      │
│                                      │
│  [Cancel]  [Add Guest]               │
│                                      │
└─────────────────────────────────────┘
```

**API Call**:
```typescript
POST /guests/sessions/[sessionId]
{
  "name": "Guest John",
  "contactNumber": "+8801712345678",
  "broughtByMemberId": 1,
  "paidByMemberId": 1,
  "amountPaid": 75
}
```

**Quick Action**: Convert guest to member
```
After session finalization:
  ↓
Show notification: "Guest John attended. Convert to member?"
  ↓
[Convert Now] button → Navigate to conversion form
  ↓
Pre-fill: name, contact from guest record
  ↓
Add PIN and create member (with surcharge)
```

---

### Workflow 7: Bulk Payment

**Purpose**: One member pays for multiple members

**Page**: `/transactions/bulk-payment`

```
┌─────────────────────────────────────────────────────┐
│  Bulk Payment                                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Paying Member *                                     │
│  [Select Member ▼]                                  │
│  └─ Ahmed Hassan (Balance: 500 BDT)                │
│                                                      │
│  Beneficiary Members *                               │
│  [Select Multiple ▼]                                │
│  ☑ Ahmed Hassan (self)                              │
│  ☑ Sara Ahmed                                        │
│  ☑ Bob Wilson                                        │
│  ☐ John Doe                                          │
│                                                      │
│  Selected: 3 members                                 │
│                                                      │
│  Total Amount *                                      │
│  [600] BDT                                           │
│                                                      │
│  Split Type                                          │
│  (•) Equal Split                                     │
│  ( ) Custom Amounts                                  │
│                                                      │
│  Preview                                             │
│  ┌───────────────────────────────────────┐          │
│  │ Ahmed Hassan:    200 BDT             │          │
│  │ Sara Ahmed:      200 BDT             │          │
│  │ Bob Wilson:      200 BDT             │          │
│  │ ─────────────────────                │          │
│  │ Total:           600 BDT ✅          │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Payment Method *                                    │
│  ( ) Cash  ( ) Bank Transfer  (•) Mobile (bKash)   │
│                                                      │
│  Provider (Optional)                                 │
│  [bKash ▼]                                          │
│                                                      │
│  Transaction Reference                               │
│  [TXN123456789]                                      │
│                                                      │
│  Notes                                               │
│  [Joint payment for 3 members]                       │
│                                                      │
│  Balance After Payment                               │
│  Ahmed Hassan: 500 - 600 = -100 BDT ⚠️             │
│                                                      │
│  [Cancel]  [Process Payment]                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Custom Split Mode**:
```
When "Custom Amounts" selected:
┌───────────────────────────────────────┐
│ Ahmed Hassan:    [250] BDT           │
│ Sara Ahmed:      [200] BDT           │
│ Bob Wilson:      [150] BDT           │
│ ─────────────────────                │
│ Total:           600 BDT ✅          │
└───────────────────────────────────────┘
```

**API Call**:
```typescript
POST /transactions/bulk-payment
{
  "payingMemberId": 1,
  "beneficiaryMemberIds": [1, 2, 3],
  "totalAmount": 600,
  "splitType": "EQUAL",
  "method": "mobile",
  "paymentProvider": "bkash",
  "paymentReference": "TXN123456789",
  "notes": "Joint payment for 3 members"
}
```

---

### Workflow 8: Alerts Management

**Purpose**: View and resolve system alerts

**Page**: `/alerts`

```
┌─────────────────────────────────────────────────────┐
│  Alerts & Notifications                              │
├─────────────────────────────────────────────────────┤
│  Filters:                                            │
│  [All] [Unresolved] [Critical] [Warning] [Info]    │
│                                                      │
│  Critical Alerts (2)                                 │
│  ┌───────────────────────────────────────┐          │
│  │ 🔴 Treasury Low Balance               │          │
│  │    Balance (-500 BDT) below 5000 BDT │          │
│  │    Nov 4, 10:30 AM                    │          │
│  │    [View Details] [Resolve]           │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  ┌───────────────────────────────────────┐          │
│  │ 🔴 Member Low Balance                 │          │
│  │    Sara Ahmed balance below 250 BDT   │          │
│  │    Current: -122.75 BDT               │          │
│  │    Nov 4, 9:15 AM                     │          │
│  │    [View Member] [Resolve]            │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Warning Alerts (3)                                  │
│  ┌───────────────────────────────────────┐          │
│  │ 🟠 Fine Applied                       │          │
│  │    Bob Wilson: 10 BDT fine applied    │          │
│  │    Reason: 2 consecutive absences     │          │
│  │    Nov 3, 8:00 PM                     │          │
│  │    [View Transaction] [Resolve]       │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  ... (more alerts)                                   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Alert Actions**:
- **View Details**: Navigate to related entity
- **Resolve**: Mark as resolved with confirmation
- **Bulk Resolve**: Select multiple, resolve all

**API Calls**:
```typescript
// Get unresolved alerts
GET /alerts/unresolved

// Get alert stats
GET /alerts/stats

// Resolve alert
POST /alerts/[id]/resolve
```

---

### Workflow 9: Financial Reports

**Purpose**: View comprehensive financial reports

**Page**: `/reports/team-balance`

```
┌─────────────────────────────────────────────────────┐
│  Team Financial Report                               │
├─────────────────────────────────────────────────────┤
│  Date Range: [Last 30 Days ▼]                       │
│                                                      │
│  Overview                                            │
│  ┌───────────────────────────────────────┐          │
│  │ Current Balance:    -500 BDT         │          │
│  │ Total Contributions: 5000 BDT        │          │
│  │ Total Expenses:      5500 BDT        │          │
│  │ Net Change:          -500 BDT        │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Balance Trend (Chart)                               │
│  ┌───────────────────────────────────────┐          │
│  │    ^                                  │          │
│  │ 2k │     ╱╲                           │          │
│  │    │    ╱  ╲                          │          │
│  │ 1k │   ╱    ╲     ╱╲                 │          │
│  │    │  ╱      ╲   ╱  ╲                │          │
│  │ 0  │─╱────────╲─╱────╲──────         │          │
│  │    │           ╲      ╲              │          │
│  │-1k │            ╲──────╲─────        │          │
│  │    └───────────────────────────>     │          │
│  │     Oct    Nov    Dec    Jan         │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Spending by Category                                │
│  ┌───────────────────────────────────────┐          │
│  │ 🥤 Drinks:        500 BDT (15%)      │          │
│  │ ⚽ Field:        2400 BDT (70%)      │          │
│  │ 🚗 Transport:     400 BDT (12%)      │          │
│  │ 🚨 Emergency:     100 BDT (3%)       │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  Member Balances                                     │
│  ┌───────────────────────────────────────┐          │
│  │ Positive: 5 members (2500 BDT)       │          │
│  │ Negative: 7 members (-3000 BDT)      │          │
│  │ Zero:     0 members                   │          │
│  └───────────────────────────────────────┘          │
│                                                      │
│  [Export PDF] [Export CSV] [Print]                  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Chart Types**:
1. **Line Chart**: Balance trend over time
2. **Pie Chart**: Spending by category
3. **Bar Chart**: Session costs comparison
4. **Horizontal Bar**: Member balances (top 10)

---

## UI Components Specifications

### 1. Member Card Component

```typescript
interface MemberCardProps {
  member: Member;
  showBalance?: boolean;
  showActions?: boolean;
  onClick?: () => void;
}

<MemberCard
  member={member}
  showBalance={true}
  showActions={true}
  onClick={() => navigate(`/members/${member.id}`)}
/>
```

**Visual**:
```
┌────────────────────────────────┐
│ Ahmed Hassan            #1001  │
│ +880 1712 345678              │
│ Balance: 200.00 BDT 🟢        │
│ Consecutive Absences: 0        │
│ [View] [Edit] [Add Contribution]│
└────────────────────────────────┘
```

**Color Coding**:
- Balance > 250: Green 🟢
- Balance 0-250: Yellow 🟡
- Balance < 0: Red 🔴

---

### 2. Session Card Component

```typescript
interface SessionCardProps {
  session: Session;
  showAttendance?: boolean;
  showActions?: boolean;
}
```

**Visual**:
```
┌────────────────────────────────┐
│ 🏃 Practice                     │
│ Nov 5, 2025 - 6:00 PM          │
│ 📍 Central Stadium             │
│ 💰 Total Cost: 800 BDT         │
│ 👥 Attendance: 10/12 (83%)     │
│ Status: Planned                 │
│ [Mark Attendance] [Finalize]   │
└────────────────────────────────┘
```

---

### 3. Alert Badge Component

```typescript
interface AlertBadgeProps {
  type: 'critical' | 'warning' | 'info';
  message: string;
  count?: number;
}
```

**Visual**:
```
🔴 Critical (2)
🟠 Warning (5)
🔵 Info (1)
```

---

### 4. Balance Display Component

```typescript
interface BalanceDisplayProps {
  amount: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  showTrend?: boolean;
}
```

**Visual**:
```
Large (Dashboard):
  -500.00 BDT
  ↓ 12% from last month

Medium (Card):
  200.00 BDT 🟢

Small (Table):
  -50.00
```

---

### 5. Status Badge Component

```typescript
type SessionStatus = 'planned' | 'completed' | 'cancelled';
type AttendanceStatus = 'present' | 'late' | 'absent';
type AlertStatus = 'unresolved' | 'resolved';
```

**Visual**:
```
Session: [Planned] [Completed] [Cancelled]
Attendance: [Present] [Late] [Absent]
Alert: [Unresolved] [Resolved]
```

---

## State Management

### Global State (Zustand)

```typescript
interface AppState {
  // User
  user: User | null;
  isAuthenticated: boolean;
  
  // UI
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Alerts
  unreadAlerts: number;
  
  // Session
  currentSession: Session | null;
  
  // Actions
  setUser: (user: User) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  incrementAlerts: () => void;
  clearAlerts: () => void;
}
```

### Server State (React Query)

```typescript
// Members
useMembers(filters?)
useMember(id)
useCreateMember()
useUpdateMember()
useDeleteMember()

// Sessions
useSessions(filters?)
useSession(id)
useCreateSession()
useFinalizeSession()
useMarkAttendance()

// Transactions
useTransactions(filters?)
useCreateBulkPayment()

// Alerts
useAlerts(filters?)
useResolveAlert()

// Reports
useTeamBalance(dateRange?)
useSpendingByCategory(dateRange?)
```

**Caching Strategy**:
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000, // 30 seconds
      cacheTime: 5 * 60_000, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});
```

---

## Form Validations

### Zod Schemas

```typescript
// Member Schema
const memberSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name too long"),
  contactNumber: z.string()
    .regex(/^\+880\d{10}$/, "Invalid phone number"),
  pin: z.string()
    .regex(/^\d{4,6}$/, "PIN must be 4-6 digits")
    .optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
});

// Session Schema
const sessionSchema = z.object({
  fieldId: z.number().positive(),
  sessionType: z.enum(['practice', 'match']),
  scheduledDate: z.date()
    .min(new Date(), "Cannot schedule in the past"),
  fieldCost: z.number().min(0),
  transportCost: z.number().min(0),
  drinksCost: z.number().min(0),
  emergencyFund: z.number().min(0),
});

// Bulk Payment Schema
const bulkPaymentSchema = z.object({
  payingMemberId: z.number().positive(),
  beneficiaryMemberIds: z.array(z.number())
    .min(1, "Select at least one beneficiary"),
  totalAmount: z.number().positive(),
  splitType: z.enum(['EQUAL', 'CUSTOM']),
  customAmounts: z.array(z.number()).optional(),
  method: z.enum(['cash', 'bank', 'mobile']),
}).refine((data) => {
  if (data.splitType === 'CUSTOM') {
    const sum = data.customAmounts?.reduce((a, b) => a + b, 0) || 0;
    return sum === data.totalAmount;
  }
  return true;
}, {
  message: "Custom amounts must equal total amount",
  path: ["customAmounts"],
});
```

---

## Error Handling

### Error Display Strategy

```typescript
// Toast for non-critical errors
toast.error("Failed to create member");

// Modal for critical errors
showModal({
  title: "Session Finalization Failed",
  message: "Not enough members present",
  actions: [
    { label: "Go Back", onClick: () => navigate(-1) },
    { label: "Retry", onClick: () => retry() },
  ],
});

// Inline for form errors
<FormField error={errors.pin?.message} />

// Banner for network errors
<Banner type="error">
  Network connection lost. Changes will sync when online.
</Banner>
```

### Error Types

```typescript
interface AppError {
  code: string;
  message: string;
  field?: string;
  retryable: boolean;
}

// Network Error
{ code: 'NETWORK_ERROR', message: 'No connection', retryable: true }

// Validation Error
{ code: 'VALIDATION_ERROR', message: 'Invalid PIN', field: 'pin', retryable: false }

// Business Logic Error
{ code: 'INSUFFICIENT_BALANCE', message: 'Balance too low', retryable: false }

// Server Error
{ code: 'SERVER_ERROR', message: 'Internal error', retryable: true }
```

---

## Real-time Updates

### Polling Strategy

```typescript
// Dashboard - Poll every 30 seconds
useQuery(['dashboard'], fetchDashboard, {
  refetchInterval: 30_000,
});

// Alerts - Poll every 60 seconds
useQuery(['alerts', 'unresolved'], fetchAlerts, {
  refetchInterval: 60_000,
});

// Sessions - Refetch on window focus
useQuery(['sessions'], fetchSessions, {
  refetchOnWindowFocus: true,
});
```

### Optimistic Updates

```typescript
// Example: Mark attendance
const markAttendance = useMutation({
  mutationFn: (data) => api.markAttendance(data),
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['attendance', sessionId]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['attendance', sessionId]);
    
    // Optimistically update
    queryClient.setQueryData(['attendance', sessionId], (old) => ({
      ...old,
      attendances: [...old.attendances, newData],
    }));
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['attendance', sessionId], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['attendance', sessionId]);
  },
});
```

---

## Mobile Responsiveness

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
};
```

### Mobile-First Patterns

**Dashboard**:
- Mobile: Stack cards vertically
- Tablet: 2-column grid
- Desktop: 3-column grid

**Navigation**:
- Mobile: Bottom navigation bar
- Tablet/Desktop: Sidebar

**Forms**:
- Mobile: Full-width inputs, larger touch targets
- Desktop: Optimized spacing

**Tables**:
- Mobile: Card view (stack rows)
- Desktop: Traditional table

---

## Performance Optimizations

### 1. Code Splitting
```typescript
// Lazy load routes
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Members = lazy(() => import('./pages/Members'));
const Sessions = lazy(() => import('./pages/Sessions'));
```

### 2. Image Optimization
```typescript
<Image
  src="/member-avatar.jpg"
  width={100}
  height={100}
  loading="lazy"
  placeholder="blur"
/>
```

### 3. Virtual Scrolling
```typescript
// For long lists (100+ items)
<VirtualList
  items={members}
  height={600}
  itemHeight={80}
  renderItem={(member) => <MemberCard member={member} />}
/>
```

### 4. Debounced Search
```typescript
const debouncedSearch = useDebouncedValue(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    searchMembers(debouncedSearch);
  }
}, [debouncedSearch]);
```

---

## Accessibility (a11y)

### Requirements
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus management
- Screen reader support
- Sufficient color contrast (WCAG AA)
- Skip to main content link

### Examples
```typescript
// Button with aria-label
<button aria-label="Mark Ahmed Hassan as present">
  ✓
</button>

// Form with proper labels
<label htmlFor="member-name">Member Name</label>
<input id="member-name" type="text" />

// Toast with role
<div role="alert" aria-live="polite">
  Member created successfully
</div>
```

---

## Testing Strategy

### Unit Tests
- Components in isolation
- Utility functions
- Custom hooks

### Integration Tests
- User workflows
- Form submissions
- API integration

### E2E Tests (Critical Paths)
1. Create member → Add contribution → View balance
2. Create session → Mark attendance → Finalize
3. Bulk payment → Verify balances updated
4. Create guest → Convert to member

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] API base URL set correctly
- [ ] Error tracking integrated (Sentry)
- [ ] Analytics integrated (Google Analytics)
- [ ] Performance monitoring
- [ ] SEO optimization
- [ ] PWA configuration
- [ ] Offline support
- [ ] Browser compatibility tested

---

**End of Frontend Workflow Documentation**

This comprehensive guide provides everything a frontend developer needs to build a precise, fast, and user-friendly application for the BITS Football Team Treasury Management System.
