import express from "express";
import path from "path";
const app = express();
const PORT = process.env.PORT || 3000;
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const axios = require("axios").default;
const versionData = require("./verdata.json");
const { MeiliSearch } = require("meilisearch");
import pug from "pug";
require("dotenv").config();
// Search init
const search = new MeiliSearch({
  host: "https://search.huelet.net/",
  apiKey: "9941c5593840a732623257300eedf439f95a53d3c592a2e1e4ab143f86f25a24",
});
const limiter = new rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.set("view engine", "pug");
app.set("views", path.resolve("public"));

app.get("/", (req: express.Request, res: express.Response) => {
  if (!req.cookies._hltoken) {
    res.render("home", {
      version: versionData.version,
    });
    return
  } else if (req.cookies._hltoken) {
    res.redirect("/studio/profile");
  }
});
app.get("/flow/in", (req: express.Request, res: express.Response) => {
  if (!req.cookies._hltoken) {
    res.render("login", {
      version: versionData.version,
    });
    return
  } else if (req.cookies._hltoken) {
    res.redirect("/studio/profile");
  }
});
app.get("/studio/profile", (req: express.Request, res: express.Response) => {
  
})
app.get("/studio/upload", (req: express.Request, res: express.Response) => {
  if (!req.cookies._hltoken) {
    res.redirect("/");
  } else if (req.cookies._hltoken) {
    res.render("upload", {
      version: versionData.version,
    });
  }
})

app.listen(PORT, () => {
  console.log(
    `Server listening on port ${PORT}, available at http://localhost:${PORT}`
  );
});
