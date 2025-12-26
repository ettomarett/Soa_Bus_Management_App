-- SQL script to fix the users_role_check constraint
-- This adds the CONTROLLER role to the allowed values
--
-- NOTE: This script is kept for manual reference.
-- The proper migration is now in: User/src/main/resources/db/migration/V001__fix_users_role_check_constraint.sql
-- The migration is automatically applied during deployment via Drone CI.

-- Drop the old constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add new constraint with CONTROLLER included
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('PASSENGER', 'DRIVER', 'CONTROLLER', 'ADMIN'));
