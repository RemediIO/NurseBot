#!/usr/bin/env nodejs

//	  Copyright 2014 athenahealth, Inc.
//
//	 Licensed under the Apache License, Version 2.0 (the "License"); you
//	 may not use this file except in compliance with the License.  You
//	 may obtain a copy of the License at
//
//		 http://www.apache.org/licenses/LICENSE-2.0
//
//	 Unless required by applicable law or agreed to in writing, software
//	 distributed under the License is distributed on an "AS IS" BASIS,
//	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
//	 implied.  See the License for the specific language governing
//	 permissions and limitations under the License.


var athenahealthapi = require('./athenahealthapi')
var events = require('events')

////////////////////////////////////////////////////////////////////////////////////////////////////
// Setup
////////////////////////////////////////////////////////////////////////////////////////////////////

var key = process.env.ATHENA_KEY
var secret = process.env.ATHENA_SECRET
var version = 'preview1'
var practiceId = 195900

var api = new athenahealthapi.Connection(version, key, secret, practiceId)
api.status.on('ready', main)
api.status.on('error', function(error) {
	console.log(error)
})

// Before we start, here's a useful function
function path_join(...arguments2: any[]):string {
	// trim slashes from arguments, prefix a slash to the beginning of each, re-join (ignores empty parameters)
	var args = Array.prototype.slice.call(arguments, 0)
	var nonempty = args.filter(function(arg, idx, arr) {
		return typeof(arg) != 'undefined'
	})
	var trimmed = nonempty.map(function(arg, idx, arr) {
		return '/' + String(arg).replace(new RegExp('^/+|/+$'), '')
	})
	return trimmed.join('')
}

function log_error(error) {
	console.log(error)
	console.log(error.cause)
}

function main() {
	// getPatient(1)
	// getOpenAppointments(1, 82, 71)
	// bookAppointment(661351, 82, 1, 1)
	// checkInForAppointment(661351)
	// getEncounterForAppointment(661351)
	// getPatientVitals(1, 1)
	// addDiagnosisForEncounter(32955, 44054006)
	// ('diabetes')
	// orderPrescriptionForEncounter(32955, 44054006, 1, "tablet(s)", 0, "PRESCRIBE", 285964, 10, "tablet(s)")
	// getOrdersForEncounter(32955)
}


function formatDate(date) {
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear()
}

export function getPatient(patientId, setPatientCallback) {
	var today = new Date()
	var nextyear = new Date()
	nextyear.setFullYear(today.getFullYear() + 1)
	
	api.GET(path_join('/patients', patientId))
	.on('done', function(response) {
		var patient = response[0]
		setPatientCallback(patient);
		// console.log('Patient:')
		// console.log(patient)
		// console.log()
	}).on('error', log_error)
}

function getOpenAppointments(departmentId, appointmentTypeId, providerId) {
	var today = new Date()
	var nextyear = new Date()
	nextyear.setFullYear(today.getFullYear() + 1)
	
	api.GET('/appointments/open', {
		params: {
			departmentid: departmentId,
			startdate: formatDate(today),
			enddate: formatDate(nextyear),
			appointmenttypeid: appointmentTypeId,
			limit: 100,
			providerid: providerId
		}
	}).on('done', function(response) {
		var appt = response['appointments'][90]
		console.log('Open appointment:')
		console.log(appt)
		console.log()
	}).on('error', log_error)
}

function bookAppointment(appointmentId, appointmentTypeId, departmentId, patientId) {
	api.PUT(path_join('/appointments', appointmentId), {
		params: {
			appointmenttypeid: appointmentTypeId,
			departmentid: departmentId,
			patientid: patientId
		}
	}).on('done', function(response) {
		console.log('Response to booking appointment:')
		console.log(response)
		console.log()
	}).on('error', log_error)
}

function checkInForAppointment(appointmentId) {
	api.POST(path_join('/appointments', appointmentId, 'checkin'))
	.on('done', function(response) {
		var success = response['success'] != null
		  console.log("Response to check-in: %s\n", success)
	})
	.on('error', log_error)
}

export function getPatientVitals(patientId, departmentId, patientVitalsSummaryCallback) {
	api.GET(path_join('/chart', patientId, 'vitals'), {
		params: {
			departmentid: departmentId
		}
	}).on('done', function(response) {
		var vitals = response['vitals']
		var vitalsSummary = '';
		for (var vital in vitals) {
		  var readings = vitals[vital]['readings']
		  var latestReading = readings.slice(-1)[0][0]
		  vitalsSummary += `On ${latestReading['readingtaken']} ${latestReading['codedescription']} was ${latestReading['value']}\n`;
		}
		patientVitalsSummaryCallback(vitalsSummary)
	}).on('error', log_error)
}

// export function getVitalsForEncounter(encounterId) {
//     api.GET(path_join('/chart', 'encounter', encounterId, 'vitals'))
//     .on('done', function(response) {
//         console.log(response)
//         orders = response[0]['orders']
//         for (var order in orders) {
//           console.log("Description: %s\nOrderId: %s\n", orders[order]['description'], orders[order]['orderid'])
//         }
//     }).on('error', log_error)
// }


export function addNoteToAppointment(appointmentId, note, addNoteCallback) {
    api.POST(path_join('/appointments', appointmentId, 'notes'), {
        params: {
            appointmentid: appointmentId,
            notetext: note
        }
    }).on('done', function(response) {
        var success = response['success'] != null
		addNoteCallback(success);
    //   console.log("Response to adding note: %s\n", success)
    }).on('error', log_error)
}

function getEncounterForAppointment(appointmentId) {
	api.GET(path_join('/appointments', appointmentId), {
		params: {
			ignorerestrictions: false,
			showclaimdetail: false,
			showcopay: true,
			showinsurance: false,
			showpatientdetail: false
		}
	}).on('done', function(response) {
		var encounterId = response[0]['encounterid']
		console.log("Encounter Id: %s", encounterId)
	}).on('error', log_error)
}

function addDiagnosisForEncounter(encounterId, snoMedCode) {
	api.POST(path_join('/chart', 'encounter', encounterId, 'diagnoses'), {
		params: {
			snomedcode: snoMedCode
		}
	}).on('done', function(response) {
		console.log(response)
	}).on('error', log_error)
}



function orderPrescriptionForEncounter(encounterId, snoMedCode, dosageQuantity, dosageQuantityUnit, numRefillsAllowed, orderingMode, orderTypeId, totalQuantity, totalQuantityUnit) {
	api.POST(path_join('/chart', 'encounter', encounterId, 'orders', 'prescription'), {
		params: {
			diagnosissnomedcode: snoMedCode,
			dosagequantity: dosageQuantity,
			dosagequantityunit: dosageQuantityUnit,
			numrefillsallowed: numRefillsAllowed,
			orderingmode: orderingMode,
			ordertypeid: orderTypeId,
			totalquantity: totalQuantity,
			totalquantityunit: totalQuantityUnit
		}
	}).on('done', function(response) {
		console.log(response)
	}).on('error', log_error)
}

export function getOrdersForEncounter(encounterId, patientOrdersSummaryCallback) {
    api.GET(path_join('/chart', 'encounter', encounterId, 'orders'))
    .on('done', function(response) {
        var orders = response[0]['orders']
		var patientOrdersSummary = '';
        for (var order in orders) {
          patientOrdersSummary += `Description: ${orders[order]['description']}\nOrderId: ${orders[order]['orderid']}\n`;
        }
		
		patientOrdersSummaryCallback(patientOrdersSummary)
		
    }).on('error', log_error)
}

// TEMPERATURE
// updateVitalForEncounter(32965, 26361, 96.6)
// PULSE RATE
// updateVitalForEncounter(32965, 26355, 78)

export function updateVitalForEncounter(encounterId, vitalId, value, updateVitalsCallback) {
	api.PUT(path_join('/chart', 'encounter', encounterId, 'vitals', vitalId), {
		params: {
			value: value
		}
	}).on('done', function(response) {
		// console.log(response)
		updateVitalsCallback(response);
	}).on('error', log_error)
}


export function searchPracticePrescriptions(q, searchCallback) {
	api.GET(path_join('/reference', 'order', 'prescription'), {
		params: {
			searchvalue: q
		}
	}).on('done', function(response) {
		var prescriptions = response
		var resp = '';
		for (var prescription in response) {
		//   console.log("", response[prescription]['name'], response[prescription]['ordertypeid'])
		  resp += `Name: ${response[prescription]['name']}\nOrderId: ${response[prescription]['ordertypeid']}\n`;
		}
		
		searchCallback(resp);
		
	}).on('error', log_error)
}
