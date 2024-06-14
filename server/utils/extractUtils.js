// utils/extractUtils.js

const extractField = (pattern, text, group = 1) => {
  const match = text.match(pattern);
  return match ? match[group] || null : null; // Handle cases where group is not found
};

const extractFields = (pattern, text) => {
  const matches = [];
  const regex = new RegExp(pattern, 'g'); // Create global regex for multiple matches
  let match;

  // Iterate through matches using exec()
  while ((match = regex.exec(text)) !== null) {
    matches.push(match.slice(1)); // Extract captured groups from match (excluding first element)
  }

  return matches;
};

export { extractField, extractFields };
