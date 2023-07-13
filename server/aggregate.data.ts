const fs = require("fs");
const { parse } = require("csv-parse");
const path = require("path");

import { EventRow, findStartingHour } from "../src/utils/aggregate.data.helper";


const aggregatedData : Record<string, Record<string, number>> = {};

fs.createReadStream(path.resolve(__dirname, "./data/events.csv"))
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row: string[]) {
    const jsonRow = convertToJson(row);
    if(jsonRow){
      storeInClientHourlyBucket(jsonRow)
    }
  })
  .on("end", function () {
    console.log("finished reading from csv");
    const filePath = path.resolve(__dirname, "./data/aggregated-events.json");
    const jsonData = JSON.stringify(aggregatedData);
    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
      if (err) {
        console.error('Error writing JSON file:', err);
      } else {
        console.log('JSON file saved successfully.');
      }
    });  })
  .on("error", function (error: Error) {
    console.log(error.message);
  });

function convertToJson(row: string[]): null | EventRow {
  return row.length < 4 ? null : {
    customerId: row[0],
    eventType: row[1],
    transactionId: row[2],
    // TODO: add validation to make sure date is formatted
    // correctly.
    timestamp: new Date(Date.parse(row[3])),
  }
}

function storeInClientHourlyBucket(jsonRow: EventRow){
  const startingHour = findStartingHour(jsonRow.timestamp)
  const { customerId } = jsonRow;
  if( !aggregatedData[customerId]){
    aggregatedData[customerId] = {};
  }
  if(aggregatedData[customerId][startingHour.toISOString()]){
    aggregatedData[customerId][startingHour.toISOString()] ++;
  } else {
    aggregatedData[customerId][startingHour.toISOString()] =  1;
  }
}

