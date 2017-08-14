var Twit = require('twit');
require('dotenv').config()


var T = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET,
  timeout_ms:           60*1000
})

// replace the query string with a function (permute) that returns a string
// this basically means every tweet will have one word from each tier below

let keywords = ['hire', 'hiring', 'opening'];
let jobs = ['developer', 'software engineer'];
let locater = ['node', 'react', 'angular', 'junior', 'entry', 'jr', 'new york', 'nyc', 'javascript', 'los angeles', 'seattle', 'chicago', 'austin'];

let permute = function(arr1, arr2, arr3) {
  let ans = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      for (let k = 0; k < arr3.length; k++) {
        ans.push(arr1[i] + ' ' + arr2[j] + ' ' + arr3[k]);
      }
    }
  }
  return ans.join(',');
}

let stream = T.stream('statuses/filter', { track: [permute(locater,keywords,jobs)]});

stream.on('connect', function (request) {
  console.log('trying to connect')
});

stream.on('connected', function (request) {
  console.log('logged in')
});

stream.on('tweet', function(tweet) {
  let user = tweet.user.screen_name;
  let id = tweet.id_str;
  let retweeted = tweet.is_quote_status;
  let url = 'https://www.twitter.com/' + user + '/status/' + id;
  if (user !== 'cooldevjobs' || !retweeted) {
      T.post('statuses/update', { status: url}, function(err, data, response) {
        console.log(data);
      });
  }
});
