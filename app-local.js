
var cb = require('./bin/Bots/TextBot')
var bs = require('./bin/Dialogs/Bootstrap')

var nursebot = new cb.NurseBot();

bs.bootstrapDialogs(nursebot);

nursebot.listenStdin();