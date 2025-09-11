
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const { toast } = useToast();

  const showSuccess = (message: string, title?: string) => {
    toast({
      title: title || "Success",
      description: message,
      variant: "default",
    });
  };

  const showError = (message: string, title?: string) => {
    toast({
      title: title || "Error",
      description: message,
      variant: "destructive",
    });
  };

  const showWarning = (message: string, title?: string) => {
    toast({
      title: title || "Warning",
      description: message,
      variant: "default",
    });
  };

  const showInfo = (message: string, title?: string) => {
    toast({
      title: title || "Info",
      description: message,
      variant: "default",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
