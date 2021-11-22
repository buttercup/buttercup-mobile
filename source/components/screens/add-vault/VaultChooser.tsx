import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
    Button,
    Icon,
    List,
    ListItem,
    StyleService,
    useStyleSheet
} from "@ui-kitten/components";
import prettyBytes from "pretty-bytes";
import { getCurrentInterface } from "../../../services/fileBrowser";
import { setBusyState } from "../../../services/busyState";
import { notifyError } from "../../../library/notifications";
import { TextPrompt } from "../../prompts/TextPrompt";
import { VaultChooserItem } from "../../../types";

interface FSItem {
    title: string;
    subtitle: string;
    icon: string;
    path: VaultChooserItem;
    isNew: boolean;
}

interface VaultChooserListItem {
    item: FSItem;
}

interface VaultChooserProps {
    onSelectVault: (path: VaultChooserItem) => void;
}

const AddVaultIcon = props => <Icon {...props} name="file-add-outline" />;
const AddFolderIcon = props => <Icon {...props} name="folder-add-outline" />;

const styles = StyleSheet.create({
    listContainer: {},
    card: {
        flex: 1,
        padding: 0
    },
    contentContainer: {},
    item: {
      marginVertical: 4,
    },
    pathActionButton: {
        marginTop: 6
    }
});

const themedStyles = StyleService.create({
    selectedItem: {
        backgroundColor: "color-primary-default"
    }
});

function renderItemIcon(props, icon) {
    return (
        <Icon {...props} name={icon} />
    );
}

function resultSorter(a: VaultChooserItem, b: VaultChooserItem): number {
    if (a.type === "directory" && b.type !== "directory") {
        return -1;
    } else if (b.type === "directory" && a.type !== "directory") {
        return 1;
    }
    return a.name < b.name ? -1 : b.name < a.name ? 1 : 0;
}

export function VaultChooser(props: VaultChooserProps) {
    const { onSelectVault } = props;
    const fsInterface = useMemo(getCurrentInterface, []);
    const [items, setItems] = useState<Array<FSItem>>([]);
    const [currentPath, setCurrentPath] = useState<VaultChooserItem>(null);
    const [selectedPath, setSelectedPath] = useState<VaultChooserItem>(null);
    const [parentPaths, setParentPaths] = useState<Array<VaultChooserItem>>([]);
    const [promptNewFile, setPromptNewFile] = useState(false);
    const [promptNewFolder, setPromptNewFolder] = useState(false);
    const themeStyles = useStyleSheet(themedStyles);
    const handleItemSelect = useCallback((info: VaultChooserListItem) => {
        if (!info.item.path || info.item.path.type === "directory") {
            setSelectedPath(null);
            onSelectVault(null);
            if (info.item.path === null) {
                const newParentPaths = [...parentPaths];
                const parentPath = newParentPaths.pop();
                setParentPaths(newParentPaths);
                setCurrentPath(parentPath);
            } else {
                setParentPaths([
                    ...parentPaths,
                    currentPath
                ]);
                setCurrentPath(info.item.path);
            }
        } else if (info.item.path.type === "file") {
            setSelectedPath(info.item.path);
            onSelectVault(info.item.path);
        }
    }, [onSelectVault, parentPaths]);
    const handleNewVaultPromptShow = useCallback(() => {
        setPromptNewFile(true);
        onSelectVault(null);
        // setItems(items.filter(
        //     item => item.path === null || item.path?.type === "directory" || (item.path?.type === "file" && item.path?.identifier !== null)
        // ));
    }, [items, onSelectVault]);
    const handleNewFolderPromptShow = useCallback(() => {
        setPromptNewFolder(true);
    }, []);
    const handleNewVaultPromptSubmission = useCallback((filename: string) => {
        setPromptNewFile(false);
        let newVaultFilename = filename;
        if (/\.bcup$/i.test(newVaultFilename) === false) {
            newVaultFilename = `${newVaultFilename}.bcup`;
        }
        setItems([
            ...items,
            {
                title: newVaultFilename,
                subtitle: `0 B`,
                icon: "file-add-outline",
                path: {
                    identifier: null,
                    name: newVaultFilename
                },
                isNew: true
            }
        ]);
        const parent = parentPaths.length > 0 ? parentPaths[parentPaths.length - 1] : null;
        const result = {
            name: newVaultFilename,
            identifier: null,
            parent
        };
        setSelectedPath(result);
        onSelectVault(result);
    }, [items, parentPaths]);
    const handleNewFolderPromptSubmission = useCallback(async (folderName: string) => {
        setPromptNewFolder(false);
        const parent = parentPaths.length > 0 ? parentPaths[parentPaths.length - 1] : null;
        try {
            await fsInterface.putDirectory(parent, { identifier: null, name: folderName });
            // Force refresh
            setParentPaths([...parentPaths]);
        } catch (err) {
            console.error(err);
            notifyError("Folder creation failure", err.message);
        }
    }, [fsInterface, parentPaths]);
    const renderItem = useCallback((info: VaultChooserListItem) => {
        const { item } = info;
        const isSelected = selectedPath && item.path && item.path.identifier === selectedPath.identifier;
        return (
            <ListItem
                title={item.title}
                description={item.subtitle}
                accessoryLeft={props => renderItemIcon(props, item.icon)}
                onPress={() => handleItemSelect(info)}
                style={isSelected ? themeStyles.selectedItem : {}}
            />
        );
    }, [handleItemSelect, selectedPath]);
    useEffect(() => {
        setBusyState("Loading folder contents");
        fsInterface
            .getDirectoryContents(currentPath)
            .then((results: Array<VaultChooserItem>) => {
                setBusyState(null);
                const newItems = results.sort(resultSorter).map(result => ({
                    title: result.name,
                    subtitle: result.type === "file" ? prettyBytes(result.size) : "Directory",
                    icon: result.type === "file" ? "file-outline" : "folder-outline",
                    path: result,
                    isNew: false
                }));
                if (parentPaths.length > 0) {
                    newItems.unshift({
                        title: "..",
                        subtitle: "Parent Directory",
                        icon: "corner-left-up-outline",
                        path: null,
                        isNew: false
                    });
                }
                setItems(newItems);
            })
            .catch((err: Error) => {
                console.warn(err);
                notifyError("Error fetching contents", err.message);
            });
    }, [currentPath, parentPaths]);
    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <List
                    style={styles.listContainer}
                    contentContainerStyle={styles.contentContainer}
                    data={items}
                    renderItem={renderItem}
                    scrollEnabled={false}
                />
                <Button
                    accessoryLeft={AddVaultIcon}
                    onPress={handleNewVaultPromptShow}
                    style={styles.pathActionButton}
                >
                    New Vault
                </Button>
                <Button
                    accessoryLeft={AddFolderIcon}
                    onPress={handleNewFolderPromptShow}
                    style={styles.pathActionButton}
                >
                    New Directory
                </Button>
                <TextPrompt
                    cancelable
                    onCancel={() => setPromptNewFile(false)}
                    onSubmit={handleNewVaultPromptSubmission}
                    placeholder="vault.bcup"
                    prompt="New vault filename"
                    submitText="Set New Vault"
                    visible={promptNewFile}
                />
                <TextPrompt
                    cancelable
                    onCancel={() => setPromptNewFolder(false)}
                    onSubmit={handleNewFolderPromptSubmission}
                    prompt="New folder name"
                    submitText="Create Folder"
                    visible={promptNewFolder}
                />
            </SafeAreaView>
        </>
    );
}
