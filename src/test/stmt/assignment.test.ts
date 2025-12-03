import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Variable Assignment Tests', () => {

    test('Variable Declaration and Assignment', () => {
        runTest(`
            fun main(){
                var a = 1;
                print(a);
                
                var b = 2;
                print(a + b);
                
                a = 5;
                print(a);
                
                var c;
                print(c);
                
                c = "initialized";
                print(c);
            }
            //OUTPUT:1
            //OUTPUT:3
            //OUTPUT:5
            //OUTPUT:null
            //OUTPUT:initialized
        `);
    });

    test('Assignment Expression Value', () => {
        runTest(`
            fun main(){
                var a;
                print(a = 1);
                print(a);
            }
            //OUTPUT:1
            //OUTPUT:1
        `);
    });

    test('Chained Assignment', () => {
        runTest(`
            fun main(){
                var a;
                var b;
                a = b = 10;
                print(a);
                print(b);
            }
            //OUTPUT:10
            //OUTPUT:10
        `);
    });

    test('Reassignment with Different Types', () => {
        runTest(`
            fun main(){
                var a = 1;
                print(a);
                a = "string";
                print(a);
                a = true;
                print(a);
            }
            //OUTPUT:1
            //OUTPUT:string
            //OUTPUT:true
        `);
    });
});

