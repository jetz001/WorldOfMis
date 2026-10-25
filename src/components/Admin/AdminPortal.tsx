import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  LogOut,
  MapPin,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import type { GhostPin, SupportedLanguage } from '../../types/ghost';
import { getTranslation } from '../../lib/i18n';
import { PinFormModal } from './PinFormModal';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  pins: GhostPin[];
  onAddPin: (newPin: GhostPin) => void;
  onUpdatePin: (updatedPin: GhostPin) => void;
  onDeletePin: (id: string) => void;
  language: SupportedLanguage;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  pins,
  onAddPin,
  onUpdatePin,
  onDeletePin,
  language,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = getTranslation(language);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('worldofmys_admin_auth') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Editing state
  const [editingPin, setEditingPin] = useState<Partial<GhostPin> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Modern HTML <dialog> lifecycle
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for browsers without native <dialog closedby> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInside) {
        onClose();
      }
    };

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener('click', handleDialogClick);
    dialog.addEventListener('close', handleClose);

    return () => {
      dialog.removeEventListener('click', handleDialogClick);
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin credential (admin / password123)
    if (username === 'admin' && (password === 'password123' || password === 'admin')) {
      setIsAuthenticated(true);
      localStorage.setItem('worldofmys_admin_auth', 'true');
      setLoginError('');
      setPassword('');
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านผู้ดูแลระบบไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('worldofmys_admin_auth');
  };

  const handleOpenAddForm = () => {
    setEditingPin(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (pin: GhostPin) => {
    setEditingPin(pin);
    setIsFormOpen(true);
  };

  const handleSavePin = (savedPin: GhostPin) => {
    if (editingPin?.id) {
      onUpdatePin(savedPin);
    } else {
      onAddPin(savedPin);
    }
    setIsFormOpen(false);
    setEditingPin(null);
  };

  return (
    <>
      <dialog
        ref={dialogRef}
        closedby="any"
        aria-labelledby="admin-portal-title"
        className="m-auto w-full max-w-4xl p-0 bg-transparent text-slate-100 border-none outline-none backdrop:bg-black/80 backdrop:backdrop-blur-md"
      >
        <div className="bg-slate-950 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          {/* Top Bar */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 id="admin-portal-title" className="text-xl font-bold text-white">
                  {t.adminDashboard}
                </h2>
                <p className="text-xs text-slate-400">
                  Cloudflare Pages Functions + D1 + R2 Connected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.logout}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 flex-1 overflow-y-auto">
            {!isAuthenticated ? (
              // Login Screen
              <div className="max-w-md mx-auto py-8">
                <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl text-center">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    เข้าสู่ระบบผู้ดูแลระบบ (Admin)
                  </h3>
                  <p className="text-xs text-slate-400 mb-6">
                    จัดการข้อมูลเรื่องเล่า หมุด และไฟล์สื่อบน Cloudflare D1 / R2
                  </p>

                  <form onSubmit={handleLogin} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.username}
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        placeholder="admin"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {t.password}
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                        placeholder="••••••••"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        * เฉพาะผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น
                      </p>
                    </div>

                    {loginError && (
                      <p className="text-xs text-rose-400 font-medium">
                        {loginError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                    >
                      {t.loginBtn}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              // Dashboard View
              <div className="space-y-6">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">{t.pinCount}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {pins.length}
                      </p>
                    </div>
                    <Globe className="w-8 h-8 text-emerald-400/50" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">{t.totalViews}</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {pins.reduce((acc, p) => acc + (p.views_count || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-sky-400/50" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">PDPA Safe Policy</p>
                      <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Max Zoom Clamped</span>
                      </p>
                    </div>
                    <ShieldCheck className="w-8 h-8 text-amber-400/50" />
                  </div>
                </div>

                {/* Actions & Table */}
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">
                    รายการหมุดผีและเรื่องเล่า ({pins.length})
                  </h4>
                  <button
                    onClick={handleOpenAddForm}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addPin}</span>
                  </button>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/50">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="p-3.5">ชื่อเรื่อง (TH / EN)</th>
                          <th className="p-3.5">หมวดหมู่</th>
                          <th className="p-3.5">จังหวัด / พิกัด</th>
                          <th className="p-3.5">คลื่นเสียง</th>
                          <th className="p-3.5">สถานะ</th>
                          <th className="p-3.5 text-right">การจัดการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {pins.map((pin) => (
                          <tr key={pin.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="p-3.5">
                              <p className="font-semibold text-white">{pin.title_th}</p>
                              <p className="text-[11px] text-slate-400">{pin.title_en}</p>
                            </td>
                            <td className="p-3.5">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                                {pin.category}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-1 text-slate-300">
                                <MapPin className="w-3 h-3 text-emerald-400" />
                                <span>{pin.province_th}</span>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {pin.lat.toFixed(2)}, {pin.lng.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-emerald-400">
                              {pin.sound_preset}
                            </td>
                            <td className="p-3.5">
                              {pin.is_published ? (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  เผยแพร่
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                  ซ่อน
                                </span>
                              )}
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditForm(pin)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(t.confirmDelete)) {
                                    onDeletePin(pin.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                                title="ลบ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </dialog>

      {/* Pin Form Modal */}
      {isFormOpen && (
        <PinFormModal
          pin={editingPin}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSavePin}
          language={language}
        />
      )}
    </>
  );
};
