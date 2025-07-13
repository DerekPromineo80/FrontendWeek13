/* Week 13 Assignment By Derek McGuire */
// main.ts
// Week 13 CRD App from Week 12's JavaScript JSON Server / Live Server

/** DESCRIPTION */
/** 
 * This is the Main.ts file
 * This was the primary file in the Vite build
 * Went into the directory for my VS Code workspace
 * Ran the command to "install npm vite@latest" in terminal (VS Code provides)
 * Answer Prompts Y
 * Project name (which becomes the directory): messaging-app
 * Choosing Vanilla framework
 * Choosing TypeScript code
 * Changing Directory into messaging-app
 * Running "npm install"
 * Running "npm run dev", which simulates the build and output to web browser
 * (Week 12 used "Live Server", Week 13 uses "npm run dev")
 * 
 * After successfully running the main.ts file,
 * "Break out" of the functions that can become other ".ts" files
 * 
 * In this, see imports below, from "api.ts" and "renderMessageForm.ts"
 * 
 */



/** IMPORTS */
// CSS style sheet that I made
import "./style.css";
// Bootstrap, which is in node_modules, and notice the double dot "../" to signal change in directory source
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// From TypeScript Files that were broken out
// Importing named functions:
import { deleteMessage, putMessage, postMessage, fetchAllMessages } from "./api.ts";
// Importing a default function:
import renderMessageForm from "./renderMessageForm.ts";



/** STATE */
/** Creating custom Type for Message data from JSON */
type Message = {
  username: string
  sent: any
  read: boolean
  text: string
  id: number
};

// Array of Message Types
let messageList: Array<Message> = [];

// Message ID can be null OR a number (with initial null value)
let messageToEditId: null | number = null;

/**
 * Creating a formattedDate variable in order to display a nice looking date on each message.
 */
const today = new Date();
let month: any = today.getMonth() + 1;
let day: any = today.getDate();
const year = today.getFullYear();
month = month < 10 ? "0" + month: month;
day = day < 10 ? "0" + day: day;
export const formattedDate = `${month}/${day}/${year}`;



/** RENDERING & LISTENING */
// messagesListDiv is the "parent" div that the message data will be populated with
const messagesListDiv = document.getElementById("messages-list") as HTMLDivElement;

// messageTextarea is exported to renderMessageForm; it is the container of data that goes within the messageListDiv
export const messageTextarea = document.getElementById("new-message-text") as HTMLTextAreaElement;

/** The following four lines provide replacement for onclick HTML for the "Save Buttons" */
document.getElementById("save-button-amy")!.addEventListener("click", onSaveMessageClickAmy);
document.getElementById("save-button-brenden")!.addEventListener("click", onSaveMessageClickBrenden);
document.getElementById("save-button-cheryl")!.addEventListener("click", onSaveMessageClickCheryl);
document.getElementById("save-button-dustin")!.addEventListener("click", onSaveMessageClickDustin);

/**
 * This function creates each of the Divs that the message data will populate
 * 
 * Uses the messagesListDiv variable that used the DOM to get Element by an ID, 
 * which then is "typed" using TypeScript "as HTMLDivElement",
 * To make something like an empty string in the innerHTML of that div.
 * 
 * Uses conditional to evaluate if the "messageList" Array has a length of 0,
 * which would mean that there are no items in the array,
 * and if that is true, a message in the innerHTML will display on the web browser "No Messages".
 * If the Array has 1 or more items in it, 
 * The messageList array is mapped with the output of the renderMessage function, 
 * and then using the ".forEach", an arrow function will append what the renderMessage outputs
 * into the messageListDiv area.
 * 
 */
export function renderMessageList() {
    messagesListDiv.innerHTML = "";
    if (messageList.length === 0) {
        messagesListDiv.innerHTML = "No Messages";
    }
    messageList.map(renderMessage).forEach(div => 
        messagesListDiv.appendChild(div)
    );
};

/**
 * This function populates the message data,
 * as well as providing the functionality for edit and delete buttons.
 * The parameter type is a Message, which is defined above, "Typing" a Message Type.
 * Inside the function, a variable is declared that uses DOM to create a div.
 * There are stylings given to that div specifically.
 * Then the innerHTML uses a Template Literal to create the code for each "message block".
 * The Template Literal syntax allows for the items in the Message object 
 * to be specified as specific variables (username, text, sent).
 * The data for these variables will come from the JSON file, or "database".
 * 
 * Then, querySelectors are used to identify the ID's given in the HTML page (index.html),
 * both using "!" to signify that they will not be null, 
 * both using Event listeners that use arrow functions to correspond a click to perform further code.
 * IN both cases, the parameter of the function of the message is passed into the function,
 * the ID of each message (which is supplied by the "database", in this case the JSON)
 * is then used to either Update (PUT) or Delete (DELETE) a message based on it's ID.
 * This ensures that the targeted message for editing or deleting is done on the correct message.
 * 
 * @param message 
 * @returns a div with message data
 */
function renderMessage(message: Message) {
    const messageDiv = document.createElement("div");
    messageDiv.style.width = "500px";
    messageDiv.style.margin = "left";
    messageDiv.style.backgroundColor = "rgb(27,207,207)";
    messageDiv.innerHTML = `
        <h4>${message.username} posted:</h4>
        <h5>${message.text}</h5>
        <p>On ${message.sent}</p>
        <button id="edit-button" class="edinburgh">Edit</button>
        <button id="delete-button" class="manitoba">x</button>
    `;
    
    messageDiv.querySelector("#edit-button")!.addEventListener("click", () => {
        messageToEditId = message.id;
        renderMessageForm(message);
    });

    messageDiv.querySelector("#delete-button")!.addEventListener("click", async () => {
        await deleteMessage(message.id);
        const indexToDelete = messageList.indexOf(message);
        messageList.splice(indexToDelete, 1);
        renderMessageList();
    });
    return messageDiv;
};

// Moved to "renderMessageForm.ts"
/**
 * This function updates the message form to match the message data given.
 * It passes in the parameter of "messageData", which is then specified
 * to have a Type of string.
 * The messageTextarea, defined above, uses the ".value"
 * and the parameter of messageData.text is assigned to that.
 * 
 */
// function renderMessageForm(messageData: { text: string }) {
//     messageTextarea.value = messageData.text;
// };



// 1 of 4 save buttons
/**
 * This function takes the parameter of an Event, or event object,
 * and then immediately uses the ".preventDefault()" to ensure that
 * we get the deisred user interaction instead of a built-in behavior
 * of the web browser.
 * Then, a messageData object is created, with a hard coded username.
 * (Notice that I have four of these functions that are all the same,
 * except for the hard coded username).
 * A conditional "if...else" statement is used to check if the ID of the
 * message that we want to save is null or not. 
 * If it is not equal to null, the update (PUT) is used.
 * If it is queal to null, a message is created (POST).
 * After the conditional, the function renderMessageList() is called,
 * in order to rerender onto the browser,
 * the messageToEditId is set to null,
 * and then the renderMessageForm is used with a text parameter that is a string.
 * (Note that the renderMessageForm is imported as a default function above).
 * 
 * @param event 
 */
async function onSaveMessageClickAmy(event: Event) {
    event.preventDefault();
    const messageData = {
        username: "Amy",
        sent: formattedDate,
        read: false,
        text: messageTextarea.value
    };

    if(messageToEditId !== null) {
        const messageToUpdate = {
            ... messageData,
            id: messageToEditId
        };
        await putMessage(messageToUpdate);
        const indexToReplace = messageList.findIndex(m => m.id === messageToEditId);
        messageList[indexToReplace] = messageToUpdate;
    } else {
        const createdMessage = await postMessage(messageData);
        messageList.push(createdMessage);
    }

    renderMessageList();
    messageToEditId = null;
    renderMessageForm({ text: "" });
};
// End of 1 of 4

// 2 of 4 save buttons
async function onSaveMessageClickBrenden(event: Event) {
    event.preventDefault();
    const messageData = {
        username: "Brenden",
        sent: formattedDate,
        read: false,
        text: messageTextarea.value
    };

    if(messageToEditId !== null) {
        const messageToUpdate = {
            ... messageData,
            id: messageToEditId
        };
        await putMessage(messageToUpdate);
        const indexToReplace = messageList.findIndex(m => m.id === messageToEditId);
        messageList[indexToReplace] = messageToUpdate;
    } else {
        const createdMessage = await postMessage(messageData);
        messageList.push(createdMessage);
    }

    renderMessageList();
    messageToEditId = null;
    renderMessageForm({ text: "" });
};
// End of 2 of 4

// 3 of 4 save buttons
async function onSaveMessageClickCheryl(event: Event) {
    event.preventDefault();
    const messageData = {
        username: "Cheryl",
        sent: formattedDate,
        read: false,
        text: messageTextarea.value
    };

    if(messageToEditId !== null) {
        const messageToUpdate = {
            ... messageData,
            id: messageToEditId
        };
        await putMessage(messageToUpdate);
        const indexToReplace = messageList.findIndex(m => m.id === messageToEditId);
        messageList[indexToReplace] = messageToUpdate;
    } else {
        const createdMessage = await postMessage(messageData);
        messageList.push(createdMessage);
    }

    renderMessageList();
    messageToEditId = null;
    renderMessageForm({ text: "" });
};
// End of 3 of 4

// 4 of 4 save buttons
async function onSaveMessageClickDustin(event: Event) {
    event.preventDefault();
    const messageData = {
        username: "Dustin",
        sent: formattedDate,
        read: false,
        text: messageTextarea.value
    };

    if(messageToEditId !== null) {
        const messageToUpdate = {
            ... messageData,
            id: messageToEditId
        };
        await putMessage(messageToUpdate);
        const indexToReplace = messageList.findIndex(m => m.id === messageToEditId);
        messageList[indexToReplace] = messageToUpdate;
    } else {
        const createdMessage = await postMessage(messageData);
        messageList.push(createdMessage);
    }

    renderMessageList();
    messageToEditId = null;
    renderMessageForm({ text: "" });
};
// End of 4 of 4



// Moved this to API.ts
// /** FETCHING */
// /**
//  * This function essentially peforms the "GET" on the JSON database.
//  * It uses an asyncrhonous function that awaits the fetching of the URL,
//  * which in this case points to the JSON file,
//  * then assigns that value to the response variable,
//  * and then returns that using .json() as well.
//  */
// export async function fetchAllMessages() {
//     const response = await fetch("http://localhost:3000/messages");
//     return response.json();
// };

// /**
//  * This function uses the POST or CREATE the message; 
//  * everything except id which will be provided by database (JSON)
//  */
// export async function postMessage(newMessageData: { username: string, sent: string, read: boolean, text: string }) {
//     const response = await fetch("http://localhost:3000/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newMessageData)
//     });
//     return response.json();
// };

// /**
//  * This function uses the PUT or UPDATE to make changes to an existing message, 
//  * will not change ID, so we add that in the concatenation of the parameter,
//  * and then ".id" to select the ID.
//  */
// export async function putMessage(updatedMessage: Message) {
//     await fetch("http://localhost:3000/messages/" + updatedMessage.id, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedMessage)
//     });
// };

// /**
//  * This function uses DELETE to delete the message from the backend using the ID.
//  * The idToDelete is passed in as a parameter, "typed" as a number, and then
//  * concatenated to the URL for the JSON.
//  */
// export async function deleteMessage(idToDelete: number) {
//     await fetch("http://localhost:3000/messages/" + idToDelete, {
//         method: "DELETE"
//     });
// };



/** START UP */
/**
 * This function actually runs the functions that will be communicating with the database
 */
async function startUp() {
    renderMessageList();
    messageList = await fetchAllMessages();
    renderMessageList();
};

// Instance of the function being called
startUp();


