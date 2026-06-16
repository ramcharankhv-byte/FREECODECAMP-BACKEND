require("dotenv").config();
const bodyParser = require("body-parser");
let express = require("express");
let app = express();

app.use((req, res, next) => {
  const logString = `${req.method} ${req.path} - ${req.ip}`;
  console.log(logString);
  next(); // Passes control to the next handler so the server doesn't freeze
});

app.use(bodyParser.urlencoded({ extended: false }));
// Mount the express.static() middleware to the /public path
app.use("/public", express.static(__dirname + "/public"));
app.use("/json", express.json()).get("/json", (req, res) => {
  process.env.MESSAGE_STYLE === "uppercase"
    ? res.send({ message: "HELLO JSON" })
    : res.send({ message: "Hello json" });
});

app.get("/", (req, res) => {
  let absolutePath = __dirname + "/views/index.html";
  res.sendFile(absolutePath);
});

app.get(
  "/now",
  (req, res, next) => {
    let time = new Date().toString();
    req.time = time;
    next();
  },
  (req, res) => {
    res.send({ time: req.time });
  },
);

app.get("/:word/echo", (req, res) => {
  res.send({ echo: req.params.word });
});

app.get("/name", (req, res) => {
  const firstname = req.query.first;
  const lastname = req.query.last;
  res.json({ name: `${firstname} ${lastname}` });
});
app.post("/name", (req, res) => {
  // Use req.body because body-parser extracts form data into the body object
  const firstname = req.body.first;
  const lastname = req.body.last;

  res.json({ name: `${firstname} ${lastname}` });
});
module.exports = app;
