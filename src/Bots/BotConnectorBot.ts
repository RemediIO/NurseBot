import builder = require('botbuilder');

declare var process: any;

export class NurseBot extends builder.BotConnectorBot {

    constructor() {
        super({
            appId: process.env.MS_BOT_BUILDER_APP_ID,
            appSecret: process.env.MS_BOT_BUILDER_APP_SECRET
        });

    }

}


