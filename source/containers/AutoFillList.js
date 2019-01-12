import { connect } from "react-redux";
import AutoFillList from "../components/AutoFillList";
import { getArchivesDisplayList } from "../selectors/archives";
import { getEntry } from "../shared/entry";
import { setBusyState } from "../actions/app";
import { getBusyState } from "../selectors/app.js";
import { getConnectedStatus } from "../global/connectivity";
import { unlockSource } from "../shared/archiveContents";
import { getSharedArchiveManager } from "../library/buttercup";
import { completeAutoFillWithEntry } from "../shared/autofill";
import {
    getKeychainCredentialsFromTouchUnlock,
    touchIDEnabledForSource
} from "../shared/touchUnlock";
import { handleError } from "../global/exceptions";
import { getMatchingEntriesForURLs } from "../shared/entries";

const unlockAllTouchEnabledArchives = () => dispatch => {
    dispatch(setBusyState("Unlocking All Archives"));
    // Find all the sources that have TouchID Enabled
    const sources = getSharedArchiveManager().sourcesList;
    return Promise.all(sources.map(source => touchIDEnabledForSource(source.id))).then(results => {
        // Build a list of source that need to be unlock
        let sourceIDsToUnlock = [];
        results.forEach((enabled, index) => {
            if (enabled) {
                sourceIDsToUnlock.push(sources[index].id);
            }
        });

        if (sourceIDsToUnlock.length) {
            // First check if we can access the Keychain (maybe the user disabled access?)
            return getKeychainCredentialsFromTouchUnlock()
                .then(keychainCreds => {
                    // Great we're in, now check for internet and unlock
                    dispatch(setBusyState("Checking Connection"));
                    return getConnectedStatus().then(connected => {
                        dispatch(setBusyState("Unlocking"));
                        if (!connected) {
                            throw new Error("Failed unlocking: Device not online");
                        }

                        dispatch(setBusyState("Unlocking"));
                        let unlockPromises = [];
                        Object.keys(keychainCreds).forEach(sourceID => {
                            if (sourceIDsToUnlock.indexOf(sourceID) > -1) {
                                unlockPromises.push(
                                    unlockSource(sourceID, keychainCreds[sourceID])
                                );
                            }
                        });

                        return Promise.all(unlockPromises);
                    });
                })
                .then(unlockResults => {
                    // success!
                    dispatch(setBusyState(null));
                });
        } else {
            throw new Error("Failed unlocking: No Touch Enabled Archives Found");
        }
    });
};

const getInitialEntries = screenProps => {
    if (screenProps.serviceIdentifiers !== undefined) {
        // AutoFill UI Started with a list of URLs to prioritize potential credentials with
        return getMatchingEntriesForURLs(screenProps.serviceIdentifiers);
    } else if (screenProps.credentialIdentity !== undefined) {
        // AutoFill UI Started due to failure to find match from QuickBar suggestion
        // @TODO!
    }

    return [];
};

export default connect(
    (state, ownProps) => ({
        archives: getArchivesDisplayList(state),
        busyState: getBusyState(state),
        initialEntries: getInitialEntries(ownProps.screenProps)
    }),
    {
        onEntryPress: (entryID, sourceID) => {
            const entry = getEntry(sourceID, entryID);
            console.log(entry);
            completeAutoFillWithEntry(entry);
        },
        unlockAllArchives: () => dispatch => {
            return dispatch(unlockAllTouchEnabledArchives()).catch(error => {
                dispatch(setBusyState(null));
                handleError("Unlocking failed", error);
            });
        }
    }
)(AutoFillList);
