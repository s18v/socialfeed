let isLoggedIn = require('./middlewares/isLoggedIn')

module.exports = (app) => {
  let passport = app.passport
  
  // Your routes here... e.g., app.get('*', handler)
  app.get('/', (req, res) => res.render('index.ejs'))

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
  
  // FACEBOOK
	// Authentication route & Callback URL
	app.get('/auth/facebook', passport.authenticate('facebook', {scope}))

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	    successRedirect: '/profile',
	    failureRedirect: '/profile',
	    failureFlash: true
	}))

	// Authorization route & Callback URL
	app.get('/connect/facebook', passport.authorize('facebook', {scope}))
	
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
	    successRedirect: '/profile',
	    failureRedirect: '/profile',
	    failureFlash: true
	}))
}
