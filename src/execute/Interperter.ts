import { AssignExpr, BinaryExpr, ConditionalExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalExpr, PostfixExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";
import LoxValue from "@/ast/LoxValue";
import { BlockStmt, BreakStmt, ContinueStmt, ExpressionStmt, ForStmt, IfStmt, PrintStmt, Stmt, StmtVisitor, VarStmt, WhileStmt } from "@/ast/Stmt";
import { TokenType } from "@/ast/TokenType";
import RuntimeError from "@/execute/RuntimeError";
import Environment from "./Environment";



/**
 * 解释器
 * 实现ExprVisitor接口，用于访问表达式
 * 执行表达式，返回LoxValue
 */
export class Interperter implements ExprVisitor<LoxValue>, StmtVisitor<void> {

    private environment: Environment = new Environment();
    private isBreaking: boolean = false;
    private isContinuing: boolean = false;

    constructor(private readonly runtimeErrorHandler: (error: RuntimeError) => void) {
        this.runtimeErrorHandler = runtimeErrorHandler;
    }

    public interpret(statements: Stmt[]) {
        try {
            for (const statement of statements) {
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

    private executeBlock(statements: Stmt[], environment: Environment): void {
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
    visitPrintStmt(stmt: PrintStmt): void {
        const value: LoxValue = this.evaluate(stmt.expression);
        const v = this.stringify(value);
        console.log(v);
    }

    visitVarStmt(stmt: VarStmt): void {
        const value: LoxValue = stmt.initializer ? this.evaluate(stmt.initializer) : null;
        this.environment.define(stmt.name, value);
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
    private evaluate(expr: Expr): LoxValue {
        return expr.accept(this);
    }

    visitAssignExpr(expr: AssignExpr): LoxValue {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name, value);
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
        return this.environment.get(expr.name);
    }

    private isTruthy(value: LoxValue): boolean {
        return value !== null && value !== false;
    }

    private isEqual(value1: LoxValue, value2: LoxValue): boolean {
        return value1 === value2;
    }


    private stringify(value: LoxValue): string {
        if (value === null) return "nil";
        return String(value)
    }

}


