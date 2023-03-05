const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");

const passport = require("./passport/setup");
const auth = require("./routes/auth");

require("dotenv").config();

const app = express();
const PORT = 5000;
const MONGO_URL = `mongodb+srv://Swiichy:${process.env.PASSWORD_DB}.smgvwth.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log(`MongoDB Connected ${MONGO_URL}`))
  .catch((err) => console.log(err));

// Bodyparser middleware, extented false does not allow nested payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGO_URL }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", auth);
app.get("/", (req, res) => res.send("Good monring sunshine!"));

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
