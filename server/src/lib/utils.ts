export const titleToSlug = (title: string): string => {
  if (!title || typeof title !== "string") {
    throw new Error("Invalid input: title must be a non-empty string");
  }

  return title
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/--+/g, "-") // Remove consecutive dashes
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing dashes
};
