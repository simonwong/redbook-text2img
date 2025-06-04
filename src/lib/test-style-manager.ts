// 测试样式管理器的功能
import { StyleManager } from './style-manager';
import { StyleConfig } from './image-style-config';

// 创建测试用的自定义样式配置
const testCustomStyle: StyleConfig = {
  id: 'custom-test',
  name: '自定义测试样式',
  description: '用于测试样式管理器功能的自定义样式',
  content: {
    size: 'lg',
    titleColor: 'purple',
    contentColor: 'black',
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    position: {
      vertical: 'center',
      horizontal: 'center',
    },
  },
  cover: {
    titleColor: 'white',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%)',
  },
};

// 测试函数
function testStyleManager() {
  console.log('=== 测试样式管理器功能 ===\n');

  // 1. 测试获取所有样式
  console.log('1. 测试获取所有样式:');
  const allStyles = StyleManager.getAllStyles();
  console.log(`   - 总共有 ${allStyles.length} 个样式`);
  console.log(
    `   - 内置样式: ${allStyles.filter((s) => ['minimal', 'warm', 'tech'].includes(s.id)).length} 个`
  );
  console.log(`   - 自定义样式: ${StyleManager.getCustomStyles().length} 个\n`);

  // 2. 测试保存自定义样式
  console.log('2. 测试保存自定义样式:');
  const saveResult = StyleManager.saveCustomStyle(testCustomStyle);
  console.log(`   - 保存结果: ${saveResult ? '成功' : '失败'}`);

  if (saveResult) {
    const savedStyle = StyleManager.getStyleById('custom-test');
    console.log(`   - 保存后能否找到: ${savedStyle ? '是' : '否'}`);
    console.log(`   - 样式名称: ${savedStyle?.name}\n`);
  }

  // 3. 测试当前样式设置
  console.log('3. 测试当前样式设置:');
  const currentStyleId = StyleManager.getCurrentStyleId();
  console.log(`   - 当前样式ID: ${currentStyleId}`);

  const setResult = StyleManager.setCurrentStyle('custom-test');
  console.log(`   - 设置为自定义样式: ${setResult ? '成功' : '失败'}`);

  const newCurrentStyle = StyleManager.getCurrentStyle();
  console.log(`   - 新的当前样式: ${newCurrentStyle.name}\n`);

  // 4. 测试样式复制
  console.log('4. 测试样式复制:');
  const clonedStyle = StyleManager.cloneStyle('minimal', 'cloned-minimal', '复制的简约样式');
  if (clonedStyle) {
    console.log(`   - 复制样式成功: ${clonedStyle.name}`);
    console.log(`   - 新样式描述: ${clonedStyle.description}`);

    const cloneSaveResult = StyleManager.saveCustomStyle(clonedStyle);
    console.log(`   - 保存复制的样式: ${cloneSaveResult ? '成功' : '失败'}\n`);
  }

  // 5. 测试导出功能
  console.log('5. 测试导出功能:');
  const exportData = StyleManager.exportStyles();
  console.log(`   - 导出数据长度: ${exportData.length} 字符`);
  console.log(`   - 导出数据预览: ${exportData.substring(0, 100)}...\n`);

  // 6. 测试获取样式选项
  console.log('6. 测试获取样式选项:');
  const updatedAllStyles = StyleManager.getAllStyles();
  updatedAllStyles.forEach((style, index) => {
    console.log(`   ${index + 1}. ${style.name} (${style.id}) - ${style.description}`);
  });

  // 7. 测试删除功能（清理测试数据）
  console.log('\n7. 清理测试数据:');
  const deleteResult1 = StyleManager.deleteCustomStyle('custom-test');
  const deleteResult2 = StyleManager.deleteCustomStyle('cloned-minimal');
  console.log(`   - 删除测试样式: ${deleteResult1 ? '成功' : '失败'}`);
  console.log(`   - 删除复制样式: ${deleteResult2 ? '成功' : '失败'}`);

  // 重置为默认样式
  StyleManager.setCurrentStyle('minimal');
  console.log('   - 重置为默认样式');

  console.log('\n=== 样式管理器测试完成 ===');
}

// 如果在浏览器环境中运行此测试
if (typeof window !== 'undefined') {
  // 延迟执行，确保模块加载完成
  setTimeout(testStyleManager, 100);
}

export { testStyleManager };
