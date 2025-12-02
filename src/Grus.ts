import { Token } from "@/ast/Token";
import { Parser } from "./parser/Parser";
import { Scanner } from "./parser/Scanner";
import RuntimeError from "./execute/RuntimeError";
import { Interpreter } from "./execute/Interperter";
import { Resolver } from "./execute/Resolver";



export class Grus {
    constructor(private readonly source: string, readonly reportError: (line: number, column: number, message: string) => void) {
        this.source = source;
        this.reportError = reportError;
    }

    run() {
        const scanner = new Scanner(this.source, this.scnnerErrorHandler.bind(this));
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, this.parserErrorHandler.bind(this));
        const statements = parser.parse();
        if (!statements) {
            throw new Error('解析失败');
        }
        const interpreter = new Interpreter(this.interpreterErrorHandler.bind(this));
        const resolver = new Resolver(interpreter, this.resolverErrorHandler.bind(this));
        resolver.resolveAll(statements);
        interpreter.interpret(statements);
    }

    scnnerErrorHandler(line: number, column: number, message: string) {
        this.reportError(line, column, message);
        console.error(`scanner error [line ${line}, column ${column}] ${message}`);
    }
    parserErrorHandler(token: Token, message: string) {
        this.reportError(token.line, token.column, message);
        console.error(`parser error [${token.line}:${token.column}] ${message}`);
    }
    resolverErrorHandler(token: Token, message: string) {
        this.reportError(token.line, token.column, message);
        console.error(`resolver error [${token.line}:${token.column}] ${message}`);
    }
    interpreterErrorHandler(error: RuntimeError) {
        this.reportError(error.token.line, error.token.column, error.message);
        console.error(`interpreter error [${error.token.line}:${error.token.column}] ${error.message}`);
    }
}