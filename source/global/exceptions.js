import { executeNotification } from "./notify.js";

export function handleError(message, error) {
    console.log(error);
    executeNotification(
        "error",
        `Error: ${message}`,
        typeof error === "string" ? error : error.message
    );
}
