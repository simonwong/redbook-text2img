import type { StyleConfig } from './image-style-config';
import {
  Background,
  FontColor,
  FontSize,
  Horizontal,
  Vertical,
} from './preset-config';

export const defaultStyles: StyleConfig[] = [
  {
    id: 'built-in-minimal',
    name: '基础风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.black,
      contentColor: FontColor.black,
      background: Background.gray,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {},
  },
  {
    id: 'built-in-simple',
    name: '简约风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.black,
      contentColor: FontColor.black,
      background: Background.TrianglifyGary,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {},
  },
  {
    id: 'built-in-warm',
    name: '温暖风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.orange,
      contentColor: FontColor.black,
      background: Background.linearGradient1,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {},
  },
  {
    id: 'built-in-tech',
    name: '科技风格',
    content: {
      size: FontSize.md,
      titleColor: FontColor.blue,
      contentColor: FontColor.white,
      background: Background.linearGradient2,
      vertical: Vertical.top,
      horizontal: Horizontal.left,
    },
    cover: {},
  },
];

export const defaultStyleIds = defaultStyles.map((style) => style.id);
