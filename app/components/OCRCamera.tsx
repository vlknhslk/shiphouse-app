import { Camera } from 'expo-camera';
// ... diğer importlar

export function OCRCamera({ onCapture, ...props }) {
  return <Camera ratio="16:9" {...props} />;
}
