-- Set up types
CREATE TYPE role AS ENUM ('member', 'admin');

-- Set up users table.
CREATE TABLE users (
  userid serial,
  username text not null unique,
  password text not null,
  role role not null,
  primary key (userid)
);

/*
 * OPTIONAL PART. Do NOT use in production environment.
 */

-- Insert admin dummy. Pass is: reallylstrsong
INSERT INTO users (username, password, role)
VALUES ('admindummy', '$argon2id$v=19$m=32768,t=4,p=4$S8UDbop4l0HHhXQpdWagkw$76QNHp6BEqZ6A49uohfLd5DqkCnmTP2/P3jl30Po1HM', 'admin');