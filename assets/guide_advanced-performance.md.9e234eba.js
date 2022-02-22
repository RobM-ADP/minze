import{_ as n,c as s,o as a,a as t}from"./app.352b9372.js";const g='{"title":"Performance","description":"","frontmatter":{},"headers":[{"level":2,"title":"Reactivity","slug":"reactivity"}],"relativePath":"guide/advanced-performance.md"}',p={},e=t(`<h1 id="performance" tabindex="-1">Performance <a class="header-anchor" href="#performance" aria-hidden="true">#</a></h1><h2 id="reactivity" tabindex="-1">Reactivity <a class="header-anchor" href="#reactivity" aria-hidden="true">#</a></h2><p>If you want to create performant web components, you have to use reactivity selectively. It doesn&#39;t mean you should ditch it altogether, instead, it&#39;s good to know when to use it and when not.</p><p>Consider the following example:</p><div class="language-js"><pre><code><span class="token keyword">import</span> Minze<span class="token punctuation">,</span> <span class="token punctuation">{</span> MinzeElement <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;minze&#39;</span>

<span class="token keyword">const</span> nestedArray <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  nestedArray<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> num<span class="token operator">:</span> i <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">MyElement</span> <span class="token keyword">extends</span> <span class="token class-name">MinzeElement</span> <span class="token punctuation">{</span>
  reactive <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">[</span><span class="token string">&#39;nestedArray&#39;</span><span class="token punctuation">,</span> nestedArray<span class="token punctuation">]</span><span class="token punctuation">]</span>

  <span class="token function-variable function">html</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>nestedArray<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>num<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
  </span><span class="token template-punctuation string">\`</span></span>

  <span class="token function">onReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>nestedArray<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>num <span class="token operator">=</span> i
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

Minze<span class="token punctuation">.</span><span class="token function">defineAll</span><span class="token punctuation">(</span><span class="token punctuation">[</span>MyElement<span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre></div><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><p><strong>What&#39;s happening here?</strong></p><p>We created a huge array of objects and made it deeply reactive. Then we created a loop in the <code>onReady</code> hook and reassigned one of the object&#39;s properties a bunch of times. Finally, we are rendering a template that displays the reassigned value. This seems simple but there&#39;s a lot going on under the hood:</p><ol><li>Minze had to iterate over every property inside the <code>nestedArray</code> and make them all reactive. That happened <code>100</code> times for each used element. Since <code>my-element</code> was used 5 times the total is <code>500</code>.</li><li>The template has been rerendered <code>100</code> times because it includes a reactive property. Again since <code>my-element</code> was used 5 times the total is <code>500</code>.</li></ol><p>In total, our elements performed about <code>1000</code> steps that are not necessary for the end result.</p><p><strong>A much better approach</strong></p><div class="language-js"><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlighted">\xA0</div><br><br><br><br><br><br><br><br><br><br><div class="highlighted">\xA0</div><br><br><br><br><br></div><pre><code><span class="token keyword">import</span> Minze<span class="token punctuation">,</span> <span class="token punctuation">{</span> MinzeElement <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;minze&#39;</span>

<span class="token keyword">const</span> nestedArray <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>

<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  nestedArray<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token punctuation">{</span> num<span class="token operator">:</span> i <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">MyElement</span> <span class="token keyword">extends</span> <span class="token class-name">MinzeElement</span> <span class="token punctuation">{</span>
  nestedArray <span class="token operator">=</span> nestedArray

  <span class="token function-variable function">html</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
    </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span><span class="token keyword">this</span><span class="token punctuation">.</span>nestedArray<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>num<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
  </span><span class="token template-punctuation string">\`</span></span>

  <span class="token function">onReady</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>nestedArray<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>num <span class="token operator">=</span> i
    <span class="token punctuation">}</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">rerender</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

Minze<span class="token punctuation">.</span><span class="token function">defineAll</span><span class="token punctuation">(</span><span class="token punctuation">[</span>MyElement<span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre></div><div class="language-html"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>my-element</span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>my-element</span><span class="token punctuation">&gt;</span></span>
</code></pre></div><p>Here we are not defining any reactive properties at all and instead, we are <code>rerendering</code> the component manually once our reassignment loop inside the <code>onReady</code> hook is done.</p><p>Using this approach our total count for all under the hood steps is <code>10</code> for all 5 elements together. Each component is initially rendered <code>1</code> time and at the end, it&#39;s rerendered again.</p><p>This can be further optimized by using the <code>onStart</code> hook instead of the <code>onReady</code> hook, which is executed before the first render.</p>`,16),o=[e];function c(l,u,i,k,r,d){return a(),s("div",null,o)}var h=n(p,[["render",c]]);export{g as __pageData,h as default};
