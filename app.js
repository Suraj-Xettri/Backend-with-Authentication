import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/userModel.js";
import Post from "./models/post.js"

// Needed to use `__dirname` with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.get('/profile', isLoggedIn, async (req, res) => {
 
  let user = await User.findOne({ email: req.user.email }).populate("posts");
  res.render("profile", { user });
});

app.post("/register", async (req, res) => {
  const { name, age, email, password } = req.body;
  const file = req.file;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(500).send("User already exists");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      age,
      email,
      password: hash,
      image: file.path
    });

    const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.redirect("/login");

    const passwordMatch = bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign({ email }, "secret", { expiresIn: "1h" });
      res.cookie("token", token);

      res.redirect("/profile");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

function isLoggedIn(req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).send("You must be logged in first");
  }

  try {
    const data = jwt.verify(req.cookies.token, "secret");
    req.user = data;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Invalid token");
  }
}


app.post("/post", isLoggedIn,async (req, res) =>{
  let user = await User.findOne({ email: req.user.email });
  let post = await Post.create({
    author: user._id,
    content: req.body.content
  })
  user.posts.push(post._id)
  await user.save()


  res.redirect("/profile")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
