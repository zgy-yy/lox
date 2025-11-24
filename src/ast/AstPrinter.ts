import { AssignExpr, BinaryExpr, Expr, ExprVisitor, GroupingExpr, LiteralExpr, LogicalExpr, UnaryExpr, VariableExpr } from "@/ast/Expr";



export class AstPrinter implements ExprVisitor<string> {
    
    print(expr: Expr): string {
        return expr.accept(this);
    }
    visitAssignExpr(expr: AssignExpr): string {
        return this.parenthesize("=", expr.name.lexeme, expr.value);
    }
    visitLogicalExpr(expr: LogicalExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitBinaryExpr(expr: BinaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.left, expr.right);
    }

    visitUnaryExpr(expr: UnaryExpr): string {
        return this.parenthesize(expr.operator.lexeme, expr.right);
    }

    visitLiteralExpr(expr: LiteralExpr): string {
        if (expr.value === null) return "nil";
        return expr.value.toString();
    }

    visitGroupingExpr(expr: GroupingExpr): string {
        return this.parenthesize("group", expr.expression);
    }

    visitVariableExpr(expr: VariableExpr): string {
        return expr.name.lexeme;
    }

    private parenthesize(name: string, ...exprs: (Expr|string)[]): string {
        const argsString = exprs.map(
            arg => arg instanceof Expr ? arg.accept(this) : arg
        );
        return `(${name} ${argsString.join(' ')})`;
    }
}