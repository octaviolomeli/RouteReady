require('dotenv').config()
const express = require('express')
const cors = require('cors');
const bcrypt = require('bcrypt');

// Express session mgmt
const session = require('express-session')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const checkAuthenticated = require('./modules/auth')

// Passport & Strategy
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

// Import Database
const connectDB = require("./database/db");
const User = require("./database/User");
connectDB();

// create app and set limits
const app = express()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 50 requests per windowMs
})

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 100 }))
app.use(helmet({
    contentSecurityPolicy: false
}))
app.use(limiter)

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET
}))

// set up passport
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, cb) {
    cb(null, user)
})

passport.deserializeUser(function (obj, cb) {
    cb(null, obj)
})

// set up passport strategy / Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false
  },
  async (email, password, done) => {
    try {
        const user = await User.findOne({ email: email });
        
        if (!user) { 
            return done(null, false, { error: "Incorrect username"})
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            return done(null, false, { error: "Incorrect password"})
        }
        return done(null, user);

    } catch (err) {
        return done(err);
    }
  })
);

// routes
app.use('/data', require('./routes/data'), checkAuthenticated)
app.use('/form', require('./routes/form'))
app.get('/logout', checkAuthenticated, (req, res) => {
    req.session.destroy()
    res.json({ message: "Successfully ended session." })
    res.redirect('http://localhost:3000/sign-in')
})

module.exports = app