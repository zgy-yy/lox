/**
 * 括号类型定义
 */
export type BracketType = '(' | ')' | '[' | ']' | '{' | '}';

/**
 * 括号匹配结果
 */
export interface BracketMatch {
    /** 左括号位置 */
    leftIndex: number;
    /** 右括号位置 */
    rightIndex: number;
    /** 括号类型 */
    type: 'paren' | 'bracket' | 'brace';
}

/**
 * 括号匹配错误
 */
export interface BracketError {
    /** 错误位置 */
    index: number;
    /** 错误字符 */
    char: string;
    /** 错误信息 */
    message: string;
}

/**
 * 括号匹配结果
 */
export interface BracketMatchResult {
    /** 是否匹配成功 */
    isValid: boolean;
    /** 匹配的括号对 */
    matches: BracketMatch[];
    /** 错误列表 */
    errors: BracketError[];
}

/**
 * 括号匹配算法
 * 使用栈数据结构来匹配括号
 * 
 * @param text 要匹配的文本
 * @returns 匹配结果
 * 
 * @example
 * ```ts
 * const result = matchBrackets("(1 + 2) * (3 - 4)");
 * console.log(result.isValid); // true
 * console.log(result.matches); // [{ leftIndex: 0, rightIndex: 6, type: 'paren' }, ...]
 * ```
 */
export function matchBrackets(text: string): BracketMatchResult {
    const matches: BracketMatch[] = [];
    const errors: BracketError[] = [];
    
    // 定义括号对
    const pairs: Record<string, { open: string; close: string; type: 'paren' | 'bracket' | 'brace' }> = {
        '(': { open: '(', close: ')', type: 'paren' },
        '[': { open: '[', close: ']', type: 'bracket' },
        '{': { open: '{', close: '}', type: 'brace' },
    };
    
    // 栈：存储未匹配的左括号信息
    const stack: Array<{ index: number; char: string; type: 'paren' | 'bracket' | 'brace' }> = [];
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // 检查是否是左括号
        if (char in pairs) {
            const pair = pairs[char];
            stack.push({ index: i, char, type: pair.type });
        }
        // 检查是否是右括号
        else if (char === ')' || char === ']' || char === '}') {
            if (stack.length === 0) {
                // 多余的右括号
                errors.push({
                    index: i,
                    char,
                    message: `多余的右括号 "${char}" 在位置 ${i}`,
                });
                continue;
            }
            
            const top = stack.pop()!;
            const expectedPair = pairs[top.char];
            
            if (char !== expectedPair.close) {
                // 括号类型不匹配
                errors.push({
                    index: i,
                    char,
                    message: `括号类型不匹配：期望 "${expectedPair.close}"，但找到 "${char}" 在位置 ${i}`,
                });
                // 将左括号也标记为错误
                errors.push({
                    index: top.index,
                    char: top.char,
                    message: `括号类型不匹配：左括号 "${top.char}" 在位置 ${top.index}`,
                });
            } else {
                // 匹配成功
                matches.push({
                    leftIndex: top.index,
                    rightIndex: i,
                    type: top.type,
                });
            }
        }
    }
    
    // 检查是否有未匹配的左括号
    while (stack.length > 0) {
        const top = stack.pop()!;
        errors.push({
            index: top.index,
            char: top.char,
            message: `未匹配的左括号 "${top.char}" 在位置 ${top.index}`,
        });
    }
    
    return {
        isValid: errors.length === 0,
        matches,
        errors,
    };
}

/**
 * 检查括号是否匹配（简化版本）
 * 
 * @param text 要检查的文本
 * @returns 是否匹配
 * 
 * @example
 * ```ts
 * isValidBrackets("(1 + 2)"); // true
 * isValidBrackets("(1 + 2"); // false
 * ```
 */
export function isValidBrackets(text: string): boolean {
    return matchBrackets(text).isValid;
}

/**
 * 查找指定位置括号的匹配括号位置
 * 
 * @param text 文本
 * @param index 括号位置
 * @returns 匹配的括号位置，如果未找到则返回 -1
 * 
 * @example
 * ```ts
 * findMatchingBracket("(1 + 2)", 0); // 6 (右括号位置)
 * findMatchingBracket("(1 + 2)", 6); // 0 (左括号位置)
 * ```
 */
export function findMatchingBracket(text: string, index: number): number {
    if (index < 0 || index >= text.length) {
        return -1;
    }
    
    const result = matchBrackets(text);
    
    // 查找包含该位置的匹配对
    for (const match of result.matches) {
        if (match.leftIndex === index) {
            return match.rightIndex;
        }
        if (match.rightIndex === index) {
            return match.leftIndex;
        }
    }
    
    return -1;
}

