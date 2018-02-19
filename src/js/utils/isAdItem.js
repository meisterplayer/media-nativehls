/**
 * Checks whether the item is an ad item or not.
 *
 * @export
 * @param {Object} item
 * @returns {boolean}
 */
export default function isAdItem(item) {
    // Non media items are certenly not ad items.
    if (item.type !== 'media' || !item.parallel) {
        return false;
    }

    // Search for a vast item.
    return !!item.parallel.find(parallelItem => parallelItem.type === 'vmap');
}
