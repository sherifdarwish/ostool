import React from 'react'
import { cn } from '@/utilities/ui'

export const Container: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => {
  return (
    <div className={cn('container mx-auto px-4 md:px-6', className)}>
      {children}
    </div>
  )
}
