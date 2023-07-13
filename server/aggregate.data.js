"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var parse = require("csv-parse").parse;
var path = require("path");
var aggregate_data_helper_1 = require("../src/utils/aggregate.data.helper");
var aggregatedData = {};
fs.createReadStream(path.resolve(__dirname, "./data/events.csv"))
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
    var jsonRow = convertToJson(row);
    if (jsonRow) {
        storeInClientHourlyBucket(jsonRow);
    }
})
    .on("end", function () {
    console.log("finished reading from csv");
    var filePath = path.resolve(__dirname, "./data/aggregated-events.json");
    var jsonData = JSON.stringify(aggregatedData);
    fs.writeFile(filePath, jsonData, 'utf8', function (err) {
        if (err) {
            console.error('Error writing JSON file:', err);
        }
        else {
            console.log('JSON file saved successfully.');
        }
    });
})
    .on("error", function (error) {
    console.log(error.message);
});
function convertToJson(row) {
    return row.length < 4 ? null : {
        customerId: row[0],
        eventType: row[1],
        transactionId: row[2],
        // TODO: add validation to make sure date is formatted
        // correctly.
        timestamp: new Date(Date.parse(row[3])),
    };
}
function storeInClientHourlyBucket(jsonRow) {
    var startingHour = (0, aggregate_data_helper_1.findStartingHour)(jsonRow.timestamp);
    var customerId = jsonRow.customerId;
    if (!aggregatedData[customerId]) {
        aggregatedData[customerId] = {};
    }
    if (aggregatedData[customerId][startingHour.toISOString()]) {
        aggregatedData[customerId][startingHour.toISOString()]++;
    }
    else {
        aggregatedData[customerId][startingHour.toISOString()] = 1;
    }
}
