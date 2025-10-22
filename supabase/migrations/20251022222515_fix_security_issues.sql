/*
  # Fix Security and Performance Issues

  1. RLS Performance Optimization
    - Update all RLS policies to use `(select auth.uid())` instead of `auth.uid()`
    - This prevents re-evaluation of auth functions for each row

  2. Index Optimization
    - Remove unused `profiles_email_idx` index
    - Email uniqueness is already enforced by UNIQUE constraint

  3. Function Security
    - Add stable search_path to `update_updated_at_column` function
    - Prevents search path injection attacks

  4. Notes
    - Leaked Password Protection must be enabled manually in Supabase Dashboard:
      Authentication > Settings > Enable "Check for compromised passwords"
*/

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can create own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate RLS policies with optimized auth function calls
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can create own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Remove unused email index (UNIQUE constraint already enforces uniqueness)
DROP INDEX IF EXISTS profiles_email_idx;

-- Update function with stable search_path to prevent injection
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;