import{o as e}from"./chunk-Dlc7tRH4.js";import{t}from"./formatters-C50fgE-G.js";import{Ks as n,Sl as r,_i as i,bl as a,ea as o,oi as s,va as c}from"./index-abQhidwz.js";import{a as l,c as u,f as d,i as f,l as p,r as m}from"./ModalHeader-ByY2wsBw-Du1V4esV.js";import{t as ee}from"./ChevronDownIcon-C611NbBK.js";import{n as h,t as g}from"./Checkbox-BhNoOKjX-DJt4CQns.js";import{t as _}from"./ExclamationCircleIcon-CFfaGlqP.js";import{t as v}from"./ErrorMessage-D8VaAP5m-BRVbQ1rf.js";import{a as y,i as b,n as x,r as te,t as S}from"./Value-tcJV9e0L-L3ICb217.js";import{t as C}from"./LoadingSkeleton-U6-3yFwI-DVSq6pPm.js";import{t as ne}from"./Subtitle-CV-2yKE4-CV63efND.js";import{t as w}from"./Title-BnzYV3Is-DlULG219.js";import{t as T}from"./shared-FM0rljBt-e9rlEpji.js";import{t as E}from"./Address-CYbJNMNd-t39SuzWL.js";import{t as D}from"./LabelXs-oqZNqbm_-Cd_rzgjo.js";import{t as O}from"./WalletInfoCard-D9suj06P-B3_qqumg.js";import{t as k}from"./WarningBanner-D5LqDt95-Bw7RPx2N.js";import{t as A}from"./ErrorBanner-CQERa7bL-DfYOFUGA.js";var j=e(r());function M({title:e,titleId:t,...n},r){return j.createElement(`svg`,Object.assign({xmlns:`http://www.w3.org/2000/svg`,fill:`none`,viewBox:`0 0 24 24`,strokeWidth:1.5,stroke:`currentColor`,"aria-hidden":`true`,"data-slot":`icon`,ref:r,"aria-labelledby":t},n),e?j.createElement(`title`,{id:t},e):null,j.createElement(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z`}))}var re=j.forwardRef(M),N=a();function P({title:e,titleId:t,...n},r){return j.createElement(`svg`,Object.assign({xmlns:`http://www.w3.org/2000/svg`,fill:`none`,viewBox:`0 0 24 24`,strokeWidth:1.5,stroke:`currentColor`,"aria-hidden":`true`,"data-slot":`icon`,ref:r,"aria-labelledby":t},n),e?j.createElement(`title`,{id:t},e):null,j.createElement(`path`,{strokeLinecap:`round`,strokeLinejoin:`round`,d:`M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z`}))}var F=j.forwardRef(P),I=i(S)`
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--privy-color-accent);
  svg {
    fill: var(--privy-color-accent);
  }
`,L=({iconUrl:e,value:t,symbol:n,usdValue:r,nftName:i,nftCount:a,decimals:o,$isLoading:s})=>{if(s)return(0,N.jsx)(R,{$isLoading:s});let c=t&&r&&o?function(e,t,n){let r=parseFloat(e),i=parseFloat(n);if(r===0||i===0||Number.isNaN(r)||Number.isNaN(i))return e;let a=Math.ceil(-Math.log10(.01/(i/r))),o=10**(a=Math.max(a=Math.min(a,t),1)),s=+(Math.floor(r*o)/o).toFixed(a).replace(/\.?0+$/,``);return Intl.NumberFormat(void 0,{maximumFractionDigits:t}).format(s)}(t,o,r):t;return(0,N.jsxs)(`div`,{children:[(0,N.jsxs)(R,{$isLoading:s,children:[e&&(0,N.jsx)(B,{src:e,alt:`Token icon`}),a&&a>1?a+`x`:void 0,` `,i,c,` `,n]}),r&&(0,N.jsxs)(z,{$isLoading:s,children:[`$`,r]})]})},R=i.span`
  color: var(--privy-color-foreground);
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.375rem;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${C}
`,z=i.span`
  color: var(--privy-color-foreground-2);
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  word-break: break-all;
  text-align: right;
  display: flex;
  justify-content: flex-end;

  ${C}
`,B=i.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  object-fit: contain;
`,ie=e=>{let{chain:t,transactionDetails:r,isTokenContractInfoLoading:i,symbol:a}=e,{action:o,functionName:s}=r;return(0,N.jsx)(T,{children:(0,N.jsxs)(y,{children:[o!==`transaction`&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Action`}),(0,N.jsx)(x,{children:s})]}),s===`mint`&&`args`in r&&r.args.filter((e=>e)).map(((e,r)=>(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Param ${r}`}),(0,N.jsx)(x,{children:typeof e==`string`&&n(e)?(0,N.jsx)(E,{address:e,url:t?.blockExplorers?.default?.url,showCopyIcon:!1}):e?.toString()})]},r))),s===`setApprovalForAll`&&r.operator&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Operator`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:r.operator,url:t?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),s===`setApprovalForAll`&&r.approved!==void 0&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Set approval to`}),(0,N.jsx)(x,{children:r.approved?`true`:`false`})]}),s===`transfer`||s===`transferWithMemo`||s===`transferFrom`||s===`safeTransferFrom`||s===`approve`?(0,N.jsxs)(N.Fragment,{children:[`formattedAmount`in r&&r.formattedAmount&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount`}),(0,N.jsxs)(x,{$isLoading:i,children:[r.formattedAmount,` `,a]})]}),`tokenId`in r&&r.tokenId&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token ID`}),(0,N.jsx)(x,{children:r.tokenId.toString()})]})]}):null,s===`safeBatchTransferFrom`&&(0,N.jsxs)(N.Fragment,{children:[`amounts`in r&&r.amounts&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amounts`}),(0,N.jsx)(x,{children:r.amounts.join(`, `)})]}),`tokenIds`in r&&r.tokenIds&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token IDs`}),(0,N.jsx)(x,{children:r.tokenIds.join(`, `)})]})]}),s===`approve`&&r.spender&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Spender`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:r.spender,url:t?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),(s===`transferFrom`||s===`safeTransferFrom`||s===`safeBatchTransferFrom`)&&r.transferFrom&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Transferring from`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:r.transferFrom,url:t?.blockExplorers?.default?.url,showCopyIcon:!1})})]}),(s===`transferFrom`||s===`safeTransferFrom`||s===`safeBatchTransferFrom`)&&r.transferTo&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Transferring to`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:r.transferTo,url:t?.blockExplorers?.default?.url,showCopyIcon:!1})})]})]})})},V=({variant:e,setPreventMaliciousTransaction:t,colorScheme:n=`light`,preventMaliciousTransaction:r})=>e===`warn`?(0,N.jsx)(H,{children:(0,N.jsxs)(k,{theme:n,children:[(0,N.jsx)(`span`,{style:{fontWeight:`500`},children:`Warning: Suspicious transaction`}),(0,N.jsx)(`br`,{}),`This has been flagged as a potentially deceptive request. Approving could put your assets or funds at risk.`]})}):e===`error`?(0,N.jsx)(N.Fragment,{children:(0,N.jsxs)(H,{children:[(0,N.jsx)(A,{theme:n,children:(0,N.jsxs)(`div`,{children:[(0,N.jsx)(`strong`,{children:`This is a malicious transaction`}),(0,N.jsx)(`br`,{}),`This transaction transfers tokens to a known malicious address. Proceeding may result in the loss of valuable assets.`]})}),(0,N.jsxs)(U,{children:[(0,N.jsx)(g,{color:`var(--privy-color-error)`,checked:!r,readOnly:!0,onClick:()=>t(!r)}),(0,N.jsx)(`span`,{children:`I understand and want to proceed anyways.`})]})]})}):null,H=i.div`
  margin-top: 1.5rem;
`,U=i.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`,ae=({transactionIndex:e,maxIndex:t})=>typeof e!=`number`||t===0?``:` (${e+1} / ${t+1})`,W=({img:e,submitError:t,prepareError:n,onClose:r,action:i,title:a,subtitle:o,to:l,tokenAddress:h,network:g,missingFunds:_,fee:C,from:T,cta:D,disabled:O,chain:k,isSubmitting:A,isPreparing:M,isTokenPriceLoading:P,isTokenContractInfoLoading:F,isSponsored:R,symbol:z,balance:B,onClick:H,transactionDetails:U,transactionIndex:W,maxIndex:oe,onBack:G,chainName:fe,validation:K,hasScanDetails:q,setIsScanDetailsOpen:pe,preventMaliciousTransaction:me,setPreventMaliciousTransaction:he,tokensSent:J,tokensReceived:Y,isScanning:ge,isCancellable:X,functionName:Z})=>{let{showTransactionDetails:Q,setShowTransactionDetails:$,hasMoreDetails:_e,isErc20Ish:ve}=(e=>{let[t,n]=(0,j.useState)(!1),r=!0,i=!1;return(!e||e.isErc20Ish||e.action===`transaction`)&&(r=!1),r&&(i=Object.entries(e||{}).some((([e,t])=>t&&![`action`,`isErc20Ish`,`isNFTIsh`].includes(e)))),{showTransactionDetails:t,setShowTransactionDetails:n,hasMoreDetails:r&&i,isErc20Ish:e?.isErc20Ish}})(U),ye=c(),be=ve&&F||M||P||ge;return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(m,{onClose:r,backFn:G}),e&&(0,N.jsx)(le,{children:e}),(0,N.jsxs)(w,{style:{marginTop:e?`1.5rem`:0},children:[a,(0,N.jsx)(ae,{maxIndex:oe,transactionIndex:W})]}),(0,N.jsx)(ne,{children:o}),(0,N.jsxs)(y,{style:{marginTop:`2rem`},children:[(!!J[0]||be)&&(0,N.jsxs)(b,{children:[Y.length>0?(0,N.jsx)(S,{children:`Send`}):(0,N.jsx)(S,{children:i===`approve`?`Approval amount`:`Amount`}),(0,N.jsx)(`div`,{className:`flex flex-col`,children:J.map(((e,t)=>(0,N.jsx)(L,{iconUrl:e.iconUrl,value:Z===`setApprovalForAll`?`All`:e.value,usdValue:e.usdValue,symbol:e.symbol,nftName:e.nftName,nftCount:e.nftCount,decimals:e.decimals},t)))})]}),Y.length>0&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Receive`}),(0,N.jsx)(`div`,{className:`flex flex-col`,children:Y.map(((e,t)=>(0,N.jsx)(L,{iconUrl:e.iconUrl,value:e.value,usdValue:e.usdValue,symbol:e.symbol,nftName:e.nftName,nftCount:e.nftCount,decimals:e.decimals},t)))})]}),U&&`spender`in U&&U?.spender?(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Spender`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:U.spender,url:k?.blockExplorers?.default?.url})})]}):null,l&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`To`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:l,url:k?.blockExplorers?.default?.url,showCopyIcon:!0})})]}),h&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token address`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:h,url:k?.blockExplorers?.default?.url})})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Network`}),(0,N.jsx)(x,{children:g})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Estimated fee`}),(0,N.jsx)(x,{$isLoading:M||P||R===void 0,children:R?(0,N.jsxs)(ue,{children:[(0,N.jsxs)(de,{children:[`Sponsored by `,ye.name]}),(0,N.jsx)(re,{height:16,width:16})]}):C})]}),_e&&!q&&(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(b,{className:`cursor-pointer`,onClick:()=>$(!Q),children:(0,N.jsxs)(te,{className:`flex items-center gap-x-1`,children:[`Details`,` `,(0,N.jsx)(ee,{style:{width:`0.75rem`,marginLeft:`0.25rem`,transform:Q?`rotate(180deg)`:void 0}})]})}),Q&&U&&(0,N.jsx)(ie,{action:i,chain:k,transactionDetails:U,isTokenContractInfoLoading:F,symbol:z})]}),q&&(0,N.jsx)(b,{children:(0,N.jsxs)(I,{onClick:()=>pe(!0),children:[(0,N.jsx)(`span`,{className:`text-color-primary`,children:`Details`}),(0,N.jsx)(d,{height:`14px`,width:`14px`,strokeWidth:`2`})]})})]}),(0,N.jsx)(s,{}),t?(0,N.jsx)(v,{style:{marginTop:`2rem`},children:t.message}):n&&W===0?(0,N.jsx)(v,{style:{marginTop:`2rem`},children:n.shortMessage??ce}):null,(0,N.jsx)(V,{variant:K,preventMaliciousTransaction:me,setPreventMaliciousTransaction:he}),(0,N.jsx)(se,{$useSmallMargins:!(!n&&!t&&K!==`warn`&&K!==`error`),address:T,balance:B,errMsg:M||n||t||!_?void 0:`Add funds on ${k?.name??fe} to complete transaction.`}),(0,N.jsx)(u,{style:{marginTop:`1rem`},loading:A,disabled:O||M,onClick:H,children:D}),X&&(0,N.jsx)(f,{style:{marginTop:`1rem`},onClick:r,isSubmitting:!1,children:`Not now`}),(0,N.jsx)(p,{})]})},oe=({img:e,title:n,subtitle:r,cta:i,instructions:a,network:o,blockExplorerUrl:l,isMissingFunds:d,submitError:f,parseError:h,total:g,swap:_,transactingWalletAddress:te,fee:C,balance:T,disabled:O,isSubmitting:k,isPreparing:A,isTokenPriceLoading:M,onClick:P,onClose:F,onBack:L,isSponsored:R})=>{let z=A||M,[B,ie]=(0,j.useState)(!1),V=c();return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(m,{onClose:F,backFn:L}),e&&(0,N.jsx)(le,{children:e}),(0,N.jsx)(w,{style:{marginTop:e?`1.5rem`:0},children:n}),(0,N.jsx)(ne,{children:r}),(0,N.jsxs)(y,{style:{marginTop:`2rem`,marginBottom:`.5rem`},children:[(g||z)&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount`}),(0,N.jsx)(x,{$isLoading:z,children:g})]}),_&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Swap`}),(0,N.jsx)(x,{children:_})]}),o&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Network`}),(0,N.jsx)(x,{children:o})]}),(C||z||R!==void 0)&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Estimated fee`}),(0,N.jsx)(x,{$isLoading:z,children:R&&!z?(0,N.jsxs)(ue,{children:[(0,N.jsxs)(de,{children:[`Sponsored by `,V.name]}),(0,N.jsx)(re,{height:16,width:16})]}):C})]})]}),(0,N.jsx)(b,{children:(0,N.jsxs)(I,{onClick:()=>ie((e=>!e)),children:[(0,N.jsx)(`span`,{children:`Advanced`}),(0,N.jsx)(ee,{height:`16px`,width:`16px`,strokeWidth:`2`,style:{transition:`all 300ms`,transform:B?`rotate(180deg)`:void 0}})]})}),B&&(0,N.jsx)(N.Fragment,{children:a.map(((e,n)=>e.type===`sol-transfer`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Transfer `,e.withSeed?`with seed`:``]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount`}),(0,N.jsxs)(x,{children:[t({amount:e.value,decimals:e.token.decimals}),` `,e.token.symbol]})]}),!!e.toAccount&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Destination`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.toAccount,url:l})})]})]},n):e.type===`spl-transfer`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Transfer `,e.token.symbol]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount`}),(0,N.jsx)(x,{children:e.value.toString()})]}),!!e.fromAta&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Source`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.fromAta,url:l})})]}),!!e.toAta&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Destination`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.toAta,url:l})})]}),!!e.token.address&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.token.address,url:l})})]})]},n):e.type===`ata-creation`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsx)(D,{children:`Create token account`})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Program ID`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.program,url:l})})]}),!!e.owner&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Owner`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.owner,url:l})})]})]},n):e.type===`create-account`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Create account `,e.withSeed?`with seed`:``]})}),!!e.account&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Account`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.account,url:l})})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount`}),(0,N.jsxs)(x,{children:[t({amount:e.value,decimals:9}),` SOL`]})]})]},n):e.type===`spl-init-account`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsx)(D,{children:`Initialize token account`})}),!!e.account&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Account`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.account,url:l})})]}),!!e.mint&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Mint`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mint,url:l})})]}),!!e.owner&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Owner`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.owner,url:l})})]})]},n):e.type===`spl-close-account`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsx)(D,{children:`Close token account`})}),!!e.source&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Source`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.source,url:l})})]}),!!e.destination&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Destination`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.destination,url:l})})]}),!!e.owner&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Owner`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.owner,url:l})})]})]},n):e.type===`spl-sync-native`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsx)(D,{children:`Sync native`})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Program ID`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.program,url:l})})]})]},n):e.type===`raydium-swap-base-input`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Raydium swap`,` `,e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:``]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount in`}),(0,N.jsx)(x,{children:e.amountIn.toString()})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Minimum amount out`}),(0,N.jsx)(x,{children:e.minimumAmountOut.toString()})]}),e.mintIn&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token in`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintIn,url:l})})]}),e.mintOut&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token out`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintOut,url:l})})]})]},n):e.type===`raydium-swap-base-output`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Raydium swap`,` `,e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:``]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Max amount in`}),(0,N.jsx)(x,{children:e.maxAmountIn.toString()})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount out`}),(0,N.jsx)(x,{children:e.amountOut.toString()})]}),e.mintIn&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token in`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintIn,url:l})})]}),e.mintOut&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token out`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintOut,url:l})})]})]},n):e.type===`jupiter-swap-shared-accounts-route`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Jupiter swap`,` `,e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:``]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`In amount`}),(0,N.jsx)(x,{children:e.inAmount.toString()})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Quoted out amount`}),(0,N.jsx)(x,{children:e.quotedOutAmount.toString()})]}),e.mintIn&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token in`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintIn,url:l})})]}),e.mintOut&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token out`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintOut,url:l})})]})]},n):e.type===`jupiter-swap-exact-out-route`?(0,N.jsxs)(G,{children:[(0,N.jsx)(b,{children:(0,N.jsxs)(D,{children:[`Jupiter swap`,` `,e.tokenIn&&e.tokenOut?`${e.tokenIn.symbol} → ${e.tokenOut.symbol}`:``]})}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Quoted in amount`}),(0,N.jsx)(x,{children:e.quotedInAmount.toString()})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Amount out`}),(0,N.jsx)(x,{children:e.outAmount.toString()})]}),e.mintIn&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token in`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintIn,url:l})})]}),e.mintOut&&(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Token out`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.mintOut,url:l})})]})]},n):(0,N.jsxs)(G,{children:[(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Program ID`}),(0,N.jsx)(x,{children:(0,N.jsx)(E,{address:e.program,url:l})})]}),(0,N.jsxs)(b,{children:[(0,N.jsx)(S,{children:`Data`}),(0,N.jsx)(x,{children:e.discriminator})]})]},n)))}),(0,N.jsx)(s,{}),f?(0,N.jsx)(v,{style:{marginTop:`2rem`},children:f.message}):h?(0,N.jsx)(v,{style:{marginTop:`2rem`},children:ce}):null,(0,N.jsx)(se,{$useSmallMargins:!(!h&&!f),title:``,address:te,balance:T,errMsg:A||h||f||!d?void 0:`Add funds on Solana to complete transaction.`}),(0,N.jsx)(u,{style:{marginTop:`1rem`},loading:k,disabled:O||A,onClick:P,children:i}),(0,N.jsx)(p,{})]})},se=i(O)`
  ${e=>e.$useSmallMargins?`margin-top: 0.5rem;`:`margin-top: 2rem;`}
`,G=i(y)`
  margin-top: 0.5rem;
  border: 1px solid var(--privy-color-foreground-4);
  border-radius: var(--privy-border-radius-sm);
  padding: 0.5rem;
`,ce=`There was an error preparing your transaction. Your transaction request will likely fail.`,le=i.div`
  display: flex;
  width: 100%;
  justify-content: center;
  max-height: 40px;

  > img {
    object-fit: contain;
    border-radius: var(--privy-border-radius-sm);
  }
`,ue=i.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
`,de=i.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--privy-color-foreground);
`,fe=()=>(0,N.jsxs)(he,{children:[(0,N.jsx)(Y,{}),(0,N.jsx)(J,{})]}),K=({transactionError:e,chainId:t,onClose:n,onRetry:r,chainType:i,transactionHash:a})=>{let{chains:s}=o(),[c,u]=(0,j.useState)(!1),{errorCode:d,errorMessage:f}=((e,t)=>{if(t===`ethereum`)return{errorCode:e.details??e.message,errorMessage:e.shortMessage};let n=e.txSignature,r=e?.transactionMessage||`Something went wrong.`;if(Array.isArray(e.logs)){let t=e.logs.find((e=>/insufficient (lamports|funds)/gi.test(e)));t&&(r=t)}return{transactionHash:n,errorMessage:r}})(e,i),p=(({chains:e,chainId:t,chainType:n,transactionHash:r})=>n===`ethereum`?e.find((e=>e.id===t))?.blockExplorers?.default.url??`https://etherscan.io`:function(e,t){return`https://explorer.solana.com/tx/${e}?chain=${t}`}(r||``,t))({chains:s,chainId:t,chainType:i,transactionHash:a});return(0,N.jsxs)(N.Fragment,{children:[(0,N.jsx)(m,{onClose:n}),(0,N.jsxs)(q,{children:[(0,N.jsx)(fe,{}),(0,N.jsx)(pe,{children:d}),(0,N.jsx)(me,{children:`Please try again.`}),(0,N.jsxs)(Z,{children:[(0,N.jsx)(X,{children:`Error message`}),(0,N.jsx)($,{$clickable:!1,children:f})]}),a&&(0,N.jsxs)(Z,{children:[(0,N.jsx)(X,{children:`Transaction hash`}),(0,N.jsxs)(Q,{children:[`Copy this hash to view details about the transaction on a`,` `,(0,N.jsx)(`u`,{children:(0,N.jsx)(`a`,{href:p,children:`block explorer`})}),`.`]}),(0,N.jsxs)($,{$clickable:!0,onClick:async()=>{await navigator.clipboard.writeText(a),u(!0)},children:[a,(0,N.jsx)(ye,{clicked:c})]})]}),(0,N.jsx)(ge,{onClick:()=>r({resetNonce:!!a}),children:`Retry transaction`})]}),(0,N.jsx)(l,{})]})},q=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`,pe=i.span`
  color: var(--privy-color-foreground);
  text-align: center;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.25rem; /* 111.111% */
  text-align: center;
  margin: 10px;
`,me=i.span`
  margin-top: 4px;
  margin-bottom: 10px;
  color: var(--privy-color-foreground-3);
  text-align: center;

  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.008px;
`,he=i.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`,J=i(_)`
  position: absolute;
  width: 35px;
  height: 35px;
  color: var(--privy-color-error);
`,Y=i.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--privy-color-error);
  opacity: 0.1;
`,ge=i(u)`
  && {
    margin-top: 24px;
  }
  transition:
    color 350ms ease,
    background-color 350ms ease;
`,X=i.span`
  width: 100%;
  text-align: left;
  font-size: 0.825rem;
  color: var(--privy-color-foreground);
  padding: 4px;
`,Z=i.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`,Q=i.text`
  position: relative;
  width: 100%;
  padding: 5px;
  font-size: 0.8rem;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
`,$=i.span`
  position: relative;
  width: 100%;
  background-color: var(--privy-color-background-2);
  padding: 8px 12px;
  border-radius: 10px;
  margin-top: 5px;
  font-size: 14px;
  color: var(--privy-color-foreground-3);
  text-align: left;
  word-wrap: break-word;
  ${e=>e.$clickable&&`cursor: pointer;
  transition: background-color 0.3s;
  padding-right: 45px;

  &:hover {
    background-color: var(--privy-color-foreground-4);
  }`}
`,_e=i(F)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,ve=i(h)`
  position: absolute;
  top: 13px;
  right: 13px;
  width: 24px;
  height: 24px;
`,ye=({clicked:e})=>(0,N.jsx)(e?ve:_e,{});export{W as n,K as r,oe as t};