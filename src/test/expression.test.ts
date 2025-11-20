import { describe, it, expect } from 'vitest';
import { Scanner } from '@/parser/Scanner';
import { Parser } from '@/parser/Parser';
import { Interperter } from '@/execute/Interperter';
import ErrorHandler from '@/parser/ErrorHandler';

/**
 * 辅助函数：解析并执行表达式
 */
function evaluateExpression(source: string): any {
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
  return interpreter.execute(expr);
}

describe('表达式求值', () => {
  describe('字面量', () => {
    it('应该求值数字字面量', () => {
      expect(evaluateExpression('123')).toBe(123);
      expect(evaluateExpression('0')).toBe(0);
      expect(evaluateExpression('42.5')).toBe(42.5);
    });

    it('应该求值字符串字面量', () => {
      expect(evaluateExpression('"hello"')).toBe('hello');
      expect(evaluateExpression('"world"')).toBe('world');
      expect(evaluateExpression('""')).toBe('');
    });

    it('应该求值布尔字面量', () => {
      expect(evaluateExpression('true')).toBe(true);
      expect(evaluateExpression('false')).toBe(false);
    });

    it('应该求值 nil', () => {
      expect(evaluateExpression('nil')).toBe(null);
    });
  });

  describe('一元表达式', () => {
    it('应该求值负号', () => {
      expect(evaluateExpression('-5')).toBe(-5);
      expect(evaluateExpression('-0')).toBe(-0);
      expect(evaluateExpression('-42.5')).toBe(-42.5);
    });

    it('应该求值逻辑非', () => {
      expect(evaluateExpression('!true')).toBe(false);
      expect(evaluateExpression('!false')).toBe(true);
      expect(evaluateExpression('!nil')).toBe(true);
      expect(evaluateExpression('!0')).toBe(true);
    });
  });

  describe('二元算术表达式', () => {
    it('应该求值加法', () => {
      expect(evaluateExpression('1 + 2')).toBe(3);
      expect(evaluateExpression('10 + 20')).toBe(30);
      expect(evaluateExpression('1.5 + 2.5')).toBe(4);
    });

    it('应该求值减法', () => {
      expect(evaluateExpression('5 - 3')).toBe(2);
      expect(evaluateExpression('10 - 20')).toBe(-10);
      expect(evaluateExpression('1.5 - 0.5')).toBe(1);
    });

    it('应该求值乘法', () => {
      expect(evaluateExpression('2 * 3')).toBe(6);
      expect(evaluateExpression('5 * 4')).toBe(20);
      expect(evaluateExpression('2.5 * 2')).toBe(5);
    });

    it('应该求值除法', () => {
      expect(evaluateExpression('6 / 2')).toBe(3);
      expect(evaluateExpression('10 / 4')).toBe(2.5);
      expect(evaluateExpression('1 / 2')).toBe(0.5);
    });

    it('应该求值字符串连接', () => {
      expect(evaluateExpression('"hello" + " " + "world"')).toBe('hello world');
      expect(evaluateExpression('"a" + "b"')).toBe('ab');
    });
  });

  describe('比较表达式', () => {
    it('应该求值大于', () => {
      expect(evaluateExpression('5 > 3')).toBe(true);
      expect(evaluateExpression('3 > 5')).toBe(false);
      expect(evaluateExpression('5 > 5')).toBe(false);
    });

    it('应该求值大于等于', () => {
      expect(evaluateExpression('5 >= 3')).toBe(true);
      expect(evaluateExpression('5 >= 5')).toBe(true);
      expect(evaluateExpression('3 >= 5')).toBe(false);
    });

    it('应该求值小于', () => {
      expect(evaluateExpression('3 < 5')).toBe(true);
      expect(evaluateExpression('5 < 3')).toBe(false);
      expect(evaluateExpression('5 < 5')).toBe(false);
    });

    it('应该求值小于等于', () => {
      expect(evaluateExpression('3 <= 5')).toBe(true);
      expect(evaluateExpression('5 <= 5')).toBe(true);
      expect(evaluateExpression('5 <= 3')).toBe(false);
    });
  });

  describe('相等性表达式', () => {
    it('应该求值相等', () => {
      expect(evaluateExpression('1 == 1')).toBe(true);
      expect(evaluateExpression('1 == 2')).toBe(false);
      expect(evaluateExpression('"hello" == "hello"')).toBe(true);
      expect(evaluateExpression('"hello" == "world"')).toBe(false);
      expect(evaluateExpression('true == true')).toBe(true);
      expect(evaluateExpression('nil == nil')).toBe(true);
    });

    it('应该求值不等', () => {
      expect(evaluateExpression('1 != 2')).toBe(true);
      expect(evaluateExpression('1 != 1')).toBe(false);
      expect(evaluateExpression('"hello" != "world"')).toBe(true);
      expect(evaluateExpression('"hello" != "hello"')).toBe(false);
    });
  });

  describe('分组表达式', () => {
    it('应该正确处理括号', () => {
      expect(evaluateExpression('(1 + 2) * 3')).toBe(9);
      expect(evaluateExpression('1 + (2 * 3)')).toBe(7);
      expect(evaluateExpression('(1 + 2) * (3 + 4)')).toBe(21);
    });

    it('应该正确处理嵌套括号', () => {
      expect(evaluateExpression('((1 + 2) * 3)')).toBe(9);
      expect(evaluateExpression('(1 + (2 * 3))')).toBe(7);
    });
  });

  describe('复杂表达式', () => {
    it('应该求值复杂算术表达式', () => {
      expect(evaluateExpression('1 + 2 * 3')).toBe(7);
      expect(evaluateExpression('(1 + 2) * 3')).toBe(9);
      expect(evaluateExpression('10 - 2 * 3')).toBe(4);
      expect(evaluateExpression('(10 - 2) * 3')).toBe(24);
    });

    it('应该求值混合比较表达式', () => {
      expect(evaluateExpression('1 + 2 > 2')).toBe(true);
      expect(evaluateExpression('1 + 2 == 3')).toBe(true);
      expect(evaluateExpression('5 * 2 >= 10')).toBe(true);
    });

    it('应该求值逻辑表达式', () => {
      expect(evaluateExpression('!true == false')).toBe(true);
      expect(evaluateExpression('!false == true')).toBe(true);
    });
  });

  describe('超复杂表达式', () => {
    it('应该求值多层嵌套的算术表达式', () => {
      expect(evaluateExpression('((1 + 2) * 3) + ((4 - 1) * 2)')).toBe(15);
      expect(evaluateExpression('(1 + (2 * (3 + 4)))')).toBe(15);
      expect(evaluateExpression('((((1 + 1) * 2) + 3) * 4) - 5')).toBe(23);
      expect(evaluateExpression('1 + 2 * 3 + 4 * 5')).toBe(27);
    });

    it('应该求值复杂的混合运算', () => {
      expect(evaluateExpression('1 + 2 * 3 - 4 / 2')).toBe(5);
      expect(evaluateExpression('(1 + 2) * (3 - 1) / 2')).toBe(3);
      expect(evaluateExpression('10 - 2 * 3 + 4 / 2')).toBe(6);
      expect(evaluateExpression('(10 - 2) * (3 + 4) / 2')).toBe(28);
    });

    it('应该求值链式比较表达式', () => {
      expect(evaluateExpression('1 + 2 > 2 + 1')).toBe(false);
      expect(evaluateExpression('1 + 2 >= 2 + 1')).toBe(true);
      expect(evaluateExpression('5 * 2 > 3 * 3')).toBe(true);
      expect(evaluateExpression('10 / 2 < 3 * 2')).toBe(true);
    });

    it('应该求值链式相等性表达式', () => {
      expect(evaluateExpression('1 + 2 == 3 == true')).toBe(true);
      expect(evaluateExpression('1 + 1 != 3 != false')).toBe(true);
      expect(evaluateExpression('5 * 2 == 10 == true')).toBe(true);
    });

    it('应该求值一元运算符与二元运算符的组合', () => {
      expect(evaluateExpression('-1 + 2')).toBe(1);
      expect(evaluateExpression('-(1 + 2)')).toBe(-3);
      expect(evaluateExpression('-1 * 2')).toBe(-2);
      expect(evaluateExpression('!true == false')).toBe(true);
      expect(evaluateExpression('!false != true')).toBe(false);
      expect(evaluateExpression('-(-5)')).toBe(5);
      expect(evaluateExpression('!(!true)')).toBe(true);
    });

    it('应该求值深度嵌套的括号表达式', () => {
      expect(evaluateExpression('((((1 + 1)))))')).toBe(2);
      expect(evaluateExpression('((1 + 2) * (3 + 4)) / ((5 - 2) * 2)')).toBe(3.5);
      expect(evaluateExpression('((((1 + 1) * 2) + 1) * 2) + 1')).toBe(11);
      expect(evaluateExpression('(1 + (2 + (3 + (4 + 5))))')).toBe(15);
    });

    it('应该求值复杂的字符串与数字混合表达式', () => {
      // 注意：解释器只支持字符串+字符串，不支持字符串+数字的自动转换
      expect(evaluateExpression('"result: " + "3"')).toBe('result: 3');
      expect(evaluateExpression('"a" + "1" + "2"')).toBe('a12');
      expect(evaluateExpression('"sum: " + "30"')).toBe('sum: 30');
    });

    it('应该求值复杂的布尔与比较混合表达式', () => {
      expect(evaluateExpression('(1 + 2) > 2 == true')).toBe(true);
      expect(evaluateExpression('(5 * 2) >= 10 == true')).toBe(true);
      expect(evaluateExpression('(3 < 5) == true')).toBe(true);
      expect(evaluateExpression('!((1 + 1) == 3)')).toBe(true);
    });

    it('应该求值多运算符链式表达式', () => {
      expect(evaluateExpression('1 + 2 + 3 + 4 + 5')).toBe(15);
      expect(evaluateExpression('10 - 2 - 3 - 1')).toBe(4);
      expect(evaluateExpression('2 * 3 * 4')).toBe(24);
      expect(evaluateExpression('100 / 2 / 5')).toBe(10);
      expect(evaluateExpression('1 + 2 * 3 + 4 * 5 + 6')).toBe(33);
    });

    it('应该求值复杂的优先级混合表达式', () => {
      expect(evaluateExpression('1 + 2 * 3 - 4 / 2 + 5')).toBe(10);
      expect(evaluateExpression('(1 + 2) * 3 - 4 / (2 + 2)')).toBe(8);
      expect(evaluateExpression('10 / 2 + 3 * 4 - 1')).toBe(16);
      expect(evaluateExpression('(10 - 2) * (3 + 1) / 4')).toBe(8);
    });

    it('应该求值包含负数的复杂表达式', () => {
      expect(evaluateExpression('-1 + -2')).toBe(-3);
      expect(evaluateExpression('-(1 + 2) * 3')).toBe(-9);
      expect(evaluateExpression('-5 * -2')).toBe(10);
      expect(evaluateExpression('(-1 + 2) * 3')).toBe(3);
      expect(evaluateExpression('10 + -5')).toBe(5);
    });

    it('应该求值复杂的逻辑与算术混合表达式', () => {
      expect(evaluateExpression('!(1 + 1 == 2)')).toBe(false);
      expect(evaluateExpression('!(1 + 1 != 2)')).toBe(true);
      expect(evaluateExpression('(1 + 2) > 1 == true')).toBe(true);
      expect(evaluateExpression('(5 * 2) == 10 != false')).toBe(true);
    });

    it('应该求值超长链式表达式', () => {
      expect(evaluateExpression('1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9 + 10')).toBe(55);
      expect(evaluateExpression('2 * 2 * 2 * 2 * 2')).toBe(32);
      expect(evaluateExpression('100 - 10 - 10 - 10 - 10 - 10')).toBe(50);
    });

    it('应该求值复杂的嵌套分组与运算', () => {
      expect(evaluateExpression('((1 + 2) * 3) + ((4 + 5) * 2)')).toBe(27);
      expect(evaluateExpression('(1 + (2 * (3 + (4 * 2))))')).toBe(23);
      expect(evaluateExpression('((10 - 2) * (3 + 1)) / ((2 + 2) * 1)')).toBe(8);
    });
  });
});

