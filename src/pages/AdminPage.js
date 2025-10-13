import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/adminService';

const AdminPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '16px' }}>Admin Dashboard</h1>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ marginBottom: '12px' }}>Users</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Active</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Address</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>City</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>State</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Pincode</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.id}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.name}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.email}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.phone}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.role}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.active ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.address || '-'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.city || '-'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.state || '-'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{u.pincode || '-'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{new Date(u.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '12px' }}>Subscriptions</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>User</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Plan</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Start</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>End</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Auto Renew</th>
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.id}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.userName}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.userEmail}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.userPhone}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.planName} ({s.planCode})</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.status}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.startDate}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.endDate}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>₹{Number(s.amount).toFixed(2)}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{s.autoRenew ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
