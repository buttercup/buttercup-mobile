import { EntryType, EntryURLType, PropertyKeyValueObject, getEntryURLs } from "buttercup";
import { extractDomain } from "./url";

export function getEntryDomain(entryProperties: PropertyKeyValueObject): string | null {
    const [url] = [
        ...getEntryURLs(entryProperties, EntryURLType.Icon),
        ...getEntryURLs(entryProperties, EntryURLType.Any)
    ];
    return url ? extractDomain(url) : null;
}

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
