import express, { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { insertUser } from '../utils/insert-user';

const router = express.Router();
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.EXPRESS_SERVER_URL}/api/auth/google/callback`,
},
async (accessToken, refreshToken, profile, done) => {
  console.log("logging in...");
  const email = profile.emails?.[0]?.value;
  const username = profile.displayName;
  const photoUrl = profile.photos?.[0]?.value;
  if(!email) return done(new Error('No email found in Google profile'));
  const dbUser= await insertUser(email);
  console.log("dbUser: ", dbUser);
  if(!dbUser) return done(new Error('Error logging in'));
  const userstore= {
    dbUser,
    username,
    photoUrl
  }

  return done(null, userstore);
}));

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failed' }),
  (req: Request, res: Response) => {
    const user = req.user as any
    
    const role = user?.dbUser?.role || 'user';

    // Comment for Demo
    // const redirectURL =
    //   role === 'admin'
    //     ? `${process.env.FRONTEND_URL}/admin/analytics`
    //     : `${process.env.FRONTEND_URL}/home`;

    // only direct to home for demo
    const redirectURL= `${process.env.FRONTEND_URL}/home`;

    res.redirect(redirectURL);
  }
);

router.get('/me', (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    console.log("User is authenticated");
    res.status(200).json({ user: req.user });
  } else {
    console.log("User is NOT authenticated");
    res.status(401).send("Not Authenticated");
  }
});

router.get('/signout', (req, res) => {
  console.log("signing out");
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).send("Signout failed");
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Signed out successfully' });
  });
});

export default router;
