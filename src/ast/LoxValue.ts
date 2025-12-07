import { Interpreter } from "@/execute/Interperter";
import { FunctionStmt } from "./Stmt";
import Environment from "@/execute/Environment";
import { Token } from "@/ast/Token";
import RuntimeError from "@/execute/RuntimeError";
import { Expr } from "./Expr";
import { TokenType } from "./TokenType";

type LoxValue = number | string | boolean | null | LoxCallable | LoxInstance;

export default LoxValue;

/**
 * 可调用类型
 */
export interface LoxCallable {
    arity(): number;
    call(interpreter: Interpreter, args: LoxValue[]): LoxValue;
}


// 将JavaScript/TypeScript函数包装成Lox可调用对象
export class NativeFunction implements LoxCallable {
    private readonly jsFunction: (...args: LoxValue[]) => LoxValue;
    constructor(
        jsFunction: (...args: LoxValue[]) => LoxValue,
    ) {
        this.jsFunction = jsFunction;
    }

    arity(): number {
        return this.jsFunction.length;
    }

    call(interpreter: Interpreter, args: LoxValue[]): LoxValue {
        return this.jsFunction(...args);
    }
    toString(): string {
        return `NativeFunction(${this.jsFunction.toString()})`;
    }
}


export class LoxFunction implements LoxCallable {
    private readonly fun_decl: FunctionStmt;
    private readonly closure: Environment; // 闭包 词法作用域
    constructor(fun_decl: FunctionStmt, closure: Environment) {
        this.fun_decl = fun_decl;
        this.closure = closure;
    }
    arity(): number {
        return this.fun_decl.parameters.length;
    }

    bind(instance: LoxInstance): LoxFunction {
        const environment = new Environment(this.closure);
        environment.define(new Token(TokenType.This, "this", null, 0, 0), instance);
        return new LoxFunction(this.fun_decl, environment);
    }

    call(interpreter: Interpreter, args: LoxValue[]): LoxValue {
        /**
         * 创建一个新的环境，并将参数绑定到环境中
         */
        const environment = new Environment(this.closure);
        for (let i = 0; i < this.fun_decl.parameters.length; i++) {
            environment.define(this.fun_decl.parameters[i], args[i]);
        }
        try {
            interpreter.executeBlock(this.fun_decl.body, environment);
        } catch (exception) {
            if (exception instanceof Return) {
                return exception.value;
            }
            throw exception;
        }
        return null;
    }
    toString(): string {
        return `<fn ${this.fun_decl.name.lexeme}>`;
    }
}



export class LoxClass implements LoxCallable {
    readonly fieldsDefine: Map<string, Expr | null>
    readonly name: string;
    readonly methods: Map<string, LoxFunction>;
    constructor(name: string, fields: Map<string, Expr | null>, methods: Map<string, LoxFunction>) {
        this.name = name;
        this.fieldsDefine = fields;
        this.methods = methods;
    }

    arity(): number {
        return 0;
    }
    call(interpreter: Interpreter, args: LoxValue[]): LoxValue {
        const fields = new Map<string, LoxValue>();
        //在创建实例时，初始化字段
        for (const [key, value] of this.fieldsDefine.entries()) {
            fields.set(key, value ? interpreter.evaluate(value) : null);
        }
        const instance = new LoxInstance(this, fields);
        const ins = this.findMethod("init")?.bind(instance)?.call(interpreter, args);
        if (ins !== undefined && ins !== null) {
            return ins;
        }
        return instance;
    }
    findMethod(name: string): LoxFunction | undefined {
        return this.methods.get(name);
    }

    toString(): string {
        return `<${this.name} class ${Array.from(this.fieldsDefine.keys()).join(', ')}>`;
    }
}


export class LoxInstance {
    readonly fields: Map<string, LoxValue>
    constructor(private loxClass: LoxClass, fields: Map<string, LoxValue>) {
        this.loxClass = loxClass;
        this.fields = fields;
    }
    hasField(name: string): boolean {
        return this.fields.has(name);
    }
    get(name: Token): LoxValue {
        const value = this.fields.get(name.lexeme);
        if (value !== undefined) {
            return value;
        }
        const method = this.loxClass.findMethod(name.lexeme);
        if (method !== undefined) {
            return method.bind(this);
        }
        throw new RuntimeError(name, `Undefined property '${name.lexeme}'.`, name.line, name.column);
    }

    set(name: string, value: LoxValue): void {
        this.fields.set(name, value);
    }
    toString(): string {
        return `${this.loxClass.name} instance ${Array.from(this.fields.entries()).map(([key, value]) => `${key}: ${value}`).join(', ')}`;
    }
}

export function isLoxCallable(value: any): value is LoxCallable {
    return value instanceof NativeFunction || value instanceof LoxFunction || value instanceof LoxClass;
}

export function isLoxNativeFunction(value: any): value is NativeFunction {
    return value instanceof NativeFunction;
}

export function isLoxFunction(value: any): value is LoxFunction {
    return value instanceof LoxFunction;
}

export function isLoxClass(value: any): value is LoxClass {
    return value instanceof LoxClass;
}

export class Return {
    value: LoxValue;
    constructor(value: LoxValue) {
        this.value = value;
    }
}