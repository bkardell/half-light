(function() {
let targetedStyles
const openStylableElements = new Set()

function refreshTargetedStyles() {
  targetedStyles = [];
  [...document.styleSheets].forEach((sheet) => {
    if (!sheet.ownerNode.matches("head > *")) return

    [...sheet.cssRules].forEach((rule) => {
      let name = rule.constructor.name
      let cond = rule.conditionText || ''
      let globalIntent = cond.startsWith('screen,')
      let f = cond.match(/(?:--crossroot\({0,1})([^\)]*)/)
      
      if (
        name === 'CSSMediaRule' && (cond=== "--crossroot" || f) 
      ) {
        [...rule.cssRules].forEach((innerRule) => {

          let where = (f && f.length == 2 && f[1]) ? f[1] : '*'
          targetedStyles[where] = targetedStyles[where] || new CSSStyleSheet();
          targetedStyles[where].insertRule(innerRule.cssText)
        })
      }
    })
  })
}

function clearStyles (element) {
  element.shadowRoot.adoptedStyleSheets = []
}

function setStyles (element) {
  for (selector in targetedStyles) {
    if (element.matches(selector)) {
    element.shadowRoot.adoptedStyleSheets.push(targetedStyles[selector])
    }
  } 
}

const observer = new MutationObserver(() => {
  refreshTargetedStyles()
  for (const element of openStylableElements) {
    clearStyles(element)
    setStyles(element)
  }
})

observer.observe(document.head, {
  childList: true,
  subtree: true, 
  characterData: true,
  attributes: true
})

refreshTargetedStyles()

let old = Element.prototype.attachShadow
Element.prototype.attachShadow = function () {
  let r = old.call(this, ...arguments)
  openStylableElements.add(this)
  Promise.resolve().then(() => setStyles(this))
  return r
}
}())
