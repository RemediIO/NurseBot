var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var builder = require('botbuilder');
var NurseBot = (function (_super) {
    __extends(NurseBot, _super);
    function NurseBot() {
        _super.call(this, {
            appId: process.env.MS_BOT_BUILDER_APP_ID,
            appSecret: process.env.MS_BOT_BUILDER_APP_SECRET
        });
    }
    return NurseBot;
})(builder.BotConnectorBot);
exports.NurseBot = NurseBot;
//# sourceMappingURL=BotConnectorBot.js.map