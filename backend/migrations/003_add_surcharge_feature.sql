-- Migration: Add surcharge feature for new members
-- This migration:
-- 1. Adds 'surcharge' to transaction_type enum
-- 2. Adds surcharge_amount setting

-- Drop the old constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_transaction_type_check;

-- Add the new constraint with surcharge included
ALTER TABLE transactions 
ADD CONSTRAINT transactions_transaction_type_check 
CHECK (transaction_type IN ('contribution','session_fee','onfield_payment','refund','adjustment','bulk_payment','fine','surcharge'));

-- Add surcharge_amount setting
INSERT INTO settings (key, value, description)
VALUES ('surcharge_amount', '500', 'Fixed surcharge amount for new members (BDT)')
ON CONFLICT (key) DO NOTHING;
