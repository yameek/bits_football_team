# API Testing Guide - New Endpoints

## Settings Module (7 endpoints)

### 1. Get All Settings
```bash
curl -s http://localhost:3000/settings | jq '.'
```

**Response:**
```json
[
  {
    "id": 1,
    "key": "treasury_min_threshold",
    "value": "5000",
    "description": "Minimum treasury balance before alert (BDT)",
    "created_at": "2025-11-02T22:10:45.490Z",
    "updated_at": "2025-11-02T22:10:45.490Z"
  },
  // ... 7 more settings
]
```

### 2. Get Specific Setting
```bash
curl -s http://localhost:3000/settings/treasury_min_threshold | jq '.'
```

### 3. Get Setting Value Only
```bash
curl -s http://localhost:3000/settings/fine_percentage/value | jq '.'
```

**Response:**
```json
{
  "value": "20"
}
```

### 4. Update Setting
```bash
curl -s -X PUT http://localhost:3000/settings/treasury_min_threshold \
  -H "Content-Type: application/json" \
  -d '{"value": "6000"}' | jq '.'
```

### 5. Create New Setting
```bash
curl -s -X POST http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "key": "max_guests_per_session",
    "value": "5",
    "description": "Maximum guests allowed per session"
  }' | jq '.'
```

### 6. Delete Setting
```bash
curl -s -X DELETE http://localhost:3000/settings/max_guests_per_session
```

### 7. Refresh Cache
```bash
curl -s -X POST http://localhost:3000/settings/refresh-cache | jq '.'
```

**Response:**
```json
{
  "message": "Settings cache refreshed successfully"
}
```

---

## Member PIN Endpoints (2 endpoints)

### 1. Create Member with PIN
```bash
curl -s -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "contactNumber": "+8801712345678",
    "pin": "EMP001"
  }' | jq '.'
```

**Response:**
```json
{
  "id": 4,
  "name": "Alice Johnson",
  "pin": "EMP001",
  "contact_number": "+8801712345678",
  "balance": "0.00",
  "consecutive_absences": 0,
  "status": "active",
  "created_at": "2025-11-02T22:17:48.543Z",
  "updated_at": "2025-11-02T22:17:48.543Z"
}
```

### 2. Find Member by PIN
```bash
curl -s http://localhost:3000/members/by-pin/EMP001 | jq '.'
```

### 3. Verify PIN (POST version)
```bash
curl -s -X POST http://localhost:3000/members/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin": "EMP001"}' | jq '.'
```

### 4. Update Member PIN
```bash
curl -s -X PUT http://localhost:3000/members/4 \
  -H "Content-Type: application/json" \
  -d '{"pin": "EMP999"}' | jq '.'
```

---

## Testing New Fields in Existing Endpoints

### Member with consecutive_absences
```bash
curl -s http://localhost:3000/members/1 | jq '.'
```

**Response includes:**
```json
{
  "id": 1,
  "name": "John Doe",
  "pin": null,
  "consecutive_absences": 0,
  "balance": "-115.75",
  // ...
}
```

### Transaction with payment_provider
```bash
# Create transaction with payment provider
curl -s -X POST http://localhost:3000/members/1/contributions \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "method": "mobile",
    "notes": "Paid via bKash"
  }' | jq '.'
```

---

## Database Verification Queries

### Check new columns in members table
```bash
docker exec football_treasury_db psql -U football_admin -d football_treasury \
  -c "SELECT id, name, pin, consecutive_absences, balance FROM members;"
```

### Check settings
```bash
docker exec football_treasury_db psql -U football_admin -d football_treasury \
  -c "SELECT key, value, description FROM settings ORDER BY key;"
```

### Check new tables exist
```bash
docker exec football_treasury_db psql -U football_admin -d football_treasury \
  -c "\dt" | grep -E "(settings|alerts|guests)"
```

### View transaction types (including new ones)
```bash
docker exec football_treasury_db psql -U football_admin -d football_treasury \
  -c "SELECT unnest(enum_range(NULL::transaction_type));"
```

**Expected output:**
```
contribution
session_fee
onfield_payment
refund
adjustment
bulk_payment
fine
```

---

## Swagger Documentation

### Access Swagger UI
```
http://localhost:3000/api
```

### New sections visible:
- **Settings** (7 endpoints)
- **Members** - Updated with PIN endpoints (11 total)

---

## Testing Scenarios

### Scenario 1: Member Identification via PIN
```bash
# 1. Create member with PIN
curl -s -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","contactNumber":"+8801812345678","pin":"EMP002"}' | jq '.id'

# 2. Find member by PIN instead of ID
curl -s http://localhost:3000/members/by-pin/EMP002 | jq '.name, .balance'

# 3. Verify PIN exists
curl -s -X POST http://localhost:3000/members/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"pin":"EMP002"}' | jq '.id, .name'
```

### Scenario 2: Configurable Settings
```bash
# 1. Get current fine percentage
curl -s http://localhost:3000/settings/fine_percentage/value | jq '.value'

# 2. Update fine percentage from 20% to 25%
curl -s -X PUT http://localhost:3000/settings/fine_percentage \
  -H "Content-Type: application/json" \
  -d '{"value":"25"}' | jq '.value'

# 3. Get updated value
curl -s http://localhost:3000/settings/fine_percentage/value | jq '.value'

# 4. Reset back to 20%
curl -s -X PUT http://localhost:3000/settings/fine_percentage \
  -H "Content-Type: application/json" \
  -d '{"value":"20"}' | jq '.value'
```

### Scenario 3: Check All New Fields
```bash
# Get member with all new fields
curl -s http://localhost:3000/members/1 | jq '{
  id,
  name,
  pin,
  consecutive_absences,
  balance
}'

# Get transaction (check for new type support in future)
curl -s http://localhost:3000/transactions/1 | jq '{
  id,
  transaction_type,
  amount,
  bulk_payment_group,
  payment_provider
}'
```

---

## Error Handling Tests

### Test 1: Invalid PIN
```bash
curl -s http://localhost:3000/members/by-pin/INVALID999 | jq '.'
```

**Expected:** 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Member with PIN \"INVALID999\" not found"
}
```

### Test 2: Duplicate PIN
```bash
# Create first member with PIN
curl -s -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Test 1","pin":"DUP001"}' | jq '.id'

# Try to create second member with same PIN
curl -s -X POST http://localhost:3000/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Test 2","pin":"DUP001"}' | jq '.'
```

**Expected:** 500 Internal Server Error (duplicate key violation)

### Test 3: Non-existent Setting
```bash
curl -s http://localhost:3000/settings/invalid_key | jq '.'
```

**Expected:** 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Setting with key \"invalid_key\" not found"
}
```

---

## Quick Status Check

### One-liner to verify everything is working
```bash
echo "Settings count:" && \
curl -s http://localhost:3000/settings | jq 'length' && \
echo "Members with PIN:" && \
curl -s http://localhost:3000/members | jq '[.[] | select(.pin != null)] | length' && \
echo "Total endpoints:" && \
curl -s http://localhost:3000/api-json | jq '.paths | keys | length'
```

**Expected output:**
```
Settings count:
8
Members with PIN:
2
Total endpoints:
50
```
