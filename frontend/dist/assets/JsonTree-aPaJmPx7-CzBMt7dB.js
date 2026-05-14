import{_i as e,bl as t}from"./index-abQhidwz.js";var n=t(),r=({data:e})=>{let t=e=>typeof e==`object`&&e?(0,n.jsx)(a,{children:Object.entries(e).map((([e,r])=>(0,n.jsxs)(`li`,{children:[(0,n.jsxs)(`strong`,{children:[e,`:`]}),` `,t(r)]},e)))}):(0,n.jsx)(`span`,{children:String(e)});return(0,n.jsx)(`div`,{children:t(e)})},i=e.div`
  margin-top: 1.5rem;
  background-color: var(--privy-color-background-2);
  border-radius: var(--privy-border-radius-md);
  padding: 12px;
  text-align: left;
  max-height: 310px;
  overflow: scroll;
  white-space: pre-wrap;
  width: 100%;
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--privy-color-foreground);
  line-height: 1.5;

  // hide the scrollbars
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Safari and Chrome */
  }
`,a=e.ul`
  margin-left: 12px !important;
  white-space: nowrap;

  &:first-child {
    margin-left: 0 !important;
  }

  strong {
    font-weight: 500 !important;
  }
`,o=({data:e,className:t})=>(0,n.jsx)(i,{className:t,children:(0,n.jsx)(r,{data:e})});export{i as n,o as t};