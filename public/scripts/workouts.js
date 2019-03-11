// workouts.js

"use strict";

const WOG = {
    doc: document,
    createIndex: null,
    editFunction: null,
    deleteFunction: null,
    workoutTable: document.getElementById("workoutTable"),
    formRow: document.getElementById("formRow"),
    submitButton: document.getElementById("submitButton"),
    workoutTBody: document.getElementById("workoutTBody"),
    createRow: null,
    bindSubmit: null
};

WOG.createIndex = (function () {
    var thisIndex, index = 0;
    return function () {
        thisIndex = index;
        index += 1;
        return thisIndex;
    };
}());

WOG.editFunction = function () {
    var row, rowIndex, cells = [], inputs = [], i;
    row = WOG.doc.getElementById("editA");
    if (row) {
        row.removeAttribute("id");
    }
    row = this.parentNode.parentNode;
    rowIndex = row.rowIndex;
    cells = row.getElementsByTagName("td");
    inputs = WOG.formRow.getElementsByTagName("td");
    for (i = 0; i < 5; i += 1) {
        inputs[i].firstChild.value = cells[i].textContent;
    }
    cells[3].textContent === "lbs" ? (inputs[3].firstElementChild.checked = true) : (inputs[3].lastElementChild.checked = true);
    inputs[5].firstChild.value = "edit row";
    row.setAttribute("id", "editA");
    WOG.formRow.setAttribute("id", "editB");
};

WOG.deleteFunction = function () {
    var row = this.parentNode.parentNode.rowIndex;
    console.log(this.id);
    WOG.workoutTable.deleteRow(row);
};

WOG.createRow = function (exName, reps, weight, units, date) {
    var row, i, cell = [], idNum = WOG.createIndex(), editButton, deleteButton;
    row = WOG.workoutTBody.insertRow(0);
    for (i = 0; i < 6; i += 1) {
        cell[i] = row.insertCell(i);
    }
    cell[0].innerHTML = exName;
    cell[1].innerHTML = reps;
    cell[2].innerHTML = weight;
    cell[3].innerHTML = units ? "lbs" : "kg";
    cell[4].innerHTML = date;
    cell[5].innerHTML = '<input type="submit" value="edit" id="edit' + idNum + '"><input type="submit" value="delete" id="delete' + idNum + '">';
    editButton = WOG.doc.getElementById("edit" + idNum);
    editButton.addEventListener("click", WOG.editFunction);
    deleteButton = WOG.doc.getElementById("delete" + idNum);
    deleteButton.addEventListener("click", WOG.deleteFunction);
};

WOG.bindSubmit = function () {
    WOG.submitButton.addEventListener("click", function (event) {
        var request; 
        event.preventDefault();
        WOG.createRow(
            WOG.doc.exercise.exerciseName.value,
            WOG.doc.exercise.reps.value,
            WOG.doc.exercise.weight.value,
            WOG.doc.exercise.units.value === "lbs",
            WOG.doc.exercise.date.value
        );
    });
};

WOG.doc.addEventListener("DOMContentLoaded", WOG.bindSubmit);