import { Token, TokenType } from '@/Token';


// 关键字映射
const keywords = new Map<string, TokenType>([
  ['class', TokenType.CLASS],
  ['else', TokenType.ELSE],
  ['false', TokenType.FALSE],
  ['for', TokenType.FOR],
  ['fun', TokenType.FUN],
  ['if', TokenType.IF],
  ['nil', TokenType.NIL],
  ['print', TokenType.PRINT],
  ['return', TokenType.RETURN],
  ['super', TokenType.SUPER],
  ['this', TokenType.THIS],
  ['true', TokenType.TRUE],
  ['var', TokenType.VAR],
  ['while', TokenType.WHILE],
]);

// 词法分析器（Scanner）
export class Scanner {
  private tokens: Token[] = [];
  private start = 0;
  private current = 0;
  private line = 1;
  private column = 0;
  constructor(private source: string) {
    this.source = source;
  }

  // 扫描所有 token
  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line, this.column));
    return this.tokens;
  }

  // 扫描单个 token
  private scanToken(): void {
    const c = this.advance();

    switch (c) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ')':
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case '{':
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case '}':
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ',':
        this.addToken(TokenType.COMMA);
        break;
      case '.':
        this.addToken(TokenType.DOT);
        break;
      case '-':
        this.addToken(TokenType.MINUS);
        break;
      case '+':
        this.addToken(TokenType.PLUS);
        break;
      case ';':
        this.addToken(TokenType.SEMICOLON);
        break;
      case '&':
        this.addToken(this.match('&') ? TokenType.AND : TokenType.BIT_AND);
        break;
      case '|':
        this.addToken(this.match('|') ? TokenType.OR : TokenType.BIT_OR);
        break;
      case '*':
        this.addToken(TokenType.STAR);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case '>':
        this.addToken(
          this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case '/':
        if (this.match('/')) {
          // 注释：一直读到行尾
          while (this.peek() !== '\n' && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        // 忽略空白字符
        break;
      case '\n':
        this.line++;
        this.column = 0;
        break;
      case '"':
        this.string();
        break;
      default:
        if (isDigit(c)) {
          this.number();
        } else if (isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(`[line ${this.line}, column ${this.column}] Unexpected character: ${c}`);
        }
        break;
    }
  }

  // 处理字符串字面量
  private string(): void {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') {
        this.line++;
        this.column = -1;// 因为换行符也算一个字符
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      throw new Error(`[line ${this.line}] Unterminated string.`);
    }

    // 闭合引号
    this.advance();

    // 提取字符串值（去掉引号）
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.STRING, value);
  }

  // 处理数字字面量
  private number(): void {
    while (isDigit(this.peek())) {
      this.advance();
    }

    // 处理小数部分
    if (this.peek() === '.' && isDigit(this.peekNext())) {
      // 消费 '.'
      this.advance();

      while (isDigit(this.peek())) {
        this.advance();
      }
    }

    const value = parseFloat(this.source.substring(this.start, this.current));
    this.addToken(TokenType.NUMBER, value);
  }

  // 处理标识符和关键字
  private identifier(): void {
    while (isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = keywords.get(text) || TokenType.IDENTIFIER;
    this.addToken(type);
  }



  // 辅助方法
  private isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  private addToken(type: TokenType, literal: any = null): void {
    const text = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line, this.column));
  }

  // 消费一个字符
  private advance(): string {
    const c = this.source[this.current++];
    this.column++;
    return c;
  }

  // 匹配一个字符
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;

    this.current++;
    this.column++;
    return true;
  }

  private peek(): string {
    if (this.isAtEnd()) return '\0';
    return this.source[this.current];
  }

  private peekNext(): string {
    const next = this.current + 1;
    if (next >= this.source.length) return '\0';
    return this.source[next];
  }

}



function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function isAlpha(c: string): boolean {
  return (c >= "a" && c <= "z") ||
    (c >= "A" && c <= "Z") ||
    c === "_";
}

function isAlphaNumeric(c: string): boolean {
  return isAlpha(c) || isDigit(c);
}
