import type { ElementType, ReactNode } from 'react';

type BtnPrimaryProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const BtnPrimary = <T extends ElementType = 'button'>({
  as,
  className = '',
  children,
  ...props
}: BtnPrimaryProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className={`py-2.5 px-5 inline-block bg-primary text-white rounded-lg transition-transform items-center gap-1 hover:bg-accent hover:scale-[1.02] active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export default BtnPrimary;
