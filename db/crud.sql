CREATE DATABASE test CHARACTER SET utf8;

USE test;

CREATE TABLE IF NOT EXISTS items (
  id INT NOT NULL AUTO_INCREMENT, 
  name VARCHAR(20) NOT NULL, 
  category VARCHAR(20) NOT NULL, 
  stock INT, 
  PRIMARY KEY(id)
);

INSERT INTO items(name, category, stock) 
  VALUES ("Fideos", "Harina", 20), 
         ("Leche", "Lacteos", 30), 
         ("Crema", "Harina", 15);

SELECT * 
  FROM items;

DELETE FROM items 
  WHERE id = 1;

UPDATE items 
  SET stock = 45 
  WHERE id = 1;

SELECT * 
  FROM items;
