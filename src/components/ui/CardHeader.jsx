import React from 'react'
import { cn } from '../../libs/utils';

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>
);

export default CardHeader;