import{o as e}from"./chunk-Dlc7tRH4.js";import{Sl as t,_i as n,bl as r}from"./index-abQhidwz.js";import{t as i}from"./createLucideIcon-DyOiDk8U.js";import{t as a}from"./check-wHPOGYsM.js";var o=i(`x`,[[`path`,{d:`M18 6 6 18`,key:`1bl5f8`}],[`path`,{d:`m6 6 12 12`,key:`d8bk6v`}]]),s=r(),c=e(t(),1),l=n.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 10px; /* 10px gap between items */
  padding-left: 8px; /* 8px indentation container */
`;n.div`
  &&& {
    margin-left: 6px; /* Center the line under the checkbox (12px/2) */
    border-left: 2px solid var(--privy-color-foreground-4);
    height: 10px; /* 10px H padding between paragraphs */
    margin-top: 0;
    margin-bottom: 0;
  }
`;var u=({children:e,variant:t=`default`,icon:n})=>{let r=()=>{switch(t){case`success`:return`var(--privy-color-icon-success)`;case`error`:return`var(--privy-color-icon-error)`;default:return`var(--privy-color-icon-muted)`}};return(0,s.jsxs)(f,{children:[(0,s.jsx)(d,{$variant:t,"data-variant":t,children:(()=>{if(n)return c.isValidElement(n)?c.cloneElement(n,{stroke:r(),strokeWidth:2}):n;switch(t){case`success`:default:return(0,s.jsx)(a,{size:12,stroke:r(),strokeWidth:3});case`error`:return(0,s.jsx)(o,{size:12,stroke:r(),strokeWidth:3})}})()}),e]})},d=n.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({$variant:e})=>{switch(e){case`success`:return`var(--privy-color-success-bg, #EAFCEF)`;case`error`:return`var(--privy-color-error-bg, #FEE2E2)`;default:return`var(--privy-color-background-2)`}}};
  flex-shrink: 0;
`,f=n.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start; /* Align all elements to the top */
  text-align: left;
  gap: 8px;

  && {
    a {
      color: var(--privy-color-accent);
    }
  }
`;export{u as n,l as t};