import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Integration Tests with Output Expectations', () => {

    test('Arithmetic output', () => {
        runTest(`
            fun main(){
                print(10 + 15);
            }
            //OUTPUT:25
        `);
    });

    test('String output', () => {
        runTest(`
            fun main(){
                print("hello");
            }
            //OUTPUT:hello
        `);
    });

    test('Multiple statements', () => {
        runTest(`
            fun main(){
                print(1);
                print(2);
            }
            //OUTPUT:1
            //OUTPUT:2
        `);
    });
    
    test('Complex expression', () => {
        runTest(`
            fun main(){
                print((1 + 2) * 3);
            }
            //OUTPUT:9
        `);
    });
    
    test('Boolean output', () => {
        runTest(`
            fun main(){
                print(true);
                print(!true);
            }
            //OUTPUT:true
            //OUTPUT:false
        `);
    });

    test('Comparison output', () => {
        runTest(`
            fun main(){
                print(1 < 2);
                print(1 >= 2);
            }
            //OUTPUT:true
            //OUTPUT:false
        `);
    });
});
