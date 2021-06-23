import { requiresAuth, auth } from "express-openid-connect";

module.exports = requiresAuth(), (req: any, res: any) => {
    const auth0id = req.oidc.user.sub;
    const uid = auth0id.replace("auth0|", "");
    res.redirect(`/studio/videos`, { uid: uid });
};