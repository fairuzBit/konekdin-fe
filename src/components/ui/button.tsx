import type { ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white hover:bg-brand-700',
        secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
        outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={twMerge(clsx(buttonVariants({ variant, size, className })))} {...props} />;
}
