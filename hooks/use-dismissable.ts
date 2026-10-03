import { useEffect, type RefObject } from 'react'
import { useEscapeKey } from '@/hooks/use-escape-key'

export function useDismissable(ref: RefObject<HTMLElement | null>, open: boolean, onClose: () => void) {
  useEscapeKey(open, onClose)

  useEffect(() => {
    if (!open) return
    const handlePointer = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handlePointer)
    return () => document.removeEventListener('mousedown', handlePointer)
  }, [ref, open, onClose])
}
