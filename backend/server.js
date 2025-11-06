const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Import ALL routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const dealRoutes = require('./routes/dealRoutes');
const activityRoutes = require('./routes/activityRoutes');
const noteRoutes = require('./routes/noteRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const emailRoutes = require('./routes/emailRoutes');
const contactFileRoutes = require('./routes/fileRoutes');
const organizationFileRoutes = require('./routes/organizationFileRoutes');

dotenv.config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Main API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/tasks', taskRoutes);

// --- CORRECTED & EXPLICIT NESTED ROUTES ---
app.use('/api/contacts/:contactId/files', contactFileRoutes);
app.use('/api/organizations/:orgId/files', organizationFileRoutes);

app.use('/api/contacts/:contactId/activities', activityRoutes);
app.use('/api/contacts/:contactId/notes', noteRoutes);
app.use('/api/contacts/:contactId/email', emailRoutes);

app.get('/', (req, res) => { res.send('StellarCRM Backend is running...'); });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => { console.log(`🚀 Server is running on port ${PORT}`); });