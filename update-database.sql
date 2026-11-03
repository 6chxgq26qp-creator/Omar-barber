-- =====================================================
--  Run this ONCE in Supabase → SQL Editor → Run
--  (It deletes your old test bookings, then upgrades the table.)
-- =====================================================

-- 1. Remove old test bookings
delete from bookings;

-- 2. New columns: branch, barber, status
alter table bookings add column if not exists branch text not null default '';
alter table bookings add column if not exists barber text not null default '';
alter table bookings add column if not exists status text not null default 'booked';

-- 3. Old rule "one booking per time" -> new rule "one booking per barber per time"
--    (cancelled bookings free the time again)
alter table bookings drop constraint if exists bookings_date_time_key;
create unique index if not exists bookings_barber_slot
  on bookings (barber, date, time)
  where status <> 'cancelled';

-- 4. Customers can see WHICH TIMES are taken (not names or phone numbers)
create or replace function booked_times(p_barber text, p_date date)
returns table (booked_time text)
language sql
security definer
set search_path = public
as $$
  select time from bookings
  where barber = p_barber and date = p_date and status <> 'cancelled';
$$;
grant execute on function booked_times(text, date) to anon, authenticated;

-- 5. The logged-in barber can mark bookings as done / cancelled
drop policy if exists "Barber can update" on bookings;
create policy "Barber can update" on bookings
  for update to authenticated using (true) with check (true);
