# half-light
Small library for experimenting with ways to tame Shadow DOM in CSS.  See alternatively [shadow-boxing](https://github.com/bkardell/shadow-boxing).
Here's [a codepen if you'd prefer to see/play with it live](https://codepen.io/briankardell/pen/LYazzmL)

Effectively this gives you the ability to use Media Queries to provide rules in your main page's CSS which can apply into Shadow DOM.  You can do this in CSS itself, or in `<link>` and `<style>` via the `media=` attribute. 

## In CSS itself...
```html
<head>
  <!-- styles should be in the head, style or link is OK -->
  <style>
	/* Applies to your page (obviously) */
	body {background-color: peachpuff; }
	p { background-color: orange; }
	
	
	/* Applies to your page *and all shadow roots* */
	@media screen, (--crossroot) {
		h1 {
			background-color: hotpink;
			color: white;
		}
	}
	
	/* You can also add a filter in parens
	   @media screen, (--crossroot(selector)) {...}
	
	   And these rules will only apply to the shadow dom
	   of elements which match that selector...
	
	   for example...
	*/
	@media screen, (--crossroot(hell-o)) {
	  h1 {
	    font-style: italic;
	  }
	}
	
	/* Or, if you prefer */
	@media screen, (--crossroot(:not(hell-o))) {
	  h2 {
	    font-size: 1rem;
	    font-weight: bold;
	    background-color: cornsilk;
	  }
	}
	
	
	/* Finally... you can do the same _without_
	   having it affect your page too! That is, if you 
	   want rules that _only_ apply in shadow doms, you
	   just leave off the "screen, "....*/
	@media --crossroot(hell-o, buh-bye) {
	  h1 {
	    border: medium solid limegreen;
	  }
	}
  </style>
  <!-- include the library, and that's it... -->
  <script src="half-light.js"></script>
```

## Via `<link media="">` or `<style media="">`
You can write any of the variants above, but at the stylesheet level upon including it. This allows for authors to specify, for example, that Bootstrap should be adopted by all (or some of) the shadow roots.

Examples..

```
<link rel="stylesheet" href="../prism.css" media="screen, --crossroot"></link>

<!-- or to target shadows of specific elements, add a selector... -->

<link rel="stylesheet" href="../prism.css" media="screen, (--crossroot x-foo)">&lt;/link>
```

## Component authoring, `adoptedStyleSheets` and `@layers`
Functionally, the rules that the page injects are in a named layer (`shadow-defaults`), meaning that their specificity isn't really relevant and rules in the component's shadow dom (from `<style>`, `<link>` or `.adoptedStyleSheets`) will automatically win.  However it also means that component authors can begin their styles providing a series of named layers and sandwiching in the `shadow-defaults` layer wherever they prefer, in order to give them even finer grained control. The nice thing about this is that they can list `shadow-defaults` where they'd like it to go, and if no one uses `shadow-defaults`, it just has no effect.  It's potentially a 'softer' way to collaborate.

## Feedback
Enjoy.. or don't.  [Let me know either way with this emjoji sentiment poll, or a brief comment](https://github.com/bkardell/half-light/issues/1).

 
