import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', mac_address: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: profs }, { data: devs }, { data: maps }] = await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('devices').select('*').order('created_at', { ascending: false }),
      supabase.from('user_devices').select('*'),
    ]);
    setProfiles((profs || []).map(p => ({ ...p, device_ids: (maps || []).filter(m => m.user_id === p.id).map(m => m.device_id) })));
    setDevices(devs || []);
    setLoading(false);
  };

  const toggleApproval = async (p) => { await supabase.from('profiles').update({ is_approved: !p.is_approved }).eq('id', p.id); fetchData(); };
  const removeDevice = async (id) => { await supabase.from('devices').delete().eq('id', id); fetchData(); };

  const addDevice = async (e) => {
    e.preventDefault();
    if (!newDevice.name || !newDevice.mac_address) return;
    
    setLoading(true);
    const { error } = await supabase.from('devices').insert([newDevice]);
    
    if (error) {
      console.error('Add Device Error:', error);
      alert('Gagal menambah perangkat: ' + error.message);
    } else {
      setNewDevice({ name: '', mac_address: '' });
      setShowForm(false);
      await fetchData(); // Refresh data
    }
    setLoading(false);
  };

  const toggleAccess = async (uid, did, has) => {
    try {
      if (has) {
        const { error } = await supabase.from('user_devices').delete().eq('user_id', uid).eq('device_id', did);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('user_devices').insert([{ user_id: uid, device_id: did }]);
        if (error) throw error;
      }
      await fetchData();
    } catch (err) {
      console.error('Toggle Access Error:', err);
      alert('Gagal mengubah hak akses: ' + err.message);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-surface-400 gap-2"><span className="material-symbols-outlined animate-spin">progress_activity</span> Loading...</div>;
  }

  return (
    <div className="max-w-container mx-auto px-5 py-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── User Management ── */}
        <section className="lg:col-span-3 card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-200">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">group</span>
              <h3 className="font-bold text-surface-800">User Management</h3>
            </div>
            <span className="badge badge-primary">{profiles.length} users</span>
          </div>

          <div className="divide-y divide-surface-100">
            {profiles.map(p => (
              <div key={p.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-surface-800 text-sm">{p.email}</span>
                      <span className={`badge text-[10px] ${p.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-600'}`}>
                        {p.role.toUpperCase()}
                      </span>
                    </div>
                    <span className={`flex items-center gap-1 text-[11px] mt-1 ${p.is_approved ? 'text-green-600' : 'text-orange-500'}`}>
                      <span className="material-symbols-outlined text-sm">{p.is_approved ? 'check_circle' : 'pending'}</span>
                      {p.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  {p.role !== 'admin' && (
                    <button onClick={() => toggleApproval(p)} className={`btn text-xs px-4 py-1.5 rounded-lg ${p.is_approved ? 'btn-danger border border-red-200' : 'btn-primary'}`}>
                      {p.is_approved ? 'Revoke' : 'Approve'}
                    </button>
                  )}
                </div>

                {/* Device permission chips */}
                <div className="bg-surface-50 rounded-xl p-3 border border-surface-100">
                  <p className="section-label mb-2">Device Access</p>
                  <div className="flex flex-wrap gap-1.5">
                    {devices.map(d => {
                      const has = p.device_ids?.includes(d.id);
                      return (
                        <button key={d.id} onClick={() => toggleAccess(p.id, d.id, has)} className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-all active:scale-95 ${has ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-surface-500 border-surface-300 hover:border-primary-300'}`}>
                          {d.name}
                        </button>
                      );
                    })}
                    {devices.length === 0 && <span className="text-xs text-surface-400 italic">No devices registered</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Devices & Add ── */}
        <aside className="lg:col-span-2 space-y-4">
          {/* Toggle Form */}
          <button onClick={() => setShowForm(!showForm)} className="card w-full flex items-center justify-between px-5 py-4 hover:bg-surface-50 transition-colors group">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-500">add_circle</span>
              <span className="font-bold text-surface-800">Add Device</span>
            </div>
            <span className="material-symbols-outlined text-surface-400 group-hover:text-primary-500 transition-colors">{showForm ? 'expand_less' : 'expand_more'}</span>
          </button>

          {showForm && (
            <div className="card p-5 animate-fade-in">
              <form onSubmit={addDevice} className="space-y-4">
                <div>
                  <label className="section-label mb-1.5 block">Device Name</label>
                  <input value={newDevice.name} onChange={e => setNewDevice({ ...newDevice, name: e.target.value })} className="input" placeholder="e.g. Office PC" />
                </div>
                <div>
                  <label className="section-label mb-1.5 block">MAC Address</label>
                  <input value={newDevice.mac_address} onChange={e => setNewDevice({ ...newDevice, mac_address: e.target.value })} className="input font-mono" placeholder="AA:BB:CC:DD:EE:FF" />
                </div>
                <button type="submit" className="btn-primary w-full py-2.5 text-sm">Save Device</button>
              </form>
            </div>
          )}

          {/* Device List */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-200">
              <h3 className="font-bold text-surface-800 text-sm">All Devices</h3>
            </div>
            <div className="divide-y divide-surface-100">
              {devices.map(d => (
                <div key={d.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-surface-50 transition-colors">
                  <div>
                    <p className="font-semibold text-surface-800 text-sm">{d.name}</p>
                    <p className="font-mono text-[10px] text-surface-400">{d.mac_address}</p>
                  </div>
                  <button onClick={() => removeDevice(d.id)} className="btn-danger p-2 rounded-lg">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
              {devices.length === 0 && <p className="py-8 text-center text-surface-400 text-sm italic">Empty</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
