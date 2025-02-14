// server/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/auth.js');
const googleAuthRoutes = require('./routes/googleAuth.js');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

require('./config/passport.js');
const cors = require('cors');

// dotenv.config();
// const connectDB =require('./config/db.js');/
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Session
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/auth', googleAuthRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
