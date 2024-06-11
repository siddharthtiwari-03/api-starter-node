DROP DATABASE IF EXISTS test_db;

CREATE DATABASE test_db;

USE test_db;

CREATE TABLE test_users(
userID int not null primary key auto_increment,
firstName varchar(255) not null,
lastName varchar(255) default null,
email varchar(255) not null,
password varchar(255) not null,
status tinyint(1) default 1
);

insert into test_users (`firstName`,`email`,`password`) values ('Sid','user@test.com','123');

CREATE TABLE test_hotels(
hotelID int not null primary key auto_increment,
hotelName varchar(255) not null,
email varchar(255) default null,
password varchar(255) not null,
status tinyint(1) default 1
);

insert into test_hotels (`hotelName`,`email`,`password`) values ('Teset Hotel','hotel@test.com','123');