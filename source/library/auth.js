import { authenticateWithRefreshToken } from "./googleDrive.js";
import { DatasourceAuthManager } from "./buttercupCore.js";

export function registerAuthWatchers() {
    DatasourceAuthManager.getSharedManager().registerHandler("googledrive", async datasource => {
        console.log("Google Drive datasource needs re-authentication");
        const { token: currentToken, refreshToken: currentRefreshToken } = datasource;
        if (!currentRefreshToken) {
            console.log(
                "Datasource does not contain a refresh token: Performing full authorisation"
            );
            const { accessToken, refreshToken } = await authenticateWithoutToken();
            datasource.updateTokens(accessToken, refreshToken);
            if (!refreshToken) {
                console.log("Updating Google Drive datasource access token without refresh token");
            }
        } else {
            console.log("Datasource contains refresh token: Refreshing authorisation");
            const { accessToken } = await authenticateWithRefreshToken(
                currentToken,
                currentRefreshToken
            );
            datasource.updateTokens(accessToken, currentRefreshToken);
        }
        console.log("Google Drive datasource tokens updated");
    });
}
