import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

function getInitials(name: string): string {
  const [a = '', b = ''] = name.split(' ');
  return (a[0] ?? '').concat(b[0] ?? '').toUpperCase();
}

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 32 }) => (
  src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className="rounded-full object-cover"
      title={name}
    />
  ) : (
    <span
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-bold"
      title={name}
    >
      {getInitials(name)}
    </span>
  )
);
export default Avatar;
