-- Add email verification columns to users table
-- Run this in Supabase SQL Editor

-- Add verificationCode column
ALTER TABLE users ADD COLUMN IF NOT EXISTS "verificationCode" TEXT;

-- Add verificationExpiry column  
ALTER TABLE users ADD COLUMN IF NOT EXISTS "verificationExpiry" TIMESTAMP;

-- Add emailVerified column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN DEFAULT false;

-- Verify columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('verificationCode', 'verificationExpiry', 'emailVerified');
