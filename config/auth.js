// config/auth.js
module.exports = {
  'development': {
    'twitter': {
      'consumerKey': 'a7hQnETVHEz0aIHdRBWxgVWcg',
      'consumerSecret': 'CP8JjHuGvKxask4rgA50a0mH72bevNgpi9XZTZ7T3Uc2G7x70d',
      'callbackUrl': 'http://socialfeed.com:2000/auth/twitter/callback'
    },
    'facebook': {
      'consumerKey': '831332316981573',
      'consumerSecret': '89ffdd3fa9a64ab7ea98dad0dc46f691',
      'callbackUrl': 'http://socialfeed.com:2000/auth/facebook/callback'
    },
    'google': {
      'consumerKey': '446585441765-unda5mjs6307q1pqobvhiqj87m9m2kh1.apps.googleusercontent.com',
      'consumerSecret': '...',
      'callbackUrl': 'http://social-authenticator.com:8000/auth/google/callback'
    }
  },
  'testing': {

  },
  'production': {
    
  }
}
