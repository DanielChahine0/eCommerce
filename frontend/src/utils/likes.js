const getLikesKey = (user) => {
  if (user && user.id) {
    return `likedProducts:${user.id}`;
  }
  return "likedProducts:guest";
};

const normalizeProduct = (product) => {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl || product.image || null,
    category: product.categoryName || product.category || null,
  };
};

const readLikedProducts = (user) => {
  try {
    const stored = localStorage.getItem(getLikesKey(user));
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.id != null);
  } catch (error) {
    return [];
  }
};

const writeLikedProducts = (user, products) => {
  try {
    localStorage.setItem(getLikesKey(user), JSON.stringify(products));
  } catch (error) {
    // Ignore storage failures to avoid blocking UI.
  }
};

export const getLikedProducts = (user) => readLikedProducts(user);

export const isProductLiked = (productId, user) => {
  if (productId == null) return false;
  return readLikedProducts(user).some((item) => item.id === productId);
};

export const toggleLikedProduct = (product, user) => {
  if (!product || product.id == null) return readLikedProducts(user);

  const current = readLikedProducts(user);
  const exists = current.some((item) => item.id === product.id);
  const updated = exists
    ? current.filter((item) => item.id !== product.id)
    : [...current, normalizeProduct(product)];

  writeLikedProducts(user, updated);
  return updated;
};
