import{o as e}from"./chunk-Dlc7tRH4.js";import{Ci as t,Sl as n,_i as r,bl as i}from"./index-abQhidwz.js";import{t as a}from"./check-wHPOGYsM.js";import{t as o}from"./copy-BEd6A0EJ.js";import{t as s}from"./ModalHeader-ByY2wsBw-Du1V4esV.js";var c=i(),l=e(n(),1),u=({address:e,showCopyIcon:n,url:r,className:i})=>{let[u,m]=(0,l.useState)(!1);function h(t){t.stopPropagation(),navigator.clipboard.writeText(e).then((()=>m(!0))).catch(console.error)}return(0,l.useEffect)((()=>{if(u){let e=setTimeout((()=>m(!1)),3e3);return()=>clearTimeout(e)}}),[u]),(0,c.jsxs)(d,r?{children:[(0,c.jsx)(p,{title:e,className:i,href:`${r}/address/${e}`,target:`_blank`,children:t(e)}),n&&(0,c.jsx)(s,{onClick:h,size:`sm`,style:{gap:`0.375rem`},children:(0,c.jsxs)(c.Fragment,u?{children:[`Copied`,(0,c.jsx)(a,{size:16})]}:{children:[`Copy`,(0,c.jsx)(o,{size:16})]})})]}:{children:[(0,c.jsx)(f,{title:e,className:i,children:t(e)}),n&&(0,c.jsx)(s,{onClick:h,size:`sm`,style:{gap:`0.375rem`,fontSize:`14px`},children:(0,c.jsxs)(c.Fragment,u?{children:[`Copied`,(0,c.jsx)(a,{size:14})]}:{children:[`Copy`,(0,c.jsx)(o,{size:14})]})})]})},d=r.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`,f=r.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,p=r.a`
  font-size: 14px;
  color: var(--privy-color-foreground);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;export{u as t};