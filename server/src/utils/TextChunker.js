const chunkText = (text, { chunkSize = 1000, chunkOverlap = 200 } = {}) => {
  if (!text || text.trim().length === 0) return [];

  const chunks = [];
  let chunkIndex = 0;
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    const content = text.slice(start, end).trim();

    if (content.length > 0) {
      chunks.push({
        content,
        pageNumber: 1,
        chunkIndex,
      });
      chunkIndex++;
    }

    if (end >= text.length) break;
    start += chunkSize - chunkOverlap;
  }

  return chunks;
};

export { chunkText };