import ActionSheet from '@yfuks/react-native-action-sheet';
import { Actions } from "react-native-router-flux";
import { lockAllArchives } from "./archives.js";

const SHEET_ADD_ARCHIVE =                       "Add";
const SHEET_LOCK_ALL =                          "Lock All";
const SHEET_CANCEL =                            "Cancel";

const ARCHIVES_PAGE_RIGHT_SHEET_BUTTONS = [
    SHEET_ADD_ARCHIVE,
    SHEET_LOCK_ALL,
    SHEET_CANCEL
];

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
