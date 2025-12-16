import React, { useEffect } from 'react'

export type ToastType = 'info' | 'success' | 'error'

export default function Toast({ message, type = 'info', onClose }: { message: string; type?: ToastType; onClose?: () => void }) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-primary-600'

  return (
    <div className={`fixed top-6 right-6 z-50 ${bg} text-white px-4 py-3 rounded shadow-lg max-w-sm`} role="status">
      <div className="text-sm">{message}</div>
    </div>
  )
}
