(function () {
  let targetedStyles;
  const openStylableElements = new Set();
  const __alreadyAdopted = new WeakMap();

  function isInDarkRoot(el) {
    if (el.parentElement) {
        return isInDarkRoot(el.parentElement)
    } else if (el.host) {
        if (el.host.darkened) {
            return true
        }
        return isInDarkRoot(el.host)
    }
    return el !== document.documentElement && !el.host 
  }

  function processSheet(rules, where="*") {
     [...rules].forEach((rule) => {
        targetedStyles[where] = targetedStyles[where] || [];
        targetedStyles[where].push(rule.cssText);
      });
  }
  
  function parseMQ(condition) {
    let f = condition.match(/(?:--crossroot\({0,1})([^\)]*)/);
    return { 
      isCrossRoot: condition === "--crossroot" || f, 
      where: f && f.length == 2 && f[1].trim() ? f[1] : "*"
    }
  }
  
  function refreshTargetedStyles() {
    targetedStyles = [];
    [...document.styleSheets].forEach((sheet) => {
      if (!sheet.ownerNode.matches("head > :not([no-half-light])")) return;

      let sheetMQResult = parseMQ(sheet.media.mediaText);
      if (sheetMQResult.isCrossRoot) { 
        processSheet(sheet.cssRules, sheetMQResult.where)
      }
      [...sheet.cssRules].forEach((rule) => {
        let name = rule.constructor.name;
        let cond = rule.conditionText || "";
        let mqResult = parseMQ(cond);
        if (name === "CSSMediaRule" && mqResult.isCrossRoot) {
          processSheet(rule.cssRules, mqResult.where)
        }
      });
    });
    Object.keys(targetedStyles).forEach((where) => {
      let sheet = new CSSStyleSheet();
      sheet.insertRule(
        "@layer --crossroot {" + targetedStyles[where].join("\n") + "}"
      );
      targetedStyles[where] = sheet;
    });
  }

  function clearStyles(element) {
    element.shadowRoot.adoptedStyleSheets = [];
    (__alreadyAdopted.get(element) || []).forEach((s) => {
      element.shadowRoot.adoptedStyleSheets.push(s);
    });
  }

  function setStyles(element) {
    for (let selector in targetedStyles) {
      if (element.matches(selector)) {
        element.shadowRoot.adoptedStyleSheets.push(targetedStyles[selector]);
      }
    }
  }

  const init = () => {
    refreshTargetedStyles();
    for (const element of openStylableElements) {
      clearStyles(element);
      setStyles(element);
    }
  }

  const observer = new MutationObserver(init);
  requestAnimationFrame(() => {
    init()
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });
  })
  
  let script = document.currentScript;
  document.addEventListener("DOMContentLoaded", () => {
    if(script.hasAttribute('disable-live-half-light')) {
      observer.disconnect()
    }
  })

  let old = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function () {
    let r = old.call(this, ...arguments);
    if (arguments[0].mode !== 'open') return r; 
    requestAnimationFrame(() => {
      if (isInDarkRoot(r)) {
        return;
      }
      openStylableElements.add(this);
      __alreadyAdopted.set(
        this,
        Array.from(this.shadowRoot.adoptedStyleSheets)
      );
      setStyles(this);
    });
    return r;
  };
})();
