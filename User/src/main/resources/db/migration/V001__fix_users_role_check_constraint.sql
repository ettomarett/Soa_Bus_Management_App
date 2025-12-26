-- Migration: Fix users_role_check constraint to include CONTROLLER role
-- This migration fixes the database constraint that was missing the CONTROLLER role
-- Issue: The constraint only allowed PASSENGER, DRIVER, ADMIN but not CONTROLLER
-- Solution: Drop and recreate the constraint with all 4 roles

-- Drop the old constraint if it exists
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint with CONTROLLER included
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('PASSENGER', 'DRIVER', 'CONTROLLER', 'ADMIN'));

