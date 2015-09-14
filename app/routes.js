let isLoggedIn = require('./middlewares/isLoggedIn')
let _ = require('lodash')
let Twitter = require('twitter')
let then = require('express-then')

let networks = {
  twitter: {
    network: {
      icon: 'facebook',
      name: 'Facebook',
      class: 'btn-primary'
    }
  }
}

module.exports = (app) => {
  let passport = app.passport
  let twitterConfig = app.config.auth.twitter

  // Your routes here... e.g., app.get('*', handler)
  app.get('/', (req, res) => res.render('index.ejs'))
 
  app.get('/timeline', isLoggedIn, then( async (req, res) => {
    try {
    // console.log(req.user)
    let twitterClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.secret
    }) 
    let [tweets] = await twitterClient.promise.get('statuses/home_timeline')
    
    tweets = tweets.map(tweet => {
      return {
        // id_str needs to be used to avoid truncation
        id: tweet.id_str,
        image: tweet.user.profile_image_url,
        text: tweet.text,
        name: tweet.user.name,
        username: '@'+tweet.user.screen_name,
        liked: tweet.favorited,
        network: networks.twitter
      }
    })

    res.render('timeline.ejs', {
      posts: tweets
    })
  } catch(e) {
    console.log(e)
  }
  }))

  app.get('/compose', isLoggedIn, (req, res) => res.render('compose.ejs', {
    message: req.flash('error')
  }))

  app.post('/compose', isLoggedIn, then(async (req, res) => {
    let twitterClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.secret
    }) 
    try {
      let status = req.body.text
      console.log('req.body - ', req.body)
      console.log('req.params - ', req.params)
      console.log('req.query - ', req.query)
      if (status.length > 140) {
        return req.flash('error', 'Status is over 140 characters!')
      }
      if (!status) {
        return req.flash('error', 'Status cannot be empty!')
      }
      await twitterClient.promise.post('statuses/update', {status})

      res.redirect('/timeline') 
    } catch (e) { 
      console.log(e)
    }
  }))

  app.post('/like/:id', isLoggedIn, then(async (req, res) => {
    try {
    var twitterClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.secret
    })

    var id = req.params.id
    await twitterClient.promise.post('favorites/create', {id})
    
    res.end()
  } catch(e) {
    console.log(e)
  }
  }))

  app.post('/unlike/:id', isLoggedIn, then(async (req, res) => {
    try {
    // console.log(req.user)  
    var twitterClient = new Twitter({
      consumer_key: twitterConfig.consumerKey,
      consumer_secret: twitterConfig.consumerSecret,
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.secret
    })

    var id = req.params.id
    await twitterClient.promise.post('favorites/destroy', {id})
    res.end()

    } catch(e) {
      console.log(e, id)
    }
  }))

  app.get('/profile', (req, res) => {
  	res.render('profile.ejs', {
  		user: req.user,
  		message: req.flash('error')
  	})
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs', {
    	message: req.flash('error')
    })
  })

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {
    	message: req.flash('error') 
    })
  })

  app.post('/login', passport.authenticate('local-login', {
  	successRedirect: '/profile',
  	failureRedirect: '/login',
  	failureFlash: true
  }))

  app.post('/signup', passport.authenticate('local-signup', {
  	successRedirect: '/profile',
  	failureRedirect: '/signup',
  	failureFlash: true
  }))

  // Scope specifies the desired data fields from the user account
	let scope = 'email'

  // TWITTER
  // Authentication route & Callback URL
  app.get('/auth/twitter', passport.authenticate('twitter', {scope}))

  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/profile',
      failureFlash: true
  }))

  // Authorization route & Callback URL
  app.get('/connect/twitter', passport.authorize('twitter', {scope}))
  
  app.get('/connect/twitter/callback', passport.authorize('twitter', {
      successRedirect: '/profile',
      failureRedirect: '/profile',
      failureFlash: true
  }))
}
