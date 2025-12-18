import React from 'react'
import { cn } from '../../libs/utils';

const Card = ({ className, children, ...props }) => (
  <div className={cn("rounded-xl border bg-white text-gray-950 shadow-sm", className)} {...props}>
    {children}
  </div>
);

export default Card;