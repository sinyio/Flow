import { useEffect } from "react";
import { Modal as BaseModal } from "@gravity-ui/uikit";

interface IModalProps extends React.ComponentProps<typeof BaseModal> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disableBodyScrollLock?: boolean;
}

export const Modal = ({ open, disableBodyScrollLock, ...props }: IModalProps) => {
  useEffect(() => {
    if (open && !disableBodyScrollLock) {
      const scrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [open, disableBodyScrollLock]);

  return <BaseModal {...props} open={open} />;
};
