export const Dialog = ({ open, onOpenChange, children }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={cn(
    'bg-white rounded-lg shadow-xl p-6 w-full max-h-[90vh] overflow-y-auto',
    'animate-in fade-in-0 zoom-in-95 duration-200',
    className
  )}>
    {children}
  </div>
);

export default Button;