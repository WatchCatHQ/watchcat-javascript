export function cleanFilePath(path: string | undefined): string {
    if (!path) {
        return ''
    }
    try {
        const url = new URL(path);
        return url.pathname;
    } catch (e) {
        return path
    }
}