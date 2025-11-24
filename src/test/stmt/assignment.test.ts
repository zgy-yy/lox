import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Variable Assignment Tests', () => {

    test('Variable Declaration and Assignment', () => {
        runTest(`
            var a = 1;
            print a; //OUTPUT:1
            
            var b = 2;
            print a + b; //OUTPUT:3
            
            a = 5;
            print a; //OUTPUT:5
            
            var c;
            print c; //OUTPUT:nil
            
            c = "initialized";
            print c; //OUTPUT:initialized
        `);
    });

    test('Assignment Expression Value', () => {
        runTest(`
            var a;
            print a = 1; //OUTPUT:1
            print a; //OUTPUT:1
        `);
    });

    test('Chained Assignment', () => {
        runTest(`
            var a;
            var b;
            a = b = 10;
            print a; //OUTPUT:10
            print b; //OUTPUT:10
        `);
    });

    test('Reassignment with Different Types', () => {
        runTest(`
            var a = 1;
            print a; //OUTPUT:1
            a = "string";
            print a; //OUTPUT:string
            a = true;
            print a; //OUTPUT:true
        `);
    });
});

