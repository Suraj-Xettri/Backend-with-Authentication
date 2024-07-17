import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

import User from './models/userModel.js';



// Needed to use `__dirname` with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});
app.post('/register',  (req, res) => {
    const { name, age, email, password } = req.body;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            const newUser = await User.create({
                name,
                age,
                email,
                password: hash
            });

            let token = jwt.sign({email}, "token")
            res.cookie("token", token)
            res.redirect('/');
            console.log(token)
        }) 
    })
});

app.post('/logout', (req, res) => {
    res.cookie("token","")
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login',async (req, res) => {
   let user = await User.findOne({email: req.body.email})
   if(!user) res.send("Wrong Email")

    const passwordMatch = bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
        res.render('profile', {user: user});
    } else {
        res.send('Wrong password');
    }
})


app.listen(3000);
