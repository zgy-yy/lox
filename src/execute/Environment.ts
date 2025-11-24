import LoxValue from "@/ast/LoxValue";
import RuntimeError from "./RuntimeError";
import { Token } from "@/ast/Token";



export default class Environment {
    private readonly values: Map<string, LoxValue> = new Map();
    constructor() {
        this.values = new Map();
    }
    get(name: Token): LoxValue {
        const value = this.values.get(name.lexeme);
        if (value === undefined) {
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
        } else {
            throw new RuntimeError(name, "Undefined variable '" + name.lexeme + "'.", name.line, name.column);
        }
    }
}