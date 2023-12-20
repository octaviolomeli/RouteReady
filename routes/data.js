require('dotenv').config()
const express = require('express')
const router = express.Router()
const checkAuthenticated = require('../modules/auth')
const fs = require("fs");
const axios = require('axios');

// Import Database
const connectDB = require("./database/db");
const User = require("./database/User");
connectDB();

// Call 511 API to get AC Transit bus data
router.get('/busData/:stopId', checkAuthenticated, async (req, res) => {
    try {
        const url = `http://api.511.org/transit/StopMonitoring?api_key=${process.env.BUS_KEY}&agency=AC&stopcode=${req.params.stopId}&format=JSON`;
        const data = await axios.get(url);
        res.json(data.data);
    } catch (e) {
        console.error(e);
    }
})

// Call BART API to get BART data
router.get('/bartData/:station/:direction', checkAuthenticated, async (req, res) => {
    try {
        const url = `http://api.bart.gov/api/etd.aspx?cmd=etd&orig=${req.params.station}&key=${process.env.BART_KEY}&dir=${req.params.direction.substring(0,1)}&json=y`;
        const data = await axios.get(url);
        res.json(data.data);
    } catch (e) {
        console.error(e);
    }
})

// Retrieve data from JSON files
router.get('/json/:type', async (req, res) => {
    fs.readFile(`../frontend/public/data/${req.params.type}data.json`, "utf8", (err, jsonString) => {
        if (err) {
          console.log("File read failed:", err);
          return;
        }
        res.send(JSON.parse(jsonString));
      });
});

// Retrieve user data corresponding to email
router.get('/user/:email/:password', checkAuthenticated, async (req, res) => {
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

// Update the data corresponding to a user
router.post('/update_user', checkAuthenticated, async (req, res) => {
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
        update[request.entry_name] = d;
        const user = await User.findOneAndUpdate({email: request.user_email}, update);
        res.json(user);
    }
    catch (e) {
        res.status(500).json({msg: 'Error'});
    }
})

module.exports = router;