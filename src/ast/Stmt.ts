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
    visitIfStmt(stmt: IfStmt): R;
    visitWhileStmt(stmt: WhileStmt): R;
    visitForStmt(stmt: ForStmt): R;
    visitBreakStmt(stmt: BreakStmt): R;
    visitContinueStmt(stmt: ContinueStmt): R;
}



export class WhileStmt extends Stmt {
    condition: Expr;
    body: Stmt;
    constructor(condition: Expr, body: Stmt) {
        super();
        this.condition = condition;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileStmt(this);
    }
}

export class ForStmt extends Stmt {
    initializer: Stmt;
    condition: Expr ;
    increment: Expr ;
    body: Stmt;

    constructor(initializer: Stmt, condition: Expr, increment: Expr, body: Stmt) {
        super();
        this.initializer = initializer;
        this.condition = condition;
        this.increment = increment;
        this.body = body;
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}
export class BreakStmt extends Stmt {
    constructor() {
        super();
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBreakStmt(this);
    }
}
export class IfStmt extends Stmt {
    condition: Expr;
    thenBranch: Stmt;
    elseBranch: Stmt | null;
    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
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

export class ContinueStmt extends Stmt {
    constructor() {
        super();
    }
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitContinueStmt(this);
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