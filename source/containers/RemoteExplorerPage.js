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
import { getDirectoryContents } from "../shared/explorerConnection.js";

function handlePathSelection(nextItem, resetScroll, dispatch, getState) {
    console.log("JAND", ...arguments);
    const currentPath = getCurrentPath(getState());
    const nextPath = nextItem === ".." ?
        removeLastPathItem(currentPath) :
        nextItem;
    dispatch(setLoading(true));
    getDirectoryContents(nextPath)
        .then(contents => dispatch(onReceiveItems(contents)))
        .then(function __afterContentsLoaded() {
            resetScroll();
            dispatch(onChangeDirectory(nextPath));
            dispatch(setLoading(false));
        });
}

function removeLastPathItem(pathStr) {
    const parts = pathStr.split("/");
    const newPath = parts.slice(0, parts.length - 1).join("/").trim();
    return newPath.length > 0 ?
        newPath :
        "/";
}

export default connect(
    (state, ownProps) => ({
        items:                          getCurrentItems(state),
        loading:                        isLoading(state),
        remoteDirectory:                getCurrentPath(state)
    }),
    {
        onPathSelected:                 (remoteItem, scrollResetCB) => (dispatch, getState) =>
                                            handlePathSelection(remoteItem, scrollResetCB, dispatch, getState)
    }
)(RemoteExplorer);
