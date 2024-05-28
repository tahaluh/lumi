import objectEntries from './objectEntries';
import { SearchParams } from './types/searchParams';

export function parseSearchParams(
    params: SearchParams,
    decode?: boolean
): string {
    const urlParams = new URLSearchParams();

    const appendRecursive = (
        obj: Record<string, any>,
        prefix: string = ''
    ): void => {
        objectEntries(obj).forEach(([key, value]) => {
            if (typeof value === 'undefined' || value === null || value === '')
                return;
            const currentKey = prefix ? `${prefix}[${key}]` : key;

            if (typeof value !== 'object') {
                urlParams.append(currentKey, String(value));
            } else if (Array.isArray(value)) {
                urlParams.append(currentKey, `["${value.join('","')}"]`);
            } else {
                appendRecursive(value, currentKey);
            }
        });
    };

    appendRecursive(params);

    return decode
        ? decodeURIComponent(urlParams.toString())
        : urlParams.toString();
}