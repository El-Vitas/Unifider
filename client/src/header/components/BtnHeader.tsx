import type { ElementType, ReactNode } from 'react';

type BtnCardProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const BtnHeader = <T extends ElementType = 'button'>({
  as,
  children,
  ...props
}: BtnCardProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className="font-medium text-white transition-transform hover:scale-[1.04] active:scale-[0.96]"
      {...props}
    >
      {children}
    </Component>
  );
}

export default BtnHeader;
