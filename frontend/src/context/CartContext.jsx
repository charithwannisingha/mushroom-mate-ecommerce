// ============================================================
// කරත්ත (Cart) context - සාප්පු කරත්තය කළමනාකරණය කරයි
// localStorage හි ගබඩා කර browser refresh වුවද රඳවා ගනී
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mm_cart')) || [] }
    catch { return [] }
  })

  // කරත්තය වෙනස් වන සෑම විටම localStorage යාවත්කාලීන කරයි
  useEffect(() => {
    localStorage.setItem('mm_cart', JSON.stringify(items))
  }, [items])

  // අයිතමයක් කරත්තයට එක් කරයි (දැනටමත් ඇත්නම් ප්‍රමාණය වැඩි කරයි)
  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id)
      if (found) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i)
      }
      return [...prev, {
        id: product.id, name: product.name, price: Number(product.price),
        image: product.image, unit: product.unit, stock: product.stock, qty
      }]
    })
  }

  const updateQty = (id, qty) =>
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, qty) } : i))

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])

  // ගණනය කළ අගයන් (derived values)
  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clear, count, total }}>
      {children}
    </CartContext.Provider>
  )
}
