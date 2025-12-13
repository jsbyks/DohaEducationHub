import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
