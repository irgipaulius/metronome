-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for posts
create table posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references profiles(id) on delete cascade not null,
  content text,
  type text check (type in ('text', 'video', 'game', 'ad')),
  media_url text,
  is_private boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table posts enable row level security;

create policy "Public posts are viewable by everyone." on posts
  for select using (is_private = false);

create policy "Authenticated users can create posts." on posts
  for insert with check (auth.uid() = author_id);

create policy "Users can update own posts." on posts
  for update using (auth.uid() = author_id);

-- Create a table for follows
create table follows (
  follower_id uuid references profiles(id) on delete cascade not null,
  following_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

alter table follows enable row level security;

create policy "Everyone can see follows." on follows
  for select using (true);

create policy "Users can follow others." on follows
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow." on follows
  for delete using (auth.uid() = follower_id);

-- Trigger to create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid error on re-run (though this is a fresh migration)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
