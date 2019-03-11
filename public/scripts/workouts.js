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
    fillRow: null, 
    emptyForm: null,
    bindSubmit: null, 
};

WOG.createIndex = (function () {
    var thisIndex, index = 0;
    return function () {
        thisIndex = index;
        index += 1;
        return thisIndex;
    };
}());

WOG.emptyForm = function () {
    var i, inputs = WOG.formRow.getElementsByTagName("td");
    for (i = 0; i < 5; i += 1) {
        inputs[i].firstChild.value = "";
    }
    inputs[3].firstElementChild.checked = true;
    inputs[5].firstChild.value = "add";
    WOG.formRow.setAttribute("id", "formRow");
};

WOG.editFunction = function () {
    var row, rowIndex, cells = [], inputs = [], i;
    row = WOG.doc.getElementById("editRow");
    if (row) {
        row.removeAttribute("id");
    }
    this.disabled = true;
    row = this.parentNode.parentNode;
    rowIndex = row.rowIndex;
    cells = row.getElementsByTagName("td");
    inputs = WOG.formRow.getElementsByTagName("td");
    for (i = 0; i < 5; i += 1) {
        inputs[i].firstChild.value = cells[i].textContent;
    }
    cells[3].textContent === "lbs" ? (inputs[3].firstElementChild.checked = true) : (inputs[3].lastElementChild.checked = true);
    inputs[5].firstChild.value = "edit row";
    row.setAttribute("id", "editRow");
    WOG.formRow.setAttribute("id", "editForm");
};

WOG.deleteFunction = function () {
    var row = this.parentNode.parentNode.rowIndex;
    WOG.emptyForm();
    WOG.workoutTable.deleteRow(row);
};

WOG.fillRow = function (row, exName, reps, weight, units, date) {
    var cells = row.getElementsByTagName("td");
    cells[0].innerHTML = exName;
    cells[1].innerHTML = reps;
    cells[2].innerHTML = weight;
    cells[3].innerHTML = units ? "lbs" : "kg";
    cells[4].innerHTML = date;
};

WOG.createRow = function (exName, reps, weight, units, date) {
    var row, i, cell = [], idNum = WOG.createIndex(), editFormutton, deleteButton;
    row = WOG.workoutTBody.insertRow(0);
    for (i = 0; i < 6; i += 1) {
        cell[i] = row.insertCell(i);
    }
    WOG.fillRow(row, exName, reps, weight, units, date);
    cell[5].innerHTML = '<input type="submit" value="edit" id="edit' + idNum + '"><input type="submit" value="delete" id="delete' + idNum + '">';
    editFormutton = WOG.doc.getElementById("edit" + idNum);
    editFormutton.addEventListener("click", WOG.editFunction);
    deleteButton = WOG.doc.getElementById("delete" + idNum);
    deleteButton.addEventListener("click", WOG.deleteFunction);
};

WOG.bindSubmit = function () {
    WOG.submitButton.addEventListener("click", function (event) {
        var submitCurrentValue = WOG.submitButton.value; 
        event.preventDefault();
        if (submitCurrentValue === "add") {
            WOG.createRow(
                WOG.doc.exercise.exerciseName.value,
                WOG.doc.exercise.reps.value,
                WOG.doc.exercise.weight.value,
                WOG.doc.exercise.units.value === "lbs",
                WOG.doc.exercise.date.value
            );
        } else if (submitCurrentValue === "edit row") {
            var editRow = WOG.doc.getElementById("editRow");
            WOG.fillRow(
                editRow,
                WOG.doc.exercise.exerciseName.value,
                WOG.doc.exercise.reps.value,
                WOG.doc.exercise.weight.value,
                WOG.doc.exercise.units.value === "lbs",
                WOG.doc.exercise.date.value
            );
            editRow.removeAttribute("id");
            editRow.lastElementChild.firstElementChild.disabled = false;
        }
        WOG.emptyForm();
    });
};

WOG.doc.addEventListener("DOMContentLoaded", WOG.bindSubmit);