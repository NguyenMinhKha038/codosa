//import passport from "passport";
import passportJwt from "passport-jwt";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model";
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const model = [user,staff,manager];
let option = {};
option.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
option.secretOrKey = process.env.privateKey;
passport.use(
  "user",
  new JwtStrategy(option, function (jwt_payload, done) {
    const role = jwt_payload.role;
    model[role].findOne({ _id: jwt_payload._id }, function (err, user) {
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


export default { passport };
