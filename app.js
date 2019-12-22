const axios = require("axios");

const token = undefined;
let city = "berlin";
const fetchData = async () => {
  const result = await axios
    .get(`https://api.waqi.info/feed/${city}/?token=${token}`)
    return result
};

fetchData().then(response => {
    console.log('LAST', JSON.stringify(response.data))
})

const config = axios.create({
  authorization: 
    oauth_consumer_key="CONSUMER_API_KEY",
    oauth_nonce="OAUTH_NONCE",
    oauth_signature="OAUTH_SIGNATURE",
    oauth_signature_method="HMAC-SHA1",
    oauth_timestamp="OAUTH_TIMESTAMP",
    oauth_token="ACCESS_TOKEN",
    oauth_version="1.0"
})

const date = await config.post('https://api.twitter.com/1.1/statuses/update.json')