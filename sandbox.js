const Twit = require('twit')
const axios = require('axios')
const token = require('./_keys/API_KEYS')

// twit config for twitter api auth
const t = new Twit({
  consumer_key: token.consumer_key,
  consumer_secret: token.consumer_secret,
  access_token: token.access_token,
  access_token_secret: token.access_token_secret
})
// handler required by AWS Lambda
exports.handler = async event => {
  const city = 'berlin' // todo: passing city with the event: event.data.city ?
  const fetchPollutionData = async () => {
    const result = await axios.get(
      `https://api.waqi.info/feed/${city}/?token=${token.WAQI_TOKEN}`
    )
    return result.data
  }

  const asyncStatusHanlder = await fetchPollutionData().then(response => {
    const cityName = response.data.city.name
    const aqi = JSON.stringify(response.data.aqi)

    // check if data exists
    let pm25 = null
    response.data.iaqi.pm25
      ? (pm25 = 'PM₂₅ - ' + JSON.stringify(response.data.iaqi.pm25.v))
      : null

    let pm10 = null
    response.data.iaqi.pm10
      ? (pm10 = 'PM₁₀ - ' + JSON.stringify(response.data.iaqi.pm10.v))
      : null

    let o3 = null
    response.data.iaqi.o3
      ? (o3 = 'O₃ - ' + JSON.stringify(response.data.iaqi.o3.v))
      : null

    // renaming for dominent pollutant
    const dominentpol =
      response.data.dominentpol === 'pm25'
        ? 'PM₂₅'
        : response.data.dominentpol === 'pm10'
        ? 'PM₁₀'
        : response.data.dominentpol === 'o3'
        ? 'O₃'
        : response.data.dominentpol === 'no2'
        ? 'NO₂'
        : null

    // procedural messages
    let apl = 'Good 💚'
    let message = `air quality is considered satisfactory, and air pollution poses little or no risk`
    if (response.data.aqi > 50) {
      apl = 'Moderate 💛'
      message = `air quality is acceptible, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution`
    } else if (response.data.aqi > 100) {
      apl = 'Unhealthy for Sensitive 🧡'
      message = `members of sensitive groups may experience health effects. The general public is not likely to be affected`
    } else if (response.data.aqi > 150) {
      apl = 'Unhealthy 🤎'
      message =
        'everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects'
    } else if (response.data.aqi > 200) {
      apl = 'Very Unhealthy 🖤'
      message =
        'health warnings of emergency conditions. The entire population is more likely to be affected'
    } else if (response.data.aqi > 300) {
      apl = 'Hazardous 💀'
      message =
        'health alert: everyone may experience more serious health effects'
    }

    // final status message assembly
    let statusMessage =
      `${cityName} - ${message}. Main pollutant is ${dominentpol}\n` +
      `
          Air Quality Index - ${aqi} | ${apl}
          ------`

    if (pm25) {
      statusMessage =
        statusMessage +
        `
        ${pm25}`
    }
    if (pm10) {
      statusMessage =
        statusMessage +
        `
          ${pm10}`
    }
    if (o3) {
      statusMessage =
        statusMessage +
        `
          ${o3}`
    }

    // post status to twitter
    const asyncPostTweet = async () => {
      const asyncTweetResponse = await t.post(
        'statuses/update',
        { status: statusMessage },
        (err, data, response) => {
          console.log('\n\n TWITTER DATA RESPONSE:\n', data)
          // console.log('\n\n TWITTER HTTP RESPONSE:\n', response)
          console.log('\n\n TWITTER ERROR RESPONSE:\n', err)
        }
      )
      return asyncTweetResponse
    }
    return asyncPostTweet()
  })
  return asyncStatusHanlder
}
