import { Interpreter } from "@/execute/Interperter";
import { FunctionStmt } from "./Stmt";
import Environment from "@/execute/Environment";

type LoxValue = number | string | boolean | null | LoxCallable;

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

export function isLoxCallable(value: any): value is LoxCallable {
    return value instanceof NativeFunction || value instanceof LoxFunction;
}

export function isLoxNativeFunction(value: any): value is NativeFunction {
    return value instanceof NativeFunction;
}

export function isLoxFunction(value: any): value is LoxFunction {
    return value instanceof LoxFunction;
}

export class Return {
    value: LoxValue;
    constructor(value: LoxValue) {
        this.value = value;
    }
}