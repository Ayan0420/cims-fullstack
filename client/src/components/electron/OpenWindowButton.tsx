import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { Button } from 'react-bootstrap';
import { OpenRouteOptions, useOpenNewWindow } from '../../utils/electron';

interface OpenWindowButtonProps {
  route: string;
  variant: string;
  text: string;
  size: "sm" | "lg" | undefined;
  icon: FontAwesomeIconProps;
  webFallback?: OpenRouteOptions["fallback"];
}

const OpenWindowButton = ({ route, variant, text, size, icon, webFallback }: OpenWindowButtonProps) => {
  const openNewWindow = useOpenNewWindow();

  return (
    <Button variant={variant} size={size} onClick={() => openNewWindow(route, { fallback: webFallback })}>
      <FontAwesomeIcon {...icon} /> {text}
    </Button>
  );
};
export { useOpenNewWindow } from "../../utils/electron";

export default OpenWindowButton;
