let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')
let FacebookStrategy = require('passport-facebook').Strategy
let TwitterStrategy = require('passport-twitter').Strategy

require('songbird')

function useExternalPassportStrategy(OauthStrategy, config, field) {

  config.passReqToCallback = true
  passport.use(new OauthStrategy(config, nodeifyit(authCB, {spread: true})))

  async function authCB(req, token, _ignored_, account) {
    let user;
    let id = account.id

    user = await User.promise.findOne({id})
    if (user !== null) return user

    user = new User()
    console.log('user ', user)

    user.twitter.id = account.id
    user.twitter.token = token
    user.twitter.username = account.username
    user.twitter.displayName = account.displayName
    try {
      await user.save() 
    } catch(e) {
      console.log(e)
    }
    return user
  }
}

function configure(config) {
  // Required for session support / persistent login sessions
  passport.serializeUser(nodeifyit(async (user) => user._id ))

  passport.deserializeUser(nodeifyit(async (id) => {
    return await User.promise.findById(id) 
  }))

  passport.use('local-login', new LocalStrategy({
    userNameField: 'username',
    failureFlash: true
  }, nodeifyit(async (username, password) => {
    let user;

    let email = username.toLowerCase()
    user = await User.promise.findOne({email})
    if (!user || username !== user.local.email) {
      return [false, {message: 'Invalid Email'}]
    }

    if (!await user.validatePassword(password)) {
      return [false, {message: 'Invalid password'}]
    }
    return user
  }, {spread: true})))

  passport.use('local-signup', new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'email',
    failureFlash: true,
    passReqToCallback: true
  }, nodeifyit (async (req, email, password) => {
      email = (email || '').toLowerCase()
      // Is the email taken?
      if (await User.promise.findOne({email})) {
        return [false, {message: 'That email is already taken.'}]
      }
      // create the user
      let user = new User()
      console.log('email - ', email)
      user.local.email = email
      user.local.password = password
      console.log('user.local.email - ', email)
      try{
        callback(null, user.save())
      } catch(e) {
        console.dir(e)
      }
  }, {spread: true})))

  useExternalPassportStrategy(FacebookStrategy, {
      clientID: config.facebook.consumerKey,
      clientSecret: config.facebook.consumerSecret,
      callbackURL: config.facebook.callbackUrl
  }, 'facebook')

   useExternalPassportStrategy(TwitterStrategy, {
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackUrl
  }, 'twitter')
  return passport
}



// pass back passport obj and configure method
module.exports = {passport, configure}
