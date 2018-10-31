if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const app = express();
const Url = require("./models/url");
const bodyParser = require("body-parser");

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));


//Routes
app.get("/", (req, res) => {
  res.sendFile("views/index.html", { root: __dirname });
});

app.post("/api/shorturl/new", async (req, res) => {
  const urlToShorten = req.body.data;
  const data = await Url.findOne({ originalUrl: urlToShorten });
  if (data) {
    res.json({ original_url: urlToShorten, new_url: data.newUrl });
  } else {
    const urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    if (urlRegex.test(urlToShorten)) {
      const shortUrl = Math.floor(Math.random() * 100000).toString();
      const shortenedUrl = new Url({
        originalUrl: urlToShorten,
        newUrl: shortUrl
      });
      await shortenedUrl.save();
      res.send(`Your shortened URL is: ${shortUrl}`);
    } else {
      res.json({ error: "invalid URL" });
    }
  }
});

app.get("/:urlToRedirect", async (req, res, next) => {
  try {
    const { urlToRedirect } = req.params;
    const data = await Url.findOne({ newUrl: urlToRedirect });
    if (data) {
      const regex = new RegExp("^(http|https)://", "i");
      if (regex.test(data.originalUrl)) {
        res.redirect(301, data.originalUrl);
      } else {
        res.redirect(301, "http://" + data.originalUrl);
      }
    } else {
      res.send("No such url found");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = app;
