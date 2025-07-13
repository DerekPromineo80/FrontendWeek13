/* Week 13 Assignment By Derek McGuire */
// api.ts



/** STATE */
/** Copy of Type */
type Message = {
  username: string
  sent: any
  read: boolean
  text: string
  id: number
};



/** FETCHING */
/**
 * This function essentially peforms the "GET" on the JSON database.
 * It uses an asyncrhonous function that awaits the fetching of the URL,
 * which in this case points to the JSON file,
 * then assigns that value to the response variable,
 * and then returns that using .json() as well.
 */
export async function fetchAllMessages() {
    const response = await fetch("http://localhost:3000/messages");
    return response.json();
};

/**
 * This function uses the POST or CREATE the message; 
 * everything except id which will be provided by database (JSON)
 */
export async function postMessage(newMessageData: { username: string, sent: string, read: boolean, text: string }) {
    const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessageData)
    });
    return response.json();
};

/**
 * This function uses the PUT or UPDATE to make changes to an existing message, 
 * will not change ID, so we add that in the concatenation of the parameter,
 * and then ".id" to select the ID.
 */
export async function putMessage(updatedMessage: Message) {
    await fetch("http://localhost:3000/messages/" + updatedMessage.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedMessage)
    });
};

/**
 * This function uses DELETE to delete the message from the backend using the ID.
 * The idToDelete is passed in as a parameter, "typed" as a number, and then
 * concatenated to the URL for the JSON.
 */
export async function deleteMessage(idToDelete: number) {
    await fetch("http://localhost:3000/messages/" + idToDelete, {
        method: "DELETE"
    });
};

