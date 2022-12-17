const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const JWT_SECRET = 'itsasecret';
var fetchuser = require('../middleware/fetchuser');



//ROUTE 1 
// Create a User


router.post('/createuser',
    [ body('name', 'Enter a valid name').isLength({ min: 3 }), 
    body('email','Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').isLength({ min: 5 })], 
    async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email }) 
        if (user) {
            return res.status(400).json({success, error: "Sorry, a user with this email already exists" })
        }
         const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt); 
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success,user, authtoken });
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Some error occured");
    }
   
})




//ROUTE 2
// login

router.post('/login', [
    body('email').isEmail(),
    body('password','Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        let success=false
        if (!user) {
            return res.status(400).json({success, errors: "Please login with valid email" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
         if (!passwordCompare) {
            return res.status(400).json({success, errors: "Please login with correct password" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success=true;
        res.json({success, authtoken,data});

    } catch (error) {
        res.status(500).send("Some error occured");
    }
})




//ROUTE 3
// to get user details after login

router.post('/getuser', fetchuser, async (req, res) => { 
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        res.status(500).send("Some error occured");
    }
})


module.exports = router