var builder = require('botbuilder');
var WebPPL = (function () {
    function WebPPL() {
        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;
        this.LUIS_MODEL = "https://api.projectoxford.ai/luis/v1/application?id=" + this.LUIS_ID + "&subscription-key=" + this.LUIS_KEY + "&q=";
        console.log('Loading LUIS Model: ', this.LUIS_MODEL);
        this.dialog = new builder.LuisDialog(this.LUIS_MODEL);
        this.dialog.on('Help', builder.DialogAction.send('Hello from webppl dialog...'));
        // this.dialog.on('SaveFunction', [
        //     function (session, args, next) {
        //         session.send( 'save function detected!!!' );
        //     }
        // ]);
        this.dialog.onDefault(builder.DialogAction.send("I'm sorry. I didn't understand."));
    }
    return WebPPL;
})();
exports.WebPPL = WebPPL;
//# sourceMappingURL=WebPPL.js.map