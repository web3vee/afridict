import{o as e}from"./chunk-Dlc7tRH4.js";import{Sl as t,_i as n,bl as r}from"./index-abQhidwz.js";import{t as i}from"./check-wHPOGYsM.js";import{t as a}from"./copy-BEd6A0EJ.js";var o=r(),s=e(t(),1),c=n.button`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`,l=n.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--privy-color-foreground-2);
`,u=n(i)`
  color: var(--privy-color-icon-success);
  flex-shrink: 0;
`,d=n(a)`
  color: var(--privy-color-icon-muted);
  flex-shrink: 0;
`;function f({children:e,iconOnly:t,value:n,hideCopyIcon:r,...i}){let[a,f]=(0,s.useState)(!1);return(0,o.jsxs)(c,{...i,onClick:()=>{navigator.clipboard.writeText(n||(typeof e==`string`?e:``)).catch(console.error),f(!0),setTimeout((()=>f(!1)),1500)},children:[e,` `,a?(0,o.jsxs)(l,{children:[(0,o.jsx)(u,{}),` `,!t&&`Copied`]}):!r&&(0,o.jsx)(d,{})]})}var p=({value:e,includeChildren:t,children:n,...r})=>{let[i,a]=(0,s.useState)(!1),f=()=>{navigator.clipboard.writeText(e).catch(console.error),a(!0),setTimeout((()=>a(!1)),1500)};return(0,o.jsxs)(o.Fragment,{children:[t?(0,o.jsx)(c,{...r,onClick:f,children:n}):(0,o.jsx)(o.Fragment,{children:n}),(0,o.jsx)(c,{...r,onClick:f,children:i?(0,o.jsx)(l,{children:(0,o.jsx)(u,{})}):(0,o.jsx)(d,{})})]})};export{p as n,f as t};