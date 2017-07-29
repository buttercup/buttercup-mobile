const STATE_KEY = "app";

export function isSaving(state) {
    return state[STATE_KEY].saving;
}
