const Twit = require('twit')
const axios = require('axios')
const token = require('./_keys/API_KEYS')

// twit config for twitter api auth
const t = new Twit({
  consumer_key: token.consumer_key,
  consumer_secret: token.consumer_secret,
  access_token: token.access_token,
  access_token_secret: token.access_token_secret
  // timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  // strictSSL:            true,     // optional - requires SSL certificates to be valid.
})

// fetch pollution data
const city = 'berlin'
const fetchData = async () => {
  const result = await axios.get(
    `https://api.waqi.info/feed/${city}/?token=${token.WAQI_TOKEN}`
  )
  return result.data
}

fetchData().then(response => {
  const cityName = response.data.city.name
  const aqi = JSON.stringify(response.data.aqi)
  const dominentpol = response.data.dominentpol
  const pm10 = JSON.stringify(response.data.iaqi.pm10.v)

  const statusMessage = `
    ${cityName}
    Air Quality Index: ${aqi} (Good 💚)
    Main Pollutant: ${dominentpol}
    PM10 : ${pm10}`

  // post to twitter
  t.post('statuses/update', { status: statusMessage }, function(
    err,
    data,
    response
  ) {
    console.log('DATA:', data)
    // console.log('RESPONSE:', response)
    // console.log('ERROR:', err)
  })
})

// DUMMY POLLUTION DATA TREE
// {
//   "status": "ok",
//   "data": {
//     "aqi": 29,
//     "idx": 6132,
//     "attributions": [
//       {
//         "url": "http://www.stadtentwicklung.berlin.de/umwelt/luftqualitaet/",
//         "name": "Berlin Air Quality - (Luftqualität in Berlin)"
//       },
//       { "url": "https://waqi.info/", "name": "World Air Quality Index Project" }
//     ],
//     "city": {
//       "geo": [52.5200066, 13.404954],
//       "name": "Berlin, Germany",
//       "url": "https://aqicn.org/city/germany/berlin"
//     },
//     "dominentpol": "pm10",
//     "iaqi": {
//       "no2": { "v": 23.4 },
//       "o3": { "v": 2.9 },
//       "p": { "v": 990.9 },
//       "pm10": { "v": 29 },
//       "t": { "v": 4.4 },
//       "w": { "v": 7.5 }
//     },
//     "time": { "s": "2019-12-22 19:00:00", "tz": "+01:00", "v": 1577041200 },
//     "debug": { "sync": "2019-12-23T03:37:46+09:00" }
//   }
// }
