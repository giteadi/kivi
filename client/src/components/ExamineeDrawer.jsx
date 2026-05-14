import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX, FiUser, FiCalendar, FiPhone, FiMail, FiMapPin,
  FiEdit3, FiTrash2, FiFileText, FiPrinter, FiClipboard,
  FiActivity, FiChevronRight
} from 'react-icons/fi';

/**
 * ExamineeDrawer — Task 3.1
 * Slide-out drawer from the right showing a quick summary of an examinee.
 * Props:
 *   examinee   — the patient/examinee object (or null to close)
 *   onClose    — called when drawer should close
 *   onEdit     — called with examinee.id to navigate to full edit form
 *   onDelete   — called with examinee.id to delete
 *   onNewReport — called with examinee to open report flow
 */
const ExamineeDrawer = ({ examinee, onClose, onEdit, onDelete, onNewReport }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (examinee) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [examinee]);

  const fullName = examinee
    ? `${examinee.firstName || ''} ${examinee.lastName || ''}`.trim()
    : '';

  const infoRow = (icon, label, value) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ color: '#9ca3af', flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</p>
        <p style={{ margin: 0, fontSize: 14, color: '#111827', fontWeight: 500 }}>{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {examinee && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
              zIndex: 200, backdropFilter: 'blur(2px)'
            }}
          />

          {/* Drawer panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 400, maxWidth: '95vw',
              background: '#fff', zIndex: 201,
              display: 'flex', flexDirection: 'column',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.12)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px 16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 18, fontWeight: 700, flexShrink: 0
                }}>
                  {(examinee.firstName?.[0] || '?').toUpperCase()}
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: '#111827' }}>{fullName}</h2>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                    ID: {examinee.examineeId || examinee.systemId || '—'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid #e5e7eb',
                  background: 'transparent', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#6b7280'
                }}
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {/* Quick info */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Personal Info
                </h3>
                {infoRow(<FiCalendar size={14} />, 'Date of Birth', examinee.birthDate)}
                {infoRow(<FiUser size={14} />, 'Gender', examinee.gender)}
                {infoRow(<FiMail size={14} />, 'Email', examinee.email)}
                {infoRow(<FiPhone size={14} />, 'Phone', examinee.phone)}
                {infoRow(<FiMapPin size={14} />, 'Address', examinee.address)}
              </div>

              {/* Assessment info */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 12px', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Assessment
                </h3>
                {infoRow(<FiClipboard size={14} />, 'Grade', examinee.grade)}
                {infoRow(<FiActivity size={14} />, 'Status', examinee.status || 'Active')}
                {infoRow(<FiUser size={14} />, 'Therapist', examinee.therapistName || examinee.therapist)}
              </div>

              {/* View full profile link */}
              <button
                onClick={() => { onEdit && onEdit(examinee.id); onClose(); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '12px 16px', borderRadius: 10,
                  background: '#f0f9ff', border: '1px solid #bae6fd',
                  cursor: 'pointer', color: '#0369a1', fontWeight: 600, fontSize: 14
                }}
              >
                <span>View full profile</span>
                <FiChevronRight size={16} />
              </button>
            </div>

            {/* Footer actions */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid #e5e7eb',
              display: 'flex', gap: 8, flexShrink: 0
            }}>
              <button
                onClick={() => { onEdit && onEdit(examinee.id); onClose(); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  background: '#3b82f6', color: '#fff', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <FiEdit3 size={14} /> Edit
              </button>
              <button
                onClick={() => { onNewReport && onNewReport(examinee); onClose(); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 8,
                  background: '#10b981', color: '#fff', border: 'none',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                }}
              >
                <FiFileText size={14} /> New Report
              </button>
              <button
                onClick={() => { onDelete && onDelete(examinee.id); onClose(); }}
                style={{
                  width: 42, padding: '10px 0', borderRadius: 8,
                  background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca',
                  cursor: 'pointer', fontWeight: 600, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Delete examinee"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExamineeDrawer;
