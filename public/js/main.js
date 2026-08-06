document.addEventListener('DOMContentLoaded', () => {
  // AJAX Add to Room Service Cart
  const cartBtns = document.querySelectorAll('.add-to-cart-btn')

  cartBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      const foodItemId = btn.dataset.id

      try {
        const res = await fetch('/food/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ foodItemId, quantity: 1 })
        })

        const data = await res.json()
        if (data.success) {
          // Update Badge
          const badge = document.getElementById('cart-badge')
          if (badge) badge.innerText = data.totalCount

          // Update Cart List
          const cartList = document.getElementById('cart-items-list')
          const totalDisplay = document.getElementById('cart-total-display')
          const checkoutBtn = document.getElementById('checkout-trigger-btn')

          if (cartList) {
            cartList.innerHTML = data.cart.map(item => `
              <div class="d-flex justify-content-between align-items-center mb-2 small">
                <div>
                  <div class="fw-bold">${item.name}</div>
                  <div class="text-muted">$${item.price} x ${item.quantity}</div>
                </div>
                <div class="fw-bold text-gold">$${item.subtotal}</div>
              </div>
            `).join('')
          }

          if (totalDisplay) {
            totalDisplay.innerText = `$${data.cartTotal}`
          }

          if (checkoutBtn) {
            checkoutBtn.disabled = false
          }

          // Visual Feedback Toast / Button Text
          const originalHTML = btn.innerHTML
          btn.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> Added to Cart!'
          btn.classList.add('btn-success')
          btn.classList.remove('btn-outline-dark')

          setTimeout(() => {
            btn.innerHTML = originalHTML
            btn.classList.remove('btn-success')
            btn.classList.add('btn-outline-dark')
          }, 1500)
        }
      } catch (err) {
        console.error('[Cart Error]', err)
      }
    })
  })
})
