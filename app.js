
var restify = require('restify');

var cb = require('./bin/Bots/BotConnectorBot')
var bs = require('./bin/Dialogs/Bootstrap')

var nursebot = new cb.NurseBot();

bs.bootstrapDialogs(nursebot);

var server = restify.createServer();

server.get('/', (req, res, next) => {
  res.send({
    hello: "world"
  });
  next();
});

server.post('/api/messages', nursebot.verifyBotFramework(), nursebot.listen());

server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});