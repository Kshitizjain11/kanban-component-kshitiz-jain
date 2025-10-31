import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', ...props }) => (
  <button
    className={clsx(
      'px-4 py-2 rounded font-medium',
      variant === 'primary' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
      className
    )}
    {...props}
  />
);

export default Button;
