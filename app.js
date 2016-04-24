
var restify = require('restify');

var cb = require('./bin/Bots/BotConnectorBot')

var nursebot = new cb.NurseBot();

var server = restify.createServer();

server.get('/', (req, res, next) => {
  res.send({
    nurse: "remedi is live!"
  });
  next();
});

server.post('/api/messages', nursebot.verifyBotFramework(), nursebot.listen());

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});