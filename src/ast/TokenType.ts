

/**
 * 词法单元类型
 */
export enum TokenType {
    //单字符 token
    LeftParen = 'LEFT_PAREN',// (
    RightParen = 'RIGHT_PAREN',// )
    LeftBrace = 'LEFT_BRACE',// {
    RightBrace = 'RIGHT_BRACE',// }
    Comma = 'COMMA',// ,
    Dot = 'DOT',// .
    Minus = 'MINUS',// -
    Plus = 'PLUS',// +
    Semicolon = 'SEMICOLON',// ;
    Slash = 'SLASH',// /
    Star = 'STAR',// *
    // 多字符 token
    Bang = 'BANG',// !
    BangEqual = 'BANG_EQUAL',// !=
    Equal = 'EQUAL',// =
    EqualEqual = 'EQUAL_EQUAL',// ==
    Greater = 'GREATER',// >
    GreaterEqual = 'GREATER_EQUAL',// >=
    Less = 'LESS',// <
    LessEqual = 'LESS_EQUAL',// <=
    BitAnd = 'BIT_AND',// &
    BitOr = 'BIT_OR',// |
    And = 'AND',// &&    
    Or = 'OR',// ||

    // 关键字
    Class = 'CLASS',// class
    Else = 'ELSE',// else
    False = 'FALSE',// false
    For = 'FOR',// for
    Fun = 'FUN',// fun
    If = 'IF',// if
    Nil = 'NIL',// nil
    Print = 'PRINT',// print
    Return = 'RETURN',// return
    Super = 'SUPER',// super
    This = 'THIS',// this
    True = 'TRUE',// true
    Var = 'VAR',// var
    While = 'WHILE',// while
    // 标识符
    Identifier = 'IDENTIFIER',// identifier
    // 字面量
    String = 'STRING',// string
    Number = 'NUMBER',// number
    // 特殊 token
    EOF = 'EOF',// eof
}