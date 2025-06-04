import { StyleConfig } from './image-style-config';
import { defaultStyles, isBuiltInStyle } from './default-styles';

// 本地存储的键名
const CUSTOM_STYLES_KEY = 'redbook-custom-styles';
const CURRENT_STYLE_KEY = 'redbook-current-style';

// 样式管理器
export class StyleManager {
  // 获取所有可用的样式（内置 + 自定义）
  static getAllStyles(): StyleConfig[] {
    const customStyles = this.getCustomStyles();
    return [...defaultStyles, ...customStyles];
  }

  // 获取用户自定义的样式
  static getCustomStyles(): StyleConfig[] {
    try {
      const saved = localStorage.getItem(CUSTOM_STYLES_KEY);
      if (!saved) return [];

      const customStyles = JSON.parse(saved);
      // 验证数据格式
      if (!Array.isArray(customStyles)) return [];

      return customStyles.filter(this.validateStyleConfig);
    } catch (error) {
      console.error('获取自定义样式失败:', error);
      return [];
    }
  }

  // 保存用户自定义样式
  static saveCustomStyle(style: StyleConfig): boolean {
    try {
      // 不能覆盖内置样式
      if (isBuiltInStyle(style.id)) {
        throw new Error('不能覆盖内置样式');
      }

      // 验证配置格式
      if (!this.validateStyleConfig(style)) {
        throw new Error('样式配置格式无效');
      }

      const customStyles = this.getCustomStyles();

      // 检查是否已存在相同ID的样式
      const existingIndex = customStyles.findIndex((s) => s.id === style.id);

      if (existingIndex >= 0) {
        // 更新现有样式
        customStyles[existingIndex] = style;
      } else {
        // 添加新样式
        customStyles.push(style);
      }

      localStorage.setItem(CUSTOM_STYLES_KEY, JSON.stringify(customStyles));
      return true;
    } catch (error) {
      console.error('保存自定义样式失败:', error);
      return false;
    }
  }

  // 删除用户自定义样式
  static deleteCustomStyle(styleId: string): boolean {
    try {
      // 不能删除内置样式
      if (isBuiltInStyle(styleId)) {
        throw new Error('不能删除内置样式');
      }

      const customStyles = this.getCustomStyles();
      const filteredStyles = customStyles.filter((s) => s.id !== styleId);

      localStorage.setItem(CUSTOM_STYLES_KEY, JSON.stringify(filteredStyles));

      // 如果删除的是当前使用的样式，切换到默认样式
      if (this.getCurrentStyleId() === styleId) {
        this.setCurrentStyle('minimal');
      }

      return true;
    } catch (error) {
      console.error('删除自定义样式失败:', error);
      return false;
    }
  }

  // 根据ID获取样式配置
  static getStyleById(id: string): StyleConfig | undefined {
    const allStyles = this.getAllStyles();
    return allStyles.find((style) => style.id === id);
  }

  // 设置当前使用的样式
  static setCurrentStyle(styleId: string): boolean {
    try {
      // 检查是否在浏览器环境
      if (typeof window === 'undefined') return false;

      const style = this.getStyleById(styleId);
      if (!style) {
        throw new Error('样式不存在');
      }

      localStorage.setItem(CURRENT_STYLE_KEY, styleId);
      return true;
    } catch (error) {
      console.error('设置当前样式失败:', error);
      return false;
    }
  }

  // 获取当前使用的样式ID
  static getCurrentStyleId(): string {
    // 检查是否在浏览器环境
    if (typeof window === 'undefined') return 'minimal';

    return localStorage.getItem(CURRENT_STYLE_KEY) || 'minimal';
  }

  // 获取当前使用的样式配置
  static getCurrentStyle(): StyleConfig {
    const styleId = this.getCurrentStyleId();
    const style = this.getStyleById(styleId);

    // 如果当前样式不存在，返回默认样式
    return style || this.getStyleById('minimal')!;
  }

  // 复制样式配置（用于基于现有样式创建新样式）
  static cloneStyle(sourceId: string, newId: string, newName: string): StyleConfig | null {
    try {
      const sourceStyle = this.getStyleById(sourceId);
      if (!sourceStyle) {
        throw new Error('源样式不存在');
      }

      // 深拷贝配置
      const clonedStyle: StyleConfig = {
        ...JSON.parse(JSON.stringify(sourceStyle)),
        id: newId,
        name: newName,
        description: `基于 "${sourceStyle.name}" 创建的自定义样式`,
      };

      return clonedStyle;
    } catch (error) {
      console.error('复制样式失败:', error);
      return null;
    }
  }

  // 导出样式配置（JSON格式）
  static exportStyles(): string {
    const customStyles = this.getCustomStyles();
    return JSON.stringify(customStyles, null, 2);
  }

  // 导入样式配置
  static importStyles(jsonString: string): boolean {
    try {
      const importedStyles = JSON.parse(jsonString);

      if (!Array.isArray(importedStyles)) {
        throw new Error('导入的数据格式无效');
      }

      // 验证每个样式配置
      const validStyles = importedStyles.filter(this.validateStyleConfig);

      if (validStyles.length === 0) {
        throw new Error('没有找到有效的样式配置');
      }

      // 合并到现有的自定义样式中
      const existingStyles = this.getCustomStyles();
      const mergedStyles = [...existingStyles];

      validStyles.forEach((newStyle) => {
        const existingIndex = mergedStyles.findIndex((s) => s.id === newStyle.id);
        if (existingIndex >= 0) {
          // 更新现有样式
          mergedStyles[existingIndex] = newStyle;
        } else {
          // 添加新样式
          mergedStyles.push(newStyle);
        }
      });

      localStorage.setItem(CUSTOM_STYLES_KEY, JSON.stringify(mergedStyles));
      return true;
    } catch (error) {
      console.error('导入样式失败:', error);
      return false;
    }
  }

  // 重置所有自定义样式（危险操作）
  static resetCustomStyles(): boolean {
    try {
      localStorage.removeItem(CUSTOM_STYLES_KEY);
      localStorage.removeItem(CURRENT_STYLE_KEY);
      return true;
    } catch (error) {
      console.error('重置自定义样式失败:', error);
      return false;
    }
  }
}
