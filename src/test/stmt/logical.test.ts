import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Logical Operator Tests', () => {

    test('Logical OR (||)', () => {
        runTest(`
            fun main(){
                print("hi" || 2);
                print(null || "yes");
                print(false || "yes");
                print(false || false);
                print(false || false || "yes");
            }
            //OUTPUT:hi
            //OUTPUT:yes
            //OUTPUT:yes
            //OUTPUT:false
            //OUTPUT:yes
        `);
    });

    test('Logical AND (&&)', () => {
        runTest(`
            fun main(){
                print("hi" && 2);
                print(null && "yes");
                print(false && "yes");
                print(true && "yes");
                print(true && true && "yes");
            }
            //OUTPUT:2
            //OUTPUT:null
            //OUTPUT:false
            //OUTPUT:yes
            //OUTPUT:yes
        `);
    });

    test('Short-circuit Evaluation', () => {
        // 验证短路：如果左侧已经决定结果，右侧不应执行（例如不应打印或产生副作用）
        // 注意：这里的测试主要验证值，真正的副作用（如变量赋值）在解释器层面需要确保不被执行
        runTest(`
            fun main(){
                var a = "before";
                true || (a = "after"); 
                print(a);
                
                var b = "before";
                false && (b = "after");
                print(b);
            }
            //OUTPUT:before
            //OUTPUT:before
        `);
    });

    test('Mixed Logical Operators', () => {
        runTest(`
            fun main(){
                print(true || true && false);
                print(false || true && true);
                print((false || true) && true);
            }
            //OUTPUT:true
            //OUTPUT:true
            //OUTPUT:true
        `);
    });
});

