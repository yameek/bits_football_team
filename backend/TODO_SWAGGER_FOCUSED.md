# Updated Todo List - Swagger & Workflow Documentation Focus

## ✅ Completed

### Phase 1: Foundation
- ✅ Database schema updates (members, transactions, settings, alerts, guests)
- ✅ Settings Module with 7 endpoints
- ✅ Member PIN endpoints (2 new endpoints)
- ✅ Database migration executed successfully
- ✅ All endpoints tested and working

### Documentation Created
- ✅ **API_WORKFLOWS.md** - Complete user journeys with API call sequences
- ✅ **SWAGGER_CHECKLIST.md** - Comprehensive Swagger documentation status tracker
- ✅ **PHASE1_COMPLETION_SUMMARY.md** - Technical implementation details
- ✅ **TESTING_GUIDE.md** - cURL examples for all new endpoints

### Swagger Improvements (Just Completed)
- ✅ Created `VerifyPinDto` with full @ApiProperty decorators
- ✅ Created `CreateSettingDto` and `UpdateSettingDto` in separate file
- ✅ Enhanced Settings endpoints with request/response examples
- ✅ Fixed duplicate findByPin method

---

## 🔄 In Progress

### Phase 2: Alerts Module + Swagger
**Tasks:**
1. Generate AlertsModule, service, controller
2. Create endpoints: GET /alerts, GET /alerts/unresolved, POST /alerts/:id/resolve, GET /alerts/member/:id
3. Add comprehensive Swagger decorators:
   - @ApiTags('Alerts')
   - @ApiOperation with clear descriptions
   - @ApiResponse for all status codes (200, 404, etc.)
   - @ApiParam with examples
4. Create DTOs with @ApiProperty:
   - CreateAlertDto
   - ResolveAlertDto
   - AlertFilterDto
5. Add request/response examples in Swagger
6. Document workflow in API_WORKFLOWS.md:
   - When alerts are triggered (auto or manual)
   - How to filter alerts (by type, member, status)
   - How to resolve alerts
   - Frontend integration patterns
7. Test all endpoints in Swagger UI (/api)

**Expected Endpoints:**
```typescript
GET    /alerts                    // Get all alerts
GET    /alerts/unresolved         // Get unresolved only
GET    /alerts/member/:id         // Get alerts for specific member
GET    /alerts/:id                // Get single alert
POST   /alerts/:id/resolve        // Resolve alert
```

---

### Phase 2: Guests Module + Swagger
**Tasks:**
1. Generate GuestsModule, service, controller
2. Create endpoints: POST /sessions/:id/guests, GET /sessions/:id/guests, GET /guests/:id, POST /guests/:id/convert-to-member
3. Add comprehensive Swagger decorators
4. Create DTOs with @ApiProperty:
   - CreateGuestDto (name, contactNumber, broughtByMemberId, paidByMemberId, amountPaid)
   - ConvertGuestDto (pin, status)
5. Add request/response examples:
   - Guest added to session
   - Member pays for guest
   - Guest converts to member
   - Session with guests in fee split
6. Document workflow in API_WORKFLOWS.md:
   - Add guest to session
   - Record who brought guest and who paid
   - Convert guest to member (credit their payment)
   - Session finalization includes guests in per-head count
7. Update SessionsService.finalizeSession() to include guest count
8. Test in Swagger UI

**Expected Endpoints:**
```typescript
POST   /sessions/:id/guests           // Add guest to session
GET    /sessions/:id/guests           // List guests for session
GET    /guests/:id                    // Get guest details
POST   /guests/:id/convert-to-member  // Convert guest to member
```

---

## ⏳ Pending

### Phase 3: Bulk Payment System + Swagger
**Tasks:**
1. Add POST /transactions/bulk-payment endpoint
2. Create BulkPaymentDto with @ApiProperty:
   - member_ids[] (array of member IDs)
   - total_amount (number)
   - split_type (enum: 'equal' | 'custom')
   - amounts_per_member[] (for custom split)
   - payment_provider (string: 'bkash', 'nagad', 'rocket', etc.)
3. Add GET /transactions/bulk/:group_id endpoint
4. Implement split logic:
   - Equal split: divide total_amount by member count
   - Custom split: use provided amounts_per_member array
   - Generate unique bulk_payment_group ID
5. Add Swagger examples:
   - Equal split: 3 members, 3000 BDT → 1000 each
   - Custom split: member1=1000, member2=1500, member3=500
6. Document workflow:
   - Select members (UI: checkboxes)
   - Choose split type (UI: radio buttons)
   - If custom, input amounts per member
   - Execute payment
   - Verify individual transactions created
7. Create frontend integration guide in API_WORKFLOWS.md

---

### Phase 3: Threshold Monitoring + Alert Triggers
**Tasks:**
1. Inject SettingsService into TransactionsService and SessionsService
2. After each transaction (contribution, session fee, etc.):
   - Get treasury_min_threshold setting (5000 BDT)
   - Calculate total treasury balance
   - If balance < threshold: generate treasury_low alert
3. After each member balance update:
   - Get member_min_threshold setting (250 BDT)
   - Check member's new balance
   - If balance < threshold: generate member_low_balance alert
4. Document workflow in API_WORKFLOWS.md:
   - Transaction → Balance update → Threshold check → Alert generation (if needed)
   - Frontend shows alert notification
5. Add Swagger docs showing:
   - Which endpoints trigger alerts
   - Alert response structure
6. Test scenarios:
   - Treasury drops below 5000 → alert created
   - Member balance drops below 250 → alert created
   - Balance recovers → alert can be resolved

---

### Phase 4: Auto-Fines + Swagger
**Tasks:**
1. Update SessionsService.finalizeSession():
   - For each member NOT in attendance:
     - Increment consecutive_absences by 1
   - For each member IN attendance:
     - Reset consecutive_absences to 0
   - For members with consecutive_absences >= consecutive_absence_limit (2):
     - Calculate fine: session_fee * (fine_percentage / 100)
     - Create FINE transaction
     - Deduct from member balance
     - Generate fine_applied alert
     - Generate consecutive_absence alert
2. Update Swagger docs for POST /sessions/:id/finalize:
   - Add examples showing fine calculation
   - Document response includes fine transactions
3. Document workflow in API_WORKFLOWS.md:
   - Session created → Attendance marked → Finalization
   - Check each member's consecutive_absences
   - If >= 2: apply fine, create alert
   - If present: reset counter
4. Test scenarios:
   - Member misses 1 session: consecutive_absences = 1, no fine
   - Member misses 2nd session: consecutive_absences = 2, fine applied (20%)
   - Member attends next session: consecutive_absences = 0

---

### Phase 4: New Member Surcharge + Swagger
**Tasks:**
1. Update SessionsService.finalizeSession():
   - For each attending member:
     - Check member.created_at
     - Calculate days_since_joined = today - created_at
     - If days_since_joined < new_member_period_days (90):
       - Get new_member_surcharge setting (15%)
       - Calculate fee: base_fee * (1 + surcharge/100)
     - Else:
       - Use base_fee
   - Create transactions with appropriate amounts
2. Update Swagger docs for POST /sessions/:id/finalize:
   - Add examples: new member (85 days) pays 115 BDT instead of 100 BDT
   - Document surcharge calculation in response
3. Document workflow in API_WORKFLOWS.md:
   - Session finalization → Check each member's age
   - If < 90 days: apply 15% surcharge
   - Create transactions with surcharge included
4. Test scenarios:
   - New member (30 days): 100 BDT base → 115 BDT with surcharge
   - Veteran member (180 days): 100 BDT base → 100 BDT (no surcharge)

---

### Complete Swagger Documentation Update
**Tasks:**
1. Review all 50+ endpoints for Swagger completeness
2. Ensure all modules have @ApiTags:
   - ✅ Members
   - ✅ Categories
   - ✅ Fields
   - ✅ Sessions
   - ✅ Transactions
   - ✅ Reports
   - ✅ Settings
   - [ ] Alerts (Phase 2)
   - [ ] Guests (Phase 2)
3. Verify all endpoints have:
   - @ApiOperation with clear summary
   - @ApiResponse for ALL status codes (200, 201, 400, 404, 409, 500)
   - @ApiParam for all path/query parameters with examples
   - @ApiBody for POST/PUT requests with examples
4. Verify all DTOs have:
   - @ApiProperty for each field
   - Description explaining field purpose
   - Example values
   - Validation decorators matching
5. Update main.ts DocumentBuilder:
   - Add comprehensive API description
   - Add tag descriptions for each module
   - Add contact/version info
6. Test complete API in Swagger UI:
   - Visit http://localhost:3000/api
   - Try out each endpoint
   - Verify examples render correctly
   - Check error responses display
7. Export OpenAPI JSON and validate

---

### Frontend Integration Preparation
**Tasks:**
1. Create TypeScript interfaces for all entities:
   ```typescript
   interface Member {
     id: number;
     name: string;
     pin: string | null;
     contact_number: string;
     balance: string;
     consecutive_absences: number;
     status: 'active' | 'inactive' | 'suspended';
     created_at: string;
     updated_at: string;
   }
   // ... all other entities
   ```
2. Create API client functions with typed responses:
   ```typescript
   class MembersAPI {
     async create(data: CreateMemberDto): Promise<Member>
     async findAll(): Promise<Member[]>
     async findByPin(pin: string): Promise<Member>
     // ... all other methods
   }
   ```
3. Create Postman collection:
   - Organize by module (Members, Sessions, etc.)
   - Add all 50+ endpoints
   - Include environment variables ({{base_url}})
   - Add example requests/responses
   - Export as JSON
4. Document request/response formats:
   - Show complete request bodies
   - Show complete response bodies
   - Document error responses
5. Create sample payloads for complex operations:
   - Bulk payment examples (equal & custom split)
   - Session finalization with guests
   - Guest conversion to member
   - Alert resolution
6. Create error handling guide:
   - Map status codes to user messages
   - Show retry strategies
   - Document validation errors
7. Export as FRONTEND_INTEGRATION.md

---

## Priority Order

### Week 1 (Current)
1. ✅ Phase 1: Foundation complete
2. ✅ Swagger improvements for existing endpoints
3. ✅ Create workflow documentation

### Week 2
1. [ ] Phase 2: Alerts Module + complete Swagger docs
2. [ ] Phase 2: Guests Module + complete Swagger docs
3. [ ] Update API_WORKFLOWS.md with Phase 2 workflows

### Week 3
1. [ ] Phase 3: Bulk Payment System + Swagger
2. [ ] Phase 3: Threshold Monitoring + Alert Triggers
3. [ ] Update API_WORKFLOWS.md with Phase 3 workflows

### Week 4
1. [ ] Phase 4: Auto-Fines + Swagger
2. [ ] Phase 4: New Member Surcharge + Swagger
3. [ ] Complete Swagger Documentation Review
4. [ ] Frontend Integration Package

### Week 5
1. [ ] Integration Testing
2. [ ] Database Optimization
3. [ ] Final Documentation Review
4. [ ] Production Readiness Check

---

## Success Criteria

### For Each Phase
- [ ] All endpoints implemented and working
- [ ] Complete Swagger documentation (@ApiTags, @ApiOperation, @ApiResponse, @ApiParam, @ApiBody)
- [ ] All DTOs have @ApiProperty decorators
- [ ] Request/response examples in Swagger
- [ ] Workflow documented in API_WORKFLOWS.md
- [ ] Tested in Swagger UI (/api)
- [ ] cURL examples in TESTING_GUIDE.md (optional)

### For Final Release
- [ ] All 60+ endpoints fully documented
- [ ] Swagger UI shows all modules with examples
- [ ] API_WORKFLOWS.md covers all user journeys
- [ ] Postman collection exported
- [ ] TypeScript interfaces created
- [ ] Frontend integration guide complete
- [ ] All business rules implemented and tested

---

**Last Updated:** November 3, 2025  
**Current Phase:** Phase 1 Complete ✅  
**Next:** Phase 2 - Alerts & Guests with Swagger  
**Focus:** API documentation quality for smooth frontend development
