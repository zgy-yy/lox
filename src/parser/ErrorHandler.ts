import { Token } from "@/ast/Token";
import RuntimeError from "@/execute/RuntimeError";



export type ScannerErrorHandler = (line: number, column: number, message: string) => void;
export type ParserErrorHandler = (token: Token, message: string) => void;
export type InterpreterErrorHandler = (error: RuntimeError) => void;
