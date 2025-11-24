import { Expr } from "@/ast/Expr";
import { Token } from "@/ast/Token";



export abstract class Stmt {
    abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
    visitBlockStmt(stmt: BlockStmt): R;
    visitPrintStmt(stmt: PrintStmt): R;
    visitVarStmt(stmt: VarStmt): R;
    visitExpressionStmt(stmt: ExpressionStmt): R;
}

export class BlockStmt extends Stmt {
    statements: Stmt[];
    constructor(statements: Stmt[]) {
        super();
        this.statements = statements;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBlockStmt(this);
    }
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

export class VarStmt extends Stmt {
    name: Token;
    initializer: Expr | null;
    constructor(name: Token, initializer: Expr | null) {
        super();
        this.name = name;
        this.initializer = initializer;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitVarStmt(this);
    }
}