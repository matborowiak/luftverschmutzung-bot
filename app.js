const axios = require('axios');
const token = require('./_keys/API_KEYS')


// FETCH POLLUTION DATA
const city = 'berlin';
const fetchData = async () => {
  const result = await axios
    .get(`https://api.waqi.info/feed/${city}/?token=${token.WAQI_TOKEN}`)
    return result
};

fetchData().then(response => {
    console.log('LAST', JSON.stringify(response.data))
})

// PROCESS POLLUTION DATA


// POST TO TWITTER
const Twit = require('twit')

const t = new Twit({
  consumer_key:         token.consumer_key,
  consumer_secret:      token.consumer_secret,
  access_token:         token.access_token,
  access_token_secret:  token.access_token_secret,
  // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

// t.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//   console.log('DATA:', data)
//   // console.log('RESPONSE:', response)
//   // console.log('ERROR:', err)
// })