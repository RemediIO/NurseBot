
import builder = require('botbuilder');

import {getPatient, getPatientVitals, getOrdersForEncounter, addNoteToAppointment, updateVitalForEncounter, searchPracticePrescriptions} from '../../API/api-vetting'

export function fbSetPatientId(fbRef: any, session: any, patientId: string) {
    fbRef.child("patientId").set(patientId)
    fbRef.child("patientId").on("value", (snapshot) => {
        var patientId = snapshot.val();
        session.userData.patientId = patientId;
        getPatient(patientId, (patient) => {
            session.userData.patient = patient
            var encounterSummary = `Currently seeing ${session.userData.patient.firstname} ${session.userData.patient.lastname}, ${session.userData.patient.sex} born ${session.userData.patient.dob}.`;
            session.send(encounterSummary);
        });
    });
}

export function addDemo(isCommandMode: boolean, dialog: any, fbRef: any) {

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


    if (isCommandMode) {
        dialog.matches('^GetPatientVitals', [
            (session) => {

                getPatientVitals(session.userData.patientId, 1, (patientVitalsSummary) => {
                    session.userData.patientVitalsSummary = patientVitalsSummary
                    session.send(patientVitalsSummary);
                });

            }
        ]);
    } else {
        dialog.on('GetPatientVitals', [
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
                    getPatientVitals(results.response, 1, (patientVitalsSummary) => {
                        session.userData.patientVitalsSummary = patientVitalsSummary
                        session.send(patientVitalsSummary);
                    });
                } else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }

    if (isCommandMode) {
        dialog.matches('^GetPatientEncounterOrders', [
            (session) => {

                getOrdersForEncounter(32965, (patientOrdersSummary) => {
                    session.userData.patientOrdersSummary = patientOrdersSummary
                    session.send(patientOrdersSummary);
                })

            }
        ]);
    } else {
        dialog.on('GetPatientEncounterOrders', [
            (session, args, next) => {
                getOrdersForEncounter(32965, (patientOrdersSummary) => {
                    session.userData.patientOrdersSummary = patientOrdersSummary
                    session.send(patientOrdersSummary);
                })
            }
        ]);
    }


    if (isCommandMode) {
        dialog.matches('^UpdatePatientPulse', [

            (session) => {
                builder.Prompts.text(session, "Enter patient pulse");
            },
            (session, results) => {
                if (results.response) {
                    updateVitalForEncounter(32965, 26355, results.response, (callbackData) => {
                        session.send("I've updated the patient's pulse.");
                    });
                } else {
                    session.send("I'm sorry. I don't understand.");
                }
            }

        ]);
    } else {
        dialog.on('UpdatePatientPulse', [
            (session, args, next) => {
                // See if got the PatientId from our LUIS model.
                var PatientPulse = builder.EntityRecognizer.findEntity(args.entities, 'PatientPulse');

                if (!PatientPulse) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter patient pulse.");
                } else {
                    // Pass PatientId to next step.
                    next({ response: PatientPulse.entity });
                }
            },
            (session, results) => {
                // Save the task
                if (results.response) {
                    updateVitalForEncounter(32965, 26355, results.response, (callbackData) => {
                        session.send("I've updated the patient's pulse.");
                    });
                } else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }


    if (isCommandMode) {
        dialog.matches('^UpdatePatientTemperature', [

            (session) => {
                builder.Prompts.text(session, "Enter patient temperature");
            },
            (session, results) => {
                if (results.response) {
                    updateVitalForEncounter(32965, 26361, results.response, (callbackData) => {
                        session.send("I've updated the patient's temperature.");
                    });
                } else {
                    session.send("I'm sorry. I don't understand.");
                }
            }

        ]);
    } else {
        dialog.on('UpdatePatientTemperature', [

            (session, args, next) => {
                // See if got the PatientId from our LUIS model.
                var PatientTemperature = builder.EntityRecognizer.findEntity(args.entities, 'PatientTemperature');

                if (!PatientTemperature) {
                    // Prompt user to enter PatientId.
                    builder.Prompts.text(session, "Enter patient temperature.");
                } else {
                    // Pass PatientId to next step.
                    next({ response: PatientTemperature.entity });
                }
            },
            (session, results) => {
                // Save the task
                if (results.response) {
                    updateVitalForEncounter(32965, 26361, results.response, (callbackData) => {
                        session.send("I've updated the patient's temperature.");
                    });
                } else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }



    if (isCommandMode) {
        dialog.matches('^SearchPracticePrescriptions', [

            (session) => {
                builder.Prompts.text(session, "What would you like to search for?");
            },
            (session, results) => {
                if (results.response) {
                    searchPracticePrescriptions(results.response, (searchResults) => {
                        session.send(searchResults);
                    })
                } else {
                    session.send("I'm sorry. I don't understand.");
                }
            }

        ]);
    } else {
        dialog.on('SearchPracticePrescriptions', [

            (session, args, next) => {
                // See if got the SearchQuery from our LUIS model.
                var SearchQuery = builder.EntityRecognizer.findEntity(args.entities, 'SearchQuery');

                if (!SearchQuery) {
                    // Prompt user to enter SearchQuery.
                    builder.Prompts.text(session, "Enter patient temperature.");
                } else {
                    // Pass SearchQuery to next step.
                    next({ response: SearchQuery.entity });
                }
            },
            (session, results) => {
                // Save the task
                if (results.response) {
                     session.send("Let me check on that...");
                    searchPracticePrescriptions(results.response, (searchResults) => {
                        session.send(searchResults);
                    })
                } else {
                    session.send("I'm Sorry. I didn't understand.");
                }
            }
        ]);
    }


    var helpCommands = `
    
    I'm sorry. Here's what you can ask me: \n
    
    SetPatientId \n
    GetPatientVitals \n
    GetPatientEncounterOrders \n
 
    UpdatePatientTemperature \n
    UpdatePatientPulse \n
    
    SearchPracticePrescriptions \n
    
    `;

    dialog.onDefault(builder.DialogAction.send( helpCommands ));

    return dialog;

}