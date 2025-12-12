-- ClothShare Database Schema for Supabase
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    name TEXT,
    phone TEXT,
    avatar TEXT,
    bio TEXT,
    campus TEXT,
    building TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    subcategory TEXT,
    size TEXT,
    color TEXT,
    brand TEXT,
    item_condition TEXT,
    daily_price DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) DEFAULT 0,
    weekly_discount INT DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'unavailable')),
    view_count INT DEFAULT 0,
    save_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Items policies
CREATE POLICY "Anyone can view available items" ON public.items
    FOR SELECT USING (true);

CREATE POLICY "Users can create items" ON public.items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own items" ON public.items
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own items" ON public.items
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- RENTALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    renter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    daily_rate DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Rentals policies
CREATE POLICY "Users can view own rentals" ON public.rentals
    FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Users can create rentals" ON public.rentals
    FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "Owners can update rental status" ON public.rentals
    FOR UPDATE USING (auth.uid() = owner_id OR auth.uid() = renter_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID NOT NULL REFERENCES public.rentals(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID REFERENCES public.items(id) ON DELETE SET NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews policies
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for their rentals" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ============================================
-- SAVED ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- Enable RLS
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- Saved items policies
CREATE POLICY "Users can view own saved items" ON public.saved_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save items" ON public.saved_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave items" ON public.saved_items
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON public.items
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_rentals_updated_at
    BEFORE UPDATE ON public.rentals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_items_user_id ON public.items(user_id);
CREATE INDEX IF NOT EXISTS idx_items_category ON public.items(category);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_daily_price ON public.items(daily_price);
CREATE INDEX IF NOT EXISTS idx_rentals_renter_id ON public.rentals(renter_id);
CREATE INDEX IF NOT EXISTS idx_rentals_owner_id ON public.rentals(owner_id);
CREATE INDEX IF NOT EXISTS idx_rentals_item_id ON public.rentals(item_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON public.rentals(status);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ ClothShare database schema created successfully!';
END $$;
