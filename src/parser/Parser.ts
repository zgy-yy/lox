import { AssignExpr, BinaryExpr, ConditionalExpr, Expr, LiteralExpr, LogicalExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";
import { Token } from "@/ast/Token";
import { TokenType } from "@/ast/TokenType";
import ErrorHandler from "./ErrorHandler";
import { BlockStmt, ExpressionStmt, IfStmt, PrintStmt, Stmt, VarStmt, WhileStmt } from "@/ast/Stmt";

class ParseError extends Error { }

export class Parser {
    private current: number = 0;
    private readonly tokens: Token[];
    public error: ErrorHandler;

    constructor(tokens: Token[], error: ErrorHandler) {
        this.tokens = tokens;
        this.error = error;
    }

    public parse(): Stmt[] | null {
        const statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            const declaration = this.declaration();
            if (declaration) {
                statements.push(declaration);
            }
        }
        return statements;
    }


    /**
     * 声明
     * declaration → varDecl | statement
     * 声明由变量声明和语句组成
     * 例如：
     * var a = 1;
     * print a;
     */
    private declaration(): Stmt | null {
        try {
            if (this.match(TokenType.Var)) {
                return this.varDeclaration();
            }
            return this.statement();
        } catch (error) {
            if (error instanceof ParseError) {
                this.synchronize();
                return null;
            }
            throw error;
        }
    }

    /**
     * 变量声明
     * varDecl → "var" IDENTIFIER ( "=" expression )? ";"
     * 变量声明由变量关键字、标识符和表达式组成，表达式后面跟一个分号
     * 例如：
     * var a = 1;
     * var b = 2;
     */
    private varDeclaration(): Stmt {
        const name = this.consume(TokenType.Identifier, "Expect variable name.");
        const initializer = this.match(TokenType.Equal) ? this.expression() : null;
        this.consume(TokenType.Semicolon, "Expect ';' after variable declaration.");
        return new VarStmt(name, initializer);
    }

    /**
     * 语句
     * statement → printStmt | expressionStatement
     * 语句由打印语句和表达式语句组成
     * 例如：
     * print 1 + 2;
     * a = 1;
     */
    private statement(): Stmt {
        if (this.match(TokenType.Print)) {
            return this.printStatement();
        }
        if (this.match(TokenType.LeftBrace)) {
            return new BlockStmt(this.block());
        }
        if (this.match(TokenType.If)) {
            return this.ifStatement();
        }
        if (this.match(TokenType.While)) {
            return this.whileStatement();
        }
        if (this.match(TokenType.For)) {
            return this.forStatement();
        }
        return this.expressionStatement();
    }

    /**
     * 条件语句
     * ifStatement → "if" "(" expression ")" statement ( "else" statement )?
     * 条件语句由条件关键字、括号表达式、语句和可选的 else 语句组成
     * 例如：
     * if (condition) {
     * statement;
     * } else {
     * statement;
     * }
     */
    private ifStatement(): Stmt {
        this.consume(TokenType.LeftParen, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after condition.");
        const thenBranch = this.statement();
        const elseBranch = this.match(TokenType.Else) ? this.statement() : null;
        return new IfStmt(condition, thenBranch, elseBranch);
    }

    /**
     * 打印语句
     * printStatement → "print" expression ";"
     * 打印语句由打印关键字和表达式组成，表达式后面跟一个分号
     * 例如：
     * print 1 + 2;
     * print name;
     */
    private printStatement(): Stmt {
        const value = this.expression();
        this.consume(TokenType.Semicolon, "Expect ';' after value.");
        return new PrintStmt(value);
    }

    /**
     * 表达式语句
     * expressionStatement → expression ";"
     * 表达式语句由表达式组成，表达式后面跟一个分号
     * 例如：
     * 1 + 2;
     * name;
     */
    private expressionStatement(): Stmt {
        const expr = this.expression();
        this.consume(TokenType.Semicolon, "Expect ';' after expression.");
        return new ExpressionStmt(expr);
    }
    /**
     * 块语句
     * block → "{" declaration* "}"
     * 块语句由大括号包围的声明组成
     * 例如：
     * {
     * var a = 1;
     * print a;
     * }
     */
    private block(): Stmt[] {
        const statements: Stmt[] = [];
        while (!this.check(TokenType.RightBrace) && !this.isAtEnd()) {
            const stmt = this.declaration();
            if (stmt) {
                statements.push(stmt);
            }
        }
        this.consume(TokenType.RightBrace, "Expect '}' after block.");
        return statements;
    }
    /**
     * 循环语句
     * whileStatement → "while" "(" expression ")" statement
     * 循环语句由循环关键字、括号表达式、语句组成
     * 例如：
     * while (condition) {
     * statement;
     * }
     */

    private whileStatement(): Stmt {
        this.consume(TokenType.LeftParen, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after condition.");
        const body = this.statement();
        return new WhileStmt(condition, body);
    }

    /**
     * 循环语句
     * forStatement → "for" "(" expression ";" expression ";" expression ")" statement
     * 循环语句由循环关键字、括号表达式、语句组成
     * 例如：
     * for (condition; condition; condition) {
     * statement;
     * }
     */
    private forStatement(): Stmt {
        this.consume(TokenType.LeftParen, "Expect '(' after 'for'.");
        let initializer: Stmt | null = null;
        if (this.match(TokenType.Semicolon)) {
            initializer = null
        } else if (this.match(TokenType.Var)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition: Expr | null =
            this.check(TokenType.Semicolon) ? null : this.expression();
        this.consume(TokenType.Semicolon, "Expect ';' after loop condition.");

        let increment: Expr | null =
            this.check(TokenType.RightParen) ? null : this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after loop increment.");
        let body = this.statement();

        if (increment !== null) {
            body = new BlockStmt([body, new ExpressionStmt(increment)]);
        }
        if (condition === null) {
            condition = new LiteralExpr(true);
        }
        body = new WhileStmt(condition, body);
        if (initializer !== null) {
            body = new BlockStmt([initializer, body]);
        }
        return body;

    }


    /**
     * 表达式
     * expression → equality
     * 表达式由相等性表达式组成
     * 例如：
     * 1 != 2
     * 1 == 2
     */
    private expression(): Expr {
        return this.assignment();
    }

    /**
     * 赋值表达式
     * assignment → IDENTIFIER "=" assignment | logical_or
     * 赋值表达式由标识符和赋值表达式组成，赋值表达式之间用 "=" 连接
     * 例如：
     * a = 1
     * a = b = 2
     */

    private assignment(): Expr {
        const expr = this.conditional();
        if (this.match(TokenType.Equal)) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr instanceof VariableExpr) {
                return new AssignExpr(expr.name, value);
            }
            this.parseError(equals, "Invalid assignment target.");
        }
        return expr;
    }

    /**
     * 条件表达式
     * conditional → logical_or ( "?" expression ":" expression )?
     * 条件表达式由逻辑或表达式组成，逻辑或表达式之间用 "?" 和 ":" 连接
     * 例如：
     * true ? 1 : 2
     * false ? 1 : 2
     */
    private conditional(): Expr {
        let expr = this.logical_or();
        if (this.match(TokenType.Question)) {
            const trueExpr = this.expression();
            this.consume(TokenType.Colon, "Expect ':' after '?'.");
            const falseExpr = this.expression();
            expr = new ConditionalExpr(expr, trueExpr, falseExpr);
        }
        return expr;
    }

    /**
     * 逻辑或表达式
     * logical_or → logical_and ( "or" logical_and )*
     * 逻辑或表达式由逻辑与表达式组成，逻辑与表达式之间用 "or" 连接
     * 例如：
     * true or false
     * true or false and true
     */

    private logical_or(): Expr {
        let expr = this.logical_and();
        while (this.match(TokenType.Or)) {
            const operator = this.previous();
            const right = this.logical_and();
            expr = new LogicalExpr(expr, operator, right);
        }
        return expr;
    }
    /**
     * 逻辑与表达式
     * logical_and → equality ( "and" equality )*
     * 逻辑与表达式由相等性表达式组成，相等性表达式之间用 "and" 连接
     * 例如：
     * true and false
     * true and false or true
     */

    private logical_and(): Expr {
        let expr = this.equality();
        while (this.match(TokenType.And)) {
            const operator = this.previous();
            const right = this.logical_or();
            expr = new LogicalExpr(expr, operator, right);
        }
        return expr;
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
            return new VariableExpr(this.previous());
        }
        if (this.match(TokenType.LeftParen)) {
            const expr = this.expression();
            this.consume(TokenType.RightParen, "Expect ')' after expression.");
            return expr;
        }
        return new LiteralExpr(null);
        // throw this.parseError(this.peek(), "Expect expression.");
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
        return new ParseError(message);
    }

    /**
     * 同步
     * 当解析器遇到错误时，会尝试同步到下一个语句，继续解析后续代码
     * 
     * */
    private synchronize(): void {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.previous().type === TokenType.Semicolon) return;
            switch (this.peek().type) {
                case TokenType.Class:
                case TokenType.Fun:
                case TokenType.Var:
                case TokenType.For:
                case TokenType.If:
                case TokenType.While:
                case TokenType.Print:
                case TokenType.Return:
                    return
            }
            this.advance();
        }
    }
}