const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const avatar = profile.photos?.[0]?.value || '';

        const user = await User.findOneAndUpdate(
          { googleId: profile.id },
          {
            $setOnInsert: {
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatar,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return done(null, user); // everything went perfectly , here is the user we found
      } catch (err) {
        return done(err, null); // something crashed , login failed
      }
    }
  )
);

module.exports = passport;
