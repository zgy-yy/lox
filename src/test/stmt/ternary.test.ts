import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Conditional (Ternary) Operator Tests', () => {

    test('Basic Ternary Operation', () => {
        runTest(`
            fun main(){
                print(true ? "yes" : "no");
                print(false ? "yes" : "no");
            }
            //OUTPUT:yes
            //OUTPUT:no
        `);
    });

    test('Evaluation with Expressions', () => {
        runTest(`
            fun main(){
                print(1 < 2 ? 10 : 20);
                print(1 > 2 ? 10 : 20);
                print((1 + 1 == 2) ? "math works" : "math broken");
            }
            //OUTPUT:10
            //OUTPUT:20
            //OUTPUT:math works
        `);
    });

    test('Nested Ternary Operators', () => {
        // Right-associative: a ? b : c ? d : e  =>  a ? b : (c ? d : e)
        runTest(`
            fun main(){
                print(true ? 1 : true ? 2 : 3);
                print(false ? 1 : true ? 2 : 3);
                print(false ? 1 : false ? 2 : 3);
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:3
        `);
    });

    test('Precedence with Logic Operators', () => {
        // Precedence: || < && < ?: < =
        // logic_or ? expression : conditional
        // This means logic operators bind tighter than ternary
        runTest(`
            fun main(){
                print(true || false ? "or wins" : "ternary wins");
                print(false || false ? "or wins" : "ternary wins");
            }
            //OUTPUT:or wins
            //OUTPUT:ternary wins
        `);
    });

    test('Precedence with Assignment', () => {
        // Assignment has lower precedence than ternary: a = b ? c : d  =>  a = (b ? c : d)
        runTest(`
            fun main(){
                var a;
                a = true ? 100 : 200;
                print(a);
                
                a = false ? 100 : 200;
                print(a);
            }
            //OUTPUT:100
            //OUTPUT:200
        `);
    });
    
    test('Side Effects in Branches', () => {
        // Verify that only the executed branch produces side effects
        runTest(`
            fun main(){
                var a = 0;
                var b = 0;
                true ? (a = 1) : (b = 1);
                print(a);
                print(b);
                
                false ? (a = 2) : (b = 2);
                print(a);
                print(b);
            }
            //OUTPUT:1
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });
});

