# Swagger Documentation Checklist

This document tracks Swagger documentation status for all API endpoints and provides standards for maintaining API documentation.

---

## Swagger Documentation Standards

### Required Decorators for Every Endpoint

1. **@ApiTags('ModuleName')** - Groups endpoints in Swagger UI
2. **@ApiOperation({ summary: 'Clear description' })** - Describes what endpoint does
3. **@ApiResponse()** - Document all possible responses (200, 201, 400, 404, 500)
4. **@ApiParam()** - Document path/query parameters with examples
5. **@ApiBody()** - Document request body with DTO reference
6. **@ApiProperty()** - In DTOs, describe each field with type and example

### Example: Fully Documented Endpoint

```typescript
@ApiTags('Members')
@Controller('members')
export class MembersController {
  
  @Post()
  @ApiOperation({ 
    summary: 'Create a new member',
    description: 'Registers a new team member with optional PIN/Office ID'
  })
  @ApiResponse({
    status: 201,
    description: 'Member successfully created',
    type: Member
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed - invalid input data'
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - PIN already exists'
  })
  @ApiBody({
    type: CreateMemberDto,
    description: 'Member registration data',
    examples: {
      withPin: {
        summary: 'Member with PIN',
        value: {
          name: 'John Doe',
          contactNumber: '+8801712345678',
          pin: 'EMP001',
          status: 'active'
        }
      },
      withoutPin: {
        summary: 'Member without PIN',
        value: {
          name: 'Jane Smith',
          contactNumber: '+8801812345678'
        }
      }
    }
  })
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.create(createMemberDto);
  }
}
```

### Example: Fully Documented DTO

```typescript
export class CreateMemberDto {
  @ApiProperty({
    description: 'Full name of the member',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Contact phone number with country code',
    example: '+8801712345678',
    maxLength: 20,
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'Member PIN/Office ID for identification (not for authentication)',
    example: 'EMP001',
    maxLength: 10,
    required: false,
    uniqueItems: true
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  pin?: string;

  @ApiPropertyOptional({
    description: 'Member status',
    enum: ['active', 'inactive', 'suspended'],
    default: 'active',
    required: false
  })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}
```

---

## Module-by-Module Status

### ✅ Members Module (11 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/members` | POST | ✅ | ✅ | ✅ | Complete |
| `/members` | GET | ✅ | N/A | N/A | Complete |
| `/members/team-balance` | GET | ✅ | N/A | ✅ | Complete |
| `/members/:id` | GET | ✅ | N/A | ✅ | Complete |
| `/members/:id` | PUT | ✅ | ✅ | ✅ | Complete |
| `/members/:id` | DELETE | ✅ | N/A | ✅ | Complete |
| `/members/:id/contributions` | POST | ✅ | ✅ | ✅ | Complete |
| `/members/:id/transactions` | GET | ✅ | N/A | N/A | Complete |
| `/members/:id/attendance` | GET | ✅ | N/A | N/A | Complete |
| `/members/by-pin/:pin` | GET | ✅ | N/A | ✅ | **Need examples** |
| `/members/verify-pin` | POST | ✅ | ⚠️ | ⚠️ | **Need DTO & examples** |

**Action Items:**
- [ ] Create `VerifyPinDto` with @ApiProperty decorators
- [ ] Add request/response examples for PIN endpoints
- [ ] Add error response examples (404 for invalid PIN)

---

### ✅ Categories Module (5 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/categories` | POST | ✅ | ✅ | ✅ | Complete |
| `/categories` | GET | ✅ | N/A | N/A | Complete |
| `/categories/:id` | GET | ✅ | N/A | ✅ | Complete |
| `/categories/:id` | PUT | ✅ | ✅ | ✅ | Complete |
| `/categories/:id` | DELETE | ✅ | N/A | ✅ | Complete |

**Status:** ✅ Fully documented

---

### ✅ Fields Module (5 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/fields` | POST | ✅ | ✅ | ✅ | Complete |
| `/fields` | GET | ✅ | N/A | N/A | Complete |
| `/fields/:id` | GET | ✅ | N/A | ✅ | Complete |
| `/fields/:id` | PUT | ✅ | ✅ | ✅ | Complete |
| `/fields/:id` | DELETE | ✅ | N/A | ✅ | Complete |

**Status:** ✅ Fully documented

---

### ✅ Sessions Module (11 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/sessions` | POST | ✅ | ✅ | ✅ | Complete |
| `/sessions` | GET | ✅ | N/A | N/A | Complete |
| `/sessions/:id` | GET | ✅ | N/A | ✅ | Complete |
| `/sessions/:id` | PUT | ✅ | ✅ | ✅ | Complete |
| `/sessions/:id` | DELETE | ✅ | N/A | ✅ | Complete |
| `/sessions/:id/attendance/bulk` | POST | ✅ | ✅ | ✅ | Complete |
| `/sessions/:id/attendance` | GET | ✅ | N/A | N/A | Complete |
| `/sessions/:id/onfield-collection` | POST | ✅ | ✅ | ✅ | Complete |
| `/sessions/:id/total-cost` | GET | ✅ | N/A | ✅ | Complete |
| `/sessions/:id/finalize` | POST | ✅ | N/A | ✅ | **Need finalization examples** |

**Action Items:**
- [ ] Add detailed examples for finalization response (fee split, transactions created)
- [ ] Add examples showing new member surcharge calculation (Phase 4)
- [ ] Add examples showing auto-fine for consecutive absences (Phase 4)
- [ ] Document workflow: attendance → on-field payment → finalize

---

### ✅ Transactions Module (5 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/transactions` | GET | ✅ | N/A | ✅ | Complete |
| `/transactions/:id` | GET | ✅ | N/A | ✅ | Complete |
| `/transactions/stats/by-type` | GET | ✅ | N/A | ✅ | Complete |
| `/transactions/stats/by-category` | GET | ✅ | N/A | ✅ | Complete |
| `/transactions/stats/by-member` | GET | ✅ | N/A | ✅ | Complete |

**Future Endpoints (Phase 3):**
- [ ] `POST /transactions/bulk-payment` - **Needs full Swagger docs**
- [ ] `GET /transactions/bulk/:group_id` - **Needs full Swagger docs**

**Action Items:**
- [ ] Add transaction type examples for BULK_PAYMENT and FINE (new types)
- [ ] Document payment_provider field usage
- [ ] Document bulk_payment_group field usage

---

### ✅ Reports Module (5 endpoints)

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/reports/team-balance` | GET | ✅ | N/A | ✅ | Complete |
| `/reports/spending-by-category` | GET | ✅ | N/A | ✅ | Complete |
| `/reports/session-costs` | GET | ✅ | N/A | ✅ | Complete |
| `/reports/attendance-summary` | GET | ✅ | N/A | ✅ | Complete |
| `/reports/member-balance-history/:id` | GET | ✅ | N/A | ✅ | Complete |

**Status:** ✅ Fully documented

---

### ✅ Settings Module (7 endpoints) - NEW

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/settings` | GET | ✅ | N/A | ⚠️ | **Need examples** |
| `/settings/:key` | GET | ✅ | N/A | ⚠️ | **Need examples** |
| `/settings/:key/value` | GET | ✅ | N/A | ⚠️ | **Need examples** |
| `/settings/:key` | PUT | ✅ | ⚠️ | ⚠️ | **Need DTO & examples** |
| `/settings` | POST | ✅ | ⚠️ | ⚠️ | **Need DTO & examples** |
| `/settings/:key` | DELETE | ✅ | N/A | ✅ | Complete |
| `/settings/refresh-cache` | POST | ✅ | N/A | ✅ | Complete |

**Action Items:**
- [ ] Move UpdateSettingDto and CreateSettingDto to separate DTO files
- [ ] Add @ApiProperty decorators to DTOs
- [ ] Add request examples for all 8 default settings
- [ ] Add response examples showing before/after update
- [ ] Document setting key constraints and valid values

---

### 🚧 Alerts Module (Coming in Phase 2)

**Planned Endpoints:**

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/alerts` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/alerts/unresolved` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/alerts/member/:id` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/alerts/:id` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/alerts/:id/resolve` | POST | ❌ | ❌ | ❌ | Not implemented |

**Required DTOs:**
- [ ] `CreateAlertDto` - For manual alert creation
- [ ] `ResolveAlertDto` - For resolving alerts with notes
- [ ] `AlertFilterDto` - For filtering alerts by type/status

**Required Examples:**
- [ ] Alert types: treasury_low, member_low_balance, fine_applied, consecutive_absence
- [ ] Alert resolution flow
- [ ] Alert filtering by member, type, date range

---

### 🚧 Guests Module (Coming in Phase 2)

**Planned Endpoints:**

| Endpoint | Method | Swagger | DTOs | Examples | Status |
|----------|--------|---------|------|----------|--------|
| `/sessions/:id/guests` | POST | ❌ | ❌ | ❌ | Not implemented |
| `/sessions/:id/guests` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/guests/:id` | GET | ❌ | ❌ | ❌ | Not implemented |
| `/guests/:id/convert-to-member` | POST | ❌ | ❌ | ❌ | Not implemented |

**Required DTOs:**
- [ ] `CreateGuestDto` - name, contactNumber, broughtByMemberId, paidByMemberId, amountPaid
- [ ] `ConvertGuestDto` - pin, status

**Required Examples:**
- [ ] Add guest with member paying
- [ ] Add guest with guest paying
- [ ] Convert guest to member (before/after)
- [ ] Session finalization with guests included in per-head calculation

---

## DTO Documentation Checklist

### Existing DTOs - Need Enhancement

#### Members Module
- [x] `CreateMemberDto` - ✅ Has @ApiProperty, ✅ Has pin field
- [x] `UpdateMemberDto` - ✅ Extends CreateMemberDto
- [x] `AddContributionDto` - ✅ Fully documented
- [ ] `VerifyPinDto` - ❌ **MISSING - Create new DTO**

#### Sessions Module
- [x] `CreateSessionDto` - ✅ Fully documented
- [x] `UpdateSessionDto` - ✅ Fully documented
- [x] `BulkAttendanceDto` - ✅ Fully documented
- [x] `OnFieldCollectionDto` - ✅ Fully documented

#### Transactions Module
- [ ] `CreateTransactionDto` - ⚠️ **Add examples for BULK_PAYMENT and FINE types**
- [ ] `BulkPaymentDto` - ❌ **MISSING - Create for Phase 3**

#### Settings Module
- [ ] `CreateSettingDto` - ⚠️ **Inline in controller, move to separate file**
- [ ] `UpdateSettingDto` - ⚠️ **Inline in controller, move to separate file**

### New DTOs Needed (Phase 2-4)

#### Alerts Module
- [ ] `CreateAlertDto`
- [ ] `ResolveAlertDto`
- [ ] `AlertFilterDto`

#### Guests Module
- [ ] `CreateGuestDto`
- [ ] `ConvertGuestDto`

#### Bulk Payments
- [ ] `BulkPaymentDto`
- [ ] `CustomSplitDto`

---

## Swagger UI Enhancements

### Current Tags (Groups)
- ✅ Members
- ✅ Categories
- ✅ Fields
- ✅ Sessions
- ✅ Transactions
- ✅ Reports
- ✅ Settings

### Planned Tags
- [ ] Alerts (Phase 2)
- [ ] Guests (Phase 2)

### Global Configuration

**File:** `src/main.ts`

```typescript
const config = new DocumentBuilder()
  .setTitle('Football Team Treasury API')
  .setDescription(`
    Complete API for managing football team treasury, sessions, and member finances.
    
    **Features:**
    - Member management with PIN/Office ID identification
    - Session scheduling with automatic fee splitting
    - Guest management and conversion to members
    - Bulk payment support (one payment for multiple members)
    - Configurable alerts for treasury and member balances
    - Auto-fines for consecutive absences
    - New member surcharges
    - Comprehensive financial reporting
    
    **Base URL:** http://localhost:3000
    **Version:** 1.0
    **Contact:** Your Team
  `)
  .setVersion('1.0')
  .addTag('Members', 'Member registration, PIN verification, contributions, and balance management')
  .addTag('Sessions', 'Session scheduling, attendance tracking, fee calculation, and finalization')
  .addTag('Transactions', 'Financial transactions, bulk payments, and transaction history')
  .addTag('Reports', 'Financial reports, analytics, and team balance overview')
  .addTag('Settings', 'System configuration and threshold management')
  .addTag('Alerts', 'Alert generation, notification management, and resolution')
  .addTag('Guests', 'Guest attendance tracking and member conversion')
  .addTag('Categories', 'Expense category management')
  .addTag('Fields', 'Football field/venue management')
  .build();
```

---

## Example Request/Response Templates

### Template 1: Success Response (201 Created)

```typescript
@ApiResponse({
  status: 201,
  description: 'Resource successfully created',
  schema: {
    example: {
      id: 1,
      name: 'Example Resource',
      created_at: '2025-11-03T10:00:00.000Z',
      updated_at: '2025-11-03T10:00:00.000Z'
    }
  }
})
```

### Template 2: Validation Error (400)

```typescript
@ApiResponse({
  status: 400,
  description: 'Validation failed',
  schema: {
    example: {
      statusCode: 400,
      message: 'Validation failed',
      errors: [
        'name must be a string',
        'amount must be a positive number'
      ]
    }
  }
})
```

### Template 3: Not Found (404)

```typescript
@ApiResponse({
  status: 404,
  description: 'Resource not found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Member with ID 999 not found'
    }
  }
})
```

### Template 4: Conflict (409)

```typescript
@ApiResponse({
  status: 409,
  description: 'Resource conflict',
  schema: {
    example: {
      statusCode: 409,
      message: 'PIN already exists',
      conflictingResource: 'EMP001'
    }
  }
})
```

---

## Testing Checklist

### Swagger UI Testing

- [ ] Visit `http://localhost:3000/api`
- [ ] Verify all modules appear in tags
- [ ] Test "Try it out" for each endpoint
- [ ] Verify request body schemas render correctly
- [ ] Verify response examples display
- [ ] Test error responses (404, 400, etc.)
- [ ] Check that DTOs show all fields with descriptions
- [ ] Verify enum values display in dropdowns

### Documentation Export

- [ ] Generate OpenAPI JSON: `GET /api-json`
- [ ] Validate JSON with OpenAPI validator
- [ ] Generate client SDK (optional)
- [ ] Export Postman collection from Swagger

---

## Priority Action Items

### High Priority (Phase 1 Cleanup)
1. [ ] Create `VerifyPinDto` for PIN verification endpoint
2. [ ] Move Settings DTOs to separate files with full documentation
3. [ ] Add examples for all Settings endpoints
4. [ ] Add transaction type examples (BULK_PAYMENT, FINE)
5. [ ] Enhance session finalization examples

### Medium Priority (Phase 2 Prep)
1. [ ] Create all Alerts module DTOs
2. [ ] Create all Guests module DTOs
3. [ ] Plan Swagger structure for new endpoints
4. [ ] Document alert triggering workflow

### Low Priority (Phase 3-4)
1. [ ] Create BulkPaymentDto with split logic examples
2. [ ] Document auto-fine calculation in session finalization
3. [ ] Document new member surcharge calculation
4. [ ] Add comprehensive integration examples

---

## Maintenance Guidelines

### When Adding New Endpoint

1. Add `@ApiTags('ModuleName')`
2. Add `@ApiOperation({ summary: 'Description' })`
3. Add `@ApiResponse()` for ALL status codes (success + errors)
4. Add `@ApiParam()` for path/query parameters
5. Add `@ApiBody()` if POST/PUT/PATCH
6. Create/update DTO with `@ApiProperty()` decorators
7. Add examples (at least 1 for request, 1 for response)
8. Test in Swagger UI
9. Update this checklist

### When Updating Existing Endpoint

1. Update DTOs if schema changed
2. Update examples if behavior changed
3. Update response status codes if error handling changed
4. Update description if functionality expanded
5. Test in Swagger UI
6. Update workflow documentation if flow changed

---

**Last Updated:** November 3, 2025  
**Next Review:** After Phase 2 completion  
**Responsible:** Backend Development Team
