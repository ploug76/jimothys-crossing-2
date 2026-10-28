'use strict';
const GAME_ID='jimothys-crossing-2';
const c=document.getElementById('c'),$=id=>document.getElementById(id),R=Math.random,TAU=Math.PI*2,PI=Math.PI;
let g=c.getContext('2d');
const CL=(v,a,b)=>v<a?a:v>b?b:v,LERP=(a,b,k)=>a+(b-a)*k,PICK=a=>a[Math.floor(R()*a.length)],rnd=(a,b)=>a+R()*(b-a);
// ---------- board geometry (logical units; 1 logical unit = half a screen pixel of the 16-bit buffer)
const T=32,COLS=11,ROWS=14,LW=COLS*T,BH=ROWS*T,HUDH=48,BARH=30,HOP=0.118,TIME_MAX=34;
const DENS=[1,3,5,7,9].map(cl=>cl*T+T/2);
const colX=cl=>cl*T+T/2,nearCol=x=>CL(Math.round((x-T/2)/T),0,COLS-1);
function laneKind(r){return r==0?'home':r<=5?'water':r==6?'safe':r==9?'rail':r<=12?'road':'start'}
const isLand=r=>{const k=laneKind(r);return k=='safe'||k=='road'||k=='rail'||k=='start'};
const BY=HUDH; // logical y of the board top (game code positions pops with it)
// ---------- storage
const ST={get(k,d){try{const v=localStorage.getItem(GAME_ID+':'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(GAME_ID+':'+k,JSON.stringify(v))}catch(e){}}};
// ---------- 16-bit pixel painter: sprites are built pixel by pixel into small canvases, then drawn with nearest-neighbour scaling
const HEXC={};function HX(c){let v=HEXC[c];if(v)return v;const s=c.replace('#','');v=[parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16),s.length>6?parseInt(s.slice(6,8),16):255];return HEXC[c]=v}
function mkSpr(w,h,fn,o={}){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');const id=x.createImageData(w,h),d=id.data,M=o.mir;
 const P={w,h,
  px(X,Y,col){X=Math.floor(X);Y=Math.floor(Y);if(M)X=w-1-X;if(X<0||Y<0||X>=w||Y>=h||!col)return;const i=(Y*w+X)*4,v=HX(col);d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=v[3]},
  a(X,Y){X=Math.floor(X);Y=Math.floor(Y);if(X<0||Y<0||X>=w||Y>=h)return 0;return d[(Y*w+X)*4+3]},
  rect(X,Y,W,H,col){for(let j=0;j<H;j++)for(let i=0;i<W;i++)P.px(X+i,Y+j,col)},
  el(cx,cy,rx,ry,col,hi,lo){for(let y=Math.floor(cy-ry-1);y<=cy+ry+1;y++)for(let x=Math.floor(cx-rx-1);x<=cx+rx+1;x++){const dx=(x+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1){let cc=col;if(hi||lo){const k=dx*.7+dy*.7;if(hi&&k<-.42)cc=hi;else if(lo&&k>.5)cc=lo}P.px(x,y,cc)}}},
  line(x0,y0,x1,y1,col){x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;for(;;){P.px(x0,y0,col);if(x0==x1&&y0==y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}},
  dith(X,Y,W,H,col,ph=0){for(let j=0;j<H;j++)for(let i=0;i<W;i++)if((i+j+ph)%2==0)P.px(X+i,Y+j,col)},
  // tiny 3x5 text, always reads left-to-right even on mirrored sprites
  t3(s,X,Y,col){const tw=s.length*4-1;let x0=M?(w-X-tw):X;for(const ch of s){const gl=F3[ch]||F3[' '];for(let r=0;r<5;r++)for(let k=0;k<3;k++)if(gl[r]>>(2-k)&1){const xx=x0+k,yy=Y+r;if(xx>=0&&yy>=0&&xx<w&&yy<h){const i=(yy*w+xx)*4,v=HX(col);d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}}x0+=4}},
  outline(col){const A=new Uint8Array(w*h);for(let i=0;i<w*h;i++)A[i]=d[i*4+3]>0;const v=HX(col);for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(A[y*w+x])continue;if((x>0&&A[y*w+x-1])||(x<w-1&&A[y*w+x+1])||(y>0&&A[(y-1)*w+x])||(y<h-1&&A[(y+1)*w+x])){const i=(y*w+x)*4;d[i]=v[0];d[i+1]=v[1];d[i+2]=v[2];d[i+3]=255}}}};
 fn(P);if(o.ol)P.outline(o.ol);x.putImageData(id,0,0);return cv}
// ---------- pixel font (5x7) with cached, outlined strings
const TXC=new Map();
function txtCanvas(s,col,sc,ol,sh){const k=s+'|'+col+'|'+sc+'|'+ol+'|'+sh;let cv=TXC.get(k);if(cv)return cv;s=String(s);const up=s.replace(/[a-wyz]/g,m=>m.toUpperCase());
 const pad=(ol?1:0),w=up.length*6-1+pad*2+(sh?1:0),h=7+pad*2+(sh?1:0);
 cv=mkSpr(w,h,P=>{const draw=(ox,oy,cc)=>{let x=ox;for(const ch of up){const gl=F5[ch]||F5['?'];for(let r=0;r<7;r++)for(let q=0;q<5;q++)if(gl[r]>>(4-q)&1)P.px(x+q,oy+r,cc);x+=6}};
  if(sh)draw(pad+1,pad+1,sh);if(ol){for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]])draw(pad+dx,pad+dy,ol)}draw(pad,pad,col)});
 if(sc>1){const b=document.createElement('canvas');b.width=w*sc;b.height=h*sc;const bx=b.getContext('2d');bx.imageSmoothingEnabled=false;bx.drawImage(cv,0,0,w*sc,h*sc);cv=b}
 if(TXC.size>600)TXC.clear();TXC.set(k,cv);return cv}
const txtW=(s,sc=1)=>(String(s).length*6-1)*sc;
// UI registry (for the overlap tests): every text/button rectangle in buffer pixels
let UI=[],lastUI=[],menuBtns=[];
function txt(s,x,y,col,o={}){const sc=o.sc||1,cv=txtCanvas(s,col,sc,o.ol||null,o.sh===undefined?'#000000':o.sh);const al=o.al||'center';const w=cv.width,h=cv.height;const lx=Math.round(al=='center'?x-w/2:al=='right'?x-w:x),ly=Math.round(y-h/2);
 g.drawImage(cv,lx,ly);if(o.reg!==false)UI.push({x:lx,y:ly,w,h,k:'text',s:String(s)});return w}
function fitSc(s,sc,maxW){while(sc>1&&txtW(s,sc)>maxW)sc--;return sc}
// ---------- audio: 16-bit style synth (pulse waves with duty cycles, triangle bass, noise drums, SNES-style echo)
let ac=null,master=null,musicGain=null,sfxGain=null,echoIn=null,muted=ST.get('mute',false);const WV={};
function pw(d){if(WV[d])return WV[d];const n=48,re=new Float32Array(n),im=new Float32Array(n);for(let k=1;k<n;k++){re[k]=2/(k*PI)*Math.sin(k*PI*d)}return WV[d]=ac.createPeriodicWave(re,im)}
function A(){try{if(!ac){ac=new(window.AudioContext||webkitAudioContext)();master=ac.createGain();master.gain.value=muted?0:1;
  const comp=ac.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;master.connect(comp);comp.connect(ac.destination);
  echoIn=ac.createGain();echoIn.gain.value=1;const dl=ac.createDelay(1);dl.delayTime.value=.21;const fb=ac.createGain();fb.gain.value=.34;const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;const eo=ac.createGain();eo.gain.value=.5;
  echoIn.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(eo);eo.connect(master);
  sfxGain=ac.createGain();sfxGain.gain.value=.5;sfxGain.connect(master);const se=ac.createGain();se.gain.value=.18;sfxGain.connect(se);se.connect(echoIn);
  musicGain=ac.createGain();musicGain.gain.value=.12;musicGain.connect(master);const me=ac.createGain();me.gain.value=.42;musicGain.connect(me);me.connect(echoIn)}
 if(ac.state=='suspended')ac.resume()}catch(e){}return ac}
function setMute(m){muted=m;ST.set('mute',m);if(master)master.gain.value=m?0:1}
// one synth voice with an ADSR envelope, optional vibrato and pitch slide
function voice(f,d,w='p25',v=.2,dl=0,dest,o={}){const a=ac;if(!a||muted||a.state!='running')return;const t=a.currentTime+dl,os=a.createOscillator(),gn=a.createGain();
 if(w[0]=='p')os.setPeriodicWave(pw(w=='p12'?.125:w=='p25'?.25:.5));else os.type=w;os.frequency.setValueAtTime(f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(Math.max(20,o.f2),t+(o.st||d));
 if(o.vib){const l=a.createOscillator(),lg=a.createGain();l.frequency.value=5.5;lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(f*.012*o.vib,t+Math.min(d,.25));l.connect(lg);lg.connect(os.frequency);l.start(t);l.stop(t+d+.2)}
 const at=o.at||.005,rl=o.rl||.05,su=o.su??.7;gn.gain.setValueAtTime(0.0001,t);gn.gain.linearRampToValueAtTime(v,t+at);gn.gain.linearRampToValueAtTime(v*su,t+at+.06);gn.gain.setValueAtTime(v*su,t+Math.max(at+.06,d));gn.gain.exponentialRampToValueAtTime(0.0001,t+d+rl);
 os.connect(gn);gn.connect(dest||sfxGain);os.start(t);os.stop(t+d+rl+.05)}
const tone=(f,d=.1,w='p25',v=.2,f2=0,dl=0,dest)=>voice(f,d,w,v,dl,dest,{f2,su:.5,rl:.03});
let nbuf=null;function noise(d=.1,v=.3,fq=1000,q=1,type='bandpass',dl=0,f2=0,dest){const a=ac;if(!a||muted||a.state!='running')return;if(!nbuf){nbuf=a.createBuffer(1,a.sampleRate,a.sampleRate);const ch=nbuf.getChannelData(0);let s=0;for(let i=0;i<ch.length;i++){if(i%3==0)s=R()*2-1;ch[i]=s}}
 const t=a.currentTime+dl,s=a.createBufferSource(),f=a.createBiquadFilter(),gn=a.createGain();s.buffer=nbuf;s.loop=true;f.type=type;f.frequency.setValueAtTime(fq,t);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t+d);f.Q.value=q;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(0.0001,t+d);s.connect(f);f.connect(gn);gn.connect(dest||sfxGain);s.start(t,R());s.stop(t+d+.03)}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
const arp=(ns,step,w,v,len)=>ns.forEach((n,i)=>n&&voice(NOTE(n),len||step*.9,w,v,i*step,null,{su:.6,rl:.06}));
const SFX={
 hop(){tone(330,.06,'p25',.14,660);tone(990,.04,'p12',.06,0,.035)},
 bump(){tone(140,.08,'p50',.14,100)},
 bonk(){noise(.2,.4,800,1.1,'bandpass');tone(600,.32,'p25',.16,80);arp([84,79,76],.04,'p12',.08)},
 splash(){noise(.55,.45,2200,.7,'lowpass',0,180);tone(420,.3,'triangle',.18,90);noise(.25,.12,5000,1,'highpass',.12)},
 tick(){tone(1320,.05,'p12',.1)},
 soda(){arp([83,90],.05,'p25',.12)},
 pizza(){arp([76,79,84],.06,'p25',.13)},
 can(){arp([72,76,79,84,88],.045,'p25',.11)},
 gold(){arp([79,83,86,91,95,98],.05,'p12',.12,.18);noise(.6,.08,7000,.5,'highpass',.1)},
 home(){arp([72,76,79,76,79,84],.07,'p25',.12);arp([60,64,67],.14,'triangle',.18)},
 bug(){arp([86,89,93],.04,'sine',.14)},
 kit(){voice(880,.1,'p12',.12,0,null,{f2:1320,st:.08});voice(1320,.12,'p12',.1,.1,null,{f2:1760,st:.1})},
 oneup(){arp([72,76,79,84,88,91,96],.055,'p25',.11)},
 clear(){arp([72,72,76,79,0,76,79,84],.11,'p25',.13,.16);arp([48,55,60,64],.22,'triangle',.2,.3);arp([0,0,0,0,0,0,0,0,88],.11,'p12',.08,.4)},
 die(){arp([79,78,77,76,75,74,73,72],.06,'p25',.09);tone(110,.5,'triangle',.18,55,.2)},
 over(){arp([67,66,65,64,63,62,61,60],.16,'p50',.11,.2);arp([43,42,41,40],.32,'triangle',.18,.3)},
 bell(){voice(1180,.12,'p12',.08,0,null,{su:.3,f2:1500,st:.1})},
 fishcall(){voice(520,.12,'p50',.12,0,null,{f2:760,st:.1});voice(760,.16,'p50',.12,.13,null,{f2:520,st:.15});noise(.1,.08,3000,1,'bandpass',.02)},
 seal(){voice(240,.12,'sawtooth',.12,0,null,{f2:160});voice(260,.12,'sawtooth',.12,.16,null,{f2:170})},
 walk(){arp([88,88],.12,'p12',.07)},
 horn(){tone(330,.16,'p50',.06);tone(415,.16,'p50',.05)},
 ferry(){tone(98,.9,'sawtooth',.06);tone(147,.9,'triangle',.08)},
 gull(){tone(1500,.12,'sawtooth',.05,900);tone(1600,.14,'sawtooth',.05,1000,.16)},
 crow(){noise(.12,.18,700,3,'bandpass');noise(.12,.18,650,3,'bandpass',.18)},
 combo(){tone(1760,.06,'p12',.08)},
 click(){arp([84,91],.03,'p25',.1)},
 move(){tone(990,.03,'p12',.07)}};
function vib(ms){try{if(!muted&&navigator.vibrate)navigator.vibrate(ms)}catch(e){}}
// ---------- music: 16-bit tracker (lead with vibrato, arpeggio, pad, triangle bass, noise drums + echo). Paused with the game.
const CH={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function chordNotes(n){const m=n.match(/^([A-G][#b]?)(m|7|maj7|m7|sus4)?$/);const r=CH[m[1]],q=m[2]||'';const iv=q=='m'?[0,3,7]:q=='7'?[0,4,7,10]:q=='m7'?[0,3,7,10]:q=='maj7'?[0,4,7,11]:q=='sus4'?[0,5,7]:[0,4,7];return{r,iv}}
function parseMel(s){const out=[];const tk=s.trim().split(/\s+/);for(let i=0;i<tk.length;i++){const t=tk[i];if(t=='.'||t=='-'){out.push(null);continue}const m=t.match(/^([A-G][#b]?)(\d)$/);let len=1;while(tk[i+len]=='-')len++;out.push([12*(+m[2]+1)+CH[m[1]],len])}return out}
// song = {bpm, chords:'C Am F G' (one per bar; 'Dm/G' = two halves), lead:[bar strings], drums:'k.h.s.h.', bass pattern}
function buildSong(S){const bars=S.chords.trim().split(/\s+/),N=bars.length*16,tr={lead:[],arp:[],pad:[],bass:[],dr:[]};const lead=parseMel(S.lead.join(' '));
 bars.forEach((b,bi)=>{const halves=b.split('/');for(let s=0;s<16;s++){const ch=chordNotes(halves[halves.length>1&&s>=8?1:0]),st=bi*16+s;
  const ar=[ch.iv[0],ch.iv[1],ch.iv[2],12+ch.iv[0]];tr.arp[st]=S.arp===false?null:[60+ch.r+ar[(s)%4]+(S.arpOct||0),1];
  if(s%8==0)tr.pad[st]=[ch.r,ch.iv];
  const bp=S.bass||'R..R..5.R..R.58.';const k=bp[s];tr.bass[st]=k=='.'?null:[36+ch.r+(k=='5'?7:k=='8'?12:k=='3'?ch.iv[1]:0),k=='R'&&bp[s+1]=='-'?2:1]}});
 const dp=S.drums||'k.h.s.h.k.khs.hh';for(let s=0;s<N;s++)tr.dr[s]=dp[s%dp.length];
 return{bpm:S.bpm,N,tr,lead,S}}
const SONGDEF={
 title:{bpm:116,chords:'G C G D Em C D G',drums:'k..hs.h.k.k.s.hh',bass:'R...5...R.R.5.3.',lead:[
  'D5 - G5 - B5 - - A5 - G5 - - E5 - D5 -','E5 - - - G5 - C6 - - - B5 - A5 - - -','B5 - - - D6 - B5 - G5 - - - A5 - B5 -','A5 - - - F#5 - - - D5 - - - . . . .',
  'G5 - B5 - E6 - - D6 - B5 - - G5 - E5 -','C6 - - - B5 - A5 - G5 - E5 - G5 - - -','A5 - - - B5 - C6 - D6 - - - F#5 - - -','G5 - - - - - - - . . . . D5 - - -']},
 day:{bpm:150,chords:'F Bb C F Dm Bb C C7',drums:'k.hhs.hhk.khs.hk',bass:'R.R.5.R.R.R.5.8.',lead:[
  'F5 - A5 - C6 - A5 - F5 - - - C5 - - -','D5 - F5 - Bb5 - - - A5 - G5 - F5 - - -','E5 - G5 - C6 - - - Bb5 - A5 - G5 - E5 -','F5 - - - A5 - - - C6 - - - . . A5 -',
  'D6 - - - C6 - A5 - F5 - - - A5 - D6 -','C6 - - - Bb5 - F5 - D5 - - - F5 - Bb5 -','A5 - - - G5 - - - C6 - - - E5 - G5 -','Bb5 - - - A5 - G5 - E5 - - - C5 - - -']},
 night:{bpm:118,chords:'Dm Bb F C Dm Gm A Dm/A',drums:'k..h..k.s..h.kh.',bass:'R..R.5..R..R.5.8',arpOct:-12,lead:[
  'D5 - - F5 - - A5 - - - G5 - F5 - E5 -','F5 - - - D5 - - - Bb4 - D5 - F5 - - -','A5 - - C6 - - A5 - - - F5 - C5 - - -','E5 - - - G5 - - - C6 - - - E5 - - -',
  'D6 - - - C6 - A5 - - - F5 - A5 - D6 -','Bb5 - - - A5 - G5 - - - D5 - G5 - Bb5 -','A5 - - - C#6 - - - E6 - - - A5 - G5 -','F5 - - - E5 - - - D5 - - - . . . .']},
 story:{bpm:96,chords:'C Am F G',drums:'k.......s.......',bass:'R.......5.......',arp:true,lead:[
  'E5 - - - G5 - - - C6 - - - B5 - - -','A5 - - - - - - - E5 - - - - - - -','F5 - - - A5 - - - C6 - - - A5 - - -','G5 - - - - - - - D5 - - - G5 - - -']}};
const SONGS={};function getSong(n){return SONGS[n]||(SONGS[n]=buildSong(SONGDEF[n]))}
let song=null,songName='',musicOn=false,mStep=0,mNext=0,mTimer=null;
function playSong(n){if(songName==n&&musicOn)return;songName=n;song=getSong(n);mStep=0;const a=A();if(!a)return;if(!musicOn){musicOn=true;mNext=a.currentTime+.1;mTimer=setInterval(mTick,40)}}
function musicPaused(){return paused||panelOpen||document.hidden}
function mTick(){if(!ac||!song)return;const sp=60/song.bpm/4;if(mNext<ac.currentTime-.5)mNext=ac.currentTime+.05;
 while(mNext<ac.currentTime+.2){if(!muted&&!musicPaused()&&ac.state=='running'){const s=mStep%song.N,t0=Math.max(0,mNext-ac.currentTime),tr=song.tr,M=musicGain;
   const L=song.lead[s];if(L)voice(NOTE(L[0]),sp*L[1]*.92,'p25',.16,t0,M,{vib:L[1]>2?1:0,at:.01,su:.75,rl:.08});
   const ap=tr.arp[s];if(ap)voice(NOTE(ap[0]),sp*.55,'p12',.045,t0,M,{su:.4,rl:.02});
   const pd=tr.pad[s];if(pd)for(const iv of pd[1].slice(0,3))voice(NOTE(48+pd[0]+iv+12),sp*7.2,'p50',.028,t0,M,{at:.08,su:.8,rl:.2});
   const b=tr.bass[s];if(b)voice(NOTE(b[0]),sp*b[1]*.85,'triangle',.3,t0,M,{su:.8,rl:.03});
   const d=tr.dr[s];if(d=='k'){voice(150,.11,'sine',.42,t0,M,{f2:42,st:.1,su:.3});noise(.03,.14,1200,1,'lowpass',t0,0,M)}else if(d=='s'){noise(.12,.3,1900,.8,'bandpass',t0,0,M);voice(220,.05,'triangle',.18,t0,M,{f2:140})}else if(d=='h')noise(.025,.1,9000,1,'highpass',t0,0,M)}
  mNext+=sp;mStep++}}
