import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'compact' | 'normal' | 'spacious';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'normal', className = '', children, ...props }, ref) => {
    const variantClasses = {
      default: 'card',
      elevated: 'card shadow-lg',
      outlined: 'bg-white border border-neutral-200 rounded-xl',
    };

    const paddingClasses = {
      compact: 'card-compact',
      normal: 'card-normal',
      spacious: 'card-spacious',
    };

    const baseClasses = `${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
