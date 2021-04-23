import passport from "passport";
import passportjwt from "passport-jwt";
import user from "../users/user.model";
import dotenv from "dotenv";
dotenv.config();
const JwtStrategy = passportjwt.Strategy;
const ExtractJwt = passportjwt.ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.privateKey;
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    user.findOne({ id: jwt_payload.sub }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user); // req.user
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);
export default passport;
