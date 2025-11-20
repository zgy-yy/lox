<template>
    <div class="code-display">
        <p class="code-line" v-for="(line, indexLine) in vContent" :key="line">
            <span class="code-word" v-for="(value, index) in line.split('')" :key="value"
                :class="{ 'cursor-error': cursorlight({ line: indexLine + 1, column: index + 1 }) }">{{ value }}</span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Scanner } from '@/parser/Scanner';
import content from '@/test/token.e';
import ErrorHandler from '@/parser/ErrorHandler.ts';

type Cursor = {
    line: number;
    column: number;
}
const errorCursor = reactive<Cursor>({
    line: -1,
    column: -1,
})

const vContent = content.split('\n');;
const sourceCode = content

function cursorlight(self: Cursor) {
    return self.line === errorCursor.line && self.column === errorCursor.column;
}


/**
 * 扫描代码
 */

const reportError: ErrorHandler = (line: number, column: number, message: string) => {
    errorCursor.line = line;
    errorCursor.column = column;
    console.warn(message);
}

try {
    const scanner = new Scanner(sourceCode, reportError);
    const tokens = scanner.scanTokens();
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    } else {
        console.error('未知错误');
    }
}


</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}

.app {
    padding: 20px;
    font-family: 'Arial', sans-serif;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

.code-display {
    font-family: 'monospace';
    font-size: 14px;
    line-height: 1.5;
    white-space: pre-wrap;
}

.cursor-error {
    color: red;
}
</style>
