const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../schema/userSchema');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }))

router.get('/', (req, res) => {
    res.render('register', { errorMessage: null });

});

router.post('/', async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    

    try { 
        if (!firstName || !lastName || !username || !email || !password) {
            throw new Error('All fields must be filled');
        }
 
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new Error('Email already in use');
            } else {
                throw new Error('Username already in use');
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword
        });

        req.session.user = newUser;
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(400).render('register', { errorMessage: error.message });
    }
});

module.exports = router;
