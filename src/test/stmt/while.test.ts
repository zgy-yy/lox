import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('While Loop Tests', () => {

    test('Basic While Loop', () => {
        runTest(`
            fun main(){
                var i = 0;
                while (i < 3) {
                    print(i);
                    i = i + 1;
                }
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('While Loop with Condition Variable', () => {
        runTest(`
            fun main(){
                var i = 3;
                while (i > 0) {
                    print(i);
                    i = i - 1;
                }
            }
            //OUTPUT:3
            //OUTPUT:2
            //OUTPUT:1
        `);
    });

    test('While Loop False Condition', () => {
        runTest(`
            fun main(){
                while (false) {
                    print("should not execute");
                }
                print("done");
            }
            //OUTPUT:done
        `);
    });

    test('While Loop with Side Effects in Condition', () => {
        runTest(`
            fun main(){
                var i = 0;
                while ((i = i + 1) < 3) {
                    print(i);
                }
            }
            //OUTPUT:1
            //OUTPUT:2
        `);
    });
    
    test('Nested While Loops', () => {
        runTest(`
            fun main(){
                var i = 0;
                while (i < 2) {
                    var j = 0;
                    while (j < 2) {
                        print(i + j);
                        j = j + 1;
                    }
                    i = i + 1;
                }
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:1
            //OUTPUT:2
        `);
    });
});

