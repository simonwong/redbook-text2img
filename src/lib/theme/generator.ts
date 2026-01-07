/**
 * Style Generator
 * Converts AdjustedStyle to React CSSProperties
 */

import type React from 'react';
import type { AdjustedStyle } from './adjustments';
import { typography } from './tokens';

/** Generated CSS styles for Markdown rendering */
export interface GeneratedStyles {
  container: React.CSSProperties;
  innerContainer: React.CSSProperties;
  content: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  h4: React.CSSProperties;
  h5: React.CSSProperties;
  h6: React.CSSProperties;
  p: React.CSSProperties;
  strong: React.CSSProperties;
  em: React.CSSProperties;
  ul: React.CSSProperties;
  li: React.CSSProperties;
  pre: React.CSSProperties;
  code: React.CSSProperties;
  blockquote: React.CSSProperties;
  a: React.CSSProperties;
  mark: React.CSSProperties;
}

/**
 * Generate React CSSProperties from AdjustedStyle
 */
export function generateStyles(style: AdjustedStyle): GeneratedStyles {
  const { baseFontSize, lineHeight } = style.typography;
  const { padding, paragraphGap, headingGap } = style.spacing;
  const { fontFamily, headingAlignment } = style;

  // Background value (handles solid, gradient, image)
  const backgroundValue =
    style.background.type === 'image'
      ? `url(${style.background.value})`
      : style.background.value;

  const backgroundStyle: React.CSSProperties =
    style.background.type === 'solid'
      ? { backgroundColor: style.background.value }
      : { background: backgroundValue };

  // Helper for heading styles
  const createHeadingStyle = (
    scale: number,
    useHeadingAlignment: boolean
  ): React.CSSProperties => ({
    fontSize: `${scale}em`,
    lineHeight: 1.2,
    fontWeight: style.heading.fontWeight,
    marginBottom: `${headingGap / baseFontSize}em`,
    color: style.heading.color,
    textAlign: useHeadingAlignment ? headingAlignment : 'left',
    width: '100%',
  });

  return {
    container: {
      width: '300px',
      minWidth: '300px',
      height: '400px',
      minHeight: '400px',
      ...backgroundStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily,
      position: 'relative',
      fontSize: `${baseFontSize}px`,
      boxSizing: 'border-box',
    },

    innerContainer: {
      width: '100%',
      height: '100%',
      padding: `${padding}px`,
      boxSizing: 'border-box',
    },

    content: {
      flex: 1,
      overflow: 'hidden',
      fontSize: '1em',
      lineHeight,
      color: style.paragraph.color,
      wordBreak: 'break-word',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },

    // Headings: h1-h4 use heading alignment, h5-h6 always left
    h1: createHeadingStyle(typography.headingScale.h1, true),
    h2: createHeadingStyle(typography.headingScale.h2, true),
    h3: createHeadingStyle(typography.headingScale.h3, true),
    h4: createHeadingStyle(typography.headingScale.h4, true),
    h5: {
      ...createHeadingStyle(typography.headingScale.h5, false),
      color: style.paragraph.color,
    },
    h6: {
      ...createHeadingStyle(typography.headingScale.h6, false),
      color: style.paragraph.color,
    },

    p: {
      fontSize: '1em',
      lineHeight,
      marginBottom: `${paragraphGap / baseFontSize}em`,
      color: style.paragraph.color,
      wordBreak: 'break-word',
    },

    strong: {
      fontWeight: style.emphasis.bold.fontWeight,
      color: style.emphasis.bold.color,
    },

    em: {
      fontStyle: 'italic',
      color: style.emphasis.italic.color,
    },

    mark: {
      backgroundColor: style.emphasis.highlight.background,
      color: style.emphasis.highlight.color,
      padding: '0.1em 0.3em',
      borderRadius: '0.2em',
    },

    ul: {
      marginBottom: `${paragraphGap / baseFontSize}em`,
      paddingLeft: '1.5em',
      color: style.list.color,
    },

    li: {
      marginBottom: `${paragraphGap / 2 / baseFontSize}em`,
      fontSize: '1em',
      lineHeight,
    },

    blockquote: {
      marginBottom: `${paragraphGap / baseFontSize}em`,
      paddingLeft: '1em',
      borderLeft: `3px solid ${style.blockquote.borderColor}`,
      backgroundColor: style.blockquote.background,
      color: style.blockquote.textColor,
      fontStyle: 'italic',
    },

    pre: {
      marginBottom: `${paragraphGap / baseFontSize}em`,
      color: style.code.block.color,
      backgroundColor: style.code.block.background,
      whiteSpace: 'pre-wrap',
      fontSize: '0.875em',
      lineHeight: 1.5,
      wordBreak: 'break-word',
      borderRadius: '0.4em',
      padding: '0.6em 0.8em',
      width: '100%',
    },

    code: {
      color: style.code.inline.color,
      backgroundColor: style.code.inline.background,
      fontSize: '0.875em',
      padding: '0.15em 0.4em',
      borderRadius: '0.25em',
    },

    a: {
      color: style.link.color,
      textDecoration: style.link.underline ? 'underline' : 'none',
    },
  };
}
