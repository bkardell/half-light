(function () {
  let targetedStyles;
  const openStylableElements = new Set();
  const elementsToAnchors = new WeakMap();

  function stringifyStyleSheet(stylesheet) {
    return Array.from(stylesheet.cssRules)
      .map((rule) => rule.cssText || "")
      .join("\n");
  }

  function refreshTargetedStyles() {
    targetedStyles = [];

    [...document.styleSheets].forEach((sheet) => {
      if (!sheet.ownerNode.matches("head > *")) return;

      [...sheet.cssRules].forEach((rule) => {
        console.log(rule, rule.type);
        let name = rule.constructor.name;
        let cond = rule.conditionText || "";
        let globalIntent = cond.startsWith("screen and");
        let f = cond.match(/(?:--crossroot\({0,1})([^\)]*)/);

        if (name === "CSSMediaRule" && (cond === "--crossroot" || f)) {
          [...rule.cssRules].forEach((innerRule) => {
            let where = f && f.length == 2 && f[1] ? f[1] : "*";
            targetedStyles[where] = targetedStyles[where] || [];
            targetedStyles[where].push(innerRule.cssText);
          });
        }
      });
    });
  }

  function toStyleElement(str) {
    let style = document.createElement("style");
    style.innerHTML = str;
    return style;
  }

  // Use empty text nodes to know the start and end anchors of where we should insert cloned styles
  function getAnchors(element) {
    let anchors = elementsToAnchors.get(element);
    if (!anchors) {
      anchors = [document.createTextNode(""), document.createTextNode("")];
      elementsToAnchors.set(element, anchors);
      element.shadowRoot.prepend(...anchors);
    }
    return anchors;
  }

  function clearStyles(element) {
    const [startAnchor, endAnchor] = getAnchors(element);
    let nextSibling;
    while ((nextSibling = startAnchor.nextSibling) !== endAnchor) {
      nextSibling.remove();
    }
  }

  function maybeSetStyles(element) {
    setStyles(element);
  }

  function setStyles(element) {
    const [, endAnchor] = getAnchors(element);
    for (let selector in targetedStyles) {
      if (element.matches(selector)) {
        let style = toStyleElement(targetedStyles[selector].join("\n"));
        console.log(element, style);
        element.shadowRoot.insertBefore(style, endAnchor);
      }
    }
  }

  const observer = new MutationObserver(() => {
    refreshTargetedStyles();
    for (const element of openStylableElements) {
      clearStyles(element);
      setStyles(element);
    }
  });

  observer.observe(document.head, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
  });

  refreshTargetedStyles();

  let old = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function () {
    let r = old.call(this, ...arguments);
    openStylableElements.add(this);
    Promise.resolve().then(() => setStyles(this));
    return r;
  };
})();
