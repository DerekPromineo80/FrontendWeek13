/* Week 13 Assignment By Derek McGuire */
// renderMessageForm.ts



/** IMPORTS */
// importing a named function from main.ts
import { messageTextarea } from "./main.ts";



/** RENDERING & LISTENING */
/**
 * This function updates the message form to match the message data given.
 * It passes in the parameter of "messageData", which is then specified
 * to have a Type of string.
 * The messageTextarea, defined above, uses the ".value"
 * and the parameter of messageData.text is assigned to that.
 * 
 */
export default function renderMessageForm(messageData: { text: string }) {
    messageTextarea.value = messageData.text;
};
