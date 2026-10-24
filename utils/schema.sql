DROP DATABASE IF EXISTS test_db;

CREATE DATABASE test_db;

USE test_db;

CREATE TABLE
    test_users (
        user_id varchar(45) not null primary key,
        first_name varchar(255) not null,
        last_name varchar(255) default null,
        user_des varchar(255) default null,
        user_email varchar(255) not null,
        user_password varchar(255) not null,
        created_on timestamp default current_timestamp,
        last_updated_on timestamp default current_timestamp on update current_timestamp,
        user_status tinyint (1) default 1
    );

insert into
    test_users (
        `user_id`,
        `first_name`,
        `user_email`,
        `user_password`
    )
values
    (
        '40c53669-4fe5-4821-b92f-d264f7b3cc11',
        'Sid',
        'user@test.com',
        '$2b$10$l6MPKVUR0sC/dQv.xKsx9ulwNoaN8xTlaEBGM6OoOO3TgTZ8xkhoW'
    );