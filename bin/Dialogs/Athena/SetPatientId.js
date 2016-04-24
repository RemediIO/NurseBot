var builder = require('botbuilder');
function fbSetPatientId(fbRef, session, patientId) {
    fbRef.child("patientId").set(patientId);
    fbRef.child("patientId").on("value", function (snapshot) {
        session.send("Patient ID has been set to " + snapshot.val());
    });
}
exports.fbSetPatientId = fbSetPatientId;
function addSetPatientId(isCommandMode, dialog, fbRef) {
    if (isCommandMode) {
        dialog.matches('^SetPatientId', [
            function (session) {
                builder.Prompts.text(session, "Enter a Patient ID.");
            },
            function (session, results) {
                if (results.response) {
                    fbSetPatientId(fbRef, session, results.response);
                }
                else {
                    session.send("I'm sorry. I don't understand.");
                }
            }
        ]);
    }
    else {
        dialog.on('SetPatientId', [
            function (session, args, next) {
                // See if got the PatientId from our LUIS model.
                var PatientId = builder.EntityRecognizer.findEntity(args.entities, 'PatientId');
                if (!PatientId) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter a patient Id.");
                }
                else {
                    // Pass PatientId to next step.
                    next({ response: PatientId.entity });
                }
            },
            function (session, results) {
                // Save the task
                if (results.response) {
                    fbSetPatientId(fbRef, session, results.response);
                }
                else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    return dialog;
}
exports.addSetPatientId = addSetPatientId;
//# sourceMappingURL=SetPatientId.js.map