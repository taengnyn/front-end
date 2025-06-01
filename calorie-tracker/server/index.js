const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// === ROUTES ===

app.get("/", (req, res) => {
  const user = req.cookies.auth || null;
  const hour = new Date().getHours();
  const night = hour >= 20 || hour <= 6;
  res.render("home", { user, night });
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  fs.appendFileSync("server/data/users.txt", `${username},${hashed}\n`);
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = fs.readFileSync("server/data/users.txt", "utf8").split("\n");
  const user = users.find(u => u.startsWith(username + ","));
  if (!user) return res.send("Користувача не знайдено");
  const [_, hash] = user.split(",");
  const match = await bcrypt.compare(password, hash.trim());
  if (match) {
    res.cookie("auth", username);
    res.redirect("/");
  } else {
    res.send("Невірний пароль");
  }
});

app.get("/comments", (req, res) => {
  const page = parseInt(req.query.page || "1");
  const perPage = 3;
  const all = fs.readFileSync("server/data/comments.txt", "utf8").split("\n").filter(Boolean);
  const paginated = all.slice((page - 1) * perPage, page * perPage);
  res.render("comments", { comments: paginated, page });
});

app.post("/comments", (req, res) => {
  const comment = req.body.comment;
  fs.appendFileSync("server/data/comments.txt", comment + "\n");
  res.redirect("/comments");
});

app.listen(3000, () => {
  console.log("Сервер запущено на http://localhost:3000");
});
