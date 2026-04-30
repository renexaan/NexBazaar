// admin.js — Administrative oversight for users and orders

(function () {
  const user = requireAuth('admin');
  if (!user) return;

  const navbarUser = document.getElementById('navbarUser');
  const banner = document.getElementById('welcomeBanner');
  const pendingUsersContainer = document.getElementById('pendingUsersContainer');
  const pendingOrdersContainer = document.getElementById('pendingOrdersContainer');

  // ── Initialization ────────────────────────────────────────────
  renderNavUser(user, navbarUser);
  banner.innerHTML = `<div class="welcome-text"><p class="welcome-title">System Overview</p><p class="welcome-sub">Managing NexBazaar as <strong>${user.name}</strong></p></div>`;

  fetchPendingUsers();
  fetchPendingOrders();

  // ── Tab Logic ────────────────────────────────────────────────
  window.switchTab = (tab) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (tab === 'users') {
      document.getElementById('usersSection').classList.remove('hidden');
      document.getElementById('ordersSection').classList.add('hidden');
    } else {
      document.getElementById('usersSection').classList.add('hidden');
      document.getElementById('ordersSection').classList.remove('hidden');
    }
  };

  // ── User Management ───────────────────────────────────────────
  async function fetchPendingUsers() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/pending`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` }
      });
      const users = await res.json();
      renderUsers(users);
    } catch (err) {
      pendingUsersContainer.innerHTML = '<p class="error-text">Failed to load users.</p>';
    }
  }

  function renderUsers(users) {
    if (users.length === 0) {
      pendingUsersContainer.innerHTML = '<p style="color: #6e6e73; font-size: 14px;">No pending customer approvals.</p>';
      return;
    }
    pendingUsersContainer.innerHTML = users.map(u => `
      <div class="user-row" id="user-${u._id}">
        <div class="user-info">
          <div class="user-avatar-wrap">
            <div class="user-avatar-placeholder">${u.name[0]}</div>
          </div>
          <div>
            <p class="user-name">${u.name}</p>
            <p class="user-email">${u.email}</p>
          </div>
        </div>
        <div class="user-actions">
          <button class="btn-primary" style="padding: 6px 14px; font-size: 13px;" onclick="approveUser('${u._id}')">Approve</button>
          <button class="btn-secondary" style="padding: 6px 14px; font-size: 13px; color: var(--red);" onclick="rejectUser('${u._id}')">Reject</button>
        </div>
      </div>
    `).join('');
  }

  window.approveUser = async (id) => {
    if (!confirm('Approve this user for shop access?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/users/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` }
      });
      if (res.ok) {
        document.getElementById(`user-${id}`).remove();
        if (pendingUsersContainer.children.length === 0) renderUsers([]);
      }
    } catch (err) { alert('Approval failed'); }
  };

  window.rejectUser = async (id) => {
    if (!confirm('Reject this user request?')) return;
    try {
      await fetch(`${BACKEND_URL}/api/admin/users/${id}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` }
      });
      document.getElementById(`user-${id}`).remove();
      if (pendingUsersContainer.children.length === 0) renderUsers([]);
    } catch (err) { alert('Rejection failed'); }
  };

  // ── Order Management ───────────────────────────────────────────
  async function fetchPendingOrders() {
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/orders/pending`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` }
      });
      const orders = await res.json();
      renderOrders(orders);
    } catch (err) {
      pendingOrdersContainer.innerHTML = '<p class="error-text">Failed to load orders.</p>';
    }
  }

  function renderOrders(orders) {
    if (orders.length === 0) {
      pendingOrdersContainer.innerHTML = '<p style="color: #6e6e73; font-size: 14px;">No pending order requests.</p>';
      return;
    }
    pendingOrdersContainer.innerHTML = orders.map(o => `
      <div class="order-card" id="order-${o._id}">
        <div class="order-header">
          <div class="order-customer">
            <div class="user-avatar-placeholder" style="width: 32px; height: 32px; font-size: 12px;">${o.customer.name[0]}</div>
            <div class="order-customer-info">
              <span class="order-customer-name">${o.customer.name}</span>
              <span class="order-customer-email">${o.customer.email}</span>
            </div>
          </div>
          <span class="badge badge-blue">Pending Approval</span>
        </div>
        <div class="order-items-list">
          ${o.items.map(item => `
            <div class="order-item-row">
              <span>${item.name} <strong>x${item.quantity}</strong></span>
              <span>₹${item.price * item.quantity}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-footer" style="flex-direction: column; align-items: flex-start; gap: 12px;">
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
            <span class="order-total">Total: ₹${o.totalAmount}</span>
          </div>
          <input type="text" id="msg-${o._id}" class="admin-message-input" placeholder="Add a message for the customer (optional)...">
          <div class="user-actions" style="width: 100%; justify-content: flex-end;">
            <button class="btn-primary" style="padding: 8px 18px;" onclick="approveOrder('${o._id}')">Approve & Deduct Stock</button>
            <button class="btn-secondary" style="padding: 8px 18px; color: var(--red);" onclick="rejectOrder('${o._id}')">Reject</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  window.approveOrder = async (id) => {
    if (!confirm('Approve this order? This will reduce stock from inventory.')) return;
    const adminMessage = document.getElementById(`msg-${id}`).value;
    try {
      const res = await fetch(`${BACKEND_URL}/api/admin/orders/${id}/approve`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` 
        },
        body: JSON.stringify({ adminMessage })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Order approved and stock updated!');
        document.getElementById(`order-${id}`).remove();
        if (pendingOrdersContainer.children.length === 0) renderOrders([]);
      } else {
        alert(data.message || 'Approval failed');
      }
    } catch (err) { alert('Approval failed'); }
  };

  window.rejectOrder = async (id) => {
    if (!confirm('Reject this order request?')) return;
    const adminMessage = document.getElementById(`msg-${id}`).value;
    try {
      await fetch(`${BACKEND_URL}/api/admin/orders/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('nexbazaar_token')}` 
        },
        body: JSON.stringify({ adminMessage })
      });
      document.getElementById(`order-${id}`).remove();
      if (pendingOrdersContainer.children.length === 0) renderOrders([]);
    } catch (err) { alert('Rejection failed'); }
  };

})();
