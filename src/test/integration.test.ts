import { describe, test } from 'vitest';
import { runTest } from './test-utils';

describe('Integration Tests with Output Expectations', () => {

    test('Arithmetic output', () => {
        runTest(`
            print 10 + 15; //OUTPUT:25
        `);
    });

    test('String output', () => {
        runTest(`
            print "hello"; //OUTPUT:hello
        `);
    });

    test('Multiple statements', () => {
        runTest(`
            print 1; //OUTPUT:1
            print 2; //OUTPUT:2
        `);
    });
    
    test('Complex expression', () => {
        runTest(`
            print (1 + 2) * 3; //OUTPUT:9
        `);
    });
    
    test('Boolean output', () => {
        runTest(`
            print true; //OUTPUT:true
            print !true; //OUTPUT:false
        `);
    });

    test('Comparison output', () => {
        runTest(`
            print 1 < 2; //OUTPUT:true
            print 1 >= 2; //OUTPUT:false
        `);
    });
});
