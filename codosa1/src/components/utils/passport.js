//import passport from "passport";
import passportJwt from "passport-jwt";
import user from "../users/user.model";
import staff from "../staffs/staff.model";
import manager from "../storeManager/manager.model"
import dotenv from "dotenv";
import passport from "passport";
dotenv.config();
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

  let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.privateKey;

  passport.use('user',
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


  passport.use('staff',
    new JwtStrategy(opts, function (jwt_payload, done) {
      staff.findOne({ id: jwt_payload.sub }, function (err, user) {
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



    passport.use('manager',
      new JwtStrategy(opts, function (jwt_payload, done) {
        manager.findOne({ id: jwt_payload.sub }, function (err, user) {
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
  




export default {passport};
