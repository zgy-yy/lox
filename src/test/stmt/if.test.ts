import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('If Statement Tests', () => {

    test('Basic If Statement', () => {
        runTest(`
            fun main(){
                if (true) print("yes");
                if (false) print("no");
            }
            //OUTPUT:yes
        `);
    });

    test('If Else Statement', () => {
        runTest(`
            fun main(){
                if (true) {
                    print("yes");
                } else {
                    print("no");
                }

                if (false) {
                    print("yes");
                } else {
                    print("no");
                }
            }
            //OUTPUT:yes
            //OUTPUT:no
        `);
    });

    test('Truthy and Falsy', () => {
        runTest(`
            fun main(){
                if (1) print("yes");
                if (0) print("yes");
                if (null) print("no"); 
                if ("") print("yes");
            }
            //OUTPUT:yes
            //OUTPUT:yes
            //OUTPUT:yes
        `);
    });

    test('Nested If Statements', () => {
        runTest(`
            fun main(){
                var a = 1;
                if (a == 1) {
                    print("level 1");
                    if (a > 0) {
                        print("level 2");
                    }
                }
            }
            //OUTPUT:level 1
            //OUTPUT:level 2
        `);
    });

    test('Dangling Else', () => {
        runTest(`
            fun main(){
                if (true) if (false) print("wrong"); else print("correct");
                if (true) if (true) print("inner"); else print("wrong");
            }
            //OUTPUT:correct
            //OUTPUT:inner
        `);
    });

    test('If with Logical Operators', () => {
        runTest(`
            fun main(){
                if (true && true) print("both true");
                if (true && false) print("one false"); 
                if (false || true) print("one true");
                
                var a = 5;
                if (a > 0 && a < 10) print("in range");
                if (a < 0 || a > 10) print("out of range"); else print("in range again");
            }
            //OUTPUT:both true
            //OUTPUT:one true
            //OUTPUT:in range
            //OUTPUT:in range again
        `);
    });
});
