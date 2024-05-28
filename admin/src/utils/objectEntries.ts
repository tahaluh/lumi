export default function objectEntries<
    T extends string | number | symbol,
    K = unknown
>(obj: Record<T, K>): [T, K][] {
    return Object.entries(obj) as [T, K][];
}
