# EvangadiForm_Abritech

EvangadiForm_Abritech is a **Full-Stack Question and Answer (Q&A) Hub** that enables users to ask, answer, and discuss topics in a collaborative environment. The platform is inspired by community-driven learning — providing an easy-to-use forum where users can register, post questions, share knowledge, and engage with others.

---

## 🚀 Features

* 🔐 **User Authentication**

  * Secure registration and login using JWT.
  * Passwords encrypted with bcrypt.

* 🧠 **Ask & Answer**

  * Post new questions.
  * Respond to existing questions.
  * View, edit, or delete your posts.

* 🗂️ **Database Integration**

  * MySQL database hosted on **Aiven**.
  * Secure SSL connection for all queries.

* 💬 **AI Chat Integration**

  * Built-in AI assistant (via Groq API) for intelligent responses and help.

* 🌐 **Frontend–Backend Communication**

  * Frontend hosted on [Abri-Tech.com](https://abri-tech.com)
  * Backend deployed on [Render](https://render.com)

---

## 🏗️ Tech Stack

### **Frontend**

* React.js (with Context API)
* Axios for API requests
* React Router for navigation
* Tailwind CSS for UI styling

### **Backend**

* Node.js & Express.js
* MySQL (via `mysql2`)
* JSON Web Tokens (JWT) for auth
* Bcrypt for password hashing
* dotenv for environment management
* CORS for domain security

### **Database**

* Hosted on **Aiven MySQL**
* Includes three main tables:

  * `userTable`
  * `questionTable`
  * `answerTable`

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/EvangadiForm_Abritech.git
cd EvangadiForm_Abritech
```

### 2️⃣ Install dependencies

For backend:

```bash
cd backend
npm install
```

For frontend:

```bash
cd frontend
npm install
```

### 3️⃣ Create a `.env` file in the backend directory

```bash
PORT=5000
DB_HOST=<your Aiven host>
DB_USER=<your Aiven user>
DB_PASSWORD=<your Aiven password>
DB_NAME=<your database name>
DB_PORT=<your port number>
MYSQL_SSL_CERT="-----BEGIN CERTIFICATE-----\nMIIE...<rest>...\n-----END CERTIFICATE-----"
JWT_SECRET=<your jwt secret>
GROQ_API_KEY=<your groq api key>
```

### 4️⃣ Run the application

Start the backend:

```bash
npm start
```

Start the frontend:

```bash
npm run dev
```

---

## 🌍 Deployment

* **Backend:** [Render](https://render.com)

  * URL: `https://formbackend-deploy.onrender.com`
* **Frontend:** [Abri-Tech Subdomain](https://evangadihub.abri-tech.com)
* **Database:** [Aiven MySQL Cloud](https://aiven.io)

---

## 📁 Folder Structure

```
EvangadiForm_Abritech/
│
├── server/
│   ├── db/
│   │   ├── dbConfig.js
│   │   └── dbSchema.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── questionRoutes.js
│   │   └── answerRoutes.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── questionController.js
│   │   └── answerController.js
│   ├── .env
│   └── index.js
│
└── client/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── API/
    │   └── App.jsx
    ├── public/
    └── package.json
```

---

## 🧪 Testing

You can test your backend routes using **Postman**:

* `POST /api/users/register`
* `POST /api/users/login`
* `GET /api/question`
* `POST /api/answers`

---

## 🧑‍💻 Author

**Abrham Degarege**
Full-Stack Developer | Abri-Tech
📧 [Contact](mailto:abrham@abri-tech.com)

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
