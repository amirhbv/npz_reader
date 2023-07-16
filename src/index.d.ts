declare module 'npz_reader' {
    export function load<T>(filePath: string, optionsOrCb?: any): Promise<T>;
    export function loadNpy<T>(filePath: string, options?: any): Promise<T>;
    export function loadNpz<T>(
        filePath: string,
        options?: any,
        maybeCb?: any
    ): Promise<T>;
}
