import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { insertUser } from '../utils/insert-user';
const router = express.Router();
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});
// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.EXPRESS_SERVER_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    if (!email)
        return done(new Error('No email found in Google profile'));
    const user = await insertUser(email);
    if (!user)
        return done(new Error('Error logging in'));
    return done(null, user);
}));
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-failed' }), (req, res) => {
    const user = req.user;
    const role = user?.role || 'user';
    const redirectURL = role === 'admin'
        ? `${process.env.FRONTEND_URL}/admin/analytics`
        : `${process.env.FRONTEND_URL}/home`;
    res.redirect(redirectURL);
});
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ user: req.user });
    }
    else {
        res.status(401).send("Not Authenticated");
    }
});
router.get('/signout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send("Signout failed");
        }
        // clear cookie
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Signed out successfully' });
    });
});
export default router;
