import { describe, test } from 'vitest';
import { runTest } from './test-utils';

describe('Logical Operator Tests', () => {

    test('Logical OR (||)', () => {
        runTest(`
            print "hi" || 2; //OUTPUT:hi
            print nil || "yes"; //OUTPUT:yes
            print false || "yes"; //OUTPUT:yes
            print false || false; //OUTPUT:false
            print false || false || "yes"; //OUTPUT:yes
        `);
    });

    test('Logical AND (&&)', () => {
        runTest(`
            print "hi" && 2; //OUTPUT:2
            print nil && "yes"; //OUTPUT:nil
            print false && "yes"; //OUTPUT:false
            print true && "yes"; //OUTPUT:yes
            print true && true && "yes"; //OUTPUT:yes
        `);
    });

    test('Short-circuit Evaluation', () => {
        // 验证短路：如果左侧已经决定结果，右侧不应执行（例如不应打印或产生副作用）
        // 注意：这里的测试主要验证值，真正的副作用（如变量赋值）在解释器层面需要确保不被执行
        runTest(`
            var a = "before";
            true || (a = "after"); 
            print a; //OUTPUT:before
            
            var b = "before";
            false && (b = "after");
            print b; //OUTPUT:before
        `);
    });

    test('Mixed Logical Operators', () => {
        runTest(`
            print true || true && false; //OUTPUT:true
            print false || true && true; //OUTPUT:true
            print (false || true) && true; //OUTPUT:true
        `);
    });
});

