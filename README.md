# Synk – Real-Time Collaborative Document Editor

> **Synk** is a full-stack, real-time collaborative editor inspired by Google Docs... built to showcase modern web development, real-time protocols, and professional software design.

---

## 🚀 Overview

**Synk** is a full-stack web application that allows multiple users to **create, edit, and collaborate on documents in real time**.  
Built with the **MERN stack** and powered by **Socket.IO**, every change is instantly reflected across all connected clients.

This project demonstrates:
- Proficiency in modern web technologies  
- Implementation of real-time communication protocols  
- Clean and scalable **full-stack architecture**

---

## ✨ Key Features

- **Real-Time Collaboration**: Instant updates across clients via WebSockets (Socket.IO)  
- **Rich Text Editing**: Powered by `react-quill-new` for a professional WYSIWYG experience  
- **Secure Authentication**: JSON Web Tokens (JWTs) stored in **HttpOnly cookies**  
- **Document Management**: Create, view, and manage documents on a central dashboard  
- **Auto-Save**: Changes persist to MongoDB after short inactivity — never lose progress  
- **Dark Mode UI**: Modern, responsive interface styled with **Tailwind CSS**

---

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Tailwind CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose)  
- **Real-Time Engine**: Socket.IO  
- **Authentication**: JWT, bcrypt.js  
- **Editor**: react-quill-new  

---

## ⚙️ Setup and Installation

Follow these steps to run Synk locally:

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd synk
```

### 2. Backend Setup
```bash
cd server
npm install
# Create a .env file with your MONGODB_URI and both JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Open in browser
```bash
http://localhost:5173
```

📂 Project Structure
synk/  
│── client/        # React frontend  
│── server/        # Express + MongoDB backend  
│── README.md      # Project documentation  


🖥️ Deployment
Synk can be deployed easily using:

- **Frontend** → Vercel / Netlify  
- **Backend** → Render / Railway / AWS  
- **Database** → MongoDB Atlas

### Github workflow
```
# Initialize git
git init -b main

# Stage all files
git add .

# Commit changes
git commit -m "Initial commit: Add complete Synk MVP"

# Link remote repo
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main

# Push to GitHub
git push -u origin main

```


🔮 Future Improvements
- Add presence indicators (who’s online & editing)  
- Implement role-based access & permissions  
- Support exporting to PDF/Markdown  
- Optimize performance for large documents


🤝 Contributing
Contributions are welcome!  
Please fork the repo and create a pull request for any enhancements.


📜 License
This project is licensed under the **MIT License**.  
See the [LICENSE](./LICENSE) file for details.


🙌 Acknowledgments
- Inspired by **Google Docs**  
- Built with ❤️ using **MERN + Socket.IO**
