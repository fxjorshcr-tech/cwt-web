-- Create payment_logs table to track all payment attempts
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Booking reference
  booking_id TEXT NOT NULL,
  trip_ids TEXT[], -- Array of trip IDs associated with this payment

  -- Payment details
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT NOT NULL CHECK (status IN ('initiated', 'pending', 'approved', 'rejected', 'error', 'cancelled')),

  -- Tilopay response data
  tilopay_transaction_id TEXT,
  tilopay_auth_code TEXT,
  tilopay_code TEXT, -- Response code from Tilopay (1 = approved, etc.)
  tilopay_description TEXT, -- Human-readable description from Tilopay
  tilopay_order_id TEXT,
  tilopay_order_hash TEXT,

  -- Customer info at time of payment
  customer_email TEXT,
  customer_first_name TEXT,
  customer_last_name TEXT,
  customer_phone TEXT,
  customer_country TEXT,

  -- Technical metadata
  ip_address TEXT,
  user_agent TEXT,

  -- Error tracking
  error_message TEXT,
  error_code TEXT,

  -- Raw response for debugging
  raw_request JSONB,
  raw_response JSONB,

  -- Payment URL generated (for tracking)
  payment_url TEXT
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_payment_logs_booking_id ON payment_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_status ON payment_logs(status);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_logs_customer_email ON payment_logs(customer_email);
CREATE INDEX IF NOT EXISTS idx_payment_logs_tilopay_transaction_id ON payment_logs(tilopay_transaction_id);

-- Enable RLS (Row Level Security)
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role has full access to payment_logs"
  ON payment_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Comment on table
COMMENT ON TABLE payment_logs IS 'Tracks all payment attempts for bookings, including successful, failed, and error cases';
