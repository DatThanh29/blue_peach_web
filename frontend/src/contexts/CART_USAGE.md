/**
 * CART CONTEXT - Hướng dẫn sử dụng
 * 
 * Thay vì dùng các function từ @/lib/cart trực tiếp,
 * giờ hãy dùng useCart hook để access cart state globally.
 */

/**
 * ❌ CỰ - Cách cũ (không dùng nữa):
 * 
 * import { addToCart, getCart } from "@/lib/cart";
 * 
 * function MyComponent() {
 *   addToCart(item, 1);
 *   const cart = getCart();
 * }
 */

/**
 * ✅ MỚI - Cách dùng Cart Context:
 * 
 * import { useCart } from "@/hooks/useCart";
 * 
 * export default function MyComponent() {
 *   const { items, addItem, removeItem, updateQty, clearCart, total } = useCart();
 *   
 *   // Thêm sản phẩm
 *   const handleAddToCart = (product) => {
 *     addItem({
 *       ma_san_pham: product.ma_san_pham,
 *       ten_san_pham: product.ten_san_pham,
 *       gia_ban: product.gia_ban,
 *       primary_image: product.primary_image,
 *     }, 1); // Số lượng (optional, default = 1)
 *   };
 *   
 *   // Cập nhật số lượng
 *   const handleUpdateQty = (productId, newQty) => {
 *     updateQty(productId, newQty);
 *   };
 *   
 *   // Xóa sản phẩm
 *   const handleRemove = (productId) => {
 *     removeItem(productId);
 *   };
 *   
 *   // Xóa tất cả
 *   const handleClear = () => {
 *     clearCart();
 *   };
 *   
 *   return (
 *     <div>
 *       <p>Tổng tiền: {total.toLocaleString('vi-VN')}đ</p>
 *       <p>Số sản phẩm: {items.length}</p>
 *       {items.map(item => (
 *         <div key={item.ma_san_pham}>
 *           {item.ten_san_pham} x {item.qty} = {(item.gia_ban * item.qty).toLocaleString('vi-VN')}đ
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 */

/**
 * TÍNH NĂNG:
 * - items: CartItem[] - Danh sách sản phẩm trong giỏ
 * - total: number - Tổng tiền (auto-calculated)
 * - isLoading: boolean - Đang load từ localStorage
 * - addItem(item, qty?) - Thêm/tăng số lượng sản phẩm
 * - updateQty(productId, qty) - Cập nhật số lượng
 * - removeItem(productId) - Xóa sản phẩm
 * - clearCart() - Xóa tất cả
 * 
 * LƯỚI ỮỨ:
 * - Tự động save/load từ localStorage
 * - Reactive state - component auto re-render khi cart thay đổi
 * - Centralized state management
 */
