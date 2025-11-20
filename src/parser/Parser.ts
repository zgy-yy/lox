import { BinaryExpr, Expr, LiteralExpr, UnaryExpr } from "@/ast/Expr";
import { Token } from "@/ast/Token";
import { TokenType } from "@/ast/TokenType";
import ErrorHandler from "./ErrorHandler";

class ParseError extends Error { }

export class Parser {
    private current: number = 0;
    private readonly tokens: Token[];
    public error: ErrorHandler;

    constructor(tokens: Token[], error: ErrorHandler) {
        this.tokens = tokens;
        this.error = error;
    }

    public parse(): Expr {
        return this.expression();
    }


    private expression(): Expr {
        return this.equality();
    }

    /**
     * 相等性表达式
     * equality → comparison (( "!=" | "==" ) comparison)*
     * 相等性表达式由比较表达式组成，比较表达式之间用 "!=" 或 "==" 连接
     * 例如：
     * 1 != 2
     * 1 == 2
     * 1 != 2 == 3
     */
    private equality(): Expr {
        let expr = this.comparison();
        while (this.match(TokenType.BangEqual, TokenType.EqualEqual)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }


    /**
     * 比较表达式
     * comparison → term (( ">" | ">=" | "<" | "<=" ) term)*
     * 比较表达式由项表达式组成，项表达式之间用 ">"、">="、"<"、"<=" 连接
     * 例如：
     * 1 > 2
     */
    private comparison(): Expr {
        let expr = this.term();
        while (this.match(TokenType.Greater, TokenType.GreaterEqual, TokenType.Less, TokenType.LessEqual)) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    /**
     * 项表达式
     * term → factor (( "-" | "+" ) factor)*
     * 项表达式由因子表达式组成，因子表达式之间用 "-"、"+" 连接
     * 例如：
     * 1 - 2
     * 1 + 2
     */
    private term(): Expr {
        let expr = this.factor();
        while (this.match(TokenType.Minus, TokenType.Plus)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    /**
     * 因子表达式
     * factor → unary ( ( "/" | "*" ) unary )*
     * 因子表达式由一元表达式组成，一元表达式之间用 "/"、"*" 连接
     * 例如：
     * 1 / 2
     * 1 * 2
     */
    private factor(): Expr {
        let expr = this.unary();
        while (this.match(TokenType.Slash, TokenType.Star)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    /**
     * 一元表达式
     * unary → ( "!" | "-" ) unary | primary
     * 一元表达式由一元操作符和一元表达式组成
     * 例如：
     * !true
     * -1
     */
    private unary(): Expr {

        while (this.match(TokenType.Bang, TokenType.Minus)) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpr(operator, right);
        }
        return this.primary();
    }

    /**
     * 主要表达式
     * primary → number | string | true | false | nil | "(" expression ")" | identifier
     * 主要表达式由数字、字符串、布尔值、空值、括号表达式、标识符组成
     * 例如：
     * 1
     * "hello"
     * true
     * false
     * nil
     * (1 + 2)
     * identifier
     */
    private primary(): Expr {
        if (this.match(TokenType.True)) {
            return new LiteralExpr(true);
        }
        if (this.match(TokenType.False)) {
            return new LiteralExpr(false);
        }
        if (this.match(TokenType.Nil)) {
            return new LiteralExpr(null);
        }
        if (this.match(TokenType.Number)) {
            return new LiteralExpr(parseFloat(this.previous().lexeme));
        }
        if (this.match(TokenType.String)) {
            return new LiteralExpr(this.previous().literal);
        }
        if (this.match(TokenType.Identifier)) {
            // return new LiteralExpr(this.previous().lexeme);
        }
        if (this.match(TokenType.LeftParen)) {
            const expr = this.expression();
            this.consume(TokenType.RightParen, "Expect ')' after expression.");
            return expr;
        }
        throw this.parseError(this.peek(), "Expect expression.");
    }

    /**
     * 辅助方法
     */

    //消费一个 token
    private consume(type: TokenType, message: string): Token {
        if (this.match(type)) {
            return this.previous();
        }
        throw this.parseError(this.peek(), message);
    }


    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance();
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    //前进一个 token
    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }

    //判断是否到达末尾
    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOF;
    }

    //获取当前 token
    private peek(): Token {
        return this.tokens[this.current];
    }

    //获取上一个 token
    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private parseError(token: Token, message: string): ParseError {
        this.error(token.line, token.column, message);
        return new ParseError();
    }
}