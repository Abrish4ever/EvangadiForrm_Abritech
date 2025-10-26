 const dbConnection = require("./dbConfig");

const createTables = (req, res) => {
  const user_table = `CREATE TABLE IF NOT EXISTS userTable (
    user_id INT(30) AUTO_INCREMENT,
    user_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(100) NOT NULL,
    resetToken VARCHAR(255) DEFAULT NULL,
    resetTokenExpire DATETIME DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
  )`;

  const question_table = `CREATE TABLE IF NOT EXISTS questionTable (
  question_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  question_description TEXT NOT NULL,
  tag VARCHAR(40),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE
)`;

  const answer_table = `CREATE TABLE IF NOT EXISTS answerTable (
    answer_id INT(30) NOT NULL AUTO_INCREMENT,
    user_id INT(30) NOT NULL,
    question_id INT(30) NOT NULL,
    answer VARCHAR(300) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (answer_id),
    FOREIGN KEY (user_id) REFERENCES userTable(user_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questionTable(question_id) ON DELETE CASCADE
  )`;

  dbConnection.query(user_table, (err, result) => {
    if (err) return console.error("Error creating Users table:", err.message);
    console.log("Users Table created successfully");

    dbConnection.query(question_table, (err, result) => {
      if (err)
        return console.error("Error creating Questions table:", err.message);
      console.log("Questions Table created successfully");

      dbConnection.query(answer_table, (err, result) => {
        if (err)
          return console.error("Error creating Answers table:", err.message);
        console.log("Answers Table created successfully");
      });
    });
  });
  res.end("Evangadi Form Table is Successfully created");
};

module.exports = createTables;
