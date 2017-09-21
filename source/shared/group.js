const TRASH_KEY = "bc_group_role";
const TRASH_ROLE = "trash";

export function rawGroupIsTrash(group) {
    return group && group.attributes && group.attributes[TRASH_KEY] === TRASH_ROLE;
}
