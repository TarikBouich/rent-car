export const generateNextId = (items) => {
  if (!items || items.length === 0) return 1;
  const maxId = items.reduce((max, item) => Math.max(max, item.id || 0), 0);
  return maxId + 1;
};

export const sortByIdDesc = (items) => {
  return [...items].sort((a, b) => b.id - a.id);
}; 