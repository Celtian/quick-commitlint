import{An as wy,Bt as f,D as He,Dn as vn,E as HM,I as Mt,It as eK,K as Qf,Ln as yc,M as Lc,On as wG,S as Fl,Vn as zb,Wt as gn,dt as Xi,i as $i,k as Je,rn as nK,tn as mn,u as Cl,wn as v,z as Ne,zt as et}from"./chunk-BIvdSKmk.js";import{i}from"./main-NOPMBKID.js";var j=[`*`];var L=[[[``,`mat-card-avatar`,``],[``,`matCardAvatar`,``]],[[`mat-card-title`],[`mat-card-subtitle`],[``,`mat-card-title`,``],[``,`mat-card-subtitle`,``],[``,`matCardTitle`,``],[``,`matCardSubtitle`,``]],`*`];var z=[`[mat-card-avatar], [matCardAvatar]`,`mat-card-title, mat-card-subtitle,
      [mat-card-title], [mat-card-subtitle],
      [matCardTitle], [matCardSubtitle]`,`*`];var H=new v(`MAT_CARD_CONFIG`);var k=(()=>{class t{appearance;constructor(){let i=f(H,{optional:!0});this.appearance=i?.appearance||`raised`}static ɵfac=function(r){return new(r||t)};static ɵcmp=Je({type:t,selectors:[[`mat-card`]],hostAttrs:[1,`mat-mdc-card`,`mdc-card`],hostVars:8,hostBindings:function(r,d){r&2&&vn(`mat-mdc-card-outlined`,d.appearance===`outlined`)(`mdc-card--outlined`,d.appearance===`outlined`)(`mat-mdc-card-filled`,d.appearance===`filled`)(`mdc-card--filled`,d.appearance===`filled`)},inputs:{appearance:`appearance`},exportAs:[`matCard`],ngContentSelectors:j,decls:1,vars:0,template:function(r,d){r&1&&(Xi(),Mt(0))},styles:[`.mat-mdc-card {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  border-style: solid;
  border-width: 0;
  background-color: var(--%NS%mat-card-elevated-container-color, var(--%NS%mat-sys-surface-container-low));
  border-color: var(--%NS%mat-card-elevated-container-color, var(--%NS%mat-sys-surface-container-low));
  border-radius: var(--%NS%mat-card-elevated-container-shape, var(--%NS%mat-sys-corner-medium));
  box-shadow: var(--%NS%mat-card-elevated-container-elevation, var(--%NS%mat-sys-level1));
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
  border-radius: var(--%NS%mat-card-elevated-container-shape, var(--%NS%mat-sys-corner-medium));
}

.mat-mdc-card-outlined {
  background-color: var(--%NS%mat-card-outlined-container-color, var(--%NS%mat-sys-surface));
  border-radius: var(--%NS%mat-card-outlined-container-shape, var(--%NS%mat-sys-corner-medium));
  border-width: var(--%NS%mat-card-outlined-outline-width, 1px);
  border-color: var(--%NS%mat-card-outlined-outline-color, var(--%NS%mat-sys-outline-variant));
  box-shadow: var(--%NS%mat-card-outlined-container-elevation, var(--%NS%mat-sys-level0));
}
.mat-mdc-card-outlined::after {
  border: none;
}

.mat-mdc-card-filled {
  background-color: var(--%NS%mat-card-filled-container-color, var(--%NS%mat-sys-surface-container-highest));
  border-radius: var(--%NS%mat-card-filled-container-shape, var(--%NS%mat-sys-corner-medium));
  box-shadow: var(--%NS%mat-card-filled-container-elevation, var(--%NS%mat-sys-level0));
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
  font-family: var(--%NS%mat-card-title-text-font, var(--%NS%mat-sys-title-large-font));
  line-height: var(--%NS%mat-card-title-text-line-height, var(--%NS%mat-sys-title-large-line-height));
  font-size: var(--%NS%mat-card-title-text-size, var(--%NS%mat-sys-title-large-size));
  letter-spacing: var(--%NS%mat-card-title-text-tracking, var(--%NS%mat-sys-title-large-tracking));
  font-weight: var(--%NS%mat-card-title-text-weight, var(--%NS%mat-sys-title-large-weight));
}

.mat-mdc-card-subtitle {
  color: var(--%NS%mat-card-subtitle-text-color, var(--%NS%mat-sys-on-surface));
  font-family: var(--%NS%mat-card-subtitle-text-font, var(--%NS%mat-sys-title-medium-font));
  line-height: var(--%NS%mat-card-subtitle-text-line-height, var(--%NS%mat-sys-title-medium-line-height));
  font-size: var(--%NS%mat-card-subtitle-text-size, var(--%NS%mat-sys-title-medium-size));
  letter-spacing: var(--%NS%mat-card-subtitle-text-tracking, var(--%NS%mat-sys-title-medium-tracking));
  font-weight: var(--%NS%mat-card-subtitle-text-weight, var(--%NS%mat-sys-title-medium-weight));
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
`],encapsulation:2})}return t})();var O=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵdir=Ne({type:t,selectors:[[`mat-card-title`],[``,`mat-card-title`,``],[``,`matCardTitle`,``]],hostAttrs:[1,`mat-mdc-card-title`]})}return t})();var P=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵdir=Ne({type:t,selectors:[[`mat-card-content`]],hostAttrs:[1,`mat-mdc-card-content`]})}return t})();var I=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵcmp=Je({type:t,selectors:[[`mat-card-header`]],hostAttrs:[1,`mat-mdc-card-header`],ngContentSelectors:z,decls:4,vars:0,consts:[[1,`mat-mdc-card-header-text`]],template:function(r,d){r&1&&(Xi(L),Mt(0),mn(1,`div`,0),Mt(2,1),gn(),Mt(3,2))},encapsulation:2})}return t})();var E=(()=>{class t{static ɵfac=function(r){return new(r||t)};static ɵmod=et({type:t});static ɵinj=He({imports:[Fl]})}return t})();var A=class t{githubUrl=i;static ɵfac=function(i){return new(i||t)};static ɵcmp=Je({type:t,selectors:[[`app-home`]],decls:64,vars:1,consts:[[1,`home`,`mx-auto`,`w-full`,`max-w-6xl`,`px-4`,`py-8`,`sm:px-6`,`lg:px-8`],[`aria-labelledby`,`hero-title`,1,`hero`],[1,`eyebrow`],[`id`,`hero-title`,`tabindex`,`-1`],[1,`hero-copy`],[1,`hero-actions`],[`mat-flat-button`,``,`routerLink`,`/docs/getting-started`],[`mat-stroked-button`,``,3,`href`],[1,`terminal-demo`],[`ngSrc`,`assets/terminal-demo.gif`,`width`,`1200`,`height`,`720`,`priority`,``,`alt`,`Terminal session showing Quick Commitlint validating valid and invalid commit messages`],[`aria-labelledby`,`benefits-title`,1,`benefits`],[`id`,`benefits-title`],[1,`benefit-grid`],[`appearance`,`outlined`],[`aria-labelledby`,`install-title`,1,`install`],[`id`,`install-title`],[`aria-label`,`Installation commands`,1,`install-commands`],[`aria-labelledby`,`next-step-title`,1,`next-step`],[`id`,`next-step-title`],[`mat-flat-button`,``,`routerLink`,`/docs/usage`]],template:function(i,r){i&1&&(yc(0,`div`,0)(1,`section`,1)(2,`p`,2),HM(3,`Native Conventional Commit linting`),Qf(),yc(4,`h1`,3),HM(5,`Commit message checks at native speed.`),Qf(),yc(6,`p`,4),HM(7,` Quick Commitlint is a strict native linter built with Zig. It understands familiar commitlint-style presets and rule tuples across macOS, Linux, and Windows. `),Qf(),yc(8,`div`,5)(9,`a`,6),HM(10,`Get started`),Qf(),yc(11,`a`,7),HM(12,`View on GitHub`),Qf()()(),yc(13,`figure`,8),Lc(14,`img`,9),yc(15,`figcaption`),HM(16,`Clear diagnostics, predictable exit codes, and elapsed lint time.`),Qf()(),yc(17,`section`,10)(18,`h2`,11),HM(19,`Small tool, focused job`),Qf(),yc(20,`div`,12)(21,`mat-card`,13)(22,`mat-card-header`)(23,`mat-card-title`),HM(24,`Fast native executable`),Qf()(),yc(25,`mat-card-content`),HM(26,` A thin platform launcher hands linting to a bundled Zig executable and reports elapsed lint time with every result. `),Qf()(),yc(27,`mat-card`,13)(28,`mat-card-header`)(29,`mat-card-title`),HM(30,`Zero package dependencies`),Qf()(),yc(31,`mat-card-content`),HM(32,` The npm package includes all supported native executables without installing additional runtime packages. `),Qf()(),yc(33,`mat-card`,13)(34,`mat-card-header`)(35,`mat-card-title`),HM(36,`Familiar and strict`),Qf()(),yc(37,`mat-card-content`),HM(38,` Use conventional or Angular presets with commitlint-style tuples and strict JSON configuration. `),Qf()()()(),yc(39,`section`,14)(40,`div`)(41,`p`,2),HM(42,`Ready in one command`),Qf(),yc(43,`h2`,15),HM(44,`Install as a development tool`),Qf(),yc(45,`p`),HM(46,`Supports macOS arm64/x64, Linux arm64/x64, and Windows x64.`),Qf()(),yc(47,`div`,16)(48,`pre`)(49,`code`),HM(50,`npm install quick-commitlint --save-dev`),Qf()(),yc(51,`pre`)(52,`code`),HM(53,`pnpm add -D quick-commitlint`),Qf()(),yc(54,`pre`)(55,`code`),HM(56,`bun add --dev quick-commitlint`),Qf()()()(),yc(57,`section`,17)(58,`h2`,18),HM(59,`Bring it into your commit workflow`),Qf(),yc(60,`p`),HM(61,`Learn how to lint files, standard input, and Git commit hooks.`),Qf(),yc(62,`a`,19),HM(63,`Read the usage guide`),Qf()()()),i&2&&($i(11),zb(`href`,r.githubUrl,wy))},dependencies:[nK,eK,E,k,P,I,O,wG,Cl],styles:[`[_nghost-%COMP%]{display:block;width:100%}.home[_ngcontent-%COMP%]{display:grid;gap:clamp(3rem,8vw,6rem)}.hero[_ngcontent-%COMP%]{margin-inline:auto;max-width:54rem;padding-block-start:clamp(2rem,7vw,6rem);text-align:center}.eyebrow[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-primary);font:var(--%NS%mat-sys-label-large);letter-spacing:.08em;text-transform:uppercase}h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-display-medium);letter-spacing:-.04em;margin:.75rem 0 1rem;outline:none}.hero-copy[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-large);margin:0 auto;max-width:44rem}.hero-actions[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:center;margin-block-start:2rem}.terminal-demo[_ngcontent-%COMP%]{margin:0;text-align:center}.terminal-demo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border:1px solid var(--%NS%mat-sys-outline-variant);border-radius:1rem;box-shadow:var(--%NS%mat-sys-level3);height:auto;max-width:100%}figcaption[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);font:var(--%NS%mat-sys-body-small);margin-block-start:.75rem}.benefits[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .next-step[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], .install[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-headline-medium);margin-block:0 1.5rem}.benefit-grid[_ngcontent-%COMP%]{display:grid;gap:1rem;grid-template-columns:repeat(3,minmax(0,1fr))}mat-card[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-surface-container-low)}mat-card-content[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);padding-block-start:1rem}.install[_ngcontent-%COMP%]{align-items:center;background:var(--%NS%mat-sys-surface-container);border-radius:1rem;display:grid;gap:2rem;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);padding:clamp(1.5rem,5vw,3rem)}.install[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant)}.install-commands[_ngcontent-%COMP%]{display:grid;gap:.75rem;min-width:0}pre[_ngcontent-%COMP%]{background:var(--%NS%mat-sys-inverse-surface);border-radius:.5rem;color:var(--%NS%mat-sys-inverse-on-surface);margin:0;overflow-x:auto;padding:1rem}.next-step[_ngcontent-%COMP%]{padding-block-end:clamp(2rem,6vw,5rem);text-align:center}.next-step[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{color:var(--%NS%mat-sys-on-surface-variant);margin-block-end:1.5rem}@media(max-width:50rem){.benefit-grid[_ngcontent-%COMP%], .install[_ngcontent-%COMP%]{grid-template-columns:1fr}h1[_ngcontent-%COMP%]{font:var(--%NS%mat-sys-display-small)}}`]})};export{A as Home};