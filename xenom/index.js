const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static("public"));

const User = require('./models/users.js');
const Login = require('./models/logina.js');
const Schedule = require('./models/Schedule');
mongoose.connect(process.env.MONGODB_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true }) 
    .then(() => console.log('Database connected')) 
    .catch(err => console.log('Database connection error:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));

// 🔹 Middleware to Protect Routes (Login Required)
const authMiddleware = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect to login if not logged in
    }
    next(); // Continue if logged in
};

// 🔹 Public Routes (No Authentication Needed)
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const loginData = await Login.findOne({ email });
        if (loginData && password === loginData.password) {
            const user = await User.findById(loginData.user_id);
            req.session.userId = user._id;  // Store user ID in session
            req.session.user = user;        // Store user object in session
            res.redirect('/home');  // Redirect to /home after successful login
        } else {
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});



// app.post('/login', async (req, res) => {
//     let { email, password } = req.body;
//     console.log('Request Body:', req.body); // Debug log

//     try {
//         let loginData = await Login.findOne({ email });
//         console.log('Login Data:', loginData); // Debug log

//         if (loginData) {
//             console.log('Entered Password:', password);
//             console.log('Stored Hashed Password:', loginData.password);

//             const isPasswordMatch = (password === loginData.password);
//             console.log('Password Match:', isPasswordMatch); // Debug log

//             if (isPasswordMatch) {
//                 const user = await User.findById(loginData.user_id);
//                 console.log('User Data:', user); // Debug log

//                 req.session.userId = user._id;
//                 req.session.user = user;
//                 res.redirect('/home'); // Redirect to a protected page
//             } else {
//                 console.log('Invalid password for email:', email); // Debug log
//                 res.render('login', { error: 'Invalid email or password' });
//             }
//         } else {
//             console.log('No login data found for email:', email); // Debug log
//             res.render('login', { error: 'Invalid email or password' });
//         }
//     } catch (err) {
//         console.error('Error during login:', err); // Error log
//         res.render('login', { error: 'An error occurred. Please try again.' });
//     }
// });

app.get('/register', (req, res) => {
    res.render('registration');
});

app.get('/schedule-pickup', (req, res) => {
    res.render('schedule-pickup');
});
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});
app.get('/waste', (req, res) => {
    res.render('waste');
});
app.get('/blogpost', (req, res) => {
    res.render('blogpost');
});
app.get('/index', (req, res) => {
    res.render('index');
});
app.get('/contacts', (req, res) => {
    res.render('contacts');
});
app.post('/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const newUser = new User({ name, email, password, phone, address });
        await newUser.save();

        const newLogin = new Login({ user_id: newUser._id, email, password });
        await newLogin.save();

        console.log('User registered successfully:', { email, password }); // Debug log
        res.redirect('/login');
    } catch (err) {
        console.error('Error registering user:', err); // Error log
        res.render('registration', { error: 'An error occurred during registration. Please try again.' });
    }
});

// 🔹 Protected Routes (Requires Authentication)
app.get('/', authMiddleware, (req, res) => {
    res.render('login');
});



app.get('/home', authMiddleware, (req, res) => {
    res.render('home', { user: req.session.user });
});
//hello

// 🔹 Example of Applying Auth Middleware to Another Route
app.get('/someProtectedRoute', authMiddleware, (req, res) => {
    res.render('someProtectedPage', { user: req.session.user });
});

// 🔹 Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login'); // Redirect to login after logout
    });
});

app.get('/index', (req, res) => {
    res.render('index');});

    app.get('/locality', (req, res) => {
        res.render('locality');});
        app.get('/company', (req, res) => {
            res.render('company');});
    app.post('/schedule', async (req, res) => {
        const { name, contact, time, location, wasteType, collectorType, weather, weight, notes } = req.body;
        await Schedule.create({ name, contact, time, location, wasteType, collectorType, weather, weight, notes });
        res.redirect('/home');  // Redirect back to the form after submission
    });
    // Display Scheduled Collections
    app.get('/schedule', async (req, res) => {
        const schedules = await Schedule.find();
        res.render('schedule', { schedules });
    });

    app.get('/logout', (req, res) => {
        req.logout((err) => {
            res.redirect('/');
        });
    });


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
