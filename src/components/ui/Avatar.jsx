export const Avatar = ({ children, className }) => (
  <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}>
    {children}
  </div>
);

export const AvatarFallback = ({ children, className }) => (
  <div className={cn('flex h-full w-full items-center justify-center rounded-full bg-gray-100', className)}>
    {children}
  </div>
);