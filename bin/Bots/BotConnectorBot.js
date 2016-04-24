var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var builder = require('botbuilder');
var Firebase = require("firebase");
var SetPatientId_1 = require('../Dialogs/Athena/SetPatientId');
var NurseBot = (function (_super) {
    __extends(NurseBot, _super);
    function NurseBot() {
        var _this = this;
        _super.call(this, {
            appId: process.env.MS_BOT_BUILDER_APP_ID,
            appSecret: process.env.MS_BOT_BUILDER_APP_SECRET
        });
        this.getNewDialog = function () {
            if (_this.isCommandMode) {
                return new builder.CommandDialog();
            }
            else {
                return new builder.LuisDialog(_this.LUIS_MODEL);
            }
        };
        this.FIREBASE_APP_URL = process.env.MS_BOT_BUILDER_APP_FIREBASE_APP_URL;
        this.FIREBASE_SECRET = process.env.MS_BOT_BUILDER_APP_FIREBASE_SECRET;
        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;
        this.LUIS_MODEL = "https://api.projectoxford.ai/luis/v1/application?id=" + this.LUIS_ID + "&subscription-key=" + this.LUIS_KEY + "&q=";
        this.fbRef = new Firebase("" + this.FIREBASE_APP_URL);
        this.isCommandMode = true;
        this.add('/', SetPatientId_1.addSetPatientId(this.isCommandMode, this.getNewDialog(), this.fbRef));
    }
    return NurseBot;
})(builder.BotConnectorBot);
exports.NurseBot = NurseBot;
//# sourceMappingURL=BotConnectorBot.js.map