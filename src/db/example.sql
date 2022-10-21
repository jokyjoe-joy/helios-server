--Set up users table.
CREATE TABLE users (
  UserID SERIAL,
  Username TEXT NOT NULL UNIQUE,
  Password TEXT NOT NULL,
  PRIMARY KEY (UserID)
);

/*
 * OPTIONAL PART. Do NOT use in production environment.
 */

--Insert a few dummies.
INSERT INTO users (Username, Password)
VALUES ('johndoey23', 'mystrongplainpass');

INSERT INTO users (Username, Password)
VALUES ('janedoey77', 'MyStrongerPl@inPass32');