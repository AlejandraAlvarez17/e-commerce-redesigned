const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const UserModel = require("../models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const initializePassport = () => {
    // Creamos la estrategia para el Registro de usuarios:
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            let user = await UserModel.findOne({ email });
            if (user) return done(null, false);

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }));

    // Creamos la estrategia para el Login de Usuarios:
    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("Este usuario no existeeee ehhhh rescatateeee barrilete");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serializar usuarios:
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    });

    // Estrategia de GitHub:
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.c27064b9d23e7f55",
        clientSecret: "b54bc86337b7f94e0dec336468a956eeeb2e12ae",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await UserModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "Usuario",
                    age: 36,
                    email: profile._json.email,
                    password: "hackeamesipodes",
                }
                let result = await UserModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

module.exports = initializePassport;
