/** Khalil, the app's character (the poses and their pictures: mascotPoses.ts). */
import { mascotUrl, type MascotPose } from './mascotPoses';

export default function Mascot({ pose, size = 96, className = '' }: { pose: MascotPose; size?: number; className?: string }) {
  const url = mascotUrl(pose);
  if (url) {
    return <img src={url} alt="" width={size} height={size} draggable={false} className={`object-contain select-none ${className}`} style={{ width: size, height: size }} />;
  }
  return (
    <div
      aria-hidden="true"
      className={`rounded-2xl bg-clay-soft/10 flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="font-amiri text-clay-soft leading-none" style={{ fontSize: size * 0.45 }}>خ</span>
    </div>
  );
}
