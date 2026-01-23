/**
 * Robust filtering function for Heat Pump data.
 * Handles type safety, case-insensitivity, and property mapping.
 * 
 * @param {Array} allData - Array of heat pump objects
 * @param {Object} activeFilters - Object containing filter keys and values
 * @param {String|null} searchTerm - Search term for postcode
 * @returns {Array} - Filtered array of heat pumps
 */
export const filterHeatPumps = (allData, activeFilters, searchTerm) => {
    if (!allData || !Array.isArray(allData)) return [];
    return allData.filter(pomp => {
        // Search (Postcode)
        if (searchTerm) {
            const postcode = pomp.postcode || "";
            if (!postcode.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        }
        // Filter Mapping
        const filterMappings = { bedrijf: 'fabrikant', merk: 'merk' };
        for (const [filterKey, filterValue] of Object.entries(activeFilters)) {
            if (!filterValue) continue;
            const dataKey = filterMappings[filterKey] || filterKey;
            const dataValue = pomp[dataKey];
            if (!dataValue || String(dataValue).toLowerCase() !== String(filterValue).toLowerCase()) return false;
        }
        return true;
    });
};
