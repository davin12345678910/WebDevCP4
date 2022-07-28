/*
 * Name: Davin Win Kyi
 * Date: April 17th, 2022
 * Section: CSE 154 AH
 * This is the JavaScript code for my task manager.
 * It gives my website the ability to let users input task in which they
 * want to add into a list, remove from a list, as well as list the list
 * or hide the list if needed
 */

// We will need this for JS files in CSE 154
'use strict';

(function() {
  window.addEventListener('load', init);

  /**
   * Here are all of the program global variables
   */
  let changeFlag = "";

  /**
   * This is the initalization function.
   */
  async function init() {

    /**
     * Disable the buttons in the beginning
     * Here in the beginning you will want to remove all the elements from before
     */
    id('add-button').disabled = true;
    id('remove-button').disabled = true;
    id('list-button').disabled = true;
    let urlList = "/listTasks";
    await fetch(urlList)
      .then(statusCheck)
      .then(res => res.json())
      .then(clearTasks)
      .catch(handleError);

    /**
     * then enable the buttons again over here
     * WE need to get the list, and then remove all of the words in there
     * In the very beginning remember to remove all the past elements
     * in the list, so get the list and remove all of the elements
     */
    id('add-button').disabled = false;
    id('remove-button').disabled = false;
    id('list-button').disabled = false;
    id('add-button').addEventListener('click', changeElement);
    id('remove-button').addEventListener('click', changeElement);
    id('list-button').addEventListener('click', listElements);
    id('hide-list-button').addEventListener('click', hideList);

    // We initally hide the list
    id('task-elements').classList.add('hide_list');
  }

  /**
   * This will allow us to remove the current list of task
   * @param {let} list this will be the list of task in which we need to remove
   * from the list
   */
  async function clearTasks(list) {
    // This isthe list of elmeents in which we will be removing
    let newList = list.list;

    // Here we will go through each of the elements in the list and remove each of them
    for (let i = 0; i < newList.length; i++) {
      let newForm = new FormData();
      newForm.append("task", newList[i]);
      let urlRemove = "/removeTask";

      // Here we will be removing the element through this fetch request
      await fetch(urlRemove, {method: "POST", body: newForm})
        .then(statusCheck)
        .then(res => res.text())
        .catch(handleError);
    }
  }

  /**
   * This wil allow us to add in a task
   */
  function changeElement() {

    // Here we will figure out whether it was an add or a remove that is the change event
    let taskToChange = "";
    if (this.id === 'add-button') {
      taskToChange = id('add-element').value;
      changeFlag = "add";
    } else {
      taskToChange = id('remove-element').value;
      changeFlag = "remove";
    }
    taskToChange = taskToChange.toLowerCase();

    // This is for the case where nothing is inputted
    if (taskToChange === "") {
      changeResponse("No task was inputted!");

    // This is the case when something is inputted
    } else {
      changeCase(changeFlag, taskToChange);
    }
  }

  /**
   * This is where we will be changing the list
   * @param {let} changeVar This will tell us if it is a remove or an add
   * @param {let} taskToChange This is the task which we will be adding or removing
   */
  async function changeCase(changeVar, taskToChange) {
    let newForm = new FormData();
    newForm.append("task", taskToChange);

    /**
     * Here we will get the right url in which we will try to fetch
     */
    let url = "";
    if (changeVar === "add") {
      url = "/addTask";
    } else {
      url = "/removeTask";
    }

    // Here we will add in the element into the tasks list, by sending it through a post
    await fetch(url, {method: "POST", body: newForm})
      .then(statusCheck)
      .then(res => res.text())
      .then(changeResponse)
      .catch(changeError);
  }

  /**
   * This will allow you to give a message after adding a task
   * @param {let} message this is the message in which you will give after adding a task
   */
  function changeResponse(message) {
    const time = 2500;

    /**
     * Here we will get the type
     */
    let type = "";
    if (changeFlag === "add") {
      type = "add";
    } else {
      type = "remove";
    }

    /**
     * Here we will get the message that we will post
     */
    let newP = document.createElement('p');
    if (type === "add") {
      newP.textContent = message + " was added in!";
    } else {
      newP.textContent = message + " was removed!";
    }
    id(type + '-tasks').appendChild(newP);

    /**
     * Here we will give a message for the element added/removed
     * and we wil disable the buttons and input for a bit and then reenable them later
     */
    id(type + '-element').disabled = true;
    id(type + '-button').disabled = true;
    setTimeout(function() {
      newP.remove();
      id(type + '-element').value = "";

      /**
       * Here we will need to update the list, only if it
       * does not have the hide class
       */
      if (!id('task-elements').classList.contains('hide_list')) {
        listElements();
      }

      id(type + '-element').disabled = false;
      id(type + '-button').disabled = false;
    }, time);
  }

  /**
   * this will allow us to give a message for an error in the add case
   * @param {let} message This is the message we will give for the error
   */
  function changeError(message) {
    /**
     * Here we will get the type of change we wanted to make
     * whether it be an add or a remove
     */
    let type = "";
    if (changeFlag === "add") {
      type = "add";
    } else {
      type = "remove";
    }

    /**
     * Here we il be getting the error message to post
     */
    const time = 2500;
    let newP = document.createElement('p');
    let errorMessage = "" + message;
    newP.textContent = errorMessage.split('\n')[0];
    newP.classList.add('error_color');
    id(type + '-tasks').appendChild(newP);

    /**
     * Here we will be disabling the buttons and input when the error message is up
     * and then undisable the buttons and input later
     */
    id(type + '-element').disabled = true;
    id(type + '-button').disabled = true;

    // Here we will post the error message for 2.5 seconds
    setTimeout(function() {
      newP.remove();
      id(type + '-element').value = "";
      id(type + '-element').disabled = false;
      id(type + '-button').disabled = false;
    }, time);
  }

  /**
   * This function will allow you to list elements
   */
  async function listElements() {
    /**
     * We will remove all of the old list, and give the most
     * up to date list
     */

    // You will want to remove the elements that you had from before
    id('task-elements').innerHTML = "";
    id('task-elements').classList.remove('hide_list');

    // Here we will call the fetch for listing the tasks
    let urlList = "/listTasks";
    await fetch(urlList)
      .then(statusCheck)
      .then(res => res.json())
      .then(listTasks)
      .catch(handleError);
  }

  /**
   * This will allow you to list the task that you currently have
   * @param {let} list This is the list where you will be appending its elements
   */
  function listTasks(list) {

    // We will get the new list, and append it
    let newList = list.list;

    /**
     * Here we will append the task in the list one at a time onto the right
     * place on the webapge
     */
    for (let i = 0; i < newList.length; i++) {
      let newTask = document.createElement('p');
      newTask.textContent = newList[i];
      id('task-elements').appendChild(newTask);
    }
  }

  /**
   * This will allow us to  hide the list
   */
  function hideList() {
    id('task-elements').classList.add('hide_list');
  }

  /**
   * This is the message you will get when an error occurs
   */
  function handleError() {
    const time = 2500;

    // Error message that we will put on the webpage
    id('title').textContent = "ERROR FOUND!";
    id('title').classList.add('error_color');

    setTimeout(function() {

      // Here we will need to clear all the input fields
      id('add-element').value = "";
      id('remove-element').value = "";
      id('title').textContent = "Tasks Manager";
      id('title').classList.remove('error_color');

      // We need to refresh all the content
      init();
    }, time);
  }

  /**
   * Here we will check if any errors occured while fetching data
   * @param {let} res This is the json  we will be checking for errors
   * @returns {let} the javascript object if valid and an error if not valid
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }

    // else you will just return the result
    return res;
  }

  /**
   * This allows you to simplfy the amount of work needed to get an element with an id
   * @param {let} id This is the id of the document that we want to get
   * @returns {let} the element with the passed in id
   */
  function id(id) {
    return document.getElementById(id);
  }
})();
