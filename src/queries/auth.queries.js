export const CREATE_USERS_TABLE = `CREATE TABLE IF NOT EXISTS users(
    user_id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL UNIQUE,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (user_id)
  )`;

export const INSERT_NEW_USER = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

export const UPDATE_USER = 'UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?';
