class TagSearch {
  tagName = ''
  negated = false
}

class FieldSearch {
  fieldName = ''
  fieldValue = ''
  negated = false
}

class TagsParser {
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


main()

function main() {
  let tagStr = "tag1 !tag2 -tag3 't1 t2' t:t2"

  if (process.argv.length > 2) {
    tagStr = ''

    for (let i = 2; i < process.argv.length; i++) {
      if (i != 2) {
        tagStr += " "
      }

      tagStr += process.argv[i]
    }
  }

  console.log(`Original string: ${tagStr}`)

  let tags = parseTags(tagStr)
  console.log(tags)
}

function parseTags(input) {
  let p = new TagsParser(input)
  return p.parse()
}
