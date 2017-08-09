import ActionSheet from '@yfuks/react-native-action-sheet';
import { Actions } from "react-native-router-flux";
import { lockAllArchives } from "./archives.js";

const SHEET_ADD_ARCHIVE =                       "Add";
const SHEET_ADD_ENTRY =                         "New Entry";
const SHEET_ADD_GROUP =                         "New Group";
const SHEET_LOCK_ALL =                          "Lock All";
const SHEET_CANCEL =                            "Cancel";

const ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS = [
    SHEET_ADD_ENTRY,
    SHEET_ADD_GROUP,
    SHEET_CANCEL
];
const ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS = [
    SHEET_ADD_ARCHIVE,
    SHEET_LOCK_ALL,
    SHEET_CANCEL
];

export function showArchiveContentsAddItemSheet() {
    ActionSheet.showActionSheetWithOptions(
        {
            options: ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS,
            cancelButtonIndex: ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS.indexOf(SHEET_CANCEL),
            title: "Add to group"
        },
        selectedIndex => {
            switch(ARCHIVE_CONTENTS_ADD_ITEM_SHEET_BUTTONS[selectedIndex]) {
                case SHEET_ADD_ENTRY: {

                    break;
                }
                case SHEET_ADD_GROUP: {

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
                    Actions.addArchive();
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
