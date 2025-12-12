import { Token } from "@/ast/Token";
import { ParserErrorHandler } from "./ErrorHandler";
import { TokenType } from "@/ast/TokenType";
import { BinaryExpr, Expr, GroupingExpr, LiteralExpr, UnaryExpr } from "@/ast/Expr";


/**
 * 运算符优先级
 */
enum Precedence {
    NONE,
    ASSIGNMENT,  // "="
    OR,          // "||"
    AND,         // "&&"
    EQUALITY,    // "==", "!="
    COMPARISON,  // "<", ">", "<=", ">="
    TERM,        // "+", "-"
    FACTOR,      // "*", "/"
    UNARY,       // "!", "-"
    CALL,        // ".", "()"
    PRIMARY
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
        [TokenType.LeftParen]: [this.grouping.bind(this), null, Precedence.NONE],
        [TokenType.RightParen]: [null, null, Precedence.NONE],
        [TokenType.LeftBrace]: [null, null, Precedence.NONE],
        [TokenType.RightBrace]: [null, null, Precedence.NONE],
        [TokenType.Comma]: [null, null, Precedence.NONE],
        [TokenType.Dot]: [null, null, Precedence.NONE],
        [TokenType.Minus]: [this.unary.bind(this), this.binary.bind(this), Precedence.TERM],
        [TokenType.Plus]: [null, this.binary.bind(this), Precedence.TERM],
        [TokenType.Star]: [null, this.binary.bind(this), Precedence.FACTOR],
        [TokenType.Slash]: [null, this.binary.bind(this), Precedence.FACTOR],
        [TokenType.Percent]: [null, null, Precedence.NONE],
        [TokenType.Caret]: [null, null, Precedence.NONE],
        [TokenType.Tilde]: [null, null, Precedence.NONE],
        [TokenType.Bang]: [null, null, Precedence.UNARY],
        [TokenType.BangEqual]: [null, null, Precedence.NONE],
        [TokenType.Equal]: [null, null, Precedence.NONE],
        [TokenType.EqualEqual]: [null, null, Precedence.NONE],
        [TokenType.Greater]: [null, null, Precedence.NONE],
        [TokenType.GreaterEqual]: [null, null, Precedence.NONE],
        [TokenType.Less]: [null, null, Precedence.NONE],
        [TokenType.LessEqual]: [null, null, Precedence.NONE],
        [TokenType.BitAnd]: [null, null, Precedence.NONE],
        [TokenType.BitOr]: [null, null, Precedence.NONE],
        [TokenType.And]: [null, null, Precedence.NONE],
        [TokenType.Or]: [null, null, Precedence.NONE],
        [TokenType.GreaterGreater]: [null, null, Precedence.NONE],
        [TokenType.LessLess]: [null, null, Precedence.NONE],
        [TokenType.PlusPlus]: [null, null, Precedence.NONE],
        [TokenType.MinusMinus]: [null, null, Precedence.NONE],
        [TokenType.PlusEqual]: [null, null, Precedence.NONE],
        [TokenType.MinusEqual]: [null, null, Precedence.NONE],
        [TokenType.StarEqual]: [null, null, Precedence.NONE],
        [TokenType.SlashEqual]: [null, null, Precedence.NONE],
        [TokenType.PercentEqual]: [null, null, Precedence.NONE],
        [TokenType.CaretEqual]: [null, null, Precedence.NONE],
        [TokenType.AndEqual]: [null, null, Precedence.NONE],
        [TokenType.OrEqual]: [null, null, Precedence.NONE],
        [TokenType.GreaterGreaterEqual]: [null, null, Precedence.NONE],
        [TokenType.LessLessEqual]: [null, null, Precedence.NONE],
        [TokenType.Identifier]: [null, null, Precedence.NONE],
        [TokenType.Number]: [this.number.bind(this), null, Precedence.NONE],
        [TokenType.String]: [null, null, Precedence.NONE],
        [TokenType.True]: [null, null, Precedence.NONE],
        [TokenType.False]: [null, null, Precedence.NONE],
        [TokenType.Null]: [null, null, Precedence.NONE],
        [TokenType.This]: [null, null, Precedence.NONE],
        [TokenType.Super]: [null, null, Precedence.NONE],
        [TokenType.Var]: [null, null, Precedence.NONE],
        [TokenType.While]: [null, null, Precedence.NONE],
        [TokenType.Do]: [null, null, Precedence.NONE],
        [TokenType.Loop]: [null, null, Precedence.NONE],
        [TokenType.Break]: [null, null, Precedence.NONE],
        [TokenType.Continue]: [null, null, Precedence.NONE],
        [TokenType.Semicolon]: [null, null, Precedence.NONE],
        [TokenType.Question]: [null, null, Precedence.NONE],
        [TokenType.Colon]: [null, null, Precedence.NONE],
        [TokenType.Class]: [null, null, Precedence.NONE],
        [TokenType.New]: [null, null, Precedence.NONE],
        [TokenType.Else]: [null, null, Precedence.NONE],
        [TokenType.For]: [null, null, Precedence.NONE],
        [TokenType.Fun]: [null, null, Precedence.NONE],
        [TokenType.EOF]: [null, null, Precedence.NONE],
        [TokenType.If]: [null, null, Precedence.NONE],
        [TokenType.Return]: [null, null, Precedence.NONE],
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
        while (precedence < this.rules[this.peek().type][2]) {
            token = this.advance();
            const infix = this.rules[token.type][1];
            if (!infix) {
                throw this.parseError(token, "Expect expression.");
            }
            expr = infix(expr, token);
        }
        return expr;
    }

    private expression(): Expr {
        return this.parsePrecedence(Precedence.ASSIGNMENT);
    }

    private binary(left: Expr, operator: Token): Expr {
        const right = this.parsePrecedence(this.rules[operator.type][2]);
        return new BinaryExpr(left, operator, right);
    }

    //
    private grouping(): Expr {
        let expr = this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after expression.");
        return new GroupingExpr(expr);
    }

    private unary(operator: Token): Expr {
        const right = this.parsePrecedence(Precedence.UNARY);
        return new UnaryExpr(operator, right);
    }

    private number(token: Token): LiteralExpr {
        let num = new LiteralExpr(parseFloat(token.lexeme));
        return num;
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