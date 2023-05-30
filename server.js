// imports
const fs = require("fs");
const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
// database stuff
const mongoServer = require("./database/db");
const User = require("./database/User");

mongoServer();

// Use
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use(express.json());

// when user logs in, direct them to the monitor page if successful
app.post("/sign-in", async (req, res) => {
    const inputted_email = req.body.email;
    const inputted_password = req.body.password;
    
    try {
        let user = await User.findOne({
            email: inputted_email
        });
        if (!user) return res.json({mode: 'sign-in', msg: 'No account exists with that email.'});

        const isMatch = await bcrypt.compare(inputted_password, user.password);
        if (!isMatch)
            return res.json({mode: 'sign-in', msg: 'Password is incorrect.'});

        res.json({mode: 'sign-in', msg: 'success', data: user});
    }
    catch (e) {
        console.error(e);
        res.status(500).json({message: "Server Error"})
    }
})

// when user signs up, make an account and direct them to the login page
app.post('/sign-up', async (req, res) => {
    const input_email = req.body.email;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
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

// updates user's information in the database
app.post('/update_user', async (req, res) => {
    try {
        var request = req.body;
        const d = {
            id: request.uid,
            vehicle: request.utype,
            line: request.uline,
            direction: request.udirection,
            stop: request.ustop_station,
            arrival: request.uarrival,
            possible: request.upossible,
            min_to_walk: request.umin
        };
        const update = {};
        update[request.entry_name] = d
        const user = await User.findOneAndUpdate({email: request.user_email}, update);
        res.json(user);
    }
    catch (e) {
        res.status(500).json({msg: 'Error'});
    }
})

app.get('/user/:email/:password', async (req, res) => {
    let user = await User.findOne({email: req.params.email});
    if (!user) {
        res.json({valid: 'false'});
    } else {
        
        if (user.password === decodeURIComponent(req.params.password)) {
            res.json({valid: 'true', data: user});
        } else {
            res.json({valid: 'false'});
        }
    }
})

app.get('/data/:type', async (req, res) => {
    fs.readFile(`./frontend/public/data/${req.params.type}data.json`, "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        res.send(JSON.parse(jsonString));
      });
});

app.listen(8888, () => {console.log("App is running on http://localhost:8888")});