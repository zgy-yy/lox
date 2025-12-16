import { Token } from "@/ast/Token";
import { ParserErrorHandler } from "./ErrorHandler";
import { TokenType } from "@/ast/TokenType";
import { BinaryExpr, Expr, LiteralExpr, PostfixExpr, ThisExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";


/**
 * 运算符优先级
 */
enum Precedence {
    NONE,
    COMMA,       // ","
    ASSIGNMENT,  // "=" , "+=", "-=", "*=", "/=", "%=", "^=", "&=", "|=", ">>=", "<<="
    OR,          // "||"
    AND,         // "&&"
    BIT_OR,      // "|"
    BIT_XOR,     // "^"
    BIT_AND,     // "&"
    EQUALITY,    // "==", "!="
    COMPARISON,  // "<", ">", "<=", ">="
    SHIFT,       // ">>", "<<"
    TERM,        // "+", "-", 
    FACTOR,      // "*", "/", "%",
    UNARY,       // "!", "-" , "++", "--", "new", '~'
    CALL,        // ".", "()"

}


/**
 * 解析规则
 * 前缀表达式：用于解析主要表达式
 * 中缀表达式：用于解析二元运算符
 * 优先级：用于确定运算符的优先级
 */
type ParseRule = [
    prefix: ((token: Token) => Expr) | null,
    infix: ((left: Expr, token: Token) => Expr) | null,
    precedence: number
]

export class Pratt {
    private current: number = 0;
    private readonly tokens: Token[];
    public parseError: ParserErrorHandler;

    private rules: Record<TokenType, ParseRule> = {
        [TokenType.Dot]: [null, null, Precedence.NONE],//.
        [TokenType.LeftParen]: [this.primary.bind(this), null, Precedence.NONE],//(

        [TokenType.Bang]: [this.unary.bind(this), null, Precedence.NONE],//!
        [TokenType.Minus]: [this.unary.bind(this), this.binary.bind(this), Precedence.TERM],//-
        [TokenType.PlusPlus]: [this.unary.bind(this), this.postfix.bind(this), Precedence.TERM],//++
        [TokenType.MinusMinus]: [this.unary.bind(this), this.postfix.bind(this), Precedence.TERM],//--
        [TokenType.New]: [null, null, Precedence.NONE],//new
        [TokenType.Tilde]: [null, null, Precedence.NONE],//~

        [TokenType.Star]: [null, this.binary.bind(this), Precedence.FACTOR],//*
        [TokenType.Slash]: [null, this.binary.bind(this), Precedence.FACTOR],// /
        [TokenType.Percent]: [null, this.binary.bind(this), Precedence.FACTOR],// %

        [TokenType.Plus]: [this.unary.bind(this), this.binary.bind(this), Precedence.TERM],//+

        [TokenType.GreaterGreater]: [null, this.binary.bind(this), Precedence.SHIFT],// >>
        [TokenType.LessLess]: [null, this.binary.bind(this), Precedence.SHIFT],// <<

        [TokenType.Greater]: [null, this.binary.bind(this), Precedence.COMPARISON],// >
        [TokenType.Less]: [null, this.binary.bind(this), Precedence.COMPARISON],// <
        [TokenType.GreaterEqual]: [null, this.binary.bind(this), Precedence.COMPARISON],// >=
        [TokenType.LessEqual]: [null, this.binary.bind(this), Precedence.COMPARISON],// <=

        [TokenType.EqualEqual]: [null, this.binary.bind(this), Precedence.EQUALITY],// == 
        [TokenType.BangEqual]: [null, this.binary.bind(this), Precedence.EQUALITY],// !=

        [TokenType.BitAnd]: [null, this.binary.bind(this), Precedence.BIT_AND],// &
        [TokenType.Caret]: [null, this.binary.bind(this), Precedence.BIT_XOR],// ^
        [TokenType.BitOr]: [null, this.binary.bind(this), Precedence.BIT_OR],// |
        [TokenType.And]: [null, this.binary.bind(this), Precedence.AND],// &&
        [TokenType.Or]: [null, this.binary.bind(this), Precedence.OR],// ||

        [TokenType.Equal]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// =
        [TokenType.PlusEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// +=
        [TokenType.MinusEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// -=
        [TokenType.StarEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// *=
        [TokenType.SlashEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// /=
        [TokenType.PercentEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// %=
        [TokenType.CaretEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// ^=
        [TokenType.AndEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// &=
        [TokenType.OrEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// |=    
        [TokenType.GreaterGreaterEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// >>=
        [TokenType.LessLessEqual]: [null, this.binary.bind(this), Precedence.ASSIGNMENT],// <<=
        [TokenType.Comma]: [null, this.binary.bind(this), Precedence.COMMA],//,


        [TokenType.True]: [this.primary.bind(this), null, Precedence.NONE],// true
        [TokenType.False]: [this.primary.bind(this), null, Precedence.NONE],// false
        [TokenType.Number]: [this.primary.bind(this), null, Precedence.NONE],// number
        [TokenType.String]: [this.primary.bind(this), null, Precedence.NONE],// string 
        [TokenType.Null]: [this.primary.bind(this), null, Precedence.NONE],// null
        [TokenType.Identifier]: [this.primary.bind(this), null, Precedence.NONE],// identifier

        [TokenType.RightParen]: [null, null, Precedence.NONE],//)
        [TokenType.LeftBrace]: [null, null, Precedence.NONE],//{
        [TokenType.RightBrace]: [null, null, Precedence.NONE],//}


        [TokenType.This]: [null, null, Precedence.NONE],// this
        [TokenType.Super]: [null, null, Precedence.NONE],// super
        [TokenType.Var]: [null, null, Precedence.NONE],// var
        [TokenType.While]: [null, null, Precedence.NONE],// while
        [TokenType.Do]: [null, null, Precedence.NONE],// do
        [TokenType.Loop]: [null, null, Precedence.NONE],// loop
        [TokenType.Break]: [null, null, Precedence.NONE],// break       
        [TokenType.Continue]: [null, null, Precedence.NONE],// continue
        [TokenType.Semicolon]: [null, null, Precedence.NONE],// ;
        [TokenType.Question]: [null, null, Precedence.NONE],// ?
        [TokenType.Colon]: [null, null, Precedence.NONE],// :
        [TokenType.Class]: [null, null, Precedence.NONE],// class
        [TokenType.Else]: [null, null, Precedence.NONE],// else
        [TokenType.For]: [null, null, Precedence.NONE],// for
        [TokenType.Fun]: [null, null, Precedence.NONE],// fun
        [TokenType.EOF]: [null, null, Precedence.NONE],// eof
        [TokenType.If]: [null, null, Precedence.NONE],// if
        [TokenType.Return]: [null, null, Precedence.NONE],// return
    };

    constructor(tokens: Token[], error: ParserErrorHandler) {
        this.tokens = tokens;
        this.parseError = error;
        const expr = this.expression();
        console.log(expr);
    }
    private parsePrecedence(precedence: number): Expr {
        let token = this.advance();

        const prefix = this.rules[token.type][0];
        if (!prefix) {
            throw this.parseError(token, "Expect expression.");
        }
        let expr = prefix(token);


        while (precedence <= this.rules[this.peek().type][2]) {
            console.log(precedence, this.peek().type);
            token = this.advance();
            const infix = this.rules[token.type][1];
            if (!infix) {
                throw this.parseError(token, "Expect expression..");
            }
            expr = infix(expr, token);
        }
        return expr;
    }

    private expression(): Expr {
        return this.parsePrecedence(Precedence.COMMA);
    }

    private binary(left: Expr, operator: Token): Expr {
        const precedence = this.rules[operator.type][2]
        const assignOperators = [TokenType.Equal, TokenType.PlusEqual, TokenType.MinusEqual, TokenType.StarEqual, TokenType.SlashEqual, TokenType.PercentEqual, TokenType.CaretEqual, TokenType.AndEqual, TokenType.OrEqual, TokenType.GreaterGreaterEqual, TokenType.LessLessEqual]
        //赋值运算符 右结合
        if (assignOperators.includes(operator.type)) {
            const right = this.parsePrecedence(precedence);
            return new BinaryExpr(left, operator, right);
        }
        const right = this.parsePrecedence(precedence + 1);
        return new BinaryExpr(left, operator, right);
    }

    private unary(operator: Token): Expr {
        const right = this.parsePrecedence(Precedence.UNARY);
        return new UnaryExpr(operator, right);
    }
    private postfix(left: Expr, operator: Token): Expr {
        return new PostfixExpr(left, operator);
    }

    private primary(token: Token): Expr {
        switch (token.type) {
            case TokenType.True:
                return new LiteralExpr(true);
            case TokenType.False:
                return new LiteralExpr(false);
            case TokenType.Null:
                return new LiteralExpr(null);
            case TokenType.Number:
                return new LiteralExpr(parseFloat(token.lexeme));
            case TokenType.String:
                return new LiteralExpr(token.literal);
            case TokenType.This:
                return new ThisExpr(token);
            case TokenType.Identifier:
                return new VariableExpr(token);
            case TokenType.LeftParen:
                return this.expression();
            default:
                throw this.parseError(token, "Expect expression.");
        }
    }

    //辅助方法

    /**
 * 消费一个 token
 * 如果当前 token 匹配指定类型，则消费它并返回；否则抛出解析错误
 * @param type 期望的 token 类型
 * @param message 错误消息
 * @returns 消费的 token
 */
    private consume(type: TokenType, message: string): Token {
        if (this.match(type)) {
            return this.previous();
        }
        throw this.parseError(this.peek(), message);
    }

    /**
 * 匹配并消费一个 token
 * 检查当前 token 是否匹配任意一个指定类型，如果匹配则消费并返回 true
 * @param types 要匹配的 token 类型列表
 * @returns 是否匹配并消费了 token
 */
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    /**
     * 检查当前 token 类型
     * 检查当前 token 是否是指定类型，不消费 token
     * @param type 要检查的 token 类型
     * @returns 是否匹配
     */
    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    /**
 * 前进一个 token
 * 将当前指针向前移动一位，并返回移动前的 token
 * @returns 移动前的 token
 */
    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    /**
 * 判断是否到达末尾
 * 检查是否已经解析完所有 token
 * @returns 是否到达末尾
 */
    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    /**
     * 获取当前 token
     * 返回当前正在解析的 token，不移动指针
     * @returns 当前 token
     */
    private peek(): Token {
        return this.tokens[this.current];
    }

    /**
     * 获取上一个 token
     * 返回最近消费的 token
     * @returns 上一个 token
     */
    private previous(): Token {
        return this.tokens[this.current - 1];
    }

}