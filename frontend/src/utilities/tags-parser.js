export class TagSearch {
  tagName = ''
  negated = false

  constructor(tagName = '') {
    this.tagName = tagName
  }

  testPost(post) {
    let found = post.tags.includes(this.tagName)
    return found != this.negated
  }

  toString() {
    return `${escapeString(this.tagName)}`
  }

  toPrettyString() {
    return this.tagName
  }
}

export class FieldSearch {
  fieldName = ''
  fieldValue = ''
  negated = false

  testPost(post) {
    return true
  }

  toString() {
    return `${escapeString(this.fieldName)}:${escapeString(this.fieldValue)}`
  }

  toPrettyString() {
    return `${this.fieldName} = ${this.fieldValue}`
  }
}

/**
 * @param {string} str 
 * @returns {string}
 */
function escapeString(str) {
  if (str.includes(" ") 
    || str.includes(":") 
    || str.includes("=") 
    || str.includes("!") 
    || str.includes("-")
  ) {
    return `"${str}"`
  }

  return str
}

export class TagsParser {
  #input = ''
  #cursor = 0

  constructor(input) {
    this.#input = input ?? ""
    this.#cursor = 0
  }

  parse() {
    let exprList = []

    while (this.hasNext) {
      let t = this.tag()
      exprList.push(t)
    }

    return exprList
  }

  get hasNext() {
    return this.#cursor < this.#input.length
  }

  get currentChar() {
    return this.#input[this.#cursor]
  }

  advance() {
    this.#cursor++
  }

  tag() {
    let negated = false
    let search = ''

    while (this.currentChar == ' ') {
      this.advance()
    }

    if (this.currentChar == '!' || this.currentChar == '-') {
      this.advance()
      negated = true
    }

    search = this.label()

    if (this.currentChar == ':' || this.currentChar == '=') {
      this.advance()
      let t = this.label()

      let r = new FieldSearch()
      r.fieldName = search
      r.fieldValue = t
      r.negated = negated
      return r
    }

    let t = new TagSearch()
    t.negated = negated
    t.tagName = search
    return t
  }

  label() {
    if (this.isQuote(this.currentChar)) {
      return this.quotedString()
    }

    let r = ""

    while (this.currentChar != undefined) {
      if (this.currentChar == ' ') {
        break
      }
      if (this.currentChar == '=' || this.currentChar == ':') {
        break
      }

      r += this.currentChar
      this.advance()
    }

    return r
  }

  isQuote(ch) {
    return ch == '"' || ch == "'" || ch == '`'
  }

  quotedString() {
    let quote = this.currentChar
    let result = ""

    this.advance()

    while (this.currentChar != undefined && this.currentChar != quote) {
      result += this.currentChar
      this.advance()
    }

    this.advance()

    return result
  }
}

export function parseTags(input) {
  let p = new TagsParser(input)
  return p.parse()
}