// ---------- layout: a low-resolution 16-bit buffer (board = 176x224 px) scaled up with crisp nearest-neighbour pixels
const BW=176,BHP=224,HUDP=24,BARP=12;
let S=2,IW=180,IH=320,BX=2,BYp=24,HUDY=0,BARY=248,EXTRA=60,SI={t:0,r:0,b:0,l:0},SAFE={t:0,r:0,b:0,l:0},DPAD=null,TBTN=[],SIDE=0,TB=22,dpadOn=false;
function readSafe(){try{if(window.__SAFE){SAFE=Object.assign({t:0,r:0,b:0,l:0},window.__SAFE);return}const d=document.createElement('div');d.style.cssText='position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)';document.body.appendChild(d);const cs=getComputedStyle(d);SAFE={t:parseFloat(cs.paddingTop)||0,r:parseFloat(cs.paddingRight)||0,b:parseFloat(cs.paddingBottom)||0,l:parseFloat(cs.paddingLeft)||0};d.remove()}catch(e){}}
function onResize(){readSafe();const W=innerWidth,H=innerHeight,aw=Math.max(100,W-SAFE.l-SAFE.r),ah=Math.max(100,H-SAFE.t-SAFE.b);
 let s=Math.min(aw/BW,ah/(HUDP+BHP+BARP));const fs=Math.floor(s);if(fs>=1&&fs/s>=.8)s=fs;S=s;
 IW=Math.ceil(W/S);IH=Math.ceil(H/S);c.width=IW;c.height=IH;c.style.width=(IW*S)+'px';c.style.height=(IH*S)+'px';c.style.left=((W-IW*S)/2)+'px';c.style.top='0px';
 SI={t:SAFE.t/S,r:SAFE.r/S,b:SAFE.b/S,l:SAFE.l/S};TB=Math.ceil(46/S);
 const inner=IW-SI.l-SI.r;SIDE=(inner-BW)/2;BX=Math.round(SI.l+SIDE);HUDY=Math.round(SI.t);BYp=HUDY+HUDP;BARY=BYp+BHP;EXTRA=IH-Math.ceil(SI.b)-(BARY+BARP);
 // top buttons (pause / sound / help): at least 44 css px. In the right side panel when there is room, else in the HUD
 TBTN=[];const inSide=SIDE>=TB+6,x0=Math.floor(IW-SI.r-2-TB),y0=inSide?HUDY+2:HUDY+1;['pause','mute','help'].forEach((k,i)=>TBTN.push({k,x:x0-i*(TB+3),y:y0,w:TB,h:TB}));
 DPAD=null;if(dpadOn){const b0=TB;
  if(SIDE>=b0*3+10){const s=Math.min(SIDE-10,(IH-SI.t-SI.b)*.6,120),b=s/3,cx=BX+BW+SIDE/2,cy=IH-SI.b-s/2-8;DPAD={kind:'cross',cx,cy,s,b,btns:mkCross(cx,cy,s,b)}}
  else if(EXTRA>=b0*3+8){const s=Math.min(EXTRA-8,104),b=s/3,cx=BX+BW/2,cy=BARY+BARP+EXTRA/2;DPAD={kind:'cross',cx,cy,s,b,btns:mkCross(cx,cy,s,b)}}
  else if(EXTRA>=b0+4){const h=Math.min(EXTRA-6,34),gap=4,w=(BW-gap*3)/4,y=BARY+BARP+(EXTRA-h)/2;DPAD={kind:'row',btns:['left','up','down','right'].map((d,i)=>({d,x:BX+i*(w+gap),y,w,h}))}}}
 BG={}}
function mkCross(cx,cy,s,b){return[{d:'up',x:cx-b/2,y:cy-s/2,w:b,h:b},{d:'down',x:cx-b/2,y:cy+s/2-b,w:b,h:b},{d:'left',x:cx-s/2,y:cy-b/2,w:b,h:b},{d:'right',x:cx+s/2-b,y:cy-b/2,w:b,h:b}]}
addEventListener('resize',onResize);
const toI=(x,y)=>{const r=c.getBoundingClientRect();return[(x-r.left)/S,(y-r.top)/S]};
const X=lx=>BX+lx/2,Y=ly=>BYp+(ly-BY)/2,RX=lx=>Math.round(BX+lx/2),RY=ly=>Math.round(BYp+(ly-BY)/2);
const ov=(a,b,p=0)=>a.x<b.x+b.w+p&&b.x<a.x+a.w+p&&a.y<b.y+b.h+p&&b.y<a.y+a.h+p;
// ---------- weather palettes + cached backgrounds
let BG={};const NT=w=>w=='night'||w=='storm';
function tintCanvas(cv,w){if(w=='day')return cv;const x=cv.getContext('2d'),id=x.getImageData(0,0,cv.width,cv.height),d=id.data;
 for(let i=0;i<d.length;i+=4){let r=d[i],gg=d[i+1],b=d[i+2];if(w=='dusk'){r=r*1.0+20;gg=gg*.8+6;b=b*.74+16}else if(w=='rain'){const m=(r+gg+b)/3;r=(r*.55+m*.45)*.8;gg=(gg*.55+m*.45)*.82;b=(b*.55+m*.45)*.86+8}else{r=r*.3+4;gg=gg*.36+8;b=b*.58+24}
  d[i]=CL(r,0,255);d[i+1]=CL(gg,0,255);d[i+2]=CL(b,0,255)}x.putImageData(id,0,0);return cv}
function boardBG(w){const k='board'+w;if(BG[k])return BG[k];const cv=mkSpr(BW,BHP,P=>{
 // row 0: Market alley: red brick wall + den nooks
 P.rect(0,0,BW,16,'#8a3a2a');for(let j=0;j<4;j++)for(let x=-(j%2)*4;x<BW;x+=8){P.rect(x,j*4,7,3,'#a64a34');P.px(x,j*4,'#c8664a')}P.rect(0,13,BW,3,'#5a5e66');P.rect(0,13,BW,1,'#8a8f96');
 for(const dx of DENS){const x=Math.round(dx/2);P.el(x,7.5,10,7.5,'#3a1a14')}
 // row 6: Market arcade floor (checker tiles) with flower buckets at the ends
 const py=6*16;for(let y=0;y<16;y++)for(let x=0;x<BW;x++)P.px(x,py+y,((x>>2)+(y>>2))%2?'#d8cfc0':'#b8ad9a');P.rect(0,py,BW,2,'#4a2a1a');P.rect(0,py,BW,1,'#7a4a2a');
 for(const fx of [2,BW-12]){P.rect(fx,py+5,10,9,'#5a5e66');for(let i=0;i<5;i++)P.el(fx+2+i*1.6,py+5-(i%2),1.6,1.6,['#ff4a7a','#ffd23f','#b05ad8','#ff8a3a','#ffffff'][i])}
 // road rows 7..12: cobblestones
 const ry=7*16;P.rect(0,ry,BW,6*16,'#4a4648');for(let y=ry;y<ry+96;y+=4)for(let x=-((y>>2)%2)*3;x<BW;x+=6){P.rect(x,y,5,3,'#5a5658');P.px(x,y,'#6e6a6c');P.px(x+4,y+2,'#3a3638')}
 for(const r of [8,11,12])for(let x=2;x<BW;x+=14)P.rect(x,r*16,7,1,'#e8e8e8');
 P.rect(0,ry,BW,1,'#f0f0f0');P.rect(0,13*16-1,BW,1,'#f0f0f0');
 // crosswalk stripes on the bottom street (lanes 10-12)
 for(let y=10*16+1;y<13*16-1;y+=3)P.rect(80,y,16,2,'#d8d8d8');
 // row 9: fish-toss aisle (crushed ice counter)
 const ty=9*16;P.rect(0,ty,BW,16,'#cfe6f2');for(let y=ty;y<ty+16;y++)for(let x=(y*5)%3;x<BW;x+=3)if((x*7+y*11)%5==0)P.px(x,y,'#ffffff');else if((x*13+y*3)%7==0)P.px(x,y,'#a8c8da');P.rect(0,ty,BW,2,'#6a4a2a');P.rect(0,ty+14,BW,2,'#6a4a2a');
 // row 13: wooden boardwalk
 const sy=13*16;P.rect(0,sy,BW,16,'#9a6a3a');for(let y=sy;y<sy+16;y+=4){P.rect(0,y,BW,1,'#6a4220');}for(let x=0;x<BW;x+=22)for(let y=sy;y<sy+16;y+=4)P.px(x+((y>>2)%2)*11,y+2,'#4a2a10');P.rect(0,sy,BW,1,'#c89a62');
});return BG[k]=tintCanvas(cv,w)}
const WCOL={day:['#1a7a80','#22909a','#6cc8c8','#d0f4ee'],dusk:['#2d5a72','#3f6e86','#c27a6a','#ffd0a0'],rain:['#28505a','#33606a','#5f8a92','#a8ccd0'],night:['#0a2a38','#103a4c','#2a6a7a','#7ab6c6'],storm:['#082230','#0e3242','#245a6a','#6fa6b6']};
function waterTile(w){const k='wt'+w;if(BG[k])return BG[k];const C=WCOL[w];return BG[k]=[mkSpr(64,16,P=>{for(let i=0;i<9;i++){const x=(i*23)%64,y=1+(i*7)%13;P.rect(x,y,5,1,C[2]);P.px(x+1,y-1,C[2]);P.px(x+3,y-1,C[2])}}),mkSpr(64,16,P=>{for(let i=0;i<5;i++){const x=(i*29+7)%64,y=2+(i*5)%12;P.rect(x,y,2,1,C[3]);P.px(x+3,y,C[3])}})]}
function skyBands(w){return NT(w)?['#060c22','#0b1636','#13214a','#1c2d5e']:w=='dusk'?['#2e2260','#5a3a7a','#b45a78','#f08a5d','#ffc07a']:w=='rain'?['#3f4a55','#4f5c68','#626f7c','#7d8b96']:['#3c8ee0','#5aa6ec','#7dbcf4','#a8d6fb','#cdeaff']}
function skyCanvas(w,h){const k='sky'+w+h;if(BG[k])return BG[k];const b=skyBands(w),n=b.length;return BG[k]=mkSpr(4,h,P=>{for(let y=0;y<h;y++){const f=y/h*(n-1),i=Math.floor(f),fr=f-i;for(let x=0;x<4;x++){const dz=((x+y*2)%4)/4;P.px(x,y,b[Math.min(n-1,fr>dz+.0?i+1:i)])}}})}
function mountainTile(w){const k='mt'+w;if(BG[k])return BG[k];const base=NT(w)?'#1d2b4f':w=='dusk'?'#6d4c7f':w=='rain'?'#6d7a86':'#6a88a8',snow=NT(w)?'#4a5a80':w=='dusk'?'#f6c8c0':'#f4f8fb',sh=shade(base,-.22);
 // the Olympic Mountains: a long jagged range
 return BG[k]=mkSpr(220,46,P=>{for(let x=0;x<220;x++){const hgt=18+10*Math.sin(x*.05)+7*Math.sin(x*.13+1)+4*Math.abs(Math.sin(x*.31));const top=46-hgt;for(let y=Math.floor(top);y<46;y++){let col=(Math.sin(x*.13+1)<0)?sh:base;if(y<top+4&&hgt>26)col=snow;P.px(x,y,col)}}})}
function skylineTile(w){const k='sl'+w;if(BG[k])return BG[k];const nt=NT(w),bc=nt?'#0d1530':w=='dusk'?'#2c1f45':w=='rain'?'#3b464f':'#3a5a6e',hi=shade(bc,.18),win=nt||w=='dusk'?'#ffd86b':shade(bc,.35);
 return BG[k]=mkSpr(200,64,P=>{const bl=[[0,26,14],[15,34,12],[28,22,16],[45,42,12],[58,30,14],[96,36,12],[109,48,11],[121,26,14],[176,40,12],[189,24,11]];
  for(const [x,h,ww] of bl){P.rect(x,64-h,ww,h,bc);P.rect(x,64-h,1,h,hi);for(let y=64-h+3;y<62;y+=4)for(let xx=x+2;xx<x+ww-1;xx+=3)if(((xx*7+y*13)%5)<(nt?2:1))P.px(xx,y,win)}
  // Pike Place Market: low market hall with the famous red neon sign + clock
  P.rect(60,46,34,18,shade(bc,.08));P.rect(60,46,34,1,hi);P.rect(63,38,28,8,'#2a1a1a');P.t3('PUBLIC',64,39,nt||w=='dusk'?'#ff4a3a':'#e0303a');P.rect(74,31,6,6,'#f4f0e0');P.px(76,33,'#111111');P.px(77,34,'#111111');P.rect(76,37,2,1,'#2a1a1a');
  P.rect(60,56,34,1,'#e0303a');for(let x=62;x<92;x+=5)P.rect(x,58,3,4,win)})}
function wheel(cx,cy,r,t,col){g.fillStyle=col;for(let i=0;i<40;i++){const a=i/40*TAU;g.fillRect(Math.round(cx+Math.cos(a)*r),Math.round(cy+Math.sin(a)*r),1,1)}for(let k=0;k<8;k++){const a=k/8*TAU+t*.3;for(let q=2;q<r;q+=2)g.fillRect(Math.round(cx+Math.cos(a)*q),Math.round(cy+Math.sin(a)*q),1,1);g.fillRect(Math.round(cx+Math.cos(a)*r)-1,Math.round(cy+Math.sin(a)*r),3,2)}
 g.fillRect(Math.round(cx)-1,Math.round(cy)-1,3,3);for(let q=0;q<r+4;q+=1){g.fillRect(Math.round(cx-q*.45),Math.round(cy+q),1,1);g.fillRect(Math.round(cx+q*.45),Math.round(cy+q),1,1)}}
// full parallax Seattle scene (sky, Mt. Rainier, clouds, skyline + Space Needle, Puget Sound) — layers scroll at different speeds
function drawCity(x0,y0,w,h,wt,t,hz){g.save();g.beginPath();g.rect(x0,y0,w,h);g.clip();const sk=skyCanvas(wt,Math.max(8,Math.round(hz-y0)));g.drawImage(sk,0,0,4,sk.height,x0,y0,w,sk.height);
 if(NT(wt)){for(let i=0;i<40;i++){const sx=x0+(i*53+Math.floor(t*.5))%w,sy=y0+(i*29)%Math.max(4,hz-y0-30);if((i+Math.floor(t*2))%7)g.fillStyle='#ffffff',g.fillRect(sx,sy,1,1)}g.fillStyle='#f6f1d5';g.fillRect(x0+w-40,y0+6,7,7);g.fillRect(x0+w-41,y0+7,9,5);g.fillStyle=skyBands(wt)[0];g.fillRect(x0+w-37,y0+5,6,6)}
 else if(wt=='day'){g.fillStyle='#fff3b0';g.fillRect(x0+30,y0+8,9,9);g.fillRect(x0+29,y0+9,11,7);g.fillRect(x0+31,y0+7,7,11)}else if(wt=='dusk'){g.fillStyle='#ffb070';g.fillRect(x0+w*.7,hz-26,12,12);g.fillRect(x0+w*.7-1,hz-25,14,10)}
 const mt=mountainTile(wt),mo=((t*1.5)%220+220)%220;for(let x=x0-mo;x<x0+w;x+=220)g.drawImage(mt,Math.round(x),Math.round(hz-46));
 g.globalAlpha=NT(wt)?.25:wt=='rain'?.7:.92;for(let i=0;i<6;i++){const cl=SP.cloud[i%3],sp=3+i%3*2,cx=((i*97-t*sp)%(w+60)+w+60)%(w+60)-40;g.drawImage(cl,Math.round(x0+cx),Math.round(y0+4+(i*13)%Math.max(6,hz-y0-60)))}g.globalAlpha=1;
 const sl=skylineTile(wt),so=((t*5)%200+200)%200;for(let x=x0-so;x<x0+w;x+=200){wheel(x+152,hz-24,19,t,NT(wt)?(Math.floor(t*3)%2?'#ff6ad8':'#6ad8ff'):'#e8eef4');g.drawImage(sl,Math.round(x),Math.round(hz-64))}
 if(y0+h>hz){const C=WCOL[wt];g.fillStyle=C[0];g.fillRect(x0,hz,w,y0+h-hz);g.fillStyle=C[1];for(let y=hz;y<y0+h;y+=6)g.fillRect(x0,y,w,2);const wt0=waterTile(wt);const o1=((t*8)%64+64)%64,o2=((t*-16)%64+64)%64;
  for(let y=hz;y<y0+h;y+=16){for(let x=x0-o1;x<x0+w;x+=64)g.drawImage(wt0[0],Math.round(x),y);for(let x=x0-o2-32;x<x0+w;x+=64)g.drawImage(wt0[1],Math.round(x),y+4)}
  g.fillStyle=shade(C[3],-.1);g.fillRect(x0,hz,w,1)}
 g.restore()}
// ---------- world
function drawWater(w){const C=WCOL[w],wt=waterTile(w);for(let r=1;r<=5;r++){const y=BYp+r*16,l=lanes[r],d=l?l.dir:1;g.fillStyle=r%2?C[0]:C[1];g.fillRect(BX,y,BW,16);
 g.save();g.beginPath();g.rect(BX,y,BW,16);g.clip();const o1=((d*gt*5+r*13)%64+64)%64,o2=((d*gt*13+r*29)%64+64)%64;for(let x=BX-64+o1;x<BX+BW;x+=64)g.drawImage(wt[0],Math.round(x),y);for(let x=BX-64+o2;x<BX+BW;x+=64)g.drawImage(wt[1],Math.round(x),y);g.restore()}
 g.fillStyle=C[3];g.fillRect(BX,BYp+16,BW,1)}
function drawStatic(w){g.drawImage(boardBG(w),BX,BYp);drawWater(w);
 const sp=(lanes[10]&&lanes[10].light)?sigPhase():null;if(sp){for(const x of [BX+1,BX+BW-8]){const y=BYp+13*16+2;g.fillStyle=OL;g.fillRect(x,y,7,12);g.fillStyle='#222';g.fillRect(x+1,y+1,5,10);
  g.fillStyle=sp=='stop'?'#4a1010':sp=='amber'?'#ffb020':'#ff3030';g.fillRect(x+2,y+2,3,3);g.fillStyle=sp=='stop'?'#40ff70':'#0a3a1a';g.fillRect(x+2,y+7,3,3)}}
 for(const [x,r] of [[BX+1,6],[BX+BW-4,6],[BX+1,13],[BX+BW-4,13]]){const y=BYp+r*16+5;g.fillStyle='#2b2f33';g.fillRect(x,y,3,5);g.fillStyle=NT(w)||w=='dusk'?'#fff2a8':'#d6d6d6';g.fillRect(x+1,y+1,1,2)}}
function spr(cv,x,y){g.drawImage(cv,Math.round(x),Math.round(y))}
function drawHomes(t){for(let i=0;i<5;i++){const cx=X(DENS[i]);spr(SP.den[G&&G.homes[i]?1:0],cx-11,BYp-1)}
 if(G&&G.bug){const cx=X(DENS[G.bug.i]),y=BYp+3+Math.round(Math.sin(t*6));if(G.bug.t>1.2||Math.floor(t*8)%2)spr(SP.bug[Math.floor(t*12)%2],cx-6,y)}
 if(G&&G.crow){const cw=G.crow,cx=X(DENS[cw.i]);let y=BYp+2,a=1;if(cw.ph=='land'){y-=cw.t*20;a=1-cw.t*.4}if(cw.ph=='leave')y-=(0.6-cw.t)*30;g.globalAlpha=CL(a,0,1);spr(SP.crow[cw.ph=='sit'?1:Math.floor(t*14)%2],cx-9,y);g.globalAlpha=1}}
function drawJim(cx,cy,dir,o={}){const hop=o.hop||0,h=Math.round(Math.sin(PI*hop)*4),t=o.t||0;const leg=hop?(Math.sin(hop*TAU)>0?1:-1):0,tail=o.idle?Math.round(Math.sin(t*5)):(hop?-leg:0);
 const k=o.land>0?[0,0,o.carry?1:0,1]:[leg,tail,o.carry?1:0,0];const cv=SP.jim[k]||SP.jim[[0,0,0,0]];
 if(!o.noShadow){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(Math.round(cx)-6,Math.round(cy)+3,12,4);g.fillRect(Math.round(cx)-7,Math.round(cy)+4,14,2)}
 g.save();if(o.alpha!=null)g.globalAlpha=CL(o.alpha,0,1);g.translate(Math.round(cx),Math.round(cy)-h);g.rotate(({up:0,right:PI/2,down:PI,left:-PI/2}[dir]||0)+(o.spin||0));if(o.sc&&o.sc!=1)g.scale(o.sc,o.sc);g.drawImage(cv,-10,-10);g.restore()}
function pxRing(cx,cy,rx,ry,col){g.fillStyle=col;const n=Math.max(12,Math.round((rx+ry)*2));for(let i=0;i<n;i++){const a=i/n*TAU;g.fillRect(Math.round(cx+Math.cos(a)*rx),Math.round(cy+Math.sin(a)*ry),1,1)}}
function drawPickup(p,t){const bl=p.life-p.t<2&&Math.floor(p.t*8)%2;if(bl)return;const cx=X(p.x),cy=Y(BY+p.row*T+T/2)+Math.round(Math.sin(t*5+p.x)*1);const cv=SP[p.type];
 g.fillStyle='rgba(0,0,0,.28)';g.fillRect(Math.round(cx)-4,Math.round(cy)+4,8,2);if(p.type=='gold'){const k=Math.floor(t*8)%4;pxRing(cx,cy,7+(k%2),7+(k%2),'#fff6a0');g.fillStyle='#ffffff';g.fillRect(Math.round(cx)-5+k*3,Math.round(cy)-7,1,1)}spr(cv,cx-cv.width/2,cy-cv.height/2)}
function drawWorld(){const w=G&&state!='title'?G.w:'day',t=gt;drawStatic(w);drawHomes(t);
 for(let r=1;r<=5;r++){const l=lanes[r];if(!l)continue;const y=BYp+r*16;for(const o of l.objs){const x=objX(l,o);if(x>LW||x+o.w<0)continue;const ty=o.type,px=X(x),m=l.dir<0?1:0;
  if(ty.startsWith('raft'))spr(SP.raft[ty],px-1,y+1);else if(ty=='duck')spr(SP.veh['duck'+m],px-1,y);else if(ty=='orca')spr(SP.veh['seal'+(Math.sin(t*3)>.6?1:0)+m],px-1,y+1);
  else if(ty=='kayak2'){const st=sinkState(o);let dy=0,a=1;if(st=='warn')dy=Math.floor(t*16)%2?1:-1;if(st=='down')a=.25;if(st=='rise')a=.55;g.globalAlpha=a;spr(SP.veh['kayak'+m],px-1,y+2+dy);g.globalAlpha=1;if(st!='up')pxRing(px+o.w/4,y+8,o.w/4+2,7,st=='warn'?'#ffffff':'rgba(255,255,255,.5)')}
  else{const st=sinkState(o),n=Math.round(o.w/T);let dy=0,a=1;if(st=='warn')dy=Math.floor(t*16)%2?1:-1;if(st=='down')a=.25;if(st=='rise')a=.55;g.globalAlpha=a;for(let i=0;i<n;i++)spr(SP.ring,px+i*16,y+1+dy);g.globalAlpha=1;
   if(st!='up')pxRing(px+o.w/4,y+8,o.w/4+2,7,st=='warn'?'#ffffff':'rgba(255,255,255,.5)');if(st=='down'){g.fillStyle='#ffffff';for(let i=0;i<3;i++)g.fillRect(Math.round(px+4+((t*10+i*7)%(o.w/2-6))),Math.round(y+8+Math.sin(t*5+i)*3),1,1)}}}}
 if(G&&G.kit&&state=='play'){const k=G.kit,cx=X(k.x),cy=Y(BY+k.row*T+T/2);spr(SP.kit,cx-6,cy-6);if(Math.floor(t*6)%2)pxRing(cx,cy,7,7,'#ffb3d9')}
 if(state=='play')for(const p of pickups)drawPickup(p,t);
 for(const r of [7,8,10,11,12]){const l=lanes[r];if(!l)continue;const y=BYp+r*16;for(const o of l.objs){const x=objX(l,o);if(x>LW+2||x+o.w<-2)continue;const m=l.dir<0?1:0,ty=o.type;
  const cv=SP.veh[ty+m]||carSpr(o,m);spr(cv,X(x)-1,y+(16-cv.height)/2+.5)}}
 if(rail){const y=BYp+9*16,m=rail.dir<0?1:0;if(rail.phase=='warn'||rail.phase=='go'){const mx=rail.dir>0?BX+1:BX+BW-15;spr(SP.monger[Math.floor(gt*6)%2],mx,y-2);if(rail.phase=='warn'&&Math.floor(gt*5)%2)txt('FISH!',rail.dir>0?mx+28:mx-14,y-6,'#ffffff',{ol:OL,sh:null,reg:false})}
  if(rail.phase=='go'){const n=Math.max(1,Math.round(rail.len/(T*1.6)));for(let i=0;i<n;i++){const fx=X(rail.x+i*T*1.6),fy=y+3+Math.round(Math.sin(gt*20+i)*1);g.fillStyle='rgba(255,255,255,.7)';g.fillRect(Math.round(rail.dir>0?fx-8:fx+26),fy+3,6,1);g.fillRect(Math.round(rail.dir>0?fx-5:fx+26),fy+6,4,1);spr(SP.veh['salmon'+m],fx,fy)}}}
 if(G&&G.gull&&state!='title'){const s=G.gull;g.save();const cx=Math.round(X(s.x)),cy=Math.round(Y(BY+6*T+T/2));g.translate(cx,cy);if(s.dir<0)g.scale(-1,1);g.drawImage(SP.gull[s.wait>0?0:Math.floor(t*8)%2],-9,-7);g.restore()}
 if(state!='title'&&G&&J.visible){const cx=X(J.x),cy=Y(BY+J.rowF*T+T/2);if(J.dead){const k=J.dT,wet=J.dtype=='splash'||J.dtype=='swept'||J.dtype=='orca';
   if(wet){if(k<.45)drawJim(cx,cy,J.dir,{t,alpha:1-k*2,noShadow:1,sc:k<.15?1:k<.3?.75:.5})}
   else if(J.dtype=='time'){drawJim(cx,cy,J.dir,{t,alpha:k<1?1:2-k});txt('z',cx+6,cy-7-k*4,'#ffffff',{reg:false});txt('Z',cx+10,cy-12-k*5,'#ffffff',{reg:false})}
   else{drawJim(cx,cy,J.dir,{t,spin:Math.floor(k*10)*PI/2*(k<1?1:0),alpha:k<1.1?1:1-(k-1.1)*3});for(let i=0;i<4;i++){const a=gt*6+i*TAU/4;g.fillStyle='#ffe14d';const sx=Math.round(cx+Math.cos(a)*8),sy=Math.round(cy-7+Math.sin(a)*2);g.fillRect(sx-1,sy,3,1);g.fillRect(sx,sy-1,1,3)}}}
  else drawJim(cx,cy,J.dir,{hop:J.hopping?Math.min(1,J.hopT):0,t,idle:!J.hopping,land:J.land,carry:J.carry})}
 for(const p of parts){const a=1-p.t/p.life;if(p.ring){pxRing(X(p.x),Y(p.y),3+p.t*16,1.5+p.t*7,`rgba(255,255,255,${a})`)}else{g.globalAlpha=a;g.fillStyle=p.col;const s=p.sz>2.5?2:1;g.fillRect(Math.round(X(p.x)),Math.round(Y(p.y)),s,s);g.globalAlpha=1}}
 drawWeather(w)}
const dk=document.createElement('canvas'),dg=dk.getContext('2d');
function drawWeather(w){const wet=w=='rain'||w=='storm';
 if(w=='dusk'){g.fillStyle='rgba(255,110,60,.13)';g.fillRect(BX,BYp,BW,BHP)}
 if(NT(w))darkness(w=='storm'?.62:.56);
 if(wet){g.fillStyle='rgba(60,80,100,.12)';g.fillRect(BX,BYp,BW,BHP);g.fillStyle='rgba(200,220,255,.6)';for(const d of drops){const x=Math.round(X(d.x)),y=Math.round(Y(d.y));if(y<BYp-2||y>BYp+BHP)continue;g.fillRect(x,y,1,2);g.fillRect(x-1,y+2,1,2)}
  g.fillStyle='rgba(220,235,255,.45)';for(let i=0;i<6;i++){const k=(gt*1.7+i*.37)%1,n=Math.floor(gt*1.7+i*.37),x=BX+(i*97+n*53)%BW,y=BYp+((i*71+n*31)%BHP);pxRing(x,y,1+k*4,.5+k*2,'rgba(220,235,255,.5)')}}
 if(w=='storm'&&G){if(!G.flashT||gt>G.flashT){G.flashT=gt+rnd(6,12);G.flashS=gt;if(state=='play'&&!paused)noise(1.2,.25,180,.6,'lowpass',.3)}const fa=1-(gt-G.flashS)/.45;if(fa>0){g.fillStyle=`rgba(230,240,255,${(fa>.5?.5:.25)})`;g.fillRect(0,0,IW,IH)}}}
// night: dark overlay with stepped (16-bit style) pools of light
function darkness(a){if(dk.width!=IW||dk.height!=IH){dk.width=IW;dk.height=IH}dg.setTransform(1,0,0,1,0,0);dg.globalCompositeOperation='source-over';dg.clearRect(0,0,IW,IH);dg.fillStyle=`rgba(3,8,26,${a})`;dg.fillRect(BX,BYp,BW,BHP);dg.globalCompositeOperation='destination-out';
 const L=(x,y,r,s=1)=>{for(const [f,al] of [[1,.3],[.72,.35],[.45,.35]]){dg.fillStyle=`rgba(0,0,0,${al*s})`;dg.beginPath();dg.arc(Math.round(x),Math.round(y),Math.round(r*f),0,TAU);dg.fill()}};
 if(state!='title'&&J.visible)L(X(J.x),Y(BY+J.rowF*T+T/2),32,1);
 for(const [x,r] of [[BX+2,6],[BX+BW-2,6],[BX+2,13],[BX+BW-2,13],[BX+BW/2,13],[BX+BW/2,6]])L(x,BYp+r*16+8,23,.75);
 for(const x of DENS)L(X(x),BYp+8,10,.7);
 for(const r of [7,8,10,11,12]){const l=lanes[r];if(!l)continue;const y=BYp+r*16+8;for(const o of l.objs){const x=objX(l,o);if(x>LW+60||x+o.w<-60)continue;const fx=X(l.dir>0?x+o.w:x);L(fx+l.dir*12,y,16,.95);L(X(x+o.w/2),y,o.w/4,.4)}}
 if(rail&&rail.phase=='go'){const fx=X(rail.dir>0?rail.x+rail.len:rail.x);L(fx+rail.dir*14,BYp+9*16+8,26,.95);L(X(rail.x+rail.len/2),BYp+9*16+8,rail.len/4,.45)}
 if(rail&&rail.phase=='warn'&&Math.floor(gt*4)%2){L(BX+3,BYp+9*16+8,12,.95);L(BX+BW-3,BYp+9*16+8,12,.95)}
 for(let r=1;r<=5;r++){const l=lanes[r];if(!l)continue;for(const o of l.objs)if(o.type=='duck'){const x=objX(l,o);L(X(x+o.w/2),BYp+r*16+8,o.w*.3,.65)}}
 for(const p of pickups)if(p.type=='gold')L(X(p.x),Y(BY+p.row*T+T/2),13,.85);
 g.drawImage(dk,0,0)}
// ---------- HUD (parallax skyline strip behind the score), bottom bar, buttons, D-pad
function panel(x,y,w,h,col){g.fillStyle=OL;g.fillRect(x,y,w,h);g.fillStyle='#e8ecf4';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle=col||'#203c8c';g.fillRect(x+2,y+2,w-4,h-4);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x+2,y+2,w-4,Math.max(1,Math.floor((h-4)/2)))}
function hudRight(){let r=BX+BW-2;for(const b of TBTN)if(b.y<BYp&&b.x<BX+BW)r=Math.min(r,b.x-3);return r}
function drawHUD(){const w=G?G.w:'day';drawCity(0,0,IW,BYp,w,gt,BYp+6);g.fillStyle='rgba(6,10,30,.35)';g.fillRect(0,0,IW,BYp);g.fillStyle=OL;g.fillRect(0,BYp-1,IW,1);
 const best=Math.max(ST.get('best',0),G.score),right=hudRight(),sv=String(G.score).padStart(6,'0'),hv=String(best).padStart(6,'0');const x0=BX+3;
 txt('SCORE',x0,HUDY+6,'#ffd23f',{al:'left',ol:OL,sh:null});txt(sv,x0,HUDY+16,'#ffffff',{al:'left',ol:OL,sh:null});const hx=x0+44;if(hx+40<=right){txt('HI',hx,HUDY+6,'#ff9f9f',{al:'left',ol:OL,sh:null});txt(hv,hx,HUDY+16,'#ffffff',{al:'left',ol:OL,sh:null})}}
const HEAD=mkSpr(9,8,P=>{P.px(1,0,FUR.dk);P.px(7,0,FUR.dk);P.el(4.5,4,4,3.4,FUR.lt,FUR.pl);P.rect(1,3,7,2,FUR.mk);P.px(2,3,FUR.wh);P.px(6,3,FUR.wh);P.px(4,6,'#111111')},{});
function drawBar(){const y=BARY;g.fillStyle=OL;g.fillRect(0,y,IW,BARP);g.fillStyle='#16224a';g.fillRect(0,y+1,IW,BARP-2);g.fillStyle='#2c3f7a';g.fillRect(0,y+1,IW,1);
 const n=Math.min(G.lives,5);let x=BX+2;for(let i=0;i<n;i++){spr(HEAD,x,y+2);x+=10}if(G.lives>5){txt('x'+G.lives,x,y+6,'#ffffff',{al:'left'});x+=16}
 x+=3;const lv='LV'+G.L;txt(lv,x,y+6,'#ffd23f',{al:'left'});x+=txtW(lv)+4;wIcon(G.w,x,y+2);x+=10;
 const bx=x,bw=BX+BW-2-bx,f=CL(G.time/TIME_MAX,0,1),segs=Math.max(4,Math.floor(bw/4));g.fillStyle=OL;g.fillRect(bx,y+3,bw,6);const col=f>.5?'#3ddc84':f>.22?'#ffd23f':(Math.floor(gt*6)%2?'#ff4d4d':'#ff9a9a');
 for(let i=0;i<segs;i++){const sx=bx+1+i*((bw-2)/segs);g.fillStyle=i<f*segs?col:'#2a3d52';g.fillRect(Math.round(sx),y+4,Math.max(1,Math.round((bw-2)/segs)-1),4);if(i<f*segs){g.fillStyle='rgba(255,255,255,.35)';g.fillRect(Math.round(sx),y+4,Math.max(1,Math.round((bw-2)/segs)-1),1)}}
 UI.push({x:bx,y:y+3,w:bw,h:6,k:'bar',s:'time'})}
function wIcon(w,x,y){const f=(c,a,b,ww,hh)=>{g.fillStyle=c;g.fillRect(x+a,y+b,ww,hh)};if(w=='day'){f('#ffd23f',1,1,6,6);f('#ffd23f',0,2,8,4);f('#ffd23f',2,0,4,8)}else if(w=='dusk'){f('#ff8c42',1,2,6,4);f('#ff8c42',2,1,4,1)}else if(w=='rain'){f('#cfd8e0',0,1,8,3);f('#7fc4ff',1,5,1,2);f('#7fc4ff',4,5,1,2);f('#7fc4ff',6,6,1,2)}else{f('#f6f1d5',1,0,5,8);f('#16224a',3,0,4,6);if(w=='storm')f('#ffd23f',5,4,2,4)}}
function icon(k,cx,cy){const p=(a,b,w,h)=>g.fillRect(cx+a,cy+b,w,h);g.fillStyle='#ffffff';
 if(k=='pause'){if(paused){for(let i=0;i<4;i++)p(-2+i,-3+i,1,7-2*i)}else{p(-4,-4,3,9);p(1,-4,3,9)}}
 else if(k=='mute'){p(-5,-2,3,5);p(-2,-3,1,7);p(-1,-4,1,9);if(muted){for(let i=0;i<5;i++){p(1+i,-2+i,1,1);p(5-i,-2+i,1,1)}}else{p(2,-1,1,3);p(4,-3,1,7)}}
 else{p(-2,-5,5,1);p(-3,-4,2,2);p(2,-4,2,3);p(0,-1,2,2);p(0,1,2,1);p(0,3,2,2)}}
function drawTB(){for(const b of TBTN){if(b.k=='pause'&&state!='play')continue;const col=b.k=='pause'?'#6a4fc8':b.k=='mute'?'#2f6fd0':'#2f9e5b';g.fillStyle=OL;g.fillRect(b.x,b.y+1,b.w,b.h-1);g.fillRect(b.x+1,b.y,b.w-2,b.h);g.fillStyle=col;g.fillRect(b.x+1,b.y+1,b.w-2,b.h-2);g.fillStyle=shade(col,.35);g.fillRect(b.x+2,b.y+1,b.w-4,2);g.fillStyle=shade(col,-.35);g.fillRect(b.x+2,b.y+b.h-3,b.w-4,2);
 icon(b.k,Math.round(b.x+b.w/2),Math.round(b.y+b.h/2));UI.push({x:b.x,y:b.y,w:b.w,h:b.h,k:'btn',s:'tb-'+b.k})}}
function arrow(d,cx,cy,s,col){g.fillStyle=col;for(let i=0;i<s;i++){const l=i*2+1;if(d=='up')g.fillRect(cx-i,cy-s/2+i,l,1);else if(d=='down')g.fillRect(cx-i,cy+s/2-i,l,1);else if(d=='left')g.fillRect(cx-s/2+i,cy-i,1,l);else g.fillRect(cx+s/2-i,cy-i,1,l)}}
function drawControls(){if(!DPAD){if(EXTRA>=12){const s='SWIPE TO HOP  TAP = HOP UP';txt(s,BX+BW/2,BARY+BARP+Math.min(EXTRA,30)/2,'#ffffff',{sh:'#000000'})}return}
 if(DPAD.kind=='cross'){const d=DPAD,b=d.b;g.fillStyle='rgba(10,14,30,.55)';g.beginPath();g.arc(Math.round(d.cx),Math.round(d.cy),Math.round(d.s/2+3),0,TAU);g.fill()}
 for(const b of DPAD.btns){const on=holdDir==b.d&&dpadPtr!=null,x=Math.round(b.x),y=Math.round(b.y),w=Math.round(b.w),h=Math.round(b.h);g.fillStyle=OL;g.fillRect(x,y,w,h);g.fillStyle=on?'#ffd23f':'#4a4e5e';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle=on?'#fff0a0':'#6d7284';g.fillRect(x+1,y+1,w-2,2);g.fillStyle=on?'#c09a20':'#33364a';g.fillRect(x+1,y+h-3,w-2,2);
  arrow(b.d,x+Math.floor(w/2),y+Math.floor(h/2),Math.max(4,Math.floor(Math.min(w,h)*.22)),on?'#3a2a00':'#ffffff');UI.push({x,y,w,h,k:'btn',s:'dpad-'+b.d})}
 if(DPAD.kind=='cross'&&SIDE<DPAD.b*3+10){const room=(BW-DPAD.s)/2-8;if(room>=52){const lx=BX+(BW-DPAD.s)/4,rx=BX+BW-(BW-DPAD.s)/4;txt('SWIPE',lx,DPAD.cy-5,'#d8e4ff',{sh:'#000000'});txt('ANYWHERE',lx,DPAD.cy+5,'#d8e4ff',{sh:'#000000'});txt('TAP =',rx,DPAD.cy-5,'#d8e4ff',{sh:'#000000'});txt('HOP UP',rx,DPAD.cy+5,'#d8e4ff',{sh:'#000000'})}}
 if(SIDE>=60){const lx=SI.l+SIDE/2;txt('SWIPE OR',lx,IH/2-6,'#d8e4ff',{sh:'#000000'});txt('TAP TO HOP',lx,IH/2+5,'#d8e4ff',{sh:'#000000'})}}
// ---------- popups: every label gets a free spot (never overlaps the HUD, buttons or other popups)
function popRect(p){const banner=p.kind=='banner',sc=banner?(txtW(p.text,2)<=BW-24?2:1):1;let w=txtW(p.text,sc);if(banner&&p.sub)w=Math.max(w,txtW(p.sub));let lines=null;if(p.kind!='banner'&&w>BW-16){lines=wrapTxt(p.text,BW-16);w=Math.max(...lines.map(l=>txtW(l)))}w=Math.min(BW-4,w+(p.kind=='float'?4:banner?20:12));const h=banner?(7*sc+(p.sub?11:0)+12):(p.kind=='msg'?(lines?15:13):10)+(lines?(lines.length-1)*9:0);return{w,h,sc,lines}}
function placePops(forbid){const area={x:BX+1,y:BYp+1,w:BW-2,h:BHP-2},placed=[];const list=pops.slice().sort((a,b)=>b.pri-a.pri||a.born-b.born);
 for(const p of list){const {w,h,sc,lines}=popRect(p);p.rw=w;p.rh=h;p.sc=sc;p.lines=lines;const age=gt-p.born,px=X(p.x),py=Y(p.y);let x=CL(px-w/2,area.x,area.x+area.w-w);let y0=p.kind=='banner'?py-h/2:py-h/2-(p.kind=='float'?age*12:Math.min(age*20,5));y0=CL(y0,area.y,area.y+area.h-h);
  const obs=forbid.concat(placed);let y=null;const xs=[x,area.x,area.x+area.w-w,BX+BW/2-w/2];for(const xx of xs){y=freeY(xx,y0,w,h,obs,area);if(y!=null){x=xx;break}}
  p.vis=y!=null;if(p.vis){p.rx=Math.round(x);p.ry=Math.round(y);placed.push({x:p.rx,y:p.ry,w,h})}}}
function freeY(x,y0,w,h,obs,area){for(let d=0;d<=area.h;d+=1){for(const s of d?[-1,1]:[1]){const y=y0+s*d;if(y<area.y||y+h>area.y+area.h)continue;const r={x,y,w,h};if(!obs.some(o=>ov(r,o,1)))return y}}return null}
function drawPops(){const forbid=UI.filter(u=>u.k!='bg');if(state=='play'&&J.visible&&!J.dead)forbid.push({x:X(J.x)-9,y:Y(BY+J.rowF*T+T/2)-11,w:18,h:20,k:'jim'});placePops(forbid);
 for(const p of pops){if(!p.vis)continue;const age=gt-p.born,a=Math.min(1,(p.life-age)/.35),x=p.rx,y=p.ry,w=p.rw,h=p.rh;g.globalAlpha=CL(a,0,1);
  if(p.kind=='banner'){panel(x,y,w,h,'#203c8c');txt(p.text,x+w/2,y+6+3.5*p.sc,p.col,{sc:p.sc,ol:OL,sh:null,reg:false});if(p.sub)txt(p.sub,x+w/2,y+h-8,'#ffffff',{reg:false})}
  else if(p.kind=='msg'){g.fillStyle=OL;g.fillRect(x,y,w,h);g.fillStyle='#0e1a36';g.fillRect(x+1,y+1,w-2,h-2);g.fillStyle=p.col;g.fillRect(x+1,y+1,w-2,1);g.fillRect(x+1,y+h-2,w-2,1);if(p.lines)p.lines.forEach((l,i)=>txt(l,x+w/2,y+8+i*9,p.col,{reg:false,sh:null}));else txt(p.text,x+w/2,y+h/2,p.col,{reg:false,sh:null})}
  else if(p.lines)p.lines.forEach((l,i)=>txt(l,x+w/2,y+5+i*9,p.col,{ol:OL,sh:null,reg:false}));else txt(p.text,x+w/2,y+h/2,p.col,{ol:OL,sh:null,reg:false});
  g.globalAlpha=1;UI.push({x,y,w,h,k:'pop',s:p.text})}}
