# 🎓 KNOWEE - AI-Powered Learning Community Platform

<div align="center">

![KNOWEE Logo](frontend/src/assets/Logo/Logo.png)

**A Next-Generation Social Learning Platform with AI-Driven Content Recommendations**

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.0+-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.2-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)]()

</div>

---

## 🚀 **Project Overview**

KNOWEE is a comprehensive social learning platform designed specifically for university students, featuring AI-powered content recommendations, real-time messaging, and an intuitive user experience. Built with modern web technologies and machine learning algorithms, it provides a seamless environment for knowledge sharing and collaborative learning.

### ✨ **Key Features**

- 🤖 **AI-Powered Recommendations** - Machine learning algorithms suggest personalized content
- 💬 **Real-time Messaging** - Socket.IO powered instant messaging system
- 📱 **Responsive Design** - Modern UI/UX optimized for all devices
- 🔍 **Advanced Search** - Full-text search with search history tracking
- 👥 **Social Features** - Follow users, like posts, and build learning communities
- 📊 **Analytics Dashboard** - Comprehensive admin panel with data visualization
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access
- ☁️ **Cloud Storage** - Cloudinary integration for media management

---

## 🏗️ **Architecture & Technology Stack**

### **Frontend (React.js)**
```javascript
├── React 18.2.0 (Latest)
├── Vite 6.3.5 (Build Tool)
├── Ant Design 5.25.2 (UI Framework)
├── React Query 5.76.2 (State Management)
├── React Router DOM 7.6.0 (Routing)
├── Socket.IO Client 4.8.1 (Real-time)
├── Tailwind CSS 4.1.7 (Styling)
└── Lucide React 0.522.0 (Icons)
```

### **Backend (Node.js)**
```javascript
├── Express.js 5.1.0 (Web Framework)
├── MongoDB 8.14.2 (Database)
├── Mongoose 8.14.2 (ODM)
├── Socket.IO 4.8.1 (Real-time)
├── JWT 9.0.2 (Authentication)
├── Cloudinary 1.41.3 (Media Storage)
├── Google AI 1.9.0 (AI Integration)
└── Multer 1.4.5 (File Upload)
```

### **AI Recommendation Service (Python)**
```python
├── FastAPI 0.115.2 (API Framework)
├── Scikit-Surprise 1.1.4 (ML Library)
├── LightFM 1.17 (Hybrid Recommender)
├── Pandas 2.0.3 (Data Processing)
├── NumPy 1.24.4 (Numerical Computing)
├── PyMongo 4.10.1 (MongoDB Driver)
└── Uvicorn 0.32.0 (ASGI Server)
```

---

## 🎯 **Core Functionalities**

### **1. AI-Powered Content Recommendation System**
- **Collaborative Filtering** using Surprise library
- **Content-Based Filtering** with keyword analysis
- **Hybrid Recommendations** combining multiple algorithms
- **Real-time Personalization** based on user behavior

### **2. Social Learning Features**
- **Post Creation & Sharing** with rich text editor
- **Comment System** with nested replies
- **Like & Follow** mechanisms
- **User Profiles** with learning history
- **Course & Tag Filtering**

### **3. Real-time Communication**
- **Instant Messaging** between users
- **Chat Rooms** for group discussions
- **Real-time Notifications**
- **Online Status** indicators

### **4. Advanced Search & Discovery**
- **Full-text Search** across posts and users
- **Search History** tracking
- **Auto-complete** suggestions
- **Filter by Categories, Tags, Courses**

### **5. Admin Dashboard**
- **User Management** with role-based access
- **Content Moderation** system
- **Analytics & Statistics** visualization
- **Category & Tag Management**

---

## 🛠️ **Installation & Setup**

### **Prerequisites**
- Node.js 18+ 
- Python 3.8+
- MongoDB 8.0+
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/knowee-platform.git
cd knowee-platform
```

### **2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### **4. AI Service Setup**
```bash
cd recommendation-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### **5. Environment Variables**

**Backend (.env)**
```env
PORT=8888
MONGODB_URI=mongodb://localhost:27017/knowee
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
GOOGLE_AI_API_KEY=your_google_ai_key
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8888/api
VITE_SOCKET_URL=http://localhost:8888
```

---

## 📊 **Database Schema**

### **Core Models**
- **Users** - Authentication, profiles, preferences
- **Posts** - Content, metadata, engagement metrics
- **Comments** - Nested comment system
- **Categories & Tags** - Content organization
- **Courses & Majors** - Academic structure
- **Messages & Chat Rooms** - Real-time communication
- **Search History** - User behavior tracking

### **Relationships**
- User ↔ Posts (One-to-Many)
- User ↔ Comments (One-to-Many)
- User ↔ User (Follow/Following)
- Post ↔ Tags (Many-to-Many)
- Post ↔ Categories (Many-to-One)

---

## 🤖 **AI Recommendation System**

### **Algorithm Architecture**
```python
# Hybrid Recommendation Engine
class HybridRecommender:
    def __init__(self):
        self.collaborative_model = SVD(n_factors=20)
        self.content_model = KeywordBasedFilter()
        self.following_model = SocialBasedFilter()
    
    def get_recommendations(self, user_id):
        # Combine multiple recommendation sources
        collaborative_scores = self.collaborative_model.predict(user_id)
        content_scores = self.content_model.get_scores(user_id)
        social_scores = self.following_model.get_scores(user_id)
        
        return self.ensemble_scores([
            collaborative_scores, 
            content_scores, 
            social_scores
        ])
```

### **Features**
- **SVD (Singular Value Decomposition)** for collaborative filtering
- **Keyword-based filtering** using search history
- **Social-based filtering** using follow relationships
- **Course interest matching** for academic relevance
- **Real-time scoring** with async processing

---

## 🔒 **Security Features**

- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **CORS Configuration** for cross-origin requests
- **Input Validation** and sanitization
- **Rate Limiting** for API endpoints
- **Role-based Access Control** (Admin/User)
- **Secure File Upload** with Cloudinary

---

## 📱 **User Interface**

### **Design Principles**
- **Mobile-First** responsive design
- **Material Design** inspired components
- **Accessibility** compliant (WCAG 2.1)
- **Performance** optimized with lazy loading
- **Modern UI/UX** with smooth animations

### **Key Components**
- **Landing Page** with hero carousel
- **Dashboard** with personalized feed
- **Post Editor** with rich text capabilities
- **Messaging Interface** with real-time updates
- **Admin Panel** with comprehensive analytics

---

## 🚀 **Performance Optimizations**

### **Frontend**
- **Code Splitting** with React.lazy()
- **Image Optimization** with lazy loading
- **Bundle Optimization** with Vite
- **Caching Strategy** with React Query
- **Virtual Scrolling** for large lists

### **Backend**
- **Database Indexing** for fast queries
- **Connection Pooling** for MongoDB
- **Caching** with Redis (planned)
- **Compression** middleware
- **Async Processing** for heavy operations

---

## 📈 **Analytics & Monitoring**

### **User Analytics**
- **Engagement Metrics** (likes, comments, shares)
- **Content Performance** tracking
- **User Behavior** analysis
- **Search Patterns** monitoring
- **Recommendation Accuracy** measurement

### **System Monitoring**
- **API Response Times**
- **Database Performance**
- **Error Tracking**
- **User Session Analytics**
- **Real-time System Health**

---

## 🧪 **Testing Strategy**

### **Frontend Testing**
- **Unit Tests** with Jest & React Testing Library
- **Integration Tests** for component interactions
- **E2E Tests** with Playwright (planned)
- **Accessibility Tests** with axe-core

### **Backend Testing**
- **API Tests** with Supertest
- **Unit Tests** for business logic
- **Integration Tests** for database operations
- **Load Testing** with Artillery (planned)

---

## 📚 **API Documentation**

### **RESTful Endpoints**
```http
# Authentication
POST   /api/users/login
POST   /api/users/signup
GET    /api/users/profile

# Posts
GET    /api/posts
POST   /api/posts
GET    /api/posts/:id
PUT    /api/posts/:id
DELETE /api/posts/:id

# Recommendations
GET    /recommendations/surprise/:user_id
POST   /train/surprise
```

### **WebSocket Events**
```javascript
// Real-time messaging
socket.emit('join_room', roomId)
socket.emit('send_message', messageData)
socket.on('receive_message', handleMessage)
```

---

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---


### **Academic Context**
This project was developed as part of the **Final Year Project** in Computer Science, demonstrating advanced web development skills, machine learning implementation, and full-stack architecture design.

---

## 🙏 **Acknowledgments**

- **Ant Design** for the beautiful UI components
- **React Query** for efficient state management
- **Scikit-Surprise** for recommendation algorithms
- **MongoDB** for flexible data storage
- **Socket.IO** for real-time communication
- **Google AI** for advanced AI capabilities

---

<div align="center">

**Made with ❤️ for the learning community**

[![Stars](https://img.shields.io/github/stars/yourusername/knowee-platform?style=social)](https://github.com/yourusername/knowee-platform/stargazers)
[![Forks](https://img.shields.io/github/forks/yourusername/knowee-platform?style=social)](https://github.com/yourusername/knowee-platform/network/members)
[![Issues](https://img.shields.io/github/issues/yourusername/knowee-platform)](https://github.com/yourusername/knowee-platform/issues)

</div> 