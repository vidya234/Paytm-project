// Initialize express router
const express = require('express');
const userRoute = express.Router();
//zod library for validation
const zod = require('zod');
const { User, Account } = require('../db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authmiddleware = require('../middlewares/Authmiddleware');
const JwtSecret = require('../config');


userRoute.use(cors());
//user schema
const signupzod = zod.object({
    username: zod.string().email(),
    firstname: zod.string().max(50),
    lastname: zod.string().max(50),
    password: zod.string().min(6)
});

//signup
userRoute.post("/signup", async (req, res) => {
    try {
        const parsed = signupzod.safeParse(req.body);
        //console.log(req.body);
        if (!parsed.success || !parsed.data) {
            return res.status(400).json({
                message: "Invalid request body"
            });
        }

        const user = parsed.data;

        // Ensure all required fields are provided
        if (!user.username || !user.firstname || !user.lastname || !user.password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if the user already exists
        const existing = await User.findOne({ username: user.username });
        if (existing) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }

        // Create the user
        const user_signup = await User.create({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            password: user.password
        });

        const userid = user_signup._id;

        // Create an account for the user
        await Account.create({
            userId: userid,
            balance: 1 + Math.random() * 1000
        });

        // Generate JWT token
        const token = jwt.sign({ userid }, JwtSecret);
        //console.log(token);
        res.json({
            message: "User created successfully",
            token: token
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//signin
 const signinZod = zod.object({ 
    username: zod.string().email(),
    password: zod.string().min(6)
});

userRoute.post("/signin", async (req, res) => {
    try {
        const parsed = signinZod.safeParse(req.body);

        if (!parsed.success || !parsed.data) {
            return res.status(400).json({
                message: "Invalid request body"
            });
        }

        const user = parsed.data;

        // Ensure all required fields are provided
        if (!user.username || !user.password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check if the user exists
        const existing = await User.findOne({ username: user.username });
        if (!existing) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check if the password is correct
        if (existing.password !== user.password) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userid: existing._id }, JwtSecret);

        res.json({
            message: "User signed in successfully",
            token: token
        });

        

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//put

const updateZod = zod.object({
    firstname: zod.string().max(50).optional(),
    lastname: zod.string().max(50).optional(),
    password: zod.string().min(6).optional()
});

userRoute.put("/",authmiddleware, async (req, res) => {
    try {
        const parsed = updateZod.safeParse(req.body);

        if (!parsed.success || !parsed.data) {
            return res.status(400).json({
                message: "Invalid request body"
            });
        }

        const user = parsed.data;
        const userid = req.userid;
        //console.log(userid);
        // Update the user
        await User.updateOne({ _id: userid }, user);

        res.json({
            message: "User updated successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//filter/bulk

userRoute.get("/bulk",authmiddleware, async(req, res) =>{
    const filter = req.query.filter || "";

    // or is either find in lastname or the firstname
    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })
    console.log(users);
      //  return only the usename, lastname and firstname and dont send the password here
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
});
module.exports = userRoute;