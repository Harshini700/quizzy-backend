const express=require('express');
const cors=require('cors');
const connectDB=require('./db');
const authRoutes=require('./routes/AuthRoutes');
const analyticsRoutes=require('./routes/analyticsRoutes')
require('dotenv').config();

const quizRoutes=require('./routes/QuizRoutes');
const quizAttempts=require('./routes/AttemptsRoutes')
const questionRoutes = require('./routes/questionRoutes');

const app=express();
app.use(cors());
app.use(express.json());

connectDB()

app.use('/api/quizzes',quizRoutes);
app.use('/api/attempts',quizAttempts); 
app.use('/api/analytics',analyticsRoutes);
app.use('/api/', authRoutes);
app.use('/api/questions', questionRoutes);

app.listen(5000,()=>console.log(`server running on port 5000`))