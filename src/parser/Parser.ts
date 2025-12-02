import { AssignExpr, BinaryExpr, CallExpr, ConditionalExpr, Expr, LiteralExpr, LogicalExpr, PostfixExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";
import { Token } from "@/ast/Token";
import { TokenType } from "@/ast/TokenType";
import { ParserErrorHandler } from "./ErrorHandler";
import { BlockStmt, BreakStmt, ContinueStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, ReturnStmt, Stmt, VarStmt, WhileStmt } from "@/ast/Stmt";

class ParseError extends Error { }

export class Parser {
    private current: number = 0;
    private readonly tokens: Token[];
    public error: ParserErrorHandler;

    constructor(tokens: Token[], error: ParserErrorHandler) {
        this.tokens = tokens;
        this.error = error;
    }

    /**
     * 解析 tokens 为语句列表
     * 将词法分析器生成的 token 序列解析为抽象语法树（AST）
     * 程序由变量声明和函数声明组成
     * @returns 解析后的语句列表，如果解析失败则返回 null
     */
    public parse(): Stmt[] | null {
        const statements: Stmt[] = [];
        while (!this.isAtEnd()) {
            try {
                if (this.match(TokenType.Var)) {
                    const stmt = this.varDeclaration();
                    if (stmt) {
                        statements.push(stmt);
                    }
                } else if (this.match(TokenType.Fun)) {
                    const stmt = this.funDeclaration();
                    if (stmt) {
                        statements.push(stmt);
                    }
                } else {
                    // 程序顶层只能有变量声明和函数声明
                    throw this.parseError(this.peek(), "Expect variable or function declaration.");

                }
            } catch (error) {
                if (error instanceof ParseError) {
                    this.synchronize();
                } else {
                    throw error;
                }
            }
        }
        return statements;
    }



    /**
     * 声明
     * declaration → varDecl | funDecl | statement
     * 声明由变量声明、函数声明和语句组成
     * 例如：
     * var a = 1;
     * fun add(a, b) {
     * return a + b;
     * }
     * print a;
     */
    private declaration(): Stmt | null {
        try {
            if (this.match(TokenType.Var)) {
                return this.varDeclaration();
            }
            if (this.match(TokenType.Fun)) {
                return this.funDeclaration();
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
     * 函数声明
     * functionDeclaration → "fun" IDENTIFIER "(" parameters? ")" "{" body "}"
     * 函数声明由函数关键字、标识符、参数列表、大括号包围的语句列表组成
     * 例如：
     * fun add(a, b) {
     * return a + b;
     * }
     */
    private funDeclaration(): Stmt {
        const fnName = this.consume(TokenType.Identifier, "Expect function name.");
        this.consume(TokenType.LeftParen, "Expect '(' after function name.");
        const parameters: Token[] = [];
        if (!this.check(TokenType.RightParen)) {
            do {
                if (parameters.length >= 255) {
                    this.parseError(this.previous(), "Can't have more than 255 parameters.");
                }
                parameters.push(this.consume(TokenType.Identifier, "Expect parameter name."));
            } while (this.match(TokenType.Comma));
        }
        this.consume(TokenType.RightParen, "Expect ')' after parameters.");
        this.consume(TokenType.LeftBrace, "Expect '{' after parameters.");
        const body = this.block();
        return new FunctionStmt(fnName, parameters, body);
    }

    /**
     * 语句
     * statement →  block | ifStmt | whileStmt | forStmt | doWhileStmt | loopStmt | breakStmt | continueStmt | expressionStatement | returnStatement
     * 语句由块语句、条件语句、循环语句、跳出语句、继续语句和表达式语句组成
     * 例如：
     * { var a = 1; }
     * if (a) { var b = 2; }
     * while (a) { var b = 3; }
     */
    private statement(): Stmt {
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
        if (this.match(TokenType.Do)) {
            return this.doWhileStatement();
        }
        if (this.match(TokenType.Loop)) {
            return this.loopStatement();
        }
        if (this.match(TokenType.Break)) {
            return this.breakStatement();
        }
        if (this.match(TokenType.Continue)) {
            return this.continueStatement();
        }
        if (this.match(TokenType.Return)) {
            return this.returnStatement();
        }
        return this.expressionStatement();
    }


    /**
     * 返回语句
     * returnStatement → "return" expression? ";"
     * 返回语句由返回关键字和可选的表达式组成，表达式后面跟一个分号
     * 例如：
     * return 1;
     * return;
     */
    private returnStatement(): Stmt {
        const keyword = this.previous();
        const value = this.check(TokenType.Semicolon) ? null : this.expression();
        this.consume(TokenType.Semicolon, "Expect ';' after return value.");
        return new ReturnStmt(keyword, value);
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
     * 获取块 body
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
     * forStatement → "for" "(" ( varDecl | exprStmt )? ";" expression? ";" expression? ")" statement
     * 循环语句由循环关键字、初始化语句（可选）、条件表达式（可选）、增量表达式（可选）和循环体组成
     * 例如：
     * for (var i = 0; i < 10; i = i + 1) { print i; }
     * for (; i < 10; i = i + 1) { print i; }
     * for (var i = 0; ; i = i + 1) { print i; }
     */
    private forStatement(): Stmt {
        this.consume(TokenType.LeftParen, "Expect '(' after 'for'.");
        let initializer: Stmt
        if (this.match(TokenType.Var)) {
            initializer = this.varDeclaration();
        } else {
            initializer = this.expressionStatement();
        }

        let condition: Expr = this.check(TokenType.Semicolon) ? new LiteralExpr(true) : this.expression();
        this.consume(TokenType.Semicolon, "Expect ';' after loop condition.");

        let increment: Expr = this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after loop increment.");
        let body = this.statement();


        return new BlockStmt([new ForStmt(initializer, condition, increment, body)]);
    }

    /**
     * 循环语句
     * doWhileStatement → "do" statement "while" "(" expression ")" ";"
     * 循环语句由循环关键字、语句、循环关键字、括号表达式、分号组成
     * 例如：
     * do {
     * statement;
     * } while (condition);
     */

    private doWhileStatement(): Stmt {
        const body = this.statement();
        this.consume(TokenType.While, "Expect 'while'.");
        this.consume(TokenType.LeftParen, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType.RightParen, "Expect ')' after condition.");
        this.consume(TokenType.Semicolon, "Expect ';' after condition.");
        return new WhileStmt(condition, body);
    }


    /**
     * 循环语句
     * loopStatement → "loop" statement 
     * 循环语句由循环关键字和循环体组成，等价于 while (true) statement
     * 例如：
     * loop {
     * statement;
     * } 
     */
    private loopStatement(): Stmt {
        const body = this.statement();
        const condition = new LiteralExpr(true);
        return new WhileStmt(condition, body);
    }

    /**
     * 跳出循环语句
     * breakStatement → "break" ";"
     * 跳出循环语句由跳出关键字和分号组成
     * 例如：
     * break;
     */
    private breakStatement(): Stmt {
        this.consume(TokenType.Semicolon, "Expect ';' after break.");
        return new BreakStmt(this.previous());
    }

    /**
     * 继续循环语句
     * continueStatement → "continue" ";"
     * 继续循环语句由继续关键字和分号组成
     * 例如：
     * continue;
     */
    private continueStatement(): Stmt {
        this.consume(TokenType.Semicolon, "Expect ';' after continue.");
        return new ContinueStmt(this.previous());
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
     * 表达式
     * expression → comma
     * 表达式由逗号表达式组成
     * 例如：
     * 1, 2, 3
     * a = 1, b = 2
     */
    private expression(): Expr {
        return this.comma();
    }



    /**
     * 逗号表达式
     * comma → assignment ( "," assignment )*
     * 逗号表达式由赋值表达式组成，赋值表达式之间用 "," 连接
     * 例如：
     * 1, 2, 3
     * a, b, c
     */
    private comma(): Expr {
        let expr = this.assignment();
        while (this.match(TokenType.Comma)) {
            const operator = this.previous();
            const right = this.assignment();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    /**
     * 赋值表达式
     * assignment → conditional ( "=" assignment )?
     * 赋值表达式由条件表达式和可选的赋值表达式组成，赋值表达式之间用 "=" 连接
     * 赋值目标必须是变量表达式
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
     * conditional → logical_or ( "?" assignment ":" assignment )?
     * 条件表达式由逻辑或表达式组成，逻辑或表达式之间用 "?" 和 ":" 连接
     * 例如：
     * true ? 1 : 2
     * false ? 1 : 2
     */
    private conditional(): Expr {
        let expr = this.logical_or();
        if (this.match(TokenType.Question)) {
            const trueExpr = this.assignment();
            this.consume(TokenType.Colon, "Expect ':' after '?'.");
            const falseExpr = this.assignment();
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
     * logical_and → bitwise_or ( "and" logical_or )*
     * 逻辑与表达式由按位或表达式组成，逻辑与表达式之间用 "and" 连接
     * 例如：
     * true and false
     * true and false or true
     */

    private logical_and(): Expr {
        let expr = this.bitwise_or();
        while (this.match(TokenType.And)) {
            const operator = this.previous();
            const right = this.logical_or();
            expr = new LogicalExpr(expr, operator, right);
        }
        return expr;
    }


    /**
     * 按位或表达式
     * bitwise_or → bitwise_xor ( "|" bitwise_xor )*
     * 按位或表达式由按位异或表达式组成，按位异或表达式之间用 "|" 连接
     * 例如：
     * 1 | 2
     * 1 | 2 | 3
     */
    private bitwise_or(): Expr {
        let expr = this.bitwise_xor();
        while (this.match(TokenType.BitOr)) {
            const operator = this.previous();
            const right = this.bitwise_xor();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    /**
     * 按位异或表达式
     * bitwise_xor → bitwise_and ( "^" bitwise_and )*
     * 按位异或表达式由按位与表达式组成，按位与表达式之间用 "^" 连接
     * 例如：
     * 1 ^ 2
     * 1 ^ 2 ^ 3
     */
    private bitwise_xor(): Expr {
        let expr = this.bitwise_and();
        while (this.match(TokenType.Caret)) {
            const operator = this.previous();
            const right = this.bitwise_and();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    /**
     * 按位与表达式
     * bitwise_and → equality ( "&" equality )*
     * 按位与表达式由相等性表达式组成，相等性表达式之间用 "&" 连接
     * 例如：
     * 1 & 2
     * 1 & 2 & 3
     */
    private bitwise_and(): Expr {
        let expr = this.equality();
        while (this.match(TokenType.BitAnd)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new BinaryExpr(expr, operator, right);
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
     * comparison → shift ( ( ">" | ">=" | "<" | "<=" ) shift )*
     * 比较表达式由移位表达式组成，移位表达式之间用 ">"、">="、"<"、"<=" 连接
     * 例如：
     * 1 > 2
     * 1 >= 2
     * 1 < 2
     * 1 <= 2
     */
    private comparison(): Expr {
        let expr = this.shift();
        while (this.match(TokenType.Greater, TokenType.GreaterEqual, TokenType.Less, TokenType.LessEqual)) {
            const operator = this.previous();
            const right = this.shift();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }


    /**
     * 移位表达式
     * shift → term ( ( ">>" | "<<" ) term )*
     * 移位表达式由项表达式组成，项表达式之间用 ">>"、"<<" 连接
     * 例如：
     * 1 >> 2
     * 1 << 2
     */
    private shift(): Expr {
        let expr = this.term();
        while (this.match(TokenType.GreaterGreater, TokenType.LessLess)) {
            const operator = this.previous();
            const right = this.term();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    /**
     * 项表达式
     * term → factor (( "-" | "+") factor)*
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
     * factor → unary ( ( "/" | "*" | "%" ) unary )*
     * 因子表达式由一元表达式组成，一元表达式之间用 "/"、"*"、"%" 连接
     * 例如：
     * 1 / 2
     * 1 * 2
     * 10 % 3
     */
    private factor(): Expr {
        let expr = this.unary();
        while (this.match(TokenType.Slash, TokenType.Star, TokenType.Percent)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }
    /**
     * 一元表达式
     * unary → ( "!" | "-" | "~" | "++" | "--" ) unary | postfix
     * 一元表达式由一元操作符和一元表达式组成
     * 例如：
     * !true
     * -1
     * ++i
     * --i
     */
    private unary(): Expr {
        while (this.match(TokenType.Bang, TokenType.Minus, TokenType.Tilde, TokenType.PlusPlus, TokenType.MinusMinus)) {
            const operator = this.previous();
            const right = this.unary();
            return new UnaryExpr(operator, right);
        }
        return this.postfix();
    }

    /**
     * 后缀表达式
     * postfix → call ( "++" | "--" )?
     * 后缀表达式由函数调用和可选的后缀操作符组成
     * 例如：
     * i++
     * i--
     * f()
     * f()()
     */
    private postfix(): Expr {
        let expr = this.call();
        if (this.match(TokenType.PlusPlus, TokenType.MinusMinus)) {
            const operator = this.previous();
            if (!(expr instanceof VariableExpr)) {
                this.parseError(operator, "Postfix increment/decrement can only be applied to variables.");
            }
            expr = new PostfixExpr(expr, operator);
        }
        return expr;
    }

    /**
     * 函数调用表达式
     * call → primary ( "(" arguments? ")" )*
     * 函数调用由主要表达式和可选的参数列表组成，支持链式调用
     * 例如：
     * f()
     * f(1, 2, 3)
     * f()()
     */
    private call(): Expr {
        let expr = this.primary();
        while (true) {
            if (this.match(TokenType.LeftParen)) {
                expr = this.functionCall(expr);
            } else {
                break;
            }
        }
        return expr;
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
        if (this.match(TokenType.Null)) {
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


    private functionCall(callee: Expr): Expr {
        const args: Expr[] = [];
        if (!this.check(TokenType.RightParen)) {
            do {
                if (args.length >= 255) {
                    this.parseError(this.peek(), "Can't have more than 255 arguments.");
                }
                args.push(this.assignment());
            } while (this.match(TokenType.Comma));
        }
        const paren = this.consume(TokenType.RightParen, "Expect ')' after arguments.");
        return new CallExpr(callee, paren, args);
    }

    /**
     * 辅助方法
     */

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

    /**
     * 创建解析错误
     * 报告解析错误并返回 ParseError 异常
     * @param token 出错的 token
     * @param message 错误消息
     * @returns ParseError 异常
     */
    private parseError(token: Token, message: string): ParseError {
        this.error(token, message);
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
                case TokenType.Return:
                    return
            }
            this.advance();
        }
    }
}