import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
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
app.post('/register', async (req, res) => {
    const { name, age, email, password } = req.body;
    try {
        const newUser = await User.create({
            name,
            age,
            email,
            password
        });
        res.send(newUser);
        console.log(newUser)
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
