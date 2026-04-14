/**
 * Fly to Cart Animation
 * Tạo hiệu ứng bay từ vị trí sản phẩm vào icon giỏ hàng
 */

export function flyToCart(
  productImageId: string,
  cartIconId: string = 'cart-icon'
) {
  // Lấy vị trí ảnh sản phẩm
  const productElement = document.getElementById(productImageId);
  const cartIcon = document.getElementById(cartIconId);

  if (!productElement || !cartIcon) {
    console.warn('Product image or cart icon not found');
    return;
  }

  // Lấy ảnh thực tế từ element (có thể là img hoặc container có img)
  const productImg = productElement.tagName === 'IMG' 
    ? productElement as HTMLImageElement
    : productElement.querySelector('img');

  if (!productImg) {
    console.warn('Product image not found');
    return;
  }

  const productRect = productElement.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Tạo clone image để bay
  const flyingImg = document.createElement('img');
  flyingImg.src = productImg.src;
  flyingImg.alt = productImg.alt || '';
  
  flyingImg.style.cssText = `
    position: fixed;
    top: ${productRect.top}px;
    left: ${productRect.left}px;
    width: ${productRect.width}px;
    height: ${productRect.height}px;
    object-fit: cover;
    border-radius: 12px;
    z-index: 9999;
    pointer-events: none;
    transition: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  `;

  document.body.appendChild(flyingImg);

  // Animation parameters
  const startX = productRect.left;
  const startY = productRect.top;
  const startWidth = productRect.width;
  const startHeight = productRect.height;

  const endX = cartRect.left + cartRect.width / 2 - 20;
  const endY = cartRect.top + cartRect.height / 2 - 20;
  const endWidth = 40;
  const endHeight = 40;

  const duration = 800; // milliseconds
  const startTime = performance.now();

  // Easing function (ease-in-out-cubic)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Animation loop
  const animate = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing
    const easedProgress = easeInOutCubic(progress);

    // Calculate current position and size
    const currentX = startX + (endX - startX) * easedProgress;
    const currentY = startY + (endY - startY) * easedProgress;
    const currentWidth = startWidth + (endWidth - startWidth) * easedProgress;
    const currentHeight = startHeight + (endHeight - startHeight) * easedProgress;
    const currentOpacity = 1 - progress * 0.4;

    // Update flying image styles
    flyingImg.style.left = `${currentX}px`;
    flyingImg.style.top = `${currentY}px`;
    flyingImg.style.width = `${currentWidth}px`;
    flyingImg.style.height = `${currentHeight}px`;
    flyingImg.style.opacity = `${currentOpacity}`;

    if (progress < 1) {
      // Continue animation
      requestAnimationFrame(animate);
    } else {
      // Animation complete
      flyingImg.remove();

      // Bounce effect on cart icon
      cartIcon.style.transform = 'scale(1.3)';
      setTimeout(() => {
        cartIcon.style.transform = 'scale(1)';
      }, 200);
    }
  };

  // Start animation
  requestAnimationFrame(animate);
}
