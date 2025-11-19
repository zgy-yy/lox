import { Scanner } from '@/Scanner';

import content from '@/test/token.e';

console.log(content);

// 测试词法分析器
const source = content;

try {
  const scanner = new Scanner(source);
  const tokens = scanner.scanTokens();
  console.log(tokens);
} catch (error) {
  if (error instanceof Error) {
    console.error('错误:', error.message);
  } else {
    console.error('未知错误:', error);
  }
}
