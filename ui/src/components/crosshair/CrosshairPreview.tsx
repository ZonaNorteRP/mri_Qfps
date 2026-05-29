import type { CrosshairConfig } from './types';
import CrosshairOverlay from './CrosshairOverlay';

interface CrosshairPreviewProps {
  config: CrosshairConfig;
}

export default function CrosshairPreview({ config }: CrosshairPreviewProps) {
  return (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        backgroundColor: '#1A1A1A',
        width: '100%',
        height: '80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CrosshairOverlay config={config} preview={true} />
    </div>
  );
}
