# Football Team Treasury - New Requirements Summary

## 📋 Overview
8 new use cases have been identified to enhance the treasury management system with advanced features for member management, financial controls, and flexible payment handling.

---

## 🎯 New Use Cases

### 1️⃣ Member PIN Authentication
**What**: Each member has a unique PIN (Organization ID) for identification
- PIN: 4-6 digit unique identifier
- Used for: Attendance marking, payment verification
- **Priority**: HIGH (Essential for mobile/tablet attendance)

### 2️⃣ Treasury Fund Threshold (5000 BDT)
**What**: Alert when treasury balance falls below 5000 BDT
- Prevents fund depletion
- Configurable threshold in settings
- Real-time alerts and notifications
- **Priority**: HIGH (Financial safety)

### 3️⃣ Member Balance Threshold (250 BDT)
**What**: Alert when individual member balance falls below 250 BDT
- Shows list of members in threshold margin
- Warnings before finalization if member would go below
- Configurable threshold
- **Priority**: HIGH (Member protection)

### 4️⃣ Enhanced Payment Types
**What**: Support for Cash, bKash, Bank Transfer
- Already implemented: CASH, BANK, MOBILE
- **Enhancement**: Add payment provider details (bKash, Nagad, Rocket)
- Track transaction reference IDs
- **Priority**: MEDIUM (Enhancement to existing)

### 5️⃣ Bulk Payment (Joint Payment)
**What**: One member pays for multiple members together
- **Example**: Member A pays 1000 BDT for A + B + C + D
- System splits amount equally: 250 BDT each
- All transactions linked with bulk_payment_group
- **Priority**: HIGH (Common team practice)

### 6️⃣ Guest Management & Dynamic Member Addition
**What**: Non-members can attend as guests, members pay for them
- Guests tracked separately from members
- Session fee = totalCost / (members + guests)
- Only members charged (guests paid on-field)
- Convert guest to member from attendance page
- **Priority**: HIGH (Essential for realistic sessions)

### 7️⃣ Automatic Fines for Consecutive Absences
**What**: Members missing 2 consecutive sessions fined 20% per session
- Auto-apply fine after threshold reached
- Configurable: absence limit (2), fine percentage (20%)
- Counter resets on attendance
- Creates 'fine' transaction
- **Priority**: MEDIUM (Automated enforcement)

### 8️⃣ New Member Surcharge
**What**: New members (< 90 days) pay 15-20% extra per session
- Probation period: 90 days (configurable)
- Surcharge: 15-20% (configurable)
- Automatically applied in finalization
- Shows in attendance notes
- **Priority**: MEDIUM (Revenue optimization)

---

## 🏗️ Implementation Breakdown

### Phase 1: Foundation (Critical) 🔴
**Priority**: Implement first - Required for core functionality

1. **Database Migrations** (Task #9)
   - Add member.pin, member.consecutive_absences
   - Create settings, alerts, guests tables
   - Add bulk_payment_group to transactions
   - Add new transaction types (bulk_payment, fine)
   - **Effort**: 2-3 hours

2. **Settings Module** (Task #5 - Part 1)
   - Create Settings entity and module
   - Endpoints: GET/PUT /settings/:key
   - Insert default configurations
   - **Effort**: 3-4 hours

3. **Member PIN** (Task #2)
   - Update Member entity with PIN
   - Add PIN validation
   - POST /members/verify-pin endpoint
   - **Effort**: 2-3 hours

### Phase 2: Payment Features (High Priority) 🟡
**Priority**: Implement second - Enhances usability

4. **Bulk Payment System** (Task #3)
   - Create BulkPaymentDto
   - POST /transactions/bulk-payment endpoint
   - Split logic and transaction creation
   - Link transactions with bulk_payment_group
   - **Effort**: 4-5 hours

5. **Guest Management** (Task #4)
   - Create Guest entity and module
   - POST /sessions/:id/guests - Add guest
   - GET /sessions/:id/guests - List guests
   - POST /guests/:id/convert-to-member
   - Update finalization logic for guests
   - **Effort**: 5-6 hours

### Phase 3: Financial Controls (Important) 🟠
**Priority**: Implement third - Safety and alerts

6. **Alert System** (Task #5 - Part 2)
   - Create Alert entity and module
   - Treasury threshold monitoring
   - Member balance threshold monitoring
   - GET /alerts, POST /alerts/:id/resolve
   - GET /reports/treasury-status
   - GET /members/below-threshold
   - **Effort**: 4-5 hours

7. **Threshold Alerts Integration**
   - Hook alerts into transaction creation
   - Hook alerts into session finalization
   - Real-time threshold checking
   - **Effort**: 2-3 hours

### Phase 4: Advanced Rules (Enhancement) 🟢
**Priority**: Implement last - Nice to have

8. **Automatic Fines** (Task #6)
   - Add consecutive_absences tracking
   - Auto-apply fine logic in markAttendanceBulk
   - Create fine transactions
   - GET /members/at-risk-of-fine endpoint
   - **Effort**: 4-5 hours

9. **New Member Surcharge** (Task #7)
   - Check member join date
   - Apply surcharge in finalization
   - Add surcharge notes to attendance
   - GET /members/new-members endpoint
   - **Effort**: 3-4 hours

10. **Payment Provider Details** (Task #8) - OPTIONAL
    - Add payment_provider, payment_reference fields
    - Update transaction DTOs
    - **Effort**: 1-2 hours

---

## 📊 Impact Analysis

### New Database Tables: 3
1. **settings** - Configuration storage
2. **alerts** - Alert tracking
3. **guests** - Guest management

### Updated Tables: 2
1. **members** - +pin, +consecutive_absences
2. **transactions** - +bulk_payment_group, +payment_provider, +payment_reference

### New Modules: 3
1. **SettingsModule** - Configuration management
2. **AlertsModule** - Alert system
3. **GuestsModule** - Guest management

### New Endpoints: ~25
- Settings: 3 endpoints
- Alerts: 4 endpoints
- Members (enhanced): 5 endpoints
- Bulk Payment: 2 endpoints
- Guests: 5 endpoints
- Reports (enhanced): 3 endpoints
- Misc: 3 endpoints

### Total Endpoints After Implementation: ~66
- Current: 41 endpoints
- New: ~25 endpoints

---

## ⏱️ Estimated Timeline

### Total Development Time: 30-40 hours

**Week 1: Foundation (10-12 hours)**
- Database migrations
- Settings module
- Member PIN authentication

**Week 2: Payment Features (9-11 hours)**
- Bulk payment system
- Guest management & conversion
- Finalization logic updates

**Week 3: Financial Controls (6-8 hours)**
- Alert system
- Threshold monitoring
- Alert integration

**Week 4: Advanced Rules (7-9 hours)**
- Automatic fines
- New member surcharge
- Payment provider details (optional)

**Week 5: Testing & Documentation (8-10 hours)**
- Unit tests for new features
- Integration tests
- API documentation updates
- User guide updates

---

## 🔧 Technical Considerations

### 1. Backward Compatibility
- Existing data migration needed for:
  - Members without PIN → Generate or require manual entry
  - Existing transactions → bulk_payment_group = null
  - No alerts for historical data

### 2. Performance
- Settings: Cache in memory, reload on update
- Alerts: Index on is_resolved and member_id
- Bulk payment: Transaction in database for atomicity

### 3. Validation
- PIN: Unique, 4-6 digits, not sequential (1234, 5678)
- Bulk payment: Total amount must equal sum of individual amounts
- Guest conversion: Check for duplicate phone numbers
- Threshold: Prevent negative values in settings

### 4. Security
- PIN should be hashed if used for authentication
- Bulk payment: Verify paying member has sufficient balance
- Settings: Admin-only access to modify

### 5. Business Logic Edge Cases
- **Bulk payment**: What if one beneficiary is inactive?
- **Guest conversion**: What if guest becomes member mid-session?
- **Fine**: What if member balance goes too negative?
- **Surcharge**: What if member rejoins after leaving?

---

## 📝 Configuration Defaults

```javascript
const DEFAULT_SETTINGS = {
  treasury_min_threshold: 5000,      // BDT
  member_min_threshold: 250,         // BDT
  fine_percentage: 20,               // %
  consecutive_absence_limit: 2,      // sessions
  new_member_surcharge: 15,          // %
  new_member_period_days: 90,        // days
  currency: 'BDT',
  rounding_increment: 0.25,          // BDT
};
```

---

## 🎨 UI/UX Enhancements Needed

### Dashboard Widgets
1. **Alerts Panel** - Show active alerts (treasury low, member low balance, fines)
2. **Treasury Health** - Progress bar showing distance from threshold
3. **Members at Risk** - List of members with low balance or consecutive absences

### Member Management
1. **PIN Entry** - PIN field in create/edit member form
2. **Balance Indicator** - Color coding (green > 250, yellow 100-250, red < 100)
3. **New Member Badge** - Visual indicator for members under surcharge

### Session Management
1. **Guest Addition** - Quick add guest form during attendance
2. **Bulk Payment Modal** - Select multiple members, enter amount, split equally
3. **Fee Breakdown** - Show base fee + surcharge/fine separately

### Attendance Page
1. **PIN Lookup** - Enter PIN to mark attendance (tablet-friendly)
2. **Guest List** - Show guests separately from members
3. **Convert to Member** - Button next to guest names
4. **Absence Streak** - Show warning icon for members at 1 absence

---

## 📚 API Examples

### Bulk Payment
```bash
POST /transactions/bulk-payment
{
  "payingMemberId": 1,
  "beneficiaryMemberIds": [1, 2, 3, 4],
  "totalAmount": 1000,
  "method": "mobile",
  "provider": "bkash",
  "notes": "Joint payment for 4 members"
}

Response:
{
  "bulkPaymentGroup": "BULK-2025-11-02-001",
  "transactions": [
    { "memberId": 1, "amount": 250, "transactionId": 101 },
    { "memberId": 2, "amount": 250, "transactionId": 102 },
    { "memberId": 3, "amount": 250, "transactionId": 103 },
    { "memberId": 4, "amount": 250, "transactionId": 104 }
  ]
}
```

### Add Guest
```bash
POST /sessions/1/guests
{
  "name": "Guest John",
  "contactNumber": "+8801712345678",
  "broughtByMemberId": 3,
  "paidByMemberId": 3,
  "amountPaid": 100
}
```

### Convert Guest to Member
```bash
POST /guests/5/convert-to-member
{
  "pin": "1234",
  "initialBalance": 0
}

Response:
{
  "message": "Guest converted to member successfully",
  "member": { ... },
  "guestRecord": { "convertedToMember": true, "convertedMemberId": 10 }
}
```

### Get Members Below Threshold
```bash
GET /members/below-threshold

Response:
[
  {
    "id": 2,
    "name": "Jane Smith",
    "balance": 180.50,
    "threshold": 250,
    "deficit": 69.50,
    "lastPayment": "2025-10-28T10:00:00Z"
  },
  ...
]
```

---

## ✅ Success Criteria

### Phase 1 Complete When:
- [x] Settings table created with 6 default configs
- [x] All members have unique PINs
- [x] PIN verification endpoint working

### Phase 2 Complete When:
- [x] Bulk payment creates linked transactions
- [x] Guests can be added to sessions
- [x] Guest conversion to member works
- [x] Finalization includes guest count

### Phase 3 Complete When:
- [x] Treasury threshold alert triggers correctly
- [x] Member threshold alert triggers correctly
- [x] Alert dashboard shows active alerts
- [x] GET /members/below-threshold returns accurate list

### Phase 4 Complete When:
- [x] Consecutive absences tracked accurately
- [x] Fine auto-applied after 2 absences
- [x] New member surcharge calculated correctly
- [x] All edge cases handled

### Final Acceptance:
- [x] All 25 new endpoints documented in Swagger
- [x] All new features have unit tests (>80% coverage)
- [x] Migration scripts tested on production-like data
- [x] User documentation updated
- [x] Performance benchmarks met (< 200ms avg response)

---

## 🚀 Next Steps

1. **Review & Approve** - Stakeholder sign-off on requirements
2. **Start Phase 1** - Database migrations and foundation
3. **Iterative Development** - Complete one phase before moving to next
4. **Testing** - Write tests alongside development
5. **Documentation** - Update API docs after each phase
6. **Deployment** - Staged rollout (dev → staging → production)

---

**Document Created**: November 2, 2025  
**Status**: Requirements Gathering Complete  
**Estimated Completion**: 4-5 weeks (part-time development)  
**See**: NEW_REQUIREMENTS.md for detailed implementation plans
