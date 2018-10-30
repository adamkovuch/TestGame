export function Async(result): Promise<any> {
    return new Promise((resolve) => resolve(result));
}
