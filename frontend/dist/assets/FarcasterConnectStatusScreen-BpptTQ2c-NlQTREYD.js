import{o as e}from"./chunk-Dlc7tRH4.js";import{$i as t,Hi as n,Sl as r,Ui as i,_i as a,bl as o,ea as s,ii as c,ma as l,na as u,va as d,vi as f}from"./index-abQhidwz.js";import{t as p}from"./check-wHPOGYsM.js";import{t as m}from"./copy-BEd6A0EJ.js";import{t as h}from"./ModalHeader-ByY2wsBw-Du1V4esV.js";import{t as g}from"./ScreenLayout-DGbEZh8t-tNDY_0fl.js";import{t as _}from"./shouldProceedtoEmbeddedWalletCreationFlow-CrWspe2X-HF_otJ6e.js";import{n as v,t as y}from"./QrCode-De3KTDSW-CcwLWVL3.js";import{t as b}from"./farcaster-DPlSjvF5-Dc1zUTf9.js";import{t as x}from"./LabelXs-oqZNqbm_-Cd_rzgjo.js";import{t as S}from"./OpenLink-DZHy38vr-mH2Ie_g2.js";var C=o(),w=e(r(),1),T=e(f(),1);v();var E=a.div`
  width: 100%;
`,D=a.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem;
  height: 56px;
  background: ${e=>e.$disabled?`var(--privy-color-background-2)`:`var(--privy-color-background)`};
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-md);

  &:hover {
    border-color: ${e=>e.$disabled?`var(--privy-color-foreground-4)`:`var(--privy-color-foreground-3)`};
  }
`,O=a.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
`,k=a.span`
  display: block;
  font-size: 16px;
  line-height: 24px;
  color: ${e=>e.$disabled?`var(--privy-color-foreground-2)`:`var(--privy-color-foreground)`};
  overflow: hidden;
  text-overflow: ellipsis;
  /* Use single-line truncation without nowrap to respect container width */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-all;

  @media (min-width: 441px) {
    font-size: 14px;
    line-height: 20px;
  }
`,A=a(k)`
  color: var(--privy-color-foreground-3);
  font-style: italic;
`,j=a(x)`
  margin-bottom: 0.5rem;
`,M=a(h)`
  && {
    gap: 0.375rem;
    font-size: 14px;
    flex-shrink: 0;
  }
`,N=({value:e,title:t,placeholder:n,className:r,showCopyButton:i=!0,truncate:a,maxLength:o=40,disabled:s=!1})=>{let[c,l]=(0,w.useState)(!1),u=a&&e?((e,t,n)=>{if((e=e.startsWith(`https://`)?e.slice(8):e).length<=n)return e;if(t===`middle`){let t=Math.ceil(n/2)-2,r=Math.floor(n/2)-1;return`${e.slice(0,t)}...${e.slice(-r)}`}return`${e.slice(0,n-3)}...`})(e,a,o):e;return(0,w.useEffect)((()=>{if(c){let e=setTimeout((()=>l(!1)),3e3);return()=>clearTimeout(e)}}),[c]),(0,C.jsxs)(E,{className:r,children:[t&&(0,C.jsx)(j,{children:t}),(0,C.jsxs)(D,{$disabled:s,children:[(0,C.jsx)(O,{children:e?(0,C.jsx)(k,{$disabled:s,title:e,children:u}):(0,C.jsx)(A,{$disabled:s,children:n||`No value`})}),i&&e&&(0,C.jsx)(M,{onClick:function(t){t.stopPropagation(),navigator.clipboard.writeText(e).then((()=>l(!0))).catch(console.error)},size:`sm`,children:(0,C.jsxs)(C.Fragment,c?{children:[`Copied`,(0,C.jsx)(p,{size:14})]}:{children:[`Copy`,(0,C.jsx)(m,{size:14})]})})]})]})},P=({connectUri:e,loading:t,success:n,errorMessage:r,onBack:i,onClose:a,onOpenFarcaster:o})=>(0,C.jsx)(g,T.isMobile||t?T.isIOS?{title:r?r.message:`Sign in with Farcaster`,subtitle:r?r.detail:`To sign in with Farcaster, please open the Farcaster app.`,icon:b,iconVariant:`loading`,iconLoadingStatus:{success:n,fail:!!r},primaryCta:e&&o?{label:`Open Farcaster app`,onClick:o}:void 0,onBack:i,onClose:a,watermark:!0}:{title:r?r.message:`Signing in with Farcaster`,subtitle:r?r.detail:`This should only take a moment`,icon:b,iconVariant:`loading`,iconLoadingStatus:{success:n,fail:!!r},onBack:i,onClose:a,watermark:!0,children:e&&T.isMobile&&(0,C.jsx)(I,{children:(0,C.jsx)(S,{text:`Take me to Farcaster`,url:e,color:`#8a63d2`})})}:{title:`Sign in with Farcaster`,subtitle:`Scan with your phone's camera to continue.`,onBack:i,onClose:a,watermark:!0,children:(0,C.jsxs)(L,{children:[(0,C.jsx)(R,{children:e?(0,C.jsx)(y,{url:e,size:275,squareLogoElement:b}):(0,C.jsx)(V,{children:(0,C.jsx)(c,{})})}),(0,C.jsxs)(z,{children:[(0,C.jsx)(B,{children:`Or copy this link and paste it into a phone browser to open the Farcaster app.`}),e&&(0,C.jsx)(N,{value:e,truncate:`end`,maxLength:30,showCopyButton:!0,disabled:!0})]})]})}),F={component:()=>{let{authenticated:e,logout:r,ready:a,user:o}=i(),{lastScreen:c,navigate:f,navigateBack:p,setModalData:m}=n(),h=d(),{getAuthFlow:g,loginWithFarcaster:v,closePrivyModal:y,createAnalyticsEvent:b}=s(),[x,S]=(0,w.useState)(void 0),[T,E]=(0,w.useState)(!1),[D,O]=(0,w.useState)(!1),k=(0,w.useRef)([]),A=g(),j=A?.meta.connectUri;return(0,w.useEffect)((()=>{let e=Date.now(),n=setInterval((async()=>{let r=await A.pollForReady.execute(),i=Date.now()-e;if(r){clearInterval(n),E(!0);try{await v(),O(!0)}catch(e){let n={retryable:!1,message:`Authentication failed`};if(e?.privyErrorCode===t.ALLOWLIST_REJECTED)return void f(`AllowlistRejectionScreen`);if(e?.privyErrorCode===t.USER_LIMIT_REACHED)return console.error(new u(e).toString()),void f(`UserLimitReachedScreen`);if(e?.privyErrorCode===t.USER_DOES_NOT_EXIST)return void f(`AccountNotFoundScreen`);if(e?.privyErrorCode===t.LINKED_TO_ANOTHER_USER)n.detail=e.message??`This account has already been linked to another user.`;else{if(e?.privyErrorCode===t.ACCOUNT_TRANSFER_REQUIRED&&e.data?.data?.nonce)return m({accountTransfer:{nonce:e.data?.data?.nonce,account:e.data?.data?.subject,displayName:e.data?.data?.account?.displayName,linkMethod:`farcaster`,embeddedWalletAddress:e.data?.data?.otherUser?.embeddedWalletAddress,farcasterEmbeddedAddress:e.data?.data?.otherUser?.farcasterEmbeddedAddress}}),void f(`LinkConflictScreen`);e?.privyErrorCode===t.INVALID_CREDENTIALS?(n.retryable=!0,n.detail=`Something went wrong. Try again.`):e?.privyErrorCode===t.TOO_MANY_REQUESTS&&(n.detail=`Too many requests. Please wait before trying again.`)}S(n)}}else i>12e4&&(clearInterval(n),S({retryable:!0,message:`Authentication failed`,detail:`The request timed out. Try again.`}))}),2e3);return()=>{clearInterval(n),k.current.forEach((e=>clearTimeout(e)))}}),[]),(0,w.useEffect)((()=>{if(a&&e&&D&&o){if(h?.legal.requireUsersAcceptTerms&&!o.hasAcceptedTerms){let e=setTimeout((()=>{f(`AffirmativeConsentScreen`)}),l);return()=>clearTimeout(e)}D&&(_(o,h.embeddedWallets)?k.current.push(setTimeout((()=>{m({createWallet:{onSuccess:()=>{},onFailure:e=>{console.error(e),b({eventName:`embedded_wallet_creation_failure_logout`,payload:{error:e,screen:`FarcasterConnectStatusScreen`}}),r()},callAuthOnSuccessOnClose:!0}}),f(`EmbeddedWalletOnAccountCreateScreen`)}),1400)):k.current.push(setTimeout((()=>y({shouldCallAuthOnSuccess:!0,isSuccess:!0})),1400)))}}),[D,a,e,o]),(0,C.jsx)(P,{connectUri:j,loading:T,success:D,errorMessage:x,onBack:c?p:void 0,onClose:y,onOpenFarcaster:()=>{j&&(window.location.href=j)}})}},I=a.div`
  margin-top: 24px;
`,L=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`,R=a.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 275px;
`,z=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`,B=a.div`
  font-size: 0.875rem;
  text-align: center;
  color: var(--privy-color-foreground-2);
`,V=a.div`
  position: relative;
  width: 82px;
  height: 82px;
`;export{F as FarcasterConnectStatusScreen,F as default,P as FarcasterConnectStatusView};