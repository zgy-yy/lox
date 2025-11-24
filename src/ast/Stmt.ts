import { Expr } from "@/ast/Expr";



export abstract class Stmt {
    abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
    visitExpressionStmt(stmt: ExpressionStmt): R;
    visitPrintStmt(stmt: PrintStmt): R;
}


export class ExpressionStmt extends Stmt {
    expression: Expr;
    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }
}

export class PrintStmt extends Stmt {
    expression: Expr;
    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitPrintStmt(this);
    }
}
