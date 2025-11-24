import LoxValue from "./LoxValue";
import { Token } from "./Token";


export abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
}

export interface ExprVisitor<R> {
    visitAssignExpr(expr: AssignExpr): R;
    visitLogicalExpr(expr: LogicalExpr): R;
    visitBinaryExpr(expr: BinaryExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitLiteralExpr(expr: LiteralExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
}



/**
 * 赋值表达式
 */
export class AssignExpr extends Expr {
    name: Token;
    value: Expr;
    constructor(name: Token, value: Expr) {
        super();
        this.name = name;
        this.value = value;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }
}

/**
 * 逻辑或表达式
 */
export class LogicalExpr extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLogicalExpr(this);
    }
}


/**
 * 二元表达式
 */
export class BinaryExpr extends Expr {
    left: Expr;
    operator: Token;
    right: Expr;
    constructor(left: Expr, operator: Token, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }
}


/**
 * 一元表达式
 */
export class UnaryExpr extends Expr {
    operator: Token;
    right: Expr;
    constructor(operator: Token, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }
}
/**
 * 字面量表达式
 */
export class LiteralExpr extends Expr {
    value: LoxValue;
    constructor(value: LoxValue) {
        super();
        this.value = value;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitLiteralExpr(this);
    }
}

/**
 * 分组表达式
 */
export class GroupingExpr extends Expr {
    expression: Expr;
    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }
}


export class VariableExpr extends Expr {
    name: Token;
    constructor(name: Token) {
        super();
        this.name = name;
    }
    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }
}