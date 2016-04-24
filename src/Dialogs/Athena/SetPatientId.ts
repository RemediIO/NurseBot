
import builder = require('botbuilder');


export function fbSetPatientId(fbRef: any, session: any, patientId: string) {
    fbRef.child("patientId").set(patientId)
    fbRef.child("patientId").on("value", (snapshot) => {
        session.send(`Patient ID has been set to ${snapshot.val()}`);
    });
}

export function addSetPatientId(isCommandMode: boolean, dialog: any, fbRef: any) {

    if (isCommandMode) {
        dialog.matches('^SetPatientId', [
            (session) => {
                builder.Prompts.text(session, "Enter a Patient ID.");
            },
            (session, results) => {
                if (results.response) {
                    fbSetPatientId(fbRef, session, results.response);
                } else {
                    session.send("I'm sorry. I don't understand.");
                }
            }
        ]);
    } else {
        dialog.on('SetPatientId', [
            (session, args, next) => {
                // See if got the PatientId from our LUIS model.
                var PatientId = builder.EntityRecognizer.findEntity(args.entities, 'PatientId');

                if (!PatientId) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter a patient Id.");
                } else {
                    // Pass PatientId to next step.
                    next({ response: PatientId.entity });
                }
            },
            (session, results) => {
                // Save the task
                if (results.response) {
                    fbSetPatientId(fbRef, session, results.response);
                } else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    dialog.onDefault(builder.DialogAction.send("I'm sorry Dave, I can't do that right now. ;)"));
    
    return dialog;

}