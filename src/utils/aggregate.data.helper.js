"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStartingHour = void 0;
function findStartingHour(date) {
    var roundedDate = new Date(date);
    // Round the minutes to the starting hour
    roundedDate.setMinutes(Math.floor(roundedDate.getMinutes() / 60) * 60);
    roundedDate.setSeconds(0);
    roundedDate.setMilliseconds(0);
    return roundedDate;
}
exports.findStartingHour = findStartingHour;
