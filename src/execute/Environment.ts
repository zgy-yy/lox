import LoxValue from "@/ast/LoxValue";
import RuntimeError from "./RuntimeError";
import { Token } from "@/ast/Token";

/**
 * todo 语句支持标签，goto语句
 */

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
}