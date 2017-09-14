import ActionSheet from '@yfuks/react-native-action-sheet';
import { lockAllArchives } from "./archives.js";
import { dispatch } from "../store.js";
import { navigateToAddArchive, navigateToNewEntry } from "../actions/navigation.js";

const SHEET_ADD_ARCHIVE =                       "Add";
const SHEET_ADD_ENTRY =                         "New Entry";
const SHEET_ADD_GROUP =                         "New Group";
const SHEET_DELETE_GROUP =                      "Delete Group";
const SHEET_LOCK_ALL =                          "Lock All";
const SHEET_RENAME_GROUP =                      "Rename Group";
const SHEET_CANCEL =                            "Cancel";

const ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS = [
    SHEET_ADD_ENTRY,
    SHEET_ADD_GROUP,
    SHEET_DELETE_GROUP,
    SHEET_RENAME_GROUP,
    SHEET_CANCEL
];
const ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS = [
    SHEET_ADD_ARCHIVE,
    SHEET_LOCK_ALL,
    SHEET_CANCEL
];

export function showArchiveContentsAddItemSheet(showEntryAdd) {
    const buttons = [ ...ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS ];
    if (!showEntryAdd) {
        buttons.shift();
    }
    ActionSheet.showActionSheetWithOptions(
        {
            options: buttons,
            cancelButtonIndex: buttons.indexOf(SHEET_CANCEL),
            title: "Edit group"
        },
        selectedIndex => {
            switch(buttons[selectedIndex]) {
                case SHEET_ADD_ENTRY: {
                    dispatch(navigateToNewEntry());
                    break;
                }
                case SHEET_ADD_GROUP: {

                    break;
                }
                case SHEET_DELETE_GROUP: {
                    break;
                }
                case SHEET_RENAME_GROUP: {
                    break;
                }
            }
        }
    );
}

export function showArchivesPageRightSheet() {
    ActionSheet.showActionSheetWithOptions(
        {
            options: ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS,
            cancelButtonIndex: ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS.indexOf(SHEET_CANCEL),
            title: "Archives"
        },
        selectedIndex => {
            switch(ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS[selectedIndex]) {
                case SHEET_ADD_ARCHIVE: {
                    dispatch(navigateToAddArchive());
                    break;
                }
                case SHEET_LOCK_ALL: {
                    lockAllArchives();
                    break;
                }
            }
        }
    );
}
