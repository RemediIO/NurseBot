import builder = require('botbuilder');
import Firebase = require("firebase");

import { addDemo } from '../Dialogs/Athena/Demo'

declare var process: any;

export class NurseBot extends builder.BotConnectorBot {

    public LUIS_ID: string;
    public LUIS_KEY: string;
    public LUIS_MODEL: string;

    public FIREBASE_APP_URL: string;
    public FIREBASE_SECRET: string;

    public fbRef: any;

    public dialog: any;

    public isCommandMode: boolean;

    constructor() {
        super({
            appId: process.env.MS_BOT_BUILDER_APP_ID,
            appSecret: process.env.MS_BOT_BUILDER_APP_SECRET
        });


        this.FIREBASE_APP_URL = process.env.MS_BOT_BUILDER_APP_FIREBASE_APP_URL;
        this.FIREBASE_SECRET = process.env.MS_BOT_BUILDER_APP_FIREBASE_SECRET;

        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;
        this.LUIS_MODEL = `https://api.projectoxford.ai/luis/v1/application?id=${this.LUIS_ID}&subscription-key=${this.LUIS_KEY}&q=`;

        this.fbRef = new Firebase(`${this.FIREBASE_APP_URL}`);

        this.isCommandMode = true;

        this.add('/', addDemo(this.isCommandMode, this.getNewDialog(), this.fbRef))

    }

    public getNewDialog = (): any => {
        if (this.isCommandMode) {
            return new builder.CommandDialog();
        } else {
            return new builder.LuisDialog(this.LUIS_MODEL);
        }
    }

}


