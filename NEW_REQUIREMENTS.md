# New Requirements - Enhanced Features

## New Use Cases Implementation Plan

### 1. ✅ Member PIN Number (Organization ID)
**Requirement**: Members have a PIN number that is the ID of the organization

**Implementation**:
- [x] Add `pin` field to Member entity (nullable, unique, 4-6 digits)
- [x] Add PIN validation in CreateMemberDto and UpdateMemberDto
- [x] Index on PIN for fast lookup
- [ ] **TODO**: Add endpoint `POST /members/verify-pin` for PIN authentication
- [ ] **TODO**: Use PIN for attendance marking (alternative to member ID)

**Database Changes**:
```sql
ALTER TABLE members ADD COLUMN pin VARCHAR(10) UNIQUE;
CREATE INDEX idx_members_pin ON members(pin);
```

---

### 2. ⏳ Treasury Fund Threshold Alert
**Requirement**: Treasury fund cannot be below 5000, raise alert when reached

**Implementation Plan**:
- [ ] Create `Settings` entity for configurable thresholds
  - `treasury_min_threshold` (default: 5000)
  - `member_min_threshold` (default: 250)
  - `fine_percentage` (default: 20)
  - `new_member_surcharge` (default: 15-20%)
- [ ] Add `Alert` entity to track alerts
  - alert_type: 'treasury_low', 'member_low_balance', 'fine_applied'
  - triggered_at, resolved_at, status
- [ ] Modify team balance calculation to check threshold
- [ ] Create alerts service to manage notifications
- [ ] **Endpoint**: `GET /alerts` - Get active alerts
- [ ] **Endpoint**: `GET /reports/treasury-status` - Check treasury health
- [ ] Add alert trigger in transaction creation (after balance updates)

**Files to Create**:
- `src/entities/settings.entity.ts`
- `src/entities/alert.entity.ts`
- `src/alerts/alerts.module.ts`
- `src/alerts/alerts.service.ts`
- `src/alerts/alerts.controller.ts`

---

### 3. ⏳ Individual Member Balance Threshold
**Requirement**: Individual member fund cannot be below 250, raise alert and show list of members in threshold margin

**Implementation Plan**:
- [ ] Check member balance threshold after each deduction
- [ ] Create alert when balance falls below threshold
- [ ] **Endpoint**: `GET /members/below-threshold` - List members with low balance
- [ ] Add warning in finalization if member would go below threshold
- [ ] Optional: Prevent finalization if it would push member below threshold
- [ ] Show threshold margin members in dashboard

**Business Logic**:
```typescript
// In session finalization
if (member.balance - perHeadFee < MEMBER_MIN_THRESHOLD) {
  createAlert({
    type: 'member_low_balance',
    member_id: member.id,
    message: `Member ${member.name} balance will be ${member.balance - perHeadFee}`
  });
}
```

---

### 4. ✅ Payment Types Enhancement
**Requirement**: Payment types can be cash, bKash, or bank transfer

**Implementation**:
- [x] TransactionMethod enum already has: CASH, BANK, MOBILE
- [x] MOBILE covers bKash, Nagad, etc.
- [ ] **OPTIONAL**: Add specific payment provider field
  - Add `payment_provider` column: 'bkash', 'nagad', 'rocket', 'upay', etc.
- [ ] **OPTIONAL**: Add transaction reference/ID for digital payments

**Enhancement**:
```typescript
// Add to Transaction entity
@Column({ type: 'varchar', length: 50, nullable: true })
payment_provider: string; // 'bkash', 'nagad', 'rocket'

@Column({ type: 'varchar', length: 100, nullable: true })
payment_reference: string; // Transaction ID from payment gateway
```

---

### 5. ⏳ Bulk Payment (Joint Payment)
**Requirement**: 2-3 members do bulk payment together (one member pays for multiple members)

**Implementation Plan**:
- [ ] Create `BulkPaymentDto`:
  ```typescript
  {
    payingMemberId: number,
    beneficiaryMemberIds: number[], // Members being paid for
    totalAmount: number,
    method: 'cash' | 'bank' | 'mobile',
    notes?: string
  }
  ```
- [ ] Create `bulk-payment` transaction type
- [ ] Split amount equally among beneficiaries
- [ ] Create individual transactions for each member
- [ ] Link transactions with `reference` field (same reference for group)
- [ ] **Endpoint**: `POST /transactions/bulk-payment`
- [ ] Show bulk payment details in transaction history

**Database**:
```sql
-- Add to transaction_type enum
ALTER TYPE transaction_type ADD VALUE 'bulk_payment';

-- Link related transactions
ALTER TABLE transactions ADD COLUMN bulk_payment_group VARCHAR(50);
CREATE INDEX idx_bulk_payment_group ON transactions(bulk_payment_group);
```

**Example**:
```
Member A pays 1000 BDT for self + B + C + D (4 members)
→ Creates 4 transactions of 250 BDT each
→ All have same bulk_payment_group: 'BULK-2025-11-02-001'
→ Member A's balance: -1000
→ Members B, C, D get +250 credited
```

---

### 6. ⏳ Guest Payment & Dynamic Member Addition
**Requirement**: Guests can attend sessions, members pay for guests, session fee calculated based on attendance but only members charged, new members can be added from attendance page

**Implementation Plan**:
- [ ] Create `Guest` entity:
  ```typescript
  - id, name, contact_number
  - session_id (which session they attended)
  - brought_by_member_id (member who brought them)
  - paid_by_member_id (member who paid for them)
  - amount_paid
  ```
- [ ] Modify attendance marking to include guests
- [ ] Update finalization logic:
  - Calculate: (total_cost) / (members_present + guests_count)
  - Only charge attending members
  - Guest fees already collected via on-field payment
- [ ] **Endpoint**: `POST /sessions/:id/add-guest` - Add guest to session
- [ ] **Endpoint**: `POST /sessions/:id/guest/:guestId/convert-to-member` - Convert guest to member
- [ ] **Endpoint**: `GET /sessions/:id/guests` - List guests for session

**Files to Create**:
- `src/entities/guest.entity.ts`
- `src/guests/guests.module.ts`
- Add guest handling to SessionsService

**Finalization Logic Update**:
```typescript
const attendingMembers = attendees.filter(a => a.member);
const guestCount = await this.guestsRepository.count({ 
  where: { session_id: id } 
});

const perHeadFee = totalCost / (attendingMembers.length + guestCount);
// Round to 0.25
// Charge only members, guests already paid on-field
```

---

### 7. ⏳ Automatic Fine for Consecutive Absences
**Requirement**: Members who miss 2 consecutive sessions are fined 20% (configurable) of each session fee

**Implementation Plan**:
- [ ] Add `consecutive_absences` counter to Member entity
- [ ] Track absence streak in attendance marking
- [ ] Auto-apply fine when threshold reached (2 consecutive)
- [ ] Fine = 20% of session fee (configurable in Settings)
- [ ] Create `fine` transaction type
- [ ] Reset counter on attendance
- [ ] **Endpoint**: `GET /members/:id/absence-record` - View absence history
- [ ] **Endpoint**: `GET /members/at-risk-of-fine` - Members with 1 absence

**Business Logic**:
```typescript
// In markAttendanceBulk
if (attendance.status === 'absent') {
  member.consecutive_absences += 1;
  
  if (member.consecutive_absences >= 2) {
    const lastSession = await getLastSession();
    const fine = calculateSessionFee(lastSession) * FINE_PERCENTAGE;
    
    // Apply fine
    member.balance -= fine;
    createTransaction({
      type: 'fine',
      amount: -fine,
      notes: `Fine for ${member.consecutive_absences} consecutive absences`
    });
    
    createAlert({
      type: 'fine_applied',
      member_id: member.id
    });
  }
} else {
  member.consecutive_absences = 0; // Reset on attendance
}
```

**Database**:
```sql
ALTER TABLE members ADD COLUMN consecutive_absences INTEGER DEFAULT 0;
ALTER TYPE transaction_type ADD VALUE 'fine';
```

---

### 8. ⏳ New Member Surcharge
**Requirement**: New members pay 15-20% extra for session fees (configurable)

**Implementation Plan**:
- [ ] Add `join_date` to Member entity (already exists: `created_at`)
- [ ] Add `is_new_member` calculated field (joined < 3 months ago)
- [ ] Add `new_member_surcharge_percentage` to Settings (default: 15-20%)
- [ ] Modify finalization logic to apply surcharge
- [ ] Track surcharge separately in attendance `charged_amount`
- [ ] **Endpoint**: `GET /members/new-members` - List members under probation
- [ ] Show "New Member" badge in UI

**Finalization Logic Update**:
```typescript
for (const attendance of attendees) {
  const member = attendance.member;
  let memberFee = perHeadFee;
  
  // Check if new member (joined within last 90 days)
  const joinedDaysAgo = daysSince(member.created_at);
  if (joinedDaysAgo < 90) {
    const surcharge = perHeadFee * (NEW_MEMBER_SURCHARGE / 100);
    memberFee += surcharge;
    
    attendance.notes = `New member surcharge: ${surcharge} BDT`;
  }
  
  attendance.charged_amount = memberFee;
  member.balance -= memberFee;
}
```

**Database**:
```sql
-- Settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO settings (key, value, description) VALUES
('treasury_min_threshold', '5000', 'Minimum treasury balance before alert'),
('member_min_threshold', '250', 'Minimum member balance before alert'),
('fine_percentage', '20', 'Fine percentage for consecutive absences'),
('consecutive_absence_limit', '2', 'Number of consecutive absences before fine'),
('new_member_surcharge', '15', 'Extra percentage for new members'),
('new_member_period_days', '90', 'Days a member is considered "new"');
```

---

## Updated Implementation Priority

### Phase 1: Critical Enhancements (Immediate)
1. ✅ Payment types (already implemented with MOBILE)
2. **Member PIN authentication** - For attendance marking
3. **Bulk payment system** - High priority for team use
4. **Guest management** - Essential for session fee calculation

### Phase 2: Financial Controls (Important)
5. **Settings/Configuration module** - Foundation for thresholds
6. **Treasury threshold alerts** - Prevent fund depletion
7. **Member balance threshold alerts** - Member protection
8. **Alerts module & dashboard** - Centralized notifications

### Phase 3: Advanced Rules (Enhancement)
9. **Consecutive absence fines** - Automated enforcement
10. **New member surcharge** - Revenue optimization
11. **Alert notifications** - Email/SMS integration

---

## New Entities Required

### 1. Settings Entity
```typescript
@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  key: string;

  @Column('text')
  value: string;

  @Column('text', { nullable: true })
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
```

### 2. Alert Entity
```typescript
export enum AlertType {
  TREASURY_LOW = 'treasury_low',
  MEMBER_LOW_BALANCE = 'member_low_balance',
  FINE_APPLIED = 'fine_applied',
  CONSECUTIVE_ABSENCE = 'consecutive_absence',
}

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AlertType })
  alert_type: AlertType;

  @Column({ nullable: true })
  member_id: number;

  @Column('text')
  message: string;

  @Column({ default: false })
  is_resolved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  resolved_at: Date;

  @CreateDateColumn()
  triggered_at: Date;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;
}
```

### 3. Guest Entity
```typescript
@Entity('guests')
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  contact_number: string;

  @Column()
  session_id: number;

  @Column()
  brought_by_member_id: number;

  @Column({ nullable: true })
  paid_by_member_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_paid: number;

  @Column({ default: false })
  converted_to_member: boolean;

  @Column({ nullable: true })
  converted_member_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Session)
  @JoinColumn({ name: 'session_id' })
  session: Session;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'brought_by_member_id' })
  brought_by: Member;

  @ManyToOne(() => Member, { nullable: true })
  @JoinColumn({ name: 'paid_by_member_id' })
  paid_by: Member;
}
```

---

## Migration Scripts Needed

```sql
-- Add member PIN
ALTER TABLE members ADD COLUMN pin VARCHAR(10) UNIQUE;
CREATE INDEX idx_members_pin ON members(pin);

-- Add consecutive absences tracking
ALTER TABLE members ADD COLUMN consecutive_absences INTEGER DEFAULT 0;

-- Add bulk payment support
ALTER TABLE transactions ADD COLUMN bulk_payment_group VARCHAR(50);
ALTER TABLE transactions ADD COLUMN payment_provider VARCHAR(50);
CREATE INDEX idx_bulk_payment_group ON transactions(bulk_payment_group);

-- Add new transaction types
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'bulk_payment';
ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'fine';

-- Create settings table
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table
CREATE TYPE alert_type AS ENUM ('treasury_low', 'member_low_balance', 'fine_applied', 'consecutive_absence');

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_type alert_type NOT NULL,
  member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_alerts_member ON alerts(member_id);
CREATE INDEX idx_alerts_resolved ON alerts(is_resolved);

-- Create guests table
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_number VARCHAR(20),
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  brought_by_member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  paid_by_member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  amount_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  converted_to_member BOOLEAN DEFAULT FALSE,
  converted_member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guests_session ON guests(session_id);
CREATE INDEX idx_guests_brought_by ON guests(brought_by_member_id);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('treasury_min_threshold', '5000', 'Minimum treasury balance before alert (BDT)'),
('member_min_threshold', '250', 'Minimum member balance before alert (BDT)'),
('fine_percentage', '20', 'Fine percentage for consecutive absences'),
('consecutive_absence_limit', '2', 'Number of consecutive absences before fine'),
('new_member_surcharge', '15', 'Extra percentage for new members (%)'),
('new_member_period_days', '90', 'Days a member is considered "new"');
```

---

## API Endpoints to Add

### Settings Module
- `GET /settings` - Get all settings
- `GET /settings/:key` - Get setting by key
- `PUT /settings/:key` - Update setting value

### Alerts Module
- `GET /alerts` - Get all active alerts
- `GET /alerts/resolved` - Get resolved alerts
- `POST /alerts/:id/resolve` - Mark alert as resolved
- `GET /members/:id/alerts` - Get alerts for specific member

### Enhanced Members Module
- `POST /members/verify-pin` - Verify member PIN
- `GET /members/below-threshold` - List members with low balance
- `GET /members/new-members` - List new members (under surcharge period)
- `GET /members/at-risk-of-fine` - Members with consecutive absences

### Bulk Payment
- `POST /transactions/bulk-payment` - Record bulk payment for multiple members
- `GET /transactions/bulk-groups` - List all bulk payment groups

### Guests Module
- `POST /sessions/:id/guests` - Add guest to session
- `GET /sessions/:id/guests` - List guests for session
- `PUT /guests/:id/pay` - Record payment for guest
- `POST /guests/:id/convert-to-member` - Convert guest to member
- `DELETE /guests/:id` - Remove guest

### Enhanced Reports
- `GET /reports/treasury-status` - Treasury health with threshold check
- `GET /reports/fines-applied` - History of fines
- `GET /reports/surcharges-collected` - New member surcharges collected

---

**Total New Endpoints**: ~20-25 additional endpoints
**New Modules**: Settings, Alerts, Guests
**Entity Updates**: Member (pin, consecutive_absences), Transaction (bulk_payment_group, payment_provider)
