# half-light
Small library for experimenting with ways to tame Shadow DOM in CSS.  See alternatively [shadow-boxing](https://github.com/bkardell/shadow-boxing).

Effectively this gives you the ability to write @ rules in your CSS which can apply into Shadow DOM like...

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

Enjoy.. or don't.  [Let me know either way with this emjoji sentiment poll, or a brief comment](https://github.com/bkardell/half-light/issues/1).

 
