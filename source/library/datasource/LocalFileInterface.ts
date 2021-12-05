import { FileIdentifier, FileItem, FileSystemInterface, PathIdentifier } from "@buttercup/file-interface";
import { DocumentDirectoryPath, mkdir, readDir, readFile, unlink, writeFile } from "react-native-fs";
import path from "path-browserify";

export class LocalFileSystemInterface extends FileSystemInterface {
    rootDir: string;

    static getRootDirectory(): string {
        return DocumentDirectoryPath;
    }

    constructor(config) {
        super(config);
        this.rootDir = LocalFileSystemInterface.getRootDirectory();
    }

    async deleteFile(fileIdentifier: FileIdentifier): Promise<void> {
        await unlink(fileIdentifier.identifier as string);
    }

    async getDirectoryContents(pathIdentifier?: PathIdentifier): Promise<Array<FileItem>> {
        const dirPath = (pathIdentifier?.identifier ?? "/") as string;
        const results = await readDir(dirPath);
        return results.map(res => ({
            identifier: res.path,
            name: res.name,
            type: res.isFile() ? "file" : "directory",
            size: parseInt(res.size, 10),
            created: res.ctime?.toUTCString() ?? null,
            modified: res.mtime?.toUTCString() ?? null,
            parent: pathIdentifier
        }));
    }

    async getFileContents(pathIdentifier: PathIdentifier): Promise<string> {
        const { identifier: filename } = pathIdentifier;
        return readFile(filename as string);
    }

    getRootPathIdentifier(): PathIdentifier {
        return {
            identifier: this.rootDir,
            name: path.basename(this.rootDir)
        };
    }

    getSupportedFeatures() {
        return [...super.getSupportedFeatures(), "created", "modified"];
    }

    pathIdentifierIsRoot(pathIdentifer?: PathIdentifier): boolean {
        return pathIdentifer?.identifier === this.rootDir;
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
}
