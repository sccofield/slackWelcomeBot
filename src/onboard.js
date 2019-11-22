const qs = require('querystring');
const axios = require('axios');

const apiUrl = 'https://slack.com/api';


const welcomeMessage = (teamId, userId) => {
  const message = {
    token: process.env.SLACK_ACCESS_TOKEN,
    link_names: true,
    text:  `Hey <@${userId}>, Welcome to the KodeHauz Community team! We're glad you're here. Kindly introduce yourself in this channel and feel free to explore other channels`,
    as_user: true,
    channel: 'CME5V9Z3K'
  };

  axios.post(`${apiUrl}/chat.postMessage`, qs.stringify(message))
    .then((result => {
      console.log(result.data);
    }));
}


module.exports = { welcomeMessage };
