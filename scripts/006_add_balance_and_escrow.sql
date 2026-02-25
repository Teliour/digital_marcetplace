-- Add balance column to profiles with default 1000 rubles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 1000 NOT NULL;

-- Add escrow_amount to orders (money held until buyer confirms)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS escrow_amount numeric DEFAULT 0;

-- Update existing profiles to have 1000 balance
UPDATE profiles SET balance = 1000 WHERE balance IS NULL OR balance = 0;

-- Allow buyers to also view orders where they are the seller (for seller dashboard)
DROP POLICY IF EXISTS "Buyers can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Allow buyers to update their own orders (for completing orders)
DROP POLICY IF EXISTS "Sellers can update their orders" ON orders;
CREATE POLICY "Users can update relevant orders" ON orders
  FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
