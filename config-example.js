var slackbot = require('./lib/bot');
var http = require('http');
var querystring = require('querystring');

var config = {
    server: 'irc.freenode.com',
    nick: 'slackbot',
    username: 'slackbot-username',
    token: process.env.SLACK_INCOMING_TOKEN,
    channels: {
        '#chef': '#freenode_irc'
    },
    users: {
    },
    // optionals
    floodProtection: true,
    silent: false // keep the bot quiet
};

var slackbot = new slackbot.Bot(config);
slackbot.listen();


var server = http.createServer(function (req, res) {
  if (req.method == 'POST') {
    req.on('data', function(data) {
      var payload = querystring.parse(data.toString());
      if (payload.token == process.env.SLACK_OUTGOING_TOKEN) {
        console.log('valid post from slack!');
        var ircMsg = payload.user_name + " says:" + payload.text.slice(4);
        console.log("attempt to post to irc: ", ircMsg);
        slackbot.speak('#chef', ircMsg);
      }
    });
  } else {
    console.log('recieved request (not post)');
  }
  res.end('done');
});

server.listen(5555);
console.log("Server running at http://localhost:5555/");
