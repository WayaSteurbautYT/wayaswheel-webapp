/**
 * Utility for exporting game history and results
 */

export const spinsToJSON = (spins, username) => {
  return {
    username,
    exportDate: new Date().toISOString(),
    spins: spins
  };
};

export const downloadJSON = (data, fileName = 'wheel_of_regret_history.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const spinsToCSV = (spins, username) => {
  if (!spins || spins.length === 0) return '';

  const headers = ['Question', 'Result', 'Answer', 'Doom'];
  const rows = spins.map(spin => [
    `"${String(spin.question).replace(/"/g, '""')}"`,
    `"${String(spin.result).replace(/"/g, '""')}"`,
    `"${String(spin.answer).replace(/"/g, '""')}"`,
    `"${String(spin.doom).replace(/"/g, '""')}"`
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
};

export const downloadCSV = (csvContent, fileName = 'wheel_of_regret_history.csv') => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Keep the original combined functions for other potential uses
export const exportToJSON = (data, fileName = 'wheel_of_regret_history.json') => {
  downloadJSON(data, fileName);
};

export const exportToCSV = (data, fileName = 'wheel_of_regret_history.csv') => {
  // This assumes data is already a CSV string or needs conversion
  // For simplicity, if it's an array, we use spinsToCSV
  const content = Array.isArray(data) ? spinsToCSV(data, 'user') : data;
  downloadCSV(content, fileName);
};