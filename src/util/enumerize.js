export default (names) => Object.assign({},
  ...names.map((name) => ({[name]: Symbol(name)})))
