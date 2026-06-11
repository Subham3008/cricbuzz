import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import env from '../config/env.js';
import userModel from '../models/user.model.js';

export default function googleOAuthMiddleware(app) {
  // Initialize passport
  app.use(passport.initialize());

  // Configure Google OAuth strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLEINT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET_KEY,
        callbackURL: env.GOOGLE_CLIENT_URL,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          // Find or create user from Google profile
          // const user = await userModel.findOne(...);

          return cb(null, profile);
        } catch (error) {
          return cb(error, null);
        }
      }
    )
  );
}