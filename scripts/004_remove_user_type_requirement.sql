-- Делаем user_type необязательным и даем всем пользователям обе роли
alter table public.profiles alter column user_type drop not null;
alter table public.profiles alter column user_type set default null;

-- Обновляем существующих пользователей - убираем user_type
update public.profiles set user_type = null;

-- Обновляем ограничение - user_type теперь может быть null
alter table public.profiles drop constraint if exists profiles_user_type_check;
