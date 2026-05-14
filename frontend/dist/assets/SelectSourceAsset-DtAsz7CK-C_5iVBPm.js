import{o as e}from"./chunk-Dlc7tRH4.js";import{Di as t,Sl as n,_i as r,bl as i,z as a}from"./index-abQhidwz.js";import{t as o}from"./createLucideIcon-DyOiDk8U.js";import{t as s}from"./ScreenLayout-DGbEZh8t-tNDY_0fl.js";var c=o(`chevron-down`,[[`path`,{d:`m6 9 6 6 6-6`,key:`qrunsl`}]]),l=i(),u=e(n(),1),d=async({operation:e,until:n,delay:r,interval:i,attempts:a,signal:o})=>{let s,c,l=0;for(;l<a;){if(o?.aborted)return{status:`aborted`,result:s,attempts:l,error:c};l++;try{if(c=void 0,s=await e(),n(s))return{status:`success`,result:s,attempts:l};l<a&&await t(i)}catch(e){e instanceof Error&&(c=e),l<a&&await t(i)}}return{status:`max_attempts`,result:s,attempts:l,error:c}},f=({currency:e=`usd`,value:t,onChange:n,inputMode:r=`decimal`,autoFocus:i})=>{let[o,s]=(0,u.useState)(`0`),c=(0,u.useRef)(null),d=t??o,f=a[e]?.symbol??`$`,p=(0,u.useCallback)((e=>{let t=e.target.value,r=(t=t.replace(/[^\d.]/g,``)).split(`.`);r.length>2&&(t=r[0]+`.`+r.slice(1).join(``)),r.length===2&&r[1].length>2&&(t=`${r[0]}.${r[1].slice(0,2)}`),t.length>1&&t[0]===`0`&&t[1]!==`.`&&(t=t.slice(1)),(t===``||t===`.`)&&(t=`0`),n?n(t):s(t)}),[n]),g=(0,u.useCallback)((e=>{!([`Delete`,`Backspace`,`Tab`,`Escape`,`Enter`,`.`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`,`Home`,`End`].includes(e.key)||(e.ctrlKey||e.metaKey)&&[`a`,`c`,`v`,`x`].includes(e.key.toLowerCase()))&&(e.key>=`0`&&e.key<=`9`||e.preventDefault())}),[]),_=(0,u.useMemo)((()=>(d.includes(`.`),d)),[d]);return(0,l.jsxs)(m,{onClick:()=>c.current?.focus(),children:[(0,l.jsx)(h,{children:f}),_,(0,l.jsx)(`input`,{ref:c,type:`text`,inputMode:r,value:_,onChange:p,onKeyDown:g,autoFocus:i,placeholder:`0`,style:{width:1,height:`1rem`,opacity:0,alignSelf:`center`,fontSize:`1rem`}}),(0,l.jsx)(h,{style:{opacity:0},children:f})]})},p=({selectedAsset:e,onEditSourceAsset:t})=>{let{icon:n}=a[e];return(0,l.jsxs)(g,{onClick:t,children:[(0,l.jsx)(_,{children:n}),(0,l.jsx)(v,{children:e.toLocaleUpperCase()}),(0,l.jsx)(y,{children:(0,l.jsx)(c,{})})]})},m=r.span`
  background-color: var(--privy-color-background);
  width: 100%;
  text-align: center;
  border: none;
  font-kerning: none;
  font-feature-settings: 'calt' off;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  cursor: pointer;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  && {
    color: var(--privy-color-foreground);
    font-size: 3.75rem;
    font-style: normal;
    font-weight: 600;
    line-height: 5.375rem;
  }
`,h=r.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.5rem;
  margin-top: 0.75rem;
`,g=r.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: auto;
  gap: 0.5rem;
  border: 1px solid var(--privy-color-border-default);
  border-radius: var(--privy-border-radius-full);

  && {
    margin: auto;
    padding: 0.5rem 1rem;
  }
`,_=r.div`
  svg {
    width: 1rem;
    height: 1rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
  }
`,v=r.span`
  color: var(--privy-color-foreground);
  font-kerning: none;
  font-feature-settings: 'calt' off;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
`,y=r.div`
  color: var(--privy-color-foreground);

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`,b=({opts:e,isLoading:t,onSelectSource:n})=>(0,l.jsx)(s,{showClose:!1,showBack:!0,onBack:()=>n(e.source.selectedAsset),title:`Select currency`,children:(0,l.jsx)(x,{children:e.source.assets.map((e=>{let{icon:r,name:i}=a[e];return(0,l.jsx)(S,{onClick:()=>n(e),disabled:t,children:(0,l.jsxs)(C,{children:[(0,l.jsx)(w,{children:r}),(0,l.jsxs)(T,{children:[(0,l.jsx)(E,{children:i}),(0,l.jsx)(D,{children:e.toLocaleUpperCase()})]})]})},e)}))})}),x=r.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`,S=r.button`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-mdlg);
  border-style: solid;
  display: flex;

  && {
    padding: 0.75rem 1rem;
  }
`,C=r.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`,w=r.div`
  svg {
    width: 2.25rem;
    height: 2.25rem;
    border-radius: var(--privy-border-radius-full);
    overflow: hidden;
  }
`,T=r.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
`,E=r.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
`,D=r.span`
  color: var(--privy-color-foreground-3);
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.125rem;
`;export{d as i,f as n,p as r,b as t};