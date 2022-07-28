/*
 * Name: Davin Win Kyi
 * Date: April 17th, 2022
 * Section: CSE 154 AH
 * This is the JavaScript server code for my tasks manager.
 * This will return response to a clients want to add, remove, or list things
 *
 * Some important functions are:
 * - addTasks - it is a post request which allows you to add tasks to your list
 * - removeTasks - it is a post request which allows you to remove tasks from your list
 *    * you can remove tasks
 * - listTasks - it is a get request which allows you to list tasks
 */

// We will need this for JS files in CSE 154
"use strict";

const express = require('express');
const app = express();

// For multer:
const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// First start off with no elements in the tasks_list
let TASKS_LIST = [];
let TASK_SIZE = 0;

/**
 * This will add a task to the list of tasks we currently have
 * @param {let} req this is the request in which we can get client information from
 * @param {let} res this is the response in which we will be sending
 * @param {let} task this is the task we will be adding to the list
 * @return {let} the task that was added
 */
app.post('/addTask', (req, res) => {
  const error = 400;
  let task = req.body.task;
  if (task) {
    if (TASKS_LIST.indexOf(task) !== -1) {
      res.type('text').status(error)
        .send("Element has already been added!");
    } else {
      // This is where we will add a task into the list
      TASKS_LIST[TASK_SIZE] = task;
      TASK_SIZE++;

      // WE will send back the task in which we added in
      res.type('text').send(task);
    }
  } else {
    res.type('text')
      .status(error)
      .send("Body paramaters were not set for post request!");
  }
});

/**
 * This will remove a task to the list of tasks we currently have
 * @param {let} req this is the request in which we can get client information from
 * @param {let} res this is the response in which we will be sending
 * @param {let} task this is the task we will be removing from the list
 * @return {let} the task that was removed
 */
app.post('/removeTask', (req, res) => {
  const error = 400;
  let task = req.body.task;
  if (task) {
    if (TASKS_LIST.indexOf(task) === -1) {
      res.type('text').status(error)
        .send('Tasks is not in list!');
    } else {
      // Removing an element
      removeFromArray(task);

      // We will send back the task in which we removed
      res.type('text').send(task);
    }
  } else {
    res.type('text')
      .status(error)
      .send("Body paramaters were not set for post request!");
  }
});

/**
 * This will remove from the array
 *  @param {let} task This is the task we will be removing
 */
function removeFromArray(task) {
  if (TASKS_LIST.indexOf(task) > 0) {
    TASKS_LIST.splice(TASKS_LIST.indexOf(task), TASKS_LIST.indexOf(task));
  } else {
    TASKS_LIST.shift();
  }

  TASK_SIZE--;
}

/**
 * This will allow us to get our current list of tasks
 * @param {let} req this is the request in which we will be setting
 * @param {let} res this is the response in which we will be sending
 * @return {let} a json opf the list
 */
app.get('/listTasks', (req, res) => {

  /**
   * No need to error check as there are no parameters
   * and queries that we need to worry about
   * Here you will be sending back the list to the user
   */
  res.type('json').send({"list": TASKS_LIST});
});

/**
 * You want to have a constant port, so
 * that you listen from many different PORTS
 */
app.use(express.static('public'));

const defaultPort = 8000;

const PORT = process.env.PORT || defaultPort;

app.listen(PORT);