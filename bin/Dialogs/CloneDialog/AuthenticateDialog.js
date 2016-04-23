var builder = require('botbuilder');
var FirebaseDialogs = (function () {
    function FirebaseDialogs() {
    }
    return FirebaseDialogs;
})();
exports.FirebaseDialogs = FirebaseDialogs;
var AuthenticateDialog = (function () {
    function AuthenticateDialog() {
        this.APP_NAME = "CreatorBot";
        this.APP_URL = "http://nursebot.busybots.io";
        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;
        this.LUIS_MODEL = "https://api.projectoxford.ai/luis/v1/application?id=" + this.LUIS_ID + "&subscription-key=" + this.LUIS_KEY + "&q=";
        var prompts = {
            promptUserLogin: "I'm going to authenticate you now:\n\n * Login to " + this.APP_NAME + " at " + this.APP_URL + ".\n",
            canceled: 'Sure... No problem.',
            whatIsYourUserName: "Your username is '%(UserName)'",
            promptUserName: 'What is your email?',
            listTaskList: 'Tasks\n%s',
            listTaskItem: '%(index)d. %(task)s\n',
            listNoTasks: 'You have no tasks.',
            finishTaskMissing: "Which task would you like to delete?",
            finishTaskDone: "Removed '%(task)s' from your task list."
        };
        var ask = {
            userToLogin: "Please Login to " + this.APP_NAME + " at " + this.APP_URL + ".",
            whatIsYourUserName: 'What is your email?'
        };
        var state = {
            yourUserNameIs: "Your username is '%(UserName)'",
            youAreNotLoggedIn: "You are not logged in."
        };
        console.log('Loading LUIS Model: ', this.LUIS_MODEL);
        this.dialog = new builder.LuisDialog(this.LUIS_MODEL);
        this.dialog.on('Help', builder.DialogAction.send(ask.userToLogin));
        /** Prompts a user for their UserName  */
        this.dialog.on('SaveUserName', [
            function (session, args, next) {
                // See if got the UserName from our LUIS model.
                var UserName = builder.EntityRecognizer.findEntity(args.entities, 'UserName');
                if (!UserName) {
                    // Prompt user to enter their UserName.
                    builder.Prompts.text(session, ask.whatIsYourUserName);
                }
                else {
                    // Pass UserName to next step.
                    next({ response: UserName.entity });
                }
            },
            function (session, results) {
                // Save the UserName
                if (results.response) {
                    var UserName = results.response;
                    if (!session.userData.UserName) {
                        session.userData.UserName = UserName;
                    }
                    else {
                        session.userData.UserName = UserName;
                    }
                    session.send(state.yourUserNameIs, { UserName: UserName });
                }
                else {
                    session.send(prompts.canceled);
                }
            }
        ]);
        /** Shows the user who is currently logged in. */
        this.dialog.on('IdentifyUser', function (session) {
            if (session.userData.UserName) {
                session.sendstate(state.yourUserNameIs, session.userData.UserName);
            }
            else {
                session.send(state.youAreNotLoggedIn);
            }
        });
        this.dialog.onDefault(builder.DialogAction.send("I'm sorry Dave, I can't do that right now. ;)"));
    }
    return AuthenticateDialog;
})();
exports.AuthenticateDialog = AuthenticateDialog;
//# sourceMappingURL=AuthenticateDialog.js.map