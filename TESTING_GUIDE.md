# 🚀 BITS Football Team Treasury - Testing Guide

## ✅ Services Running

Both services are now running and ready for testing!

### **Service URLs**
- 🌐 **Frontend**: http://localhost:3001
- 🔌 **Backend API**: http://localhost:3000
- 📊 **API Documentation (Swagger)**: http://localhost:3000/api
- 🗄️ **Database**: PostgreSQL (Docker container)

---

## 📋 Test Scenarios

### **1. Dashboard Testing**

**URL**: http://localhost:3001

**What to Test**:
- ✅ View team balance (should show current balance)
- ✅ Check active members count (currently 7 members)
- ✅ View active alerts
- ✅ See upcoming sessions
- ✅ Click quick action cards

**Expected**:
- Dashboard loads with metrics
- Alerts shown if treasury < 5000 BDT or members < 250 BDT
- Cards are clickable and navigate correctly

---

### **2. Member Management**

#### **View Members**
**URL**: http://localhost:3001/members

**Test**:
- ✅ See all 7 members in database
- ✅ Search by name: Try "John"
- ✅ Search by PIN: Try "1234"
- ✅ Check balance color coding:
  - Red: Negative balance
  - Yellow: 0-250 BDT
  - Green: > 250 BDT
- ✅ Click on a member to view details

**Existing Members**:
1. John Doe (PIN: 1234, Balance: 1726.50 BDT) ✅ Green
2. Jane Smith (Balance: -223.50 BDT) ⚠️ Red
3. Bob Wilson (Balance: 15.75 BDT, 2 absences) ⚠️ Yellow
4. Test Member with PIN (PIN: EMP001, Balance: -10 BDT)
5. Ahmed Hassan (PIN: 5678, Balance: 190 BDT, 2 absences)
6. Test New Member (PIN: 9999, Balance: -500 BDT)
7. Audit Test Member (PIN: 9998, Balance: -500 BDT)

#### **Create New Member**
**URL**: http://localhost:3001/members/new

**Test**:
1. ✅ Fill in name: "Test User"
2. ✅ Fill in contact: "+8801712345678"
3. ✅ Click "Generate" for PIN
4. ✅ See warning: "500 BDT surcharge will be charged"
5. ✅ Click "Create Member"
6. ✅ Should redirect to member details
7. ✅ Check balance is -500 BDT

#### **Member Details & Add Contribution**
**URL**: http://localhost:3001/members/1 (John Doe)

**Test**:
1. ✅ View current balance: 1726.50 BDT
2. ✅ Click "Add Contribution"
3. ✅ Enter amount: 1000 BDT
4. ✅ Select method: bKash
5. ✅ Add note: "Test contribution"
6. ✅ Submit
7. ✅ Check balance updates to 2726.50 BDT

---

### **3. Session Management**

#### **Create Session**
**URL**: http://localhost:3001/sessions/new

**Test**:
1. ✅ Select type: Practice
2. ✅ Select field from dropdown
3. ✅ Pick date: Tomorrow
4. ✅ Pick time: 18:00
5. ✅ Enter costs:
   - Field: 600
   - Transport: 100
   - Drinks: 50
   - Emergency: 50
6. ✅ See total: 800 BDT
7. ✅ Click "Create Session"
8. ✅ Should redirect to session details

#### **Mark Attendance** (Mobile-Optimized)
**URL**: http://localhost:3001/sessions/[id]/attendance

**Test**:
1. ✅ Search by PIN: Type "1234"
2. ✅ See John Doe highlighted
3. ✅ Click "Present" button (turns green)
4. ✅ Try search by name: "Ahmed"
5. ✅ Mark Ahmed as "Late" (turns yellow)
6. ✅ Mark Bob as "Absent" (turns red)
7. ✅ See warning: "Bob has 1 consecutive absence"
8. ✅ Try "Mark All Present" button
9. ✅ See summary: Present: X, Late: X, Absent: X
10. ✅ Click "Save Attendance"

#### **Finalize Session**
**URL**: http://localhost:3001/sessions/[id]/finalize

**Test**:
1. ✅ See cost calculation:
   - Total: 800 BDT
   - Attendees: 5 (for example)
   - Per-head: 160 BDT
2. ✅ Check member charges:
   - New members show 15% surcharge
   - Members with 2 absences show fine
3. ✅ See warnings for low balance
4. ✅ Click "Confirm Finalization"
5. ✅ Check members' balances updated
6. ✅ Session status changes to "Completed"

---

### **4. Transactions**

#### **View Transactions**
**URL**: http://localhost:3001/transactions

**Test**:
- ✅ See all transactions
- ✅ Color coding:
  - Green: Contributions (+)
  - Red: Session fees, fines (-)
  - Purple: Surcharges
- ✅ Filter by type: Select "Contribution"
- ✅ Search by member: Type "John"

#### **Bulk Payment**
**URL**: http://localhost:3001/transactions/bulk-payment

**Test**:
1. ✅ Select paying member: John Doe
2. ✅ Check beneficiaries: John, Jane, Bob (3 members)
3. ✅ Enter total: 1500 BDT
4. ✅ Select split: Equal
5. ✅ See per person: 500 BDT each
6. ✅ Click "Create Bulk Payment"
7. ✅ Check all 3 members get +500 BDT
8. ✅ John pays -1500 BDT (net: 0)

**Test Custom Split**:
1. ✅ Change split type: Custom
2. ✅ Enter amounts: John: 500, Jane: 600, Bob: 400
3. ✅ Total must match: 1500 BDT
4. ✅ Submit

---

### **5. Alerts**

**URL**: http://localhost:3001/alerts

**Test**:
- ✅ View unresolved alerts
- ✅ Should see alerts for:
  - Members below 250 BDT (Jane, Bob, Test Member)
  - Possibly treasury low alert
- ✅ Click "Resolve" on an alert
- ✅ Add resolution note: "Contacted member"
- ✅ Submit
- ✅ Alert moves to "Resolved" tab

---

### **6. Reports**

#### **Team Balance Report**
**URL**: http://localhost:3001/reports/team-balance

**Test**:
- ✅ See current team balance
- ✅ View total collected
- ✅ View total spent
- ✅ See net balance

#### **Member Balances Report**
**URL**: http://localhost:3001/reports/member-balances

**Test**:
- ✅ See all members sorted by balance (lowest first)
- ✅ Statistics:
  - In credit: Members with positive balance
  - In debt: Members with negative balance
  - Below threshold: < 250 BDT
- ✅ Color-coded balances
- ✅ Consecutive absence indicators

---

### **7. Settings**

**URL**: http://localhost:3001/settings

**Test**:
1. ✅ View current settings:
   - Treasury threshold: 5000
   - Member threshold: 250
   - Fine percentage: 20
   - Surcharge: 500
2. ✅ Click "Edit" on treasury threshold
3. ✅ Change to 7000
4. ✅ Click "Save"
5. ✅ See success message
6. ✅ Verify new threshold takes effect

---

## 🧪 Advanced Testing Scenarios

### **Scenario 1: Complete Session Workflow**
1. Create new member "Test Player" → -500 BDT
2. Add 1000 BDT contribution → 500 BDT
3. Create practice session → 800 BDT total
4. Mark attendance (5 present, 2 absent)
5. Finalize session → 160 BDT per person
6. Check "Test Player" balance → 340 BDT (500 - 160)
7. Verify transactions created

### **Scenario 2: Consecutive Absence Fine**
1. Find member with 1 absence (e.g., Bob)
2. Create new session
3. Mark Bob as absent
4. Finalize session
5. Bob should get 20% fine applied
6. Check alerts for fine notification

### **Scenario 3: New Member Surcharge**
1. Create member (today's date) → -500 BDT
2. Add 1000 BDT contribution → 500 BDT
3. Create session, mark as present
4. Finalize → Check 15% surcharge applied
5. Member charged more than regular members

### **Scenario 4: Threshold Alerts**
1. Check current team balance
2. If > 5000, create sessions until < 5000
3. Dashboard should show alert
4. Check alerts page for "Treasury Low"
5. Add contributions to resolve
6. Mark alert as resolved

---

## 🐛 Known Test Data

**Members with Issues**:
- Jane Smith: -223.50 BDT (needs contribution)
- Bob Wilson: 15.75 BDT + 2 absences (will be fined next absence)
- Test Member: -10 BDT + 2 absences (already fined)
- Ahmed Hassan: 190 BDT + 2 absences (below threshold)
- New members: -500 BDT (just surcharge)

**Good for Testing**:
- John Doe: 1726.50 BDT (healthy balance, can pay for others)

---

## 📱 Mobile Testing

**Best for Mobile**:
- Attendance marking page (designed for field use)
  - Large buttons
  - PIN search
  - Quick marking

**Test on Mobile**:
1. Open http://localhost:3001/sessions/[id]/attendance
2. Use phone keyboard for PIN entry
3. Tap Present/Late/Absent buttons
4. Should be easy to use with one hand

---

## ✅ Success Criteria

After testing, verify:
- [x] All pages load without errors
- [x] Data displays correctly
- [x] Forms submit successfully
- [x] Calculations are accurate
- [x] Balances update correctly
- [x] Alerts trigger appropriately
- [x] Navigation works smoothly
- [x] Mobile interface is usable
- [x] Color coding is clear
- [x] Search/filter works

---

## 🔧 Troubleshooting

**If frontend doesn't load**:
```bash
# Check frontend logs
cat /tmp/frontend.log

# Restart frontend
cd frontend
npm run dev
```

**If backend doesn't respond**:
```bash
# Check backend logs
cat /tmp/backend.log

# Restart backend
cd backend
npm run dev
```

**If database connection fails**:
```bash
cd backend
docker compose up -d
```

---

## 📞 Service Management

**Stop Services**:
```bash
# Frontend & Backend: Press Ctrl+C or kill process
pkill -f "npm run dev"

# Database
cd backend
docker compose down
```

**Restart Services**:
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

---

## 🎉 Happy Testing!

Both frontend and backend are fully integrated and ready to use!

**Start here**: http://localhost:3001

---

🤖 Generated with [Qoder](https://qoder.com)
