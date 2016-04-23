
import builder = require('botbuilder');

export class ToDo {

    public LUIS_ID: string;
    public LUIS_KEY: string;
    public LUIS_MODEL: string;
    public dialog: any;

    constructor() {

        let prompts = {
            helpMessage: "Here's what I can do:\n\n" +
            "* Create new tasks by saying something like 'add a new task to go to the gym'\n" +
            "* List your existing tasks by saying something like 'what do I have to do?'\n" +
            "* Finish an existing task by saying something like 'remove go to the gym'",
            canceled: 'Sure... No problem.',
            saveTaskCreated: "Created a new task called '%(task)s'",
            saveTaskMissing: 'What would you like to name the task?',
            listTaskList: 'Tasks\n%s',
            listTaskItem: '%(index)d. %(task)s\n',
            listNoTasks: 'You have no tasks.',
            finishTaskMissing: "Which task would you like to delete?",
            finishTaskDone: "Removed '%(task)s' from your task list."
        };
        
        this.LUIS_ID = process.env.LUIS_ID;
        this.LUIS_KEY = process.env.LUIS_KEY;

        this.LUIS_MODEL = `https://api.projectoxford.ai/luis/v1/application?id=${this.LUIS_ID}&subscription-key=${this.LUIS_KEY}&q=`;
        
        console.log('Loading LUIS Model: ', this.LUIS_MODEL);

        this.dialog = new builder.LuisDialog(this.LUIS_MODEL);

        this.dialog.on('Help', builder.DialogAction.send(prompts.helpMessage));

        /** Prompts a user for the title of the task and saves it.  */
        this.dialog.on('SaveTask', [
            function (session, args, next) {
                // See if got the tasks title from our LUIS model.
                var title = builder.EntityRecognizer.findEntity(args.entities, 'TaskTitle');
                if (!title) {
                    // Prompt user to enter title.
                    builder.Prompts.text(session, prompts.saveTaskMissing);
                } else {
                    // Pass title to next step.
                    next({ response: title.entity });
                }
            },
            function (session, results) {
                // Save the task
                if (results.response) {
                    if (!session.userData.tasks) {
                        session.userData.tasks = [results.response];
                    } else {
                        session.userData.tasks.push(results.response);
                    }
                    session.send(prompts.saveTaskCreated, { task: results.response });
                } else {
                    session.send(prompts.canceled);
                }
            }
        ]);

        /** Prompts the user for the task to delete and then removes it. */
        this.dialog.on('FinishTask', [
            function (session, args, next) {
                // Do we have any tasks?
                if (session.userData.tasks && session.userData.tasks.length > 0) {
                    // See if got the tasks title from our LUIS model.
                    var topTask;
                    var title = builder.EntityRecognizer.findEntity(args.entities, 'TaskTitle');
                    if (title) {
                        // Find it in our list of tasks
                        topTask = builder.EntityRecognizer.findBestMatch(session.userData.tasks, title.entity);
                    }
                    // Prompt user if task missing or not found
                    if (!topTask) {
                        builder.Prompts.choice(session, prompts.finishTaskMissing, session.userData.tasks);
                    } else {
                        next({ response: topTask });
                    }
                } else {
                    session.send(prompts.listNoTasks);
                }
            },
            function (session, results) {
                if (results && results.response) {
                    session.userData.tasks.splice(results.response.index, 1);
                    session.send(prompts.finishTaskDone, { task: results.response.entity });
                } else {
                    session.send(prompts.canceled);
                }
            }
        ]);

        /** Shows the user a list of tasks. */
        this.dialog.on('ListTasks', function (session) {
            if (session.userData.tasks && session.userData.tasks.length > 0) {
                var list = '';
                session.userData.tasks.forEach(function (value, index) {
                    list += session.gettext(prompts.listTaskItem, { index: index + 1, task: value });
                });
                session.send(prompts.listTaskList, list);
            }
            else {
                session.send(prompts.listNoTasks);
            }
        });


    }

}


