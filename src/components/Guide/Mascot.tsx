/** Khalil, the app's character (the poses and their pictures: mascotPoses.ts). */
import { mascotUrl, type MascotPose } from './mascotPoses';

/**
 * `size` is the height: the full-body pictures are tall and cropped to the
 * character, so their width follows. The avatar is a round face of that size.
 */
export default function Mascot({ pose, size = 96, className = '' }: { pose: MascotPose; size?: number; className?: string }) {
  const url = mascotUrl(pose);
  if (url && pose === 'avatar') {
    return (
      <img
        src={url}
        alt=""
        width={size}
        height={size}
        draggable={false}
        className={`rounded-full object-cover object-top bg-clay-soft/10 shrink-0 select-none ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  if (url) {
    return <img src={url} alt="" height={size} draggable={false} className={`w-auto object-contain shrink-0 select-none ${className}`} style={{ height: size }} />;
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
