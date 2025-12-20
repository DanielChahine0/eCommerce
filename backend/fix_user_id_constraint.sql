-- Fix: Allow NULL user_id in orders table for guest checkout
-- This needs to be run manually on your PostgreSQL database
ALTER TABLE orders
ALTER COLUMN user_id DROP NOT NULL;
-- Verify the change
SELECT column_name,
    is_nullable,
    data_type
FROM information_schema.columns
WHERE table_name = 'orders'
    AND column_name = 'user_id';