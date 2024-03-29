require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const onboard = require('./onboard');
const signature = require('./verifySignature');

const app = express();

/*
 * Parse application/x-www-form-urlencoded && application/json
 * Use body-parser's `verify` callback to export a parsed raw body
 * that you need to use to verify the signature
 */

const rawBodyBuffer = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

app.use(bodyParser.urlencoded({verify: rawBodyBuffer, extended: true }));
app.use(bodyParser.json({ verify: rawBodyBuffer }));

app.get('/', (req, res) => {
  res.send('<h2>The slack welcome bots is running</h2>');
});

/*
 * Endpoint to receive events from Slack's Events API.
 * It handles `team_join` event callbacks.
 */
app.post('/events', (req, res) => {
  switch (req.body.type) {
    case 'url_verification': {
      // verify Events API endpoint by returning challenge if present
      res.send({ challenge: req.body.challenge });
      break;
    }
    case 'event_callback': {
      // Verify the signing secret
      if (signature.isVerified(req)) {
        const event = req.body.event;
        console.log(event);
        
        // `team_join` is fired whenever a new user (incl. a bot) joins the team
        if (event.type === 'team_join' && !event.is_bot) {
          const { team_id, id } = event.user;
          onboard.welcomeMessage(team_id, id);
        }

        res.sendStatus(200);
      } else { res.sendStatus(500); }
      break;
    }
    default: { res.sendStatus(500); }
  }
});

const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
