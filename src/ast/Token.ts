// Token 类型定义
export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly lexeme: string, // 词素
    public readonly literal: any,// 字面量
    public readonly line: number,// 行号
    public readonly column: number// 列号
  ) { }

  toString(): string {
    return `${this.type} ${this.lexeme} ${this.literal ? this.literal : ''}`;
  }
}

// Token 类型枚举
export enum TokenType {
  // 单字符 token
  LEFT_PAREN = 'LEFT_PAREN',// (    
  RIGHT_PAREN = 'RIGHT_PAREN',// )
  LEFT_BRACE = 'LEFT_BRACE',// {
  RIGHT_BRACE = 'RIGHT_BRACE',// }
  COMMA = 'COMMA',// ,
  DOT = 'DOT',// .
  MINUS = 'MINUS',// -
  PLUS = 'PLUS',// +
  SEMICOLON = 'SEMICOLON',// ;
  SLASH = 'SLASH',// /
  STAR = 'STAR',// *  

  // 一或两个字符的 token
  BANG = 'BANG',// !  
  BANG_EQUAL = 'BANG_EQUAL',// !=
  EQUAL = 'EQUAL',// =
  EQUAL_EQUAL = 'EQUAL_EQUAL',// ==
  GREATER = 'GREATER',// >
  GREATER_EQUAL = 'GREATER_EQUAL',// >=
  LESS = 'LESS',// <
  LESS_EQUAL = 'LESS_EQUAL',// <=
  BIT_AND = 'BIT_AND',// &
  BIT_OR = 'BIT_OR',// |
  AND = 'AND',// &&
  OR = 'OR',// ||


  // 字面量
  IDENTIFIER = 'IDENTIFIER',
  STRING = 'STRING',
  NUMBER = 'NUMBER',

  // 关键字
  CLASS = 'CLASS',
  ELSE = 'ELSE',
  FALSE = 'FALSE',
  FUN = 'FUN',
  FOR = 'FOR',
  IF = 'IF',
  NIL = 'NIL',
  PRINT = 'PRINT',
  RETURN = 'RETURN',
  SUPER = 'SUPER',
  THIS = 'THIS',
  TRUE = 'TRUE',
  VAR = 'VAR',
  WHILE = 'WHILE',

  EOF = 'EOF',
}



