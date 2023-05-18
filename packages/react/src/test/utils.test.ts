import {cleanFilePath} from "../utils";

describe('Utils test', () => {

    test('path contains url', async () => {
        expect(cleanFilePath("http://127.0.0.1:5173/src/App.tsx")).toEqual("/src/App.tsx")
    });

    test('path is regular file path', async () => {
        expect(cleanFilePath("/home/user/react-app/src/App.tsx")).toEqual("/home/user/react-app/src/App.tsx")
    });

    test('path is undefined', async () => {
        expect(cleanFilePath(undefined)).toEqual("")
    });
})