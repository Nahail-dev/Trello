

// utils.js


const urlToFile = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

export { urlToFile };


const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")      // Replace spaces with -
    .replace(/[^\w-]+/g, "")  // Remove special characters
    .replace(/--+/g, "-");   // Replace multiple - with single -
};

export { slugify };
