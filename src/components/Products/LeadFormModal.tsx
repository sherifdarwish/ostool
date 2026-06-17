'use client'
import React, { useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { LeadForm } from './LeadForm'

export const LeadFormModal: React.FC<{
  productId: string
  productName: string
  triggerText?: string
  className?: string
}> = ({ productId, productName, triggerText = 'Try Now', className }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button size="lg" className={className}>
          {triggerText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader>
          <DrawerTitle className="text-2xl">Request for {productName}</DrawerTitle>
          <DrawerDescription>
            Submit your details and we&apos;ll get back to you with a demo or trial.
          </DrawerDescription>
        </DrawerHeader>
        <div className="pb-8">
          <LeadForm productId={productId} onSuccess={() => setIsOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
