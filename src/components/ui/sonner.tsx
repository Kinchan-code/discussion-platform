import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Toaster Component
 *
 * @description A wrapper around Sonner's Toaster component with custom theming and styles.
 *
 * components used:
 * - Sonner (sonner library)
 *
 * @param props - Props passed to the Sonner Toaster component.
 *
 * @returns A styled Toaster component that displays notifications.
 *
 * @example
 * <Toaster theme="light" />
 */

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
