(document).ready(function() {
    let addToDoButton = document.getElementById("addToDo");
    let wipeDataBtn = document.getElementById("wipe-button")
    let toDoContainer = document.getElementById("toDoContainer");
    let inputField = document.getElementById('inputField');
    let completedList = document.getElementById('completed-list');
    let itemArray;
    let currentTheme;

    // let itemArrayJson=JSON.stringify(itemArray) //remember to redefine in function.
    //an array of OBJECTS that we will need to stringify before setting to localStroage, and parse() when getting from local storage
    let assignId;
    
    
    //increment with every addItem() to use for each new item's data Object, with keys for complete/incomplete, task string, and ID.
    //assignId must be STORED or else they'll duplicate starting from 0 every session.
    //Next is class constructor

    
    function item(task, id, complete) {
        this.task = task;
        this.id = id;
        this.complete = complete
    }
    if (localStorage.getItem('storage') && localStorage.getItem('storage') != "placeholder") { //Potential error here: When we parse, if it's NOT in array form, it's invalid.
        itemArray = JSON.parse(localStorage.getItem('storage')) //reclaim itemArray progress from prev session.
        assignId = localStorage.getItem("idMaster") //continuity of ID number sequence across sessions.
        for (i = 0; i < itemArray.length; i++) { //run render once per item rendered, NOT once, with a wrapped loop inside render().
            render(itemArray)
        }
    } else {
        itemArray = [] //can't define above, because it will cause errors if there IS local storage value, bc we'd push an array into an array. Not what we want.
        assignId = 0 //if no data, we start IDs from 0
        localStorage.setItem('storage', "placeholder") //If there is local storage do nothing.
    } //If there isn't localStorage data yet, then we need to DECLARE it here so that when we reference it to redefine below, it exists.


    function addItem() {
        if (inputField.value.length > 0) {
            console.log(inputField.value.length)
            console.log($(".container").length)
                //Save to localStorage via initemArray
            var currentItem = new item(inputField.value, assignId, false) //false needs to toggle when checked off
            itemArray.push(currentItem)
            itemArrayJson = JSON.stringify(itemArray)
                // itemArrayJson = itemArrayJson.substring(1, itemArrayJson.length-1) //cuts off the brackets, so that we aren't pushing an array, but just the objects.
                //Overwriting the value of the 'storage' key.
            localStorage.setItem('storage', itemArrayJson) //repeat this below on whe itemArray is updated, because otherwise changes won't carry over

            var deleteButton = document.createElement("button")
            deleteButton.classList.add("delete-btn")
            deleteButton.classList.add("inviso")
            deleteButton.textContent = "X"
            deleteButton.addEventListener("click", function() {
                    if (localStorage.getItem('storage') && localStorage.getItem('storage') != "placeholder") {
                        itemArray = JSON.parse(localStorage.getItem('storage')) //GET Current data
                    }
                    itemArray.forEach(function(obj, ind) {
                            if (obj.task + "X" == event.target.parentElement.innerText) {
                                itemArray.splice(ind, 1)
                                var tempArray = JSON.stringify(itemArray)
                                localStorage.setItem('storage', tempArray) //and SET modified local storage array.

                            }
                        })
                        //Now we just visually delete the htmo element

                    event.target.parentElement.remove();
                })
                //Create paragraph element to hold text and buttons as parent
            var paragraph = document.createElement("p")
            paragraph.innerText = inputField.value
            paragraph.classList.add("paragraph-styling")
            paragraph.addEventListener("mouseover", function() {
                deleteButton.classList.remove("inviso")

            })
            paragraph.addEventListener("mouseleave", function() {
                deleteButton.classList.add("inviso")
            })
            inputField.value = "" //clear input field after add

            //create checkbox to toggle complete/incomplete
            var checkbox = document.createElement("button") //create checkbox-style button

            checkbox.classList.add("checkbox") //add checkbox class for style
            checkbox.addEventListener("click", function() { //HERE we're using event delegation to add event listener if/else to handle clicks BEFORE adding checkbox to DOM
                if ($(event.target).hasClass("checked-off") == false) { //if you use a jquery method like hasClass, need to use jQuery selector style with $()
                    //First edit renders
                    paragraph.classList.add("completed-task") //CHECKS entire item, btnPlusText
                    event.target.classList.add("checked-off") //"fills" checkbox with black background

                    //Second edit itemArray object value so it stores that information and renders accurately on next session

                    document.getElementById("complete-list").appendChild(paragraph)
                } else {
                    //First, edit renders
                    paragraph.classList.remove("completed-task") //CHECKS entire item, btnPlusText
                    event.target.classList.remove("checked-off") //"fills" checkbox with black background

                    //Second, Edit object value in itemArray

                    document.getElementById("incomplete-list").appendChild(paragraph)
                }
                toggleComplete(paragraph, checkbox)
            })
            toDoContainer.appendChild(paragraph)
            paragraph.insertAdjacentElement("afterbegin", checkbox) //adds checkbox to DOM next to paragraph list item on left as FIRST CHILD. Note this is done AFTER its event listner is set.
            paragraph.insertAdjacentElement("beforeend", deleteButton) //adds deleteButton to DOM next to paragraph list item on right as LAST CHILD. Note this is done AFTER its event listner is set.
        }
        assignId++ //increments the ID so that no 2 items have the same ID. This makes upkeep of localStorage array better..
        localStorage.setItem("idMaster", assignId) //in conditional above, IF data, we set this as the stored value. If not, assignId = 0.

        //The Next function is attaching event listeners to each CHECKBOX button. the comparison for whether the clicked button's parent <p> innertext == the obj.task is so that we can compare that obj.task to the text
        let allCheckboxes = document.querySelectorAll(".checkbox") //when we find the match, THEN we if/else according to whether it should assign complete: true or false. This scope should accurately assess, bc we put the tests UNDER the forEach, not the inverse.
        allCheckboxes.forEach(function(button) { //each button has this called individually every time an item is added.
                button.addEventListener("click", function() { //on click of this instance of button in foreach...
                    itemArray.forEach(function(obj) { //NOW we call another forEach, which will compare this particular button text value, with every itemArray obj.task
                        if (obj.task + "X" == event.target.parentElement.innerText) { //if obj.task == THIS PARTICULAR button's innerText(plus 'X' for the X text in the delete btn)
                            if ($(event.target).hasClass("checked-off")) { //and IF checked-off, we toggle to false, for incomplete
                                obj.complete = true
                            } else {
                                obj.complete = false //ELSE, we toggle to true, for complete..THIS works. The IF doesn't...
                            }
                        }
                        itemArrayJson = JSON.stringify(itemArray)

                        localStorage.setItem('storage', itemArrayJson) //repeating update per item changed.
                    })

                })
            }) //END allCheckbox function

    }
    // NEW SESSIONS-Render Items Onscreen (WITH Event Delegation) from localStorage objects carried over
    // Only called if localStorage has storage value
    function render(array) { //IS ITEMARRAY GETTING THE RIGHT VALUES? We should try pulling our conditionals for initial load from localStorage, NOT itemArray.
        //HERE! I think itemArray is out of scope. It's defined within an if statement, I'm not sure if it's accurate. Pull from localStorage
        var taskValue = array[i].task //these Are pulling corrctly.............
        var completionValue = array[i].complete
        var paragraph = document.createElement("p")

        paragraph.innerText = taskValue;
        paragraph.classList.add("paragraph-styling")
        paragraph.addEventListener("mouseover", function() {
            deleteButton.classList.remove("inviso")

        })
        paragraph.addEventListener("mouseleave", function() {
            deleteButton.classList.add("inviso")
        })
        inputField.value = "" //clear input field after add

        //create deleteButton with .delete class to target with :hover psuedo selector.
        var deleteButton = document.createElement("button")
        deleteButton.classList.add("delete-btn")
        deleteButton.classList.add("inviso")
        deleteButton.textContent = "X"
        deleteButton.addEventListener("click", function() {
            event.target.parentElement.remove();
        })


        //create checkbox to toggle complete/incomplete
        var checkbox = document.createElement("button") //create checkbox-style button

        checkbox.classList.add("checkbox") //add checkbox class for style
        checkbox.addEventListener("click", function() { //HERE we're using EVENT DELEGATION to add event listener if/else to handle clicks BEFORE adding checkbox to DOM

            if (completionValue == false) {
                completionValue = true // need to change actual value, not just rendered elemnts
                checkbox.parentElement.classList.add("completed-task") //CHECKS entire item, btnPlusText.. in render() this doesn't reset so i remains 4, meaning
                event.target.classList.add("checked-off") //"fills" checkbox with black background
                document.getElementById("complete-list").appendChild(paragraph)

            } else {
                completionValue = false; //if its true, then it must toggle to false on click.
                checkbox.parentElement.classList.remove("completed-task") //This is always targeting the last item.
                event.target.classList.remove("checked-off") //This targets correctly.
                document.getElementById("incomplete-list").appendChild(paragraph)
            }

        })
        if (completionValue == true) { //this handles the rendering on initial load, not on click.
            paragraph.classList.add("completed-task") //CHECKS entire item, btnPlusText.. in render() this doesn't reset so i remains 4, meaning
            checkbox.classList.add("checked-off") //"fills" checkbox with black background
            document.getElementById("complete-list").appendChild(paragraph)
        } else {
            document.getElementById("incomplete-list").appendChild(paragraph)
        }
        paragraph.insertAdjacentElement("afterbegin", checkbox) //adds checkbox to DOM next to paragraph list item on left as FIRST CHILD. Note this is done AFTER its event listner is set.
        paragraph.insertAdjacentElement("beforeend", deleteButton) //adds deleteButton to DOM next to paragraph list item on right as LAST CHILD. Note this is done AFTER its event listner is set.

        //The Next function is attaching event listeners to each checkbox button. the comparison for whether the clicked button's parent <p> innertext == the obj.task is so that we can compare that obj.task to the text
        let allCheckboxes = document.querySelectorAll(".checkbox") //when we find the match, THEN we if/else according to whether it should assign complete: true or false. This scope should accurately assess, bc we put the tests UNDER the forEach, not the inverse.
        itemArray = JSON.parse(localStorage.getItem('storage'))
        allCheckboxes.forEach(function(button) { //each button has this called individually every time an item is added.
                button.addEventListener("click", function() { //on click of this instance of button in foreach...
                    itemArray.forEach(function(obj) { //NOW we call another forEach, which will compare this particular button text value, with every itemArray obj.task
                        if (obj.task + "X" == event.target.parentElement.innerText) { //if obj.task == THIS PARTICULAR button's innerText(plus 'X' for the X text in the delete btn)
                            if ($(event.target).hasClass("checked-off")) { //and IF checked-off, we toggle to false, for incomplete
                                obj.complete = true
                            } else {
                                obj.complete = false //ELSE, we toggle to true, for complete..THIS works. The IF doesn't...
                            }
                        }
                        itemArrayJson = JSON.stringify(itemArray)

                        localStorage.setItem('storage', itemArrayJson) //repeating update per item changed.
                    })

                })
            }) //END allCheckbox function

        //DELETION attach event listeners to all rendered buttons for Local Storage Update for deletion of items.
        document.querySelectorAll(".delete-btn").forEach(function(btn) {

            btn.addEventListener("click", function() {

                itemArray = JSON.parse(localStorage.getItem('storage')) //GET Current data
                itemArray.forEach(function(obj, ind) {
                    if (obj.task + "X" == event.target.parentElement.innerText) {

                        itemArray.splice(ind, 1)
                        var tempArray = JSON.stringify(itemArray)
                        localStorage.setItem('storage', tempArray) //and SET modified local storage array.
                    }
                })
            })

        })

    } //END Render

    //Named Function to toggle completion value in storage.complete key
    function toggleComplete(p, checkbox) { //adjust itemArray object boolean value for
        itemArray.forEach(function(obj) {
                if (obj.task == p.textContent && $(checkbox).hasClass("checked-off")) {
                    obj.complete == true;
                }
            }) //key: complete: T/F
            //occurs on every CHECKBOX CLICK EVENT.

    }

    function themeCode() {
        document.querySelector("img").removeAttribute("src")
        document.querySelector("img").setAttribute("src", "images/code.png")
        document.querySelector("body").classList.remove("actionBody")
        document.querySelector("body").classList.add("codeBody")
        document.querySelector("html").classList.remove("actionBody")
        document.querySelector("html").classList.add("codeBody")
        document.querySelector(".container").classList.remove("actionContainer")
        document.querySelector(".container").classList.add("codeContainer")
        document.querySelector("#title").classList.remove("actionTitle")
        document.querySelector("#title").classList.add("codeHeading")
        document.querySelector("h1").classList.remove("actionToDo")
        document.querySelector("h1").classList.add("codeToDo")

        document.querySelector("#wipe-button").classList.remove("actionButtons")
        document.querySelector("#wipe-button").classList.add("codeButtons")
        document.querySelector("#addToDo").classList.remove("actionButtons")
        document.querySelector("#addToDo").classList.add("codeButtons")
        document.querySelectorAll(".anton").forEach(function(n) { n.classList.add("codeFont") })
        document.querySelectorAll(".codeFont").forEach(function(n) { n.classList.remove("anton") })
        currentTheme = "dark"
        localStorage.setItem("theme", currentTheme)
    }

    function themeAction() {
        document.querySelector("img").removeAttribute("src")
        document.querySelector("img").setAttribute("src", "images/action.png")
        document.querySelector("body").classList.add("actionBody")
        document.querySelector("body").classList.remove("codeBody")
        document.querySelector("html").classList.add("actionBody")
        document.querySelector("html").classList.remove("codeBody")
        document.querySelector(".container").classList.add("actionContainer")
        document.querySelector(".container").classList.remove("codeContainer")
        document.querySelector("#title").classList.add("title")
        document.querySelector("#title").classList.remove("codeHeading")
        document.querySelector("h1").classList.add("actionToDo")
        document.querySelector("h1").classList.remove("codeToDo")
        document.querySelector("#wipe-button").classList.add("actionButtons")
        document.querySelector("#wipe-button").classList.remove("codeButtons")
        document.querySelector("#addToDo").classList.add("actionButtons")
        document.querySelector("#addToDo").classList.remove("codeButtons")
        document.querySelector("#themeToggler").classList.remove("themeCodeButton")
        document.querySelector("#themeToggler").classList.add("themeActionButton")
        document.querySelectorAll(".codeFont").forEach(function(n) { n.classList.add("anton") })
        document.querySelectorAll(".anton").forEach(function(n) { n.classList.remove("codeFont") })



        //Now, Store This Preference
        currentTheme = "action"
        localStorage.setItem("theme", currentTheme)
    }


    //Event Listeners
    addToDoButton.addEventListener("click", function() {
        addItem();
    })

    document.addEventListener("keydown", function() {
        if (event.keyCode === 13) {
            addItem();
        }
    })

    wipeDataBtn.addEventListener("click", function() {
        localStorage.removeItem("storage") //previously was localStorage.clear() but changed to save theme data
        document.querySelectorAll(".paragraph-styling").forEach(e => e.remove());
        location.reload(); //so that addItems() don't reappear, if you add more items after clearing, and before leaving session.
    })

    document.querySelector("#themeToggler").addEventListener("click", function() {
        if ($(event.target).hasClass("themeActionButton")) {
            themeCode()
        } else {
            themeAction()
        }
    })

    //Final item is rendering last used themeCode
    if (localStorage.getItem("theme") == "dark") {
        themeCode()
    }
}) //jQuery document.ready() wrapper END