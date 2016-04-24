var builder = require('botbuilder');
var api_vetting_1 = require('../../API/api-vetting');
function fbSetPatientId(fbRef, session, patientId) {
    fbRef.child("patientId").set(patientId);
    fbRef.child("patientId").on("value", function (snapshot) {
        var patientId = snapshot.val();
        session.userData.patientId = patientId;
        api_vetting_1.getPatient(patientId, function (patient) {
            session.userData.patient = patient;
            var encounterSummary = "Currently seeing " + session.userData.patient.firstname + " " + session.userData.patient.lastname + ", " + session.userData.patient.sex + " born " + session.userData.patient.dob + ".";
            session.send(encounterSummary);
        });
    });
}
exports.fbSetPatientId = fbSetPatientId;
function addDemo(isCommandMode, dialog, fbRef) {
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
    if (isCommandMode) {
        dialog.matches('^GetPatientVitals', [
            function (session) {
                api_vetting_1.getPatientVitals(session.userData.patientId, 1, function (patientVitalsSummary) {
                    session.userData.patientVitalsSummary = patientVitalsSummary;
                    session.send(patientVitalsSummary);
                });
            }
        ]);
    }
    else {
        dialog.on('GetPatientVitals', [
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
                    api_vetting_1.getPatientVitals(results.response, 1, function (patientVitalsSummary) {
                        session.userData.patientVitalsSummary = patientVitalsSummary;
                        session.send(patientVitalsSummary);
                    });
                }
                else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    if (isCommandMode) {
        dialog.matches('^GetPatientEncounterOrders', [
            function (session) {
                api_vetting_1.getOrdersForEncounter(32965, function (patientOrdersSummary) {
                    session.userData.patientOrdersSummary = patientOrdersSummary;
                    session.send(patientOrdersSummary);
                });
            }
        ]);
    }
    else {
        dialog.on('GetPatientEncounterOrders', [
            function (session, args, next) {
                api_vetting_1.getOrdersForEncounter(32965, function (patientOrdersSummary) {
                    session.userData.patientOrdersSummary = patientOrdersSummary;
                    session.send(patientOrdersSummary);
                });
            }
        ]);
    }
    if (isCommandMode) {
        dialog.matches('^UpdatePatientPulse', [
            function (session) {
                builder.Prompts.text(session, "Enter patient pulse");
            },
            function (session, results) {
                if (results.response) {
                    api_vetting_1.updateVitalForEncounter(32965, 26355, results.response, function (callbackData) {
                        session.send("I've updated the patient's pulse.");
                    });
                }
                else {
                    session.send("I'm sorry. I don't understand.");
                }
            }
        ]);
    }
    else {
        dialog.on('UpdatePatientPulse', [
            function (session, args, next) {
                // See if got the PatientId from our LUIS model.
                var PatientPulse = builder.EntityRecognizer.findEntity(args.entities, 'PatientPulse');
                if (!PatientPulse) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter patient pulse.");
                }
                else {
                    // Pass PatientId to next step.
                    next({ response: PatientPulse.entity });
                }
            },
            function (session, results) {
                // Save the task
                if (results.response) {
                    api_vetting_1.updateVitalForEncounter(32965, 26355, results.response, function (callbackData) {
                        session.send("I've updated the patient's pulse.");
                    });
                }
                else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    if (isCommandMode) {
        dialog.matches('^UpdatePatientTemperature', [
            function (session) {
                builder.Prompts.text(session, "Enter patient temperature");
            },
            function (session, results) {
                if (results.response) {
                    api_vetting_1.updateVitalForEncounter(32965, 26361, results.response, function (callbackData) {
                        session.send("I've updated the patient's temperature.");
                    });
                }
                else {
                    session.send("I'm sorry. I don't understand.");
                }
            }
        ]);
    }
    else {
        dialog.on('UpdatePatientTemperature', [
            function (session, args, next) {
                // See if got the PatientId from our LUIS model.
                var PatientTemperature = builder.EntityRecognizer.findEntity(args.entities, 'PatientTemperature');
                if (!PatientTemperature) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter patient temperature.");
                }
                else {
                    // Pass PatientId to next step.
                    next({ response: PatientTemperature.entity });
                }
            },
            function (session, results) {
                // Save the task
                if (results.response) {
                    api_vetting_1.updateVitalForEncounter(32965, 26361, results.response, function (callbackData) {
                        session.send("I've updated the patient's temperature.");
                    });
                }
                else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    if (isCommandMode) {
        dialog.matches('^SearchPracticePrescriptions', [
            function (session) {
                builder.Prompts.text(session, "What would you like to search for?");
            },
            function (session, results) {
                if (results.response) {
                    api_vetting_1.searchPracticePrescriptions(results.response, function (searchResults) {
                        session.send(searchResults);
                    });
                }
                else {
                    session.send("I'm sorry. I don't understand.");
                }
            }
        ]);
    }
    else {
        dialog.on('SearchPracticePrescriptions', [
            function (session, args, next) {
                // See if got the SearchQuery from our LUIS model.
                var SearchQuery = builder.EntityRecognizer.findEntity(args.entities, 'SearchQuery');
                if (!SearchQuery) {
                    // Prompt user to enter SearchQuery.
                    builder.Prompts.text(session, "Enter patient temperature.");
                }
                else {
                    // Pass SearchQuery to next step.
                    next({ response: SearchQuery.entity });
                }
            },
            function (session, results) {
                // Save the task
                if (results.response) {
                    session.send("Let me check on that...");
                    api_vetting_1.searchPracticePrescriptions(results.response, function (searchResults) {
                        session.send(searchResults);
                    });
                }
                else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }
    var helpCommands = "\n    \n    I'm sorry. Here's what you can ask me: \n\n    \n    SetPatientId \n\n    GetPatientVitals \n\n    GetPatientEncounterOrders \n\n \n    UpdatePatientTemperature \n\n    UpdatePatientPulse \n\n    \n    SearchPracticePrescriptions \n\n    \n    ";
    dialog.onDefault(builder.DialogAction.send(helpCommands));
    return dialog;
}
exports.addDemo = addDemo;
//# sourceMappingURL=Demo.js.map