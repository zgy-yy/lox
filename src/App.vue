<template>
    <div class="code-display">
        <p class="code-line" v-for="(line, indexLine) in vContent" :key="`line-${indexLine}`">
            <span 
                v-for="(char, index) in line" 
                :key="`char-${indexLine}-${index}`"
                :class="{ 'cursor-error': isErrorAt(indexLine + 1, index + 1) }">
                {{ char }}
            </span>
        </p>
    </div>
    <div class="expression-display">
        <span 
            v-for="(char, index) in expressionChars" 
            :key="`expr-${index}`"
            :class="getBracketClass(char, index)">
            {{ char }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { Scanner } from '@/parser/Scanner';
import ErrorHandler from '@/parser/ErrorHandler';
import { Parser } from './parser/Parser';
import { AstPrinter } from './ast/AstPrinter';
import { matchBrackets } from '@/utils';
import content from '@/test/expression/binaryExpr.e';

// 错误光标位置
const errorCursor = reactive({ line: -1, column: -1 });
const isErrorAt = (line: number, column: number) => 
    errorCursor.line === line && errorCursor.column === column;

// 代码内容
const vContent = content.split('\n');
const expressionContent = ref('');
// 括号位置到颜色索引的映射
const bracketColorMap = new Map<number, number>();

// 表达式字符数组
const expressionChars = computed(() => expressionContent.value.split(''));

// 获取括号的样式类
const getBracketClass = (char: string, index: number): string => {
    if (char === '(' || char === ')' || char === '[' || char === ']' || char === '{' || char === '}') {
        const colorIndex = bracketColorMap.get(index);
        if (colorIndex !== undefined) {
            return `bracket bracket-${colorIndex}`;
        }
    }
    return '';
};


// 解析代码
const reportError: ErrorHandler = (line, column, message) => {
    errorCursor.line = line;
    errorCursor.column = column;
    console.warn(message);
};

try {
    const scanner = new Scanner(content, reportError);
    const tokens = scanner.scanTokens();
    const parser = new Parser(tokens, reportError);
    const expr = parser.parse();
    const result = new AstPrinter().print(expr);
    
    expressionContent.value = result;
    
    // 使用括号匹配算法匹配括号并分配颜色
    const matchResult = matchBrackets(result);
    bracketColorMap.clear();
    
    // 括号颜色配置（更醒目的颜色）
    const BRACKET_COLORS_COUNT = 8;
    
    matchResult.matches.forEach((match, index) => {
        const colorIndex = index % BRACKET_COLORS_COUNT;
        bracketColorMap.set(match.leftIndex, colorIndex);
        bracketColorMap.set(match.rightIndex, colorIndex);
    });
    
    if (!matchResult.isValid) {
        console.warn('括号匹配错误:', matchResult.errors);
    }
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

.bracket {
    font-weight: 900;
    font-size: 16px;
    padding: 2px 4px;
    border-radius: 3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    display: inline-block;
    transform: scale(1.1);
}

.bracket-0 { 
    color: #FF0000; 
    background-color: #FFE5E5;
}
.bracket-1 { 
    color: #0066FF; 
    background-color: #E5F0FF;
}
.bracket-2 { 
    color: #00AA00; 
    background-color: #E5FFE5;
}
.bracket-3 { 
    color: #FF6600; 
    background-color: #FFF0E5;
}
.bracket-4 { 
    color: #9900FF; 
    background-color: #F0E5FF;
}
.bracket-5 { 
    color: #FF0099; 
    background-color: #FFE5F5;
}
.bracket-6 { 
    color: #0099FF; 
    background-color: #E5F5FF;
}
.bracket-7 { 
    color: #FFAA00; 
    background-color: #FFF5E5;
}
</style>
