var ToDo_1 = require('./ToDo/ToDo');
function bootstrapDialogs(bot) {
    bot.add('/', new ToDo_1.ToDo().dialog);
}
exports.bootstrapDialogs = bootstrapDialogs;
;
//# sourceMappingURL=Bootstrap.js.map