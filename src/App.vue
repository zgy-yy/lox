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
import { Interperter } from './execute/Interperter';
import RuntimeError from './execute/RuntimeError';

import content from '@/grammar/statement/var_stmt.e';

// 错误光标位置
const errorCursor = reactive<{
    line: number;
    column: number;
}[]>([]);
const isErrorAt = (line: number, column: number) =>
    errorCursor.some(item => item.line === line && item.column === column);

// 代码内容
const vContent = content.split('\n');


// 解析代码
const reportError: ErrorHandler = (line, column, message) => {
    errorCursor.push({ line, column });
    console.warn(`line ${line}, column ${column}: ${message}`);
};

try {
    const scanner = new Scanner(content, reportError);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens, reportError);
    const stmts = parser.parse();
    if (!stmts)
        throw new Error('解析失败');

    const interperter = new Interperter((error: RuntimeError) => {
        errorCursor.push({ line: error.token.line, column: error.token.column });
        console.warn(`[${error.token.line}:${error.token.column}] ${error.message}`);
    });
    interperter.interpret(stmts);
} catch (e) {
    console.error(e);
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
