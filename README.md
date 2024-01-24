# half-light
Small library for experimenting with ways to tame Shadow DOM in CSS.  See alternatively [shadow-boxing](https://github.com/bkardell/shadow-boxing).

Effectively this gives you the ability to write @ rules in your CSS which can apply into Shadow DOM like...

```html
 <head>
  <!-- styles should be in the head, style or link is OK -->
 <style>
  @layer --crossroot {
     /* These styles will affect your page and "all shadow roots" (see section below) */
  }
  
  @media --crossroot {
     /* These styles will affect only shadow roots, not your page */
  }
  
  @media --crossroot(x-foo, y-bar) {
     /* These styles will affect only shadow roots of x-foo or y-bar elements, not your page */
  }
 </style>
 <!-- include the library, and that's it... -->
 <script src="half-light.js"></script>
```

Enjoy.. or don't.  [Let me know either way](https://github.com/bkardell/half-light).

## "all shadow roots"
`@layer` rule allows a filter like the @media rule too, it's just unusual because there's no convenient way to do that in CSS.

So, what "all shadow roots" means is really "by default", and you can change that by setting a custom property on the `html` element like this:
```
html {
	--global-crossroot-layer-filter: x-foo, y-bar;
}
```

That will make your `@layer --crossroot` rules apply to the page itself and the shadow roots of `x-foo` of `y-bar` elements, but not others. 
The value can be any selector really, so `:not(x-foo)` should work too.
 
