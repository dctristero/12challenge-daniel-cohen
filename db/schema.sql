DROP DATABASE IF EXISTS subjects_db;
CREATE DATABASE subjects_db;

USE subjects_db;

CREATE TABLE fiefdoms (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  manor_name VARCHAR(30) NOT NULL
);

CREATE TABLE classes (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   class VARCHAR(30)
);

CREATE TABLE subjects (
   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR(30),
   last_name VARCHAR(30),
   debt INT,
   class_id INT,
   FOREIGN KEY (class_id)
   REFERENCES classes(id),
   fiefdom_id INT,
   FOREIGN KEY (fiefdom_id)
   REFERENCES fiefdoms(id),
   vassal_id INT,
   FOREIGN KEY (vassal_id)
   REFERENCES subjects(id)
);