import{b as k}from"./chunk-RICWY6OP.js";import{$ as v,Da as C,Fa as n,Kb as D,Mb as _,Ob as S,R as u,Sa as M,T as f,_ as c,aa as o,cb as w,ka as h,la as e,ma as a,na as y,oa as b,pa as x,u as s,v as g,va as l,w as p,wa as m}from"./chunk-AL35JG64.js";import"./chunk-7CGTOI24.js";var z=["*"];var L=[[["","mat-card-avatar",""],["","matCardAvatar",""]],[["mat-card-title"],["mat-card-subtitle"],["","mat-card-title",""],["","mat-card-subtitle",""],["","matCardTitle",""],["","matCardSubtitle",""]],"*"],H=["[mat-card-avatar], [matCardAvatar]",`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,"*"],N=new g("MAT_CARD_CONFIG"),O=(()=>{class t{appearance;constructor(){let i=p(N,{optional:!0});this.appearance=i?.appearance||"raised"}static \u0275fac=function(r){return new(r||t)};static \u0275cmp=c({type:t,selectors:[["mat-card"]],hostAttrs:[1,"mat-mdc-card","mdc-card"],hostVars:8,hostBindings:function(r,d){r&2&&C("mat-mdc-card-outlined",d.appearance==="outlined")("mdc-card--outlined",d.appearance==="outlined")("mat-mdc-card-filled",d.appearance==="filled")("mdc-card--filled",d.appearance==="filled")},inputs:{appearance:"appearance"},exportAs:["matCard"],ngContentSelectors:z,decls:1,vars:0,template:function(r,d){r&1&&(l(),m(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-color: var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-elevated-container-elevation, var(--mat-sys-level1));
}
.mat-mdc-card::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: solid 1px transparent;
  content: "";
  display: block;
  pointer-events: none;
  box-sizing: border-box;
  border-radius: var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--mat-card-outlined-container-color, var(--mat-sys-surface));
  border-radius: var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));
  border-width: var(--mat-card-outlined-outline-width, 1px);
  border-color: var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));
  box-shadow: var(--mat-card-outlined-container-elevation, var(--mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));
  border-radius: var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));
  box-shadow: var(--mat-card-filled-container-elevation, var(--mat-sys-level0));
}

.mdc-card__media {
  position: relative;
  box-sizing: border-box;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.mdc-card__media::before {
  display: block;
  content: "";
}
.mdc-card__media:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.mdc-card__media:last-child {
  border-bottom-left-radius: inherit;
  border-bottom-right-radius: inherit;
}

.mat-mdc-card-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  min-height: 52px;
  padding: 8px;
}

.mat-mdc-card-title {
  font-family: var(--mat-card-title-text-font, var(--mat-sys-title-large-font));
  line-height: var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-size: var(--mat-card-title-text-size, var(--mat-sys-title-large-size));
  letter-spacing: var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));
  font-weight: var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));
  line-height: var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));
  font-size: var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));
  letter-spacing: var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));
  font-weight: var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight));
}

.mat-mdc-card-title,
.mat-mdc-card-subtitle {
  display: block;
  margin: 0;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle {
  padding: 16px 16px 0;
}

.mat-mdc-card-header {
  display: flex;
  padding: 16px 16px 0;
}

.mat-mdc-card-content {
  display: block;
  padding: 0 16px;
}
.mat-mdc-card-content:first-child {
  padding-top: 16px;
}
.mat-mdc-card-content:last-child {
  padding-bottom: 16px;
}

.mat-mdc-card-title-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.mat-mdc-card-avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  margin-bottom: 16px;
  object-fit: cover;
}
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-avatar ~ .mat-mdc-card-header-text .mat-mdc-card-title {
  line-height: normal;
}

.mat-mdc-card-sm-image {
  width: 80px;
  height: 80px;
}

.mat-mdc-card-md-image {
  width: 112px;
  height: 112px;
}

.mat-mdc-card-lg-image {
  width: 152px;
  height: 152px;
}

.mat-mdc-card-xl-image {
  width: 240px;
  height: 240px;
}

.mat-mdc-card-subtitle ~ .mat-mdc-card-title,
.mat-mdc-card-title ~ .mat-mdc-card-subtitle,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,
.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,
.mat-mdc-card-title-group .mat-mdc-card-title,
.mat-mdc-card-title-group .mat-mdc-card-subtitle {
  padding-top: 0;
}

.mat-mdc-card-content > :last-child:not(.mat-mdc-card-footer) {
  margin-bottom: 0;
}

.mat-mdc-card-actions-align-end {
  justify-content: flex-end;
}
`],encapsulation:2})}return t})(),P=(()=>{class t{static \u0275fac=function(r){return new(r||t)};static \u0275dir=o({type:t,selectors:[["mat-card-title"],["","mat-card-title",""],["","matCardTitle",""]],hostAttrs:[1,"mat-mdc-card-title"]})}return t})();var I=(()=>{class t{static \u0275fac=function(r){return new(r||t)};static \u0275dir=o({type:t,selectors:[["mat-card-content"]],hostAttrs:[1,"mat-mdc-card-content"]})}return t})();var E=(()=>{class t{static \u0275fac=function(r){return new(r||t)};static \u0275cmp=c({type:t,selectors:[["mat-card-header"]],hostAttrs:[1,"mat-mdc-card-header"],ngContentSelectors:H,decls:4,vars:0,consts:[[1,"mat-mdc-card-header-text"]],template:function(r,d){r&1&&(l(L),m(0),b(1,"div",0),m(2,1),x(),m(3,2))},encapsulation:2})}return t})();var A=(()=>{class t{static \u0275fac=function(r){return new(r||t)};static \u0275mod=v({type:t});static \u0275inj=s({imports:[D]})}return t})();var F=class t{githubUrl=k;static \u0275fac=function(i){return new(i||t)};static \u0275cmp=c({type:t,selectors:[["app-home"]],decls:61,vars:1,consts:[[1,"home","mx-auto","w-full","max-w-6xl","px-4","py-8","sm:px-6","lg:px-8"],["aria-labelledby","hero-title",1,"hero"],[1,"eyebrow"],["id","hero-title","tabindex","-1"],[1,"hero-copy"],[1,"hero-actions"],["mat-flat-button","","routerLink","/docs/getting-started"],["mat-stroked-button","",3,"href"],[1,"terminal-demo"],["ngSrc","assets/terminal-demo.gif","width","1200","height","720","priority","","alt","Terminal session showing Quick Commitlint validating valid and invalid commit messages"],["aria-labelledby","benefits-title",1,"benefits"],["id","benefits-title"],[1,"benefit-grid"],["appearance","outlined"],["aria-labelledby","install-title",1,"install"],["id","install-title"],["aria-label","Installation commands",1,"install-commands"],["aria-labelledby","next-step-title",1,"next-step"],["id","next-step-title"],["mat-flat-button","","routerLink","/docs/usage"]],template:function(i,r){i&1&&(e(0,"div",0)(1,"section",1)(2,"p",2),n(3,"Native Conventional Commit linting"),a(),e(4,"h1",3),n(5,"Commit message checks at native speed."),a(),e(6,"p",4),n(7," Quick Commitlint is a strict, dependency-free linter built with Zig. It starts in about a millisecond and understands familiar commitlint-style presets and rule tuples. "),a(),e(8,"div",5)(9,"a",6),n(10,"Get started"),a(),e(11,"a",7),n(12,"View on GitHub"),a()()(),e(13,"figure",8),y(14,"img",9),e(15,"figcaption"),n(16,"Clear diagnostics, predictable exit codes, and elapsed lint time."),a()(),e(17,"section",10)(18,"h2",11),n(19,"Small tool, focused job"),a(),e(20,"div",12)(21,"mat-card",13)(22,"mat-card-header")(23,"mat-card-title"),n(24,"Fast native executable"),a()(),e(25,"mat-card-content"),n(26," Starts without loading a JavaScript runtime and reports elapsed lint time with every result. "),a()(),e(27,"mat-card",13)(28,"mat-card-header")(29,"mat-card-title"),n(30,"Zero runtime dependencies"),a()(),e(31,"mat-card-content"),n(32," npm distributes a standalone Zig binary. Node and Yarn are only used for delivery and development. "),a()(),e(33,"mat-card",13)(34,"mat-card-header")(35,"mat-card-title"),n(36,"Familiar and strict"),a()(),e(37,"mat-card-content"),n(38," Use conventional or Angular presets with commitlint-style tuples and strict JSON configuration. "),a()()()(),e(39,"section",14)(40,"div")(41,"p",2),n(42,"Ready in one command"),a(),e(43,"h2",15),n(44,"Install as a development tool"),a(),e(45,"p"),n(46,"The current package targets Linux x86-64."),a()(),e(47,"div",16)(48,"pre")(49,"code"),n(50,"npm install quick-commitlint --save-dev"),a()(),e(51,"pre")(52,"code"),n(53,"yarn add quick-commitlint --dev"),a()()()(),e(54,"section",17)(55,"h2",18),n(56,"Bring it into your commit workflow"),a(),e(57,"p"),n(58,"Learn how to lint files, standard input, and Git commit hooks."),a(),e(59,"a",19),n(60,"Read the usage guide"),a()()()),i&2&&(f(11),h("href",r.githubUrl,u))},dependencies:[S,_,A,O,I,E,P,M,w],styles:["[_nghost-%COMP%]{display:block;width:100%}.home[_ngcontent-%COMP%]{display:grid;gap:clamp(3rem,8vw,6rem)}.hero[_ngcontent-%COMP%]{margin-inline:auto;max-width:54rem;padding-block-start:clamp(2rem,7vw,6rem);text-align:center}.eyebrow[_ngcontent-%COMP%]{color:var(--mat-sys-primary);font:var(--mat-sys-label-large);letter-spacing:.08em;text-transform:uppercase}h1[_ngcontent-%COMP%]{font:var(--mat-sys-display-medium);letter-spacing:-.04em;margin:.75rem 0 1rem;outline:none}.hero-copy[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant);font:var(--mat-sys-body-large);margin:0 auto;max-width:44rem}.hero-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-block-start:2rem}.terminal-demo[_ngcontent-%COMP%]{margin:0;text-align:center}.terminal-demo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border:1px solid var(--mat-sys-outline-variant);border-radius:1rem;box-shadow:var(--mat-sys-level3);height:auto;max-width:100%}figcaption[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant);font:var(--mat-sys-body-small);margin-block-start:.75rem}.benefits[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .next-step[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .install[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font:var(--mat-sys-headline-medium);margin-block:0 1.5rem}.benefit-grid[_ngcontent-%COMP%]{display:grid;gap:1rem;grid-template-columns:repeat(3,minmax(0,1fr))}mat-card[_ngcontent-%COMP%]{background:var(--mat-sys-surface-container-low)}mat-card-content[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant);padding-block-start:1rem}.install[_ngcontent-%COMP%]{align-items:center;background:var(--mat-sys-surface-container);border-radius:1rem;display:grid;gap:2rem;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);padding:clamp(1.5rem,5vw,3rem)}.install[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant)}.install-commands[_ngcontent-%COMP%]{display:grid;gap:.75rem;min-width:0}pre[_ngcontent-%COMP%]{background:var(--mat-sys-inverse-surface);border-radius:.5rem;color:var(--mat-sys-inverse-on-surface);margin:0;overflow-x:auto;padding:1rem}.next-step[_ngcontent-%COMP%]{padding-block-end:clamp(2rem,6vw,5rem);text-align:center}.next-step[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--mat-sys-on-surface-variant);margin-block-end:1.5rem}@media(max-width:50rem){.benefit-grid[_ngcontent-%COMP%], .install[_ngcontent-%COMP%]{grid-template-columns:1fr}h1[_ngcontent-%COMP%]{font:var(--mat-sys-display-small)}}"]})};export{F as Home};
