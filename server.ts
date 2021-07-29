import express, { response } from "express";
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const rateLimit = require("express-rate-limit");
const multer = require('multer');
const multerAzure = require('mazure');
const fetch = require('node-fetch');
const { v1: uuidv1 } = require('uuid');
const cors = require('cors');
const axios = require("axios").default;
const versionData = require('./verdata.json')
const { useID } = require('@dothq/id');
const { Sequelize } = require('sequelize');
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://wasvkbhhiswaurtgvmph.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI2OTIzNTI4LCJleHAiOjE5NDI0OTk1Mjh9.61EQEJJjSygJMFGHWPK7em1oUIzRYAen1VgM_Clt3cY')
const sql = new Sequelize(`postgres://postgres:${process.env.SUPABASE_DB_PASSWORD}@db.wasvkbhhiswaurtgvmph.supabase.co:5432/postgres`)
import pug from 'pug';
import path from 'path';
import { auth, requiresAuth } from 'express-openid-connect';
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
const profileContainerName = "profile-" + uuidv1();
const uploadSettings = multer({
  storage: multerAzure({
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    account: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    key: process.env.AZURE_STORAGE_KEY,
    container: containerName
  })
});
const profileUploadSettings = multer({
  storage: multerAzure({
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    account: process.env.AZURE_STORAGE_ACCOUNT_NAME,
    key: process.env.AZURE_STORAGE_KEY,
    container: profileContainerName
  })
});
const globalSasToken = "?sv=2020-02-10&ss=b&srt=sco&sp=r&se=3000-06-27T09:40:10Z&st=2021-06-27T01:40:10Z&sip=0.0.0.0-255.255.255.255&spr=https&sig=LDOCpb7z9CSWk2GkFNlalqVWOhdwmwn2pSBWbSBnVtM%3D";
const urlSafeSasToken = encodeURIComponent(globalSasToken);
const appVersion = `Huelet Dashboard running beta, v${versionData.version}`;
app.use(auth(config));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);
app.set('view engine', 'pug');
app.set('views', path.resolve('public'));
// DB stuff
try {
  sql.authenticate();
  console.log('✔️  DB works');
} catch (error) {
  console.error('❌  DB error: ', error);
}
// ok now we have a db, lets start the API
app.get('/', (req: express.Request, res: express.Response) => {
  // I can't think of any good variable names so screw it
  const isAuthd = req.oidc.isAuthenticated()
  res.render('home', {
    isAuthd: isAuthd
  })
});
app.get('/ul', requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.render('upload', { versionData: appVersion })
});
app.get('/studio/uploadSuccess', requiresAuth(), (req: express.Request, res: express.Response) => {
  const videoUrl = req.query.cuurl;
  if (videoUrl === undefined) {
    res.json({ "error": "not all tokens were sent" })
  } else {
    res.render('success', { authorName: req.oidc.user.nickname, versionData: appVersion })
  }
});
app.get('/test-nv', (_req: express.Request, res: express.Response) => {
  res.render('test-nv', { versionData: appVersion })
});
app.get('/studio/videos', requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.json({ "i'm still in development": "it's not ready yet" })
});
// Easter eggs
app.get('/%F0%9F%98%89', (_req: express.Request, res: express.Response) => {
  res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
})
// Profile and settings
app.get(`/studio/me`, (req: express.Request, res: express.Response) => {
  res.render('profile')
});
// Analytics (lord have mercy on my soul)
app.get(`/studio/analytics`, requiresAuth(), (_req: express.Request, res: express.Response) => {
  fetch('/api/videos/list/newest')
    .then((response: { json: () => any; }) => response.json())
    .then((encodedUrl: { url: string | number | boolean; }) => encodeURIComponent(encodedUrl.url))
  .then((urlEncoded: any) => res.render('analytics', { analyticsUrl: urlEncoded, versionData: appVersion }))
});

app.get('/studio/profile', requiresAuth(), (req: express.Request, res: express.Response) => {

})
app.get('/studio/profile/create', requiresAuth(), (req: express.Request, res: express.Response) => {

})
app.get('/studio/profile/edit', requiresAuth(), (req: express.Request, res: express.Response) => {
  res.render('profile-edit', { pfp: req.oidc.user.picture, uname: req.oidc.user.nickname, email: req.oidc.user.email, uid: req.oidc.user.sub.replace("auth0|", ""), versionData: appVersion })
})
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
  const finalUrl = videoUrl.replace("hueletvideostorage.blob.core.windows.net", "videos.cdn.huelet.net");
    if (videoTitle === undefined || author === undefined || videoUrlEncoded === undefined) {
        res.json({ error: 'not all tokens have been sent' })
  }
  const rUrl = "https://www.random.org/strings/?num=1&len=16&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new"
  fetch(rUrl).then((res: { text: () => any; }) => res.text()).then((text: string) => text.replace('\n', '')).then((text: any) => sql.query(`INSERT INTO vdata (uvid, vtitle, vurl, vauthor)\nVALUES (${text}, ${videoTitle}, ${finalUrl}, ${author})`));
});
app.post('/api/ul/ul', requiresAuth(), uploadSettings.any(), (req: any, res: express.Response, _next: any) => {
  const vurl = req.files[0].url;
  const fullUrl = vurl + globalSasToken;
  const safeUrl = encodeURIComponent(fullUrl);
  console.log(safeUrl)
  res.status(200).send(`/studio/uploadSuccess?cuurl=${safeUrl}&webauthor=${req.oidc.user.nickname}&token=${useID()}`)
});
app.get(`/api/videos/list/newest`, requiresAuth(), (_req: express.Request, res: express.Response) => {
  res.json({ "url": "https://huelet.net/w/pe3KhC40rENCtYcV/" });
});
app.post('/api/videos/list/new', (req: express.Request, res: express.Response) => {
  const newUrl = req.body.url;
  const newTitle = req.body.title;
  const currentAuthor = req.body.author;
  const id = newUrl.replace('https://huelet.net/w/', '/', '');
  sql.query(`INSERT INTO videos ("url", "title", "author")\nVALUES ("${id}", "${newUrl}", "${newTitle}", "${currentAuthor}");`);
});
app.get('/api/getoken', requiresAuth(), (req: express.Request, res: express.Response) => {
  var options = {
    method: 'POST',
    url: 'https://huelet-cc.us.auth0.com/oauth/token',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    data: {
      client_id: 'mdSjmpL4COkVNxju2LcmR5tExF6vmGT9',
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: 'https://huelet-cc.us.auth0.com/api/v2/'
    }
  };
  
  axios.request(options).then(function (response: { data: any; }) {
    res.send(response.data);
    console.log(response.data);
  }).catch(function (error: any) {
    res.send(error);
    console.error(error);
  });
})
app.get('/api/profiledata/nickname', requiresAuth(), (req: express.Request, res: express.Response) => {
  const requestedNickname = req.query.nick
  const options = {
    method: 'PATCH',
    url: `https://huelet-cc.us.auth0.com/api/v2/users/${req.oidc.user.sub}`,
    headers: { authorization: `Bearer ${process.env.AUTH0_BEARER}`, 'content-type': 'application/json' },
    data: { nickname: requestedNickname, name: requestedNickname }
  };
  axios.request(options).then(function (response: { data: any; }) {
    res.redirect(`/studio/me?uname=success&token=${useID()}`)
  }).catch(function (error: any) {
    console.error(error);
  });
});
app.post('/api/profiledata/tripleauth/enable', uploadSettings.any(), requiresAuth(), (req: any, res: express.Response) => {
  const tauthToken = useID();
  const tauthNumber = req.body.taunum;
  const options = {
    method: 'PATCH',
    url: `https://huelet-cc.us.auth0.com/api/v2/users/${req.oidc.user.sub}`,
    headers: {authorization: `Bearer ${process.env.AUTH0_BEARER}`, 'content-type': 'application/json'},
    data: { user_metadata: { triple_auth_token: tauthToken, triple_auth_number: tauthNumber, triple_auth_enabled: true } }
  }
  axios.request(options).then(function (response: { data: any; }) {
    res.send("success");
  }).catch(function (error: any) {
    res.send(error);
    console.error(error);
  });
});
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