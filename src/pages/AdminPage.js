import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';
import './AdminPage.css';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('users');

  // Users filters
  const [userSearch, setUserSearch] = useState('');
  const [userActiveFilter, setUserActiveFilter] = useState('all'); // all | active | inactive
  const [userCityFilter, setUserCityFilter] = useState('all');

  // Subscriptions filters
  const [subSearch, setSubSearch] = useState('');
  const [subPaymentFilter, setSubPaymentFilter] = useState('all'); // all | PENDING | PAID | FAILED
  const [subStatusFilter, setSubStatusFilter] = useState('all');   // all | PENDING | ACTIVE | CANCELLED | PAUSED | EXPIRED
  const [subAutoRenewFilter, setSubAutoRenewFilter] = useState('all'); // all | true | false

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [u, s] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllSubscriptions(),
        ]);
        setUsers(u);
        setSubs(s);
      } catch (e) {
        setError('Failed to load admin data');
      } finally {
        setLoadingData(false);
      }
    };
    if (user && user.role === 'ADMIN') {
      fetchData();
    }
  }, [user]);

  // Derived lists
  const userCities = useMemo(() => Array.from(new Set(users.map(u => (u.city || '').trim()).filter(Boolean))).sort(), [users]);
  const paymentOptions = ['PENDING', 'PAID', 'FAILED'];
  const statusOptions = ['PENDING', 'ACTIVE', 'CANCELLED', 'PAUSED', 'EXPIRED'];

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (userSearch && !String(u.name || '').toLowerCase().includes(userSearch.toLowerCase())) return false;
      if (userActiveFilter === 'active' && !u.active) return false;
      if (userActiveFilter === 'inactive' && u.active) return false;
      if (userCityFilter !== 'all' && (u.city || '') !== userCityFilter) return false;
      return true;
    });
  }, [users, userSearch, userActiveFilter, userCityFilter]);

  const filteredSubs = useMemo(() => {
    return subs.filter(s => {
      if (subSearch && !String(s.userName || '').toLowerCase().includes(subSearch.toLowerCase())) return false;
      if (subPaymentFilter !== 'all' && String(s.paymentStatus || 'PENDING').toUpperCase() !== subPaymentFilter) return false;
      if (subStatusFilter !== 'all' && String(s.status || '').toUpperCase() !== subStatusFilter) return false;
      if (subAutoRenewFilter === 'true' && !s.autoRenew) return false;
      if (subAutoRenewFilter === 'false' && s.autoRenew) return false;
      return true;
    });
  }, [subs, subSearch, subPaymentFilter, subStatusFilter, subAutoRenewFilter]);

  // Actions
  const toggleUserActive = async (u) => {
    try {
      const updated = await adminService.setUserActive(u.id, !u.active);
      setUsers(prev => prev.map(x => x.id === updated.id ? updated : x));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update user status');
    }
  };

  const deleteUser = async (u) => {
    try {
      if (u.active) {
        alert('User is active. Deactivate before deleting.');
        return;
      }
      if (!window.confirm(`Delete user ${u.name}? This action cannot be undone.`)) return;
      await adminService.deleteUser(u.id);
      setUsers(prev => prev.filter(x => x.id !== u.id));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to delete user');
    }
  };

  const updatePaymentStatus = async (subId, status) => {
    try {
      const updated = await adminService.setPaymentStatus(subId, status);
      setSubs(prev => prev.map(s => s.id === updated.id ? { ...s, paymentStatus: updated.paymentStatus } : s));
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to update payment status');
    }
  };

  if (loading || loadingData) {
    return (
      <div style={{ padding: '40px', minHeight: '50vh' }}>Loading...</div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', color: 'red' }}>{error}</div>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className={`sidebar-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Users</div>
        <div className={`sidebar-item ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>Subscriptions</div>
      </aside>
      <main className="admin-main">
        {activeTab === 'users' ? (
          <section className="admin-section">
            <div className="admin-header">
              <h1>Users</h1>
              <div className="filters">
                <input className="input" placeholder="Search by name..." value={userSearch} onChange={(e)=>setUserSearch(e.target.value)} />
                <select className="select" value={userActiveFilter} onChange={(e)=>setUserActiveFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <select className="select" value={userCityFilter} onChange={(e)=>setUserCityFilter(e.target.value)}>
                  <option value="all">All Cities</option>
                  {userCities.map(c => (<option key={c} value={c}>{c}</option>))}
                </select>
              </div>
            </div>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Active</th>
                    <th>City</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.role}</td>
                      <td><span className={`badge ${u.active ? 'success' : 'neutral'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                      <td>{u.city || '—'}</td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="row-actions">
                        <button className="btn" onClick={() => toggleUserActive(u)}>{u.active ? 'Set Inactive' : 'Set Active'}</button>
                        <button className="btn danger" onClick={() => deleteUser(u)} disabled={u.active} title={u.active ? 'User is active' : 'Delete user'}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="admin-section">
            <div className="admin-header">
              <h1>Subscriptions</h1>
              <div className="filters">
                <input className="input" placeholder="Search by user name..." value={subSearch} onChange={(e)=>setSubSearch(e.target.value)} />
                <select className="select" value={subPaymentFilter} onChange={(e)=>setSubPaymentFilter(e.target.value)}>
                  <option value="all">All Payments</option>
                  {paymentOptions.map(p => (<option key={p} value={p}>{p}</option>))}
                </select>
                <select className="select" value={subStatusFilter} onChange={(e)=>setSubStatusFilter(e.target.value)}>
                  <option value="all">All Statuses</option>
                  {statusOptions.map(s => (<option key={s} value={s}>{s}</option>))}
                </select>
                <div className="radio-group">
                  <label><input type="radio" name="ar" checked={subAutoRenewFilter==='all'} onChange={()=>setSubAutoRenewFilter('all')} /> All</label>
                  <label><input type="radio" name="ar" checked={subAutoRenewFilter==='true'} onChange={()=>setSubAutoRenewFilter('true')} /> Auto‑renew</label>
                  <label><input type="radio" name="ar" checked={subAutoRenewFilter==='false'} onChange={()=>setSubAutoRenewFilter('false')} /> No auto‑renew</label>
                </div>
              </div>
            </div>
            <div className="card">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Amount</th>
                    <th>Auto‑Renew</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map(s => (
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.userName}<div className="sub-muted">{s.userEmail}</div></td>
                      <td>{s.planName} ({s.planCode})</td>
                      <td><span className={`badge ${String(s.status).toLowerCase()}`}>{s.status}</span></td>
                      <td>
                        <select className="select small" value={(s.paymentStatus || 'PENDING').toUpperCase()} onChange={(e)=>updatePaymentStatus(s.id, e.target.value)}>
                          {paymentOptions.map(p => (<option key={p} value={p}>{p}</option>))}
                        </select>
                      </td>
                      <td>{s.startDate}</td>
                      <td>{s.endDate}</td>
                      <td>₹{Number(s.amount).toFixed(2)}</td>
                      <td>{s.autoRenew ? 'Enabled' : 'Disabled'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
