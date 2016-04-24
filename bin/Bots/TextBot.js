var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var builder = require('botbuilder');
var Firebase = require("firebase");
// import { addSetPatientId } from '../Dialogs/Athena/SetPatientId'
var Demo_1 = require('../Dialogs/Athena/Demo');
var NurseBot = (function (_super) {
    __extends(NurseBot, _super);
    function NurseBot() {
        var _this = this;
        _super.call(this);
        this.getNewDialog = function () {
            if (_this.isCommandMode) {
                return new builder.CommandDialog();
            }
            else {
                console.log('loading: ', _this.LUIS_MODEL);
                return new builder.LuisDialog(_this.LUIS_MODEL);
            }
        };
        this.FIREBASE_APP_URL = process.env.MS_BOT_BUILDER_APP_FIREBASE_APP_URL;
        this.FIREBASE_SECRET = process.env.MS_BOT_BUILDER_APP_FIREBASE_SECRET;
        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;
        this.LUIS_MODEL = "https://api.projectoxford.ai/luis/v1/application?id=" + this.LUIS_ID + "&subscription-key=" + this.LUIS_KEY + "&q=";
        this.fbRef = new Firebase("" + this.FIREBASE_APP_URL);
        this.isCommandMode = false;
        this.add('/', Demo_1.addDemo(this.isCommandMode, this.getNewDialog(), this.fbRef));
    }
    return NurseBot;
})(builder.TextBot);
exports.NurseBot = NurseBot;
//# sourceMappingURL=TextBot.js.map