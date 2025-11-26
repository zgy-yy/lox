import { Interpreter } from "@/execute/Interperter";

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
}


export function isLoxCallable(value: any): value is LoxCallable {
    return value instanceof NativeFunction;
}
