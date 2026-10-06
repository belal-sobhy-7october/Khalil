-- Vocabulary Categories Table
CREATE TABLE IF NOT EXISTS vocabulary_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_categories_user_id ON vocabulary_categories(user_id);

-- Vocabulary Items Table
CREATE TABLE IF NOT EXISTS vocabulary_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES vocabulary_categories(id) ON DELETE SET NULL,
  word TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('word', 'verb', 'idiom', 'phrase')),
  definition TEXT NOT NULL,
  example_sentence TEXT,
  pronunciation TEXT,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
  review_count INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_user_id ON vocabulary_items(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_category_id ON vocabulary_items(category_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_type ON vocabulary_items(type);
CREATE INDEX IF NOT EXISTS idx_vocabulary_items_mastery_level ON vocabulary_items(mastery_level);

-- Vocabulary Reviews Table
CREATE TABLE IF NOT EXISTS vocabulary_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vocabulary_item_id UUID NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('correct', 'incorrect', 'skipped')),
  time_taken INTEGER,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_item_id ON vocabulary_reviews(vocabulary_item_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_user_id ON vocabulary_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_reviews_reviewed_at ON vocabulary_reviews(reviewed_at);

-- Enable Row Level Security
ALTER TABLE vocabulary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vocabulary_categories
CREATE POLICY "Users can view their own categories"
  ON vocabulary_categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories"
  ON vocabulary_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories"
  ON vocabulary_categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories"
  ON vocabulary_categories FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for vocabulary_items
CREATE POLICY "Users can view their own items"
  ON vocabulary_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items"
  ON vocabulary_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items"
  ON vocabulary_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own items"
  ON vocabulary_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for vocabulary_reviews
CREATE POLICY "Users can view their own reviews"
  ON vocabulary_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reviews"
  ON vocabulary_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_vocabulary_categories_updated_at
  BEFORE UPDATE ON vocabulary_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vocabulary_items_updated_at
  BEFORE UPDATE ON vocabulary_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
