import"./chunk-Dlc7tRH4.js";import{D as e,H as t,Hi as n,Jn as r,Sl as i,_i as a,bl as o,j as s,lt as c,pt as l,tt as u,vi as d}from"./index-abQhidwz.js";import{t as f}from"./createLucideIcon-DyOiDk8U.js";import{t as p}from"./check-wHPOGYsM.js";import{i as m,n as h,r as ee,t as g}from"./SelectSourceAsset-DtAsz7CK-C_5iVBPm.js";import{t as _}from"./circle-x-DcXU9usu.js";import{t as v}from"./smartphone-Cz6XMsa4.js";import{t as y}from"./triangle-alert-CXBC-ygr.js";import{t as b}from"./wallet-j9-1PvxM.js";import{t as x}from"./ScreenLayout-DGbEZh8t-tNDY_0fl.js";import{n as S,t as C}from"./GooglePay-DA-Ff7zK-qXujsvt2.js";var w=f(`building`,[[`path`,{d:`M12 10h.01`,key:`1nrarc`}],[`path`,{d:`M12 14h.01`,key:`1etili`}],[`path`,{d:`M12 6h.01`,key:`1vi96p`}],[`path`,{d:`M16 10h.01`,key:`1m94wz`}],[`path`,{d:`M16 14h.01`,key:`1gbofw`}],[`path`,{d:`M16 6h.01`,key:`1x0f13`}],[`path`,{d:`M8 10h.01`,key:`19clt8`}],[`path`,{d:`M8 14h.01`,key:`6423bh`}],[`path`,{d:`M8 6h.01`,key:`1dz90k`}],[`path`,{d:`M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3`,key:`cabbwy`}],[`rect`,{x:`4`,y:`2`,width:`16`,height:`20`,rx:`2`,key:`1uxh74`}]]),te=f(`chevron-right`,[[`path`,{d:`m9 18 6-6-6-6`,key:`mthhwq`}]]),T=f(`credit-card`,[[`rect`,{width:`20`,height:`14`,x:`2`,y:`5`,rx:`2`,key:`ynyp8z`}],[`line`,{x1:`2`,x2:`22`,y1:`10`,y2:`10`,key:`1b3vmo`}]]),E=f(`landmark`,[[`path`,{d:`M10 18v-7`,key:`wt116b`}],[`path`,{d:`M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z`,key:`1m329m`}],[`path`,{d:`M14 18v-7`,key:`vav6t3`}],[`path`,{d:`M18 18v-7`,key:`aexdmj`}],[`path`,{d:`M3 22h18`,key:`8prr45`}],[`path`,{d:`M6 18v-7`,key:`1ivflk`}]]),D=o();i(),d();var[O,k]=((e,t=750)=>{let n;return[(...r)=>{n&&clearTimeout(n),n=setTimeout((()=>{e(...r)}),t)},()=>{n&&clearTimeout(n)}]})((async(e,t)=>{s({isLoading:!0});try{let{getQuotes:n}=u(),r=await n({source:{asset:t.source.selectedAsset.toUpperCase(),amount:e},destination:{asset:t.destination.asset.toUpperCase(),chain:t.destination.chain,address:t.destination.address},environment:t.environment}),i=r.quotes??[],a=r.provider_errors,o=c(i,e);s({localQuotes:i,localSelectedQuote:i[0]??null,isLoading:!1,quotesWarning:o,quotesErrors:a??null})}catch{s({localQuotes:[],localSelectedQuote:null,quotesWarning:`provider_errors`,quotesErrors:null})}})),A=e=>{s({amount:e});let{opts:t}=u();O(e,t)},j=async()=>{let{error:e,state:t,onFailure:n,onSuccess:r}=u();k(),e?n(e):t.status===`provider-success`?await r({status:`confirmed`}):t.status===`provider-confirming`?await r({status:`submitted`}):n(Error(`User exited flow`))},M=async()=>{let e,t=l();if(!t)return;let n=r();if(!n)return void s({state:{status:`provider-error`},error:Error(`Unable to open payment window`)});s({isLoading:!0});let{opts:i,amount:a,getProviderUrl:o,getStatus:c,controller:d}=u(),f=()=>{try{n.closed||n.close()}catch{}};d.current=new AbortController;try{let r=await o({source:{asset:i.source.selectedAsset.toUpperCase(),amount:a||`0`},destination:{asset:i.destination.asset.toUpperCase(),chain:i.destination.chain,address:i.destination.address},provider:t.provider,sub_provider:t.sub_provider??void 0,payment_method:t.payment_method,redirect_url:window.location.origin});n.location.href=r.url,e=r.session_id}catch{f(),s({state:{status:`provider-error`},isLoading:!1,error:Error(`Unable to start payment session`)});return}s({isLoading:!1}),s({state:{status:`provider-confirming`}});let p=await m({operation:()=>c({session_id:e,provider:t.provider}),until:e=>e.status===`completed`||e.status===`failed`||e.status===`cancelled`,delay:0,interval:2e3,attempts:60,signal:d.current.signal});if(p.status!==`aborted`){if(p.status===`max_attempts`)return f(),p.error?(console.error(p.error),void s({state:{status:`select-amount`},isLoading:!1,error:Error(`Unable to check payment status. Please try again.`)})):void s({state:{status:`provider-error`},error:Error(`Could not confirm payment status yet.`)});p.result?.status===`completed`?(f(),s({state:{status:`provider-success`}})):(f(),s({state:{status:`provider-error`},error:Error(`Transaction ${p.result?.status??`failed`}`)}))}},N=()=>{let t=e();t&&t.length>0&&s({state:{status:`select-payment-method`,quotes:t}})},P=()=>{s({state:{status:`select-source-asset`}})},F=()=>{s({error:null,state:{status:`select-amount`}})},I=e=>{s({localSelectedQuote:e,state:{status:`select-amount`}})},L=e=>{let{opts:t,amount:n}=u(),r={...t,source:{...t.source,selectedAsset:e}};s({opts:r,state:{status:`select-amount`}}),O(n,r)},R=({onClose:e})=>(0,D.jsx)(x,{showClose:!0,onClose:e,iconVariant:`loading`,title:`Processing transaction`,subtitle:`Your purchase is in progress. You can leave this screen — we’ll notify you when it’s complete.`,primaryCta:{label:`Done`,onClick:e},watermark:!0}),z=({onClose:e,onRetry:t})=>(0,D.jsx)(x,{showClose:!0,onClose:e,icon:_,iconVariant:`error`,title:`Something went wrong`,subtitle:`We couldn't complete your transaction. Please try again.`,primaryCta:{label:`Try again`,onClick:t},secondaryCta:{label:`Close`,onClick:e},watermark:!0}),B=({onClose:e})=>(0,D.jsx)(x,{showClose:!0,onClose:e,icon:p,iconVariant:`success`,title:`Transaction confirmed`,subtitle:`Your purchase is processing. Funds should arrive in your wallet within a few minutes.`,primaryCta:{label:`Done`,onClick:e},watermark:!0}),V={CREDIT_DEBIT_CARD:`card`,APPLE_PAY:`Apple Pay`,GOOGLE_PAY:`Google Pay`,BANK_TRANSFER:`bank deposit`,ACH:`bank deposit`,SEPA:`bank deposit`,PIX:`PIX`},ne={CREDIT_DEBIT_CARD:(0,D.jsx)(T,{size:14}),APPLE_PAY:(0,D.jsx)(v,{size:14}),GOOGLE_PAY:(0,D.jsx)(v,{size:14}),BANK_TRANSFER:(0,D.jsx)(w,{size:14}),ACH:(0,D.jsx)(w,{size:14}),SEPA:(0,D.jsx)(w,{size:14}),PIX:(0,D.jsx)(b,{size:14})},H=e=>ne[e]??(0,D.jsx)(T,{size:14}),U=({opts:e,onClose:t,onEditSourceAsset:n,onEditPaymentMethod:r,onContinue:i,onAmountChange:a,amount:o,selectedQuote:s,quotesWarning:c,quotesErrors:l,quotesCount:u,isLoading:d})=>{return(0,D.jsxs)(x,{showClose:!0,onClose:t,headerTitle:`Buy ${e.destination.asset.toLocaleUpperCase()}`,primaryCta:{label:`Continue`,onClick:i,loading:d,disabled:!s},helpText:c?(0,D.jsxs)(W,{children:[(0,D.jsx)(y,{size:16,strokeWidth:2}),(0,D.jsx)(G,{children:(0,D.jsxs)(D.Fragment,c===`amount_too_low`?{children:[(0,D.jsx)(K,{children:`Amount too low`}),(0,D.jsx)(q,{children:`Please choose a higher amount to continue.`})]}:{children:[(0,D.jsx)(K,{children:`Unable to get quotes`}),(0,D.jsx)(q,{children:l?.[0]?.error??`Something went wrong. Please try again.`})]})})]}):s&&u>1?(0,D.jsxs)(J,{onClick:r,children:[H(s.payment_method),(0,D.jsxs)(`span`,{children:[`Pay with `,(f=s.payment_method,V[f]??f.replace(/_/g,` `).toLowerCase().replace(/^\w/,(e=>e.toUpperCase())))]}),(0,D.jsx)(te,{size:14})]}):null,watermark:!0,children:[(0,D.jsx)(h,{currency:e.source.selectedAsset,value:o,onChange:a,inputMode:`decimal`,autoFocus:!0}),(0,D.jsx)(ee,{selectedAsset:e.source.selectedAsset,onEditSourceAsset:n})]});var f},W=a.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--privy-color-warn-bg, #fffbbb);
  border: 1px solid var(--privy-color-border-warning, #facd63);
  overflow: clip;
  width: 100%;

  svg {
    flex-shrink: 0;
    color: var(--privy-color-icon-warning, #facd63);
  }
`,G=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: var(--privy-color-foreground);
  font-feature-settings:
    'calt' 0,
    'kern' 0;
  text-align: left;
`,K=a.span`
  font-weight: 600;
`,q=a.span`
  font-weight: 400;
`,J=a.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;

  && {
    padding: 0;
    color: var(--privy-color-accent);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 500;
    line-height: 1.375rem;
  }
`,Y={CREDIT_DEBIT_CARD:`Credit / debit card`,APPLE_PAY:`Apple Pay`,GOOGLE_PAY:`Google Pay`,BANK_TRANSFER:`Bank transfer`,ACH:`ACH`,SEPA:`SEPA`,PIX:`PIX`},X={CREDIT_DEBIT_CARD:(0,D.jsx)(T,{size:20}),APPLE_PAY:(0,D.jsx)(C,{width:20,height:20}),GOOGLE_PAY:(0,D.jsx)(S,{width:20,height:20}),BANK_TRANSFER:(0,D.jsx)(E,{size:20}),ACH:(0,D.jsx)(E,{size:20}),SEPA:(0,D.jsx)(E,{size:20}),PIX:(0,D.jsx)(E,{size:20})},Z=e=>X[e]??(0,D.jsx)(T,{size:20}),re=({onClose:e,onSelectPaymentMethod:t,quotes:n,isLoading:r})=>(0,D.jsx)(x,{showClose:!0,onClose:e,title:`Select payment method`,subtitle:`Choose how you'd like to pay`,watermark:!0,children:(0,D.jsx)(ie,{children:n.map(((e,n)=>{return(0,D.jsx)(ae,{onClick:()=>t(e),disabled:r,children:(0,D.jsxs)(oe,{children:[(0,D.jsx)(se,{children:Z(e.payment_method)}),(0,D.jsx)(Q,{children:(0,D.jsx)(ce,{children:(i=e.payment_method,Y[i]??i.replace(/_/g,` `).toLowerCase().replace(/^\w/,(e=>e.toUpperCase())))})})]})},`${e.provider}-${e.payment_method}-${n}`);var i}))})}),ie=a.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
`,ae=a.button`
  border-color: var(--privy-color-border-default);
  border-width: 1px;
  border-radius: var(--privy-border-radius-md);
  border-style: solid;
  display: flex;

  && {
    padding: 1rem 1rem;
  }
`,oe=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`,se=a.div`
  color: var(--privy-color-foreground-3);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`,Q=a.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
  flex: 1;
`,ce=a.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
`,le=({onClose:e,onContinue:t,onAmountChange:n,onSelectSource:r,onEditSourceAsset:i,onEditPaymentMethod:a,onSelectPaymentMethod:o,onRetry:s,opts:c,state:l,amount:u,selectedQuote:d,quotesWarning:f,quotesErrors:p,quotesCount:m,isLoading:h})=>l.status===`select-amount`?(0,D.jsx)(U,{onClose:e,onContinue:t,onAmountChange:n,onEditSourceAsset:i,onEditPaymentMethod:a,opts:c,amount:u,selectedQuote:d,quotesWarning:f,quotesErrors:p,quotesCount:m,isLoading:h}):l.status===`select-source-asset`?(0,D.jsx)(g,{onSelectSource:r,opts:c,isLoading:h}):l.status===`select-payment-method`?(0,D.jsx)(re,{onClose:e,onSelectPaymentMethod:o,quotes:l.quotes,isLoading:h}):l.status===`provider-confirming`?(0,D.jsx)(R,{onClose:e}):l.status===`provider-error`?(0,D.jsx)(z,{onClose:e,onRetry:s}):l.status===`provider-success`?(0,D.jsx)(B,{onClose:e}):null,$={component:()=>{let{onUserCloseViaDialogOrKeybindRef:e}=n(),r=t();if(!r)return null;let{opts:i,state:a,isLoading:o,amount:s,quotesWarning:c,quotesErrors:l,localQuotes:u,localSelectedQuote:d,initialQuotes:f,initialSelectedQuote:p}=r;return e.current=j,(0,D.jsx)(le,{onClose:j,opts:i,state:a,isLoading:o,amount:s,selectedQuote:d??p,quotesWarning:c,quotesErrors:l,quotesCount:(u??f)?.length??0,onAmountChange:A,onContinue:M,onSelectSource:L,onEditSourceAsset:P,onEditPaymentMethod:N,onSelectPaymentMethod:I,onRetry:F})}};export{$ as FiatOnrampScreen,$ as default};