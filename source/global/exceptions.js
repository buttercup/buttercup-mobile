import { executeNotification } from "./notify.js";

export function handleError(message, error) {
    executeNotification(
        "error",
        `Error: ${message}`,
        typeof error === "string" ? error : error.message
    );
}
