import { Token } from "@/ast/Token";


export abstract class Type {
    abstract accept<R>(visitor: TypesVisitor<R>): R;
}

export interface TypesVisitor<R> {
    visitGenericType(expr: Type): R;
}

export class GenericType extends Type {
    name: Token;
    constructor(name: Token) {
        super();
        this.name = name;
    }
    accept<R>(visitor: TypesVisitor<R>): R {
        return visitor.visitGenericType(this);
    }
}