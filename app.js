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


app.post('/register',  async (req, res) => {
    const { name, age, email, password } = req.body;

    let user =  await User.findOne({email});

    if(user) return res.status(500).send("User already exits")

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
            res.redirect('/profile');
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
     let {email, password} = req.body

   let user = await User.findOne({email})
   if(!user) res.redirect("./login")

    const passwordMatch = bcrypt.compare(password, user.password);

    if (passwordMatch) {
        let token = jwt.sign({email}, "token")
        res.cookie("token", token)
        res.render('profile', {user});
    } else {
        res.redirect('/login');
    }
}) 


function isLoggedIn(req, res, next){
    if(req.cookie.token){
        
    }
}


app.listen(3000);
