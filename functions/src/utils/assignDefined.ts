export function assignDefined(target: any, ...sources: any) {
    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const val = source[key];
            if (val !== undefined) {
                target[key] = val;
            }
        }
    }
    return target;
}
