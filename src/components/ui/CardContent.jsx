import React from 'react'
import { cn } from '../../libs/utils';

const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>
);

export default CardContent;