import { describe, it, expect } from 'vitest';
import { Scanner } from '@/parser/Scanner';
import { Parser } from '@/parser/Parser';
import { Interperter } from '@/execute/Interperter';
import RuntimeError from '@/execute/RunTimeError';
import ErrorHandler from '@/parser/ErrorHandler';

/**
 * 辅助函数：解析并执行表达式，期望抛出运行时错误
 */
function expectRuntimeError(source: string, expectedMessage?: string): void {
  const errors: string[] = [];
  const errorHandler: ErrorHandler = (line, column, message) => {
    errors.push(`[${line}:${column}] ${message}`);
  };

  const scanner = new Scanner(source, errorHandler);
  const tokens = scanner.scanTokens();
  
  if (errors.length > 0) {
    throw new Error(`词法分析错误: ${errors.join(', ')}`);
  }

  const parser = new Parser(tokens, errorHandler);
  const expr = parser.parse();
  
  if (errors.length > 0) {
    throw new Error(`语法分析错误: ${errors.join(', ')}`);
  }

  if (!expr) {
    throw new Error('解析失败：表达式为空');
  }

  const interpreter = new Interperter();
  
  try {
    interpreter.execute(expr);
    // 如果没有抛出错误，测试应该失败
    expect.fail('期望抛出运行时错误，但没有抛出');
  } catch (error) {
    expect(error).toBeInstanceOf(RuntimeError);
    if (expectedMessage) {
      expect((error as RuntimeError).message).toContain(expectedMessage);
    }
  }
}

describe('运行时错误', () => {
  describe('二元运算符类型错误', () => {
    it('应该对字符串和数字的减法抛出错误', () => {
      expectRuntimeError('"hello" - 5', 'Binary operator');
      expectRuntimeError('5 - "hello"', 'Binary operator');
      expectRuntimeError('"test" - 10', 'Binary operator');
    });

    it('应该对字符串和数字的乘法抛出错误', () => {
      expectRuntimeError('"hello" * 5', 'Binary operator');
      expectRuntimeError('5 * "hello"', 'Binary operator');
      expectRuntimeError('"test" * 2', 'Binary operator');
    });

    it('应该对字符串和数字的除法抛出错误', () => {
      expectRuntimeError('"hello" / 5', 'Binary operator');
      expectRuntimeError('5 / "hello"', 'Binary operator');
      expectRuntimeError('"test" / 2', 'Binary operator');
    });

    it('应该对字符串和数字的比较运算符抛出错误', () => {
      expectRuntimeError('"hello" > 5', 'Binary operator');
      expectRuntimeError('5 < "hello"', 'Binary operator');
      expectRuntimeError('"test" >= 10', 'Binary operator');
      expectRuntimeError('10 <= "test"', 'Binary operator');
    });

    it('应该对字符串和布尔值的运算抛出错误', () => {
      expectRuntimeError('"hello" + true', 'Binary operator');
      expectRuntimeError('true + "hello"', 'Binary operator');
      expectRuntimeError('"test" - false', 'Binary operator');
      expectRuntimeError('false * "test"', 'Binary operator');
    });

    it('应该对数字和布尔值的算术运算抛出错误', () => {
      expectRuntimeError('5 + true', 'Binary operator');
      expectRuntimeError('true - 5', 'Binary operator');
      expectRuntimeError('10 * false', 'Binary operator');
      expectRuntimeError('false / 2', 'Binary operator');
    });

    it('应该对数字和布尔值的比较运算抛出错误', () => {
      expectRuntimeError('5 > true', 'Binary operator');
      expectRuntimeError('true < 5', 'Binary operator');
      expectRuntimeError('10 >= false', 'Binary operator');
      expectRuntimeError('false <= 2', 'Binary operator');
    });

    it('应该对字符串和 nil 的运算抛出错误', () => {
      expectRuntimeError('"hello" - nil', 'Binary operator');
      expectRuntimeError('nil * "test"', 'Binary operator');
      expectRuntimeError('"test" / nil', 'Binary operator');
    });

    it('应该对数字和 nil 的算术运算抛出错误', () => {
      expectRuntimeError('5 + nil', 'Binary operator');
      expectRuntimeError('nil - 5', 'Binary operator');
      expectRuntimeError('10 * nil', 'Binary operator');
      expectRuntimeError('nil / 2', 'Binary operator');
    });

    it('应该对数字和 nil 的比较运算抛出错误', () => {
      expectRuntimeError('5 > nil', 'Binary operator');
      expectRuntimeError('nil < 5', 'Binary operator');
      expectRuntimeError('10 >= nil', 'Binary operator');
      expectRuntimeError('nil <= 2', 'Binary operator');
    });
  });

  describe('一元运算符类型错误', () => {
    it('应该对字符串应用负号抛出错误', () => {
      expectRuntimeError('-"hello"', 'Unary operator');
      expectRuntimeError('-"test"', 'Unary operator');
      expectRuntimeError('-"123"', 'Unary operator');
    });

    it('应该对布尔值应用负号抛出错误', () => {
      expectRuntimeError('-true', 'Unary operator');
      expectRuntimeError('-false', 'Unary operator');
    });

    it('应该对 nil 应用负号抛出错误', () => {
      expectRuntimeError('-nil', 'Unary operator');
    });
  });

  describe('复杂表达式中的运行时错误', () => {
    it('应该在复杂表达式中检测类型错误', () => {
      expectRuntimeError('1 + 2 * "hello"', 'Binary operator');
      expectRuntimeError('(1 + 2) * "test"', 'Binary operator');
      expectRuntimeError('"hello" + 1 * 2', 'Binary operator');
    });

    it('应该在嵌套表达式中检测类型错误', () => {
      expectRuntimeError('(1 + "hello") * 2', 'Binary operator');
      expectRuntimeError('1 + (2 * "test")', 'Binary operator');
      expectRuntimeError('((1 + 2) * "hello") + 3', 'Binary operator');
    });

    it('应该在一元运算符的复杂表达式中检测类型错误', () => {
      expectRuntimeError('-"hello" + 5', 'Unary operator');
      expectRuntimeError('1 + -"test"', 'Unary operator');
      expectRuntimeError('(-"hello") * 2', 'Unary operator');
    });

    it('应该在比较表达式中检测类型错误', () => {
      expectRuntimeError('"hello" > 5 + 2', 'Binary operator');
      expectRuntimeError('1 + 2 > "test"', 'Binary operator');
      expectRuntimeError('(1 + "hello") > 5', 'Binary operator');
    });
  });

  describe('链式表达式中的运行时错误', () => {
    it('应该在链式运算中检测第一个类型错误', () => {
      expectRuntimeError('"hello" + "world" - 5', 'Binary operator');
      expectRuntimeError('1 + 2 * "test" + 3', 'Binary operator');
    });

    it('应该在多个运算符的链式中检测类型错误', () => {
      expectRuntimeError('"a" + "b" * 2', 'Binary operator');
      expectRuntimeError('1 * "test" / 2', 'Binary operator');
    });
  });

  describe('分组表达式中的运行时错误', () => {
    it('应该在分组表达式中检测类型错误', () => {
      expectRuntimeError('("hello" - 5)', 'Binary operator');
      expectRuntimeError('(1 + "test")', 'Binary operator');
      expectRuntimeError('((1 + "hello") * 2)', 'Binary operator');
    });

    it('应该在深度嵌套的分组中检测类型错误', () => {
      expectRuntimeError('((("hello" - 5)))', 'Binary operator');
      expectRuntimeError('(1 + (2 * "test"))', 'Binary operator');
      expectRuntimeError('((1 + "hello") * (2 + 3))', 'Binary operator');
    });
  });
});

