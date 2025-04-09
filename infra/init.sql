CREATE USER 'kbj'@'%' IDENTIFIED BY 'sample';
GRANT ALL PRIVILEGES ON *.* TO 'kbj'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

SET GLOBAL time_zone = '+00:00';
SET SESSION time_zone = '+00:00';

SELECT @@GLOBAL.time_zone, @@SESSION.time_zone, @@system_time_zone;