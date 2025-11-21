import { BinaryExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, UnaryExpr } from "@/ast/Expr";
import LoxValue from "@/ast/LoxValue";
import { TokenType } from "@/ast/TokenType";
import RuntimeError from "@/execute/RuntimeError";



/**
 * 解释器
 * 实现ExprVisitor接口，用于访问表达式
 * 执行表达式，返回LoxValue
 */
export class Interperter implements ExprVisitor<LoxValue> {

    constructor(private readonly runtimeErrorHandler: (error: RuntimeError) => void) {
        this.runtimeErrorHandler = runtimeErrorHandler;
    }

    public interpret(expr: Expr) {
        try {
            const value = this.execute(expr);
            console.log(value);
        } catch (error) {
            if (error instanceof RuntimeError) {
                this.runtimeErrorHandler(error);
            } else {
                throw error;
            }
        }
    }

    private execute(expr: Expr): LoxValue {
        return expr.accept(this);
    }
    visitBinaryExpr(expr: BinaryExpr): LoxValue {
        const left = this.execute(expr.left);
        const right = this.execute(expr.right);
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
                case TokenType.GreaterEqual:
                    return left >= right;
                case TokenType.Less:
                    return left < right;
                case TokenType.LessEqual:
                    return left <= right;
                default:
                    break;
            }
        }

        switch (expr.operator.type) {
            case TokenType.EqualEqual:
                return this.isEqual(left, right);
            case TokenType.BangEqual:
                return !this.isEqual(left, right);
            default:
                break;
        }

        // 未知的运算符，抛出错误
        throw new RuntimeError(expr.operator, `Binary operator '${expr.operator.lexeme}' cannot be applied to ${typeof left} and ${typeof right}`, expr.operator.line, expr.operator.column);
    }


    visitUnaryExpr(expr: UnaryExpr): LoxValue {
        const right = this.execute(expr.right);
        switch (expr.operator.type) {
            case TokenType.Bang:
                return !this.isTruthy(right);
            case TokenType.Minus:
                if (typeof right === 'number') {
                    return -right;
                }
                break;
            default:
                break;
        }
        // 未知的运算符，抛出错误
        throw new RuntimeError(expr.operator, `Unary operator '${expr.operator.lexeme}' cannot be applied to ${typeof right}`, expr.operator.line, expr.operator.column);
    }
    visitLiteralExpr(expr: LiteralExpr): LoxValue {
        return expr.value
    }
    visitGroupingExpr(expr: GroupingExpr): LoxValue {
        return this.execute(expr.expression);
    }

    private isTruthy(value: LoxValue): boolean {
        return value !== null && value !== false;
    }

    private isEqual(value1: LoxValue, value2: LoxValue): boolean {
        return value1 === value2;
    }

}


