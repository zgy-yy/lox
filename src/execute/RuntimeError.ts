import { Token } from "@/ast/Token";

export default class RuntimeError extends Error {
    constructor(readonly token: Token, message: string , line: number, column: number) {
        super(`at line ${line}, column ${column}: ${message}`);
        this.token = token;
    }
}
