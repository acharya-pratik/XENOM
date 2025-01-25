


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

const User = require('./models/users.js');
const Login = require('./models/logina.js');

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
    let { email, password } = req.body;
    console.log('Request Body:', req.body); // Debug log

    try {
        let loginData = await Login.findOne({ email });
        console.log('Login Data:', loginData); // Debug log

        if (loginData) {
            console.log('Entered Password:', password);
            console.log('Stored Hashed Password:', loginData.password);

            const isPasswordMatch = (password === loginData.password);
            console.log('Password Match:', isPasswordMatch); // Debug log

            if (isPasswordMatch) {
                const user = await User.findById(loginData.user_id);
                console.log('User Data:', user); // Debug log

                req.session.userId = user._id;
                req.session.user = user;
                res.redirect('/home'); // Redirect to a protected page
            } else {
                console.log('Invalid password for email:', email); // Debug log
                res.render('login', { error: 'Invalid email or password' });
            }
        } else {
            console.log('No login data found for email:', email); // Debug log
            res.render('login', { error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during login:', err); // Error log
        res.render('login', { error: 'An error occurred. Please try again.' });
    }
});

app.get('/register', (req, res) => {
    res.render('registration');
});

app.get('/schedule-pickup', (req, res) => {
    res.render('schedule-pickup');
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

app.get('/appointments', authMiddleware, (req, res) => {
    res.render('appointments');
});

app.get('/home', authMiddleware, (req, res) => {
    res.render('home', { user: req.session.user });
});

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

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});























































// if error occured then just chang the comment code 
// and run the code again


// const express = require('express');
// const ejs = require('ejs');
// const app = express();
// const path = require('path');
// const session = require('express-session');
// const bodyParser = require('body-parser'); 
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();
// app.set('view engine', 'ejs');
// const User = require('./models/users.js');
//  const Login = require('./models/logina.js');

// mongoose.connect(process.env.MONGODB_URI, 
//     { useNewUrlParser: true, useUnifiedTopology: true }) 
//     .then(() => console.log('Database connected')) 
//     .catch(err => console.log('Database connection error:', err));



// app.use(express.static(path.join(__dirname, 'public')));


// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: false }));
// app.set('view engine', 'ejs');




//  app.get('/', (req, res) => {

//  res.render('home');

//  });
 
//  app.get('/login', (req, res) => {
//     res.render('login');
//  });

//  app.post('/login', async (req, res) => {
//     let {email, password } = req.body;
//     console.log('Request Body:', req.body); // Debug log

//     try {
//         let loginData = await Login.findOne({ email });
//         console.log('Login Data:', loginData); // Debug log

//         if (loginData) {
//             console.log('Entered Password:', password);
//             console.log('Stored Hashed Password:', password);

//             const isPasswordMatch = (password == loginData.password);
//             console.log('Password Match:', isPasswordMatch); // Debug log

//             if (isPasswordMatch) {
//                 const user = await User.findById(loginData.user_id);
//                 console.log('User Data:', user); // Debug log

//                 req.session.userId = user._id;
//                 req.session.user = user;
//                 res.redirect('/');
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

// app.get('/register', (req, res) => {
//     res.render('registration');
// });


// app.post('/register', async (req, res) => {
//     const { name, email, password, phone, address } = req.body;
//     try {
//         const hashedPassword = password;
//         console.log('Hashed Password:', hashedPassword); // Debug log
//         const newUser = new User({ name, email, password: hashedPassword, phone, address });
//         await newUser.save();

//         const newLogin = new Login({ user_id: newUser._id, email, password: hashedPassword });
//         await newLogin.save();

//         console.log('User registered successfully:', { email, hashedPassword }); // Debug log
//         res.redirect('/');
//     } catch (err) {
//         console.error('Error registering user:', err); // Error log
//         res.render('addUser', { error: 'An error occurred during registration. Please try again.' });
//     }
// });



// //appoinments for collection

// app.get('/appointments', (req, res) => {
//     if (req.session.userId) {
//         res.render('appointments');
//     } else {
//         res.redirect('/');
//     }
// });
// app.get('/appointments', (req, res) => {
//     if (req.session.userId) {
//         res.render('appointments');
//     } else {
//         res.redirect('/');
//     }
// });




// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });