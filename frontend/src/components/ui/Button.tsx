type Variant = 'outline' | 'solid' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  block?: boolean;
}

const VARIANT_CLASS: Record<Variant, string> = {
  outline: '',
  solid: ' btn-solid',
  ghost: ' btn-ghost',
};

export function Button({
  variant = 'outline',
  block = false,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = `btn${VARIANT_CLASS[variant]}${block ? ' btn-block' : ''} ${className}`.trim();
  return <button type={type} className={classes} {...rest} />;
}
