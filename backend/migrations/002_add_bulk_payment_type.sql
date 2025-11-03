-- Migration: Add bulk_payment transaction type
-- This migration updates the transaction_type CHECK constraint to include 'bulk_payment'

-- Drop the old constraint
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_transaction_type_check;

-- Add the new constraint with bulk_payment included
ALTER TABLE transactions 
ADD CONSTRAINT transactions_transaction_type_check 
CHECK (transaction_type IN ('contribution','session_fee','onfield_payment','refund','adjustment','bulk_payment'));
