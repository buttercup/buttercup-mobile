const STATE_KEY = "nav";

export function getTopGroupID(state) {
    const route = getTopRoute(state);
    return route.params && route.params.groupID;
}

export function getTopRoute(state) {
    const routes = state[STATE_KEY].routes;
    return routes[routes.length - 1];
}

export function isRoot(state) {
    const routes = state[STATE_KEY].routes;
    return routes.length === 1 && routes[0].routeName === "Home";
}
