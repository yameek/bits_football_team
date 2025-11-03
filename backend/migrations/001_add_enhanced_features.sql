-- Migration: Add new features for enhanced treasury management
-- Date: 2025-11-02
-- Description: Adds PIN/Office ID, consecutive absences, bulk payments, alerts, settings, and guests

-- =======================
-- 1. Update Members Table
-- =======================

-- Add PIN (Office ID) column
ALTER TABLE members ADD COLUMN IF NOT EXISTS pin VARCHAR(10) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_members_pin ON members(pin);

-- Add consecutive absences tracking
ALTER TABLE members ADD COLUMN IF NOT EXISTS consecutive_absences INTEGER DEFAULT 0;

COMMENT ON COLUMN members.pin IS 'Member PIN/Office ID for identification';
COMMENT ON COLUMN members.consecutive_absences IS 'Counter for consecutive session absences';

-- =======================
-- 2. Update Transactions Table
-- =======================

-- Add bulk payment support
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS bulk_payment_group VARCHAR(50);
CREATE INDEX IF NOT EXISTS idx_bulk_payment_group ON transactions(bulk_payment_group);

-- Add payment provider details
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50);

COMMENT ON COLUMN transactions.bulk_payment_group IS 'Links transactions in a bulk payment';
COMMENT ON COLUMN transactions.payment_provider IS 'Payment provider: bkash, nagad, rocket, etc.';

-- Add new transaction types to enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM (
            'contribution',
            'session_fee',
            'onfield_payment',
            'refund',
            'adjustment',
            'bulk_payment',
            'fine'
        );
    ELSE
        -- Add new values if enum exists
        ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'bulk_payment';
        ALTER TYPE transaction_type ADD VALUE IF NOT EXISTS 'fine';
    END IF;
END $$;

-- =======================
-- 3. Create Settings Table
-- =======================

CREATE TABLE IF NOT EXISTS settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
    ('treasury_min_threshold', '5000', 'Minimum treasury balance before alert (BDT)'),
    ('member_min_threshold', '250', 'Minimum member balance before alert (BDT)'),
    ('fine_percentage', '20', 'Fine percentage for consecutive absences'),
    ('consecutive_absence_limit', '2', 'Number of consecutive absences before fine'),
    ('new_member_surcharge', '15', 'Extra percentage for new members (%)'),
    ('new_member_period_days', '90', 'Days a member is considered "new"'),
    ('currency', 'BDT', 'Currency code'),
    ('rounding_increment', '0.25', 'Fee rounding increment (BDT)')
ON CONFLICT (key) DO NOTHING;

-- =======================
-- 4. Create Alerts Table
-- =======================

-- Create alert type enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_type') THEN
        CREATE TYPE alert_type AS ENUM (
            'treasury_low',
            'member_low_balance',
            'fine_applied',
            'consecutive_absence'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_type alert_type NOT NULL,
    member_id INTEGER REFERENCES members(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_at TIMESTAMP,
    triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_alerts_member ON alerts(member_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type);

COMMENT ON TABLE alerts IS 'System alerts for treasury and member notifications';

-- =======================
-- 5. Create Guests Table
-- =======================

CREATE TABLE IF NOT EXISTS guests (
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

CREATE INDEX IF NOT EXISTS idx_guests_session ON guests(session_id);
CREATE INDEX IF NOT EXISTS idx_guests_brought_by ON guests(brought_by_member_id);
CREATE INDEX IF NOT EXISTS idx_guests_converted ON guests(converted_to_member);

COMMENT ON TABLE guests IS 'Guest attendees who can be converted to members';

-- =======================
-- 6. Update Existing Data
-- =======================

-- Set default consecutive_absences to 0 for existing members
UPDATE members SET consecutive_absences = 0 WHERE consecutive_absences IS NULL;

-- =======================
-- 7. Create Helper Functions
-- =======================

-- Function to generate unique bulk payment group ID
CREATE OR REPLACE FUNCTION generate_bulk_payment_group()
RETURNS VARCHAR(50) AS $$
BEGIN
    RETURN 'BULK-' || TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') || '-' || 
           LPAD(NEXTVAL('bulk_payment_seq')::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Create sequence for bulk payment groups
CREATE SEQUENCE IF NOT EXISTS bulk_payment_seq START 1;

-- Function to get setting value
CREATE OR REPLACE FUNCTION get_setting(setting_key VARCHAR)
RETURNS TEXT AS $$
DECLARE
    setting_value TEXT;
BEGIN
    SELECT value INTO setting_value FROM settings WHERE key = setting_key;
    RETURN setting_value;
END;
$$ LANGUAGE plpgsql;

-- =======================
-- 8. Create Triggers
-- =======================

-- Trigger to update updated_at timestamp for settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =======================
-- Migration Complete
-- =======================

-- Verify tables exist
DO $$
DECLARE
    tables_missing BOOLEAN := FALSE;
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'settings') THEN
        RAISE NOTICE 'ERROR: settings table not created';
        tables_missing := TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'alerts') THEN
        RAISE NOTICE 'ERROR: alerts table not created';
        tables_missing := TRUE;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'guests') THEN
        RAISE NOTICE 'ERROR: guests table not created';
        tables_missing := TRUE;
    END IF;
    
    IF tables_missing THEN
        RAISE EXCEPTION 'Migration failed: some tables were not created';
    ELSE
        RAISE NOTICE 'Migration completed successfully!';
        RAISE NOTICE 'New tables: settings, alerts, guests';
        RAISE NOTICE 'Updated tables: members (+2 columns), transactions (+2 columns)';
        RAISE NOTICE 'New transaction types: bulk_payment, fine';
        RAISE NOTICE 'Default settings inserted: 8 configurations';
    END IF;
END $$;
