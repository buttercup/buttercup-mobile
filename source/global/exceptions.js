import { executeNotification } from "./notify.js";

export function handleError(message, error) {
    console.log("Error:", error);
    executeNotification(
        "error",
        `Error: ${message}`,
        typeof error === "string" ? error : error.message
    );
}
