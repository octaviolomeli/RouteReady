require('dotenv').config()
const express = require('express')
const router = express.Router()
const passport = require('passport')

// Import Database
const connectDB = require("./database/db");
const User = require("./database/User");
connectDB();

// Route for signing and authenticating
router.post("/sign-in", passport.authenticate('local'), 
    (req, res) => {
        req.session.name = req.body.email; 
        req.session.save(); 
        res.json({mode: 'sign-in', msg: 'success', data: req.user});
    }
)

// When user signs up, make an account and direct them to the login page
router.post('/sign-up', async (req, res) => {
    const input_email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, process.env.SALT);
    const starter_entry = {
        id: "",
        vehicle: "",
        direction: "",
        stop: "",
        arrival: "",
        possible: "",
        min_to_walk: 10
    };

    try {
        let user = await User.findOne({email: input_email});
        if (user) {
            return res.json({mode: 'sign-up', msg: 'Account with that email already exists.'});
        }
        user = new User({
            email: input_email,
            password: hashedPassword,
            entry0: starter_entry,
            entry1: starter_entry,
            entry2: starter_entry,
            entry3: starter_entry,
            entry4: starter_entry,
            entry5: starter_entry,
            entry6: starter_entry
        });

        await user.save();
        res.json({mode: 'sign-up', msg: 'success'});
    }
    catch (err) {
        res.status(500).send("Error in Saving");
    }
});

module.exports = router;