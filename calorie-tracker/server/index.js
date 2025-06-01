const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();


const commentApi = require("./api/comments");
const userApi = require("./api/user");
const summaryApi = require("./api/summary");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/comments", commentApi);
app.use("/api/user", userApi);
app.use("/api/summary", summaryApi);

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});

app.get("/", (req, res) => {
  res.send("Сервер працює. Перейдіть на /api/comments або /api-docs");
});



const path = require("path");
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
