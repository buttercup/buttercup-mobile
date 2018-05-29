import { DatasourceAdapter, TextDatasource } from "buttercup/dist/buttercup-web.min.js";
import { getArchiveContents, putArchiveContents } from "./dropbox.js";

const { registerDatasource } = DatasourceAdapter;

const NOOP = () => {};

class DropboxDatasource extends TextDatasource {
    constructor(accessToken, resourcePath) {
        super("");
        this.path = resourcePath;
        this.token = accessToken;
    }

    load(password) {
        return getArchiveContents(this.path, this.token).then(content => {
            this.setContent(content);
            return super.load(password);
        });
    }

    save(archive, password) {
        return super.save(archive, password).then(encryptedContent => {
            return putArchiveContents(this.path, encryptedContent, this.token).then(NOOP);
        });
    }

    toObject() {
        return {
            type: "dropbox",
            token: this.token,
            path: this.path
        };
    }
}

DropboxDatasource.fromObject = function fromObject(obj) {
    if (obj.type === "dropbox") {
        return new DropboxDatasource(obj.token, obj.path);
    }
    throw new Error(`Unknown or invalid type: ${obj.type}`);
};

DropboxDatasource.fromString = function fromString(str, hostCredentials) {
    return DropboxDatasource.fromObject(JSON.parse(str), hostCredentials);
};

registerDatasource("dropbox", DropboxDatasource);

export default DropboxDatasource;
