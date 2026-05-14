import{Ci as e,Os as t,_i as n,bl as r}from"./index-abQhidwz.js";import{t as i}from"./getFormattedUsdFromLamports-B6EqSEho-C3MONSV-.js";import{n as a}from"./transaction-CnfuREWo-Cky2WDme.js";import{i as o,n as s,o as c,t as l}from"./ethers-C123aV2r-DAtWQ_sh.js";var u=r(),d=({weiQuantities:e,tokenPrice:t,tokenSymbol:n})=>{let r=o(e),i=t?c(r,t):void 0,a=l(r,n);return(0,u.jsx)(m,{children:i||a})},f=({weiQuantities:e,tokenPrice:t,tokenSymbol:n})=>{let r=o(e),i=t?c(r,t):void 0,a=l(r,n);return(0,u.jsx)(m,{children:i?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(h,{children:`USD`}),i===`<$0.01`?(0,u.jsxs)(_,{children:[(0,u.jsx)(g,{children:`<`}),`$0.01`]}):i]}):a})},p=({quantities:e,tokenPrice:n,tokenSymbol:r=`SOL`,tokenDecimals:o=9})=>{let s=e.reduce(((e,t)=>e+t),0n),c=n&&r===`SOL`&&o===9?i(s,n):void 0,l=r===`SOL`&&o===9?a(s):`${t(s,o)} ${r}`;return(0,u.jsx)(m,{children:c?(0,u.jsx)(u.Fragment,{children:c===`<$0.01`?(0,u.jsxs)(_,{children:[(0,u.jsx)(g,{children:`<`}),`$0.01`]}):c}):l})},m=n.span`
  font-size: 14px;
  line-height: 140%;
  display: flex;
  gap: 4px;
  align-items: center;
`,h=n.span`
  font-size: 12px;
  line-height: 12px;
  color: var(--privy-color-foreground-3);
`,g=n.span`
  font-size: 10px;
`,_=n.span`
  display: flex;
  align-items: center;
`;function v(e,t){return`https://explorer.solana.com/account/${e}?chain=${t}`}var y=t=>(0,u.jsx)(b,{href:t.chainType===`ethereum`?s(t.chainId,t.walletAddress):v(t.walletAddress,t.chainId),target:`_blank`,children:e(t.walletAddress)}),b=n.a`
  &:hover {
    text-decoration: underline;
  }
`;export{y as i,f as n,d as r,p as t};