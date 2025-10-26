# Evangadi-Forum

A full-stack forum application built with Node.js, Express.js, and MySQL, allowing users to register, login, post questions, and provide answers in a community-driven Q&A platform.

## Features

- **User Authentication**: Secure registration and login with JWT tokens.
- **Question Management**: Users can post, view, edit, and delete their own questions.
- **Answer System**: Users can post, view, edit, and delete their own answers to questions.
- **Database Integration**: MySQL database with tables for users, questions, and answers.
- **API-Driven**: RESTful API endpoints for all operations.
- **Security**: Password hashing with bcrypt, JWT-based authentication, input validation.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
- **Other Libraries**: http-status-codes, cors, dotenv

## Project Structure

```
evangadi-forum/
├── app.js                 # Main application entry point
├── controller/            # Business logic controllers
│   ├── userController.js
│   ├── questionController.js
│   └── answerController.js
├── routes/                # API route definitions
│   ├── userRoutes.js
│   ├── questionRoutes.js
│   └── answerRoutes.js
├── middleware/            # Custom middleware
│   └── authMiddleware.js
├── db/                    # Database configuration and schema
│   ├── dbConfig.js
│   ├── dbSchema.js
│   └── setup.sql
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not committed)
└── README.md              # This file
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd evangadi-forum
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
   - Create a MySQL database named `evangadi_forum_project_db`.
   - Run the SQL script in `db/setup.sql` to create the tables, or use the `/create-table` endpoint after starting the server.

4. **Configure environment variables**:
   Create a `.env` file in the root directory with the following:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_jwt_secret_key
   ```

5. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

   The server will run on `http://localhost:5550`.

## API Endpoints

### User Routes (`/api/users`)
- `POST /register`: Register a new user
  - Body: `{ "username": "string", "first_name": "string", "last_name": "string", "email": "string", "password": "string" }`
- `POST /login`: Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: JWT token
- `GET /check`: Check user authentication (requires token)

### Question Routes (`/api/questions`)
- `POST /questions`: Post a new question (requires token)
  - Body: `{ "title": "string", "question_description": "string", "tag": "string" }`
- `GET /questions`: Get all questions
- `DELETE /questions/:question_id`: Delete a question (requires token, owner only)
- `PUT /questions/:question_id`: Edit a question (requires token, owner only)
  - Body: `{ "title": "string", "question_description": "string", "tag": "string" }`

### Answer Routes (`/api/answers`)
- `POST /answers/:question_id`: Post an answer to a question (requires token)
  - Body: `{ "answer": "string" }`
- `GET /answers/allAnswers`: Get all answers
- `DELETE /delete/:answer_id`: Delete an answer (requires token, owner only)
- `PUT /edit/:answer_id`: Edit an answer (requires token, owner only)
  - Body: `{ "answer": "string" }`

### Utility
- `GET /create-table`: Create database tables (for development)

## Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

- **userTable**: Stores user information (user_id, user_name, first_name, last_name, email, password, resetToken, etc.)
- **questionTable**: Stores questions (question_id, user_id, title, question_description, tag, createdAt)
- **answerTable**: Stores answers (answer_id, user_id, question_id, answer, createdAt)

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## License

This project is licensed under the ISC License.

## Contact

For questions or support, please contact the development team.
