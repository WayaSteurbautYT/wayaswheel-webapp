// Export helper for CSV and PDF export

/**
 * Convert spin history to CSV format
 * @param {array} spins - Array of spin objects
 * @param {string} username - Username
 * @returns {string} - CSV string
 */
export const spinsToCSV = (spins, username) => {
  if (!spins || spins.length === 0) {
    return '';
  }

  const headers = ['Spin #', 'Question', 'Result', 'Answer', 'Doom %', 'Date'];
  const rows = spins.map((spin, index) => [
    index + 1,
    `"${spin.question || ''}"`,
    `"${spin.result || ''}"`,
    `"${spin.answer || ''}"`,
    spin.doom || 0,
    new Date(spin.timestamp || Date.now()).toLocaleDateString()
  ]);

  const csvContent = [
    `Waya's Wheel of Regret - ${username}'s Spin History`,
    `Exported on: ${new Date().toLocaleString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV content
 * @param {string} filename - Filename
 */
export const downloadCSV = (csvContent, filename = 'wheel-history.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Convert spin history to JSON format
 * @param {array} spins - Array of spin objects
 * @param {string} username - Username
 * @returns {object} - JSON object
 */
export const spinsToJSON = (spins, username) => {
  return {
    app: "Waya's Wheel of Regret",
    username,
    exportedAt: new Date().toISOString(),
    totalSpins: spins.length,
    spins: spins.map((spin, index) => ({
      spinNumber: index + 1,
      question: spin.question,
      result: spin.result,
      answer: spin.answer,
      doom: spin.doom,
      timestamp: spin.timestamp,
      date: new Date(spin.timestamp).toLocaleDateString()
    }))
  };
};

/**
 * Download JSON file
 * @param {object} jsonData - JSON data
 * @param {string} filename - Filename
 */
export const downloadJSON = (jsonData, filename = 'wheel-history.json') => {
  const jsonContent = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

/**
 * Generate summary statistics for export
 * @param {array} spins - Array of spin objects
 * @returns {object} - Statistics
 */
export const generateSpinStats = (spins) => {
  if (!spins || spins.length === 0) {
    return {
      totalSpins: 0,
      averageDoom: 0,
      lowestDoom: 0,
      highestDoom: 0,
      lowDoomCount: 0,
      mediumDoomCount: 0,
      highDoomCount: 0
    };
  }

  const doomLevels = spins.map(s => s.doom || 0);
  const averageDoom = doomLevels.reduce((a, b) => a + b, 0) / doomLevels.length;
  
  return {
    totalSpins: spins.length,
    averageDoom: Math.round(averageDoom),
    lowestDoom: Math.min(...doomLevels),
    highestDoom: Math.max(...doomLevels),
    lowDoomCount: doomLevels.filter(d => d < 30).length,
    mediumDoomCount: doomLevels.filter(d => d >= 30 && d < 60).length,
    highDoomCount: doomLevels.filter(d => d >= 60).length
  };
};
