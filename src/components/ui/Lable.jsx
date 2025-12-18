import React, { forwardRef } from 'react'
import { cn } from '../../libs/utils';

// --- LABEL ---
const Label = forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 mb-2 block",
      className
    )}
    {...props}
  />
));

export default Label