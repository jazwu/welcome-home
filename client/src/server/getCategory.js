export const getMains = async () => {
  try {
    const response = await fetch("/api/categories");
    if (response.ok) {
      const categories = await response.json();
      return categories;
    } else {
      throw new Error("Failed to fetch categories");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getSubs = async ({ mainCategory }) => {
  try {
    const response = await fetch(`/api/categories/${mainCategory}`);
    if (response.ok) {
      const subCategories = await response.json();
      return subCategories;
    } else {
      throw new Error("Failed to fetch sub categories");
    }
  } catch (error) {
    console.error(error);
  }
};
