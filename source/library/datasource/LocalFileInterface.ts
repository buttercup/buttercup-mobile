import { FileIdentifier, FileItem, FileSystemInterface, PathIdentifier, registerInterface } from "@buttercup/file-interface";
import { DocumentDirectoryPath, mkdir, readDir, readFile, unlink, writeFile } from "react-native-fs";
import path from "path-browserify";

export class LocalFileSystemInterface extends FileSystemInterface {
    rootDir: string;

    constructor(config) {
        super(config);
        this.rootDir = DocumentDirectoryPath;
    }

    async deleteFile(fileIdentifier: FileIdentifier): Promise<void> {
        await unlink(fileIdentifier.identifier as string);
    }

    async getDirectoryContents(pathIdentifier?: PathIdentifier): Promise<Array<FileItem>> {
        const consumerPath = (pathIdentifier?.identifier ?? "/") as string;
        const dirPath = this._getActualPath(consumerPath);
        const dirName = path.basename(dirPath);
        const results = await readDir(dirPath);
        return results.map(res => ({
            identifier: dirPath,
            name: dirName,
            type: res.isFile() ? "file" : "directory",
            size: parseInt(res.size, 10),
            created: res.ctime.toUTCString(),
            modified: res.mtime.toUTCString(),
            parent: pathIdentifier
        }));
    }

    async getFileContents(pathIdentifier: PathIdentifier): Promise<string> {
        const { identifier: filename } = pathIdentifier;
        return readFile(filename as string);
    }

    getSupportedFeatures() {
        return [...super.getSupportedFeatures(), "created", "modified"];
    }

    async putDirectory(
        parentPathIdentifier: PathIdentifier | null,
        fileIdentifier: FileIdentifier
    ): Promise<FileIdentifier> {
        const dirPath = fileIdentifier.identifier
            ? fileIdentifier.identifier
            : parentPathIdentifier
            ? path.join(parentPathIdentifier.identifier, fileIdentifier.name)
            : path.join("/", fileIdentifier.name);
        await mkdir(dirPath);
        return {
            identifier: dirPath,
            name: fileIdentifier.name
        };
    }

    async putFileContents(
        parentPathIdentifier: PathIdentifier,
        fileIdentifier: FileIdentifier,
        data: string
    ): Promise<FileIdentifier> {
        const filename = fileIdentifier.identifier
            ? fileIdentifier.identifier
            : path.join(parentPathIdentifier.identifier, fileIdentifier.name);
        await writeFile(filename, data);
        return {
            identifier: filename,
            name: fileIdentifier.name
        };
    }

    protected _getActualPath(consumerPath: string) {
        return path.resolve(this.rootDir, consumerPath);
    }
}

registerInterface("local", LocalFileSystemInterface);
