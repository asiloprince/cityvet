interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  return (
    <div
      onClick={() => onOpenChange(false)}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? "visible bg-white/70 backdrop-blur-sm" : "invisible"
      } `}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-xl shadow p-6 transition-all border border-gray-300  ${
          open ? "scale-100 opacity-100" : "scale-125 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default AlertDialog;
