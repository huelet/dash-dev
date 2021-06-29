import express, { response } from "express";
import * as dotenv from 'dotenv';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const rateLimit = require("express-rate-limit");
const request = require('request');
const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
const multerAzure = require('mazure');
const { v1: uuidv1 } = require('uuid');
const cors = require('cors');
const axios = require("axios").default;
const SSH = require('simple-ssh');
import pug from 'pug';
import path from 'path';
import { auth, requiresAuth } from 'express-openid-connect';
const ssh = new SSH({
    host: process.env.HOSTURL,
    user: process.env.HOSTUNAME,
    pass: process.env.HOSTPWD
});
const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'https://huelet-dash-dev.herokuapp.com/',
    clientID: 'WZEqB5TB7eCsBjApsyJglUKNvqYxQkQG',
    issuerBaseURL: 'https://huelet-cc.us.auth0.com',
    secret: process.env.AUTH0_SECRET
  };
const limiter = new rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3
});
const containerName = "asset-" + uuidv1();
const uploadSettings = multer({
  storage: multerAzure({
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    account: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    key: process.env.AZURE_STORAGE_KEY,
    container: containerName
  })
});
const globalSasToken = "?sv=2020-02-10&ss=b&srt=sco&sp=r&se=3000-06-27T09:40:10Z&st=2021-06-27T01:40:10Z&sip=0.0.0.0-255.255.255.255&spr=https&sig=LDOCpb7z9CSWk2GkFNlalqVWOhdwmwn2pSBWbSBnVtM%3D";
const urlSafeSasToken = encodeURIComponent(globalSasToken);
app.use(auth(config));
app.use(cors());
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.resolve('public'));
app.get('/', (req: express.Request, res: express.Response) => {
  // I can't think of any good variable names so screw it
  const isAuthd = req.oidc.isAuthenticated()
  res.render('home', {
    isAuthd: isAuthd
  })
});
app.get('/ul', requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.render('upload')
});
app.get('/studio/uploadSuccess', requiresAuth(), (req: express.Request, res: express.Response) => {
  const videoUrl = req.query.cuurl;
  if (videoUrl === undefined) {
    res.json({ "error": "not all tokens were sent" })
  } else {
    res.render('success', { authorName: req.oidc.user.nickname })
  }
});
app.get('/studio/videos', requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.json({ "i'm still in development": "it's not ready yet" })
});
// Profile and settings
app.get(`/studio/me`, requiresAuth(), (req: express.Request, res: express.Response) => {
  const auth0id = req.oidc.user.sub;
  const uid = auth0id.replace("auth0|", "")
  res.render('profile', { pfp: req.oidc.user.picture, uname: req.oidc.user.nickname, email: req.oidc.user.email, uid: uid })
});
// Analytics (lord have mercy on my soul)
app.get(`/studio/analytics`, requiresAuth(), (_req: express.Request, res: express.Response) => {
  fetch('/api/videos/list/newest')
    .then(response => response.json())
    .then(encodedUrl => encodeURIComponent(encodedUrl.url))
  .then(urlEncoded => res.render('analytics', { analyticsUrl: urlEncoded }))
});
// APIS GALORE
app.get('/api/userdata', requiresAuth(), (req: express.Request, res: express.Response) => {
  res.json(req.oidc.user)
})
app.get('/api/userdata/uid', requiresAuth(), (req: express.Request, res: express.Response) => {
  const auth0id = req.oidc.user.sub;
  const uid = auth0id.replace("auth0|", "")
  res.json({ uid: uid })
})
app.get('/api/ul/cf', requiresAuth(), (req: express.Request, res: express.Response) => {
  const videoTitle = req.query.videotitle;
  const videoUrlEncoded: any = req.query.cuurl;
  const author = req.query.authortitle;
  const videoUrl = decodeURIComponent(videoUrlEncoded);
  console.log(videoUrl)
    const mailingAddress = req.oidc.user.email;
    if (videoTitle === undefined || author === undefined || videoUrlEncoded === undefined) {
        res.json({ error: 'not all tokens have been sent' })
    }
    ssh.exec(`cd /var/h && node cf.js --author "${author}" --title "${videoTitle}" --url "${videoUrl}"`, {
      out: function (stdout: any) {
          const strout = stdout.replace("\\n", "")
          res.json({ "pageUrl": strout })
        }
    }).start();
});
app.post('/api/ul/ul', requiresAuth(), uploadSettings.any(), (req: any, res: express.Response, _next: any) => {
  const vurl = req.files[0].url;
  const fullUrl = vurl + globalSasToken;
  const safeUrl = encodeURIComponent(fullUrl);
  console.log(safeUrl)
  res.status(200).redirect(`/studio/uploadSuccess?cuurl=${safeUrl}&webauthor=${req.oidc.user.nickname}`)
});
app.get(`/api/videos/list/newest`, requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.json({ "url": "https://huelet.net/w/pe3KhC40rENCtYcV/" });
});
app.get('/api/profiledata/nickname', requiresAuth(), (req: express.Request, res: express.Response) => {
  const requestedNickname = req.query.nick
  const options = {
    method: 'PATCH',
    url: `https://huelet-cc.us.auth0.com/api/v2/users/${req.oidc.user.sub}`,
    headers: {authorization: `Bearer ${process.env.AUTH0_BEARER}`, 'content-type': 'application/json'},
    data: {nickname: requestedNickname, name: requestedNickname}
  };
  axios.request(options).then(function (response: { data: any; }) {
    res.redirect('/studio/me?uname=success')
  }).catch(function (error: any) {
    console.error(error);
  });
})
app.post('/api/profiledata/pfp/upload', requiresAuth(), (req: express.Request, res: express.Response) => {
  
})
// Flows
app.get("/flow/dash/my", requiresAuth(), (req: any, res: any) => {
  const auth0id = req.oidc.user.sub;
  const uid = auth0id.replace("auth0|", "");
  res.redirect(`/studio/me`);
});
app.get("/flow/dash/my/settings", requiresAuth(), (req: any, res: any) => {
  const auth0id = req.oidc.user.sub;
  const uid = auth0id.replace("auth0|", "");
  res.redirect(`/studio/me/settings`);
});
app.get("/flow/dash/my/videos", requiresAuth(), (req: any, res: any) => {
  const auth0id = req.oidc.user.sub;
  const uid = auth0id.replace("auth0|", "");
  res.redirect(`/studio/videos`);
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}, available at http://localhost:${port}`)
});