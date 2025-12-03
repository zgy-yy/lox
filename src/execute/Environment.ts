import LoxValue from "@/ast/LoxValue";
import RuntimeError from "./RuntimeError";
import { Token } from "@/ast/Token";

export default class Environment {
    private readonly values: Map<string, LoxValue> = new Map();
    private readonly enclosing: Environment | null = null;
    constructor(enclosing: Environment | null = null) {
        this.enclosing = enclosing;
    }
    get(name: Token): LoxValue {
        const value = this.values.get(name.lexeme);
        if (value === undefined) {
            if (this.enclosing !== null) {
                return this.enclosing.get(name);
            }
            throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.", name.line, name.column);
        }
        return value;
    }
    define(name: Token, value: LoxValue): void {
        this.values.set(name.lexeme, value);
    }
    assign(name: Token, value: LoxValue): void {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
        }
        else if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
        }
        else {
            throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.", name.line, name.column);
        }
    }

    ancestor(distance: number): Environment {
        let environment: Environment = this;
        for (let i = 0; i < distance && environment.enclosing; i++) {
            environment = environment.enclosing;
        }
        return environment;
    }

    assignAt(distance: number, name: Token, value: LoxValue): void {
        this.ancestor(distance).values.set(name.lexeme, value);
    }
    getAt(distance: number, name: string): LoxValue {
        return this.ancestor(distance).values.get(name) ?? null;
    }
}
