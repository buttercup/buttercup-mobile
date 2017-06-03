import { connect } from "react-redux";
import RemoteExplorer from "../components/RemoteExplorerPage.js";
import {
    getCurrentItems,
    getCurrentPath,
    isLoading
} from "../selectors/RemoteExplorerPage.js";
import {
    onChangeDirectory,
    onReceiveItems,
    setLoading
} from "../actions/RemoteExplorerPage.js";
import { joinRemotePath } from "../library/remote.js";
import { getDirectoryContents } from "../shared/explorerConnection.js";

function handlePathSelection(nextItem, dispatch, getState) {
    dispatch(setLoading(true));
    getDirectoryContents(nextItem)
        .then(contents => dispatch(onReceiveItems(contents)))
        .then(function __afterContentsLoaded() {
            dispatch(onChangeDirectory(nextItem));
            dispatch(setLoading(false));
        });
}

export default connect(
    (state, ownProps) => ({
        items:                          getCurrentItems(state),
        loading:                        isLoading(state),
        remoteDirectory:                getCurrentPath(state)
    }),
    {
        onPathSelected:                 (remoteItem) => (...args) => handlePathSelection(remoteItem, ...args)
    }
)(RemoteExplorer);
