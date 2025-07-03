const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const attendeeRepositories = require('../Module/user/Repositories/attendee.repositories');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   callbackURL: "/auth/google/callback"
    callbackURL: "http://localhost:3005/user/auth/google/callback"

},
    async function (accessToken, refreshToken, profile, done) {
        try {
            const email = profile.emails[0].value;
            let user = await attendeeRepositories.existattendee(email);

            if (!user) {
                const newUser = {
                    first_name: profile.name.givenName,
                    last_name: profile.name.familyName,
                    email,
                    password: null,
                    isdelete: false,
                };
                user = await attendeeRepositories.adddata(newUser);
            }

            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await attendeeRepositories.findbyid({}, id);
    done(null, user);
});
