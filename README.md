# Task Manager Application

A full-stack task management application built with Spring Boot (backend) and Angular (frontend), featuring JWT authentication, MongoDB database, and Docker deployment.

## 🚀 Features

- **User Authentication**: Secure JWT-based login and registration
- **Task Management**: Create, read, update, and delete tasks
- **User-specific Tasks**: Each user can only access their own tasks
- **Responsive UI**: Modern Angular frontend with responsive design
- **REST API**: Well-documented Spring Boot backend
- **Database**: MongoDB for data persistence
- **Docker Support**: Easy deployment with Docker Compose
- **API Documentation**: Swagger/OpenAPI documentation

## 📱 User Interface

### Frontend Screenshots

#### 🔐 **Authentication**

**Sign In Page**
![Sign In Form](docs/images/signin%20form.png)

**Registration Page**
![Sign Up Form](docs/images/SignUp%20form.png)

#### 📋 **Task Management Dashboard**

**Main Dashboard**
![Task Management Dashboard](docs/images/task%20managemnt%20dashbaord.png)

**Create New Task**
![Task Create Form](docs/images/Task%20create%20form.png)

**Delete Task Confirmation**
![Task Delete UI](docs/images/Task%20Delete%20Ui.png)

### Backend API Documentation

#### 🔧 **Swagger API Interface**

**REST API Documentation**
![Swagger Backend](docs/images/swagger%20backend.png)

**Key Features:**
- **Authentication APIs**: Login, Register, Test endpoints
- **Task Management APIs**: CRUD operations for tasks
- **Health Check APIs**: Application monitoring
- **Actuator Endpoints**: Metrics and application info
- **Interactive Testing**: Try out APIs directly from the interface

### 🎨 **UI/UX Features**

**Frontend Highlights:**
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI Components**: Clean, professional interface using Angular Material
- **Real-time Updates**: Dynamic task status updates and counts
- **Form Validation**: Comprehensive client-side validation with helpful error messages
- **User Feedback**: Success/error messages and confirmation dialogs
- **Intuitive Navigation**: Easy-to-use dashboard with organized task views

**Backend API Features:**
- **RESTful Design**: Clean, consistent API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Comprehensive Documentation**: Interactive Swagger UI for testing
- **Error Handling**: Detailed error responses with proper HTTP status codes
- **Data Validation**: Server-side validation for all inputs

## 🛠️ Technology Stack

### Backend
- **Java 17+**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data MongoDB**
- **Maven** (Build tool)
- **Swagger/OpenAPI** (API Documentation)

### Frontend
- **Angular 17+**
- **TypeScript**
- **Angular Material** (UI Components)
- **RxJS** (Reactive Programming)
- **Angular CLI**

### Database
- **MongoDB**

### DevOps
- **Docker & Docker Compose**
- **Nginx** (Reverse Proxy)

## 📋 Prerequisites

- **Docker & Docker Compose** (for containerized deployment)
- **Java 17+** (for local backend development)
- **Node.js 18+ & npm** (for local frontend development)
- **Maven 3.6+** (for backend build)

## 🚀 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Task-Manager-App
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - **Frontend UI**: http://localhost:8080
   - **Backend API**: http://localhost:8081/api
   - **Swagger Documentation**: http://localhost:8081/api/swagger-ui.html

4. **Start using the application**
   - **Registration**: Create your account at http://localhost:8080/register
   - **Login**: Sign in at http://localhost:8080/login
   - **Dashboard**: Manage your tasks with intuitive UI
   - **API Testing**: Use Swagger UI for API development and testing


## 📁 Project Structure

```
Task-Manager-App/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/taskmanager/backend/
│   │   ├── controller/        # REST Controllers
│   │   ├── service/          # Business Logic Services
│   │   ├── entity/           # Database Entities
│   │   ├── repository/       # Data Access Layer
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── config/          # Configuration Classes
│   │   └── util/            # Utility Classes
│   ├── src/main/resources/
│   │   ├── application.yml   # Main configuration
│   │   └── static/          # Static resources
│   └── pom.xml              # Maven dependencies
├── frontend/                  # Angular application
│   ├── src/app/
│   │   ├── components/      # Angular Components
│   │   ├── services/        # Angular Services
│   │   ├── models/          # TypeScript Models
│   │   └── guards/          # Route Guards
│   ├── src/assets/          # Static assets
│   └── package.json         # npm dependencies
├── docker-compose.yml         # Docker orchestration
├── Dockerfile.backend         # Backend container config
├── Dockerfile.frontend        # Frontend container config
├── nginx.conf                # Nginx configuration
└── README.md                 # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/test` - Test endpoint

### Tasks
- `GET /api/tasks` - Get user's tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/tasks/{id}` - Get specific task

### Health Check
- `GET /api/health` - Application health status

## 🐳 Docker Configuration

### Services
- **MongoDB**: Database (port 27017)
- **Backend**: Spring Boot API (port 8081)
- **Frontend**: Angular app (port 4200)
- **Nginx**: Reverse proxy (port 8080)

### Environment Variables
You can customize the application using environment variables in `docker-compose.yml`:

```yaml
environment:
  - MONGODB_URI=mongodb://mongo:27017/taskmanager
  - JWT_SECRET=your-secret-key
  - CORS_ALLOWED_ORIGINS=http://localhost:8080
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS Configuration**: Configurable cross-origin requests
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Authorization**: Route-based access control


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy Task Managing! 🎯**
