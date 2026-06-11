import express from 'express';
import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import passport from 'passport';

const router = express.Router();

// Redirect user to Google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    // Generate JWT for authenticated user
    const token = jwt.sign(
      { id: req.user._id },
      env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return res.status(200).json({
      success: true,
      token,
    });
  }
);

router.get('/', (req, res) => {
  res.send('connected');
});

export default router;