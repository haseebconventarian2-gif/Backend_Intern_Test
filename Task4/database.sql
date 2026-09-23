Task 4  
Database & SQL



(a) Create users table

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);


 Create posts table

CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


 (b) Insert 3 users

INSERT INTO users (name, email)
VALUES ('Ali', 'ali@example.com');

INSERT INTO users (name, email)
VALUES ('Ahmed', 'ahmed@example.com');

INSERT INTO users (name, email)
VALUES ('Sara', 'sara@example.com');


 Insert 5 posts

INSERT INTO posts (user_id, title, content)
VALUES (1, 'My First Post', 'This is Ali first post.');

INSERT INTO posts (user_id, title, content)
VALUES (1, 'Learning Backend', 'Ali is learning backend development.');

INSERT INTO posts (user_id, title, content)
VALUES (2, 'Node.js Basics', 'Ahmed is learning Node.js.');

INSERT INTO posts (user_id, title, content)
VALUES (2, 'REST APIs', 'Ahmed is learning REST APIs.');

INSERT INTO posts (user_id, title, content)
VALUES (3, 'SQLite Introduction', 'Sara is learning SQLite.');


 (c) JOIN users and posts
 Return user name, email and post title

SELECT users.name, users.email, posts.title
FROM users
JOIN posts
ON users.id = posts.user_id;


(d) Retrieve all posts belonging to user_id = 1

SELECT *
FROM posts
WHERE user_id = 1;


(e) Prevent duplicate user emails

 This is already handled in the users table using:
 email TEXT NOT NULL UNIQUE