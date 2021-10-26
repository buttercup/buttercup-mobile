import { CacheManager } from "@georstat/react-native-image-cache";
import { Dirs } from "react-native-file-access";

export function initialise() {
    CacheManager.config = {
        baseDir: `${Dirs.CacheDir}/images_cache/`,
        blurRadius: 15,
        sourceAnimationDuration: 1000,
        thumbnailAnimationDuration: 1000,
    };
}
