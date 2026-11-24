/* =====================================================================
   GERADOR DE ARTES — script.js (versão GitHub Pages)
   ---------------------------------------------------------------------
   Site 100% estático. O “banco de dados” é o próprio repositório:

     logos/logos.json        lista de logos e templates
     logos/grupo/*.png       logos do grupo
     logos/farmaceuticas/    logos das farmacêuticas
     dados/banco.json        cores, sombra das fotos, doutores e
                             rodapés salvos
     dados/medicos/*.jpg     fotos dos doutores

   Qualquer pessoa usa o site lendo esses arquivos. Quem conecta a
   chave do GitHub (Área do administrador) grava no repositório: cada
   alteração vira UM commit, e o GitHub Pages republica em 1–2 minutos.

   Partes
     1. Constantes, utilidades, estado, biblioteca de logos,
        motor do rodapé e aba Rodapé
     2. Formatos, texto rico, desenho das artes, pranchetas,
        inspetor de posição e barra lateral da notícia
     3. Conexão com o GitHub (leitura e gravação), aba Banco de dados,
        exportação e início
   ===================================================================== */

/* #####################################################################
   PARTE 1
   ##################################################################### */

/* =========================================================
   Constantes
   ---------------------------------------------------------
   - LOGOS_PATH / BANCO_PATH / FOTOS_DIR: onde ficam os dados no repositório.
   - FDEF: ajustes padrão do rodapé (iguais aos do Gerador de rodapé).
   - DEFAULT_LOOK / DEFAULT_COLORS: valores usados até o banco carregar
     (e por “Restaurar padrão”).
   - BRAND_META: nome, texto da tag e template de “Realização” de cada
     marca. Os logos do template vêm do logos.json (bloco "templates").
   - BASE_FORMATS: cada formato de arte, com posições medidas nas peças
     de referência (imagem, painel, tag, doutores, texto, botão, rodapé).
   ========================================================= */
const LOGOS_PATH="logos/logos.json";
const BANCO_PATH="dados/banco.json";
const FOTOS_DIR="dados/medicos/";
const FDEF={layout:"row",fill:false,logoH:56,maxW:190,gap:28,secGap:28,pad:30,radius:24,titleSize:14,titleWeight:"600",align:"center",upper:false,titleColor:"#2a2a2a",lineColor:"#d9d6e0",lineW:1,bg:"#ffffff",vMargin:60};
const FMAXW=1080,FMAXH=600,FMAXW_INLINE=1920,VW=1920,VH=1080;
const FONT="Montserrat, Arial, sans-serif";
const MAXDOCS=4;
const DEFAULT_LOOK={shadow:.196};
const DEFAULT_COLORS={tribemd:{dark:"#563f99",light:"#b58fff"},oncologia:{dark:"#144c6f",light:"#69c3c4"},hemo:{dark:"#b52b2b",light:"#ed1c24"},white:"#f3f3f3",black:"#2a2a2a"};
const BRAND_META={
  tribemd:{name:"TribeMD",tag:"TribeNews",tpl:"TribeMD",fallback:["g_tribemd"]},
  oncologia:{name:"Oncologia Brasil",tag:"Oncologia",tpl:"Oncologia Brasil",fallback:["g_oncologiabrasil","g_tribemd"]},
  hemo:{name:"Hemomeeting",tag:"Hematologia",tpl:"Hemomeeting",fallback:["g_hemomeeting","g_tribemd"]}
};
const BRAND_ORDER=["tribemd","oncologia","hemo"];

/* Formatos (medidas tiradas das peças de referência) */
const BASE_FORMATS=[
  {id:"feed_cta",flow:{after:"docs",bottom:1312,order:["head","cta","foot"]},name:"Feed com CTA",w:1080,h:1350,kind:"dark",cta:true,
   img:{x:0,y:0,w:1080,h:700},panel:{type:"flat",y:665},
   tag:{x:50,y:12,h:68,fs:38},
   docs:{right:979,cy:640,d:190,gap:56,nameFs:20,crmFs:17},
   head:{x:203,y:845,w:700,fs:40,maxH:228},
   ctaBox:{cx:540,y:1092,w:445,h:68,fs:38},
   foot:{cx:540,cy:1246,maxW:820,maxH:118},
   news:{y:1105},dots:{x0:700,y0:880,x1:1080,y1:1350,tx:1080,ty:1350,sp:24,rmax:6.5}},
  {id:"feed",flow:{after:"docs",bottom:1300,order:["head","foot"]},name:"Feed",w:1080,h:1350,kind:"light",
   img:{x:0,y:0,w:1080,h:812},panel:{type:"arc",y0:805,yc:690,lw:1},
   tag:{x:50,y:12,h:68,fs:38},
   docs:{right:934,cy:700,d:190,gap:56,nameFs:20,crmFs:17},
   head:{x:183,y:925,w:740,fs:44,maxH:225},
   foot:{cx:540,cy:1216,maxW:820,maxH:118},
   news:{y:1105},dots:{x0:700,y0:860,x1:1080,y1:1350,tx:1080,ty:1350,sp:24,rmax:6.5}},
  {id:"stories_cta",flow:{after:"docs",bottom:1745,order:["head","cta","foot"]},name:"Stories com CTA",w:1080,h:1920,kind:"dark",cta:true,
   img:{x:0,y:0,w:1080,h:1000},panel:{type:"arc",y0:985,yc:865,lw:1},
   tag:{x:30,y:82,h:68,fs:38},
   docs:{right:1003,cy:865,d:230,gap:63,nameFs:24,crmFs:20},
   head:{x:127,y:1105,w:840,fs:50,maxH:285},
   ctaBox:{cx:530,y:1410,w:448,h:70,fs:38},
   foot:{cx:540,cy:1653,maxW:860,maxH:130},
   news:{y:1590},dots:{x0:700,y0:1340,x1:1080,y1:1920,tx:1080,ty:1920,sp:24,rmax:6.5}},
  {id:"stories",flow:{after:"docs",bottom:1700,order:["head","foot"]},name:"Stories",w:1080,h:1920,kind:"stripe",
   img:{x:0,y:155,w:1080,h:735},panel:{type:"stripe",y:880,sh:20},
   tag:{x:10,y:115,h:68,fs:38},
   docs:{right:953,cy:870,d:230,gap:68,nameFs:24,crmFs:20},
   head:{x:120,y:1095,w:850,fs:50,maxH:420},
   foot:{cx:540,cy:1611,maxW:860,maxH:130},
   news:{y:1320},dots:{x0:640,y0:1460,x1:1080,y1:1920,tx:1080,ty:1920,sp:24,rmax:6.5}},
  {id:"linkedin",flow:{top:88,bottom:606,order:["head","docs","foot"]},name:"LinkedIn",w:1200,h:627,kind:"circle",
   circle:{cx:1235,cy:230,r:680,band:37,lineW:4},img:{x:555,y:0,w:645,h:627},
   tag:{x:42,y:36,h:38,fs:21},
   docs:{left:50,cy:410,d:125,gap:35,nameFs:13,crmFs:11},
   head:{x:55,y:133,w:408,fs:31,lh:1.05,maxH:205},
   foot:{left:50,cy:558,maxW:340,maxH:62},
   dots:{x0:0,y0:40,x1:380,y1:600,tx:0,ty:330,sp:22,rmax:5.5}},
  {id:"banner",flow:{top:58,bottom:470,order:["head","foot"]},name:"Banner principal",w:1920,h:500,kind:"circle",hide:["tag"],
   circle:{cx:125,cy:250,r:540,band:29,lineW:4},img:{x:0,y:0,w:665,h:500},
   tag:{x:768,y:56,h:40,fs:22},
   docs:{right:1669,cy:183,d:158,gap:42,nameFs:16,crmFs:14,rows2:{d:128,cy:118,pitch:192}},
   head:{x:768,y:118,w:502,fs:36,lh:1.08,maxH:235},
   foot:{left:766,cy:393,maxW:380,maxH:66},
   dots:{x0:1560,y0:0,x1:1920,y1:500,tx:1920,ty:250,sp:24,rmax:6.5}},
  {id:"mobile",flow:{top:288,bottom:494,order:["head","foot"]},name:"Site mobile",w:412,h:500,kind:"circle",hide:["tag","docs"],
   circle:{cx:206,cy:-186,r:452,band:8,lineW:3},img:{x:0,y:0,w:412,h:266},
   tag:{x:16,y:16,h:28,fs:15},
   docs:{right:392,cy:300,d:70,gap:18,nameFs:9,crmFs:8},
   head:{x:75,y:290,w:262,fs:18.5,lh:1.15,maxH:145},
   foot:{cx:206,cy:464,maxW:240,maxH:44},
   dots:{x0:0,y0:380,x1:412,y1:500,tx:0,ty:500,sp:13,rmax:3.5}},
  {id:"site",name:"Site",w:1920,h:1080,kind:"site",
   img:{x:0,y:0,w:1920,h:1080},foot:{cx:960,cy:895,maxW:900,maxH:140}},
  {id:"site_obr",name:"Site OBR e Hemo",w:1860,h:830,kind:"site",
   img:{x:0,y:0,w:1860,h:830},foot:{cx:930,cy:697,maxW:900,maxH:130}}
];
const ELNAME={bg:"Imagem de fundo",tag:"Tags",docs:"Doutores",head:"Texto da notícia",cta:"Botão",foot:"Rodapé",disc:"Disclaimer"};
/* Disclaimer abaixo do rodapé: texto e controle de fonte (tamanho em px
   no Feed de 1080 px; nos outros formatos acompanha a escala do rodapé) */
/* Alinhamento automático dos blocos (doutores, texto, botão, rodapé):
   on = liga/desliga, gap = distância entre blocos (% da automática),
   shift = sobe/desce o conjunto (px na escala do Feed) */
const DEFAULT_FLOW={on:true,gap:1,shift:0};
const DEFAULT_DISC={text:"",size:14,weight:"400",align:"center",color:"auto",italic:false};

/* =========================================================
   Utilidades
   ---------------------------------------------------------
   Atalho $(), mistura de cores, conversões de arquivo, botões de
   ícone, diálogos, o diálogo ask() (substitui confirm/prompt),
   o cache de imagens img() e o download de arquivos saveBlob().
   ========================================================= */
const $=id=>document.getElementById(id);
const uid=()=>Math.random().toString(36).slice(2,9);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const slug=s=>(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let toastT;function toast(m,ms=3200){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("on"),ms);}
function stamp(){const d=new Date(),p=n=>String(n).padStart(2,"0");return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+"-"+p(d.getHours())+p(d.getMinutes())+p(d.getSeconds());}
function rr(ctx,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
const isHex=c=>/^#[0-9a-f]{6}$/i.test(c||"");
function hexRgb(h){const n=parseInt(h.slice(1),16);return[(n>>16)&255,(n>>8)&255,n&255];}
function mix(a,b,t){const A=hexRgb(a),B=hexRgb(b);return"#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join("");}
const blobToDataUrl=b=>new Promise((r,j)=>{const fr=new FileReader();fr.onload=()=>r(fr.result);fr.onerror=j;fr.readAsDataURL(b);});
function mkIco(t,l,fn,dis,cls){const b=document.createElement("button");b.type="button";b.className="ico"+(cls?" "+cls:"");b.textContent=t;b.title=l;b.setAttribute("aria-label",l);b.disabled=!!dis;b.addEventListener("click",fn);return b;}
function openDlg(d){if(d.showModal)d.showModal();else d.setAttribute("open","");}
function closeDlg(d){if(d.close)d.close();else d.removeAttribute("open");}
function ask({title,msg="",input=null,yes="OK"}){
  return new Promise(res=>{
    const d=$("askDlg");$("askTitle").textContent=title;$("askMsg").textContent=msg;$("askMsg").hidden=!msg;
    const inp=$("askInput");inp.hidden=input===null;inp.value=input||"";$("askYes").textContent=yes;
    const done=v=>{d.onclose=null;closeDlg(d);$("askYes").onclick=$("askNo").onclick=null;res(v);};
    $("askYes").onclick=()=>done(input===null?true:inp.value.trim());
    $("askNo").onclick=()=>done(null);
    inp.onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();$("askYes").click();}};
    d.onclose=()=>res(null);
    openDlg(d);if(input!==null)setTimeout(()=>{inp.focus();inp.select();},30);
  });
}
/* Download: link temporário (funciona em qualquer navegador) */
function saveBlob(blob,filename){
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
}

/* Cache de imagens: cada endereço carrega uma vez; ao terminar, redesenha */
const imgs=new Map();
function img(src){
  if(!src)return null;
  let e=imgs.get(src);
  if(!e){const im=new Image();e={im,ok:false,err:false};imgs.set(src,e);
    im.onload=()=>{e.ok=true;onImgLoaded();};
    /* Se o endereço do site falhar (arquivo ainda não publicado no Pages, ou
       aberto fora do GitHub Pages) e a chave estiver conectada, busca o
       arquivo direto no repositório. */
    im.onerror=()=>{
      if(!e.tried&&gh.on&&/^(logos|dados)\//.test(src)){e.tried=true;
        repoFileUrl(src.split("/").map(decodeURIComponent).join("/")).then(u=>{if(u)im.src=u;else e.err=true;}).catch(()=>{e.err=true;});}
      else e.err=true;};
    im.decoding="async";im.src=src;}
  return e.ok?e.im:null;
}
/* Arquivo do repositório como endereço local (blob), via API — funciona com repositório privado */
async function repoFileUrl(path){
  const d=await ghApi("/repos/"+gh.repo+"/contents/"+path.split("/").map(encodeURIComponent).join("/")+"?ref="+encodeURIComponent(gh.branch));
  let bytes;
  if(d.content&&(!d.encoding||d.encoding==="base64"))bytes=Uint8Array.from(atob(d.content.replace(/\s/g,"")),c=>c.charCodeAt(0));
  else if(d.sha){const bl=await ghApi("/repos/"+gh.repo+"/git/blobs/"+d.sha);bytes=Uint8Array.from(atob(bl.content.replace(/\s/g,"")),c=>c.charCodeAt(0));}
  else return null;
  const ext=path.split(".").pop().toLowerCase();
  return URL.createObjectURL(new Blob([bytes],{type:ext==="png"?"image/png":ext==="webp"?"image/webp":"image/jpeg"}));
}
/* Imagens que falharam ganham nova chance quando a chave é conectada */
function retryFailedImgs(){for(const [k,e] of imgs)if(e.err&&!e.tried)imgs.delete(k);}
let imgT;function onImgLoaded(){clearTimeout(imgT);imgT=setTimeout(()=>{footerChanged(false,true);renderSideThumbs();renderDbDocs();renderDbLogos();if($("pickDlg").open&&pickRender)pickRender();},30);}

/* =========================================================
   Estado
   ---------------------------------------------------------
   Todo o trabalho em andamento vive em “state” (marca, textos,
   doutores, imagem de fundo, ajustes por formato, rodapé, formatos
   personalizados). Fica salvo no IndexedDB DESTE navegador pela
   função save(). O banco compartilhado (cores, doutores…) fica em
   “bank”, que vem do repositório (Parte 3).
   ========================================================= */
function freshFooter(brand="oncologia"){
  return{settings:{...FDEF},active:"s3",importSrc:null,useImport:false,sections:[
    {id:"s1",title:"Realização",logos:brandLogos(brand).map(ref=>({ref,scale:1}))},
    {id:"s2",title:"Patrocínio",logos:[]},
    {id:"s3",title:"Apoio educacional",logos:[]}]};
}
function freshState(){
  return{v:5,tab:"content",cpFmt:"feed_cta",disc:{...DEFAULT_DISC},flow:{...DEFAULT_FLOW},footScale:1,headScale:1,siteShade:{on:false,a:.4},brand:"oncologia",tagText:"Oncologia",tagUpper:true,eventTag:"",
    headline:"<b>BREAKWATER</b> reforça importância da terapia-alvo no câncer colorretal metastático com mutação BRAF V600E",
    subtitle:"",cta:"ASSISTA AGORA",zoom:24,docGap:1,dotsK:1,
    bg:{src:null,g:{cx:.5,cy:.5,z:1},per:{}},
    docs:[{id:uid(),name:"Dr. Fabio Kater",crm:"CRM: 99.002",src:null,cx:.5,cy:.42,z:1},
          {id:uid(),name:"Dr. Pedro Uson",crm:"CRM-SP: 148243",src:null,cx:.5,cy:.42,z:1}],
    off:{},customFormats:[],hiddenFormats:[],
    footer:freshFooter()};
}
let state=null;   /* criado em init(), depois que todas as declarações existem */
let sel=null;
function O(fid,el){const a=state.off[fid]||(state.off[fid]={});return a[el]||(a[el]={x:0,y:0,s:1,w:1});}
function isHidden(f,el){const a=state.off[f.id];const o=a&&a[el];if(o&&typeof o.hide==="boolean")return o.hide;return !!(f.hide&&f.hide.includes(el));}
function frameFor(fid){return state.bg.per[fid]||state.bg.g;}

/* Cores e sombra em uso: as do banco, ou o rascunho do administrador
   enquanto ele edita (antes de publicar) */
const C=()=>colorDraft||bank.colors;
const LOOK=()=>lookDraft||bank.look;
function BR(){const c=C()[state.brand]||DEFAULT_COLORS[state.brand];const m=BRAND_META[state.brand];
  return{...m,primary:c.dark,tagFill:c.dark,accent:c.light,ctaA:c.dark,ctaB:c.light,ph:[mix(c.dark,"#ffffff",.12),mix(c.dark,"#000000",.62)]};}

const IDB={p:null,
  open(){if(!this.p)this.p=new Promise((res,rej)=>{try{const r=indexedDB.open("gerador-artes",1);r.onupgradeneeded=()=>r.result.createObjectStore("kv");r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}catch(e){rej(e);}});return this.p;},
  async get(k){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction("kv").objectStore("kv").get(k);t.onsuccess=()=>res(t.result);t.onerror=()=>rej(t.error);});},
  async set(k,v){const db=await this.open();return new Promise((res,rej)=>{const t=db.transaction("kv","readwrite");t.objectStore("kv").put(v,k);t.oncomplete=()=>res();t.onerror=()=>rej(t.error);});}};
let saveT;function save(){clearTimeout(saveT);saveT=setTimeout(()=>{IDB.set("state",JSON.parse(JSON.stringify(state))).catch(()=>{});},500);}

/* =========================================================
   Biblioteca de logos (a mesma em todas as abas)
   ---------------------------------------------------------
   Junta em “lib”: os logos do logos.json (grupo e farmacêuticas,
   inclusive vagas sem arquivo) e os logos locais enviados por quem
   não é administrador (ficam só no navegador dela).
   Ids: grupo → "g_" + nome sem acento/espaço (ex.: g_tribemd);
        farmacêutica → "f_" + nome com hífens (ex.: f_daiichi-sankyo).
   ========================================================= */
const lib=new Map();
let GROUP_LOGOS=[],PHARMA_LOGOS=[],TEMPLATES=[];
let localLogos=[];
const LOCAL_KEY="rodape-logos-locais-v1";   // mesma chave do Gerador de rodapé
/* Imagens publicadas nesta sessão: enquanto o Pages não republica,
   a imagem vem daqui (endereço → data URL) */
const pendingSrc={};
const fileSrc=path=>pendingSrc[path]||path.split("/").map(encodeURIComponent).join("/");

function applyManifest(m){
  const gid=n=>"g_"+slug(n).replace(/-/g,"");
  const fid=n=>"f_"+slug(n);
  GROUP_LOGOS=(m.grupo||[]).filter(x=>x&&x.nome&&x.arquivo).map(x=>({id:gid(x.nome),name:x.nome,src:fileSrc("logos/grupo/"+x.arquivo)}));
  PHARMA_LOGOS=(m.farmaceuticas||[]).filter(x=>x&&x.nome).map(x=>({id:fid(x.nome),name:x.nome,src:x.arquivo?fileSrc("logos/farmaceuticas/"+x.arquivo):null}));
  const byName=new Map([...GROUP_LOGOS,...PHARMA_LOGOS].map(l=>[slug(l.name),l.id]));
  TEMPLATES=(m.templates||[]).map(t=>({name:t.nome,logos:(t.realizacao||[]).map(n=>byName.get(slug(n))).filter(Boolean)})).filter(t=>t.name&&t.logos.length);
}
function rebuildLib(){
  lib.clear();
  GROUP_LOGOS.forEach(l=>lib.set(l.id,{...l,group:"grupo",builtin:true}));
  PHARMA_LOGOS.forEach(l=>lib.set(l.id,{...l,group:"farma",builtin:!!l.src}));
  localLogos.forEach(d=>{const prev=lib.get(d.id);lib.set(d.id,{id:d.id,name:d.name||(prev&&prev.name)||"Logo",group:d.group==="grupo"?"grupo":"farma",src:d.dataUrl,local:true});});
}
function loadLocalLogos(){try{localLogos=JSON.parse(localStorage.getItem(LOCAL_KEY)||"[]");}catch(e){localLogos=[];}}
function saveLocalLogos(){try{localStorage.setItem(LOCAL_KEY,JSON.stringify(localLogos));return true;}catch(e){return false;}}
function libItems(filter,q){
  const order={grupo:0,farma:1};q=slug(q||"");
  return[...lib.values()].filter(l=>(filter==="all"||l.group===filter)&&(!q||slug(l.name).includes(q)))
    .sort((a,b)=>(order[a.group]-order[b.group])||((!!b.src)-(!!a.src))||a.name.localeCompare(b.name,"pt-BR"));
}
/* Logos da “Realização” de uma marca: o template do logos.json com o
   mesmo nome; se não existir, os logos padrão da marca */
function brandLogos(id){const m=BRAND_META[id];const t=TEMPLATES.find(t=>slug(t.name)===slug(m.tpl));return t?t.logos.slice():m.fallback.slice();}

/* =========================================================
   Motor do rodapé (o mesmo do Gerador de rodapé)
   ---------------------------------------------------------
   Calcula o tamanho de cada logo e monta o rodapé em um de 3 modos:
     row    → seções lado a lado, título acima
     inline → título AO LADO dos logos (rodapé fino, até 1920 px)
     stack  → seções empilhadas
   e reduz tudo até caber (1080 × 600, ou 1920 de largura no fino).
   fLayout() recebe qualquer rodapé (o atual ou um salvo no banco).
   footerChanged() é o ponto único que avisa todas as abas.
   ========================================================= */
const mctx=document.createElement("canvas").getContext("2d");
function fTitle(S,s){return S.upper?(s.title||"").toLocaleUpperCase("pt-BR"):(s.title||"");}
function fSetFont(ctx,S,size){ctx.font=`${S.titleWeight} ${size}px ${FONT}`;try{ctx.letterSpacing=S.upper?(size*.08)+"px":"0px";}catch(e){}}
function fPrepared(F){
  return F.sections.map(s=>({s,items:s.logos.map(it=>{const l=lib.get(it.ref);if(!l||!l.src)return null;const im=img(l.src);
    const a=im?im.naturalWidth/im.naturalHeight:3;return{it,l,img:im,a:a||3};}).filter(Boolean)})).filter(x=>x.items.length);
}
function fSizeItem(x,lh,mw){let h=lh*x.it.scale,w=h*x.a;const cap=mw*x.it.scale;if(w>cap){w=cap;h=w/x.a;}return{w,h};}
function fBuild(S,secs,mode,k){
  const lh=S.logoH*k,mw=S.maxW*k,gap=S.gap*k,pad=S.pad*k,sg=S.secGap*k,ts=S.titleSize*k,lw=S.lineW;
  fSetFont(mctx,S,ts);
  const anyTitle=secs.some(x=>fTitle(S,x.s).trim());
  const tH=anyTitle?ts*1.25:0,tGap=anyTitle?Math.max(6,ts*.9):0;
  const els=[];
  const blocks=secs.map(x=>{const t=fTitle(S,x.s).trim();return{x,t,tw:t?mctx.measureText(t).width:0,sizes:x.items.map(i=>fSizeItem(i,lh,mw))};});
  let W,H;
  if(mode==="inline"){
    /* Título ao lado: até 2 linhas, centralizado na altura dos logos */
    const padY=pad*.55,padX=pad*1.8,tGapX=Math.max(10,ts*1.6),lineH=ts*1.2;
    blocks.forEach(b=>{
      b.cw=b.sizes.reduce((a,z)=>a+z.w,0)+gap*(b.sizes.length-1);b.mh=Math.max(...b.sizes.map(z=>z.h));b.lines=[];
      if(b.t){const words=b.t.split(/\s+/);const limit=Math.max(ts*7,...words.map(w=>mctx.measureText(w).width));let cur="";
        words.forEach(w=>{const test=cur?cur+" "+w:w;if(cur&&b.lines.length<1&&mctx.measureText(test).width>limit){b.lines.push(cur);cur=w;}else cur=test;});
        if(cur)b.lines.push(cur);}
      b.tw2=b.lines.length?Math.max(...b.lines.map(l=>mctx.measureText(l).width)):0;b.th=b.lines.length*lineH;
      b.w=(b.tw2?b.tw2+tGapX:0)+b.cw;
    });
    const band=Math.max(...blocks.map(b=>Math.max(b.mh,b.th)));
    W=2*padX+blocks.reduce((a,b)=>a+b.w,0)+(blocks.length-1)*(2*sg+lw);
    if(S.fill&&W<FMAXW_INLINE){const extra=(FMAXW_INLINE-W)/blocks.length;blocks.forEach(b=>b.extra=extra);W=FMAXW_INLINE;}
    H=2*padY+band;
    let x=padX;
    blocks.forEach((b,i)=>{
      const extra=b.extra||0;let cx=x+extra/2;
      if(b.lines.length){els.push({type:"text",text:b.lines.join(" "),lines:b.lines,lh:lineH,x:cx,y:padY+(band-b.th)/2,h:b.th,w:b.tw2,align:"left",size:ts});cx+=b.tw2+tGapX;}
      b.x.items.forEach((it,j)=>{const z=b.sizes[j];els.push({type:"logo",img:it.img,name:it.l.name,x:cx,y:padY+(band-z.h)/2,w:z.w,h:z.h});cx+=z.w+gap;});
      x+=b.w+extra;
      if(i<blocks.length-1){if(lw>0)els.push({type:"line",x:x+sg,y:padY,w:lw,h:band});x+=2*sg+lw;}
    });
  }else if(mode==="row"){
    blocks.forEach(b=>{b.cw=b.sizes.reduce((a,z)=>a+z.w,0)+gap*(b.sizes.length-1);b.w=Math.max(b.cw,b.tw);b.mh=Math.max(...b.sizes.map(z=>z.h));});
    const band=Math.max(...blocks.map(b=>b.mh));
    W=2*pad+blocks.reduce((a,b)=>a+b.w,0)+(blocks.length-1)*(2*sg+lw);
    if(S.fill&&W<FMAXW){const extra=(FMAXW-W)/blocks.length;blocks.forEach(b=>b.w+=extra);W=FMAXW;}
    H=2*pad+tH+tGap+band;
    let x=pad;
    blocks.forEach((b,i)=>{
      if(b.t)els.push({type:"text",text:b.t,x:S.align==="center"?x+b.w/2:x,y:pad,h:tH,w:b.tw,align:S.align,size:ts});
      let lx=S.align==="center"?x+(b.w-b.cw)/2:x;
      b.x.items.forEach((it,j)=>{const z=b.sizes[j];els.push({type:"logo",img:it.img,name:it.l.name,x:lx,y:pad+tH+tGap+(band-z.h)/2,w:z.w,h:z.h});lx+=z.w+gap;});
      x+=b.w;
      if(i<blocks.length-1){if(lw>0)els.push({type:"line",x:x+sg,y:pad,w:lw,h:H-2*pad});x+=2*sg+lw;}
    });
  }else{
    const inner=FMAXW-2*pad,gy=gap*.7;
    blocks.forEach(b=>{
      const rows=[];let cur=[],cw=0;
      b.sizes.forEach((z,j)=>{const add=(cur.length?gap:0)+z.w;if(cur.length&&cw+add>inner){rows.push({items:cur,w:cw});cur=[];cw=0;}cw+=(cur.length?gap:0)+z.w;cur.push(j);});
      if(cur.length)rows.push({items:cur,w:cw});
      rows.forEach(r=>r.h=Math.max(...r.items.map(j=>b.sizes[j].h)));
      b.rows=rows;b.w=Math.max(b.tw,...rows.map(r=>r.w));
      b.bh=(b.t?tH+tGap:0)+rows.reduce((a,r)=>a+r.h,0)+gy*(rows.length-1);
    });
    W=S.fill?FMAXW:Math.min(FMAXW,2*pad+Math.max(...blocks.map(b=>b.w)));
    const iw=W-2*pad;
    H=2*pad+blocks.reduce((a,b)=>a+b.bh,0)+(blocks.length-1)*(2*sg+lw);
    let y=pad;
    blocks.forEach((b,i)=>{
      if(b.t){els.push({type:"text",text:b.t,x:S.align==="center"?pad+iw/2:pad,y,h:tH,w:b.tw,align:S.align,size:ts});y+=tH+tGap;}
      b.rows.forEach((r,ri)=>{
        let lx=S.align==="center"?pad+(iw-r.w)/2:pad;
        r.items.forEach(j=>{const z=b.sizes[j],it=b.x.items[j];els.push({type:"logo",img:it.img,name:it.l.name,x:lx,y:y+(r.h-z.h)/2,w:z.w,h:z.h});lx+=z.w+gap;});
        y+=r.h+(ri<b.rows.length-1?gy:0);
      });
      if(i<blocks.length-1){if(lw>0)els.push({type:"line",x:pad,y:y+sg,w:iw,h:lw});y+=2*sg+lw;}
    });
  }
  W=Math.ceil(W);H=Math.ceil(H);
  return{W,H,els,k,mode,S,fits:W<=(mode==="inline"?FMAXW_INLINE:FMAXW)&&H<=FMAXH};
}
function fLayout(F){
  const secs=fPrepared(F);if(!secs.length)return null;
  const S={...FDEF,...F.settings};const modes=S.layout==="auto"?["row","stack"]:[S.layout];
  let last;
  for(let k=1;k>=.3;k=Math.round((k-.025)*1000)/1000){for(const m of modes){last=fBuild(S,secs,m,k);if(last.fits)return last;}}
  return last;
}
function fDrawEl(ctx,e,S,ox=0,oy=0){
  if(e.type==="bg"){ctx.fillStyle=S.bg;rr(ctx,e.x-ox,e.y-oy,e.w,e.h,S.radius);ctx.fill();}
  else if(e.type==="line"){ctx.fillStyle=S.lineColor;ctx.fillRect(e.x-ox,e.y-oy,e.w,e.h);}
  else if(e.type==="text"){fSetFont(ctx,S,e.size);ctx.fillStyle=S.titleColor;ctx.textBaseline="middle";ctx.textAlign=e.align==="center"?"center":"left";
    if(e.lines&&e.lines.length>1)e.lines.forEach((ln,i)=>ctx.fillText(ln,e.x-ox,e.y+e.lh*(i+.5)-oy));
    else ctx.fillText(e.text,e.x-ox,e.y+e.h/2-oy);
    try{ctx.letterSpacing="0px";}catch(_){}}
  else if(e.type==="logo"&&e.img){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(e.img,e.x-ox,e.y-oy,e.w,e.h);}
}
function fDrawAll(ctx,L){fDrawEl(ctx,{type:"bg",x:0,y:0,w:L.W,h:L.H},L.S);L.els.forEach(e=>fDrawEl(ctx,e,L.S));}
function fCanvas(L){const c=document.createElement("canvas");c.width=L.W;c.height=L.H;fDrawAll(c.getContext("2d"),L);return c;}

/* Rodapé atual (o mesmo em todas as abas) */
let footerDirty=true,footerL=null,footerCache=null;
function footerLayout(){if(footerDirty){footerDirty=false;footerL=fLayout(state.footer);footerCache=footerL?fCanvas(footerL):null;}return footerL;}
function footerCanvas(){
  if(state.footer.useImport&&state.footer.importSrc)return img(state.footer.importSrc);
  footerLayout();return footerCache;
}
function realizacao(){let s=state.footer.sections.find(x=>slug(x.title).includes("realiza"));
  if(!s){s={id:"s"+uid(),title:"Realização",logos:[]};state.footer.sections.unshift(s);}return s;}
function footerChanged(structural,quiet){
  footerDirty=true;if(!quiet)save();
  if(structural){renderFtSecs();renderNewsFooterUI();}
  scheduleFt();drawNewsFooterPreview();scheduleAll();
}

/* =========================================================
   ABA RODAPÉ – interface do Gerador de rodapé
   ---------------------------------------------------------
   Biblioteca (pesquisa, filtros, arrastar; no modo administrador,
   “Trocar” e “Remover” em cada logo), seções, controles rápidos
   (Título acima / Título ao lado + arredondamento), ajustes,
   templates, prévia, quadro de vídeo e exportação PNG/PSD.
   ========================================================= */
let ftFilter="all";
function renderFtLib(){
  const box=$("ftLib");box.textContent="";
  const add=document.createElement("button");add.type="button";add.className="ltile add";
  add.innerHTML='<span class="plus">+</span><span></span>';
  add.lastChild.textContent=gh.on?(ftFilter==="grupo"?"Publicar logo do grupo":ftFilter==="farma"?"Publicar farmacêutica":"Publicar novo logo")
                                 :(ftFilter==="grupo"?"Novo logo do grupo":ftFilter==="farma"?"Nova farmacêutica":"Novo logo");
  add.addEventListener("click",()=>openUpload({group:ftFilter==="grupo"?"grupo":"farma",name:$("ftQ").value.trim()}));
  box.append(add);
  const items=libItems(ftFilter,$("ftQ").value);
  if(!items.length){const p=document.createElement("p");p.className="note";p.style.gridColumn="1/-1";p.textContent="Nenhum logo com esse nome. Use “+ Novo logo” para adicioná-lo.";box.append(p);return;}
  items.forEach(l=>box.append(logoTile(l,{onPick:()=>ftAddToActive(l.id),draggable:true})));
}
/* Bloco de um logo. Logos locais têm “×”; no modo administrador, os
   logos do banco têm “Trocar” e “Remover” (valem para todos). */
function logoTile(l,{onPick,draggable}){
  const t=document.createElement("div");t.className="ltile"+(l.src?"":" missing");t.tabIndex=0;t.title=l.name;
  if(l.src){
    const im=document.createElement("img");im.alt=l.name;im.src=l.src;im.loading="lazy";t.append(im);
    const nm=document.createElement("div");nm.className="nm";nm.textContent=l.name+(l.local?" · só neste navegador":"");t.append(nm);
    if(draggable){t.draggable=true;t.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/x-logo",l.id);e.dataTransfer.effectAllowed="copy";});}
    if(onPick){t.addEventListener("click",onPick);t.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onPick();}});}
    if(l.local){
      const x=document.createElement("button");x.className="x";x.type="button";x.textContent="×";x.setAttribute("aria-label","Excluir "+l.name);
      x.addEventListener("click",e=>{e.stopPropagation();
        if(!x.classList.contains("confirm")){x.classList.add("confirm");x.textContent="Excluir?";setTimeout(()=>{x.classList.remove("confirm");x.textContent="×";},2600);return;}
        deleteLocalLogo(l);});
      t.append(x);
    }
    if(gh.on&&l.builtin){
      t.classList.add("has-adm");
      const bar=document.createElement("div");bar.className="adm";
      const tr=document.createElement("button");tr.type="button";tr.textContent="Trocar";
      tr.addEventListener("click",e=>{e.stopPropagation();openUpload({replace:l,name:l.name,group:l.group});});
      const rm=document.createElement("button");rm.type="button";rm.className="rm";rm.textContent="Remover";
      rm.addEventListener("click",e=>{e.stopPropagation();
        if(!rm.classList.contains("confirm")){rm.classList.add("confirm");rm.textContent="Confirmar?";setTimeout(()=>{rm.classList.remove("confirm");rm.textContent="Remover";},2600);return;}
        adminRemoveLogo(l);});
      bar.append(tr,rm);t.append(bar);
    }
  }else{
    const b=document.createElement("b");b.textContent=l.name;const s=document.createElement("span");s.textContent=gh.on?"Publicar logo":"Enviar logo";t.append(b,s);
    const open=()=>openUpload({slot:l.id,name:l.name});
    t.addEventListener("click",open);t.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  }
  return t;
}
function ftAddToActive(ref){
  const F=state.footer;let sec=F.sections.find(s=>s.id===F.active)||F.sections[0];
  if(!sec){sec={id:"s"+uid(),title:"Nova seção",logos:[]};F.sections.push(sec);F.active=sec.id;}
  sec.logos.push({ref,scale:1});footerChanged(true);
  const l=lib.get(ref);toast("“"+(l?l.name:"Logo")+"” adicionado a “"+(sec.title||"seção")+"”",1800);
}
let dragChip=null;
function renderFtSecs(){
  const F=state.footer;const box=$("ftSecs");box.textContent="";
  F.sections.forEach((sec,si)=>{
    const card=document.createElement("section");card.className="f-sec"+(F.active===sec.id?" active":"");
    card.addEventListener("pointerdown",()=>{if(F.active!==sec.id){F.active=sec.id;save();document.querySelectorAll(".f-sec").forEach(c=>c.classList.toggle("active",c===card));}});
    const top=document.createElement("div");top.className="f-sec-top";
    const inp=document.createElement("input");inp.className="f-sec-title";inp.value=sec.title;inp.placeholder="Título (opcional)";inp.setAttribute("aria-label","Título da seção");
    inp.addEventListener("input",()=>{sec.title=inp.value;footerChanged(false);renderNewsFooterUI();});
    top.append(inp,
      mkIco("‹","Mover para a esquerda",()=>{F.sections.splice(si,1);F.sections.splice(si-1,0,sec);footerChanged(true);},si===0),
      mkIco("›","Mover para a direita",()=>{F.sections.splice(si,1);F.sections.splice(si+1,0,sec);footerChanged(true);},si===F.sections.length-1),
      mkIco("×","Excluir seção",()=>{F.sections.splice(si,1);if(F.active===sec.id)F.active=F.sections[0]&&F.sections[0].id;footerChanged(true);},false,"del"));
    const zone=document.createElement("div");zone.className="zone";
    if(!sec.logos.length){const h=document.createElement("div");h.className="hint";h.textContent="Arraste logos para cá";zone.append(h);}
    sec.logos.forEach((it,li)=>{
      const l=lib.get(it.ref);
      const c=document.createElement("div");c.className="chip";c.draggable=true;c.title=l?l.name:"Logo removido";
      const th=document.createElement("div");th.className="th";
      if(l&&l.src){const im=document.createElement("img");im.src=l.src;im.alt="";th.append(im);}else{th.textContent=l?l.name:"Logo removido";th.style.fontSize="11px";}
      const sc=document.createElement("span");sc.className="sc";sc.textContent=Math.round(it.scale*100)+"%";
      const setS=d=>{it.scale=clamp(Math.round((it.scale+d)*10)/10,.4,2);sc.textContent=Math.round(it.scale*100)+"%";footerChanged(false);};
      c.append(th,mkIco("−","Diminuir logo",()=>setS(-.1)),sc,mkIco("+","Aumentar logo",()=>setS(.1)),
        mkIco("×","Remover do rodapé",()=>{sec.logos.splice(li,1);footerChanged(true);},false,"del"));
      c.addEventListener("dragstart",e=>{dragChip={si,li};e.dataTransfer.setData("text/x-chip","1");e.dataTransfer.effectAllowed="move";c.classList.add("dragging");});
      c.addEventListener("dragend",()=>{dragChip=null;c.classList.remove("dragging");});
      c.addEventListener("dragover",e=>{e.preventDefault();c.classList.add("drop-before");});
      c.addEventListener("dragleave",()=>c.classList.remove("drop-before"));
      c.addEventListener("drop",e=>{e.preventDefault();e.stopPropagation();c.classList.remove("drop-before");zone.classList.remove("over");ftHandleDrop(e,sec,li);});
      zone.append(c);
    });
    zone.addEventListener("dragover",e=>{e.preventDefault();zone.classList.add("over");});
    zone.addEventListener("dragleave",e=>{if(!zone.contains(e.relatedTarget))zone.classList.remove("over");});
    zone.addEventListener("drop",e=>{e.preventDefault();zone.classList.remove("over");ftHandleDrop(e,sec,sec.logos.length);});
    card.append(top,zone);box.append(card);
  });
  ftMarkTemplate();
}
function ftHandleDrop(e,sec,index){
  const F=state.footer;const ref=e.dataTransfer.getData("text/x-logo");
  if(ref){sec.logos.splice(index,0,{ref,scale:1});F.active=sec.id;footerChanged(true);return;}
  if(dragChip){const from=F.sections[dragChip.si];const [it]=from.logos.splice(dragChip.li,1);
    if(from===sec&&dragChip.li<index)index--;sec.logos.splice(index,0,it);dragChip=null;footerChanged(true);}
}
const FT_RANGES=["logoH","maxW","gap","secGap","pad","radius","titleSize","lineW","vMargin"];
function syncFtSettings(){
  const S=state.footer.settings;
  FT_RANGES.forEach(k=>{$("s_"+k).value=S[k];$("o_"+k).textContent=S[k]+" px";});
  $("s_layout").value=S.layout;$("s_fill").checked=S.fill;$("s_titleWeight").value=S.titleWeight;$("s_align").value=S.align;$("s_upper").checked=S.upper;
  ["titleColor","lineColor","bg"].forEach(k=>$("s_"+k).value=S[k]);
  $("q_radius").value=S.radius;$("oq_radius").textContent=S.radius+" px";
  document.querySelectorAll("#ftSeg button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.layout===S.layout?"true":"false"));
}
function renderSwatches(){
  const c=C();const list=[c.black,c.tribemd.dark,c.tribemd.light,c.oncologia.dark,c.oncologia.light,c.hemo.dark,c.hemo.light,"#7f7f7f","#ffffff",c.white];
  document.querySelectorAll(".swatches").forEach(w=>{w.textContent="";
    [...new Set(list)].forEach(col=>{const b=document.createElement("button");b.type="button";b.className="sw";b.style.background=col;b.setAttribute("aria-label",col);b.title=col;
      b.addEventListener("click",()=>{const k=w.dataset.for.slice(2);state.footer.settings[k]=col;$(w.dataset.for).value=col;footerChanged(false);});w.append(b);});});
}
function ftMarkTemplate(){const s=state.footer.sections.find(x=>slug(x.title).includes("realiza"));const cur=s?s.logos.map(l=>l.ref).join(","):"";
  document.querySelectorAll(".tpl-btn").forEach(b=>b.setAttribute("aria-pressed",b.dataset.key===cur?"true":"false"));}
function renderFtTemplates(){const g=$("ftTpl");g.textContent="";
  TEMPLATES.forEach(t=>{const b=document.createElement("button");b.type="button";b.className="tpl-btn";b.dataset.key=t.logos.join(",");b.textContent=t.name;
    b.title="Realização: "+t.logos.map(id=>(lib.get(id)||{}).name).join(" + ");
    b.addEventListener("click",()=>{const s=realizacao();s.logos=t.logos.map(ref=>({ref,scale:1}));const next=state.footer.sections.find(x=>x!==s);state.footer.active=(next||s).id;footerChanged(true);toast("Template “"+t.name+"” aplicado em “Realização”.",2200);});
    g.append(b);});ftMarkTemplate();}

let ftRq=null;
function scheduleFt(){if(ftRq)return;ftRq=requestAnimationFrame(()=>{ftRq=null;if(state.tab==="foot")ftRender();});}
/* =========================================================
   Rodapé completo = rodapé + disclaimer logo abaixo
   ---------------------------------------------------------
   É o mesmo bloco que aparece nas artes: o disclaimer tem o tamanho,
   peso, cor e itálico escolhidos, na proporção que ganha no Feed
   (1080 px), sempre centralizado. Com o “fundo preto transparente do
   disclaimer” ligado, a pílula escura aparece aqui também.
   Usado na prévia da aba Rodapé, no quadro 1920 × 1080, nos downloads
   e na prévia do passo 5 da aba Conteúdo.
   ========================================================= */
function fullFooter(src,onlyDisc){
  const fw=src.width||src.naturalWidth,fh=src.height||src.naturalHeight;
  const DS=state.disc||DEFAULT_DISC;const txt=(DS.text||"").trim();
  const F=BASE_FORMATS.find(x=>x.id==="feed").foot;const k=Math.min(F.maxW/fw,F.maxH/fh,1.2);
  let d=null,W=fw,H=fh;
  if(txt){
    const fs=DS.size/k,lh=fs*1.3,maxW=fw;   /* mesma largura do bloco branco do rodapé */const font=`${DS.italic?"italic ":""}${DS.weight} ${fs}px ${FONT}`;
    const lines=wrapPlain(DS.text,font,maxW);const dh=lines.length*lh;
    const shaded=!!(state.siteShade&&state.siteShade.on);const gap=fs*(shaded?1.4:.7);
    const tw=Math.max(...lines.map(L=>L.w)),px=fs*.9,py=fs*.45;
    W=Math.ceil(Math.max(fw,tw+2*px+4));H=Math.ceil(fh+gap+dh+(shaded?py:0)+2);
    const CC=C();const col=DS.color==="black"?CC.black:DS.color==="white"?CC.white:DS.color==="gray"?"#7f7f7f":DS.color==="brand"?BR().primary:(shaded?CC.white:mix(CC.black,CC.white,.15));
    d={fs,lh,font,lines,dh,shaded,tw,px,py,y:fh+gap,col};
  }
  const c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const fx=(W-fw)/2;
  if(!onlyDisc)x.drawImage(src,fx,0);
  if(d){
    if(d.shaded){const a=state.siteShade.a;x.fillStyle=`rgba(0,0,0,${a})`;const bh=d.dh+2*d.py;rr(x,W/2-d.tw/2-d.px,d.y-d.py,d.tw+2*d.px,bh,Math.min(bh/2,d.fs*.9));x.fill();}
    x.font=d.font;x.fillStyle=d.col;x.textBaseline="alphabetic";x.textAlign="center";
    d.lines.forEach((L,i)=>x.fillText(L.t,W/2,d.y+i*d.lh+d.fs*.95));
  }
  return{canvas:c,W,H,fx,hasDisc:!!d};
}
function ftVPos(L){const m=Math.min(state.footer.settings.vMargin,VH-L.H);return{x:Math.round((VW-L.W)/2),y:VH-L.H-m};}
function ftRender(){
  const L0=footerLayout();const cv=$("ftCv");
  const FF=L0?fullFooter(fCanvas(L0)):null;const L=L0&&{...L0,W:FF.W,H:FF.H};
  const off=!L;cv.hidden=off;$("ftEmpty").hidden=!off;["ftPngBtn","ftPsdBtn","ftVidBtn","ftSaveDb"].forEach(id=>$(id).disabled=off);
  const vc=$("ftVcv"),vx=vc.getContext("2d");vx.clearRect(0,0,vc.width,vc.height);
  if(off){$("ftDims").textContent="vazio";$("ftFit").textContent="";return;}
  const dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=Math.round(L.W*dpr);cv.height=Math.round(L.H*dpr);cv.style.width=L.W+"px";
  const ctx=cv.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,L.W,L.H);ctx.drawImage(FF.canvas,0,0);
  $("ftDims").textContent=L.W+" × "+L.H+" px";
  $("ftFit").textContent=L.k<1?"· logos reduzidos a "+Math.round(L.k*100)+"% para caber em "+(L.mode==="inline"?"1920 px de largura":"1080 × 600"):"";
  const p=ftVPos(L),s=vc.width/VW;vx.imageSmoothingEnabled=true;vx.imageSmoothingQuality="high";vx.drawImage(cv,p.x*s,p.y*s,L.W*s,L.H*s);
}
function ftVertical(L){const FF=fullFooter(fCanvas(L));const c=document.createElement("canvas");c.width=VW;c.height=VH;const p=ftVPos(FF);c.getContext("2d").drawImage(FF.canvas,p.x,p.y);return c;}
function wireFooterTab(){
  $("ftQ").addEventListener("input",renderFtLib);
  document.querySelectorAll("#ftFilters .tab").forEach(b=>b.addEventListener("click",()=>{ftFilter=b.dataset.f;document.querySelectorAll("#ftFilters .tab").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));renderFtLib();}));
  FT_RANGES.forEach(k=>$("s_"+k).addEventListener("input",e=>{state.footer.settings[k]=+e.target.value;$("o_"+k).textContent=e.target.value+" px";if(k==="radius")syncFtSettings();footerChanged(false);}));
  ["layout","titleWeight","align"].forEach(k=>$("s_"+k).addEventListener("change",e=>{state.footer.settings[k]=e.target.value;if(k==="titleWeight")document.fonts&&document.fonts.load(`${e.target.value} 20px Montserrat`).then(()=>footerChanged(false,true));syncFtSettings();footerChanged(false);}));
  ["fill","upper"].forEach(k=>$("s_"+k).addEventListener("change",e=>{state.footer.settings[k]=e.target.checked;footerChanged(false);}));
  ["titleColor","lineColor","bg"].forEach(k=>$("s_"+k).addEventListener("input",e=>{state.footer.settings[k]=e.target.value;footerChanged(false);}));
  /* Controles rápidos acima da prévia */
  document.querySelectorAll("#ftSeg button").forEach(b=>b.addEventListener("click",()=>{state.footer.settings.layout=b.dataset.layout;syncFtSettings();footerChanged(false);}));
  $("q_radius").addEventListener("input",e=>{state.footer.settings.radius=+e.target.value;syncFtSettings();footerChanged(false);});
  $("ftResetBtn").addEventListener("click",()=>{state.footer.settings={...FDEF};syncFtSettings();footerChanged(false);});
  $("ftAddSec").addEventListener("click",()=>{const s={id:"s"+uid(),title:"Nova seção",logos:[]};state.footer.sections.push(s);state.footer.active=s.id;footerChanged(true);});
  document.querySelectorAll("#tab-foot .ptabs button").forEach(b=>b.addEventListener("click",()=>{const p=b.dataset.pane;$("paneLib").hidden=p!=="lib";$("paneSet").hidden=p!=="set";
    document.querySelectorAll("#tab-foot .ptabs button").forEach(x=>x.setAttribute("aria-selected",x.dataset.pane===p?"true":"false"));}));
  $("ftPngBtn").addEventListener("click",()=>busy($("ftPngBtn"),"Gerando PNG…",async()=>{await fontsReady();footerDirty=true;const L=footerLayout();if(!L)return;saveBlob(await toBlob(fullFooter(fCanvas(L)).canvas),"rodape-"+stamp()+".png");}));
  $("ftVidBtn").addEventListener("click",()=>busy($("ftVidBtn"),"Gerando…",async()=>{await fontsReady();footerDirty=true;const L=footerLayout();if(!L)return;saveBlob(await toBlob(ftVertical(L)),"rodape-1920x1080-"+stamp()+".png");}));
  $("ftPsdBtn").addEventListener("click",()=>busy($("ftPsdBtn"),"Gerando PSD…",async()=>{
    const [ag,JSZip]=await Promise.all([loadScript(AGPSD_URL,"agPsd"),loadScript(JSZIP_URL,"JSZip")]);
    await fontsReady();footerDirty=true;const L=footerLayout();if(!L)return;const S=L.S;
    const layer=(name,e,bx,dx,dy)=>{const x=Math.floor(bx.x),y=Math.floor(bx.y),w=Math.max(1,Math.ceil(bx.x+bx.w)-x),h=Math.max(1,Math.ceil(bx.y+bx.h)-y);
      const c=document.createElement("canvas");c.width=w;c.height=h;fDrawEl(c.getContext("2d"),e,S,x,y);return{name,left:x+dx,top:y+dy,canvas:c};};
    const kidsAt=(dx,dy)=>{const kids=[layer("Fundo",{type:"bg",x:0,y:0,w:L.W,h:L.H},{x:0,y:0,w:L.W,h:L.H},dx,dy)];
      L.els.filter(e=>e.type==="line").forEach((e,i)=>kids.push(layer("Linha "+(i+1),e,e,dx,dy)));
      L.els.filter(e=>e.type==="text").forEach(e=>{const bx={x:(e.align==="center"?e.x-e.w/2:e.x)-4,y:e.y-2,w:e.w+8,h:e.h+4};kids.push(layer("Título – "+e.text,e,bx,dx,dy));});
      L.els.filter(e=>e.type==="logo"&&e.img).forEach(e=>kids.push(layer(e.name,e,e,dx,dy)));return kids;};
    const ab=r=>({rect:r,guideIndices:[],presetName:"Custom",color:{r:255,g:255,b:255},backgroundType:3});
    /* Prancheta = rodapé + disclaimer (camada própria) */
    const FF=fullFooter(fCanvas(L)),DO=FF.hasDisc?fullFooter(fCanvas(L),true):null;
    const withDisc=(dx,dy)=>{const k=kidsAt(dx+FF.fx,dy);if(DO)k.push({name:"Disclaimer",left:dx,top:dy,canvas:DO.canvas});return k;};
    const ax=FF.W+200,vp=ftVPos(FF),PW=ax+VW,PH=Math.max(FF.H,VH);
    const comp=document.createElement("canvas");comp.width=PW;comp.height=PH;const cc=comp.getContext("2d");cc.drawImage(FF.canvas,0,0);const vert=ftVertical(L);cc.drawImage(vert,ax,0);
    const psd={width:PW,height:PH,canvas:comp,children:[
      {name:"Rodapé "+FF.W+"×"+FF.H,opened:true,artboard:ab({top:0,left:0,bottom:FF.H,right:FF.W}),children:withDisc(0,0)},
      {name:"Vídeo 1920×1080",opened:true,artboard:ab({top:0,left:ax,bottom:VH,right:ax+VW}),children:withDisc(ax+vp.x,vp.y)}]};
    const zip=new JSZip();const name="rodape-"+stamp();
    zip.file(name+".psd",ag.writePsdUint8Array(psd,{generateThumbnail:true}));
    zip.file(name+".png",await toBlob(FF.canvas));zip.file(name+"-1920x1080.png",await toBlob(vert));
    saveBlob(await zip.generateAsync({type:"blob"}),name+".zip");
  }));
  $("ftSaveDb").addEventListener("click",saveFooterToDb);
}

/* =========================================================
   Envio de logos (janela compartilhada pelas abas)
   ---------------------------------------------------------
   1. limita a 1200 px (SVG ampliado até 4×)
   2. (opcional) remove o fundo branco sem deixar halo
   3. recorta as margens transparentes
   Depois: no modo administrador, publica no repositório para todos;
   sem a chave, salva só neste navegador.
   ========================================================= */
let upCtx=null,upBlob=null,upObjUrl=null;
function openUpload(opts={}){
  upCtx=opts;upBlob=null;$("upName").value=opts.name||"";$("upGroup").value=opts.group||"farma";
  $("upGroupField").hidden=!!(opts.slot||opts.replace);$("upPrev").hidden=true;$("upSave").disabled=$("upDownload").disabled=true;$("upNote").textContent="";
  $("upTitle").textContent=opts.replace?("Trocar logo – "+opts.replace.name):opts.slot?((gh.on?"Publicar logo – ":"Enviar logo – ")+opts.name):(gh.on?"Publicar logo":"Enviar logo");
  $("upSave").textContent=gh.on?"Publicar para todos":"Salvar logo";
  $("upLocalNote").textContent=gh.on?"Modo administrador: o logo é publicado no GitHub e aparece para todos em 1 a 2 minutos."
    :"O logo fica salvo só neste navegador. Para disponibilizar para todos, conecte a chave do GitHub (Área do administrador).";
  $("upFile").value="";openDlg($("upDlg"));
}
async function takeLogoFile(f){
  if(!/^image\//.test(f.type)&&!/\.(png|jpe?g|svg|webp)$/i.test(f.name)){$("upNote").textContent="Formato não suportado. Use PNG, JPG, SVG ou WEBP.";return;}
  upCtx.file=f;if(!$("upName").value.trim())$("upName").value=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ").trim();
  const url=URL.createObjectURL(f);
  try{
    const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url;});
    let w=im.naturalWidth||1000,h=im.naturalHeight||500;
    const m=1200/Math.max(w,h);if(m<1||/svg/.test(f.type)){const s=/svg/.test(f.type)?Math.min(m,4):m;w=Math.round(w*s);h=Math.round(h*s);}
    const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");x.drawImage(im,0,0,w,h);
    const id=x.getImageData(0,0,w,h),d=id.data;
    if($("upKey").checked){for(let i=0;i<d.length;i+=4){const mn=Math.min(d[i],d[i+1],d[i+2]);if(mn>215){const a=Math.max(0,Math.min(1,(250-mn)/35));const oa=d[i+3]/255;
      if(a<1&&a>0){for(let k=0;k<3;k++)d[i+k]=Math.max(0,Math.min(255,(d[i+k]-255*(1-a))/a));}d[i+3]=Math.round(255*a*oa);}}}
    let x0=w,y0=h,x1=-1,y1=-1;
    for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++){if(d[(yy*w+xx)*4+3]>8){if(xx<x0)x0=xx;if(xx>x1)x1=xx;if(yy<y0)y0=yy;if(yy>y1)y1=yy;}}
    if(x1<0){$("upNote").textContent="A imagem ficou vazia. Desmarque “Remover fundo branco” se o logo for branco.";upBlob=null;$("upSave").disabled=$("upDownload").disabled=true;return;}
    x.putImageData(id,0,0);
    const o=document.createElement("canvas");o.width=x1-x0+1;o.height=y1-y0+1;o.getContext("2d").drawImage(c,x0,y0,o.width,o.height,0,0,o.width,o.height);
    upBlob=await toBlob(o);if(upObjUrl)URL.revokeObjectURL(upObjUrl);upObjUrl=URL.createObjectURL(upBlob);
    $("upImg").src=upObjUrl;$("upPrev").hidden=false;$("upSave").disabled=$("upDownload").disabled=false;$("upNote").textContent="";
  }catch(e){$("upNote").textContent="Não foi possível ler essa imagem.";}
  finally{URL.revokeObjectURL(url);}
}
async function shrinkBlob(blob,maxW){const im=await createImageBitmap(blob);const s=Math.min(1,maxW/im.width);const c=document.createElement("canvas");c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);return toBlob(c);}
/* Sem chave: guarda o PNG neste navegador (localStorage) */
async function saveLocalLogo(){
  const name=$("upName").value.trim();
  const docId=upCtx.slot||("l_"+slug(name).slice(0,40)+"-"+uid());const group=upCtx.slot?"farma":$("upGroup").value;
  let b=upBlob,url=await blobToDataUrl(b);
  for(const w of[700,500,360]){if(url.length<350000)break;b=await shrinkBlob(upBlob,w);url=await blobToDataUrl(b);}
  localLogos=localLogos.filter(d=>d.id!==docId);localLogos.push({id:docId,name,group,dataUrl:url});
  const ok=saveLocalLogos();libChanged();
  toast(ok?"Logo “"+name+"” salvo neste navegador.":"Logo adicionado até recarregar a página (armazenamento do navegador cheio).",4000);
}
function deleteLocalLogo(l){
  localLogos=localLogos.filter(d=>d.id!==l.id);saveLocalLogos();
  state.footer.sections.forEach(s=>s.logos=s.logos.filter(it=>it.ref!==l.id||l.id.startsWith("f_")));
  libChanged();footerChanged(true);toast("Logo “"+l.name+"” excluído deste navegador.");
}
function wireUpload(){
  $("upCancel").addEventListener("click",()=>closeDlg($("upDlg")));$("upX").addEventListener("click",()=>closeDlg($("upDlg")));
  wireDrop($("upDrop"),$("upFile"),takeLogoFile,true);
  $("upKey").addEventListener("change",()=>{if(upCtx&&upCtx.file)takeLogoFile(upCtx.file);});
  $("upDownload").addEventListener("click",()=>{if(upBlob)saveBlob(upBlob,(slug($("upName").value)||"logo")+".png");});
  $("upSave").addEventListener("click",async()=>{
    const name=$("upName").value.trim();if(!name){$("upNote").textContent="Dê um nome ao logo para encontrá-lo depois.";$("upName").focus();return;}
    if(!upBlob)return;
    const btn=$("upSave");btn.disabled=true;btn.textContent=gh.on?"Publicando…":"Salvando…";
    try{
      if(gh.on){await adminPublishLogo(name);toast("“"+name+"” publicado. Aparece para todos em 1 a 2 minutos.",5000);}
      else await saveLocalLogo();
      closeDlg($("upDlg"));
    }catch(e){console.error(e);$("upNote").textContent=gh.on?ghError(e):"Não foi possível salvar. Tente de novo.";}
    finally{btn.disabled=false;btn.textContent=gh.on?"Publicar para todos":"Salvar logo";}
  });
}
function libChanged(){rebuildLib();renderFtLib();renderFtSecs();renderFtTemplates();renderDbLogos();renderNewsFooterUI();footerChanged(false,true);}

/* #####################################################################
   PARTE 2
   ##################################################################### */
/* =========================================================
   Formatos (inclui personalizados)
   ---------------------------------------------------------
   Monta a lista final de formatos: os de base + os personalizados, que são
   gerados por scaleFormat() adaptando um layout de base ao novo tamanho.
   ========================================================= */
let FORMATS=[],FMAP={};
function scaleFormat(b,w,h,id,name){
  const sx=w/b.w,sy=h/b.h,s=Math.min(sx,sy);
  const f=JSON.parse(JSON.stringify(b));Object.assign(f,{id,name,w,h,custom:true,base:b.id});
  const R=(o,kx,ky,ks)=>{if(!o)return;kx.forEach(k=>{if(o[k]!=null)o[k]*=sx;});ky.forEach(k=>{if(o[k]!=null)o[k]*=sy;});ks.forEach(k=>{if(o[k]!=null)o[k]*=s;});};
  R(f.img,["x","w"],["y","h"],[]);
  if(f.panel){R(f.panel,[],["y","y0","yc","sh"],[]);f.panel.lw=(f.panel.lw||1)*s;}
  R(f.circle,["cx"],["cy"],["r","band","lineW"]);
  R(f.tag,["x"],["y"],["h","fs"]);
  R(f.docs,["right","left"],["cy"],["d","gap","nameFs","crmFs"]);if(f.docs)R(f.docs.rows2,[],["cy","pitch"],["d"]);
  R(f.head,["x","w"],["y","maxH"],["fs"]);
  R(f.ctaBox,["cx"],["y"],["w","h","fs"]);
  R(f.foot,["cx","left","maxW"],["cy"],["maxH"]);
  R(f.news,[],["y"],[]);R(f.flow,[],["top","bottom"],[]);
  R(f.dots,["x0","x1","tx"],["y0","y1","ty"],["sp","rmax"]);
  return f;
}
function buildFormats(){
  FORMATS=[...BASE_FORMATS];
  state.customFormats.forEach(c=>{const b=BASE_FORMATS.find(x=>x.id===c.base)||BASE_FORMATS[0];FORMATS.push(scaleFormat(b,c.w,c.h,c.id,c.name));});
  FMAP=Object.fromEntries(FORMATS.map(f=>[f.id,f]));
}
const visibleFormats=()=>FORMATS.filter(f=>!state.hiddenFormats.includes(f.id));

/* =========================================================
   Texto rico
   ---------------------------------------------------------
   Lê o editor de texto (negrito com Ctrl + B), converte em linhas e trechos,
   quebra as linhas na largura do formato e desenha com alinhamento à
   esquerda, centralizado ou justificado (padrão: alinhado à esquerda;
   o justificado deixa a última linha alinhada à esquerda).
   ========================================================= */
function parseRichNode(root){
  const lines=[[]];const cur=()=>lines[lines.length-1];
  (function walk(node,bold){
    for(const n of node.childNodes){
      if(n.nodeType===3){const t=n.data.replace(/[\s\u00a0]+/g," ");if(t)cur().push({t,b:bold});}
      else if(n.nodeType===1){
        const tag=n.tagName;if(tag==="BR"){lines.push([]);continue;}
        const block=/^(DIV|P|LI|H\d)$/.test(tag);if(block&&cur().length)lines.push([]);
        let b=bold;if(tag==="B"||tag==="STRONG")b=true;
        const fw=n.style&&n.style.fontWeight;if(fw)b=fw==="bold"||fw==="bolder"||(+fw>=600);
        walk(n,b);if(block)lines.push([]);
      }
    }
  })(root,false);
  while(lines.length>1&&!lines[lines.length-1].length)lines.pop();
  return lines.map(runs=>{const out=[];runs.forEach(r=>{const l=out[out.length-1];if(l&&l.b===r.b)l.t+=r.t;else out.push({...r});});return out;});
}
const richCache=new Map();
function parseRich(html){
  if(richCache.has(html))return richCache.get(html);
  const t=document.createElement("template");t.innerHTML=html;const r=parseRichNode(t.content);
  if(richCache.size>60)richCache.clear();richCache.set(html,r);return r;
}
function richToHtml(lines){return lines.map(runs=>runs.map(r=>r.b?"<b>"+esc(r.t)+"</b>":esc(r.t)).join("")).join("<br>");}
const richEmpty=html=>!parseRich(html||"").some(l=>l.some(r=>r.t.trim()));
/* Palavra mais larga que a linha: corta em pedaços que cabem (nada passa da largura) */
function splitLong(t,maxW,measure){
  if(measure(t)<=maxW)return[t];const out=[];let cur="";
  for(const ch of t){if(cur&&measure(cur+ch)>maxW){out.push(cur);cur=ch;}else cur+=ch;}
  if(cur)out.push(cur);return out;
}
let wrapSplit=false;   /* avisa headMetrics que alguma palavra precisou ser cortada */
function wrapRich(ctx,lines,fs,maxW){
  const out=[];const font=b=>`${b?700:400} ${fs}px ${FONT}`;
  for(const runs of lines){
    const toks=[];runs.forEach(r=>r.t.split(/(\s+)/).forEach(t=>{if(t)toks.push({t:/^\s+$/.test(t)?" ":t,b:r.b});}));
    let cur=[],cw=0;const trim=()=>{while(cur.length&&cur[cur.length-1].t===" "){cw-=cur.pop().w;}};
    for(const tk0 of toks){
      ctx.font=font(tk0.b);
      const parts=tk0.t===" "?[" "]:splitLong(tk0.t,maxW,x=>ctx.measureText(x).width);
      if(parts.length>1)wrapSplit=true;
      for(const pt of parts){const tk={...tk0,t:pt};const w=ctx.measureText(pt).width;
        if(tk.t===" "){if(!cur.length)continue;cur.push({...tk,w});cw+=w;continue;}
        if(cw+w>maxW&&cur.length){trim();out.push({items:cur,w:cw,last:false});cur=[];cw=0;}
        cur.push({...tk,w});cw+=w;}
    }
    trim();out.push({items:cur,w:cw,last:true});
  }
  return out;
}
function drawRich(ctx,lines,x,y,fs,lh,maxW,al,col){
  ctx.textAlign="left";ctx.textBaseline="alphabetic";ctx.fillStyle=col;
  lines.forEach((L,li)=>{
    const by=y+li*lh+fs*.92;const spaces=L.items.filter(i=>i.t===" ").length;
    let cx=x,extra=0;
    if(al==="center")cx=x+(maxW-L.w)/2;
    else if(al==="justify"&&!L.last&&spaces)extra=(maxW-L.w)/spaces;
    L.items.forEach(it=>{if(it.t===" "){cx+=it.w+extra;return;}ctx.font=`${it.b?700:400} ${fs}px ${FONT}`;ctx.fillText(it.t,cx,by);cx+=it.w;});
  });
}

/* =========================================================
   Desenho das artes
   ---------------------------------------------------------
   buildLayers() descreve cada arte como uma pilha de camadas (de baixo para
   cima): fundo, imagem, painel/círculo, detalhes, marca d’água, doutores,
   tags, texto, botão e rodapé. A mesma pilha serve para a prévia, para o PNG
   e para as camadas do PSD, então o resultado é sempre idêntico.
   ========================================================= */
function coverGeom(im,A,fr){
  const nw=im.naturalWidth||im.width,nh=im.naturalHeight||im.height;
  const c=Math.max(A.w/nw,A.h/nh)*fr.z;const dw=nw*c,dh=nh*c;
  let x=A.x+A.w/2-fr.cx*dw,y=A.y+A.h/2-fr.cy*dh;
  x=Math.min(A.x,Math.max(A.x+A.w-dw,x));y=Math.min(A.y,Math.max(A.y+A.h-dh,y));
  return{x,y,dw,dh};
}
function clampFrame(fr,A,im){
  const nw=im.naturalWidth||im.width,nh=im.naturalHeight||im.height;
  const c=Math.max(A.w/nw,A.h/nh)*fr.z;const dw=nw*c,dh=nh*c;
  const hx=(A.w/2)/dw,hy=(A.h/2)/dh;fr.cx=clamp(fr.cx,hx,1-hx);fr.cy=clamp(fr.cy,hy,1-hy);
}
function panelTop(f){const P=f.panel;if(P.type==="arc")return Math.min(P.y0,(P.y0+P.yc)/2);return P.y;}
function panelPath(ctx,f){
  const P=f.panel,W=f.w,H=f.h;ctx.beginPath();
  if(P.type==="arc"){ctx.moveTo(0,P.y0);ctx.quadraticCurveTo(W/2,P.yc,W,P.y0);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();}
  else ctx.rect(0,P.y,W,H-P.y);
}
const isLight=f=>f.kind==="light"||f.kind==="stripe"||f.kind==="circle";
function drawPlaceholderBg(ctx,A,B,preview){
  const g=ctx.createRadialGradient(A.x+A.w*.62,A.y+A.h*.4,10,A.x+A.w*.5,A.y+A.h*.5,Math.max(A.w,A.h)*.8);
  g.addColorStop(0,B.ph[0]);g.addColorStop(1,B.ph[1]);ctx.fillStyle=g;ctx.fillRect(A.x,A.y,A.w,A.h);
  if(preview){const s=Math.max(13,Math.min(A.w,A.h)*.05);ctx.fillStyle="rgba(243,243,243,.75)";ctx.font=`600 ${s}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";
    ctx.fillText("Solte a imagem de fundo aqui",A.x+A.w/2,A.y+A.h*.42);}
}
function drawDocPhoto(ctx,d,cx,cy,r){
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.closePath();ctx.clip();
  const im=img(d.src);
  if(im){const g=coverGeom(im,{x:cx-r,y:cy-r,w:2*r,h:2*r},d);ctx.imageSmoothingQuality="high";ctx.drawImage(im,g.x,g.y,g.dw,g.dh);}
  else{ctx.fillStyle="#d9d4cc";ctx.fillRect(cx-r,cy-r,2*r,2*r);ctx.fillStyle="#b9b1a5";
    ctx.beginPath();ctx.arc(cx,cy-r*.18,r*.34,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(cx,cy+r*.78,r*.66,r*.5,0,Math.PI,0);ctx.fill();}
  ctx.restore();
}
function fitFont(ctx,text,weight,fs,maxW,min){let s=fs;ctx.font=`${weight} ${s}px ${FONT}`;while(s>fs*min&&ctx.measureText(text).width>maxW){s-=.5;ctx.font=`${weight} ${s}px ${FONT}`;}return s;}
function drawDots(ctx,f,light){
  const D=f.dots;if(!D)return;const k=state.dotsK;if(k<=0)return;
  /* opacidade 30% maior que a versão anterior (.07/.08), multiplicada pelo slider */
  const a=(light?.091:.104)*k;
  ctx.fillStyle=light?`rgba(42,42,42,${Math.min(.6,a*.85)})`:`rgba(243,243,243,${Math.min(.6,a)})`;
  const maxd=Math.max(Math.hypot(D.x0-D.tx,D.y0-D.ty),Math.hypot(D.x1-D.tx,D.y1-D.ty),Math.hypot(D.x0-D.tx,D.y1-D.ty),Math.hypot(D.x1-D.tx,D.y0-D.ty));
  let row=0;
  for(let gy=D.y0;gy<=D.y1+D.sp;gy+=D.sp,row++){for(let gx=D.x0;gx<=D.x1+D.sp;gx+=D.sp){
    const x=gx+(row%2?D.sp/2:0);const t=1-Math.hypot(x-D.tx,gy-D.ty)/maxd;if(t<.12)continue;
    ctx.beginPath();ctx.arc(x,gy,Math.max(.6,D.rmax*t),0,Math.PI*2);ctx.fill();}}
}

/* Camadas da arte, de baixo para cima */
/* =========================================================
   Medidas dos blocos e alinhamento automático
   ---------------------------------------------------------
   docMetrics / headMetrics / ctaMetrics / footMetrics medem cada bloco.
   computeFlow() empilha os blocos da lista f.flow.order entre o topo
   (abaixo dos doutores, ou f.flow.top) e f.flow.bottom, com distâncias
   iguais: a mesma folga acima, entre e abaixo dos blocos. O controle
   “Distância entre blocos” multiplica a folga entre eles e “Posição”
   sobe ou desce o conjunto. O texto encolhe se não couber.
   ========================================================= */
function docMetrics(f){
  const n=state.docs.length;if(!n||!f.docs||isHidden(f,"docs"))return null;
  const D=f.docs,o=O(f.id,"docs");const two=n>=3&&!!D.rows2;
  const fac=(two?D.rows2.d/D.d:(n<=2?1:n===3?.84:.72))*o.s;const d=D.d*fac,gap=D.gap*fac*state.docGap,r=d/2;
  const nfs=D.nameFs*Math.max(.82,fac),cfs=D.crmFs*Math.max(.82,fac);
  return{n,D,o,two,fac,d,gap,r,nfs,cfs,h:d+d*.055+nfs*1.18+cfs*1.3};
}
function headMetrics(f,limit){
  if(!f.head||isHidden(f,"head"))return null;
  const T=f.head,o=O(f.id,"head");const hasSub=!richEmpty(state.subtitle);
  /* Largura nunca passa da borda direita da arte */
  const mg=f.w*.03,x0=Math.max(mg,T.x+o.x);const maxW=Math.max(f.w*.2,Math.min(T.w*o.w,f.w-mg-x0));
  const measure=fs=>{const lh=fs*(T.lh||1.2),sfs=fs*.8,slh=sfs*1.25;wrapSplit=false;
    const lines=wrapRich(mctx,parseRich(state.headline||""),fs,maxW);const sub=hasSub?wrapRich(mctx,parseRich(state.subtitle),sfs,maxW):[];
    return{fs,lh,sfs,slh,lines,sub,hasSub,maxW,split:wrapSplit,bh:lines.length*lh+(hasSub?fs*.1+sub.length*slh:0)};};
  const base=T.fs*o.s*(state.headScale||1);
  let M=measure(base);
  /* Sem alinhamento automático vale o limite fixo do formato; com ele, o espaço real */
  const lim=limit==null?(T.maxH?T.maxH*o.s:Infinity):limit;
  {let k=1;while(k>.4&&(M.bh>lim||M.split)){k-=.03;M=measure(base*k);}}
  return M;
}
function ctaMetrics(f){if(!f.cta||isHidden(f,"cta"))return null;const Cb=f.ctaBox,o=O(f.id,"cta");return{h:Cb.h*o.s,w:Cb.w*o.s,s:o.s};}
function footMetrics(f,light,B,CC){
  const fc=footerCanvas();const F=f.foot;const out={fc,fwid:0,fh2:0,disc:null,h:0};
  if(fc&&!isHidden(f,"foot")){const o=O(f.id,"foot");const fw=fc.width||fc.naturalWidth,fh=fc.height||fc.naturalHeight;
    const sc=Math.min(F.maxW/fw,F.maxH/fh,1.2)*o.s*(state.footScale||1);out.fwid=fw*sc;out.fh2=fh*sc;}
  const DS=state.disc||DEFAULT_DISC;
  if((DS.text||"").trim()&&!isHidden(f,"disc")){
    const od=O(f.id,"disc");const k=clamp(F.maxH/118,.45,1.2);const fs=DS.size*k*od.s,lh=fs*1.3;
    /* Largura máxima = largura do bloco branco do rodapé; ao passar dela,
       o texto quebra a linha. Sem rodapé, usa a largura padrão do formato. */
    const maxW=out.fwid>0?out.fwid*od.w:Math.min((F.left!=null?Math.max(F.maxW,f.head?f.head.w:0):f.w*.84)*od.w,f.w*.94);
    const font=`${DS.italic?"italic ":""}${DS.weight} ${fs}px ${FONT}`;
    const lines=wrapPlain(DS.text,font,maxW);const dh=lines.length*lh;
    const col=DS.color==="black"?CC.black:DS.color==="white"?CC.white:DS.color==="gray"?"#7f7f7f":DS.color==="brand"?B.primary:(light?mix(CC.black,CC.white,.15):CC.white);
    /* com o fundo preto do disclaimer (Site), um respiro maior até o rodapé */
    const shaded=f.kind==="site"&&state.siteShade&&state.siteShade.on;
    out.disc={od,fs,lh,maxW,font,lines,dh,gap:fs*(shaded?1.4:.7),col};
  }
  out.h=out.fh2+(out.disc?(out.fh2?out.disc.gap:0)+out.disc.dh:0);
  return out;
}
function computeFlow(f,dm,fm){
  const FL=f.flow,st=state.flow||DEFAULT_FLOW;if(!FL||!st.on)return null;
  const u=f.w/1080*(f.h>f.w?1:.75);
  let top;
  if(FL.after==="docs"){
    if(dm)top=dm.D.cy+dm.o.y+dm.r+dm.d*.055+dm.nfs*1.18+dm.cfs*1.3;
    else top=f.panel?(f.panel.type==="arc"?f.panel.y0:f.panel.y+(f.panel.sh||0))+30*u:FL.bottom*.6;
  }else top=FL.top;
  const region=FL.bottom-top;
  const items=FL.order.map(k=>({k,h:k==="docs"?(dm&&!dm.two?dm.h:0):k==="cta"?(ctaMetrics(f)||{h:0}).h:k==="foot"?fm.h:null})).filter(it=>it.k==="head"?!!(f.head&&!isHidden(f,"head")):it.h>0);
  const minG=14*u;const others=items.filter(it=>it.k!=="head").reduce((a,it)=>a+it.h,0);
  /* Texto maior que o espaço: primeiro os doutores sobem (até 8% da altura),
     abrindo espaço; só depois o texto diminui para caber */
  let lift=0;
  /* (só nos formatos de painel escuro: nos claros os nomes ficariam sobre a imagem) */
  if(FL.after==="docs"&&dm&&f.kind==="dark"&&items.some(it=>it.k==="head")){
    const nat=headMetrics(f,Infinity);const need=nat?nat.bh-(region-others-minG*(items.length+1)):0;
    if(need>0){lift=Math.min(need,f.h*.08);top-=lift;}
  }
  const region2=FL.bottom-top;
  const hm=headMetrics(f,Math.max(40*u,region2-others-minG*(items.length+1)));
  const hi=items.find(it=>it.k==="head");if(hi)hi.h=hm?hm.bh:0;
  const sum=items.reduce((a,it)=>a+it.h,0),n=items.length;if(!n)return null;
  const free=Math.max(0,region2-sum),g=free/(n+1);const inner=g*st.gap;
  const outer=Math.max(0,(free-inner*(n-1))/2);
  /* O conjunto nunca invade os doutores (topo) nem passa do limite de baixo */
  const total=sum+inner*(n-1);
  let y=clamp(top+outer+(st.shift||0)*u,top+Math.min(outer,minG),Math.max(top+Math.min(outer,minG),FL.bottom-total));const pos={hm,lift};
  items.forEach(it=>{pos[it.k]=y;y+=it.h+inner;});
  return pos;
}
/* Tags: “®” (e “™”) saem menores e elevados, como marca registrada.
   O texto é desenhado em partes centralizadas no ponto (cx, cy). */
const MARK_RE=/([®™])/;
function markParts(t){return String(t).split(MARK_RE).filter(Boolean).map(p=>({t:p,m:MARK_RE.test(p)}));}
function markWidth(t,fs){return markParts(t).reduce((a,p)=>{mctx.font=`700 ${p.m?fs*.55:fs}px ${FONT}`;return a+mctx.measureText(p.t).width+(p.m?fs*.04:0);},0);}
function drawMarked(ctx,t,cx,cy,fs,col){
  let x=cx-markWidth(t,fs)/2;ctx.fillStyle=col;ctx.textAlign="left";ctx.textBaseline="middle";
  markParts(t).forEach(p=>{const s=p.m?fs*.55:fs;ctx.font=`700 ${s}px ${FONT}`;
    if(p.m){x+=fs*.04;ctx.fillText(p.t,x,cy-fs*.28);}else ctx.fillText(p.t,x,cy);
    x+=ctx.measureText(p.t).width;});
}
function buildLayers(f,preview){
  const B=BR(),CC=C();const W=f.w,H=f.h;const light=isLight(f);
  const panelColor=light?CC.white:B.primary;const textC=light?CC.black:CC.white;
  const Ls=[];const add=(name,el,box,draw,meta)=>Ls.push({name,el,box,draw,meta});
  const site=f.kind==="site",circ=f.kind==="circle";
  add("Fundo",null,{x:0,y:0,w:W,h:H},ctx=>{ctx.fillStyle=site?B.ph[1]:panelColor;ctx.fillRect(0,0,W,H);});
  const A=f.img;const bgim=img(state.bg.src);
  add("Imagem de fundo","bg",{...A},ctx=>{
    ctx.save();ctx.beginPath();ctx.rect(A.x,A.y,A.w,A.h);ctx.clip();
    if(circ){ctx.beginPath();ctx.arc(f.circle.cx,f.circle.cy,f.circle.r+1,0,Math.PI*2);ctx.clip();}
    if(bgim){const fr={...frameFor(f.id)};clampFrame(fr,A,bgim);const g=coverGeom(bgim,A,fr);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(bgim,g.x,g.y,g.dw,g.dh);}
    else drawPlaceholderBg(ctx,A,B,preview);
    ctx.restore();
  });
  if(circ){
    const Ci=f.circle;const outer=Ci.r+Ci.band+Ci.lineW;
    const bx=Math.max(0,Ci.cx-outer),by=Math.max(0,Ci.cy-outer);
    add("Anel",null,{x:bx,y:by,w:Math.min(W,Ci.cx+outer)-bx,h:Math.min(H,Ci.cy+outer)-by},ctx=>{
      ctx.beginPath();ctx.arc(Ci.cx,Ci.cy,Ci.r+Ci.band/2,0,Math.PI*2);ctx.lineWidth=Ci.band;ctx.strokeStyle=B.primary;ctx.stroke();
      ctx.beginPath();ctx.arc(Ci.cx,Ci.cy,Ci.r+Ci.band+Ci.lineW/2,0,Math.PI*2);ctx.lineWidth=Ci.lineW;ctx.strokeStyle=B.accent;ctx.stroke();
    });
  }
  if(!site&&!circ){
    const pt=panelTop(f);
    if(f.kind==="stripe")add("Faixa superior",null,{x:0,y:0,w:W,h:A.y},ctx=>{ctx.fillStyle=CC.white;ctx.fillRect(0,0,W,A.y);});
    add("Painel",null,{x:0,y:Math.floor(pt)-2,w:W,h:H-Math.floor(pt)+2},ctx=>{ctx.fillStyle=panelColor;panelPath(ctx,f);ctx.fill();});
    if(f.kind==="light"){
      const P=f.panel,s=P.lw||1;
      add("Detalhe da curva",null,{x:0,y:Math.floor(pt)-34*s,w:W,h:Math.abs(P.y0-pt)+40*s},ctx=>{
        ctx.beginPath();ctx.moveTo(-10,P.y0-12*s);ctx.quadraticCurveTo(W/2,P.yc-12*s,W+10,P.y0-12*s);ctx.lineWidth=12*s;ctx.strokeStyle=B.primary;ctx.stroke();
        ctx.beginPath();ctx.moveTo(-10,P.y0-3*s);ctx.quadraticCurveTo(W/2,P.yc-3*s,W+10,P.y0-3*s);ctx.lineWidth=4*s;ctx.strokeStyle=B.accent;ctx.stroke();
      });
    }
    if(f.kind==="stripe"){const P=f.panel;add("Faixa de destaque",null,{x:0,y:P.y,w:W,h:P.sh},ctx=>{ctx.fillStyle=B.accent;ctx.fillRect(0,P.y,W,P.sh);});}
    const N=f.news;const top=Math.min(N?N.y:H,f.dots?f.dots.y0:H);
    add("Marca d’água",null,{x:0,y:top-10,w:W,h:H-top+10},ctx=>{
      ctx.save();panelPath(ctx,f);ctx.clip();
      if(N){const fs=W*.32;ctx.font=`800 ${fs}px ${FONT}`;ctx.textBaseline="alphabetic";ctx.textAlign="left";
        const tw=ctx.measureText("NEWS").width;const tx=(W-tw)/2,ty=N.y+fs*.72;
        /* Só o contorno externo: o traço é desenhado numa camada à parte e o
           preenchimento da letra é recortado por cima. Assim somem as linhas
           internas que a fonte cria onde as partes da letra se sobrepõem. */
        const oc=document.createElement("canvas");oc.width=W;oc.height=H;const ox=oc.getContext("2d");
        ox.font=ctx.font;ox.textBaseline="alphabetic";ox.textAlign="left";ox.lineJoin="round";
        ox.lineWidth=5*(W/1080);ox.strokeStyle=light?"#2a2a2a":"#f3f3f3";ox.strokeText("NEWS",tx,ty);
        ox.globalCompositeOperation="destination-out";ox.fillStyle="#000";ox.fillText("NEWS",tx,ty);
        ctx.globalAlpha=light?.09:.08;ctx.drawImage(oc,0,0);ctx.globalAlpha=1;}
      /* Bolinhas só nas partes escuras; as partes brancas ficam lisas */
      if(!light)drawDots(ctx,f,light);ctx.restore();
    });
  }
  /* Medidas e alinhamento automático (antes de desenhar) */
  const dm=site?null:docMetrics(f);const fm=footMetrics(f,light,B,CC);const flow=site?null:computeFlow(f,dm,fm);
  if(!site){
    /* Doutores: o 1º fica à direita, os seguintes entram à esquerda */
    if(dm){
      /* Com 3 ou 4 doutores, formatos com “rows2” (Banner principal) usam 2 em cima e 2 embaixo */
      const {n,D,o,two,d,gap,r,nfs,cfs}=dm;
      const nameC=light?CC.black:CC.white,crmC=light?mix(CC.black,CC.white,.3):mix(CC.white,CC.black,.08);
      state.docs.forEach((doc,i)=>{
        const col=two?i%2:i,row=two?Math.floor(i/2):0;const inRow=two?Math.min(2,n-row*2):n;
        const cx=D.left!=null?D.left+o.x+r+(inRow-1-col)*(d+gap):D.right+o.x-r-col*(d+gap);
        const cy=(two?D.rows2.cy+row*D.rows2.pitch*o.s:(flow&&flow.docs!=null?flow.docs+r:D.cy-(flow&&flow.lift||0)))+o.y;
        const sh=Math.max(4,d*.12);
        add("Foto – "+(doc.name||"Doutor "+(i+1)),"docs",{x:cx-r-sh*1.4,y:cy-r-sh,w:d+sh*2.8,h:d+sh*2.8},ctx=>{
          ctx.save();ctx.shadowColor=`rgba(0,0,0,${LOOK().shadow})`;ctx.shadowBlur=sh*1.15;ctx.shadowOffsetY=sh*.3;
          ctx.fillStyle="#d9d4cc";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.restore();
          drawDocPhoto(ctx,doc,cx,cy,r);
        },{i,cx,cy,r});
        const maxw=Math.max(d+gap-8,d*1.2);const ty=cy+r+d*.055;
        add("Nome – "+(doc.name||"Doutor "+(i+1)),"docs",{x:cx-maxw/2-4,y:ty-2,w:maxw+8,h:nfs*1.25+cfs*1.25+8},ctx=>{
          ctx.textAlign="center";ctx.textBaseline="top";
          const nm=fmtName(doc.name),cr=formatCRM(doc.crm);
          const s1=fitFont(ctx,nm,700,nfs,maxw,.6);ctx.fillStyle=nameC;ctx.fillText(nm,cx,ty);
          fitFont(ctx,cr,500,cfs,maxw,.6);ctx.fillStyle=crmC;ctx.fillText(cr,cx,ty+s1*1.18);
        });
      });
    }
    /* Tags */
    if(f.tag&&!isHidden(f,"tag")){
      const T=f.tag,o=O(f.id,"tag"),s=o.s;const h=T.h*s,fs=T.fs*s,padX=fs*1.15;const x=T.x+o.x,y=T.y+o.y;
      const up=t=>state.tagUpper?t.toLocaleUpperCase("pt-BR"):t;
      const t1=up(state.tagText||"");const w1=t1?markWidth(t1,fs)+2*padX:0;
      if(t1)add("Tag – "+t1,"tag",{x,y,w:w1,h},ctx=>{ctx.fillStyle=B.tagFill;rr(ctx,x,y,w1,h,h/2);ctx.fill();
        drawMarked(ctx,t1,x+w1/2,y+h/2+fs*.04,fs,CC.white);});
      const t2=up((state.eventTag||"").trim());
      if(t2){const w2=markWidth(t2,fs)+2*padX;const x2=t1?x+w1+fs*.37:x;
        add("Tag de evento – "+t2,"tag",{x:x2,y,w:w2,h},ctx=>{ctx.fillStyle=CC.white;rr(ctx,x2,y,w2,h,h/2);ctx.fill();
          drawMarked(ctx,t2,x2+w2/2,y+h/2+fs*.04,fs,CC.black);});}
    }
    /* Texto da notícia (+ subtítulo) */
    if(f.head&&!isHidden(f,"head")){
      const T=f.head,o=O(f.id,"head");const x=Math.max(f.w*.03,T.x+o.x);
      /* Sem alinhamento automático, o texto também não passa da borda de baixo */
      let y=(flow&&flow.head!=null?flow.head:T.y)+o.y;
      const al=o.al||"left";
      /* Encolhe o texto para caber no espaço do formato */
      const M=(flow&&flow.hm)||headMetrics(f);
      const {fs,lh,sfs,slh,lines,sub,bh,hasSub,maxW}=M;y=clamp(y,f.h*.02,Math.max(f.h*.02,f.h*.98-bh));const subY=y+lines.length*lh+fs*.1;
      add("Texto da notícia","head",{x:x-6,y:y-6,w:maxW+12,h:bh+16},ctx=>{
        drawRich(ctx,lines,x,y,fs,lh,maxW,al,textC);
        if(hasSub)drawRich(ctx,sub,x,subY,sfs,slh,maxW,al,textC);
      });
    }
    /* Botão */
    if(f.cta&&!isHidden(f,"cta")){
      const Cb=f.ctaBox,o=O(f.id,"cta"),s=o.s;const w=Cb.w*s,h=Cb.h*s;const x=Cb.cx+o.x-w/2,y=(flow&&flow.cta!=null?flow.cta:Cb.y)+o.y;const bw=4*s;
      add("Botão – "+state.cta,"cta",{x:x-2,y:y-2,w:w+4,h:h+4},ctx=>{
        const g=ctx.createLinearGradient(x,0,x+w,0);g.addColorStop(0,B.ctaA);g.addColorStop(1,B.ctaB);
        ctx.fillStyle=g;rr(ctx,x,y,w,h,12*s);ctx.fill();ctx.fillStyle="#ffffff";rr(ctx,x+bw,y+bw,w-2*bw,h-2*bw,9*s);ctx.fill();
        const t=(state.cta||"").toLocaleUpperCase("pt-BR");const fs=fitFont(ctx,t,800,Cb.fs*s,w-44*s,.5);
        ctx.fillStyle=CC.black;ctx.font=`800 ${fs}px ${FONT}`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t,x+w/2,y+h/2+fs*.05);
      });
    }
  }
  /* Rodapé (o mesmo da aba Rodapé) + disclaimer logo abaixo dele.
     Se o disclaimer não couber embaixo, o rodapé sobe o necessário. */
  const DS=state.disc||DEFAULT_DISC;const F=f.foot;const fc=fm.fc,fwid=fm.fwid,fh2=fm.fh2;
  const fo=O(f.id,"foot");
  let fx=(F.left!=null?F.left:F.cx-fwid/2)+fo.x,fy;
  if(flow&&flow.foot!=null)fy=flow.foot+fo.y;
  else{fy=F.cy+fo.y-fh2/2;
    if(fm.disc){const margin=Math.max(fm.disc.fs,f.h*.015);fy-=Math.max(0,fy+fh2+(fh2?fm.disc.gap:0)+fm.disc.dh-(f.h-margin));}}
  let disc=null;
  if(fm.disc){const m=fm.disc;
    disc={...m,x:(F.left!=null?F.left:(f.w-m.maxW)/2)+m.od.x,y:fy+fh2+(fh2?m.gap:0)+m.od.y};
  }
  if(fc&&!isHidden(f,"foot")){const x=fx,y=fy,w=fwid,h=fh2;
    add("Rodapé","foot",{x,y,w,h},ctx=>{ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";ctx.drawImage(fc,x,y,w,h);});}
  /* Site e Site OBR e Hemo: fundo preto transparente só ao redor do disclaimer */
  if(disc&&site&&state.siteShade&&state.siteShade.on){const d=disc,a=state.siteShade.a;
    const tw=Math.max(...d.lines.map(L=>L.w)),px=d.fs*.9,py=d.fs*.45;
    const bx=d.x+(d.maxW-tw)/2-px,by=d.y-py,bw=tw+2*px,bh=d.dh+2*py;
    add("Fundo do disclaimer","disc",{x:bx,y:by,w:bw,h:bh},ctx=>{ctx.fillStyle=`rgba(0,0,0,${a})`;rr(ctx,bx,by,bw,bh,Math.min(bh/2,d.fs*.9));ctx.fill();});}
  if(disc){const d=disc;
    add("Disclaimer","disc",{x:d.x-4,y:d.y-4,w:d.maxW+8,h:d.dh+8},ctx=>{
      ctx.font=d.font;ctx.fillStyle=d.col;ctx.textBaseline="alphabetic";ctx.textAlign="left";
      d.lines.forEach((L,i)=>{const by=d.y+i*d.lh+d.fs*.95;
        ctx.fillText(L.t,d.x+(d.maxW-L.w)/2,by);   /* sempre centralizado */
      });
    });}
  return Ls;
}
/* =========================================================
   Formatação automática de nome e CRM (mesmo padrão do Gerador de lettering)
   ---------------------------------------------------------
   Nome em Título: “DRA. LUIZA DIB” ou “dra. luiza dib” → “Dra. Luiza Dib”;
   partículas (da, de, do, das, dos, e…) ficam minúsculas.
   CRM: aceita qualquer formato colado (“CRM/SP 123456”, “123456 - crm sp”,
   “crm-mg: 45.678”…) e vira sempre “CRM-UF: NÚMERO”. Se houver RQE, ele é
   mantido no fim: “CRM-SP: 75597 - RQE 153683”. Sem estado reconhecido,
   fica “CRM: NÚMERO”.
   ========================================================= */
const UFS="AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");
const PARTICLES=new Set("da de do das dos e di du del della van von".split(" "));
function titleCase(t){return String(t).trim().replace(/\s+/g," ").toLocaleLowerCase("pt-BR").replace(/\S+/g,(w,i)=>{
  if(i>0&&PARTICLES.has(w))return w;
  return w.replace(/(^|[-'’])(\p{L})/gu,(m,a,b)=>a+b.toLocaleUpperCase("pt-BR"));});}
function parseCRM(raw){
  const up=String(raw).toLocaleUpperCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const rest=up.replace(/\bCRM\b|^CRM|CRM(?=[A-Z]{2}\b)/g," ");
  let uf=null;for(const m of rest.matchAll(/(?:^|[^A-Z])([A-Z]{2})(?![A-Z])/g))if(UFS.includes(m[1])){uf=m[1];break;}
  const num=(rest.match(/\d[\d.\-\/]*\d|\d/g)||[]).sort((x,y)=>y.length-x.length)[0]||"";
  return{uf,num:num.replace(/\/[A-Z]*$/,"")};
}
function formatCRM(raw){
  const t=String(raw||"").trim();if(!t)return"";
  const m=t.match(/^(.*?)[\s\-–—·|,;]*\bRQE\b[\s:.-]*(.*)$/i);
  const crmPart=m?m[1]:t,rqe=m?(m[2].match(/[\d.\-\/]+/)||[""])[0]:"";
  const r=parseCRM(crmPart);
  let out=r.num?(r.uf?`CRM-${r.uf}: ${r.num}`:`CRM: ${r.num}`):"";
  if(rqe)out+=(out?" - ":"")+"RQE "+rqe;
  return out||t;
}
const fmtName=n=>titleCase(n||"");
/* Quebra texto simples (sem negrito) em linhas que cabem em maxW */
function wrapPlain(text,font,maxW){
  mctx.font=font;const sp=mctx.measureText(" ").width;const out=[];
  String(text).split(/\n/).forEach(par=>{
    const words=par.trim().split(/\s+/).filter(Boolean).flatMap(t=>splitLong(t,maxW,x=>mctx.measureText(x).width)).map(t=>({t,w:mctx.measureText(t).width}));
    let cur=[],cw=0;
    words.forEach(wd=>{const add=(cur.length?sp:0)+wd.w;if(cur.length&&cw+add>maxW){out.push({words:cur,w:cw,sp,t:cur.map(x=>x.t).join(" "),last:false});cur=[];cw=0;}
      cw+=(cur.length?sp:0)+wd.w;cur.push(wd);});
    out.push({words:cur,w:cw,sp,t:cur.map(x=>x.t).join(" "),last:true});
  });
  return out;
}
function elBoxes(Ls){
  const m={};
  Ls.forEach(L=>{if(!L.el)return;const b=L.box;const c=m[L.el];
    if(!c)m[L.el]={x:b.x,y:b.y,x2:b.x+b.w,y2:b.y+b.h};else{c.x=Math.min(c.x,b.x);c.y=Math.min(c.y,b.y);c.x2=Math.max(c.x2,b.x+b.w);c.y2=Math.max(c.y2,b.y+b.h);}});
  for(const k in m){const c=m[k];m[k]={x:c.x,y:c.y,w:c.x2-c.x,h:c.y2-c.y};}
  return m;
}
function elementsOf(f){const dz=(state.disc&&state.disc.text.trim())?["disc"]:[];if(f.kind==="site")return["bg","foot",...dz];const l=["bg","tag","docs","head"];if(f.cta)l.push("cta");l.push("foot",...dz);return l;}

/* =========================================================
   Pranchetas
   ---------------------------------------------------------
   Cria um canvas por formato, controla quais formatos estão visíveis,
   redesenha só o que mudou (requestAnimationFrame) e trata o mouse:
   clicar seleciona, arrastar move o elemento ou reenquadra o fundo,
   soltar uma imagem troca o fundo ou a foto do doutor.
   ========================================================= */
const views={};
function buildBoards(){
  const box=$("boards");box.textContent="";for(const k in views)delete views[k];
  FORMATS.forEach(f=>{
    const fig=document.createElement("figure");fig.className="ab";fig.hidden=state.hiddenFormats.includes(f.id);
    const cap=document.createElement("figcaption");
    const nm=document.createElement("span");nm.className="nm";nm.textContent=f.name;
    const dm=document.createElement("span");dm.className="dims";dm.textContent=f.w+" × "+f.h;
    const b=document.createElement("button");b.className="btn small";b.type="button";b.innerHTML='<svg class="i" viewBox="0 0 24 24"><path d="M12 3v12M7 10l5 5 5-5M4 21h16"/></svg>PNG';
    b.title="Baixar "+f.name+" em PNG";b.addEventListener("click",()=>busy(b,"…",()=>downloadOne(f)));
    cap.append(nm,dm,b);
    if(f.custom)cap.append(mkIco("×","Excluir formato "+f.name,async()=>{if(!await ask({title:"Excluir formato",msg:"Excluir o formato “"+f.name+"”?",yes:"Excluir"}))return;
      state.customFormats=state.customFormats.filter(c=>c.id!==f.id);delete state.off[f.id];delete state.bg.per[f.id];if(sel&&sel.fid===f.id)sel=null;formatsChanged();},false,"del"));
    const cv=document.createElement("canvas");cv.tabIndex=0;cv.setAttribute("aria-label","Arte "+f.name+", "+f.w+" por "+f.h);
    fig.append(cap,cv);box.append(fig);views[f.id]={cv,fig};wireCanvas(f,cv);
  });
  sizeBoards();
}
function renderFmtChips(){
  const g=$("fmtChips");g.textContent="";
  FORMATS.forEach(f=>{const b=document.createElement("button");b.type="button";b.className="fmtchip";b.textContent=f.name;
    const on=!state.hiddenFormats.includes(f.id);b.setAttribute("aria-pressed",on?"true":"false");b.title=(on?"Esconder ":"Mostrar ")+f.name+" (só formatos visíveis são exportados)";
    b.addEventListener("click",()=>{const h=state.hiddenFormats;const i=h.indexOf(f.id);if(i>=0)h.splice(i,1);else h.push(f.id);
      views[f.id].fig.hidden=h.includes(f.id);renderFmtChips();scheduleAll();save();});g.append(b);});
}
function formatsChanged(){buildFormats();buildBoards();renderFmtChips();renderCpFmt();renderInspector();save();}
function sizeBoards(){
  const z=state.zoom/100;const dpr=Math.min(2,window.devicePixelRatio||1);
  FORMATS.forEach(f=>{const v=views[f.id];if(!v)return;const cw=Math.round(f.w*z);v.cv.style.width=cw+"px";v.cv.style.height=Math.round(f.h*z)+"px";
    v.cv.width=Math.min(f.w,Math.round(cw*dpr));v.cv.height=Math.max(1,Math.round(v.cv.width*f.h/f.w));});
  scheduleAll();
}
function renderOne(fid){
  const f=FMAP[fid],v=views[fid];if(!f||!v||v.fig.hidden)return;const ctx=v.cv.getContext("2d");const k=v.cv.width/f.w;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,v.cv.width,v.cv.height);ctx.setTransform(k,0,0,k,0,0);
  const Ls=buildLayers(f,true);Ls.forEach(L=>{ctx.save();L.draw(ctx);ctx.restore();});
  v.layers=Ls;v.boxes=elBoxes(Ls);
  if(sel&&sel.fid===fid){
    const b=sel.el==="bg"?{...f.img}:v.boxes[sel.el];
    if(b){ctx.save();ctx.lineWidth=3/k;ctx.strokeStyle="#b58fff";ctx.setLineDash([10/k,7/k]);ctx.strokeRect(b.x+1.5/k,b.y+1.5/k,b.w-3/k,b.h-3/k);
      ctx.setLineDash([]);ctx.lineWidth=1.5/k;ctx.strokeStyle="#563f99";ctx.strokeRect(b.x+1.5/k,b.y+1.5/k,b.w-3/k,b.h-3/k);ctx.restore();}
  }
  v.fig.classList.toggle("active",!!sel&&sel.fid===fid);
}
let rq=null;const dirty=new Set();
function scheduleAll(){FORMATS.forEach(f=>dirty.add(f.id));kick();}
function scheduleOne(fid){dirty.add(fid);kick();}
/* Prévia da aba Conteúdo: um formato à escolha, redesenhado a cada mudança */
function renderCpFmt(){const sl=$("cpFmt");sl.textContent="";FORMATS.forEach(f=>{const o=document.createElement("option");o.value=f.id;o.textContent=f.name+" ("+f.w+" × "+f.h+")";sl.append(o);});
  if(!FMAP[state.cpFmt])state.cpFmt="feed_cta";sl.value=state.cpFmt;}
function cpRender(){
  const f=FMAP[state.cpFmt]||FORMATS[0];const cv=$("cpCv");const box=cv.parentElement;
  const maxW=box.clientWidth-32,maxH=Math.max(260,window.innerHeight-230);const z=Math.min(maxW/f.w,maxH/f.h);
  const dpr=Math.min(2,window.devicePixelRatio||1);cv.style.width=Math.round(f.w*z)+"px";cv.style.height=Math.round(f.h*z)+"px";
  cv.width=Math.max(1,Math.round(f.w*z*dpr));cv.height=Math.max(1,Math.round(f.h*z*dpr));
  const ctx=cv.getContext("2d");const k=cv.width/f.w;ctx.setTransform(k,0,0,k,0,0);ctx.clearRect(0,0,f.w,f.h);
  buildLayers(f,true).forEach(L=>{ctx.save();L.draw(ctx);ctx.restore();});
}
function kick(){if(rq)return;
  if(state.tab==="content"){rq=requestAnimationFrame(()=>{rq=null;if(state.tab==="content")cpRender();});return;}
  if(state.tab!=="news")return;rq=requestAnimationFrame(()=>{rq=null;if(state.tab!=="news")return;const ids=[...dirty];dirty.clear();ids.forEach(renderOne);});}

function toArt(f,cv,e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*f.w,y:(e.clientY-r.top)/r.height*f.h};}
const inBox=(p,b)=>p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h;
function hitTest(f,p){
  const v=views[f.id];if(!v.layers)return"bg";
  for(const el of["disc","foot","cta","head","tag","docs"]){
    if(el==="docs"){if(v.layers.find(L=>L.el==="docs"&&L.meta&&Math.hypot(p.x-L.meta.cx,p.y-L.meta.cy)<=L.meta.r))return"docs";
      if(v.layers.find(L=>L.el==="docs"&&!L.meta&&inBox(p,L.box)))return"docs";continue;}
    if(v.layers.some(L=>L.el===el&&inBox(p,L.box)))return el;
  }
  return"bg";
}
function docAt(f,p){const v=views[f.id];if(!v.layers)return -1;const L=v.layers.find(L=>L.el==="docs"&&L.meta&&Math.hypot(p.x-L.meta.cx,p.y-L.meta.cy)<=L.meta.r);return L?L.meta.i:-1;}
function wireCanvas(f,cv){
  let drag=null;
  cv.addEventListener("pointerdown",e=>{
    if(e.button!==0)return;const p=toArt(f,cv,e);const el=hitTest(f,p);select(f.id,el);
    if(el==="bg"&&!img(state.bg.src)){$("bgFile").click();return;}
    cv.setPointerCapture(e.pointerId);cv.style.cursor="grabbing";
    if(el==="bg"){const im=img(state.bg.src);const fr=ensurePer(f.id);drag={el,p,fr0:{...fr},g:coverGeom(im,f.img,fr),im};}
    else drag={el,p,o0:{...O(f.id,el)}};
  });
  cv.addEventListener("pointermove",e=>{
    const p=toArt(f,cv,e);
    if(!drag){cv.style.cursor=hitTest(f,p)==="bg"?"grab":"move";return;}
    const dx=p.x-drag.p.x,dy=p.y-drag.p.y;
    if(drag.el==="bg"){const fr=state.bg.per[f.id];fr.cx=drag.fr0.cx-dx/drag.g.dw;fr.cy=drag.fr0.cy-dy/drag.g.dh;clampFrame(fr,f.img,drag.im);}
    else{const o=O(f.id,drag.el);let nx=Math.round(drag.o0.x+dx),ny=Math.round(drag.o0.y+dy);
      if(!e.shiftKey){const b=views[f.id].boxes[drag.el];if(b){const cxNow=b.x+b.w/2-(o.x-nx);if(Math.abs(cxNow-f.w/2)<8*(f.w/1080))nx+=Math.round(f.w/2-cxNow);}}
      o.x=nx;o.y=ny;}
    scheduleOne(f.id);syncInspector();
  });
  const end=()=>{if(drag){drag=null;cv.style.cursor="";save();syncInspector();}};
  cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);
  cv.addEventListener("dragover",e=>{if([...e.dataTransfer.types].includes("Files")){e.preventDefault();cv.classList.add("drop");}});
  cv.addEventListener("dragleave",()=>cv.classList.remove("drop"));
  cv.addEventListener("drop",async e=>{
    e.preventDefault();cv.classList.remove("drop");const file=[...e.dataTransfer.files].find(x=>/^image\//.test(x.type));if(!file)return;
    const di=docAt(f,toArt(f,cv,e));
    if(di>=0){await setDocPhoto(state.docs[di],file);toast("Foto de "+(state.docs[di].name||"doutor")+" atualizada.");}else await setBg(file);
  });
}
function ensurePer(fid){if(!state.bg.per[fid])state.bg.per[fid]={...state.bg.g};return state.bg.per[fid];}
function select(fid,el){sel={fid,el};scheduleAll();renderInspector();}

/* =========================================================
   Inspetor de posição
   ---------------------------------------------------------
   Painel da direita: mostra o elemento selecionado e permite mover,
   redimensionar, esconder/mostrar por formato, mudar o alinhamento do texto
   e usar as setas do teclado (1 px, ou 10 px com Shift).
   ========================================================= */
function renderInspector(){
  const box=$("inspBody");box.textContent="";
  if(!sel||!FMAP[sel.fid]){sel=null;
    box.innerHTML='<div class="empty"><p style="margin:0">Clique em qualquer elemento de uma arte para ajustar só aquele formato.</p><ul><li>Arraste para mover; segure <kbd>Shift</kbd> para desligar o ímã do centro.</li><li>Use as setas do teclado para mover 1 px (com <kbd>Shift</kbd>, 10 px).</li><li>Arraste o fundo para reenquadrar a imagem.</li></ul></div>';
    return;}
  const f=FMAP[sel.fid];const el=sel.el;
  const card=document.createElement("div");card.className="selcard";
  card.innerHTML=`<div class="selname">${ELNAME[el]}</div><div class="selfmt">${esc(f.name)} · ${f.w} × ${f.h}</div>`;
  /* Lista de elementos do formato (permite chegar nos que estão escondidos) */
  const chips=document.createElement("div");chips.className="elchips";
  elementsOf(f).forEach(k=>{const b=document.createElement("button");b.type="button";b.className="elchip"+(k!=="bg"&&isHidden(f,k)?" off":"");b.textContent=ELNAME[k];
    b.setAttribute("aria-pressed",k===el?"true":"false");b.addEventListener("click",()=>select(f.id,k));chips.append(b);});
  card.append(chips);
  const syncs=[];
  const mkRange=(id,label,min,max,step,get,set,fmt)=>{
    const w=document.createElement("div");w.className="field";
    w.innerHTML=`<label for="${id}">${label} <output></output></label><input type="range" id="${id}" min="${min}" max="${max}" step="${step}">`;
    const r=w.querySelector("input"),out=w.querySelector("output");
    w._sync=()=>{r.value=get();out.textContent=fmt(get());};
    r.addEventListener("input",()=>{set(+r.value);out.textContent=fmt(+r.value);scheduleOne(f.id);save();});
    w._sync();card.append(w);syncs.push(w);};
  if(el!=="bg"){
    const lab=document.createElement("label");lab.className="check";lab.innerHTML='<input type="checkbox"> Mostrar neste formato';
    const cb=lab.querySelector("input");cb.checked=!isHidden(f,el);
    cb.addEventListener("change",()=>{O(f.id,el).hide=!cb.checked;scheduleOne(f.id);save();renderInspector();});card.append(lab);
  }
  if(el==="bg"){
    if(!img(state.bg.src)){const p=document.createElement("p");p.className="note";p.textContent="Ainda não há imagem de fundo. Solte uma imagem em qualquer arte.";card.append(p);}
    else{
      const fr=()=>ensurePer(f.id),im=()=>img(state.bg.src);
      mkRange("iz","Zoom",100,300,1,()=>Math.round(frameFor(f.id).z*100),v=>{const r=fr();r.z=v/100;clampFrame(r,f.img,im());},v=>v+"%");
      mkRange("ix","Horizontal",0,100,.5,()=>Math.round(frameFor(f.id).cx*200)/2,v=>{const r=fr();r.cx=v/100;clampFrame(r,f.img,im());},v=>v+"%");
      mkRange("iy","Vertical",0,100,.5,()=>Math.round(frameFor(f.id).cy*200)/2,v=>{const r=fr();r.cy=v/100;clampFrame(r,f.img,im());},v=>v+"%");
      card.append(padEl());
      const row=document.createElement("div");row.className="row";
      const a=document.createElement("button");a.className="btn small";a.textContent="Usar este enquadramento em todos";
      a.addEventListener("click",()=>{state.bg.g={...frameFor(f.id)};state.bg.per={};syncSideBg();scheduleAll();save();toast("Enquadramento aplicado a todos os formatos.");});
      const r=document.createElement("button");r.className="btn small";r.textContent="Voltar ao padrão";
      r.addEventListener("click",()=>{delete state.bg.per[f.id];scheduleOne(f.id);syncInspector();save();});
      row.append(a,r);card.append(row);
    }
  }else if(!isHidden(f,el)){
    const o=()=>O(f.id,el);
    mkRange("ix","Horizontal",-Math.round(f.w/2),Math.round(f.w/2),1,()=>o().x,v=>o().x=v,v=>(v>0?"+":"")+v+" px");
    mkRange("iy","Vertical",-Math.round(f.h/2),Math.round(f.h/2),1,()=>o().y,v=>o().y=v,v=>(v>0?"+":"")+v+" px");
    mkRange("is","Tamanho",40,180,1,()=>Math.round(o().s*100),v=>o().s=v/100,v=>v+"%");
    if(el==="head"){
      mkRange("iw","Largura da caixa",50,140,1,()=>Math.round(o().w*100),v=>o().w=v/100,v=>v+"%");
      const wrap=document.createElement("div");wrap.className="field";wrap.innerHTML='<span class="lbl">Alinhamento do texto</span>';
      const seg=document.createElement("div");seg.className="seg3";const cur=o().al||"left";
      [["left","Esquerda"],["justify","Justificado"],["center","Centro"]].forEach(([k,l])=>{const b=document.createElement("button");b.type="button";b.textContent=l;b.setAttribute("aria-pressed",k===cur?"true":"false");
        b.addEventListener("click",()=>{o().al=k;scheduleOne(f.id);save();renderInspector();});seg.append(b);});
      wrap.append(seg);card.append(wrap);
    }
    card.append(padEl());
    const row=document.createElement("div");row.className="row";
    const c=document.createElement("button");c.className="btn small";c.textContent="Centralizar na horizontal";
    c.addEventListener("click",()=>{const b=views[f.id].boxes[el];if(b){o().x+=Math.round(f.w/2-(b.x+b.w/2));scheduleOne(f.id);setTimeout(syncInspector,30);save();}});
    const r=document.createElement("button");r.className="btn small";r.textContent="Restaurar";
    r.addEventListener("click",()=>{const h=O(f.id,el).hide;state.off[f.id][el]={x:0,y:0,s:1,w:1};if(typeof h==="boolean")state.off[f.id][el].hide=h;scheduleOne(f.id);renderInspector();save();});
    row.append(c,r);card.append(row);
  }
  card._syncs=syncs;box.append(card);
  const done=document.createElement("button");done.className="btn small";done.textContent="Tirar seleção";done.style.marginTop="10px";
  done.addEventListener("click",()=>{sel=null;scheduleAll();renderInspector();});box.append(done);
}
function syncInspector(){const c=document.querySelector("#inspBody .selcard");if(c&&c._syncs)c._syncs.forEach(w=>w._sync());}
function padEl(){
  const p=document.createElement("div");p.className="pad";
  const mk=(c,r,dx,dy,label,path)=>{const b=document.createElement("button");b.type="button";b.style.gridColumn=c;b.style.gridRow=r;b.setAttribute("aria-label",label);b.title=label+" (Shift: 10 px)";
    b.innerHTML=`<svg class="i" viewBox="0 0 24 24"><path d="${path}"/></svg>`;b.addEventListener("click",e=>nudge(dx,dy,e.shiftKey?10:1));p.append(b);};
  mk(2,1,0,-1,"Mover para cima","m6 15 6-6 6 6");mk(1,2,-1,0,"Mover para a esquerda","m15 6-6 6 6 6");mk(3,2,1,0,"Mover para a direita","m9 6 6 6-6 6");mk(2,3,0,1,"Mover para baixo","m6 9 6 6 6-6");
  const c=document.createElement("span");c.className="c";c.textContent="1 px";p.append(c);return p;
}
function nudge(dx,dy,step){
  if(!sel)return;const f=FMAP[sel.fid];
  if(sel.el==="bg"){const im=img(state.bg.src);if(!im)return;const fr=ensurePer(f.id);const g=coverGeom(im,f.img,fr);fr.cx-=dx*step/g.dw;fr.cy-=dy*step/g.dh;clampFrame(fr,f.img,im);}
  else{const o=O(f.id,sel.el);o.x+=dx*step;o.y+=dy*step;}
  scheduleOne(f.id);syncInspector();save();
}
document.addEventListener("keydown",e=>{
  if(state.tab!=="news")return;const t=e.target;if(t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))return;if(!sel)return;
  const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
  if(m){e.preventDefault();nudge(m[0],m[1],e.shiftKey?10:1);}else if(e.key==="Escape"){sel=null;scheduleAll();renderInspector();}
});

/* =========================================================
   Barra lateral da notícia
   ---------------------------------------------------------
   Campos da aba Gerar notícia: marca, imagem de fundo, tags (Ctrl + R
   insere ®), doutores (miniatura arrastável para enquadrar o rosto),
   texto e subtítulo, botão e o resumo do rodapé.
   ========================================================= */
function renderBrands(){
  document.querySelectorAll("[data-brands]").forEach(g=>{g.textContent="";
  BRAND_ORDER.forEach(id=>{const b=document.createElement("button");b.type="button";b.setAttribute("aria-pressed",state.brand===id?"true":"false");
    const d=document.createElement("span");d.className="dot";d.style.background=(C()[id]||DEFAULT_COLORS[id]).dark;b.append(d,document.createTextNode(BRAND_META[id].name));
    b.addEventListener("click",()=>setBrand(id));g.append(b);});});
  /* Cores da marca ativa (aba Conteúdo) */
  const ic=$("idColors");if(ic){ic.textContent="";const c=C()[state.brand];
    [["Escura",c.dark],["Clara",c.light],["Branca",C().white],["Preta",C().black]].forEach(([n,v])=>{const d=document.createElement("div");d.className="idsw";
      const sw=document.createElement("span");sw.style.background=v;const t=document.createElement("small");t.textContent=n+" "+v;d.append(sw,t);ic.append(d);});}
}
function setBrand(id){
  state.brand=id;state.tagText=BRAND_META[id].tag;$("tagText").value=state.tagText;
  realizacao().logos=brandLogos(id).map(ref=>({ref,scale:1}));
  renderBrands();footerChanged(true);
}
async function fileToDataUrl(file,maxSide,type,q){
  const url=URL.createObjectURL(file);
  try{const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url;});
    const s=Math.min(1,maxSide/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement("canvas");
    c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);return c.toDataURL(type,q);}
  finally{URL.revokeObjectURL(url);}
}
async function setBg(file){
  try{state.bg.src=await fileToDataUrl(file,3600,"image/jpeg",.92);state.bg.g={cx:.5,cy:.5,z:1};state.bg.per={};syncSideBg();scheduleAll();save();toast("Imagem de fundo aplicada em todos os formatos.");}
  catch(e){toast("Não foi possível abrir essa imagem. Use JPG, PNG ou WEBP.");}
}
function syncSideBg(){
  const d=$("bgDrop");
  if(state.bg.src){d.innerHTML="";const im=document.createElement("img");im.src=state.bg.src;im.alt="Imagem de fundo atual";const s=document.createElement("span");s.textContent="Clique ou solte outra imagem para trocar";d.append(im,s);}
  else d.innerHTML="<b>Solte a imagem aqui</b>ou clique para escolher · também dá para soltar direto em qualquer arte";
  $("bgZoom").value=Math.round(state.bg.g.z*100);$("bgZoomO").textContent=Math.round(state.bg.g.z*100)+"%";
}
function wireDrop(el,input,onFile,any){
  const ok=x=>any?true:/^image\//.test(x.type);
  el.addEventListener("click",()=>input.click());
  el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();input.click();}});
  el.addEventListener("dragover",e=>{e.preventDefault();el.classList.add("over");});
  el.addEventListener("dragleave",()=>el.classList.remove("over"));
  el.addEventListener("drop",e=>{e.preventDefault();el.classList.remove("over");const f=[...e.dataTransfer.files].find(ok);if(f)onFile(f);});
  input.addEventListener("change",()=>{const f=input.files[0];if(f)onFile(f);input.value="";});
}
/* =========================================================
   Ferramenta de recorte da foto do médico
   ---------------------------------------------------------
   Abre a foto num quadro com o círculo exato da arte. Arraste para
   posicionar, use o zoom e aplique: sai um JPG quadrado de 800 × 800,
   já no formato e tamanho certos para todos os formatos.
   A foto original fica guardada (doc.orig) para recortar de novo.
   ========================================================= */
const CROP_OUT=800,CROP_VIEW=360,CROP_R=150;
let cropSt=null;
async function loadFileAsDataUrl(file){return fileToDataUrl(file,2400,"image/jpeg",.92);}
function openCrop(src){
  return new Promise(res=>{
    const im=new Image();
    im.onload=()=>{
      const base=(2*CROP_R)/Math.min(im.naturalWidth,im.naturalHeight);
      cropSt={im,base,z:1,cx:im.naturalWidth/2,cy:im.naturalHeight*.42,res};
      clampCrop();$("cropZ").value=100;$("cropZO").textContent="100%";drawCrop();openDlg($("cropDlg"));
    };
    im.onerror=()=>{toast("Não foi possível abrir essa foto.");res(null);};
    im.src=src;
  });
}
function cropScale(){return cropSt.base*cropSt.z;}
function clampCrop(){const s=cropScale(),h=CROP_R/s,im=cropSt.im;
  cropSt.cx=clamp(cropSt.cx,h,im.naturalWidth-h);cropSt.cy=clamp(cropSt.cy,h,im.naturalHeight-h);}
function drawCrop(){
  const cv=$("cropCv"),dpr=Math.min(2,window.devicePixelRatio||1);cv.width=CROP_VIEW*dpr;cv.height=CROP_VIEW*dpr;
  const x=cv.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);const s=cropScale(),c=CROP_VIEW/2;
  x.fillStyle="#2a2a2a";x.fillRect(0,0,CROP_VIEW,CROP_VIEW);
  x.drawImage(cropSt.im,c-cropSt.cx*s,c-cropSt.cy*s,cropSt.im.naturalWidth*s,cropSt.im.naturalHeight*s);
  x.save();x.beginPath();x.rect(0,0,CROP_VIEW,CROP_VIEW);x.arc(c,c,CROP_R,0,Math.PI*2);x.fillStyle="rgba(28,27,32,.6)";x.fill("evenodd");x.restore();
  x.beginPath();x.arc(c,c,CROP_R,0,Math.PI*2);x.lineWidth=2;x.strokeStyle="#f3f3f3";x.stroke();
  /* guias: linha dos olhos e do queixo, como referência de enquadramento */
  x.setLineDash([4,4]);x.strokeStyle="rgba(243,243,243,.45)";x.lineWidth=1;
  [c-CROP_R*.18,c+CROP_R*.45].forEach(y=>{x.beginPath();x.moveTo(c-CROP_R*.7,y);x.lineTo(c+CROP_R*.7,y);x.stroke();});x.setLineDash([]);
}
function finishCrop(apply){
  if(!cropSt)return;const st=cropSt;cropSt=null;closeDlg($("cropDlg"));
  if(!apply){st.res(null);return;}
  const o=document.createElement("canvas");o.width=o.height=CROP_OUT;const x=o.getContext("2d");const k=CROP_OUT/(2*CROP_R)*cropScaleOf(st);
  x.fillStyle="#d9d4cc";x.fillRect(0,0,CROP_OUT,CROP_OUT);x.imageSmoothingQuality="high";
  x.drawImage(st.im,CROP_OUT/2-st.cx*k,CROP_OUT/2-st.cy*k,st.im.naturalWidth*k,st.im.naturalHeight*k);
  st.res(o.toDataURL("image/jpeg",.92));
}
function cropScaleOf(st){return st.base*st.z;}
function wireCrop(){
  const cv=$("cropCv");let dr=null;
  cv.addEventListener("pointerdown",e=>{if(!cropSt)return;cv.setPointerCapture(e.pointerId);dr={x:e.clientX,y:e.clientY,cx:cropSt.cx,cy:cropSt.cy};});
  cv.addEventListener("pointermove",e=>{if(!dr||!cropSt)return;const r=cv.getBoundingClientRect(),k=CROP_VIEW/r.width,s=cropScale();
    cropSt.cx=dr.cx-(e.clientX-dr.x)*k/s;cropSt.cy=dr.cy-(e.clientY-dr.y)*k/s;clampCrop();drawCrop();});
  const end=()=>{dr=null;};cv.addEventListener("pointerup",end);cv.addEventListener("pointercancel",end);
  cv.addEventListener("wheel",e=>{if(!cropSt)return;e.preventDefault();setCropZ(cropSt.z*(e.deltaY<0?1.06:1/1.06));},{passive:false});
  cv.addEventListener("keydown",e=>{if(!cropSt)return;const m={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[e.key];
    if(m){e.preventDefault();const st=(e.shiftKey?20:4)/cropScale();cropSt.cx+=m[0]*st;cropSt.cy+=m[1]*st;clampCrop();drawCrop();}});
  $("cropZ").addEventListener("input",e=>setCropZ(e.target.value/100));
  $("cropApply").addEventListener("click",()=>finishCrop(true));
  $("cropCancel").addEventListener("click",()=>finishCrop(false));$("cropX").addEventListener("click",()=>finishCrop(false));
  $("cropDlg").addEventListener("cancel",e=>{e.preventDefault();finishCrop(false);});
}
function setCropZ(z){cropSt.z=clamp(z,1,4);$("cropZ").value=Math.round(cropSt.z*100);$("cropZO").textContent=Math.round(cropSt.z*100)+"%";clampCrop();drawCrop();}
/* Nova foto: abre o recorte; o resultado já vem quadrado e centralizado */
async function setDocPhoto(doc,file){
  let orig;try{orig=await loadFileAsDataUrl(file);}catch(e){toast("Não foi possível abrir essa foto.");return;}
  const out=await openCrop(orig);if(!out)return;
  doc.orig=orig;doc.src=out;doc.cx=.5;doc.cy=.5;doc.z=1;renderDocs();scheduleAll();save();
}
async function recropDoc(doc){
  const src=doc.orig||doc.src;if(!src){toast("Adicione uma foto primeiro.");return;}
  const out=await openCrop(src);if(!out)return;
  if(!doc.orig)doc.orig=src;doc.src=out;doc.cx=.5;doc.cy=.5;doc.z=1;renderDocs();scheduleAll();save();
}
/* Miniatura arrastável para enquadrar a foto */
function wirePhotoThumb(ph,getDoc,onChange,onPick){
  let dr=null,moved=false;
  ph.addEventListener("pointerdown",e=>{moved=false;const d=getDoc();const im=img(d.src);if(!im)return;ph.setPointerCapture(e.pointerId);dr={x:e.clientX,y:e.clientY,cx:d.cx,cy:d.cy,g:coverGeom(im,{x:0,y:0,w:ph.clientWidth,h:ph.clientWidth},d),im};});
  ph.addEventListener("pointermove",e=>{if(!dr)return;const d=getDoc();const dx=e.clientX-dr.x,dy=e.clientY-dr.y;if(Math.abs(dx)+Math.abs(dy)>2)moved=true;
    d.cx=dr.cx-dx/dr.g.dw;d.cy=dr.cy-dy/dr.g.dh;clampFrame(d,{x:0,y:0,w:76,h:76},dr.im);drawThumb(ph,d);onChange(false);});
  ph.addEventListener("pointerup",()=>{if(dr){dr=null;onChange(true);}if(!moved)onPick();moved=false;});
  ph.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();onPick();}});
}
function renderDocs(){
  const box=$("docs");box.textContent="";
  const n=state.docs.length;$("docCount").textContent=n+" de "+MAXDOCS;$("addDoc").disabled=$("pullDoc").disabled=n>=MAXDOCS;
  [...state.docs].reverse().forEach((doc,vi)=>{
    const i=state.docs.indexOf(doc);
    const card=document.createElement("div");card.className="doc";
    const ph=document.createElement("canvas");ph.className="ph";ph.width=152;ph.height=152;ph.title="Arraste para enquadrar · clique para trocar a foto · solte uma foto aqui";
    ph.tabIndex=0;ph.setAttribute("role","button");ph.setAttribute("aria-label","Foto de "+(doc.name||"doutor"));
    const file=document.createElement("input");file.type="file";file.accept="image/*";file.hidden=true;
    file.addEventListener("change",()=>{if(file.files[0])setDocPhoto(doc,file.files[0]);});
    wirePhotoThumb(ph,()=>doc,fin=>{scheduleAll();if(fin)save();},()=>file.click());
    ph.addEventListener("dragover",e=>{e.preventDefault();ph.classList.add("over");});
    ph.addEventListener("dragleave",()=>ph.classList.remove("over"));
    ph.addEventListener("drop",e=>{e.preventDefault();ph.classList.remove("over");const f=[...e.dataTransfer.files].find(x=>/^image\//.test(x.type));if(f)setDocPhoto(doc,f);});
    ph._doc=doc;drawThumb(ph,doc);
    const meta=document.createElement("div");meta.className="meta";
    const pos=document.createElement("span");pos.className="pos";pos.textContent=n===1?"Único":(vi===0?"Mais à esquerda":vi===n-1?"Mais à direita":"Posição "+(vi+1)+" da esquerda");
    if(doc.dbId){const p=document.createElement("span");p.className="pill";p.textContent="do banco";p.title="Atualiza sozinho quando o cadastro muda no banco";pos.append(p);}
    const nm=document.createElement("input");nm.className="txt";nm.value=doc.name;nm.placeholder="Nome";nm.setAttribute("aria-label","Nome do doutor");
    nm.addEventListener("input",()=>{doc.name=nm.value;scheduleAll();save();});
    nm.addEventListener("change",()=>{doc.name=fmtName(nm.value);nm.value=doc.name;scheduleAll();save();});
    const crm=document.createElement("input");crm.className="txt";crm.value=doc.crm;crm.placeholder="CRM (cole em qualquer formato)";crm.setAttribute("aria-label","CRM");
    crm.addEventListener("input",()=>{doc.crm=crm.value;scheduleAll();save();});
    /* Colar ou sair do campo: o CRM já fica no formato “CRM-UF: NÚMERO” */
    crm.addEventListener("paste",e=>{const t=(e.clipboardData||window.clipboardData).getData("text");if(!t)return;e.preventDefault();doc.crm=formatCRM(t);crm.value=doc.crm;scheduleAll();save();});
    crm.addEventListener("change",()=>{doc.crm=formatCRM(crm.value);crm.value=doc.crm;scheduleAll();save();});
    meta.append(pos,nm,crm);
    const tools=document.createElement("div");tools.className="tools";
    const z=document.createElement("input");z.type="range";z.min=100;z.max=300;z.value=Math.round(doc.z*100);z.setAttribute("aria-label","Zoom da foto");z.title="Zoom da foto";
    z.addEventListener("input",()=>{doc.z=z.value/100;const im=img(doc.src);if(im)clampFrame(doc,{x:0,y:0,w:76,h:76},im);drawThumb(ph,doc);scheduleAll();save();});
    const move=dir=>{const j=i-dir;if(j<0||j>=n)return;[state.docs[i],state.docs[j]]=[state.docs[j],state.docs[i]];renderDocs();scheduleAll();save();};
    tools.append(z,
      mkIco("‹","Mover para a esquerda",()=>move(-1),vi===0),
      mkIco("›","Mover para a direita",()=>move(1),vi===n-1),
      mkIco("✂","Recortar foto",()=>recropDoc(doc),!doc.src),
      mkIco("⤒",doc.dbId?"Atualizar cadastro no banco":"Salvar no banco",()=>saveDocToDb(doc)),
      mkIco("×","Remover doutor da arte",()=>{state.docs.splice(i,1);renderDocs();scheduleAll();save();},false,"del"));
    card.append(ph,meta,tools,file);box.append(card);
  });
}
function drawThumb(cv,doc){const x=cv.getContext("2d");x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,cv.width,cv.height);const s=cv.width/76;x.setTransform(s,0,0,s,0,0);drawDocPhoto(x,doc,38,38,38);}
function renderSideThumbs(){document.querySelectorAll(".doc .ph").forEach(c=>{if(c._doc)drawThumb(c,c._doc);});}

/* Texto rico */
function wireRte(el,key){
  el.addEventListener("input",()=>{state[key]=richToHtml(parseRichNode(el));scheduleAll();save();});
  el.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&e.key.toLowerCase()==="b"){e.preventDefault();document.execCommand("bold");state[key]=richToHtml(parseRichNode(el));scheduleAll();save();}});
  el.addEventListener("paste",e=>{e.preventDefault();const t=(e.clipboardData||window.clipboardData).getData("text/plain");document.execCommand("insertText",false,t);});
}
function setRtes(){$("rte").innerHTML=richToHtml(parseRich(state.headline||""));$("rteSub").innerHTML=richEmpty(state.subtitle)?"":richToHtml(parseRich(state.subtitle||""));}
/* Atalho Ctrl + R → ® */
function wireReg(inp){inp.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="r"){e.preventDefault();e.stopPropagation();
  const s=inp.selectionStart,t=inp.selectionEnd;inp.setRangeText("®",s,t,"end");inp.dispatchEvent(new Event("input",{bubbles:true}));}});}

/* Rodapé na aba notícia */
function drawNewsFooterPreview(){
  const cv=$("nfPrev");if(!cv)return;const src=footerCanvas();
  if(!src){cv.width=600;cv.height=60;const x=cv.getContext("2d");x.clearRect(0,0,600,60);x.fillStyle="#7f7f7f";x.font=`500 15px ${FONT}`;x.textAlign="center";x.textBaseline="middle";x.fillText("Adicione logos para montar o rodapé",300,30);return;}
  /* o mesmo bloco da aba Rodapé: rodapé + disclaimer */
  const FF=fullFooter(src);cv.width=FF.W;cv.height=FF.H;const x=cv.getContext("2d");x.clearRect(0,0,FF.W,FF.H);x.drawImage(FF.canvas,0,0);
}
function renderNewsFooterUI(){
  const box=$("nfSecs");if(!box)return;box.textContent="";
  state.footer.sections.forEach(sec=>{
    const c=document.createElement("div");c.className="nfsec";const t=document.createElement("b");t.textContent=sec.title||"Seção sem título";c.append(t);
    const chips=document.createElement("div");chips.className="nchips";
    sec.logos.forEach((it,li)=>{const l=lib.get(it.ref);const ch=document.createElement("span");ch.className="nchip";ch.title=l?l.name:"";
      if(l&&l.src){const im=document.createElement("img");im.src=l.src;im.alt=l.name;ch.append(im);}else ch.append(document.createTextNode(l?l.name:"?"));
      ch.append(mkIco("×","Remover "+(l?l.name:"logo"),()=>{sec.logos.splice(li,1);footerChanged(true);},false,"del"));chips.append(ch);});
    const add=document.createElement("button");add.type="button";add.className="addlogo";add.textContent="+ Logo do banco";
    add.addEventListener("click",()=>pickLogo(sec));chips.append(add);c.append(chips);box.append(c);
  });
  const imp=state.footer.useImport&&state.footer.importSrc;
  $("nfSecs").hidden=!!imp;$("fImpRow").hidden=!imp;$("fImpDrop").hidden=!!imp;
  drawNewsFooterPreview();
}

/* #####################################################################
   PARTE 3
   ##################################################################### */

/* =========================================================
   Banco de dados unificado (arquivos do repositório)
   ---------------------------------------------------------
   “bank” é a versão em uso dos dados compartilhados:
     colors   ← dados/banco.json › cores
     look     ← dados/banco.json › aparencia
     doctors  ← dados/banco.json › medicos  (fotos em dados/medicos/)
     footers  ← dados/banco.json › rodapes
   Os logos vêm de logos/logos.json (Parte 1).

   Formato do dados/banco.json (legível e editável à mão):
   {
     "cores": { "tribemd": {"escura": "#563f99", "clara": "#b58fff"}, …,
                "branca": "#f3f3f3", "preta": "#2a2a2a" },
     "aparencia": { "sombra_fotos": 0.196 },
     "medicos": [ { "id", "nome", "crm", "arquivo",
                    "enquadramento": {"x", "y", "zoom"}, "atualizado" } ],
     "rodapes": [ { "id", "nome", "secoes": [ {"titulo",
                    "logos": [ {"logo", "escala"} ] } ], "ajustes", "atualizado" } ]
   }
   ========================================================= */
const COLOR_ROWS=[["tribemd","TribeMD / TribeNews"],["oncologia","Oncologia Brasil"],["hemo","Hemomeeting"]];
let bank={colors:JSON.parse(JSON.stringify(DEFAULT_COLORS)),look:{...DEFAULT_LOOK},doctors:[],footers:[]};
let manifest={grupo:[],farmaceuticas:[],templates:[]};
let colorDraft=null,lookDraft=null;   // edições do administrador ainda não publicadas
let dataLoaded=false;

function emptyBancoJson(){
  const c=DEFAULT_COLORS;
  return{cores:{tribemd:{escura:c.tribemd.dark,clara:c.tribemd.light},oncologia:{escura:c.oncologia.dark,clara:c.oncologia.light},hemo:{escura:c.hemo.dark,clara:c.hemo.light},branca:c.white,preta:c.black},
    aparencia:{sombra_fotos:DEFAULT_LOOK.shadow},medicos:[],rodapes:[]};
}
/* JSON do repositório → formato usado pelo código */
function bankFromJson(j){
  j=j||{};const cj=j.cores||{};const o=JSON.parse(JSON.stringify(DEFAULT_COLORS));
  COLOR_ROWS.forEach(([k])=>{const x=cj[k]||{};if(isHex(x.escura))o[k].dark=x.escura.toLowerCase();if(isHex(x.clara))o[k].light=x.clara.toLowerCase();});
  if(isHex(cj.branca))o.white=cj.branca.toLowerCase();if(isHex(cj.preta))o.black=cj.preta.toLowerCase();
  const sv=j.aparencia&&+j.aparencia.sombra_fotos;
  return{colors:o,look:{shadow:Number.isFinite(sv)?clamp(sv,0,1):DEFAULT_LOOK.shadow},
    doctors:(j.medicos||[]).filter(d=>d&&d.id).map(d=>{const e=d.enquadramento||{};return{id:d.id,name:d.nome||"",crm:d.crm||"",arquivo:d.arquivo||"",
      src:d.arquivo?fileSrc(FOTOS_DIR+d.arquivo):null,cx:+e.x||.5,cy:e.y!=null?+e.y:.42,z:+e.zoom||1,updatedAt:d.atualizado||""};}),
    footers:(j.rodapes||[]).filter(r=>r&&r.id).map(r=>({id:r.id,name:r.nome||"Rodapé",updatedAt:r.atualizado||"",settings:{...FDEF,...(r.ajustes||{})},
      img:r.imagem?fileSrc("dados/rodapes/"+r.imagem):null,imagem:r.imagem||"",
      sections:(r.secoes||[]).map((s,i)=>({id:"s"+(i+1),title:s.titulo||"",logos:(s.logos||[]).map(l=>({ref:l.logo,scale:+l.escala||1}))}))}))};
}

/* =========================================================
   Leitura dos dados
   ---------------------------------------------------------
   Sem chave: lê os arquivos publicados no site (GitHub Pages).
   Com chave: lê direto do repositório pela API (sempre a versão mais
   nova, sem esperar o Pages republicar).
   ========================================================= */
async function readPublicJson(path){
  const r=await fetch(path,{cache:"no-cache"});
  if(r.status===404)return null;if(!r.ok)throw new Error("HTTP "+r.status);
  return r.json();
}
async function readRepoJson(path){
  try{
    const d=await ghApi("/repos/"+gh.repo+"/contents/"+path+"?ref="+encodeURIComponent(gh.branch));
    const bytes=Uint8Array.from(atob(d.content.replace(/\s/g,"")),c=>c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }catch(e){if(e.status===404)return null;throw e;}
}
async function loadData(){
  if(location.protocol==="file:"&&!gh.on){
    setStatus("Abra o site por um endereço http (GitHub Pages ou servidor local). Aberto como arquivo, os dados não carregam.");
    renderAllData();return;
  }
  if(gh.on)retryFailedImgs();
  try{
    const read=gh.on?readRepoJson:readPublicJson;
    const [m,b]=await Promise.all([read(LOGOS_PATH),read(BANCO_PATH)]);
    applyData(m,b);
  }catch(e){
    console.error(e);
    setStatus(gh.on?ghError(e):"Não foi possível ler os dados (logos/logos.json ou dados/banco.json). Confira se os arquivos existem e se o JSON está válido.");
    toast("Erro ao carregar o banco de dados.",5000);
  }
}
function applyData(m,b){
  manifest=m||{grupo:[],farmaceuticas:[],templates:[]};applyManifest(manifest);
  bank=bankFromJson(b||emptyBancoJson());dataLoaded=true;
  /* Rascunho do administrador que já é igual ao publicado deixa de ser rascunho */
  if(colorDraft&&JSON.stringify(colorDraft)===JSON.stringify(bank.colors))colorDraft=null;
  if(lookDraft&&lookDraft.shadow===bank.look.shadow)lookDraft=null;
  renderAllData();
}
/* Redesenha tudo o que depende do banco */
function renderAllData(){
  rebuildLib();renderFtLib();renderFtSecs();renderFtTemplates();
  syncNewsDocsFromDb();renderNewsFooterUI();
  renderBrands();renderSwatches();syncLookUI();
  renderColors();renderDbDocs();renderDbLogos();renderDbFooters();renderAdminUI();
  if($("pickDlg").open&&pickRender)pickRender();
  footerChanged(false,true);
}

/* =========================================================
   Conexão com o GitHub (Área do administrador)
   ---------------------------------------------------------
   A chave (fine-grained token com “Contents: Read and write” só neste
   repositório) fica APENAS neste navegador — localStorage, ou
   sessionStorage se “Lembrar” estiver desmarcado. Usa a mesma chave
   salva pelo Gerador de rodapé (“rodape-admin-v1”), então quem já
   estava conectado continua conectado.
   ========================================================= */
const ADMIN_KEY="rodape-admin-v1";
const gh={on:false,repo:"",branch:"main",token:"",login:""};
function guessRepo(){const h=location.hostname;if(!h.endsWith(".github.io"))return"";const owner=h.split(".")[0];const first=location.pathname.split("/").filter(Boolean)[0];return owner+"/"+(first||h);}
function loadAdmin(){let raw=null;try{raw=localStorage.getItem(ADMIN_KEY)||sessionStorage.getItem(ADMIN_KEY);}catch(e){}if(raw){try{Object.assign(gh,JSON.parse(raw));}catch(e){}}gh.on=false;}
function storeAdmin(remember){const data=JSON.stringify({repo:gh.repo,branch:gh.branch,token:gh.token,login:gh.login});
  try{localStorage.removeItem(ADMIN_KEY);sessionStorage.removeItem(ADMIN_KEY);(remember?localStorage:sessionStorage).setItem(ADMIN_KEY,data);}catch(e){}}
function forgetAdmin(){try{localStorage.removeItem(ADMIN_KEY);sessionStorage.removeItem(ADMIN_KEY);}catch(e){}Object.assign(gh,{on:false,token:"",login:""});}

/* Chamada à API do GitHub com a chave */
async function ghApi(path,opts={}){
  const headers={"Accept":"application/vnd.github+json","Authorization":"Bearer "+gh.token,"X-GitHub-Api-Version":"2022-11-28"};
  if(opts.body)headers["Content-Type"]="application/json";
  const res=await fetch("https://api.github.com"+path,{...opts,headers,cache:"no-store"});
  if(!res.ok){const err=new Error("GitHub "+res.status);err.status=res.status;try{err.body=await res.json();}catch(e){}throw err;}
  return res.status===204?null:res.json();
}
function ghError(e){
  if(e&&e.msg)return e.msg;
  if(!e||!e.status)return"Sem conexão com o GitHub. Verifique a internet e tente de novo.";
  if(e.status===401)return"Chave inválida ou expirada. Gere uma nova chave no GitHub.";
  if(e.status===403)return"O GitHub recusou a gravação. Confira se a chave tem “Contents: Read and write” e se não expirou"+((e.body&&e.body.message)?" (GitHub: “"+e.body.message+"”)":"")+".";
  if(e.status===404)return"Repositório, branch ou arquivo não encontrado. Saia do modo administrador e conecte de novo.";
  return"O GitHub recusou a operação (erro "+e.status+"). Tente de novo em instantes.";
}
/* Diagnóstico em 4 etapas: chave válida → enxerga o repositório →
   branch existe → pode gravar (blob de teste, que não muda nada) */
async function verifyAdmin(){
  const why=e=>(e&&e.body&&e.body.message)?" (GitHub: “"+e.body.message+"”)":"";
  try{const u=await ghApi("/user");gh.login=u.login||"";}
  catch(e){if(e.status===401)throw{msg:"Chave inválida ou expirada. Copie a chave completa (começa com github_pat_) ou gere uma nova."};if(!e.status)throw e;}
  let r;
  try{r=await ghApi("/repos/"+gh.repo);}
  catch(e){
    if(e.status===404)throw{msg:"A chave não enxerga o repositório “"+gh.repo+"”. Confira: (1) o nome no formato usuario/repositorio; (2) na chave, “Repository access” inclui este repositório; (3) o “Resource owner” da chave é a conta ou organização dona do repositório."};
    if(e.status===403)throw{msg:"O GitHub bloqueou a chave neste repositório. Se ele pertence a uma organização, a chave pode estar aguardando aprovação"+why(e)+"."};
    throw e;
  }
  if(r.permissions&&r.permissions.push===false)throw{msg:"Sua conta do GitHub só tem leitura neste repositório. O dono precisa adicioná-la em Settings → Collaborators."};
  try{await ghApi("/repos/"+gh.repo+"/git/ref/heads/"+encodeURIComponent(gh.branch));}
  catch(e){if(e.status===404){if(r.default_branch&&r.default_branch!==gh.branch)gh.branch=r.default_branch;else throw{msg:"A branch “"+gh.branch+"” não existe neste repositório."};}else throw e;}
  try{await ghApi("/repos/"+gh.repo+"/git/blobs",{method:"POST",body:JSON.stringify({content:"teste",encoding:"utf-8"})});}
  catch(e){if(e.status===403||e.status===404)throw{msg:"A chave enxerga o repositório, mas não pode gravar. No GitHub, edite a chave e mude “Contents” para “Read and write”"+why(e)+"."};throw e;}
  gh.on=true;
}

/* logos.json no mesmo formato legível do Gerador de rodapé (um item por linha) */
function serializeManifest(m){
  const item=x=>"{"+Object.entries(x).map(([k,v])=>JSON.stringify(k)+": "+(Array.isArray(v)?"["+v.map(s=>JSON.stringify(s)).join(", ")+"]":JSON.stringify(v))).join(", ")+"}";
  const keys=["grupo","farmaceuticas","templates",...Object.keys(m).filter(k=>!["grupo","farmaceuticas","templates"].includes(k))];
  const parts=keys.map(k=>Array.isArray(m[k])?"  "+JSON.stringify(k)+": [\n"+m[k].map(x=>"    "+item(x)).join(",\n")+"\n  ]":"  "+JSON.stringify(k)+": "+JSON.stringify(m[k]));
  return"{\n"+parts.join(",\n\n")+"\n}\n";
}
const serializeBanco=b=>JSON.stringify(b,null,2)+"\n";

/* Cria UM commit com vários arquivos (Git Data API).
   files: [{path, base64} | {path, text} | {path, delete:true}] */
async function commitFiles(message,files){
  const R="/repos/"+gh.repo+"/git";
  const ref=await ghApi(R+"/ref/heads/"+encodeURIComponent(gh.branch));const baseSha=ref.object.sha;
  const base=await ghApi(R+"/commits/"+baseSha);
  const tree=[];
  for(const f of files){
    if(f.delete){tree.push({path:f.path,mode:"100644",type:"blob",sha:null});continue;}
    const blob=await ghApi(R+"/blobs",{method:"POST",body:JSON.stringify(f.base64?{content:f.base64,encoding:"base64"}:{content:f.text,encoding:"utf-8"})});
    tree.push({path:f.path,mode:"100644",type:"blob",sha:blob.sha});
  }
  const nt=await ghApi(R+"/trees",{method:"POST",body:JSON.stringify({base_tree:base.tree.sha,tree})});
  const commit=await ghApi(R+"/commits",{method:"POST",body:JSON.stringify({message,tree:nt.sha,parents:[baseSha]})});
  await ghApi(R+"/refs/heads/"+encodeURIComponent(gh.branch),{method:"PATCH",body:JSON.stringify({sha:commit.sha})});
}

/* Publica uma mudança no banco.
   build({logos, banco}) altera as cópias mais novas dos dois JSON e
   devolve {files} (imagens novas ou a apagar). Só os JSON que mudaram
   entram no commit. Se outra pessoa publicou ao mesmo tempo (409/422),
   lê de novo e tenta outra vez (até 3 vezes). */
async function publish(message,build){
  if(!gh.on)throw{msg:"Conecte a chave do GitHub (Área do administrador) para alterar o banco."};
  setBusy(true);
  try{
    for(let attempt=0;attempt<3;attempt++){
      const [m0,b0]=await Promise.all([readRepoJson(LOGOS_PATH),readRepoJson(BANCO_PATH)]);
      const logos=m0||{grupo:[],farmaceuticas:[],templates:[]},banco=b0||emptyBancoJson();
      const before={l:serializeManifest(logos),b:b0?serializeBanco(b0):""};
      const plan=build({logos,banco})||{files:[]};
      const files=(plan.files||[]).filter(f=>!(attempt===2&&f.delete));
      const lt=serializeManifest(logos),bt=serializeBanco(banco);
      if(lt!==before.l)files.push({path:LOGOS_PATH,text:lt});
      if(bt!==before.b)files.push({path:BANCO_PATH,text:bt});
      if(!files.length)return;
      try{await commitFiles(message,files);applyData(logos,banco);return;}
      catch(e){if((e.status===409||e.status===422)&&attempt<2)continue;throw e;}
    }
  }finally{setBusy(false);}
}
function setBusy(on){document.body.classList.toggle("saving",on);if(on)$("adminWho").dataset.prev=$("adminWho").textContent;renderAdminUI(on);}
const nowIso=()=>new Date().toISOString();
function pickFilename(name,used,ext){const base=slug(name)||"arquivo";let fn=base+"-"+stamp()+ext;for(let i=2;used.has(fn);i++)fn=base+"-"+stamp()+"-"+i+ext;return fn;}

/* ---------- Logos (publicar, trocar, remover) ---------- */
async function adminPublishLogo(name){
  const rep=upCtx.replace;const group=rep?rep.group:upCtx.slot?"farma":$("upGroup").value;
  const folder=group==="grupo"?"grupo":"farmaceuticas";
  const b64=(await blobToDataUrl(upBlob)).split(",")[1];
  await publish((rep?"Troca de logo: ":"Novo logo: ")+name,({logos:m})=>{
    const list=m[folder]=m[folder]||[];
    const oldName=rep?rep.name:upCtx.slot?upCtx.name:name;
    const entry=list.find(x=>slug(x.nome||"")===slug(oldName));
    if(!rep&&!upCtx.slot&&entry&&entry.arquivo)throw{msg:"Já existe um logo com esse nome. Use “Trocar” no logo existente."};
    const files=[];
    const used=new Set(list.map(x=>x.arquivo));
    const fn=(entry&&entry.arquivo)||used.has(slug(name)+".png")?pickFilename(name,used,".png"):slug(name)+".png";
    if(entry&&entry.arquivo)files.push({path:"logos/"+folder+"/"+entry.arquivo,delete:true});
    files.push({path:"logos/"+folder+"/"+fn,base64:b64});
    if(entry){
      if(slug(entry.nome)!==slug(name))(m.templates||[]).forEach(t=>t.realizacao=(t.realizacao||[]).map(n=>slug(n)===slug(entry.nome)?name:n));
      entry.nome=name;entry.arquivo=fn;
    }else list.push({nome:name,arquivo:fn});
    pendingSrc["logos/"+folder+"/"+fn]="data:image/png;base64,"+b64;
    return{files};
  });
  if(upCtx.slot){localLogos=localLogos.filter(d=>d.id!==upCtx.slot);saveLocalLogos();rebuildLib();}
}
async function adminRemoveLogo(l){
  const folder=l.group==="grupo"?"grupo":"farmaceuticas";
  toast("Removendo “"+l.name+"”…",10000);
  try{
    await publish("Remoção de logo: "+l.name,({logos:m})=>{
      const list=m[folder]||[];const i=list.findIndex(x=>slug(x.nome||"")===slug(l.name));
      if(i<0)return{files:[]};const old=list.splice(i,1)[0];
      return{files:old.arquivo?[{path:"logos/"+folder+"/"+old.arquivo,delete:true}]:[]};
    });
    toast("“"+l.name+"” removido. Some para todos em 1 a 2 minutos.",5000);
  }catch(e){console.error(e);toast(ghError(e),7000);}
}

/* =========================================================
   Aba Banco de dados
   ---------------------------------------------------------
   Cores + sombra, doutores, logos e rodapés salvos. Todos podem ver e
   usar; só quem conectou a chave do GitHub altera. Cores e sombra são
   editadas como rascunho (prévia na hora em todas as artes) e só vão
   para o repositório ao clicar em “Publicar”.
   ========================================================= */
function needAdmin(){if(gh.on)return true;toast("Para alterar o banco, conecte a chave do GitHub (Área do administrador).",4500);openAdminDlg();return false;}

/* ---------- Cores e sombra ---------- */
function colorField(label,get,set){
  const w=document.createElement("label");w.className="cfield";w.textContent=label;
  const row=document.createElement("div");row.className="colorrow";
  const pk=document.createElement("input");pk.type="color";pk.value=get();pk.setAttribute("aria-label",label);pk.disabled=!gh.on;
  const tx=document.createElement("input");tx.className="txt";tx.value=get();tx.maxLength=7;tx.setAttribute("aria-label",label+" (hex)");tx.spellcheck=false;tx.disabled=!gh.on;
  pk.addEventListener("input",()=>{tx.value=pk.value;set(pk.value);});
  tx.addEventListener("input",()=>{let v=tx.value.trim();if(!v.startsWith("#"))v="#"+v;if(isHex(v)){pk.value=v.toLowerCase();set(v.toLowerCase());}});
  row.append(pk,tx);w.append(row);return w;
}
function draftColors(){if(!colorDraft)colorDraft=JSON.parse(JSON.stringify(bank.colors));return colorDraft;}
function renderColors(){
  const box=$("colorsBox");if(!box)return;box.textContent="";
  COLOR_ROWS.forEach(([k,name])=>{
    const r=document.createElement("div");r.className="cbrand";const b=document.createElement("b");b.textContent=name;
    const pv=document.createElement("div");pv.className="cprev";const s1=document.createElement("span"),s2=document.createElement("span");s1.style.background=C()[k].dark;s2.style.background=C()[k].light;pv.append(s1,s2);b.append(pv);
    r.append(b,colorField("Escura (principal)",()=>C()[k].dark,v=>{draftColors()[k].dark=v;s1.style.background=v;colorsChanged();}),
               colorField("Clara (destaque)",()=>C()[k].light,v=>{draftColors()[k].light=v;s2.style.background=v;colorsChanged();}));
    box.append(r);
  });
  const r=document.createElement("div");r.className="cbrand";const b=document.createElement("b");b.textContent="Gerais";
  r.append(b,colorField("Branca",()=>C().white,v=>{draftColors().white=v;colorsChanged();}),colorField("Preta",()=>C().black,v=>{draftColors().black=v;colorsChanged();}));
  box.append(r);
  $("shadowA").disabled=!gh.on;$("colorsReset").disabled=!gh.on;
  syncDraftBar();
}
function colorsChanged(){renderBrands();renderSwatches();scheduleAll();syncDraftBar();}
function syncLookUI(){const v=Math.round(LOOK().shadow*100);$("shadowA").value=v;$("shadowAO").textContent=v+"%";}
function syncDraftBar(){const d=!!(colorDraft||lookDraft);$("draftBar").hidden=!d;}
async function publishLook(){
  if(!needAdmin())return;
  const c=C(),l=LOOK();
  try{
    await publish("Cores e sombra das fotos",({banco})=>{
      banco.cores={tribemd:{escura:c.tribemd.dark,clara:c.tribemd.light},oncologia:{escura:c.oncologia.dark,clara:c.oncologia.light},hemo:{escura:c.hemo.dark,clara:c.hemo.light},branca:c.white,preta:c.black};
      banco.aparencia={...(banco.aparencia||{}),sombra_fotos:Math.round(l.shadow*1000)/1000};
      return{files:[]};
    });
    colorDraft=lookDraft=null;renderColors();syncLookUI();colorsChanged();
    toast("Cores e sombra publicadas. Valem para todos em 1 a 2 minutos.",4500);
  }catch(e){console.error(e);toast(ghError(e),7000);}
}

/* ---------- Doutores ---------- */
function renderDbDocs(){
  const box=$("dbDocs");if(!box)return;box.textContent="";
  $("dbAddDoc").disabled=!gh.on;
  const q=slug($("dbDocQ").value);const list=bank.doctors.filter(d=>!q||slug(d.name+" "+d.crm).includes(q)).sort((a,b)=>(a.name||"").localeCompare(b.name||"","pt-BR"));
  if(!list.length){const e=document.createElement("div");e.className="empty-box";e.style.gridColumn="1/-1";
    e.textContent=bank.doctors.length?"Nenhum doutor com esse nome.":"Nenhum doutor cadastrado. Use “Novo doutor” ou salve um doutor da aba Gerar notícia (botão ⤒).";box.append(e);return;}
  list.forEach(d=>{
    const c=document.createElement("div");c.className="dbdoc";
    const cv=document.createElement("canvas");cv.width=168;cv.height=168;const x=cv.getContext("2d");x.scale(168/76,168/76);drawDocPhoto(x,d,38,38,38);
    const b=document.createElement("b");b.textContent=d.name||"Sem nome";const s=document.createElement("span");s.textContent=d.crm||"";
    const row=document.createElement("div");row.className="row";
    const use=document.createElement("button");use.className="btn small";use.textContent="Usar na notícia";use.addEventListener("click",()=>addDbDocToNews(d));
    row.append(use);
    row.append(mkIco("✎","Editar "+(d.name||""),()=>{if(needAdmin())openDocDlg(d);}));
    if(gh.on)row.append(mkIco("×","Excluir "+(d.name||""),()=>deleteDoctor(d),false,"del"));
    c.append(cv,b,s,row);box.append(c);
  });
}
function addDbDocToNews(d){
  if(state.docs.length>=MAXDOCS){toast("A arte já tem "+MAXDOCS+" doutores. Remova um para adicionar outro.");return false;}
  if(state.docs.some(x=>x.dbId===d.id)){toast((d.name||"Doutor")+" já está na arte.");return false;}
  state.docs.push({id:uid(),dbId:d.id,syncedAt:d.updatedAt,name:d.name,crm:d.crm,src:d.src,cx:d.cx,cy:d.cy,z:d.z});
  renderDocs();scheduleAll();save();toast((d.name||"Doutor")+" adicionado à arte.",1800);return true;
}
/* Doutores da arte que vieram do banco ficam iguais ao cadastro */
function syncNewsDocsFromDb(){
  if(!dataLoaded)return;let ch=false;
  state.docs.forEach(doc=>{if(!doc.dbId)return;const d=bank.doctors.find(x=>x.id===doc.dbId);if(!d){delete doc.dbId;ch=true;return;}
    if((d.updatedAt||"")!==(doc.syncedAt||"")){Object.assign(doc,{name:d.name,crm:d.crm,src:d.src,cx:d.cx,cy:d.cy,z:d.z,syncedAt:d.updatedAt});ch=true;}});
  if(ch){renderDocs();scheduleAll();save();}
}
/* Foto: se veio do computador (data URL), vira um JPG novo em dados/medicos/ */
async function writeDoctor(id,rec,message){
  let newFile=null,b64=null;
  if(rec.src&&rec.src.startsWith("data:")){
    const im=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=rec.src;});
    const s=Math.min(1,900/Math.max(im.naturalWidth,im.naturalHeight));const c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);
    c.getContext("2d").drawImage(im,0,0,c.width,c.height);const url=c.toDataURL("image/jpeg",.9);b64=url.split(",")[1];
    newFile=pickFilename(rec.name,new Set(bank.doctors.map(d=>d.arquivo)),".jpg");pendingSrc[FOTOS_DIR+newFile]=url;
  }
  const at=nowIso();
  await publish(message,({banco})=>{
    banco.medicos=banco.medicos||[];let e=banco.medicos.find(x=>x.id===id);const files=[];
    if(!e){e={id};banco.medicos.push(e);}
    if(newFile){if(e.arquivo)files.push({path:FOTOS_DIR+e.arquivo,delete:true});files.push({path:FOTOS_DIR+newFile,base64:b64});e.arquivo=newFile;}
    else if(!rec.src&&e.arquivo){files.push({path:FOTOS_DIR+e.arquivo,delete:true});e.arquivo="";}
    Object.assign(e,{nome:rec.name||"",crm:rec.crm||"",arquivo:e.arquivo||"",enquadramento:{x:Math.round(rec.cx*1000)/1000,y:Math.round(rec.cy*1000)/1000,zoom:Math.round(rec.z*100)/100},atualizado:at});
    return{files};
  });
  return{at,src:newFile?fileSrc(FOTOS_DIR+newFile):rec.src};
}
async function saveDocToDb(doc){
  if(!needAdmin())return;
  doc.name=fmtName(doc.name);doc.crm=formatCRM(doc.crm);
  if(!doc.name.trim()){toast("Informe o nome do doutor antes de salvar.");return;}
  toast("Salvando "+doc.name+" no banco…",8000);
  try{const id=doc.dbId||("d_"+slug(doc.name).slice(0,30)+"-"+uid());const r=await writeDoctor(id,doc,(doc.dbId?"Atualização de doutor: ":"Novo doutor: ")+doc.name);
    doc.dbId=id;doc.syncedAt=r.at;doc.src=r.src;renderDocs();save();toast(doc.name+" salvo no banco.");}
  catch(e){console.error(e);toast(ghError(e),7000);}
}
async function deleteDoctor(d){
  if(!needAdmin())return;
  if(!await ask({title:"Excluir doutor",msg:"Excluir “"+(d.name||"")+"” do banco? Nas artes abertas ele continua, como doutor avulso.",yes:"Excluir"}))return;
  try{await publish("Remoção de doutor: "+d.name,({banco})=>{const i=(banco.medicos||[]).findIndex(x=>x.id===d.id);if(i<0)return{files:[]};
      const old=banco.medicos.splice(i,1)[0];return{files:old.arquivo?[{path:FOTOS_DIR+old.arquivo,delete:true}]:[]};});
    toast("Doutor excluído do banco.");}
  catch(e){console.error(e);toast(ghError(e),7000);}
}
let docDlgRec=null;
function openDocDlg(d){
  docDlgRec=d?{id:d.id,name:d.name,crm:d.crm,src:d.src,cx:d.cx,cy:d.cy,z:d.z}:{id:null,name:"",crm:"",src:null,cx:.5,cy:.42,z:1};
  $("docDlgTitle").textContent=d?"Editar doutor":"Novo doutor";$("docDlgName").value=docDlgRec.name;$("docDlgCrm").value=docDlgRec.crm;$("docDlgZ").value=Math.round(docDlgRec.z*100);$("docDlgNote").textContent="";
  drawThumb($("docDlgPh"),docDlgRec);openDlg($("docDlg"));
}
function wireDocDlg(){
  const ph=$("docDlgPh");
  wirePhotoThumb(ph,()=>docDlgRec,()=>{},()=>$("docDlgFile").click());
  const take=async f=>{try{const orig=await loadFileAsDataUrl(f);const out=await openCrop(orig);if(!out)return;docDlgRec.orig=orig;docDlgRec.src=out;docDlgRec.cx=.5;docDlgRec.cy=.5;docDlgRec.z=1;$("docDlgZ").value=100;
    const im=new Image();im.onload=()=>drawThumb(ph,docDlgRec);im.src=docDlgRec.src;img(docDlgRec.src);}catch(e){$("docDlgNote").textContent="Não foi possível abrir essa foto.";}};
  $("docDlgFile").addEventListener("change",()=>{const f=$("docDlgFile").files[0];if(f)take(f);$("docDlgFile").value="";});
  ph.addEventListener("dragover",e=>{e.preventDefault();ph.classList.add("over");});ph.addEventListener("dragleave",()=>ph.classList.remove("over"));
  ph.addEventListener("drop",e=>{e.preventDefault();ph.classList.remove("over");const f=[...e.dataTransfer.files].find(x=>/^image\//.test(x.type));if(f)take(f);});
  $("docDlgZ").addEventListener("input",e=>{docDlgRec.z=e.target.value/100;const im=img(docDlgRec.src);if(im)clampFrame(docDlgRec,{x:0,y:0,w:76,h:76},im);drawThumb(ph,docDlgRec);});
  const close=()=>closeDlg($("docDlg"));$("docDlgX").addEventListener("click",close);$("docDlgCancel").addEventListener("click",close);
  $("docDlgSave").addEventListener("click",async()=>{
    docDlgRec.name=fmtName($("docDlgName").value);docDlgRec.crm=formatCRM($("docDlgCrm").value);
    if(!docDlgRec.name){$("docDlgNote").textContent="Informe o nome do doutor.";$("docDlgName").focus();return;}
    if(!needAdmin())return;const btn=$("docDlgSave");btn.disabled=true;btn.textContent="Publicando…";
    try{const isNew=!docDlgRec.id;await writeDoctor(docDlgRec.id||("d_"+slug(docDlgRec.name).slice(0,30)+"-"+uid()),docDlgRec,(isNew?"Novo doutor: ":"Atualização de doutor: ")+docDlgRec.name);close();toast("Doutor salvo no banco.");}
    catch(e){console.error(e);$("docDlgNote").textContent=ghError(e);}
    finally{btn.disabled=false;btn.textContent="Publicar no banco";}
  });
}

/* ---------- Logos ---------- */
let dbLogoFilter="all";
function renderDbLogos(){
  const box=$("dbLogos");if(!box)return;box.textContent="";
  libItems(dbLogoFilter,$("dbLogoQ").value).forEach(l=>{
    const t=logoTile(l,{onPick:l.builtin?()=>openLogoEd(l):null,draggable:false});
    if(l.builtin){const ed=document.createElement("button");ed.type="button";ed.className="edt";ed.textContent="✎";ed.title="Editar "+l.name;ed.setAttribute("aria-label","Editar "+l.name);
      ed.addEventListener("click",e=>{e.stopPropagation();openLogoEd(l);});t.append(ed);}
    box.append(t);});
}

/* ---------- Editar logo (nome e arquivo) ---------- */
let leRec=null;
function openLogoEd(l){
  if(!needAdmin())return;
  leRec=l;$("leTitle").textContent="Editar logo – "+l.name;$("leName").value=l.name;$("leImg").src=l.src||"";$("lePrev").hidden=!l.src;
  openDlg($("logoEdDlg"));setTimeout(()=>$("leName").select(),30);
}
async function saveLogoEd(){
  const l=leRec;if(!l)return;
  const name=$("leName").value.trim().replace(/\s+/g," ");
  if(!name){toast("Informe o nome do logo.");return;}
  if(name===l.name){closeDlg($("logoEdDlg"));return;}
  const folder=l.group==="grupo"?"grupo":"farmaceuticas";
  const newId=l.group==="grupo"?"g_"+slug(name).replace(/-/g,""):"f_"+slug(name);
  if(newId!==l.id&&lib.has(newId)){toast("Já existe um logo com esse nome.");return;}
  closeDlg($("logoEdDlg"));toast("Salvando “"+name+"”…",8000);
  try{
    await publish("Logo renomeado: "+l.name+" → "+name,({logos:m,banco})=>{
      const e=(m[folder]||[]).find(x=>slug(x.nome||"")===slug(l.name));if(!e)return{files:[]};
      e.nome=name;
      /* Templates guardam o nome; rodapés salvos guardam o id */
      (m.templates||[]).forEach(t=>{t.realizacao=(t.realizacao||[]).map(n=>slug(n)===slug(l.name)?name:n);});
      (banco.rodapes||[]).forEach(r=>(r.secoes||[]).forEach(s=>(s.logos||[]).forEach(x=>{if(x.logo===l.id)x.logo=newId;})));
      return{files:[]};
    });
    /* O rodapé em edição neste navegador também passa a usar o novo id */
    state.footer.sections.forEach(s=>s.logos.forEach(x=>{if(x.ref===l.id)x.ref=newId;}));footerChanged(true);
    toast("Logo renomeado para “"+name+"”.",4000);
  }catch(e){console.error(e);toast(ghError(e),7000);}
}
function wireLogoEd(){
  $("leX").addEventListener("click",()=>closeDlg($("logoEdDlg")));$("leCancel").addEventListener("click",()=>closeDlg($("logoEdDlg")));
  $("leSave").addEventListener("click",saveLogoEd);
  $("leName").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();saveLogoEd();}});
  $("leSwap").addEventListener("click",()=>{const l=leRec;closeDlg($("logoEdDlg"));openUpload({replace:l,name:l.name,group:l.group});});
}

/* ---------- Rodapés salvos ---------- */
/* Miniatura de um rodapé salvo: a imagem PNG guardada no banco (proporção
   exata); se não houver, desenha a partir das seções */
function footerThumb(rec){
  if(rec.img){const im=document.createElement("img");im.src=rec.img;im.alt="Rodapé "+rec.name;im.className="fthumb checker";return im;}
  const L=fLayout({settings:{...FDEF,...rec.settings},sections:rec.sections||[]});if(!L)return null;const c=fCanvas(L);c.className="fthumb checker";return c;}
function renderDbFooters(){
  const box=$("dbFoots");if(!box)return;box.textContent="";
  $("dbSaveFoot").disabled=!gh.on;
  if(!bank.footers.length){const e=document.createElement("div");e.className="empty-box";e.textContent="Nenhum rodapé salvo. Monte um na aba Rodapé e clique em “Salvar no banco”.";box.append(e);return;}
  [...bank.footers].sort((a,b)=>(b.updatedAt||"").localeCompare(a.updatedAt||"")).forEach(r=>{
    const c=document.createElement("div");c.className="dbfoot";
    const meta=document.createElement("div");meta.className="meta";const b=document.createElement("b");b.textContent=r.name;
    const th=footerThumb(r);meta.append(b);if(th)meta.append(th);
    const row=document.createElement("div");row.className="row";
    const use=document.createElement("button");use.className="btn small";use.textContent="Usar";use.addEventListener("click",()=>applyFooterRec(r));
    row.append(use);
    if(gh.on)row.append(mkIco("×","Excluir rodapé "+r.name,async()=>{if(!await ask({title:"Excluir rodapé",msg:"Excluir “"+r.name+"” do banco?",yes:"Excluir"}))return;
      try{await publish("Remoção de rodapé: "+r.name,({banco})=>{const old=(banco.rodapes||[]).find(x=>x.id===r.id);banco.rodapes=(banco.rodapes||[]).filter(x=>x.id!==r.id);
        return{files:old&&old.imagem?[{path:"dados/rodapes/"+old.imagem,delete:true}]:[]};});toast("Rodapé excluído.");}
      catch(e){console.error(e);toast(ghError(e),7000);}},false,"del"));
    c.append(meta,row);box.append(c);
  });
}
function applyFooterRec(r){
  state.footer.sections=r.sections.map(s=>({id:"s"+uid(),title:s.title,logos:s.logos.map(l=>({ref:l.ref,scale:l.scale}))}));
  state.footer.settings={...FDEF,...r.settings};state.footer.useImport=false;state.footer.importSrc=null;state.footer.active=state.footer.sections[0]&&state.footer.sections[0].id;
  syncFtSettings();footerChanged(true);toast("Rodapé “"+r.name+"” aplicado em todas as abas.");
}
async function saveFooterToDb(){
  if(!needAdmin())return;
  const name=await ask({title:"Salvar rodapé no banco",msg:"Dê um nome para encontrar este rodapé depois.",input:BRAND_META[state.brand].name+" – "+new Date().toLocaleDateString("pt-BR"),yes:"Publicar"});
  if(!name)return;
  const secs=state.footer.sections.map(s=>({titulo:s.title,logos:s.logos.map(l=>({logo:l.ref,escala:l.scale}))}));
  /* Guarda também o PNG do rodapé em tamanho real (sem esticar) */
  await fontsReady();footerDirty=true;const L=footerLayout();
  const id="r_"+uid();const fn=L?(slug(name)||"rodape")+"-"+stamp()+".png":"";
  let b64=null;if(L){const url=fCanvas(L).toDataURL("image/png");b64=url.split(",")[1];pendingSrc["dados/rodapes/"+fn]=url;}
  try{await publish("Novo rodapé salvo: "+name,({banco})=>{banco.rodapes=banco.rodapes||[];
      banco.rodapes.push({id,nome:name,imagem:fn,largura:L?L.W:0,altura:L?L.H:0,secoes:secs,ajustes:{...state.footer.settings},atualizado:nowIso()});
      return{files:b64?[{path:"dados/rodapes/"+fn,base64:b64}]:[]};});
    toast("Rodapé “"+name+"” salvo no banco.");}
  catch(e){console.error(e);toast(ghError(e),7000);}
}

/* ---------- Seletor “Puxar do banco” ---------- */
let pickRender=null,pickFilter="all";
function openPick(title,render,withFilter){pickRender=render;$("pickTitle").textContent=title;$("pickQ").value="";$("pickF").hidden=!withFilter;pickRender();openDlg($("pickDlg"));setTimeout(()=>$("pickQ").focus(),30);}
function emptyPick(g,t){const e=document.createElement("div");e.className="empty-box";e.style.gridColumn="1/-1";e.textContent=t;g.append(e);}
function pickDoctor(){
  openPick("Puxar doutor do banco",()=>{
    const g=$("pickGrid");g.textContent="";const q=slug($("pickQ").value);
    const list=bank.doctors.filter(d=>!q||slug(d.name+" "+d.crm).includes(q)).sort((a,b)=>(a.name||"").localeCompare(b.name||"","pt-BR"));
    if(!list.length){emptyPick(g,bank.doctors.length?"Nenhum doutor com esse nome.":"Nenhum doutor no banco ainda. Cadastre na aba Banco de dados ou use ⤒ em um doutor da arte.");return;}
    list.forEach(d=>{const b=document.createElement("button");b.type="button";b.className="pick";const cv=document.createElement("canvas");cv.width=140;cv.height=140;
      const x=cv.getContext("2d");x.scale(140/76,140/76);drawDocPhoto(x,d,38,38,38);
      const n=document.createElement("b");n.textContent=d.name;const s=document.createElement("span");s.textContent=d.crm;b.append(cv,n,s);
      b.addEventListener("click",()=>{if(addDbDocToNews(d))closeDlg($("pickDlg"));});g.append(b);});
  });
}
function pickFooter(){
  openPick("Puxar rodapé salvo",()=>{
    const g=$("pickGrid");g.textContent="";const q=slug($("pickQ").value);
    const list=bank.footers.filter(r=>!q||slug(r.name).includes(q));
    if(!list.length){emptyPick(g,"Nenhum rodapé salvo ainda. Use “Salvar no banco” na aba Rodapé.");return;}
    list.forEach(r=>{const b=document.createElement("button");b.type="button";b.className="pick pickfoot";const n=document.createElement("b");n.textContent=r.name;const th=footerThumb(r);
      b.append(n);if(th)b.append(th);b.addEventListener("click",()=>{applyFooterRec(r);closeDlg($("pickDlg"));});g.append(b);});
  });
}
function pickLogo(sec){
  openPick("Adicionar logo em “"+(sec.title||"seção")+"”",()=>{
    const g=$("pickGrid");g.textContent="";
    const items=libItems(pickFilter,$("pickQ").value).filter(l=>l.src);
    if(!items.length){emptyPick(g,"Nenhum logo com esse nome. Envie novos logos na aba Rodapé ou Banco de dados.");return;}
    items.forEach(l=>g.append(logoTile(l,{onPick:()=>{sec.logos.push({ref:l.id,scale:1});footerChanged(true);closeDlg($("pickDlg"));toast("“"+l.name+"” adicionado.",1800);},draggable:false})));
  },true);
}

/* ---------- Interface do administrador ---------- */
function setStatus(t){$("ftStatus").textContent=t;}
function renderAdminUI(saving){
  const on=gh.on;
  $("adminChip").classList.toggle("on",on);
  $("adminWho").textContent=saving?"Gravando no GitHub…":on?((gh.login?"@"+gh.login+" · ":"")+gh.repo):"Somente leitura";
  $("adminBtn").textContent=on?"Sair":"Conectar GitHub";
  $("dbBanner").classList.toggle("on",on);
  $("dbBannerTxt").textContent=on
    ?"Conectado como "+(gh.login?"@"+gh.login:"administrador")+" em "+gh.repo+". Cada alteração vira um commit e aparece para todos em 1 a 2 minutos."
    :"Somente leitura. Todos podem usar o banco nas artes; para incluir, editar ou excluir, conecte a chave do GitHub.";
  $("dbBannerBtn").textContent=on?"Sair":"Conectar GitHub";
  if(dataLoaded)setStatus(on?"Modo administrador: logos enviados são publicados para todos.":"Logos enviados por aqui ficam só neste navegador. Para liberar para todos, conecte a chave do GitHub.");
}
function openAdminDlg(){
  $("admRepo").value=gh.repo||guessRepo();$("admBranch").value=gh.branch||"main";$("admToken").value=gh.token||"";$("admNote").textContent="";
  openDlg($("admDlg"));
}
function adminToggle(){
  if(gh.on){forgetAdmin();colorDraft=lookDraft=null;renderAllData();loadData();toast("Você saiu do modo administrador e a chave foi apagada deste navegador.",4000);}
  else openAdminDlg();
}
function wireAdmin(){
  $("adminBtn").addEventListener("click",adminToggle);$("dbBannerBtn").addEventListener("click",adminToggle);$("ftAdminLink").addEventListener("click",adminToggle);
  const close=()=>closeDlg($("admDlg"));$("admCancel").addEventListener("click",close);$("admX").addEventListener("click",close);
  $("admConnect").addEventListener("click",async()=>{
    gh.repo=$("admRepo").value.trim().replace(/^https?:\/\/github\.com\//,"").replace(/\.git$/,"").replace(/\/+$/,"");
    gh.branch=$("admBranch").value.trim()||"main";gh.token=$("admToken").value.trim();
    if(!/^[^/\s]+\/[^/\s]+$/.test(gh.repo)){$("admNote").textContent="Informe o repositório no formato usuario/repositorio.";return;}
    if(!gh.token){$("admNote").textContent="Cole a chave (token) do GitHub.";return;}
    const btn=$("admConnect");btn.disabled=true;btn.textContent="Conectando…";
    try{await verifyAdmin();storeAdmin($("admRemember").checked);close();renderAllData();await loadData();toast("Modo administrador ativado.",3000);}
    catch(e){gh.on=false;renderAdminUI();$("admNote").textContent=ghError(e);}
    finally{btn.disabled=false;btn.textContent="Conectar";}
  });
  $("draftPublish").addEventListener("click",publishLook);
  $("draftDiscard").addEventListener("click",()=>{colorDraft=lookDraft=null;renderColors();syncLookUI();colorsChanged();});
}

/* =========================================================
   Exportação
   ---------------------------------------------------------
   PNG de cada formato, .zip com todos os PNGs e um PSD único com uma
   prancheta (artboard) por formato e camadas nomeadas.
   ========================================================= */
async function fontsReady(){if(!document.fonts)return;await Promise.all([400,500,600,700,800].map(w=>document.fonts.load(`${w} 40px Montserrat`).catch(()=>{})));await document.fonts.ready;}
function renderFull(f){const c=document.createElement("canvas");c.width=f.w;c.height=f.h;const ctx=c.getContext("2d");buildLayers(f,false).forEach(L=>{ctx.save();L.draw(ctx);ctx.restore();});return c;}
const toBlob=c=>new Promise(r=>c.toBlob(r,"image/png"));
function fileBase(){return"arte-"+slug(BRAND_META[state.brand].name)+"-"+stamp();}
function loadScript(src,g){return new Promise((res,rej)=>{if(window[g])return res(window[g]);const s=document.createElement("script");s.src=src;s.onload=()=>res(window[g]);s.onerror=()=>rej(new Error("load"));document.head.append(s);});}
const JSZIP_URL="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
const AGPSD_URL="https://cdn.jsdelivr.net/npm/ag-psd@30.2.0/dist/bundle.js";
async function busy(btn,label,fn){const h=btn.innerHTML;btn.disabled=true;btn.textContent=label;try{await fn();}catch(e){console.error(e);toast("Não foi possível gerar o arquivo. Verifique a conexão e tente de novo.",4500);}finally{btn.disabled=false;btn.innerHTML=h;}}
async function downloadOne(f){await fontsReady();footerDirty=true;saveBlob(await toBlob(renderFull(f)),fileBase()+"-"+f.id+"-"+f.w+"x"+f.h+".png");}
function wireExport(){
  $("pngsBtn").addEventListener("click",()=>busy($("pngsBtn"),"Gerando PNGs…",async()=>{
    const list=visibleFormats();if(!list.length){toast("Ative ao menos um formato.");return;}
    const JSZip=await loadScript(JSZIP_URL,"JSZip");await fontsReady();footerDirty=true;
    const zip=new JSZip();const base=fileBase();
    for(const f of list)zip.file(base+"-"+f.id+"-"+f.w+"x"+f.h+".png",await toBlob(renderFull(f)));
    saveBlob(await zip.generateAsync({type:"blob"}),base+"-pngs.zip");
  }));
  $("psdBtn").addEventListener("click",()=>busy($("psdBtn"),"Gerando PSD…",async()=>{
    const list=visibleFormats();if(!list.length){toast("Ative ao menos um formato.");return;}
    const ag=await loadScript(AGPSD_URL,"agPsd");
    await fontsReady();footerDirty=true;
    const GAP=160,MAXROW=5600;const pos={};let x=0,y=0,rowH=0,PW=0;
    list.forEach(f=>{if(x>0&&x+f.w>MAXROW){x=0;y+=rowH+GAP;rowH=0;}pos[f.id]={x,y};x+=f.w+GAP;rowH=Math.max(rowH,f.h);PW=Math.max(PW,x-GAP);});
    const PH=y+rowH;
    const comp=document.createElement("canvas");comp.width=PW;comp.height=PH;const cc=comp.getContext("2d");
    const children=[];
    for(const f of list){
      const p=pos[f.id];cc.drawImage(renderFull(f),p.x,p.y);const kids=[];
      buildLayers(f,false).forEach(L=>{
        const bx=Math.max(0,Math.floor(L.box.x)),by=Math.max(0,Math.floor(L.box.y));
        const bx2=Math.min(f.w,Math.ceil(L.box.x+L.box.w)),by2=Math.min(f.h,Math.ceil(L.box.y+L.box.h));
        const w=bx2-bx,h=by2-by;if(w<=0||h<=0)return;
        const c=document.createElement("canvas");c.width=w;c.height=h;const ctx=c.getContext("2d");ctx.translate(-bx,-by);ctx.save();L.draw(ctx);ctx.restore();
        kids.push({name:L.name,left:p.x+bx,top:p.y+by,canvas:c});
      });
      children.push({name:f.name+" "+f.w+"×"+f.h,opened:false,artboard:{rect:{top:p.y,left:p.x,bottom:p.y+f.h,right:p.x+f.w},guideIndices:[],presetName:"Custom",color:{r:255,g:255,b:255},backgroundType:1},children:kids});
    }
    const bytes=ag.writePsdUint8Array({width:PW,height:PH,canvas:comp,children},{generateThumbnail:true});
    saveBlob(new Blob([bytes],{type:"image/vnd.adobe.photoshop"}),fileBase()+".psd");
  }));
}

/* =========================================================
   Abas e início
   ---------------------------------------------------------
   Troca de abas, ligação dos campos aos eventos e init(): carrega o
   trabalho salvo neste navegador, desenha a interface, reconecta a
   chave do GitHub (se salva) e lê o banco.
   ========================================================= */
function showTab(t){
  state.tab=t;save();
  if(!$("tab-"+t))t="content";state.tab=t;
  ["content","foot","news","db"].forEach(k=>{$("tab-"+k).hidden=k!==t;$("t-"+k).setAttribute("aria-selected",k===t?"true":"false");$("t-"+k).tabIndex=k===t?0:-1;});
  if(t==="foot"){renderFtSecs();ftRender();}
  if(t==="news"){renderNewsFooterUI();sizeBoards();}
  if(t==="content"){renderNewsFooterUI();scheduleAll();}
  if(t==="db"){renderColors();renderDbDocs();renderDbLogos();renderDbFooters();}
}
function wireStatic(){
  document.querySelectorAll(".maintabs button").forEach(b=>{b.addEventListener("click",()=>showTab(b.dataset.tab));
    b.addEventListener("keydown",e=>{const tabs=[...document.querySelectorAll(".maintabs button")];const i=tabs.indexOf(b);
      if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();const n=tabs[(i+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length];n.focus();showTab(n.dataset.tab);}});});
  $("tagText").addEventListener("input",e=>{state.tagText=e.target.value;scheduleAll();save();});
  $("tagUpper").addEventListener("change",e=>{state.tagUpper=e.target.checked;scheduleAll();save();});
  $("eventTag").addEventListener("input",e=>{state.eventTag=e.target.value;scheduleAll();save();});
  wireReg($("eventTag"));wireReg($("tagText"));
  $("ctaText").addEventListener("input",e=>{state.cta=e.target.value;scheduleAll();save();});
  $("zoom").addEventListener("input",e=>{state.zoom=+e.target.value;sizeBoards();save();});
  wireDrop($("bgDrop"),$("bgFile"),setBg);
  $("bgZoom").addEventListener("input",e=>{state.bg.g.z=e.target.value/100;Object.values(state.bg.per).forEach(fr=>fr.z=state.bg.g.z);
    $("bgZoomO").textContent=e.target.value+"%";scheduleAll();syncInspector();save();});
  $("bgResetAll").addEventListener("click",()=>{state.bg.g={cx:.5,cy:.5,z:1};state.bg.per={};syncSideBg();scheduleAll();syncInspector();save();});
  $("bgRemove").addEventListener("click",()=>{state.bg.src=null;state.bg.per={};syncSideBg();scheduleAll();save();});
  $("dotsK").addEventListener("input",e=>{state.dotsK=e.target.value/100;$("dotsKO").textContent=e.target.value+"%";scheduleAll();save();});
  $("docGap").addEventListener("input",e=>{state.docGap=e.target.value/100;$("docGapO").textContent=e.target.value+"%";scheduleAll();save();});
  $("addDoc").addEventListener("click",()=>{if(state.docs.length>=MAXDOCS)return;state.docs.push({id:uid(),name:"Dr. Nome Sobrenome",crm:"CRM: 000000",src:null,cx:.5,cy:.42,z:1});renderDocs();scheduleAll();save();});
  $("pullDoc").addEventListener("click",pickDoctor);
  wireRte($("rte"),"headline");wireRte($("rteSub"),"subtitle");
  document.querySelectorAll(".boldBtn").forEach(b=>{b.addEventListener("mousedown",e=>e.preventDefault());
    b.addEventListener("click",()=>{const el=$(b.dataset.for);el.focus();document.execCommand("bold");el.dispatchEvent(new Event("input"));});});
  $("nfEdit").addEventListener("click",()=>showTab("foot"));$("nfPull").addEventListener("click",pickFooter);
  wireDrop($("fImpDrop"),$("fImpFile"),async file=>{try{state.footer.importSrc=await blobToDataUrl(file);state.footer.useImport=true;footerChanged(true);toast("Rodapé importado aplicado em todos os formatos.");}catch(e){toast("Não foi possível ler esse arquivo.");}});
  $("fImpClear").addEventListener("click",()=>{state.footer.useImport=false;state.footer.importSrc=null;footerChanged(true);});
  $("resetAll").addEventListener("click",async()=>{if(!await ask({title:"Começar do zero",msg:"Apagar textos, imagens, doutores e ajustes da arte e voltar ao modelo inicial? O banco de dados não é alterado.",yes:"Apagar"}))return;
    const keep={customFormats:state.customFormats,tab:state.tab};state=freshState();Object.assign(state,keep);sel=null;applyStateToUI();});
  const fb=$("fmtBase");BASE_FORMATS.forEach(f=>{const o=document.createElement("option");o.value=f.id;o.textContent=f.name+" ("+f.w+" × "+f.h+")";fb.append(o);});
  $("addFmt").addEventListener("click",()=>{$("fmtName").value="";$("fmtW").value=1080;$("fmtH").value=1080;$("fmtBase").value="feed";openDlg($("fmtDlg"));setTimeout(()=>$("fmtName").focus(),30);});
  const fclose=()=>closeDlg($("fmtDlg"));$("fmtX").addEventListener("click",fclose);$("fmtCancel").addEventListener("click",fclose);
  $("fmtSave").addEventListener("click",()=>{const w=Math.round(+$("fmtW").value),h=Math.round(+$("fmtH").value);
    if(!(w>=100&&w<=6000&&h>=100&&h<=6000)){toast("Use largura e altura entre 100 e 6000 px.");return;}
    const name=$("fmtName").value.trim()||("Personalizado "+w+" × "+h);
    state.customFormats.push({id:"c_"+uid(),name,w,h,base:$("fmtBase").value});fclose();formatsChanged();toast("Formato “"+name+"” criado.");});
  /* Banco */
  $("dbDocQ").addEventListener("input",renderDbDocs);$("dbAddDoc").addEventListener("click",()=>{if(needAdmin())openDocDlg(null);});
  $("dbLogoQ").addEventListener("input",renderDbLogos);
  document.querySelectorAll("#dbLogoF .tab").forEach(b=>b.addEventListener("click",()=>{dbLogoFilter=b.dataset.f;document.querySelectorAll("#dbLogoF .tab").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));renderDbLogos();}));
  $("dbAddLogo").addEventListener("click",()=>openUpload({group:"farma"}));
  $("dbSaveFoot").addEventListener("click",saveFooterToDb);
  $("shadowA").addEventListener("input",e=>{lookDraft={shadow:e.target.value/100};syncLookUI();colorsChanged();});
  $("colorsReset").addEventListener("click",()=>{colorDraft=JSON.parse(JSON.stringify(DEFAULT_COLORS));lookDraft={...DEFAULT_LOOK};renderColors();syncLookUI();colorsChanged();toast("Cores padrão carregadas como rascunho. Clique em “Publicar” para valer para todos.",4500);});
  $("pickX").addEventListener("click",()=>closeDlg($("pickDlg")));$("pickQ").addEventListener("input",()=>pickRender&&pickRender());
  document.querySelectorAll("#pickF .tab").forEach(b=>b.addEventListener("click",()=>{pickFilter=b.dataset.f;document.querySelectorAll("#pickF .tab").forEach(x=>x.setAttribute("aria-pressed",x===b?"true":"false"));pickRender&&pickRender();}));
  window.addEventListener("resize",()=>{if(state.tab==="news")sizeBoards();});
}
function applyStateToUI(){
  $("tagText").value=state.tagText;$("tagUpper").checked=state.tagUpper;$("eventTag").value=state.eventTag;$("ctaText").value=state.cta;$("zoom").value=state.zoom;
  $("docGap").value=Math.round(state.docGap*100);$("docGapO").textContent=Math.round(state.docGap*100)+"%";
  $("dotsK").value=Math.round(state.dotsK*100);$("dotsKO").textContent=Math.round(state.dotsK*100)+"%";
  setRtes();syncSideBg();syncLookUI();renderBrands();renderDocs();syncFtSettings();renderSwatches();
  buildFormats();buildBoards();renderFmtChips();
  footerDirty=true;renderFtTemplates();renderFtLib();renderInspector();showTab(state.tab||"content");save();
  syncDisc();renderCpFmt();syncFlow();
}
/* Disclaimer: campos ⇄ estado */
function syncDisc(){const D=state.disc;$("discText").value=D.text;$("ftDiscText").value=D.text;$("discSize").value=D.size;$("discSizeO").textContent=D.size+" px";$("discWeight").value=D.weight;
  $("discColor").value=D.color;$("discItalic").checked=!!D.italic;}
/* Controles do alinhamento automático (aparecem na aba Gerar notícia e
   em Conteúdo › Detalhes; os dois ficam sincronizados) e do tamanho do rodapé */
function syncFlow(){const F=state.flow;
  document.querySelectorAll('[data-flow="on"]').forEach(i=>i.checked=F.on);
  document.querySelectorAll('[data-flow="gap"]').forEach(i=>{i.value=Math.round(F.gap*100);i.disabled=!F.on;});
  document.querySelectorAll('[data-flow="shift"]').forEach(i=>{i.value=F.shift;i.disabled=!F.on;});
  document.querySelectorAll('[data-flowo="gap"]').forEach(o=>o.textContent=Math.round(F.gap*100)+"%");
  document.querySelectorAll('[data-flowo="shift"]').forEach(o=>o.textContent=(F.shift>0?"+":"")+F.shift+" px");
  $("footScale").value=Math.round((state.footScale||1)*100);$("footScaleO").textContent=Math.round((state.footScale||1)*100)+"%";
  $("headScale").value=Math.round((state.headScale||1)*100);$("headScaleO").textContent=Math.round((state.headScale||1)*100)+"%";
  $("shadeOn").checked=!!state.siteShade.on;$("shadeA").value=Math.round(state.siteShade.a*100);$("shadeAO").textContent=Math.round(state.siteShade.a*100)+"%";$("shadeA").disabled=!state.siteShade.on;}
function wireFlow(){
  const ch=()=>{syncFlow();scheduleAll();syncInspector();save();footerChanged(false,true);};
  document.querySelectorAll('[data-flow="on"]').forEach(i=>i.addEventListener("change",()=>{state.flow.on=i.checked;ch();}));
  document.querySelectorAll('[data-flow="gap"]').forEach(i=>i.addEventListener("input",()=>{state.flow.gap=i.value/100;ch();}));
  document.querySelectorAll('[data-flow="shift"]').forEach(i=>i.addEventListener("input",()=>{state.flow.shift=+i.value;ch();}));
  document.querySelectorAll('[data-flow="reset"]').forEach(b=>b.addEventListener("click",()=>{state.flow={...DEFAULT_FLOW};ch();}));
  $("footScale").addEventListener("input",e=>{state.footScale=e.target.value/100;ch();});
  $("headScale").addEventListener("input",e=>{state.headScale=e.target.value/100;ch();});
  $("shadeOn").addEventListener("change",e=>{state.siteShade.on=e.target.checked;ch();});
  $("shadeA").addEventListener("input",e=>{state.siteShade.a=e.target.value/100;ch();});
}
function wireDisc(){
  const ch=()=>{scheduleAll();save();footerChanged(false,true);};
  const discIn=e=>{state.disc.text=e.target.value;["discText","ftDiscText"].forEach(id=>{if($(id)!==e.target)$(id).value=state.disc.text;});ch();};
  $("discText").addEventListener("input",discIn);$("ftDiscText").addEventListener("input",discIn);
  $("discSize").addEventListener("input",e=>{state.disc.size=+e.target.value;$("discSizeO").textContent=e.target.value+" px";ch();});
  $("discWeight").addEventListener("change",e=>{state.disc.weight=e.target.value;ch();});
  $("discColor").addEventListener("change",e=>{state.disc.color=e.target.value;ch();});
  $("discItalic").addEventListener("change",e=>{state.disc.italic=e.target.checked;ch();});
  $("cpFmt").addEventListener("change",e=>{state.cpFmt=e.target.value;scheduleAll();save();});
  $("cpGo").addEventListener("click",()=>showTab("news"));
  $("idEditColors").addEventListener("click",()=>showTab("db"));
  window.addEventListener("resize",()=>{if(state.tab==="content")scheduleAll();});
}
async function restoreState(){
  try{
    const s=await IDB.get("state");
    if(s&&s.v>=1){
      const d=freshState();
      state={...d,...s,v:5,bg:{...d.bg,...s.bg},footer:{...d.footer,...s.footer,settings:{...FDEF,...(s.footer&&s.footer.settings)}},
        customFormats:s.customFormats||[],hiddenFormats:s.hiddenFormats||[],off:s.off||{},disc:{...DEFAULT_DISC,...(s.disc||{})},flow:{...DEFAULT_FLOW,...(s.flow||{})},footScale:s.footScale||1,headScale:s.headScale||1,siteShade:{on:false,a:.4,...(s.siteShade||{})}};
      delete state.colors;delete state.look;
      if(s.v<5)state.tab="content";   /* nova primeira aba */
      if(s.v<3)Object.values(state.off).forEach(a=>{if(a&&a.head)delete a.head.al;});
      return;
    }
  }catch(e){}
  /* Primeira vez neste site: aproveita o rodapé montado no Gerador de rodapé antigo */
  try{const old=JSON.parse(localStorage.getItem("rodape-logos-v1")||"null");
    if(old&&Array.isArray(old.sections)){state.footer.sections=old.sections;state.footer.settings={...FDEF,...old.settings};state.footer.active=old.active;}}catch(e){}
}
(async function init(){
  state=freshState();
  loadAdmin();loadLocalLogos();rebuildLib();buildFormats();
  wireStatic();wireFooterTab();wireUpload();wireDocDlg();wireLogoEd();wireExport();wireAdmin();wireDisc();wireCrop();wireFlow();
  await restoreState();
  applyStateToUI();renderAdminUI();
  fontsReady().then(()=>footerChanged(false,true));
  /* Chave salva? Confere em silêncio; depois lê o banco (do repositório
     com a chave, ou do site sem ela) */
  if(gh.token&&gh.repo){try{await verifyAdmin();}catch(e){gh.on=false;}renderAdminUI();}
  await loadData();
  /* Rodapé ainda sem “Realização” preenchida: usa o template da marca */
  const r=realizacao();if(!r.logos.length){r.logos=brandLogos(state.brand).map(ref=>({ref,scale:1}));footerChanged(true);}
})();
