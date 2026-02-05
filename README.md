# 🐛 Bug Tracker - Jira-like Issue Tracking System

A modern, full-stack issue tracking system built with **Spring Boot** and **React**. Track projects, manage issues, and collaborate with your team in a beautiful, intuitive interface.

![Tech Stack](https://img.shields.io/badge/Spring%20Boot-4.0.2-brightgreen)
![React](https://img.shields.io/badge/React-19.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Java](https://img.shields.io/badge/Java-17-orange)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing with BCrypt
- Protected API endpoints with Spring Security

### 📊 Project Management
- Create and manage multiple projects
- Organize projects by category and tags
- Team member management
- Project-level statistics and insights

### 🎫 Issue Tracking
- Create, update, and delete issues
- Assign issues to team members
- Track issue status (To Do, In Progress, Done)
- Priority levels (Low, Medium, High, Critical)
- Due date tracking
- Search and filter issues

### 🎨 Modern UI/UX
- Dark-themed, premium interface
- Responsive design for all devices
- Real-time updates
- Intuitive navigation with sidebar
- Project switcher dropdown
- Empty states and loading indicators

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.2
- **Language**: Java 17
- **Database**: H2 (Development) / MySQL (Production)
- **Security**: Spring Security + JWT
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### Frontend
- **Framework**: React 19.2 with Vite
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- Maven (or use included wrapper)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd issue-tracker
   ```

2. **Run the application**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   Or on Windows:
   ```powershell
   .\mvnw spring-boot:run
   ```

3. **Backend will start on**: `http://localhost:8080`

4. **Access Swagger UI**: `http://localhost:8080/swagger-ui.html`

5. **Access H2 Console** (Development): `http://localhost:8080/h2-console`
   - JDBC URL: `jdbc:h2:mem:issuetracker`
   - Username: `sa`
   - Password: (leave empty)

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Frontend will start on**: `http://localhost:5173`

### Production Build

**Backend**:
```bash
./mvnw clean package
java -jar target/issue-tracker-0.0.1-SNAPSHOT.jar
```

**Frontend**:
```bash
npm run build
# Serve the dist/ folder with your preferred web server
```

## 📁 Project Structure

```
bug-tracker/
├── issue-tracker/                 # Backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/zosh/issue_tracker/
│   │   │   │   ├── config/       # Security, JWT, CORS
│   │   │   │   ├── controller/   # REST Controllers
│   │   │   │   ├── model/        # JPA Entities
│   │   │   │   ├── repository/   # Data Access Layer
│   │   │   │   ├── service/      # Business Logic
│   │   │   │   ├── request/      # DTOs for requests
│   │   │   │   └── response/     # DTOs for responses
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
└── frontend/                      # Frontend (React)
    ├── src/
    │   ├── api/                   # API service layer
    │   ├── components/            # Reusable components
    │   ├── config/                # Axios configuration
    │   ├── context/               # React Context (Auth)
    │   ├── pages/                 # Page components
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # Entry point
    ├── public/
    └── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Login user

### Projects
- `GET /api/projects` - Get all user projects
- `GET /api/projects/{id}` - Get project by ID
- `POST /api/projects` - Create new project
- `PATCH /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/search?keyword={keyword}` - Search projects
- `POST /api/projects/{id}/invite?email={email}` - Invite user to project

### Issues
- `GET /api/issues/{id}` - Get issue by ID
- `GET /api/issues/project/{projectId}` - Get all issues for a project
- `POST /api/issues` - Create new issue
- `PUT /api/issues/{id}/assignee/{userId}` - Assign user to issue
- `PUT /api/issues/{id}/status/{status}` - Update issue status
- `DELETE /api/issues/{id}` - Delete issue

## 🧪 Testing

Run the included API test script:

```powershell
.\test-api.ps1
```

This will test all core endpoints including:
- User signup and signin
- Project CRUD operations
- Issue CRUD operations
- Status updates
- Search functionality

## 🎯 Roadmap

### Week 2 (Upcoming)
- [ ] Kanban drag & drop board
- [ ] Comment system
- [ ] Advanced filters and search
- [ ] Edit/Delete permissions
- [ ] Backend deployment (Railway/Render)
- [ ] Frontend deployment (Vercel/Netlify)
- [ ] UI polish and animations
- [ ] Demo video

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ as part of a 2-week full-stack development challenge.

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React and Vite teams for modern frontend tooling
- Tailwind CSS for beautiful, utility-first styling
- Lucide for the icon library

---

**Happy Bug Tracking!** 🐛✨
