// ---------- 16-bit sprite sheet (built once at load from code, pixel by pixel)
const OL='#1a1424';
function shade(hex,k){const v=HX(hex);const f=x=>CL(Math.round(k>0?x+(255-x)*k:x*(1+k)),0,255).toString(16).padStart(2,'0');return'#'+f(v[0])+f(v[1])+f(v[2])}
const FUR={dk:'#3d404c',md:'#767d8c',lt:'#a6adba',pl:'#d3d7df',wh:'#f5f4ee',mk:'#211f29',tl:'#2f2f39'};
const SP={};
// Jimothy, top-down (faces up; rotated in 90-degree steps so pixels stay crisp). f: leg swing, tail sway, carry, squash
function jimTop(leg,tail,carry,squash){return mkSpr(20,20,P=>{const cx=10;
 for(let i=0;i<5;i++){const y=13+i*1.3,x=cx+tail*(i*.45);P.el(x,y,2.6-i*.18,1.5,i%2?FUR.tl:FUR.lt)}P.el(cx+tail*2.4,19,1.5,1,FUR.tl);
 for(const [px,py,s] of [[4,8,1],[16,8,-1],[5,14,-1],[15,14,1]])P.el(px,py+leg*s,1.8,1.7,FUR.dk);
 const by=squash?11:10.5,bw=squash?6.8:6.2,bh=squash?5:5.6;P.el(cx,by,bw,bh,FUR.md,FUR.lt,FUR.dk);P.el(cx,by-1,3.6,3.2,FUR.lt,FUR.pl);
 if(carry){P.el(cx,12,3,2.4,FUR.lt,FUR.pl);P.rect(cx-2,12,4,1,FUR.mk);P.px(cx-2,12,FUR.wh);P.px(cx+1,12,FUR.wh);P.px(cx-3,10,FUR.dk);P.px(cx+2,10,FUR.dk)}
 P.el(5.5,3.2,2.2,2.2,FUR.dk);P.el(14.5,3.2,2.2,2.2,FUR.dk);P.px(5,3,FUR.mk);P.px(14,3,FUR.mk);
 P.el(cx,5.6,5.3,4.4,FUR.lt,FUR.pl,FUR.md);
 P.rect(5,3,3,1,FUR.wh);P.rect(12,3,3,1,FUR.wh);
 P.rect(4,5,12,2,FUR.mk);P.rect(5,4,3,1,FUR.mk);P.rect(12,4,3,1,FUR.mk);P.px(6,5,FUR.wh);P.px(13,5,FUR.wh);P.px(6,6,'#5a3a1c');P.px(13,6,'#5a3a1c');
 P.el(cx,2.4,2.2,1.6,FUR.wh);P.rect(9,1,2,1,'#111111');
},{ol:OL})}
// front portrait (title / game over)
function jimFront(blink,tailA,mood){return mkSpr(48,58,P=>{const cx=22;
 for(let i=0;i<6;i++){const a=tailA-i*.05,x=34+i*1.6+Math.sin(a)*i*.6,y=44-i*4.2;P.el(x,y,4.6-i*.2,3.6,i%2?FUR.tl:FUR.lt,i%2?null:FUR.pl)}P.el(44.5,19,2.6,2.4,FUR.tl);
 P.el(15,53,5,2.6,FUR.dk);P.el(29,53,5,2.6,FUR.dk);
 P.el(cx,42,13,12,FUR.md,FUR.lt,FUR.dk);P.el(cx,45,8,8,FUR.pl,FUR.wh);
 P.el(9.5,40,3,5.5,FUR.md,FUR.lt,FUR.dk);
 P.rect(27,33,7,10,'#d22b3c');P.rect(27,32,7,1,'#c9ced6');P.rect(28,31,5,1,'#9aa0aa');P.rect(27,36,7,2,'#ffffff');P.rect(28,34,1,8,'#ff7180');P.rect(33,34,1,8,'#8e1824');P.el(31,43,3.4,2.6,FUR.md,FUR.lt);
 P.el(10,9,4.4,4.4,FUR.dk);P.el(34,9,4.4,4.4,FUR.dk);P.el(10,9.6,2.2,2.2,FUR.mk);P.el(34,9.6,2.2,2.2,FUR.mk);
 P.el(cx,20,13.5,11.5,FUR.lt,FUR.pl,FUR.md);
 P.el(15.5,13.2,4.2,1.6,FUR.wh);P.el(28.5,13.2,4.2,1.6,FUR.wh);
 P.el(15.5,19,6.2,4.4,FUR.mk);P.el(28.5,19,6.2,4.4,FUR.mk);P.rect(19,17,6,3,FUR.mk);
 if(blink){P.rect(13,19,6,1,FUR.wh);P.rect(25,19,6,1,FUR.wh)}else{for(const ex of [15.5,28.5]){P.el(ex,19,3.3,3.5,FUR.wh);P.el(ex+.7,19.6,2.1,2.3,'#8a5426');P.rect(Math.floor(ex+.2),Math.floor(19.1),2,2,'#000000');P.px(ex-.8,17.4,'#ffffff');P.px(ex-1.8,18.4,'#ffffff')}}
 P.el(cx,26,6.5,4.4,FUR.wh);P.el(17.5,27,3.4,2.8,FUR.wh);P.el(26.5,27,3.4,2.8,FUR.wh);
 P.el(cx,23.4,2.4,1.6,'#141218');P.px(cx-1,23,'#6a6a78');
 if(mood=='sad'){P.px(20,29,OL);P.px(21,28,OL);P.px(22,28,OL);P.px(23,28,OL);P.px(24,29,OL)}else{P.px(cx,25,OL);P.px(cx,26,OL);P.px(19,27,OL);P.px(20,28,OL);P.px(21,28,OL);P.px(23,28,OL);P.px(24,28,OL);P.px(25,27,OL);P.rect(21,29,3,1,'#e86f8c');P.px(22,30,'#c84a6c')}
},{ol:OL})}
function kitSpr(){return mkSpr(12,12,P=>{P.el(3,2.5,1.6,1.6,FUR.dk);P.el(9,2.5,1.6,1.6,FUR.dk);P.el(6,6,4.6,4,FUR.lt,FUR.pl,FUR.md);P.rect(2,5,8,2,FUR.mk);P.px(3,5,FUR.wh);P.px(8,5,FUR.wh);P.el(6,8.4,1.8,1.2,FUR.wh);P.px(6,8,'#111111')},{ol:OL})}
// vehicles: drawn facing right; a mirrored copy (with un-mirrored lettering) is built for leftward lanes
function car(w,col,kind,mir){return mkSpr(w+2,16,P=>{const h=14,X=1,Y=1,hi=shade(col,.35),lo=shade(col,-.35),gl='#24324a',gh='#7f9cc4';
 P.rect(X+3,Y,4,2,'#151515');P.rect(X+w-8,Y,4,2,'#151515');P.rect(X+3,Y+h-2,4,2,'#151515');P.rect(X+w-8,Y+h-2,4,2,'#151515');
 P.rect(X+1,Y+2,w-2,h-4,col);P.rect(X,Y+3,w,h-6,col);P.rect(X+1,Y+2,w-2,1,hi);P.rect(X,Y+h-4,w,1,lo);P.rect(X+1,Y+h-3,w-2,1,lo);
 P.rect(X+w-7,Y+3,2,h-6,gl);P.px(X+w-7,Y+4,gh);P.rect(X+2,Y+4,2,h-8,gl);
 P.rect(X+5,Y+4,w-13,h-8,kind=='sport'?'#18181c':shade(col,.12));
 if(kind=='sport'){P.rect(X,Y+6,w,2,'#f2f2f2')}if(kind=='taxi'){P.rect(X+7,Y+5,5,4,'#ffffff');P.dith(X+7,Y+5,5,4,'#111111')}
 P.px(X+w-1,Y+3,'#fff6a0');P.px(X+w-1,Y+h-4,'#fff6a0');P.px(X,Y+3,'#ff3030');P.px(X,Y+h-4,'#ff3030')},{mir,ol:OL})}
function bus(mir){return mkSpr(53,17,P=>{const w=51,h=15,X=1,Y=1;P.rect(X,Y,w,h,'#1d5aa8');P.rect(X,Y,w,1,'#4f8ad8');P.rect(X,Y+h-4,w,4,'#17a397');P.rect(X,Y+h-1,w,1,'#0e6e66');
 for(let i=X+4;i<X+w-10;i+=7)P.rect(i,Y+3,5,5,'#cfdbe6'),P.px(i,Y+3,'#ffffff');P.rect(X+w-4,Y+2,3,h-4,'#1b2a38');P.px(X+w-4,Y+3,'#6f8fb5');P.rect(X+20,Y,3,h,'#163f78');
 P.t3('44',X+w-14,Y+5,'#ffd23f');P.px(X+w-1,Y+2,'#fff6a0');P.px(X+w-1,Y+h-3,'#fff6a0');P.px(X,Y+2,'#ff3030');P.px(X,Y+h-3,'#ff3030')},{mir,ol:OL})}
function truck(ty,mir){const w=ty=='truck'?34:35;return mkSpr(w+2,17,P=>{const X=1,Y=1,h=15,cab=10,cc=ty=='coffee'?'#6b3e26':'#c83a3a',bc=ty=='foodtruck'?'#ffcf33':ty=='coffee'?'#efe0c0':'#eef0f2';
 P.rect(X+w-cab,Y+1,cab,h-2,cc);P.rect(X+w-cab,Y+1,cab,1,shade(cc,.3));P.rect(X+w-4,Y+3,2,h-6,'#1b2a38');P.px(X+w-4,Y+4,'#7f9cc4');
 P.rect(X,Y,w-cab-1,h,bc);P.rect(X,Y,w-cab-1,1,shade(bc,.4));P.rect(X,Y+h-2,w-cab-1,2,shade(bc,-.25));
 if(ty=='foodtruck'){for(let i=X;i<X+w-cab-1;i+=4)P.rect(i,Y,2,3,'#e63946');P.t3('FOOD',X+4,Y+6,'#7a1d1d')}
 else if(ty=='coffee'){P.rect(X+3,Y+5,4,5,'#ffffff');P.px(X+7,Y+6,'#ffffff');P.px(X+7,Y+8,'#ffffff');P.rect(X+4,Y+5,2,1,'#6b3e26');P.t3('JAVA',X+9,Y+6,'#6b3e26')}
 else{P.el(X+6,Y+8,3.5,2,'#4a90d9');P.px(X+3,Y+7,'#4a90d9');P.px(X+2,Y+6,'#4a90d9');P.px(X+2,Y+10,'#4a90d9');P.px(X+8,Y+7,'#ffffff');P.t3('FISH',X+11,Y+6,'#1d4e89')}
 P.px(X+w-1,Y+2,'#fff6a0');P.px(X+w-1,Y+h-3,'#fff6a0')},{mir,ol:OL})}
function bike(ty,col,mir){return mkSpr(15,10,P=>{P.rect(1,4,13,2,'#2a2a2a');P.el(2,5,1.6,1.2,'#111111');P.el(12,5,1.6,1.2,'#111111');if(ty=='scooter')P.rect(3,2,8,6,col),P.rect(3,2,8,1,shade(col,.4));
 P.el(7,5,2.6,3.2,ty=='bike'?'#2d6cdf':'#444444');P.el(8,5,1.8,1.8,ty=='bike'?col:'#f1f1f1');if(ty=='bike')P.px(10,5,'#ffde59')},{mir,ol:OL})}
function trainCar(front,mir){return mkSpr(38,14,P=>{P.rect(1,1,36,12,'#f1f3f5');P.rect(1,1,36,1,'#ffffff');P.rect(1,9,36,2,'#1e5fb4');P.rect(1,3,36,1,'#2fb37a');for(let i=4;i<32;i+=6)P.rect(i,5,4,3,'#2a3a52');
 if(front){P.rect(33,2,3,10,'#2a3a52');P.px(36,2,'#fff6a0');P.px(36,11,'#fff6a0');P.t3('LINK',5,4,'#1e5fb4')}P.rect(1,12,36,1,'#9aa3ad')},{mir,ol:OL})}
function logSpr(w){return mkSpr(w+2,14,P=>{const X=1,Y=1,h=12;P.rect(X+2,Y,w-4,h,'#7a4a24');P.rect(X+1,Y+1,w-2,h-2,'#7a4a24');P.rect(X+2,Y+1,w-4,2,'#9a6334');P.rect(X+2,Y+h-2,w-4,1,'#4e2c12');
 for(let i=X+6;i<X+w-6;i+=9){P.rect(i,Y+5,5,1,'#5a3416');P.rect(i+3,Y+8,4,1,'#5a3416');P.px(i+1,Y+3,'#b07a44')}
 P.el(X+3,Y+6,3,5.5,'#d4a86e');P.el(X+3,Y+6,1.8,3.6,'#b58650');P.px(X+3,Y+6,'#7a4a24');P.rect(X+w-2,Y+2,1,h-4,'#5a3416')},{ol:OL})}
function crateSpr(){return mkSpr(16,14,P=>{P.rect(1,1,14,12,'#b47c40');P.rect(1,1,14,1,'#d9a466');P.rect(1,12,14,1,'#7a4e22');P.rect(1,1,1,12,'#cf9a5c');P.rect(14,1,1,12,'#8a5a2a');
 P.rect(2,2,12,1,'#8a5a2a');P.rect(2,11,12,1,'#8a5a2a');P.line(2,3,13,10,'#8a5a2a');P.line(2,4,12,10,'#d9a466')},{ol:OL})}
function ferrySpr(mir){return mkSpr(82,16,P=>{const w=80,X=1,Y=1;for(let x=0;x<w;x++){const tip=x>w-12?Math.round((x-(w-12))*.55):0;P.rect(X+x,Y+tip,1,14-tip*2,'#f5f7f8')}
 P.rect(X,Y+11,w-12,3,'#1f7a4d');P.rect(X,Y,w-12,2,'#1f7a4d');P.rect(X+14,Y+4,w-40,6,'#dde3e7');P.rect(X+14,Y+4,w-40,1,'#ffffff');
 P.rect(X+w-22,Y+4,7,6,'#1f7a4d');P.el(X+w-18.5,Y+7,2,2,'#111111');P.t3('SALISH',X+19,Y+5,'#1f7a4d')},{mir,ol:OL})}
function orcaSpr(open,ft,mir){return mkSpr(50,16,P=>{const X=1,Y=1;P.rect(X,Y+3+ft,4,2,'#121216');P.rect(X,Y+9-ft,4,2,'#121216');P.rect(X+2,Y+6,4,2,'#121216');
 P.el(X+24,Y+7,20,6.4,'#16161c','#3a3a48');P.el(X+38,Y+7,8,5,'#16161c');P.el(X+35,Y+3.6,3,1.3,'#ffffff');P.el(X+35,Y+10.4,3,1.3,'#ffffff');P.el(X+20,Y+7,7,2,'#9aa0aa');P.rect(X+17,Y+7,7,1,'#26262e');
 if(open){P.rect(X+42,Y+5,5,4,'#c0392b');for(let i=0;i<3;i++){P.px(X+43+i*1.5,Y+5,'#ffffff');P.px(X+43+i*1.5,Y+8,'#ffffff')}}},{mir,ol:OL})}
function sodaSpr(){return mkSpr(8,11,P=>{P.rect(1,1,6,9,'#d22b3c');P.rect(1,0,6,1,'#c9ced6');P.rect(1,4,6,2,'#ffffff');P.rect(2,2,1,7,'#ff7180');P.rect(6,2,1,7,'#8e1824')},{ol:OL})}
function pizzaSpr(){return mkSpr(13,12,P=>{P.rect(1,1,11,10,'#d9a066');P.rect(1,1,11,1,'#f0c48c');P.rect(1,10,11,1,'#a8743c');P.rect(3,3,7,6,'#c88a50');P.el(6.5,6,2.6,2.2,'#e04030');P.px(5,5,'#ffe08a');P.px(7,6,'#ffe08a')},{ol:OL})}
function canSpr(){return mkSpr(12,12,P=>{P.rect(2,2,8,9,'#6c7a86');P.rect(2,2,2,9,'#8d9ba7');P.rect(9,2,1,9,'#4a5560');P.rect(5,4,1,6,'#55626d');P.rect(7,4,1,6,'#55626d');P.el(6,2,4.4,1.6,'#a7b4bf');P.px(8,1,'#e9c46a');P.px(4,1,'#9bd27a')},{ol:OL})}
function goldSpr(){return mkSpr(8,11,P=>{P.rect(1,1,6,9,'#ffcc22');P.rect(1,0,6,1,'#fff2a8');P.rect(1,4,6,2,'#fff6c2');P.rect(2,2,1,7,'#ffffff');P.rect(6,2,1,7,'#c08a00')},{ol:'#6a4a00'})}
function denSpr(full){return mkSpr(22,18,P=>{P.el(11,9,9.5,8,'#5d6a75');P.el(11,8.5,8.6,7.2,'#9aa8b4','#c7d1da','#6b7884');P.el(11,9,6.4,5.4,full?'#2c343b':'#1b2026');P.rect(17,1,4,2,'#6b7884');
 if(full){P.px(7,6,FUR.dk);P.px(14,6,FUR.dk);P.el(11,10,4,3,FUR.lt,FUR.pl);P.rect(7,9,8,2,FUR.mk);P.px(8,9,FUR.wh);P.px(13,9,FUR.wh);P.px(10,12,'#111111');P.px(11,12,'#111111')}},{ol:OL})}
function bugSpr(f){return mkSpr(12,11,P=>{if(f){P.el(3,4,2.6,1.6,'#d8ffd8');P.el(9,4,2.6,1.6,'#d8ffd8')}P.el(6,6,2.8,3.6,'#2fbf4a','#7cf08a','#167a2a');P.el(6,2.4,1.8,1.4,'#145c22');P.px(5,5,'#ffffff')},{ol:OL})}
function crowSpr(f){return mkSpr(18,12,P=>{if(f)P.el(4,5,4,1.6,'#16161a'),P.el(14,5,4,1.6,'#16161a');else P.el(5,6,3,2.4,'#16161a'),P.el(13,6,3,2.4,'#16161a');P.el(9,6.5,2.6,4,'#1d1d24','#3c3c4c');P.el(9,2.6,2,2,'#26262e');P.rect(8,0,2,1,'#f2b134');P.px(8,2,'#ffffff');P.px(10,2,'#ffffff')},{ol:OL})}
function gullSpr(f){return mkSpr(18,12,P=>{P.el(8,6,5.5,3.4,'#f4f4f4','#ffffff','#c8ccd2');P.el(6,6,3,2.6,'#9aa3ab');P.el(2,6,1.6,1.4,'#2b2b2b');P.el(12,4.5,2.6,2.4,'#ffffff');P.rect(14,4,3,1,'#f5a623');P.px(13,4,'#111111');P.px(7+f,9,'#f5a623');P.px(7+f,10,'#f5a623');P.px(10-f,9,'#f5a623');P.px(10-f,10,'#f5a623')},{ol:OL})}
function cloudSpr(w){return mkSpr(w,12,P=>{for(let i=0;i<w/6;i++)P.el(4+i*5.5,7-(i%2)*1.6,4.6,3.6,'#ffffff','#ffffff','#d8e4f0');P.rect(2,9,w-4,2,'#d8e4f0')})}
// ---------- Jimothy's Crossing 2: Market & Locks sprites
function raftSpr(w){return mkSpr(w+2,14,P=>{const X=1,Y=1;for(const [yy,hh] of [[0,6],[6,6]]){P.rect(X+1,Y+yy,w-2,hh,'#7a4a24');P.rect(X+1,Y+yy,w-2,1,'#a06a36');P.rect(X+1,Y+yy+hh-1,w-2,1,'#4e2c12');P.el(X+2,Y+yy+3,2,2.6,'#d4a86e');P.px(X+2,Y+yy+3,'#9a6a3a')}
 for(let x=X+6;x<X+w-4;x+=11){P.rect(x,Y,2,12,'#d9c08a');P.px(x,Y+5,'#a88a50');P.px(x+1,Y+6,'#a88a50')}},{ol:OL})}
function kayakSpr(mir){return mkSpr(34,12,P=>{for(let x=0;x<32;x++){const e=Math.min(x,31-x),hh=Math.min(4,1+e*.45);P.rect(1+x,6-hh,1,hh*2,x%7==0?'#ff8a3a':'#f26a1b')}P.rect(4,5,24,1,'#ffb070');P.el(17,6,4,2.2,'#2a2a32');P.el(17,6,2.2,2.2,'#e8b890');P.px(17,5,'#5a3a1c');P.line(8,1,26,10,'#d8d8d8');P.rect(7,0,2,2,'#2f6fd0');P.rect(25,10,2,2,'#2f6fd0')},{mir,ol:OL})}
function duckSpr(mir){return mkSpr(73,16,P=>{const w=71,X=1,Y=1;for(let x=0;x<w;x++){const tip=x>w-10?Math.round((x-(w-10))*.6):0;P.rect(X+x,Y+tip,1,14-tip*2,'#e8b828')}P.rect(X,Y,w-10,2,'#b88a10');P.rect(X,Y+12,w-10,2,'#8a6a08');
 P.rect(X+6,Y+3,w-22,8,'#3e8a52');for(let i=X+8;i<X+w-18;i+=5){P.rect(i,Y+4,3,6,'#2a5a36');P.el(i+1.5,Y+6,1.2,1.2,['#e8b890','#a0603a','#ffd0a0','#7a4a2a'][i%4])}P.rect(X+w-16,Y+3,6,8,'#24324a');P.t3('DUCKS',X+20,Y+5-0,'#ffffff')},{mir,ol:OL})}
function ringSpr(){return mkSpr(16,14,P=>{P.el(8,7,6.6,6,'#e8e8e8');for(let a=0;a<4;a++){const ang=a*PI/2+PI/4;P.el(8+Math.cos(ang)*4.6,7+Math.sin(ang)*4.2,2.2,2,'#e0303a')}P.el(8,7,2.6,2.2,'#00000000');P.el(8,7,2.4,2,'#2a86c4')},{ol:OL})}
function sealRaft(fr,mir){return mkSpr(50,14,P=>{const X=1,Y=1,w=48;for(const [yy,hh] of [[0,6],[6,6]]){P.rect(X+1,Y+yy,w-2,hh,'#7a4a24');P.rect(X+1,Y+yy,w-2,1,'#a06a36');P.rect(X+1,Y+yy+hh-1,w-2,1,'#4e2c12')}for(let x=X+6;x<X+w-16;x+=11)P.rect(x,Y,2,12,'#d9c08a');
 P.el(X+36,Y+6,9,4.6,'#7a5232','#a87a52','#4e3018');P.el(X+44,Y+6+(fr?-1:0),3.6,3.2,'#86603c','#b08860');P.px(X+46,Y+5+(fr?-1:0),'#111111');P.px(X+46,Y+7+(fr?-1:0),'#111111');P.px(X+47,Y+6+(fr?-1:0),'#2a1a10');P.rect(X+30,Y+2,3,2,'#5a3a20');P.rect(X+30,Y+9,3,2,'#5a3a20');if(fr){P.px(X+48,Y+3,'#ffffff');P.px(X+48,Y+8,'#ffffff')}},{mir,ol:OL})}
function vanSpr(mir){return mkSpr(31,16,P=>{const X=1,Y=1,w=29,h=14;P.rect(X,Y+1,w,h-2,'#f2f4f6');P.rect(X+1,Y,w-2,h,'#f2f4f6');P.rect(X+1,Y,w-2,1,'#ffffff');P.rect(X,Y+h-3,w,2,'#c8ccd2');P.rect(X+w-6,Y+2,3,h-4,'#24324a');P.px(X+w-6,Y+3,'#7f9cc4');P.rect(X+2,Y+6,w-10,2,'#2f6fd0');P.t3('FRESH',X+3,Y+1,'#2f6fd0');P.px(X+w-1,Y+2,'#fff6a0');P.px(X+w-1,Y+h-3,'#fff6a0')},{mir,ol:OL})}
function cartSpr(mir){return mkSpr(24,15,P=>{P.rect(2,2,16,11,'#8a5a2a');P.rect(2,2,16,1,'#b07a44');const cols=['#e0303a','#3aa04a','#ff9a20','#ffd23f','#8d5bd6'];for(let y=3;y<12;y+=2)for(let x=3;x<17;x+=2)P.px(x+(y%4?1:0),y,cols[(x*3+y)%5]);P.rect(0,4,2,1,'#5a3a1c');P.rect(0,10,2,1,'#5a3a1c');P.el(21,7.5,2.4,2.4,'#e8b890');P.px(21,6,'#5a3a1c');P.rect(18,4,1,7,'#5a3a1c')},{mir,ol:OL})}
function forkSpr(mir){return mkSpr(23,15,P=>{P.rect(1,2,14,11,'#f2b81a');P.rect(1,2,14,1,'#ffe070');P.rect(1,11,14,2,'#b08000');P.rect(4,4,6,7,'#3a3a40');P.el(7,7.5,2.2,2.2,'#e8b890');P.rect(15,3,2,9,'#555a62');P.rect(17,4,5,1,'#9aa0aa');P.rect(17,10,5,1,'#9aa0aa');P.rect(1,1,3,1,'#111111');P.rect(1,13,3,1,'#111111')},{mir,ol:OL})}
function tourSpr(mir){return mkSpr(53,17,P=>{const w=51,h=15,X=1,Y=1;P.rect(X,Y,w,h,'#c8282e');P.rect(X,Y,w,1,'#ff6a60');P.rect(X,Y+h-3,w,3,'#7a1218');for(let i=X+4;i<X+w-10;i+=6)P.rect(i,Y+3,4,4,'#f4e6c8');P.rect(X+w-4,Y+2,3,h-4,'#1b2a38');P.t3('TOURS',X+12,Y+8,'#ffd23f');P.px(X+w-1,Y+2,'#fff6a0');P.px(X+w-1,Y+h-3,'#fff6a0')},{mir,ol:OL})}
function skateSpr(col,mir){return mkSpr(15,10,P=>{P.rect(1,4,13,2,'#3a2a20');P.px(2,3,'#111111');P.px(12,3,'#111111');P.px(2,6,'#111111');P.px(12,6,'#111111');P.el(7,5,2.6,3.4,col);P.el(7.5,5,1.7,1.7,'#e8b890');P.px(7,5,'#3a2a1a')},{mir,ol:OL})}
function salmonSpr(mir){return mkSpr(26,10,P=>{P.el(13,5,9,3.4,'#c8d0d8','#f0f4f8','#8a96a4');P.rect(6,6,14,1,'#f08a8a');P.el(20,5,3,2.6,'#b0b8c2');P.px(21,4,'#111111');P.rect(1,2,3,2,'#8a96a4');P.rect(1,6,3,2,'#8a96a4');P.rect(3,4,2,2,'#8a96a4');for(let x=8;x<18;x+=3)P.px(x,3,'#5a6878')},{mir,ol:OL})}
function mongerSpr(f){return mkSpr(14,17,P=>{P.el(7,4,3,3,'#e8b890');P.rect(4,1,6,2,'#ffffff');P.rect(4,7,6,7,'#ff8a20');P.rect(5,8,4,5,'#ffffff');if(f){P.rect(1,2,2,5,'#e8b890');P.rect(11,2,2,5,'#e8b890')}else{P.rect(2,8,2,5,'#e8b890');P.rect(10,8,2,5,'#e8b890')}P.rect(4,14,2,2,'#3a3a40');P.rect(8,14,2,2,'#3a3a40');P.px(6,4,'#111111');P.px(8,4,'#111111')},{ol:OL})}
function donutSpr(){return mkSpr(11,11,P=>{P.el(5.5,5.5,4.6,4.6,'#d9a066');P.el(5.5,5,4,3.6,'#ff8ac8');P.el(5.5,5.5,1.5,1.5,'#00000000');for(const [x,y,c] of [[3,3,'#ffffff'],[7,3,'#3aa0ff'],[4,7,'#ffd23f'],[8,6,'#7cf08a']])P.px(x,y,c)},{ol:OL})}
function chowderSpr(){return mkSpr(13,12,P=>{P.el(6.5,7,5.6,4.4,'#c88a50','#e8b070','#8a5a2a');P.el(6.5,5,4.4,2.4,'#f4ecd8');P.px(5,4,'#ffb070');P.px(8,5,'#7cbf5a')},{ol:OL})}
function flowerSpr(){return mkSpr(12,14,P=>{P.line(6,13,6,6,'#3a8a3a');P.line(6,12,3,7,'#3a8a3a');P.line(6,12,9,7,'#3a8a3a');for(const [x,y,c] of [[6,4,'#ff4a7a'],[3,6,'#ffd23f'],[9,6,'#b05ad8'],[5,7,'#ff8a3a'],[8,4,'#ff4a4a']]){P.el(x+.5,y+.5,1.8,1.8,c)}P.rect(4,10,5,3,'#f4ecd8')},{ol:OL})}
function garbageTruck(){return mkSpr(46,18,P=>{const X=1,Y=1;P.rect(X,Y,30,16,'#2f8a4a');P.rect(X,Y,30,1,'#5ac07a');P.rect(X,Y+14,30,2,'#1a5a2e');for(let i=0;i<3;i++)P.el(X+6+i*9,Y+8,3.4,3.4,'#9aa8b4','#c7d1da','#6b7884');P.rect(X+31,Y+1,12,14,'#e8e8e8');P.rect(X+38,Y+3,3,10,'#24324a')},{ol:OL})}
function buildSprites(){
 SP.jim={};for(const leg of [0,1,-1])for(const tail of [-1,0,1])for(const carry of [0,1]){SP.jim[[leg,tail,carry,0]]=jimTop(leg,tail,carry,0)}for(const carry of [0,1])SP.jim[[0,0,carry,1]]=jimTop(0,0,carry,1);
 SP.front={happy:[jimFront(0,0,'happy'),jimFront(0,.5,'happy'),jimFront(1,.25,'happy')],sad:[jimFront(0,0,'sad'),jimFront(1,0,'sad')]};
 SP.kit=kitSpr();SP.veh={};
 for(const m of [0,1]){SP.veh['tour'+m]=tourSpr(m);SP.veh['van'+m]=vanSpr(m);SP.veh['cart'+m]=cartSpr(m);SP.veh['forklift'+m]=forkSpr(m);SP.veh['duck'+m]=duckSpr(m);SP.veh['kayak'+m]=kayakSpr(m);SP.veh['salmon'+m]=salmonSpr(m);
  for(const f of [0,1])SP.veh['seal'+f+m]=sealRaft(f,m)}
 SP.raft={};for(const k of ['raft2','raft3','raft4'])SP.raft[k]=raftSpr(Math.round(WID[k]*16));SP.ring=ringSpr();
 SP.soda=donutSpr();SP.pizza=chowderSpr();SP.can=flowerSpr();SP.gold=goldSpr();SP.den=[denSpr(0),denSpr(1)];SP.bug=[bugSpr(0),bugSpr(1)];SP.crow=[crowSpr(0),crowSpr(1)];SP.gull=[gullSpr(0),gullSpr(1)];
 SP.monger=[mongerSpr(0),mongerSpr(1)];SP.gtruck=garbageTruck();SP.cloud=[cloudSpr(22),cloudSpr(34),cloudSpr(16)]}
const CARC={};function carSpr(o,m){const w=Math.round(WID[o.type]*16),col=o.type=='taxi'?'#ffb000':o.col,k=o.type+col+m;return CARC[k]||(CARC[k]=o.type=='bike'?bike('bike',col,m):o.type=='skate'?skateSpr(col,m):car(w,col,o.type,m))}
