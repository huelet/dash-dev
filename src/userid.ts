import express, { response } from "express";
import { auth, requiresAuth } from 'express-openid-connect';

module.exports = requiresAuth(), (req: express.Request, res: express.Response) => {
    const auth0id = req.oidc.user.sub;
    const uid = auth0id.replace("auth0|", "")
    res.json({ uid: uid })
}