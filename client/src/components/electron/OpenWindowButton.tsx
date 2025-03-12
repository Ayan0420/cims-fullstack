import { useCallback } from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';

interface OpenWindowButtonProps {
  route: string;
  variant: string;
  text: string;
  size: "sm" | "lg" | undefined;
  icon: FontAwesomeIconProps;
}

const OpenWindowButton = ({ route, variant, text, size, icon }: OpenWindowButtonProps) => {
  const openNewWindow = () => {
    window.postMessage({
      type: 'OPEN_WINDOW',
      payload: { route }
    }, '*'); // You can replace '*' with a specific origin for added security
  };

  return (
    <Button variant={variant} size={size} onClick={openNewWindow}>
      <FontAwesomeIcon {...icon} /> {text}
    </Button>
  );
};

export const useOpenNewWindow = () => {
  const openNewWindow = useCallback((route: string) => {
    window.postMessage({
      type: 'OPEN_WINDOW',
      payload: { route }
    }, '*');
  }, []);

  return openNewWindow;
};


export default OpenWindowButton;

