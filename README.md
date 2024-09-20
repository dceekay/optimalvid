
# OptimalVid - Personal Project Management Web Application

This is a **Personal Project Management Web Application** built for managing personal projects and tasks. Users can create projects, manage tasks, and mark them as completed. The application is developed with a modern tech stack including **React.js**, **Next.js**, **Node.js**, **MySQL**, and **MongoDB**.

## Features

- **Projects Management**: Create, view, update, and delete projects.
- **Task Management**: View tasks, create new tasks, mark tasks as complete, and delete tasks.
- **Dark Mode**: Toggle between light and dark mode for a better user experience.
- **Responsive Design**: Fully responsive for both desktop and mobile views.

## Tech Stack

- **Frontend**: React.js, Next.js, Material-UI
- **Backend**: Node.js, Express.js
- **Databases**: MySQL (Projects), MongoDB (Tasks)
- **Testing**: Jest, Supertest
- **Version Control**: Git, GitHub

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

Ensure you have the following installed:

- Node.js
- MySQL
- MongoDB

### Clone the Repository

Clone the repository from GitHub:
```bash
git clone https://github.com/dceekay/optimalvid.git
cd optimalvid
```

### 1. Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### 2. Set Up the Databases

#### MySQL (For Projects)
1. Create a MySQL database:
    ```sql
    CREATE DATABASE project_management;
    ```

2. Update the `backend/config/db.js` file with your MySQL connection details:
    ```js
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'your-username',
      password: 'your-password',
      database: 'project_management'
    });
    ```

3. Create the `projects` table:
    ```sql
    CREATE TABLE projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT
    );
    ```

#### MongoDB (For Tasks)
Ensure MongoDB is running locally, or update the connection string in `backend/app.js` if you’re using a remote MongoDB service:
```js
mongoose.connect('mongodb://localhost:27017/task_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
```

### 3. Running the Backend

Navigate to the backend folder and start the server:
```bash
cd backend
npm start
```
The backend will run at `http://localhost:5000`.

### 4. Running the Frontend

Navigate to the frontend folder and start the development server:
```bash
cd ../frontend
npm run dev
```
The frontend will run at `http://localhost:3000`.

---

## Testing

### Backend Testing
To run the backend tests:
```bash
cd backend
npm test
```

### Frontend Testing
To run the frontend tests:
```bash
cd frontend
npm test
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).


