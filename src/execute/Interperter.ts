import { AssignExpr, BinaryExpr, CallExpr, ConditionalExpr, Expr, ExprVisitor, GetExpr, GroupingExpr, LiteralExpr, LogicalExpr, PostfixExpr, SetExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";
import LoxValue, { isLoxCallable, isLoxFunction, LoxClass, LoxFunction, LoxInstance, NativeFunction, Return } from "@/ast/LoxValue";
import { BlockStmt, BreakStmt, ClassStmt, ContinueStmt, ExpressionStmt, ForStmt, FunctionStmt, IfStmt, ReturnStmt, Stmt, StmtVisitor, VarStmt, WhileStmt } from "@/ast/Stmt";
import { TokenType } from "@/ast/TokenType";
import RuntimeError from "@/execute/RuntimeError";
import Environment from "./Environment";
import { Token } from "@/ast/Token";



/**
 * 解释器
 * 实现ExprVisitor接口，用于访问表达式
 * 执行表达式，返回LoxValue
 */
export class Interpreter implements ExprVisitor<LoxValue>, StmtVisitor<void> {
    readonly globals: Environment = new Environment();
    private environment: Environment = this.globals;
    private isBreaking: boolean = false;
    private isContinuing: boolean = false;

    private readonly locals: Map<Expr, number> = new Map();

    constructor(private readonly runtimeErrorHandler: (error: RuntimeError) => void) {
        this.runtimeErrorHandler = runtimeErrorHandler;
        this.globals.define(new Token(TokenType.Identifier, "clock", null, 0, 0), new NativeFunction((): LoxValue => {
            return Date.now();
        }));
        this.globals.define(new Token(TokenType.Identifier, "print", null, 0, 0), new NativeFunction((...args: LoxValue[]): LoxValue => {
            console.log(...args.map(arg => this.stringify(arg)));
            return null;
        }));
    }

    public resolve(expr: Expr, distance: number): void {
        this.locals.set(expr, distance);
    }

    public interpret(statements: Stmt[]) {
        try {
            const main = new ExpressionStmt(new CallExpr(new VariableExpr(new Token(TokenType.Identifier, "main", null, 0, 0)), new Token(TokenType.Identifier, "main", null, 0, 0), []));
            const program = [...statements, main];
            for (const statement of program) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                this.runtimeErrorHandler(error);
            } else {
                throw error;
            }
        }
    }

    //执行语句
    private execute(stmt: Stmt): void {
        if (this.isBreaking || this.isContinuing) {
            return;
        }
        stmt.accept(this);
    }

    executeBlock(statements: Stmt[], environment: Environment): void {
        const previous = this.environment;
        try {
            this.environment = environment;
            for (const statement of statements) {
                this.execute(statement);
            }
        }
        finally {
            this.environment = previous;
        }
    }
    visitBlockStmt(stmt: BlockStmt): void {
        this.executeBlock(stmt.statements, new Environment(this.environment));
    }

    visitExpressionStmt(stmt: ExpressionStmt): void {
        this.evaluate(stmt.expression);
    }

    visitVarStmt(stmt: VarStmt): void {
        const value: LoxValue = stmt.initializer ? this.evaluate(stmt.initializer) : null;
        this.environment.define(stmt.name, value);
    }

    visitFunctionStmt(stmt: FunctionStmt): void {
        this.environment.define(stmt.name, new LoxFunction(stmt, this.environment));
    }

    visitReturnStmt(stmt: ReturnStmt): void {
        const value: LoxValue = stmt.value ? this.evaluate(stmt.value) : null;
        throw new Return(value);
    }

    visitClassStmt(stmt: ClassStmt): void {
        this.environment.define(stmt.name, null);
        const fields = new Map<string, Expr | null>();
        for (const field of stmt.fields) {
            fields.set(field.name.lexeme, field.initializer);
        }
        const loxClass = new LoxClass(stmt.name.lexeme, fields);
        this.environment.assign(stmt.name, loxClass);
    }

    visitIfStmt(stmt: IfStmt): void {
        const condition: LoxValue = this.evaluate(stmt.condition);
        if (this.isTruthy(condition)) {
            this.execute(stmt.thenBranch);
        } else if (stmt.elseBranch !== null) {
            this.execute(stmt.elseBranch);
        }
    }

    visitWhileStmt(stmt: WhileStmt): void {
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
            if (this.isBreaking) {
                this.isBreaking = false;
                break;
            }
            if (this.isContinuing) {
                this.isContinuing = false;
            }
        }
    }

    visitForStmt(stmt: ForStmt): void {
        this.execute(stmt.initializer);
        while (this.isTruthy(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
            if (this.isBreaking) {
                this.isBreaking = false;
                break;
            }
            if (this.isContinuing) {
                this.isContinuing = false;
            }
            this.evaluate(stmt.increment);

        }
    }


    visitBreakStmt(stmt: BreakStmt): void {
        this.isBreaking = true;
    }
    visitContinueStmt(stmt: ContinueStmt): void {
        this.isContinuing = true;
    }


    //计算表达式
    evaluate(expr: Expr): LoxValue {
        return expr.accept(this);
    }

    visitAssignExpr(expr: AssignExpr): LoxValue {
        const value = this.evaluate(expr.value);
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            this.environment.assignAt(distance, expr.name, value);
        } else {
            this.environment.assign(expr.name, value);
        }
        return value;
    }

    visitConditionalExpr(expr: ConditionalExpr): LoxValue {
        const condition = this.evaluate(expr.condition);
        if (this.isTruthy(condition)) {
            return this.evaluate(expr.trueExpr);
        }
        return this.evaluate(expr.falseExpr);
    }

    visitLogicalExpr(expr: LogicalExpr): LoxValue {
        const left = this.evaluate(expr.left);
        switch (expr.operator.type) {
            case TokenType.Or:
                if (this.isTruthy(left)) {
                    return left;
                }
                break;
            case TokenType.And:
                if (!this.isTruthy(left)) {
                    return left;
                }
                break;
            default:
                break;
        }
        return this.evaluate(expr.right);
    }

    //二元表达式
    visitBinaryExpr(expr: BinaryExpr): LoxValue {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        if (typeof left === 'string' && typeof right === 'string') {
            switch (expr.operator.type) {
                case TokenType.Plus:
                    return left + right;
                default:
                    break;
            }
        }
        if (typeof left === 'number' && typeof right === 'number') {
            switch (expr.operator.type) {
                case TokenType.Plus:
                    return left + right;
                case TokenType.Minus:
                    return left - right;
                case TokenType.Star:
                    return left * right;
                case TokenType.Slash:
                    return left / right;
                case TokenType.Greater:
                    return left > right;
                case TokenType.Percent:
                    return left % right;
                case TokenType.GreaterEqual:
                    return left >= right;
                case TokenType.Less:
                    return left < right;
                case TokenType.LessEqual:
                    return left <= right;
                case TokenType.BitAnd:
                    return left & right;
                case TokenType.BitOr:
                    return left | right;
                case TokenType.Caret:
                    return left ^ right;
                case TokenType.GreaterGreater:
                    return left >> right;
                case TokenType.LessLess:
                    return left << right;

                default:
                    break;
            }
        }

        switch (expr.operator.type) {
            case TokenType.EqualEqual:
                return this.isEqual(left, right);
            case TokenType.BangEqual:
                return !this.isEqual(left, right);
            case TokenType.Comma:
                return right;
            default:
                break;
        }

        // 未知的运算符，抛出错误
        throw new RuntimeError(expr.operator, `Binary operator '${expr.operator.lexeme}' cannot be applied to ${typeof left} and ${typeof right}`, expr.operator.line, expr.operator.column);
    }


    visitUnaryExpr(expr: UnaryExpr): LoxValue {
        const right = this.evaluate(expr.right);
        if (typeof right === 'number') {
            switch (expr.operator.type) {
                case TokenType.Minus:
                    return -right;
                case TokenType.Tilde:
                    return ~right;
                case TokenType.PlusPlus:
                    if (expr.right instanceof VariableExpr) {
                        this.environment.assign(expr.right.name, right + 1);
                        return right + 1;
                    }
                    break;
                case TokenType.MinusMinus:
                    if (expr.right instanceof VariableExpr) {
                        this.environment.assign(expr.right.name, right - 1);
                        return right - 1;
                    }
                    break;
                default:
                    break;
            }
        }
        switch (expr.operator.type) {
            case TokenType.Bang:
                return !right;
            case TokenType.New:
                return right;
            default:
                break;
        }
        // 未知的运算符，抛出错误
        throw new RuntimeError(expr.operator, `Unary operator '${expr.operator.lexeme}' cannot be applied to ${typeof right}`, expr.operator.line, expr.operator.column);
    }



    visitPostfixExpr(expr: PostfixExpr): LoxValue {
        const value = this.evaluate(expr.left);
        if (typeof value === 'number') {
            switch (expr.operator.type) {
                case TokenType.PlusPlus:
                    if (expr.left instanceof VariableExpr) {
                        this.environment.assign(expr.left.name, value + 1);
                        return value;
                    }
                    break;

                case TokenType.MinusMinus:
                    if (expr.left instanceof VariableExpr) {
                        this.environment.assign(expr.left.name, value - 1);
                        return value;
                    }
                    break;
                default:
                    break;
            }
        }
        throw new RuntimeError(expr.operator, `Postfix operator '${expr.operator.lexeme}' cannot be applied to ${typeof value}`, expr.operator.line, expr.operator.column);
    }
    visitLiteralExpr(expr: LiteralExpr): LoxValue {
        return expr.value
    }
    visitGroupingExpr(expr: GroupingExpr): LoxValue {
        return this.evaluate(expr.expression);
    }

    visitVariableExpr(expr: VariableExpr): LoxValue {
        return this.lookupVariable(expr.name, expr);
    }

    private lookupVariable(name: Token, expr: Expr): LoxValue {
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            return this.environment.getAt(distance, name.lexeme);
        }
        return this.globals.get(name);
    }



    visitCallExpr(expr: CallExpr): LoxValue {
        const callee = this.evaluate(expr.callee);
        const args = expr.arguments.map(arg => this.evaluate(arg));
        if (!isLoxCallable(callee)) {
            throw new RuntimeError(expr.paren, `Can only call functions and classes.`, expr.paren.line, expr.paren.column);
        }
        if (isLoxFunction(callee)) {
            if (args.length !== callee.arity()) {
                throw new RuntimeError(expr.paren, `Expected ${callee.arity()} arguments but got ${args.length}.`, expr.paren.line, expr.paren.column);
            }
        }
        return callee.call(this, args);
    }

    visitGetExpr(expr: GetExpr): LoxValue {
        const object = this.evaluate(expr.object);
        if ((object instanceof LoxInstance)) {
            return object.get(expr.name);
        }
        throw new RuntimeError(expr.name, `Can only get properties from objects.`, expr.name.line, expr.name.column);
    }
    visitSetExpr(expr: SetExpr): LoxValue {
        const object = this.evaluate(expr.object);
        if (!(object instanceof LoxInstance)) {
            throw new RuntimeError(expr.name, `Can only set properties on objects.`, expr.name.line, expr.name.column);
        }
        const value = this.evaluate(expr.value);
        object.set(expr.name.lexeme, value);
        return value;
    }


    private isTruthy(value: LoxValue): boolean {
        return value !== null && value !== false;
    }

    private isEqual(value1: LoxValue, value2: LoxValue): boolean {
        return value1 === value2;
    }


    private stringify(value: LoxValue): string {
        return value !== null ? value.toString() : "null";
    }

}


