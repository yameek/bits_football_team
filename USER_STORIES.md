# User Stories - BITS Football Team Treasury Management System

**Project**: BITS Football Team Treasury Management System  
**Version**: 1.0  
**Date**: November 4, 2025  
**Purpose**: Comprehensive user stories and use cases for frontend development

---

## 📖 Overview

This document describes how different users interact with the BITS Football Team Treasury Management System. Each story follows the format:

**As a [role], I want to [action], so that [benefit]**

---

## 🎯 User Roles

1. **Team Treasurer** - Manages finances, contributions, and sessions
2. **Team Manager/Coach** - Manages sessions and attendance
3. **Team Member** - Views personal financial data and attendance
4. **Admin** - Full system access and configuration

---

## 📚 User Stories by Module

### 1. Dashboard & Overview

#### Story 1.1: View Team Financial Health (Treasurer)
**As a** team treasurer,  
**I want to** see the current team balance, active alerts, and upcoming sessions on a dashboard,  
**So that** I can quickly assess the team's financial status and take necessary actions.

**Acceptance Criteria:**
- Dashboard shows current team balance with visual indicator (red if below 5000 BDT threshold)
- Active alerts are displayed with priority (treasury low, member low balance, fines)
- Upcoming 3 sessions are listed with dates and venues
- Recent 10 transactions are shown
- Statistics cards show: active members, pending fines, low balance members
- Auto-refreshes every 30 seconds

**API Endpoints Used:**
- `GET /reports/team-balance`
- `GET /alerts/unresolved`
- `GET /sessions?status=planned&from=today&limit=3`
- `GET /transactions?limit=10&sort=desc`

**Example Workflow:**
1. Treasurer logs in
2. Dashboard loads showing team balance: -500 BDT (red alert)
3. Alert shows: "Treasury below 5000 BDT threshold"
4. Sees 5 members with low balance
5. Clicks on alert to view details
6. Takes action to collect more contributions

---

### 2. Member Management

#### Story 2.1: Create New Member with Surcharge (Treasurer)
**As a** team treasurer,  
**I want to** register a new team member and automatically charge them a 500 BDT surcharge,  
**So that** new members contribute to the treasury from the start.

**Acceptance Criteria:**
- Form collects: name (required), contact number (required), PIN (optional, 4-6 digits)
- System validates PIN uniqueness before submission
- On creation, member balance starts at -500 BDT
- Transaction of type "surcharge" is automatically created
- Success message shows: "Member created with 500 BDT surcharge"
- User is redirected to member details page

**API Endpoints Used:**
- `POST /members` with data: `{name, contactNumber, pin, status}`

**Example Workflow:**
1. Treasurer clicks "Add New Member"
2. Fills form: Name: "Ahmed Hassan", Contact: "+8801712345678", PIN: "1234"
3. Clicks "Create Member"
4. System creates member with balance: -500 BDT
5. Shows success: "Ahmed Hassan added with 500 BDT surcharge"
6. Redirects to `/members/10` (member details page)

---

#### Story 2.2: Add Contribution to Member Balance (Treasurer)
**As a** team treasurer,  
**I want to** record a member's contribution payment,  
**So that** their balance is updated and the treasury fund increases.

**Acceptance Criteria:**
- Can select payment method: Cash, bKash/Mobile, Bank Transfer
- Amount must be positive number
- For mobile payments, can optionally add payment reference (e.g., bKash TrxID)
- Transaction is created with type "contribution"
- Member balance increases by amount
- Team treasury increases by amount
- Alert is cleared if member was below 250 BDT threshold

**API Endpoints Used:**
- `POST /members/{id}/contributions` with data: `{amount, method, notes, paymentReference}`

**Example Workflow:**
1. Treasurer goes to member page (Ahmed Hassan, balance: -500 BDT)
2. Clicks "Add Contribution"
3. Enters amount: 1000 BDT, selects "bKash", adds reference: "TRX123456"
4. Submits contribution
5. Member balance updates to: 500 BDT
6. Success message: "1000 BDT contribution added via bKash"

---

#### Story 2.3: PIN Lookup for Quick Member Identification (Manager)
**As a** team manager at the field,  
**I want to** quickly find a member by entering their PIN,  
**So that** I can mark their attendance without scrolling through a long list.

**Acceptance Criteria:**
- Search input accepts 4-6 digit PIN
- Auto-searches as user types
- Highlights matching member in the list
- Shows member name, balance, and consecutive absences
- If PIN not found, shows "No member found with PIN: XXXX"

**API Endpoints Used:**
- `GET /members/by-pin/{pin}`

**Example Workflow:**
1. Manager is at the field with tablet
2. Goes to session attendance page
3. Member arrives and says: "My PIN is 1234"
4. Manager types "1234" in search box
5. System highlights "Ahmed Hassan" in the list
6. Manager marks Ahmed as "Present"

---

#### Story 2.4: View Members Below Balance Threshold (Treasurer)
**As a** team treasurer,  
**I want to** see a list of all members whose balance is below 250 BDT,  
**So that** I can remind them to make contributions.

**Acceptance Criteria:**
- Dedicated page or filter shows members with balance < 250 BDT
- List is sorted by balance (lowest first)
- Shows member name, current balance, and contact number
- Has "Send Reminder" button for each member
- Shows alert icon if they will go below threshold after next session

**API Endpoints Used:**
- `GET /members?balance_below=250`
- `GET /alerts?type=member_low_balance&status=unresolved`

**Example Workflow:**
1. Treasurer sees alert: "5 members below threshold"
2. Clicks alert to view filtered list
3. Sees: Ahmed (50 BDT), Sara (100 BDT), Bob (15 BDT)
4. Calls or messages each member to remind about contribution

---

### 3. Session Management

#### Story 3.1: Create Practice/Match Session (Manager)
**As a** team manager,  
**I want to** schedule a practice or match session with venue and costs,  
**So that** members know when and where to attend.

**Acceptance Criteria:**
- Can select session type: Practice or Match
- Can select from existing fields or add new field
- Must enter date and time
- Cost breakdown: field cost, transport, drinks, emergency fund
- Shows total cost automatically
- On creation, session status is "planned"
- After creation, redirects to attendance page

**API Endpoints Used:**
- `GET /fields` (to populate field dropdown)
- `POST /sessions` with data: `{fieldId, sessionType, scheduledDate, fieldCost, transportCost, drinksCost, emergencyFund, notes}`

**Example Workflow:**
1. Manager clicks "Create New Session"
2. Selects: Practice, Central Stadium, Nov 5 at 6:00 PM
3. Enters costs: Field 600, Transport 100, Drinks 50, Emergency 50
4. Total shows: 800 BDT
5. Clicks "Create Session"
6. Redirects to `/sessions/15/attendance`
7. Prompt: "Session created! Mark attendance now?"

---

#### Story 3.2: Mark Attendance with PIN (Manager/Coach)
**As a** team coach at the field,  
**I want to** mark attendance by member PIN or name,  
**So that** I can quickly record who attended while at the field.

**Acceptance Criteria:**
- Mobile-optimized interface (large touch targets)
- Can search by PIN or name
- Each member shows: name, PIN, current balance, consecutive absences
- Three status options: Present, Late, Absent
- Visual feedback on selection (checkmark, color change)
- Shows warning if marking absent will trigger fine
- Shows warning if member will go below 250 BDT threshold
- Can add guests to session
- Bulk actions: "Mark all present"
- Auto-saves every 30 seconds (offline support)

**API Endpoints Used:**
- `GET /sessions/{id}/attendance` (existing attendance)
- `GET /members` (all members)
- `POST /sessions/{id}/attendance/bulk` with data: `{attendances: [{memberId, status}]}`

**Example Workflow:**
1. Manager opens attendance page at field
2. Members arrive one by one
3. First member says "PIN 1234"
4. Manager types 1234, system highlights Ahmed Hassan
5. Manager taps "Present" button
6. Green checkmark shows, auto-scrolls to next member
7. Second member is late, manager taps "Late"
8. Warning shows: "Ahmed will be below 250 BDT after finalization"
9. Manager notes to remind Ahmed about contribution
10. After all marked, clicks "Save Attendance"

---

#### Story 3.3: Add Guest to Session (Manager)
**As a** team manager,  
**I want to** add non-members (guests) to a session,  
**So that** they can participate and their fee is included in per-head calculation.

**Acceptance Criteria:**
- Can add guest from attendance page
- Guest form: name, contact number, brought by (member), paid by (member)
- Guest is included in per-head fee calculation
- Guest does NOT get balance deduction (they pay cash on field)
- Can mark guest payment as collected
- Can convert guest to member later

**API Endpoints Used:**
- `POST /sessions/{id}/guests` with data: `{name, contactNumber, broughtByMemberId, paidByMemberId, amountPaid}`
- `GET /sessions/{id}/guests`

**Example Workflow:**
1. Manager is marking attendance
2. Non-member "Ali" arrives with Ahmed (member)
3. Manager clicks "+ Add Guest"
4. Enters: Name "Ali Khan", Contact "+8801712345678", Brought by: Ahmed, Paid by: Ahmed
5. Guest is added to session
6. Per-head calculation includes Ali (8 members + 1 guest = 9 people)
7. Ahmed pays Ali's share (800/9 = 88.89 BDT extra)

---

#### Story 3.4: Finalize Session and Auto-Calculate Fees (Treasurer)
**As a** team treasurer,  
**I want to** finalize a session and automatically charge attendees based on per-head calculation,  
**So that** fees are fairly distributed and balances are updated.

**Acceptance Criteria:**
- Can only finalize if attendance is marked
- Shows finalization preview:
  - Total cost: 800 BDT
  - Attendees: 8 members + 1 guest = 9 people
  - Per-head fee: 800/9 = 88.89 → rounded to 89 BDT
  - New members (joined < 90 days) pay 15% surcharge
  - Absent members are NOT charged
- Shows warnings for members going below threshold
- Shows fines that will be applied for consecutive absences
- Creates transactions for each attendee
- Updates member balances
- Updates session status to "completed"
- Creates alerts if needed (low balance, fines applied)

**API Endpoints Used:**
- `POST /sessions/{id}/finalize`
- `GET /sessions/{id}/calculate-cost` (preview before finalize)

**Example Workflow:**
1. Treasurer goes to session details page
2. Sees "Finalize Session" button
3. Clicks button, preview modal shows:
   - Total: 800 BDT
   - Attendees: 8 + 1 guest = 9
   - Per-head: 89 BDT
   - Ahmed (new member): 89 + 13.35 (15%) = 102.35 BDT
   - Bob (2 absences): Fine of 17.80 BDT will be applied
4. Confirms finalization
5. System creates 8 transactions (session_fee)
6. Creates 1 fine transaction for Bob
7. Updates all member balances
8. Creates alert for members below threshold
9. Success: "Session finalized. 8 members charged, 1 fine applied"

---

### 4. Financial Transactions

#### Story 4.1: Record Bulk Payment (Treasurer)
**As a** team treasurer,  
**I want to** record a payment where one member pays for multiple members,  
**So that** members can pay together for convenience.

**Acceptance Criteria:**
- Select paying member (who pays)
- Select 1+ beneficiary members (who benefits)
- Choose split type: Equal or Custom
- For equal split: amount divided equally
- For custom split: enter amount for each member
- All transactions linked with same bulk payment group ID
- Paying member balance decreases by total
- Beneficiary members balances increase by their share
- Shows summary: "Ahmed paid 1000 BDT for 3 members (self + 2 others)"

**API Endpoints Used:**
- `POST /transactions/bulk-payment` with data: `{payingMemberId, beneficiaryIds, amounts, method, splitType}`
- `GET /transactions/bulk-groups` (view all bulk payments)

**Example Workflow:**
1. Treasurer clicks "Record Bulk Payment"
2. Selects paying member: Ahmed
3. Selects beneficiaries: Ahmed, Sara, Bob
4. Total amount: 1500 BDT
5. Split type: Equal (500 each)
6. Payment method: Cash
7. Clicks "Submit"
8. System creates 3 transactions:
   - Ahmed: -1500 BDT (payment)
   - Ahmed: +500 BDT (contribution)
   - Sara: +500 BDT (contribution)
   - Bob: +500 BDT (contribution)
9. All linked with group: "BULK-2025-11-04-001"
10. Success: "Bulk payment recorded for 3 members"

---

#### Story 4.2: View Transaction History with Filters (Treasurer/Member)
**As a** team member,  
**I want to** view my transaction history filtered by type or date,  
**So that** I can track my contributions and session fees.

**Acceptance Criteria:**
- Can filter by: transaction type, date range, payment method
- Can search by member name
- Shows: date, type, amount, balance after, notes, payment method
- Color coding: green (contribution), red (deduction), yellow (fine)
- Can export to CSV
- Pagination (20 per page)

**API Endpoints Used:**
- `GET /transactions?memberId={id}&type={type}&from={date}&to={date}`
- `GET /members/{id}/transactions`

**Example Workflow:**
1. Member Ahmed logs in
2. Goes to "My Transactions"
3. Sees list of all transactions sorted by date
4. Filters: Type = "session_fee", Last 30 days
5. Sees 4 session fees: -89, -89, -102.35 (with surcharge), -89
6. Clicks on transaction to view session details
7. Sees session: "Practice - Nov 5, Central Stadium"

---

### 5. Alerts & Notifications

#### Story 5.1: View and Resolve Alerts (Treasurer)
**As a** team treasurer,  
**I want to** view all active alerts and mark them as resolved,  
**So that** I can track issues that need attention.

**Acceptance Criteria:**
- Alerts page shows unresolved alerts grouped by type
- Alert types:
  - Treasury low (< 5000 BDT)
  - Member low balance (< 250 BDT)
  - Fine applied (consecutive absences)
  - Consecutive absence warning (1 absence, 1 more = fine)
- Each alert shows: type, message, triggered date, related member
- Can mark as resolved with optional notes
- Resolved alerts move to "Resolved" tab
- Alert badge on navigation shows count of unresolved

**API Endpoints Used:**
- `GET /alerts?status=unresolved`
- `POST /alerts/{id}/resolve` with data: `{notes}`

**Example Workflow:**
1. Treasurer sees alert badge: "🔔 8"
2. Clicks to open alerts page
3. Sees alerts:
   - 🔴 Treasury below 5000 BDT (triggered Nov 3)
   - 🟡 5 members below 250 BDT threshold
   - 🟠 Fine applied to Bob Wilson (20 BDT)
4. Clicks on treasury alert
5. Sees details: "Current balance: 4500 BDT, Threshold: 5000 BDT"
6. Marks as resolved with note: "Collected 2000 BDT contributions on Nov 4"
7. Alert moves to resolved tab

---

#### Story 5.2: Receive Automatic Alerts (Treasurer)
**As a** team treasurer,  
**I want to** automatically receive alerts when treasury or member balances go below thresholds,  
**So that** I can take action before running out of funds.

**Acceptance Criteria:**
- Alert is auto-created when:
  - Treasury balance < 5000 BDT (after any transaction)
  - Member balance < 250 BDT (after session finalization)
  - Fine is applied (2+ consecutive absences)
  - Member has 1 consecutive absence (warning)
- Alert appears on dashboard
- Alert badge shows on navigation
- (Optional) Email/SMS notification sent

**API Endpoints Used:**
- Alerts are created automatically by backend after transactions

**Example Workflow:**
1. Session is finalized
2. Ahmed's balance goes from 260 to 171 BDT (below 250)
3. System auto-creates alert: "Member Ahmed Hassan below 250 BDT threshold"
4. Treasurer sees alert on next login
5. Contacts Ahmed to remind about contribution

---

### 6. Reports & Analytics

#### Story 6.1: View Team Balance Report (Treasurer)
**As a** team treasurer,  
**I want to** view detailed team balance breakdown,  
**So that** I can understand where money is being spent.

**Acceptance Criteria:**
- Shows current team balance
- Shows total contributions collected
- Shows total session fees charged
- Shows total fines collected
- Shows total refunds/adjustments
- Shows balance trend chart (last 30/60/90 days)
- Can export report as PDF/CSV

**API Endpoints Used:**
- `GET /reports/team-balance`
- `GET /reports/spending-by-category`

**Example Workflow:**
1. Treasurer goes to Reports → Team Balance
2. Sees:
   - Current balance: 4500 BDT
   - Total collected (all time): 25,000 BDT
   - Total spent (sessions): 20,500 BDT
   - Net: 4500 BDT
3. Chart shows balance over time (declining trend)
4. Exports report as PDF for team meeting

---

#### Story 6.2: View Member Balance Summary (Treasurer)
**As a** team treasurer,  
**I want to** see all members' balances in one view,  
**So that** I can identify who owes money and who has credit.

**Acceptance Criteria:**
- Table shows: member name, balance, consecutive absences, status
- Sortable by balance (highest/lowest)
- Color coded: red (negative), yellow (0-250), green (>250)
- Shows total owed (all negative balances sum)
- Shows total credit (all positive balances sum)
- Can filter by status (active/inactive)

**API Endpoints Used:**
- `GET /members`
- `GET /reports/member-balances`

**Example Workflow:**
1. Treasurer goes to Reports → Member Balances
2. Sees table of all 12 members
3. Sorts by balance (lowest first)
4. Sees:
   - Ahmed: -500 BDT (red)
   - Sara: 50 BDT (yellow, below threshold)
   - John: 1200 BDT (green)
5. Total owed: -800 BDT
6. Total credit: 2000 BDT
7. Net team owes: -800 BDT (members need to contribute)

---

#### Story 6.3: View Session Cost Analysis (Treasurer)
**As a** team treasurer,  
**I want to** see average session costs and spending breakdown,  
**So that** I can optimize session expenses.

**Acceptance Criteria:**
- Shows total sessions held
- Shows average cost per session
- Breakdown by cost type: field (60%), transport (20%), drinks (10%), emergency (10%)
- Chart showing cost trend over time
- Most expensive sessions list
- Can filter by date range and session type

**API Endpoints Used:**
- `GET /reports/session-costs?from={date}&to={date}&type={type}`

**Example Workflow:**
1. Treasurer goes to Reports → Session Costs
2. Filters: Last 3 months, All types
3. Sees:
   - Total sessions: 24
   - Average cost: 750 BDT
   - Total spent: 18,000 BDT
4. Breakdown chart shows field costs are 70% (too high)
5. Decides to negotiate lower field prices

---

#### Story 6.4: View Attendance Summary (Manager)
**As a** team manager,  
**I want to** see attendance statistics for all members,  
**So that** I can identify members with poor attendance.

**Acceptance Criteria:**
- Shows each member: total sessions, present, late, absent, attendance %
- Sorted by attendance % (lowest first)
- Shows members at risk of fine (1 consecutive absence)
- Shows members recently fined
- Can filter by date range

**API Endpoints Used:**
- `GET /reports/attendance-summary?from={date}&to={date}`

**Example Workflow:**
1. Manager goes to Reports → Attendance
2. Sees table:
   - John: 10/12 sessions (83%, 0 consecutive absences)
   - Ahmed: 8/12 sessions (67%, 0 consecutive absences)
   - Bob: 4/12 sessions (33%, 2 consecutive absences, fined)
3. Identifies Bob needs motivation to improve attendance
4. Talks to Bob about commitment

---

### 7. Guest Management

#### Story 7.1: Convert Guest to Member (Treasurer)
**As a** team treasurer,  
**I want to** convert a guest who attended sessions to a full member,  
**So that** they can officially join the team.

**Acceptance Criteria:**
- Can view guest details: name, contact, sessions attended, amount paid
- Conversion creates new member with:
  - Name and contact from guest record
  - Auto-generated or custom PIN
  - Balance transferred from guest payments
  - Surcharge applied (-500 BDT)
- Guest is marked as converted
- Member can now attend as regular member

**API Endpoints Used:**
- `GET /guests/{id}`
- `POST /guests/{id}/convert-to-member` with data: `{pin, applyNewMemberSurcharge}`

**Example Workflow:**
1. Treasurer sees guest "Ali Khan" attended 3 sessions
2. Ali wants to join as member
3. Treasurer goes to Guests → Ali Khan
4. Clicks "Convert to Member"
5. Enters PIN: "5678"
6. Confirms surcharge: 500 BDT
7. System creates member with balance: (3 sessions × 89 = 267 paid) - 500 surcharge = -233 BDT
8. Ali is now a member, guest record marked converted
9. Success: "Ali Khan converted to member with PIN 5678"

---

### 8. Settings & Configuration

#### Story 8.1: Update Threshold Settings (Admin)
**As a** system admin,  
**I want to** configure treasury and member balance thresholds,  
**So that** alerts are triggered at appropriate levels.

**Acceptance Criteria:**
- Can update settings:
  - Treasury minimum threshold (default: 5000 BDT)
  - Member minimum threshold (default: 250 BDT)
  - Fine percentage (default: 20%)
  - Consecutive absence limit (default: 2)
  - New member surcharge (default: 500 BDT)
  - New member period (default: 90 days)
- Changes take effect immediately
- Shows current values before editing
- Validates input (thresholds > 0, percentages 0-100)

**API Endpoints Used:**
- `GET /settings`
- `PUT /settings/{key}` with data: `{value}`

**Example Workflow:**
1. Admin goes to Settings → Thresholds
2. Sees current treasury threshold: 5000 BDT
3. Decides to increase to 7000 BDT for safety
4. Updates setting to 7000
5. Saves changes
6. System now triggers alerts when treasury < 7000 BDT

---

### 9. Advanced Scenarios

#### Story 9.1: Monthly Workflow - Start to Finish (Treasurer)
**As a** team treasurer,  
**I want to** manage a complete month of team activities,  
**So that** the team functions smoothly.

**Complete Monthly Workflow:**

**Week 1:**
1. Check dashboard, see team balance: 4500 BDT (below threshold)
2. Alert shows: "Collect contributions from 5 members"
3. Contacts members, collects 3000 BDT total
4. Records contributions via bKash, cash, bank
5. Team balance now: 7500 BDT (healthy)

**Week 2:**
6. Manager creates 2 sessions (Nov 5 practice, Nov 7 match)
7. Before each session, marks attendance at field using PINs
8. Adds 2 guests to Nov 7 match
9. After sessions, treasurer finalizes both:
   - Nov 5: 800 BDT / 8 members = 100 BDT each
   - Nov 7: 1200 BDT / (9 members + 2 guests) = 109 BDT each
10. Ahmed (new member) pays surcharge: 109 × 1.15 = 125.35 BDT
11. Bob missed 2 consecutive sessions, fine applied: 20 BDT

**Week 3:**
12. Reviews alerts: Bob fined, 2 members below threshold
13. Marks Bob's fine alert as resolved
14. Contacts 2 members for contributions
15. Guest "Ali" wants to join, treasurer converts to member
16. Ali's 3 session payments (267 BDT) transferred, surcharge -500 applied

**Week 4:**
17. Views reports before team meeting:
    - Team balance: 6200 BDT
    - Total collected: 3000 BDT contributions
    - Total spent: 2000 BDT sessions
    - Net positive: +1000 BDT this month
18. Exports PDF report for team
19. Adjusts thresholds for next month based on trends

---

## 🎨 User Experience Priorities

### Must-Have Features
1. ✅ Fast PIN-based attendance marking (mobile-optimized)
2. ✅ Automatic fee calculation with surcharges and fines
3. ✅ Real-time balance updates and threshold alerts
4. ✅ Guest management and conversion
5. ✅ Bulk payment support
6. ✅ Comprehensive reports and analytics

### Nice-to-Have Features
- Offline mode for attendance marking
- Push notifications for alerts
- Email/SMS reminders for low balance
- QR code for member cards
- Calendar view for sessions
- Attendance history charts
- Voice input for attendance

### Performance Requirements
- Page load: < 2 seconds
- API response: < 500ms
- Real-time updates: < 1 second
- Mobile-responsive: All pages
- Offline support: Attendance marking
- Auto-save: Every 30 seconds

---

## 📱 Mobile-First Considerations

Since managers mark attendance at the field, these workflows MUST be mobile-optimized:

1. **Attendance Marking**: Large buttons, PIN search, auto-scroll
2. **Session Creation**: Quick forms, field selection dropdown
3. **Dashboard**: Stackable cards, swipe gestures
4. **Member Lookup**: Fast search, recent members
5. **Guest Addition**: Minimal inputs, autocomplete

---

## 🔐 Security Considerations

1. **PIN Privacy**: Never display full PIN in public views
2. **Balance Privacy**: Members only see own balance (not others')
3. **Transaction Privacy**: Members only see own transactions
4. **Role-Based Access**: Enforce permissions on frontend and backend
5. **Audit Trail**: Log all financial operations

---

## ✅ Success Metrics

**User Adoption:**
- 100% of sessions use digital attendance (vs paper)
- 80% of contributions recorded within 24 hours
- 90% of members use PIN for attendance

**Efficiency:**
- Attendance marking: < 30 seconds per member
- Session finalization: < 2 minutes
- Contribution recording: < 1 minute

**Accuracy:**
- 0% calculation errors in fee splitting
- 100% automatic fine application
- 100% surcharge application for new members

**Financial Health:**
- Treasury stays above threshold 80% of time
- < 20% of members below balance threshold
- Fines reduce consecutive absences by 50%

---

## 🎯 Conclusion

This user story document provides a comprehensive view of how different users interact with the BITS Football Team Treasury Management System. Each story includes:

- **User role and goal**
- **Acceptance criteria**
- **API endpoints**
- **Step-by-step workflow**

Use these stories to guide frontend development, ensuring all features match real user needs.

---

**Next Steps:**
1. Review stories with stakeholders (team treasurer, manager, members)
2. Prioritize must-have vs nice-to-have features
3. Create frontend task list from workflows
4. Design UI mockups for key pages
5. Implement features iteratively, testing with real users
