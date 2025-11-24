import { describe, it, expect, vi } from 'vitest';
import { Scanner } from '@/parser/Scanner';
import { Parser } from '@/parser/Parser';
import { PrintStmt, ExpressionStmt } from '@/ast/Stmt';
import { LiteralExpr, BinaryExpr } from '@/ast/Expr';
import { TokenType } from '@/ast/TokenType';

describe('Statement Parsing', () => {
    // 辅助函数：解析源代码并返回语句列表
    const parseSource = (source: string) => {
        const errorHandler = vi.fn();
        const scanner = new Scanner(source, errorHandler);
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, errorHandler);
        return {
            statements: parser.parse(),
            errorHandler
        };
    };

    it('should parse print statement', () => {
        const source = 'print "hello";';
        const { statements, errorHandler } = parseSource(source);

        expect(errorHandler).not.toHaveBeenCalled();
        expect(statements).toHaveLength(1);
        
        const stmt = statements![0];
        expect(stmt).toBeInstanceOf(PrintStmt);
        
        if (stmt instanceof PrintStmt) {
            expect(stmt.expression).toBeInstanceOf(LiteralExpr);
            expect((stmt.expression as LiteralExpr).value).toBe("hello");
        }
    });

    it('should parse expression statement', () => {
        const source = '1 + 2;';
        const { statements, errorHandler } = parseSource(source);

        expect(errorHandler).not.toHaveBeenCalled();
        expect(statements).toHaveLength(1);

        const stmt = statements![0];
        expect(stmt).toBeInstanceOf(ExpressionStmt);

        if (stmt instanceof ExpressionStmt) {
            expect(stmt.expression).toBeInstanceOf(BinaryExpr);
            const binaryExpr = stmt.expression as BinaryExpr;
            expect((binaryExpr.left as LiteralExpr).value).toBe(1);
            expect(binaryExpr.operator.type).toBe(TokenType.Plus);
            expect((binaryExpr.right as LiteralExpr).value).toBe(2);
        }
    });

    it('should parse multiple statements', () => {
        const source = `
            print "one";
            print true;
            2 + 2;
        `;
        const { statements, errorHandler } = parseSource(source);

        expect(errorHandler).not.toHaveBeenCalled();
        expect(statements).toHaveLength(3);

        expect(statements![0]).toBeInstanceOf(PrintStmt);
        expect(statements![1]).toBeInstanceOf(PrintStmt);
        expect(statements![2]).toBeInstanceOf(ExpressionStmt);
    });

    it('should throw error on missing semicolon in print statement', () => {
        const errorHandler = vi.fn();
        const scanner = new Scanner('print "test"', errorHandler);
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, errorHandler);

        // 当前 Parser 实现会在遇到错误时抛出异常
        expect(() => parser.parse()).toThrow();
        expect(errorHandler).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), "Expect ';' after value.");
    });

    it('should throw error on missing semicolon in expression statement', () => {
        const errorHandler = vi.fn();
        const scanner = new Scanner('1 + 1', errorHandler);
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, errorHandler);

        expect(() => parser.parse()).toThrow();
        expect(errorHandler).toHaveBeenCalledWith(expect.any(Number), expect.any(Number), "Expect ';' after expression.");
    });
});

