import React, { useState } from 'react'
import { X, Copy, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, title, children, contentToCopy }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (contentToCopy) {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return createPortal(
    <div className='fixed inset-0 z-[9999] flex items-center justify-center px-4 py-8'>
      
      <div
        className='absolute inset-0 bg-slate-900/50 backdrop-blur-sm'
        onClick={onClose}
      />

      <div
        className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl p-8 z-10 animate-in fade-in slide-in-from-bottom-4 duration-300'
        onClick={(e) => e.stopPropagation()}
      >

        <button
          onClick={onClose}
          className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100'
        >
          <X className='w-5 h-5' />
        </button>

        {contentToCopy && (
          <button
            onClick={handleCopy}
            className={`absolute top-6 right-16 flex items-center gap-1 px-2 py-1 text-xs rounded-md
            ${copied
                ? 'bg-green-100 text-green-600'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
          >
            {copied ? (
              <>
                <Check className='w-4 h-4' />
                Copied
              </>
            ) : (
              <>
                <Copy className='w-4 h-4' />
                Copy
              </>
            )}
          </button>
        )}

        <div className='mb-6 pr-20'>
          <h3 className='text-xl font-medium text-slate-900'>
            {title}
          </h3>
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;