import { EntryType } from "buttercup";

export function humanReadableEntryType(type: EntryType): string {
    switch (type) {
        case EntryType.CreditCard:
            return "Credit Card";
        case EntryType.Login:
            return "Login";
        case EntryType.Note:
            return "Note";
        case EntryType.SSHKey:
            return "SSH Key";
        case EntryType.Website:
            return "Website";
        default:
            return type;
    }
}
