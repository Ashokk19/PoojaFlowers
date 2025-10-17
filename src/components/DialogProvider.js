import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import './Dialog.css';

const DialogContext = createContext({
  alert: async (_opts) => {},
  confirm: async (_opts) => false,
});

export const useDialog = () => useContext(DialogContext);

const defaultTexts = {
  okText: 'OK',
  cancelText: 'Cancel',
};

const VARIANT_ICONS = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  error: '⛔',
};

const normalizeOptions = (opts = {}) => {
  const {
    title = '',
    message = '',
    variant = 'info',
    okText = defaultTexts.okText,
    cancelText = defaultTexts.cancelText,
  } = opts;
  return { title, message, variant, okText, cancelText };
};

const DialogProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0]);
    }
  }, [queue, current]);

  const closeCurrent = useCallback((result) => {
    setCurrent((cur) => {
      if (cur && typeof cur.resolve === 'function') {
        try { cur.resolve(result); } catch (_) {}
      }
      return null;
    });
    setQueue((q) => q.slice(1));
  }, []);

  useEffect(() => {
    if (!current) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        // Cancel confirm, close alert
        closeCurrent(current.type === 'confirm' ? false : true);
      }
      if (e.key === 'Enter' && current.type === 'alert') {
        closeCurrent(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [current, closeCurrent]);

  const api = useMemo(() => ({
    alert: (opts) => new Promise((resolve) => {
      const options = normalizeOptions(opts);
      setQueue((q) => [
        ...q,
        { id: `${Date.now()}_${Math.random()}`, type: 'alert', resolve, ...options },
      ]);
    }),
    confirm: (opts) => new Promise((resolve) => {
      const options = normalizeOptions(opts);
      setQueue((q) => [
        ...q,
        { id: `${Date.now()}_${Math.random()}`, type: 'confirm', resolve, ...options },
      ]);
    }),
  }), []);

  return (
    <DialogContext.Provider value={api}>
      {children}
      {current && (
        <div className="dialog-overlay" onClick={() => closeCurrent(current.type === 'confirm' ? false : true)}>
          <div className={`global-dialog dialog-${current.variant}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => closeCurrent(current.type === 'confirm' ? false : true)}>×</button>
            <div className="dialog-header">
              <div className={`dialog-icon ${current.variant}`}>{VARIANT_ICONS[current.variant] || VARIANT_ICONS.info}</div>
              {current.title ? <h3 className="dialog-title">{current.title}</h3> : null}
            </div>
            {current.message ? (
              <div className="dialog-body">
                <p>{current.message}</p>
              </div>
            ) : null}
            <div className="dialog-actions">
              {current.type === 'confirm' ? (
                <>
                  <button className="dialog-btn dialog-btn-secondary" onClick={() => closeCurrent(false)}>
                    {current.cancelText || defaultTexts.cancelText}
                  </button>
                  <button className={`dialog-btn dialog-btn-primary ${current.variant}`} onClick={() => closeCurrent(true)}>
                    {current.okText || defaultTexts.okText}
                  </button>
                </>
              ) : (
                <button className="dialog-btn dialog-btn-primary" onClick={() => closeCurrent(true)}>
                  {current.okText || defaultTexts.okText}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export default DialogProvider;
