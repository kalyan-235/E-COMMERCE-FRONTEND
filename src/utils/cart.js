const KEY = "cart";

export const getCart = () => {
  const raw = localStorage.getItem(KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addToCart = (product, qty = 1) => {
  const cart = getCart();
  const existing = cart.find((x) => x._id === product._id);

  const itemData = {
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image, 
    qty: Number(qty) || 1,
  };

  if (existing) existing.qty += itemData.qty;
  else cart.push(itemData);

  localStorage.setItem(KEY, JSON.stringify(cart));
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((x) => x._id !== id);
  localStorage.setItem(KEY, JSON.stringify(cart));
};

export const clearCart = () => {
  localStorage.removeItem(KEY);
};