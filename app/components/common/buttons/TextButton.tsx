import React from 'react';

interface IdeaFormButtonProps {
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  disabled?: boolean;
}

const IdeaFormButton: React.FC<IdeaFormButtonProps> = ({
  onClick,
  variant,
  children,
  disabled = false,
}) => {
  const baseClasses =
    'rounded-full px-6 py-2 transition-colors duration-200 flex items-center justify-center';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
    secondary:
      'bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IdeaFormButton;
