import{_i as e,bl as t,gi as n,hi as r}from"./index-abQhidwz.js";import{t as i}from"./LoadingSkeleton-U6-3yFwI-DVSq6pPm.js";var a=t(),o=({children:e,color:t,isLoading:n,isPulsing:r,...i})=>(0,a.jsx)(s,{$color:t,$isLoading:n,$isPulsing:r,...i,children:e}),s=e.span`
  padding: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem; /* 150% */
  border-radius: var(--privy-border-radius-xs);
  display: flex;
  align-items: center;
  ${e=>{let t,i;e.$color===`green`&&(t=`var(--privy-color-success-dark)`,i=`var(--privy-color-success-light)`),e.$color===`red`&&(t=`var(--privy-color-error)`,i=`var(--privy-color-error-light)`),e.$color===`gray`&&(t=`var(--privy-color-foreground-2)`,i=`var(--privy-color-background-2)`);let a=r`
      from, to {
        background-color: ${i};
      }

      50% {
        background-color: rgba(${i}, 0.8);
      }
    `;return n`
      color: ${t};
      background-color: ${i};
      ${e.$isPulsing&&n`
        animation: ${a} 3s linear infinite;
      `};
    `}}

  ${i}
`;export{o as t};