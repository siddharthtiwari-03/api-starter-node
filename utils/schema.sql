DROP DATABASE IF EXISTS test_db;

CREATE DATABASE test_db;

USE test_db;

CREATE TABLE test_users(
userID int not null primary key auto_increment,
fname varchar(255) not null,
lname varchar(255) default null,
userEmail varchar(255) not null,
userPass varchar(255) not null,
createdOn timestamp default current_timestamp,
lastUpdatedOn timestamp default current_timestamp on update current_timestamp,
status tinyint(1) default 1
);

insert into test_users (`firstName`,`email`,`password`) values ('Sid','user@test.com','$2b$10$l6MPKVUR0sC/dQv.xKsx9ulwNoaN8xTlaEBGM6OoOO3TgTZ8xkhoW');
