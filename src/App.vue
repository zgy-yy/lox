<template>
    <div class="code-display">
        <p class="code-line" v-for="(line, indexLine) in vContent" :key="`line-${indexLine}`">
            <span v-for="(char, index) in line" :key="`char-${indexLine}-${index}`"
                :class="{ 'cursor-error': isErrorAt(indexLine + 1, index + 1) }">
                {{ char }}
            </span>
        </p>
    </div>

</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Scanner } from '@/parser/Scanner';
import ErrorHandler from '@/parser/ErrorHandler';
import { Parser } from './parser/Parser';

import content from '@/test/expression/binaryExpr.e';
import { Interperter } from './execute/Interperter';

// 错误光标位置
const errorCursor = reactive({ line: -1, column: -1 });
const isErrorAt = (line: number, column: number) =>
    errorCursor.line === line && errorCursor.column === column;

// 代码内容
const vContent = content.split('\n');


// 解析代码
const reportError: ErrorHandler = (line, column, message) => {
    errorCursor.line = line;
    errorCursor.column = column;
    console.warn(`line ${line}, column ${column}: ${message}`);
};

try {
    const scanner = new Scanner(content, reportError);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens, reportError);
    const expr = parser.parse();
    if (!expr)
        throw new Error('解析失败');

    const interperter = new Interperter();
    const value = interperter.execute(expr);
    console.log(value);
} catch (e) {
    console.error(e instanceof Error ? e.message : '未知错误');
}


</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.code-display {
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.cursor-error {
    color: red;
}

.expression-display {
    font-family: monospace;
    font-size: 14px;
    line-height: 1.5;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
    margin-top: 20px;
}

</style>
