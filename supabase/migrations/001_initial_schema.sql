-- IOGC Bible Reading 365 - Database Schema

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text not null,
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Reading progress table
create table public.reading_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  reading_date date not null,
  completed boolean not null default true,
  completed_at timestamptz not null default now(),
  unique(user_id, reading_date)
);

-- Quizzes table
create table public.quizzes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  questions jsonb not null default '[]',
  is_published boolean not null default false,
  created_by uuid references public.profiles not null,
  created_at timestamptz not null default now()
);

-- Quiz results table
create table public.quiz_results (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references public.quizzes on delete cascade not null,
  user_id uuid references public.profiles on delete cascade not null,
  score integer not null,
  total_questions integer not null,
  answers jsonb not null default '[]',
  completed_at timestamptz not null default now()
);

-- Indexes
create index idx_reading_progress_user on public.reading_progress(user_id);
create index idx_reading_progress_date on public.reading_progress(reading_date);
create index idx_quiz_results_user on public.quiz_results(user_id);
create index idx_quiz_results_quiz on public.quiz_results(quiz_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.reading_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_results enable row level security;

-- Profiles policies
create policy "Anyone authenticated can view profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile (not role)"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Reading progress policies
create policy "Anyone authenticated can view reading progress"
  on public.reading_progress for select
  to authenticated
  using (true);

create policy "Users can insert their own progress"
  on public.reading_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.reading_progress for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can delete their own progress"
  on public.reading_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- Quizzes policies
create policy "Anyone authenticated can view published quizzes"
  on public.quizzes for select
  to authenticated
  using (true);

create policy "Admins can insert quizzes"
  on public.quizzes for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update quizzes"
  on public.quizzes for update
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete quizzes"
  on public.quizzes for delete
  to authenticated
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Quiz results policies
create policy "Users can view their own quiz results"
  on public.quiz_results for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Users can insert their own quiz results"
  on public.quiz_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to auto-create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
