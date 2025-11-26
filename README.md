# Lox

## 词法分析 （扫描器）
词法分析将源代码的字符流转换为词法单元（Token）序列。

`var name = "Bob";`

var → 关键字 Token (VAR)

name → 标识符 Token (IDENTIFIER, "name")

= → 运算符 Token (EQUAL)

"Bob" → 字符串字面量 Token (STRING, "Bob")

; → 分号 Token (SEMICOLON)

## 语法分析

语法分析（Parsing）是编译器/解释器的第二个阶段，将词法分析产生的 Token 序列转换为**抽象语法树（AST，Abstract Syntax Tree）**，并检查代码是否符合语言的语法规则。

### 什么是抽象语法树（AST）？

抽象语法树是源代码语法结构的一种树状表示。每个节点代表源代码中的一个构造（如表达式、语句等），树的结构反映了代码的层次关系。

#### 示例：从 Token 到 AST

假设有以下代码：
```lox
var result = 10 + 20;
```

**词法分析后的 Token 序列：**
```
VAR IDENTIFIER("result") EQUAL NUMBER(10) PLUS NUMBER(20) SEMICOLON
```

**语法分析后生成的 AST：**
```
VarDeclaration
  ├─ name: "result"
  └─ initializer: Binary
      ├─ left: Literal(10)
      ├─ operator: PLUS
      └─ right: Literal(20)
```

### 语法分析的作用

1. **验证语法正确性**
   - 检查括号是否匹配
   - 检查语句结构是否正确
   - 检查运算符使用是否合法
   - 报告语法错误的位置和原因

2. **构建程序结构**
   - 将线性的 Token 序列转换为树形结构
   - 反映代码的层次关系和嵌套结构
   - 为后续的语义分析和代码执行做准备

3. **处理运算符优先级**
   - 确保表达式按照正确的优先级计算
   - 例如：`1 + 2 * 3` 应该解析为 `1 + (2 * 3)`，而不是 `(1 + 2) * 3`

### 运算符优先级

Lox 语言的运算符优先级（从低到高）：

| 优先级 | 运算符 | 说明 | 结合性 |
|--------|--------|------|--------|
| 1 | `,` | 逗号 | 左结合 |
| 2 | `=` | 赋值 | 右结合 |
| 3 | `?` `:` | 三元条件 | 右结合 |
| 4 | `\|\|` | 逻辑或 | 左结合 |
| 5 | `&&` | 逻辑与 | 左结合 |
| 6 | `\|` | 按位或 | 左结合 |
| 7 | `^` | 按位异或 | 左结合 |
| 8 | `&` | 按位与 | 左结合 |
| 9 | `==`, `!=` | 相等性 | 左结合 |
| 10 | `>`, `>=`, `<`, `<=` | 比较 | 左结合 |
| 11 | `>>`, `<<` | 移位 | 左结合 |
| 12 | `+`, `-` | 加减 | 左结合 |
| 13 | `*`, `/`, `%` | 乘除模 | 左结合 |
| 14 | `!`, `-`, `~`, `++`, `--` | 一元操作符 | 右结合 |
| 15 | `++`, `--` | 后缀递增递减 | 左结合 |

**示例：**
```lox
1 + 2 * 3        // 解析为: 1 + (2 * 3) = 7
!true == false   // 解析为: (!true) == false = true
-1 + 2           // 解析为: (-1) + 2 = 1
1 + 2, 3 + 4     // 解析为: (1 + 2), (3 + 4) = 7
```

### 语法规则（BNF 风格）

目前已实现的语法规则如下（与 `Parser.ts` 实现一致）：

```
program        → declaration*

declaration    → varDecl
               | statement

varDecl        → "var" IDENTIFIER ( "=" expression )? ";"

statement      → exprStmt
               | ifStmt
               | printStmt
               | block
               | whileStmt
               | forStmt
               | doWhileStmt
               | loopStmt
               | breakStmt
               | continueStmt

exprStmt       → expression ";"
ifStmt         → "if" "(" expression ")" statement ( "else" statement )?
printStmt      → "print" expression ";"
block          → "{" declaration* "}"
whileStmt      → "while" "(" expression ")" statement
forStmt        → "for" "(" ( varDecl | exprStmt )? ";" expression? ";" expression? ")" statement
doWhileStmt    → "do" statement "while" "(" expression ")" ";"
loopStmt       → "loop" statement
breakStmt      → "break" ";"
continueStmt   → "continue" ";"

expression     → comma

comma          → assignment ( "," assignment )*

assignment     → conditional ( "=" assignment )?

conditional    → logical_or ( "?" assignment ":" assignment )?

logical_or     → logical_and ( "||" logical_and )*
logical_and    → bitwise_or ( "&&" logical_or )*
bitwise_or     → bitwise_xor ( "|" bitwise_xor )*
bitwise_xor    → bitwise_and ( "^" bitwise_and )*
bitwise_and    → equality ( "&" equality )*
equality       → comparison ( ( "!=" | "==" ) comparison )*
comparison     → shift ( ( ">" | ">=" | "<" | "<=" ) shift )*
shift          → term ( ( ">>" | "<<" ) term )*
term           → factor ( ( "-" | "+" ) factor )*
factor         → unary ( ( "/" | "*" | "%" ) unary )*
unary          → ( "!" | "-" | "~" | "++" | "--" ) unary
               | postfix
postfix        → primary ( "++" | "--" )?
primary        → NUMBER | STRING | "true" | "false" | "nil"
               | "(" expression ")"
               | IDENTIFIER
```

### 解析过程示例

**源代码：**
```lox
var name = "Bob";
print name;
```

**解析步骤：**

1. **识别变量声明**
   - 匹配 `var` 关键字
   - 读取标识符 `name`
   - 解析初始化表达式 `"Bob"`
   - 匹配分号 `;`

2. **识别打印语句**
   - 匹配 `print` 关键字
   - 解析表达式（变量 `name`）
   - 匹配分号 `;`

3. **构建 AST**
   ```
   Program
     ├─ VarDeclaration(name, "Bob")
     └─ PrintStatement
         └─ Variable(name)
   ```

### 错误处理

语法分析器在遇到语法错误时会：
1. **报告错误位置**：指出错误发生的行号和位置
2. **提供错误信息**：说明期望的语法结构
3. **错误恢复**：尝试同步到下一个语句，继续解析后续代码

**错误示例：**
```lox
var name = "Bob"  // 错误：缺少分号
print "Hello"     // 错误：缺少分号
```

### 表达式

表达式是产生值的代码片段。Lox 支持以下表达式类型：

#### 字面量表达式
- 数字：`42`, `3.14`
- 字符串：`"hello"`, `"world"`
- 布尔值：`true`, `false`
- 空值：`nil`

#### 一元表达式
- 逻辑非：`!true` → `false`
- 负号：`-42` → `-42`
- 按位取反：`~0` → `-1`
- 前缀递增：`++i` → 先递增再返回值
- 前缀递减：`--i` → 先递减再返回值

#### 后缀表达式
- 后缀递增：`i++` → 先返回值再递增
- 后缀递减：`i--` → 先返回值再递减

#### 二元表达式
- 算术运算：`+`, `-`, `*`, `/`, `%`
  - `1 + 2` → `3`
  - `10 - 5` → `5`
  - `3 * 4` → `12`
  - `8 / 2` → `4`
  - `10 % 3` → `1`
- 移位运算：`>>`, `<<`
  - `8 >> 2` → `2`
  - `2 << 2` → `8`
- 比较运算：`>`, `>=`, `<`, `<=`
  - `5 > 3` → `true`
  - `2 < 1` → `false`
- 相等性运算：`==`, `!=`
  - `1 == 1` → `true`
  - `1 != 2` → `true`
- 按位运算：`&`, `|`, `^`
  - `5 & 3` → `1` (按位与)
  - `5 | 3` → `7` (按位或)
  - `5 ^ 3` → `6` (按位异或)
- 逻辑运算：`&&`, `||`
  - `true && false` → `false`
  - `true || false` → `true`

#### 条件表达式（三元运算符）
- `condition ? trueExpr : falseExpr`
  - `true ? 1 : 2` → `1`
  - `false ? 1 : 2` → `2`

#### 赋值表达式
- `variable = value`
  - `a = 10` → 将 `10` 赋值给 `a`
  - `a = b = 5` → 链式赋值

#### 逗号表达式
- `expr1, expr2, expr3` → 返回最后一个表达式的值
  - `1, 2, 3` → `3`

#### 分组表达式
使用括号改变运算优先级：
- `(1 + 2) * 3` → `9`
- `1 + (2 * 3)` → `7`

#### 变量表达式
引用变量：
- `name` - 获取变量 `name` 的值

### 语句

语句是执行操作的代码单元。Lox 目前实现了以下语句类型：

#### 表达式语句
任何表达式后跟分号：
- `1 + 2;`
- `name;`

#### 变量声明语句
声明并可选地初始化变量：
- `var name;` - 声明变量，初始值为 `nil`
- `var age = 42;` - 声明并初始化变量
- `var greeting = "Hello";`

#### 打印语句
输出表达式的值：
- `print "Hello, world!";`
- `print 1 + 2;` → 输出 `3`
- `print name;` → 输出变量 `name` 的值

#### 块语句
使用大括号 `{}` 将多个语句组合成一个块：
- `{ var a = 1; print a; }`

#### 条件语句
使用 `if-else` 进行条件判断：
- `if (condition) statement;`
- `if (condition) statement1; else statement2;`

#### 循环语句
- **while 循环**：`while (condition) statement;`
- **for 循环**：`for (initializer; condition; increment) statement;`
  - 所有部分都是可选的：`for (;;) statement;` 等价于无限循环
- **do-while 循环**：`do statement; while (condition);`
- **loop 循环**：`loop statement;` 等价于 `while (true) statement;`

#### 控制流语句
- **break**：跳出当前循环，只能在循环内使用
- **continue**：跳过当前循环迭代，继续下一次迭代，只能在循环内使用
