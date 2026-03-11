import pdfParse from 'pdf-parse';

const extractTextFromPdf = async (buffer) => {
  const data = await pdfParse(buffer);
  return data.text;
};

export { extractTextFromPdf };