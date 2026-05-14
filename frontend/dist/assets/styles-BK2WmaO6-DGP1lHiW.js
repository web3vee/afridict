import{_i as e,hi as t}from"./index-abQhidwz.js";import{n}from"./ModalHeader-ByY2wsBw-Du1V4esV.js";import{LinkButton as r}from"./LinkPasskeyScreen-C2ywsQ6d-7D2lVHl_.js";var i=e.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  padding-bottom: 24px;
`,a=e.div`
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    border-radius: var(--privy-border-radius-sm);
  }
`,o=e.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`,s=e.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 0 16px;
  border-width: 1px !important;
  border-radius: 12px;
  cursor: text;

  &:focus-within {
    border-color: var(--privy-color-accent);
  }
`;e.div`
  font-size: 42px !important;
`;var c=e.input`
  background-color: var(--privy-color-background);
  width: 100%;

  &:focus {
    outline: none !important;
    border: none !important;
    box-shadow: none !important;
  }

  && {
    font-size: 26px;
  }
`,l=e(c)`
  && {
    font-size: 42px;
  }
`;e.button`
  cursor: pointer;
  padding-left: 4px;
`;var u=e.div`
  font-size: 18px;
`,d=e.div`
  font-size: 12px;
  color: var(--privy-color-foreground-3);
  // we need this container to maintain a static height if there's no content
  height: 20px;
`;e.div`
  display: flex;
  flex-direction: row;
  line-height: 22px;
  font-size: 16px;
  text-align: center;
  svg {
    margin-right: 6px;
    margin: auto;
  }
`,e(r)`
  margin-top: 16px;
`;var f=t`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;e(n)`
  border-radius: var(--privy-border-radius-md) !important;
  animation: ${f} 0.3s ease-in-out;
`;var p=e.div``,m=e.a`
  && {
    color: var(--privy-color-accent);
  }

  cursor: pointer;
`;export{m as a,a as c,i,s as l,u as n,d as o,l as r,p as s,o as t,c as u};