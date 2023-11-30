import {
    Credentials,
    DatasourceLoadedData,
    EncryptedContent,
    History,
    TextDatasource,
    registerDatasource
} from "buttercup";
import { readFile, writeFile } from "react-native-fs";
import path from "path-browserify";
import { LocalFileSystemInterface } from "./LocalFileInterface";
import { DatasourceConfigurationMobileLocalFile } from "../../types";

function prepareFullPath(filePath: string): string {
    return path.join(LocalFileSystemInterface.getRootDirectory(), filePath);
}

export class MobileLocalFileDatasource extends TextDatasource {
    protected _filename: string;

    constructor(credentials: Credentials) {
        super(credentials);
        const { data: credentialsData } = credentials.getData() as any;
        const { datasource: datasourceConfig } = credentialsData as {
            datasource: DatasourceConfigurationMobileLocalFile;
        };
        this._filename = prepareFullPath(datasourceConfig.filename);
        this.type = "mobilelocalfile";
    }

    getConfiguration(): { type: string; path: string } {
        return {
            type: this.type,
            path: this._filename
        };
    }

    async load(credentials: Credentials): Promise<DatasourceLoadedData> {
        const enc = await readFile(this._filename);
        this.setContent(enc);
        return super.load(credentials);
    }

    async save(history: History, credentials: Credentials): Promise<EncryptedContent> {
        const encrypted = await super.save(history, credentials);
        await writeFile(this._filename, encrypted);
        return encrypted;
    }

    supportsAttachments(): boolean {
        return false;
    }

    supportsRemoteBypass(): boolean {
        return false;
    }
}

registerDatasource("mobilelocalfile", MobileLocalFileDatasource);
