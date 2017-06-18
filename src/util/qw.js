const RE_TOKENS = /(\S+)/g

export default (str) => {
  const tokens = []
  let match
  while ((match = RE_TOKENS.exec(str)) !== null) {
    tokens.push(match[1])
  }
  return tokens
}
