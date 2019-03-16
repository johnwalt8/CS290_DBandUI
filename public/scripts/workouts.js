// workouts.js

"use strict";

const WOG = {
    doc: document,
    createIndex: null,
    editFunction: null,
    deleteFunction: null,
    workoutTable: document.getElementById("workoutTable"),
    formRow: document.getElementById("formRow"),
    addEditButton: document.getElementById("addEditButton"),
    workoutTBody: document.getElementById("workoutTBody"),
    createRow: null,
    fillRow: null,
    emptyForm: null,
    bindAddEdit: null,
    xhr: new XMLHttpRequest(),
    request: {},
    response: {}
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
    WOG.formRow.removeAttribute("data-id");
};

WOG.editFunction = function () {
    var row, rowId, cells = [], inputs = [];
    this.disabled = true;
    row = WOG.doc.getElementById("editRow");
    if (row) {
        row.removeAttribute("id");
    }
    row = this.parentNode.parentNode;
    rowId = row.getAttribute("data-id");
    cells = row.getElementsByTagName("td");
    inputs = WOG.formRow.getElementsByTagName("input");
    inputs.exerciseName.value = cells[0].textContent;
    inputs.reps.value = cells[1].textContent;
    inputs.weight.value = cells[2].textContent;
    if (cells[3].textContent === "lbs") {
        inputs.units.checked = true;
    } else {
        inputs.units.nextElementSibling.checked = true;
    }
    inputs.date.value = cells[4].textContent;
    inputs.addEdit.value = "edit row";
    row.setAttribute("id", "editRow");
    WOG.formRow.setAttribute("id", "editForm");
    WOG.formRow.setAttribute("data-id", rowId);
};

WOG.deleteFunction = function () {
    var deleteButton, row, xhr, inputs, editRow, request = {};
    deleteButton = this;
    deleteButton.disabled = true;
    row = deleteButton.parentNode.parentNode;
    xhr = new XMLHttpRequest();
    request.action = "delete";
    request.id = parseInt(row.getAttribute("data-id"));
    inputs = WOG.formRow.getElementsByTagName("input");
    xhr.open("POST", "/", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.addEventListener("load", function () {
        if (xhr.status >= 200 && xhr.status < 400) {
            WOG.response = JSON.parse(xhr.response);
            if (WOG.response.success === true) {
                WOG.emptyForm();
                WOG.workoutTable.deleteRow(row.rowIndex);
                editRow = WOG.doc.getElementById("editRow");
                if (editRow) {
                    editRow.removeAttribute("id");
                    editRow.lastElementChild.firstElementChild.disabled = false;
                }
            } else {
                inputs.exerciseName.value = "ERROR: not deleted";
            }
        } else {
            console.log("Error in network request: " + xhr.responseText);
            inputs.exerciseName.value = "NETWORK ERROR";
        }
        deleteButton.disabled = false;
    });
    xhr.send(JSON.stringify(request));
};

WOG.fillRow = function (row, exName, reps, weight, units, date) {
    var cells = row.getElementsByTagName("td");
    cells[0].innerHTML = exName;
    cells[1].innerHTML = reps;
    cells[2].innerHTML = weight;
    cells[3].innerHTML = units ? "lbs" : "kg";
    cells[4].innerHTML = date;
};

WOG.createRow = function (id, exName, reps, weight, units, date) {
    var row, i, cell = [], idNum = WOG.createIndex(), editFormButton, deleteButton;
    row = WOG.workoutTBody.insertRow(0);
    row.setAttribute("data-id", id);
    for (i = 0; i < 6; i += 1) {
        cell[i] = row.insertCell(i);
    }
    WOG.fillRow(row, exName, reps, weight, units, date);
    cell[5].innerHTML = '<input type="button" name="editRow" value="edit" id="edit' + idNum
            + '"><input type="button" name="deleteRow" value="delete" id="delete' + idNum + '">';
    editFormButton = WOG.doc.getElementById("edit" + idNum);
    editFormButton.addEventListener("click", WOG.editFunction);
    deleteButton = WOG.doc.getElementById("delete" + idNum);
    deleteButton.addEventListener("click", WOG.deleteFunction);
};

WOG.bindAddEdit = function () {
    WOG.addEditButton.addEventListener("click", function (event) {
        var inputs, addEditButtonValue, xhr, request = {};
        WOG.addEditButton.disabled = true;
        request.exercise = {};
        xhr = new XMLHttpRequest();
        event.preventDefault();
        addEditButtonValue = WOG.addEditButton.value;
        inputs = WOG.formRow.getElementsByTagName("input");
        if (inputs.exerciseName.value === "") {
            alert("Exercise name is required");
        } else {
            request.action = addEditButtonValue;
            request.exercise.id = parseInt(WOG.formRow.getAttribute("data-id"));
            request.exercise.exerciseName = inputs.exerciseName.value;
            request.exercise.reps = inputs.reps.value;
            request.exercise.weight = inputs.weight.value;
            request.exercise.units = inputs.units.checked ? "lbs" : "kg";
            request.exercise.date = inputs.date.value;
            xhr.open("POST", "/", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.addEventListener("load", function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    WOG.response = JSON.parse(xhr.response);
                    if (addEditButtonValue === "add") {
                        WOG.createRow(
                            WOG.response.id,
                            inputs.exerciseName.value,
                            inputs.reps.value,
                            inputs.weight.value,
                            inputs.units.checked,
                            inputs.date.value
                        );
                    } else if (addEditButtonValue === "edit row") {
                        var editRow = WOG.doc.getElementById("editRow");
                        WOG.fillRow(
                            editRow,
                            inputs.exerciseName.value,
                            inputs.reps.value,
                            inputs.weight.value,
                            inputs.units.checked,
                            inputs.date.value
                        );
                        editRow.removeAttribute("id");
                        editRow.lastElementChild.firstElementChild.disabled = false;
                    }
                    WOG.emptyForm();
                } else {
                    console.log("Error in network request: " + xhr.responseText);
                    inputs.exerciseName.value = "NETWORK ERROR";
                }
                WOG.addEditButton.disabled = false;
            });
            xhr.send(JSON.stringify(request));
        }
    });
};

WOG.doc.addEventListener("DOMContentLoaded", WOG.bindAddEdit);