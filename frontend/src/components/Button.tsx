import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  small?: boolean;
}

export default function Button({ variant = 'primary', small = false, className = '', ...rest }: ButtonProps) {
  const variantClass = variant === 'primary' ? '' : `btn-${variant}`;
  const sizeClass = small ? 'btn-small' : '';
  return <button className={`btn ${variantClass} ${sizeClass} ${className}`} {...rest} />;
}
