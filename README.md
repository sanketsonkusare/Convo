# Convo - AI-Powered Chat Application

A modern real-time chat application with integrated AI assistant, built with React, Node.js, Socket.IO, and OpenRouter AI.

![Convo Chat App]()

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user registration and login
- 💬 **Real-time Messaging** - Instant messaging with Socket.IO
- 🤖 **AI Assistant** - Chat with ConvoAI powered by Mistral AI
- 📸 **Image Sharing** - Upload and share images via Cloudinary
- 🌙 **Dark/Light Mode** - Toggle between themes
- 📱 **Responsive Design** - Works on desktop and mobile
- 🟢 **Online Status** - See who's online in real-time
- ⚡ **Fast Performance** - Optimized for speed and efficiency

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **DaisyUI** - UI components
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **React Markdown** - AI response formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.IO** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **OpenRouter** - AI integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Cloudinary account
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/convo-chat-app.git
   cd convo-chat-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/convo-db
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   PORT=5001
   CLOUDINARY_CLOUD_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   OPENROUTER_API=your-openrouter-api-key
   ```

   Create `.env` file in the frontend directory:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

4. **Start the application**
   
   Open 2 terminals:
   
   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### MongoDB Setup
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to your `.env` file

### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add to your `.env` file

### OpenRouter Setup
1. Create account at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add to your `.env` file

## 🎯 Usage

### Regular Chat
1. Register/Login to your account
2. Select a user from the sidebar
3. Start chatting in real-time
4. Share images by clicking the image icon
5. See online status of other users

### AI Chat
1. Click on "ConvoAI" in the sidebar
2. Ask any question or start a conversation
3. Get intelligent responses powered by Mistral AI
4. Enjoy formatted responses with markdown support


## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/message/users` - Get all users
- `GET /api/message/:id` - Get messages with specific user
- `POST /api/message/send/:id` - Send message to user

### Real-time Events
- `newMessage` - New message received
- `getOnlineUsers` - Online users list
- `sendMessage` - Send message to AI
- `receiveMessage` - Receive AI response

## 🎨 Customization

### Themes
The app uses DaisyUI themes. You can customize in `frontend/src/App.jsx`:
```javascript
// Available themes: light, dark, cupcake, bumblebee, etc.
<html data-theme="dark">
```

### AI Model
Change the AI model in `backend/src/lib/socket.js`:
```javascript
model: "mistralai/mistral-small-3.2-24b-instruct:free"
// Or use other OpenRouter models
```

## 🐛 Troubleshooting

### Common Issues

1. **Socket connection fails**
   - Check if backend is running on correct port
   - Verify CORS settings in production

2. **AI not responding**
   - Verify OpenRouter API key
   - Check API rate limits

3. **Images not uploading**
   - Verify Cloudinary credentials
   - Check file size limits

4. **Database connection fails**
   - Verify MongoDB URI
   - Check network access in MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for AI integration
- [Cloudinary](https://cloudinary.com/) for image storage
- [Socket.IO](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [DaisyUI](https://daisyui.com/) for UI components

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: [sanketsonkusare01@gmail.com]
- Documentation: [Link to docs if any]

---

**Made with ❤️ by Sanket**

⭐ Star this repository if you find it helpful!