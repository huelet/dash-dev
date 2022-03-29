import express from "express";
import path from "path";
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;
const rateLimit = require("express-rate-limit");
const multer = require('multer');
const multerAzure = require('mazure');
const fetch = require('node-fetch');
const poke = require('js.poke');
const { v1: uuidv1 } = require('uuid');
const cors = require('cors');
const axios = require("axios").default;
const versionData = require('./verdata.json')
const { useID } = require('@dothq/id');
const { MeiliSearch } = require('meilisearch');
import pug from 'pug';
// Search init
const search = new MeiliSearch({ host: 'https://search.huelet.net/', apiKey: '9941c5593840a732623257300eedf439f95a53d3c592a2e1e4ab143f86f25a24' });
const limiter = new rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.resolve('public'));
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, available at http://localhost:${PORT}`)
});