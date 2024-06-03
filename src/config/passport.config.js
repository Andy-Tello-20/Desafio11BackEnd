import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../dao/models/user.model.js'
import config from './config.js'
import {logger} from '../utils.js'

const jwt_secret = config.jwtSecret
const clienteID= config.gitHubClientId
const clienteSecret = config.gitHubSecret

export const init = () => {
  const registerOpts = {
    usernameField: 'email',
    passReqToCallback: true,
  }

  const githubOpts = {
    clientID: clienteID,
    clientSecret: clienteSecret,
    callbackURL: 'http://localhost:8080/api/sessions/github/callback',
  }
  passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {

    const email = profile._json.email

    logger.debug(`email es: ,${email}`)
  

    let user = await UserModel.findOne({ email })
    if (user) {
      return done(null, user)
    }
    user = {
      first_name: profile._json.name,
      last_name: '',
      email, 
      password: '',
      provider: 'github',
      providerId: profile.id,
      age: 18,
    };
    const newUser = await UserModel.create(user)
    done(null, newUser)
  }));

  const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
      token = req.cookies['access_token']
    }
 
    return token
  }

  passport.use('current', new JwtStrategy({
    secretOrKey: jwt_secret,
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  }, (payload, done) => {
    logger.debug(`payload es: ,${JSON.stringify(payload,null,2)}`)
    done(null, payload)
  }))
} 

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (uid, done) => {
  const user = await UserModel.findById(uid)
  done(null, user)
})
