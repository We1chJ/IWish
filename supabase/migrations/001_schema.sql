-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wish status enum
CREATE TYPE wish_status AS ENUM ('have', 'want');

-- Wishes table
CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status wish_status NOT NULL,
  upvote_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upvotes table
CREATE TABLE upvotes (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, wish_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Wishes policies
CREATE POLICY "wishes viewable by everyone" ON wishes FOR SELECT USING (true);
CREATE POLICY "auth users can insert wishes" ON wishes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can update own wishes" ON wishes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "users can delete own wishes" ON wishes FOR DELETE USING (auth.uid() = user_id);

-- Upvotes policies
CREATE POLICY "upvotes viewable by everyone" ON upvotes FOR SELECT USING (true);
CREATE POLICY "auth users can insert upvotes" ON upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users can delete own upvotes" ON upvotes FOR DELETE USING (auth.uid() = user_id);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Keep upvote_count in sync via trigger
CREATE OR REPLACE FUNCTION update_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE wishes SET upvote_count = upvote_count + 1 WHERE id = NEW.wish_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE wishes SET upvote_count = upvote_count - 1 WHERE id = OLD.wish_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_upvote_change
  AFTER INSERT OR DELETE ON upvotes
  FOR EACH ROW EXECUTE FUNCTION update_upvote_count();
