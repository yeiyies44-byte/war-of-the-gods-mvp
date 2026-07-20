// node generate-stories.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(process.env.HOME, 'Desktop', 'War of the Gods — Key Art');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const W = 1080, H = 1920;

// Shared CSS reset + font
const BASE = `*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;overflow:hidden;background:#000;font-family:'Georgia',serif}
canvas{position:absolute;left:0;top:0;width:${W}px;height:${H}px}
.layer{position:absolute;inset:0;z-index:10;pointer-events:none}
.vig{position:absolute;inset:0;z-index:8;background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 25%,rgba(0,0,0,.12) 60%,rgba(0,0,0,.78) 100%)}
.border{position:absolute;inset:0;border:4px solid rgba(200,128,10,.32);z-index:50;pointer-events:none}
.tag-studio{font-size:12px;letter-spacing:8px;color:rgba(200,128,10,.75);text-transform:uppercase}
.tag-author{font-size:13px;letter-spacing:6px;color:rgba(255,215,0,.8);text-transform:uppercase}
.divline{height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:14px 0}
.war{font-size:72px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(255,24,0,.9),0 0 120px rgba(255,24,0,.4);letter-spacing:6px;line-height:1}
.gods{font-size:86px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(200,128,10,.9),0 0 120px rgba(255,215,0,.3);letter-spacing:8px}
.loc{font-size:14px;letter-spacing:11px;color:rgba(200,128,10,.7);text-transform:uppercase}
.italic{font-style:italic}`;

// Author badge — used everywhere
const AUTHOR_BADGE = `
<div style="position:absolute;top:58px;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:4px;z-index:20">
  <div style="font-size:11px;letter-spacing:7px;color:rgba(200,128,10,.65);text-transform:uppercase;font-family:Georgia">A Game by</div>
  <div style="font-size:26px;font-weight:900;color:rgba(255,215,0,.92);letter-spacing:5px;font-family:Georgia;text-shadow:0 0 30px rgba(200,128,10,.7)">YEIYIES</div>
</div>`;

const FOOTER = (txt='') => `
<div style="position:absolute;bottom:0;left:0;right:0;height:190px;background:linear-gradient(to top,rgba(0,0,0,.98) 0%,rgba(4,2,10,.85) 70%,transparent 100%);z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:54px;gap:6px">
  <div style="font-size:10px;letter-spacing:8px;color:rgba(200,128,10,.6);font-family:Georgia;text-transform:uppercase">Created by &nbsp;·&nbsp; Yeiyies</div>
  ${txt ? `<div style="font-size:12px;font-style:italic;color:rgba(220,190,140,.6);font-family:Georgia;letter-spacing:1px">${txt}</div>` : ''}
</div>`;

// ── shared canvas draw helpers embedded as JS strings ────────────────────
const DRAW_BG = (r1='#120a28',r2='#0a0618',r3='#030109') =>
`const bg=x.createRadialGradient(540,960,0,540,960,1200);
bg.addColorStop(0,'${r1}');bg.addColorStop(.45,'${r2}');bg.addColorStop(1,'${r3}');
x.fillStyle=bg;x.fillRect(0,0,1080,1920);`;

const DRAW_STARS = (n=180,maxY=600) =>
`for(let i=0;i<${n};i++){const sx=Math.random()*1080,sy=Math.random()*${maxY},sv=Math.random();
x.fillStyle=sv>.88?'rgba(255,215,0,'+(sv*.22+.05)+')':'rgba(255,255,255,'+(sv*.13+.02)+')';
x.beginPath();x.ellipse(sx,sy,sv*.85+.2,sv*.85+.2,0,0,Math.PI*2);x.fill();}`;

const DRAW_GROUND_GLOW = (y=1820,col='rgba(255,30,0,.25)') =>
`{const gg=x.createRadialGradient(540,${y},0,540,${y},520);
gg.addColorStop(0,'${col}');gg.addColorStop(1,'transparent');
x.fillStyle=gg;x.fillRect(0,${y-400},1080,500);}`;

const DRAW_AURA = (cx=540,cy=960,r=580,col='rgba(90,60,160,.28)') =>
`{const ag=x.createRadialGradient(${cx},${cy},0,${cx},${cy},${r});
ag.addColorStop(0,'${col}');ag.addColorStop(1,'transparent');
x.fillStyle=ag;x.fillRect(0,0,1080,1920);}`;

const STORY_TITLE_BLOCK = (top=true) => top
  ? `<div style="position:absolute;top:${top===true?160:top}px;left:0;right:0;text-align:center;z-index:20;padding:0 50px">
      <div class="tag-studio" style="margin-bottom:10px">War of the Gods</div>
      <div class="war">WAR OF THE</div>
      <div style="font-size:22px;letter-spacing:14px;color:rgba(255,215,0,.75);margin:6px 0">· · ·</div>
      <div class="gods">GODS</div>
      <div style="width:200px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:16px auto"></div>
      <div class="loc">Tenochtitlan</div>
    </div>`
  : `<div style="position:absolute;bottom:210px;left:0;right:0;text-align:center;z-index:20;padding:0 50px">
      <div class="tag-studio" style="margin-bottom:10px">War of the Gods</div>
      <div class="war">WAR OF THE</div>
      <div style="font-size:22px;letter-spacing:14px;color:rgba(255,215,0,.75);margin:6px 0">· · ·</div>
      <div class="gods">GODS</div>
      <div style="width:200px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:16px auto"></div>
      <div class="loc">Tenochtitlan</div>
    </div>`;

// ── WARRIOR SILHOUETTE (full body) as canvas draw string ─────────────────
const DRAW_WARRIOR = (scale=1,ox=0,oy=0,alpha=1) => {
const s=scale,ax=ox,ay=oy;
return `
// WARRIOR at scale ${s}
x.save();x.translate(${ax},${ay});x.scale(${s},${s});x.globalAlpha=${alpha};
// Cape
x.fillStyle='rgba(14,10,28,.95)';
x.beginPath();x.moveTo(490,380);x.quadraticCurveTo(370,560,345,820);x.quadraticCurveTo(322,1060,360,1320);x.quadraticCurveTo(382,1460,415,1478);x.quadraticCurveTo(444,1488,445,1438);x.quadraticCurveTo(443,1275,450,1055);x.quadraticCurveTo(462,820,482,638);x.quadraticCurveTo(500,490,503,380);x.fill();
// Cape feather trim
['rgba(42,16,96,.7)','rgba(34,16,80,.6)'].forEach((col,fi)=>{
  x.fillStyle=col;
  [450,490,530,568,604][fi%3!==0?'slice':Symbol.iterator]&&[1].forEach(()=>{
    [[-42,680],[-48,740],[-52,800],[-54,860],[-52,918],[-48,976]].forEach(([fx,fy])=>{
      x.beginPath();x.moveTo(fx+380,fy);x.quadraticCurveTo(fx+362,fy+12,fx+360,fy+30);x.quadraticCurveTo(fx+378,fy+22,fx+380,fy);x.fill();
    });
  });
});
// Armor body
const arm=x.createRadialGradient(540,850,0,540,850,360);
arm.addColorStop(0,'#2a2050');arm.addColorStop(.4,'#16102a');arm.addColorStop(1,'#08060f');
x.fillStyle=arm;
x.beginPath();x.moveTo(448,440);x.quadraticCurveTo(420,580,415,760);x.quadraticCurveTo(410,940,422,1140);x.lineTo(440,1140);x.quadraticCurveTo(454,940,460,760);x.lineTo(540,780);x.lineTo(620,760);x.quadraticCurveTo(628,940,640,1140);x.lineTo(658,1140);x.quadraticCurveTo(670,940,665,760);x.quadraticCurveTo(660,580,632,440);x.quadraticCurveTo(596,418,540,416);x.quadraticCurveTo(484,418,448,440);x.fill();
// Legs
x.fillStyle='#1a1435';
x.beginPath();x.moveTo(448,1140);x.quadraticCurveTo(432,1320,425,1520);x.lineTo(460,1520);x.quadraticCurveTo(474,1320,480,1140);x.fill();
x.beginPath();x.moveTo(600,1140);x.quadraticCurveTo(618,1320,625,1520);x.lineTo(660,1520);x.quadraticCurveTo(652,1320,638,1140);x.fill();
// Greaves
x.fillStyle='#1a1435';x.strokeStyle='#5544aa';x.lineWidth=2;
[[425,1300,460,1300],[625,1300,660,1300]].forEach(([lx,ly,rx,ry])=>{
  x.beginPath();x.roundRect(lx,ly,rx-lx,180,4);x.fill();x.stroke();
});
x.strokeStyle='#c8800a';x.lineWidth=2.5;
[[425,1302,460,1302],[625,1302,660,1302],[425,1478,460,1478],[625,1478,660,1478]].forEach(([lx,ly,rx,ry])=>{x.beginPath();x.moveTo(lx,ly);x.lineTo(rx,ly);x.stroke()});
// Belt
x.fillStyle='#16102a';x.strokeStyle='#ffd700';x.lineWidth=3;
x.beginPath();x.moveTo(413,1042);x.lineTo(667,1042);x.lineTo(670,1090);x.quadraticCurveTo(540,1115,410,1090);x.closePath();x.fill();x.stroke();
// Skull belt ornament
x.fillStyle='#e8d8c0';x.strokeStyle='#b0a080';x.lineWidth=1.5;
x.beginPath();x.ellipse(540,1065,17,15,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='#1a0808';[[532,1060],[548,1060]].forEach(([ex,ey])=>{x.beginPath();x.ellipse(ex,ey,3.5,3.5,0,0,Math.PI*2);x.fill()});
// Scale armor
x.fillStyle='#16103a';x.strokeStyle='#5544aa';x.lineWidth=1.3;
[[480,510],[520,500],[560,500],[600,510],[466,548],[504,538],[542,538],[580,538],[618,548],[454,588],[490,578],[528,578],[566,578],[604,578],[640,588]].forEach(([ex,ey])=>{
  x.beginPath();x.ellipse(ex,ey,22,14,0,0,Math.PI*2);x.fill();x.stroke();
});
// Lit scale
x.fillStyle='rgba(200,128,10,.2)';x.strokeStyle='#c8800a';x.lineWidth=1;
x.beginPath();x.ellipse(520,500,22,14,0,0,Math.PI*2);x.fill();x.stroke();
// Chest medallion
x.fillStyle='#08050f';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(540,730,44,44,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='#0d0a1e';x.beginPath();x.ellipse(540,730,35,35,0,0,Math.PI*2);x.fill();
x.setLineDash([7,5]);x.strokeStyle='rgba(150,100,220,.55)';x.lineWidth=1.5;
x.beginPath();x.ellipse(540,730,44,44,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
x.fillStyle='rgba(130,90,200,.55)';x.beginPath();x.ellipse(530,721,7,4,-.4,0,Math.PI*2);x.fill();
// Pauldrons
x.fillStyle='#1a1435';x.strokeStyle='#5544aa';x.lineWidth=2.5;
[[[432,442],[400,472],[382,526],[408,548],[438,532],[455,502],[458,468]],
 [[648,442],[680,472],[698,526],[672,548],[642,532],[625,502],[622,468]]].forEach(pts=>{
  x.beginPath();pts.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.fill();x.stroke();
});
// Jade pauldron inlays
[[408,496],[672,494]].forEach(([ex,ey])=>{
  x.fillStyle='#208040';x.strokeStyle='#10502a';x.lineWidth=2;
  x.beginPath();x.ellipse(ex,ey,18,12,0,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(ex,ey,9,6,0,0,Math.PI*2);x.fill();
});
// Arms
x.fillStyle=arm;x.strokeStyle='rgba(58,40,112,.8)';x.lineWidth=1.5;
x.beginPath();x.moveTo(455,448);x.quadraticCurveTo(406,530,382,615);x.quadraticCurveTo(364,682,378,730);x.quadraticCurveTo(398,755,420,745);x.quadraticCurveTo(448,725,458,685);x.quadraticCurveTo(478,608,480,518);x.closePath();x.fill();x.stroke();
x.beginPath();x.moveTo(625,448);x.quadraticCurveTo(674,530,698,615);x.quadraticCurveTo(716,682,702,730);x.quadraticCurveTo(682,755,660,745);x.quadraticCurveTo(632,725,622,685);x.quadraticCurveTo(602,608,600,518);x.closePath();x.fill();x.stroke();
// Macuahuitl
x.save();x.translate(378,730);x.rotate(-.28);
x.fillStyle='#2a1808';x.strokeStyle='#c8800a';x.lineWidth=2;
x.beginPath();x.roundRect(-14,0,28,120,6);x.fill();x.stroke();
x.fillStyle='#3a2010';x.strokeStyle='#1e1008';x.lineWidth=2;
x.beginPath();x.roundRect(-18,-210,36,218,4);x.fill();x.stroke();
const bg2=x.createLinearGradient(-30,-210,10,-210);
bg2.addColorStop(0,'#c0c0d8');bg2.addColorStop(.3,'#606080');bg2.addColorStop(1,'#0a0a16');
x.fillStyle=bg2;
[-200,-175,-150,-125,-100,-75,-50,-25].forEach(by=>{
  x.beginPath();x.moveTo(-18,by);x.lineTo(-34,by+5);x.lineTo(-32,by+19);x.lineTo(-18,by+15);x.fill();
  x.beginPath();x.moveTo(18,by);x.lineTo(34,by+5);x.lineTo(32,by+19);x.lineTo(18,by+15);x.fill();
});
x.fillStyle='rgba(200,17,0,.5)';x.beginPath();x.ellipse(-33,-170,5,3,0,0,Math.PI*2);x.fill();
x.restore();
// Shield
x.fillStyle='#1a1030';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(705,715,72,72,0,0,Math.PI*2);x.fill();x.stroke();
[56,42,28].forEach(r=>{x.strokeStyle='#c8800a';x.lineWidth=2;x.beginPath();x.ellipse(705,715,r,r,0,0,Math.PI*2);x.stroke()});
x.fillStyle='#08050f';x.strokeStyle='#9966ff';x.lineWidth=2;
x.beginPath();x.ellipse(705,715,20,20,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='rgba(130,90,200,.55)';x.beginPath();x.ellipse(698,708,6,4,-.3,0,Math.PI*2);x.fill();
// Shield feather trim
x.fillStyle='#2a1060';
[0,45,90,135,180,225,270,315].forEach(deg=>{
  const rad=deg*Math.PI/180,fx=705+85*Math.cos(rad),fy=715+85*Math.sin(rad);
  x.beginPath();x.moveTo(fx,fy);x.quadraticCurveTo(fx+12*Math.cos(rad+.5),fy+12*Math.sin(rad+.5),fx+20*Math.cos(rad),fy+20*Math.sin(rad));x.quadraticCurveTo(fx+12*Math.cos(rad-.5),fy+12*Math.sin(rad-.5),fx,fy);x.fill();
});
// HEAD
// Long quetzal feathers
['#0c4018','#0a3814','#0e4818'].forEach((col,fi)=>{
  x.fillStyle=col;x.strokeStyle='#1a6030';x.lineWidth=1;
  [-32,0,32].forEach((ox,oi)=>{
    x.beginPath();x.moveTo(540+ox,220);x.quadraticCurveTo(528+ox,-80+fi*8,533+ox,-165+fi*5);x.quadraticCurveTo(548+ox,-80+fi*8,555+ox,220);x.fill();x.stroke();
  });
});
[-65,-45].forEach(ox=>{
  x.fillStyle='#0c4018';x.strokeStyle='#1a6030';x.lineWidth=1;
  [ox,-ox].forEach(o=>{
    x.beginPath();x.moveTo(540+o,215);x.quadraticCurveTo(528+o,-30,532+o,-95);x.quadraticCurveTo(545+o,-30,552+o,215);x.fill();x.stroke();
  });
});
// Feather tips gold
[-32,0,32].forEach(ox=>{x.fillStyle='rgba(255,215,0,.68)';x.beginPath();x.ellipse(543+ox,-158,8,13,0,0,Math.PI*2);x.fill()});
// Helmet band
x.fillStyle='#120c28';x.strokeStyle='#5544aa';x.lineWidth=3;
x.beginPath();x.ellipse(540,258,80,62,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='#ffd700';x.lineWidth=4;x.beginPath();x.arc(540,258,80,Math.PI,0);x.stroke();
// Jade helmet inlays
[[472,260],[608,260],[540,198]].forEach(([ex,ey],i)=>{
  x.fillStyle=i===2?'#e8d8c0':'#208040';
  x.strokeStyle=i===2?'#b0a080':'#10502a';x.lineWidth=1.5;
  x.beginPath();x.ellipse(ex,ey,i===2?14:9,i===2?12:7,0,0,Math.PI*2);x.fill();x.stroke();
  if(i!==2){x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(ex,ey,4.5,3.5,0,0,Math.PI*2);x.fill();}
});
// Head
x.fillStyle='#6a3218';x.beginPath();x.ellipse(540,360,60,68,0,0,Math.PI*2);x.fill();
// Eye stripe
x.fillStyle='rgba(5,2,14,.9)';x.beginPath();x.roundRect(474,345,132,28,5);x.fill();
// Glowing eyes
[[516,358],[564,358]].forEach(([ex,ey])=>{
  const eg=x.createRadialGradient(ex,ey,0,ex,ey,32);
  eg.addColorStop(0,'rgba(255,24,0,.72)');eg.addColorStop(1,'transparent');
  x.fillStyle=eg;x.beginPath();x.ellipse(ex,ey,32,20,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff2800';x.beginPath();x.ellipse(ex,ey,10,7,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff5522';x.beginPath();x.ellipse(ex,ey,5,3.5,0,0,Math.PI*2);x.fill();
  x.fillStyle='#000';x.beginPath();x.ellipse(ex,ey,2.5,3,0,0,Math.PI*2);x.fill();
});
// Necklace
x.strokeStyle='#1a6010';x.lineWidth=3;
x.beginPath();x.moveTo(480,418);x.quadraticCurveTo(540,445,600,418);x.stroke();
[490,510,540,570,590].forEach((bx,i)=>{
  x.fillStyle=i===2?'#186030':'#208040';x.strokeStyle='#10502a';x.lineWidth=1.5;
  x.beginPath();x.ellipse(bx,i===2?438:430,i===2?13:9,i===2?13:9,0,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(bx,i===2?438:430,i===2?6:4,i===2?6:4,0,0,Math.PI*2);x.fill();
});
// Body aura glow
x.globalAlpha=.22;
const baura=x.createRadialGradient(540,800,0,540,800,380);
baura.addColorStop(0,'#6644aa');baura.addColorStop(1,'transparent');
x.fillStyle=baura;x.fillRect(0,400,1080,900);
x.globalAlpha=${alpha};
// Smoke wisps from eyes
x.strokeStyle='rgba(100,68,170,.35)';x.lineWidth=6;x.lineCap='round';
x.beginPath();x.moveTo(540,250);x.quadraticCurveTo(522,140,528,60);x.stroke();
x.lineWidth=4;x.beginPath();x.moveTo(524,248);x.quadraticCurveTo(500,135,505,52);x.stroke();
x.lineWidth=3;x.beginPath();x.moveTo(558,248);x.quadraticCurveTo(576,135,570,52);x.stroke();
x.restore();`;
};

const STORIES = [

// ── STORY 1: MAIN KEY ART ────────────────────────────────────────────────
{ name: 'IG_Story_01_Key_Art', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;bottom:210px;left:0;right:0;text-align:center;z-index:20;padding:0 48px">
  <div style="font-size:11px;letter-spacing:8px;color:rgba(200,128,10,.7);margin-bottom:12px;font-family:Georgia">War of the Gods</div>
  <div class="war">WAR OF THE</div>
  <div style="font-size:20px;letter-spacing:12px;color:rgba(255,215,0,.75);margin:6px 0">· · ·</div>
  <div class="gods">GODS</div>
  <div style="width:180px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:16px auto"></div>
  <div class="loc">Tenochtitlan</div>
  <div style="margin-top:12px;font-size:14px;font-style:italic;color:rgba(220,190,140,.7);font-family:Georgia;letter-spacing:1px">"The battle begins before the first sword is swung."</div>
</div>
${FOOTER()}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG()}
${DRAW_STARS(200, 550)}
${DRAW_AURA(540, 1100, 700, 'rgba(90,60,160,.32)')}
${DRAW_WARRIOR(1, 0, 0, 1)}
${DRAW_GROUND_GLOW(1840, 'rgba(255,30,0,.28)')}
<\/script></body></html>` },

// ── STORY 2: CHARACTER INTRO ─────────────────────────────────────────────
{ name: 'IG_Story_02_Character_Intro', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:155px;left:0;right:0;text-align:center;z-index:20;padding:0 48px">
  <div style="font-size:10px;letter-spacing:7px;color:rgba(90,90,154,.8);font-family:Georgia;text-transform:uppercase;margin-bottom:6px">Playing as</div>
  <div style="font-size:52px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:4px;text-shadow:0 0 50px rgba(255,24,0,.9)">TEZCATLIPOCA</div>
  <div style="font-size:14px;letter-spacing:6px;color:rgba(255,100,50,.8);font-family:Georgia;font-style:italic">The Smoking Mirror</div>
  <div style="width:150px;height:1px;background:linear-gradient(to right,transparent,rgba(200,128,10,.6),transparent);margin:14px auto"></div>
  <div style="font-size:13px;color:rgba(200,170,130,.7);font-family:Georgia;font-style:italic;line-height:1.8">Agile trickster of the digital cosmos.<br>Moves like obsidian smoke.</div>
</div>
<div style="position:absolute;bottom:480px;left:0;right:0;z-index:20;padding:0 60px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    ${[['Speed','5','#ff2800'],['Jump','4','#c8800a'],['Power','3','#6644aa'],['Weight','2','#208040']].map(([l,v,col])=>`
    <div style="background:rgba(10,6,20,.75);border:1px solid rgba(${col==='#ff2800'?'255,40,0':'200,128,10'},.35);padding:14px 18px">
      <div style="font-size:9px;letter-spacing:5px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase;margin-bottom:8px">${l}</div>
      <div style="height:6px;background:rgba(255,255,255,.06);border:1px solid rgba(200,128,10,.15)">
        <div style="width:${parseInt(v)*20}%;height:100%;background:linear-gradient(to right,rgba(200,128,10,.8),rgba(255,215,0,.9))"></div>
      </div>
      <div style="font-size:18px;font-weight:900;color:rgba(255,215,0,.9);font-family:Georgia;margin-top:6px">${v}<span style="font-size:9px;color:rgba(200,128,10,.5)">/5</span></div>
    </div>`).join('')}
  </div>
  <div style="margin-top:18px;background:rgba(10,6,20,.75);border:1px solid rgba(200,128,10,.35);padding:14px 20px;text-align:center">
    <div style="font-size:9px;letter-spacing:6px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase">Signature Move</div>
    <div style="font-size:20px;font-weight:900;color:rgba(255,215,0,.9);font-family:Georgia;letter-spacing:3px;margin-top:4px">✦ SHADOW DASH ✦</div>
  </div>
</div>
${FOOTER('"Shadow rises!"')}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#160a2a','#0c0620','#040110')}
${DRAW_STARS(160, 400)}
${DRAW_AURA(540, 900, 620, 'rgba(100,50,180,.3)')}
${DRAW_WARRIOR(0.82, 95, 200, 0.95)}
${DRAW_GROUND_GLOW(1830, 'rgba(255,24,0,.22)')}
<\/script></body></html>` },

// ── STORY 3: LORE / STORY ───────────────────────────────────────────────
{ name: 'IG_Story_03_Lore', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:152px;left:0;right:0;text-align:center;padding:0 60px;z-index:20">
  <div style="font-size:10px;letter-spacing:7px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase;margin-bottom:10px">The Lore</div>
  <div style="font-size:46px;font-weight:900;color:#fff;font-family:Georgia;line-height:1.1;text-shadow:0 0 50px rgba(255,24,0,.6);letter-spacing:2px">THE FIFTH SUN<br>DID NOT END<br><span style="color:rgba(255,215,0,.9)">IN FIRE</span><br>OR FLOOD.</div>
</div>
<div style="position:absolute;top:640px;left:0;right:0;padding:0 60px;z-index:20">
  <div style="width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(255,24,0,.5),transparent);margin-bottom:28px"></div>
  <div style="font-size:15px;color:rgba(200,175,140,.72);font-family:Georgia;font-style:italic;line-height:2;text-align:center">It ended when reality itself was compressed.<br>The Mexica cosmos was uploaded into<br><span style="color:rgba(255,215,0,.75)">the Humoformic Grid</span> — a vast obsidian network.</div>
</div>
<div style="position:absolute;top:880px;left:0;right:0;padding:0 60px;z-index:20">
  <div style="width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(200,128,10,.4),transparent);margin-bottom:28px"></div>
  <div style="font-size:15px;color:rgba(180,155,120,.65);font-family:Georgia;font-style:italic;line-height:2;text-align:center">Mountains became data.<br>Rivers became bandwidth.<br>Gods became code.</div>
</div>
<div style="position:absolute;top:1120px;left:0;right:0;padding:0 60px;z-index:20">
  <div style="width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(200,128,10,.35),transparent);margin-bottom:28px"></div>
  <div style="font-size:13px;color:rgba(160,130,100,.58);font-family:Georgia;font-style:italic;line-height:1.9;text-align:center">In this new age, power belongs<br>to whoever can navigate the Grid<br>with <span style="color:rgba(200,128,10,.7)">divine clarity.</span></div>
</div>
<div style="position:absolute;top:1380px;left:0;right:0;text-align:center;padding:0 60px;z-index:20">
  <div style="font-size:32px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:4px;text-shadow:0 0 40px rgba(200,128,10,.7)">WAR OF THE GODS</div>
  <div style="font-size:12px;letter-spacing:9px;color:rgba(200,128,10,.65);font-family:Georgia;margin-top:6px;text-transform:uppercase">Tenochtitlan</div>
</div>
${FOOTER()}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#0e0820','#080518','#030109')}
// Grid texture
x.strokeStyle='rgba(90,90,154,.045)';x.lineWidth=.5;
for(let i=0;i<1080;i+=48){x.beginPath();x.moveTo(i,0);x.lineTo(i,1920);x.stroke();}
for(let i=0;i<1920;i+=48){x.beginPath();x.moveTo(0,i);x.lineTo(1080,i);x.stroke();}
${DRAW_STARS(120, 350)}
// Smoke mirror watermark
x.globalAlpha=.055;x.strokeStyle='rgba(100,68,170,1)';
[220,180,140,100].forEach(r=>{x.lineWidth=r>160?3:1.5;x.beginPath();x.ellipse(540,1680,r,r,0,0,Math.PI*2);x.stroke();});
x.globalAlpha=1;
// Circuit lines
x.strokeStyle='rgba(90,90,154,.1)';x.lineWidth=1;
[[120,300,280,420],[280,420,480,380],[480,380,680,500],[80,650,200,720],[200,720,400,680],[800,400,920,520],[920,520,1020,480]].forEach(([x1,y1,x2,y2])=>{
  x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();
  x.fillStyle='rgba(90,90,154,.15)';x.beginPath();x.ellipse(x2,y2,4,4,0,0,Math.PI*2);x.fill();
});
const bottom=x.createLinearGradient(0,1600,0,1920);
bottom.addColorStop(0,'transparent');bottom.addColorStop(1,'rgba(0,0,0,.98)');
x.fillStyle=bottom;x.fillRect(0,1600,1080,320);
<\/script></body></html>` },

// ── STORY 4: ROSTER TEASER ───────────────────────────────────────────────
{ name: 'IG_Story_04_Roster', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:148px;left:0;right:0;text-align:center;padding:0 48px;z-index:20">
  <div style="font-size:11px;letter-spacing:8px;color:rgba(200,128,10,.7);font-family:Georgia;text-transform:uppercase;margin-bottom:10px">Choose Your God</div>
  <div style="font-size:54px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:5px;text-shadow:0 0 50px rgba(200,128,10,.8)">17 GODS</div>
  <div style="font-size:13px;letter-spacing:8px;color:rgba(255,215,0,.7);font-family:Georgia;margin-top:4px">ONE DESTINY</div>
</div>
<div style="position:absolute;top:1450px;left:0;right:0;text-align:center;z-index:20;padding:0 48px">
  <div style="font-size:30px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:3px;text-shadow:0 0 40px rgba(255,24,0,.8)">WAR OF THE GODS</div>
  <div style="font-size:11px;letter-spacing:8px;color:rgba(200,128,10,.65);font-family:Georgia;margin-top:6px">Tenochtitlan · The Digital Descent</div>
</div>
${FOOTER('"The battle begins before the first sword is swung."')}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#080518','#060414','#030109')}
${DRAW_STARS(160, 350)}
// Ground
const gg=x.createLinearGradient(0,1350,0,1920);
gg.addColorStop(0,'transparent');gg.addColorStop(.5,'rgba(200,80,10,.1)');gg.addColorStop(1,'rgba(255,30,0,.06)');
x.fillStyle=gg;x.fillRect(0,1350,1080,570);
x.strokeStyle='rgba(200,100,10,.25)';x.lineWidth=1;
x.beginPath();x.moveTo(0,1390);x.lineTo(1080,1390);x.stroke();
// 17 gods in a grid: 3 rows of silhouettes
const gods=[
  {col:'#ff1800',h:240},{col:'#e8b800',h:200},{col:'#ffd700',h:220},{col:'#00aaff',h:210},
  {col:'#ff4444',h:195},{col:'#80c020',h:215},{col:'#00e8c0',h:200},{col:'#cc2200',h:235},
  {col:'#cc66ff',h:200},{col:'#ffb800',h:228},{col:'#4499ff',h:215},{col:'#ccccff',h:195},
  {col:'#00ffcc',h:205},{col:'#88cc44',h:238},{col:'#ff44aa',h:200},{col:'#ff88bb',h:205},
  {col:'#ffcc44',h:212}
];
const cols=4,startX=108,startY=320,cellW=216,rowH=340;
gods.forEach((g,i)=>{
  const col=i%cols,row=Math.floor(i/cols);
  const gx=startX+col*cellW,gy=startY+row*rowH;
  const isTezcat=i===0,h=g.h;
  // Glow
  const hexR=parseInt(g.col.slice(1,3),16),hexG=parseInt(g.col.slice(3,5),16),hexB=parseInt(g.col.slice(5,7),16);
  const glow=x.createRadialGradient(gx,gy,0,gx,gy,90);
  glow.addColorStop(0,'rgba('+hexR+','+hexG+','+hexB+',.22)');glow.addColorStop(1,'transparent');
  x.fillStyle=glow;x.fillRect(gx-90,gy-h,180,h+20);
  // Body
  x.fillStyle=isTezcat?'rgba(22,14,42,.9)':'rgba(12,8,24,.75)';
  // Head
  x.beginPath();x.ellipse(gx,gy-h*.83,isTezcat?24:18,isTezcat?28:22,0,0,Math.PI*2);x.fill();
  // Feather (tezcat only, simpler)
  if(isTezcat){
    x.fillStyle='#0c4018';[-15,0,15].forEach(ox=>{x.beginPath();x.moveTo(gx+ox,gy-h*.84);x.quadraticCurveTo(gx+ox-8,gy-h*1.18,gx+ox-5,gy-h*1.32);x.quadraticCurveTo(gx+ox+6,gy-h*1.18,gx+ox+10,gy-h*.84);x.fill()});
  }
  x.fillStyle=isTezcat?'rgba(22,14,42,.9)':'rgba(12,8,24,.75)';
  // Torso
  x.beginPath();x.moveTo(gx-26,gy-h*.72);x.quadraticCurveTo(gx-28,gy-h*.5,gx-24,gy-h*.2);x.lineTo(gx-16,gy);x.lineTo(gx+16,gy);x.quadraticCurveTo(gx+24,gy-h*.2,gx+28,gy-h*.5);x.quadraticCurveTo(gx+26,gy-h*.72,gx+24,gy-h*.78);x.quadraticCurveTo(gx,gy-h*.82,gx-26,gy-h*.72);x.fill();
  // Eye glow
  const eyeG=x.createRadialGradient(gx,gy-h*.84,0,gx,gy-h*.84,isTezcat?20:14);
  eyeG.addColorStop(0,'rgba('+hexR+','+hexG+','+hexB+',.75)');eyeG.addColorStop(1,'transparent');
  x.fillStyle=eyeG;x.beginPath();x.ellipse(gx,gy-h*.84,isTezcat?20:14,isTezcat?13:9,0,0,Math.PI*2);x.fill();
  const eo=isTezcat?6:4;
  x.fillStyle=g.col;x.globalAlpha=isTezcat?1:.9;
  [[gx-eo,gy-h*.84],[gx+eo,gy-h*.84]].forEach(([ex,ey])=>{x.beginPath();x.ellipse(ex,ey,isTezcat?3.5:2.5,isTezcat?2.5:1.8,0,0,Math.PI*2);x.fill()});
  x.globalAlpha=1;
  // Ground shadow
  x.fillStyle='rgba(0,0,0,.25)';x.beginPath();x.ellipse(gx,gy,isTezcat?32:24,6,0,0,Math.PI*2);x.fill();
  // Chest glow (tezcat)
  if(isTezcat){
    x.strokeStyle='rgba(100,68,170,.6)';x.lineWidth=1.5;
    x.setLineDash([4,3]);x.beginPath();x.ellipse(gx,gy-h*.5,24,24,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
  }
  // Name
  x.fillStyle=isTezcat?'rgba(255,215,0,.8)':'rgba(200,128,10,.5)';
  x.font=(isTezcat?10:8)+'px Georgia';x.textAlign='center';
  const godNames=['TEZCAT','QUETZ','HUITZIL','TLALOC','XIPE','COATL','CHALCHI','MICTLAN','MICTECA','TONATI','XOLOTL','COYO','OMETE','TLALT','TLAZO','XOCHI','XOQUET'];
  x.fillText(godNames[i],gx,gy+16);
});
// Center aura
x.globalAlpha=.1;
const ca=x.createRadialGradient(540,880,0,540,880,500);
ca.addColorStop(0,'#6644aa');ca.addColorStop(1,'transparent');
x.fillStyle=ca;x.fillRect(0,0,1080,1920);
x.globalAlpha=1;
<\/script></body></html>` },

// ── STORY 5: QUOTE / MANIFESTO ──────────────────────────────────────────
{ name: 'IG_Story_05_Quote', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 70px;z-index:20;text-align:center">
  <div style="font-size:80px;color:rgba(200,128,10,.7);line-height:1;margin-bottom:20px">"</div>
  <div style="font-size:34px;font-weight:900;color:#fff;font-family:Georgia;line-height:1.4;letter-spacing:2px;text-shadow:0 0 50px rgba(255,24,0,.5)">THE BATTLE BEGINS BEFORE THE FIRST SWORD IS SWUNG.</div>
  <div style="font-size:80px;color:rgba(200,128,10,.7);line-height:1;margin-top:10px">"</div>
  <div style="width:160px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:28px 0"></div>
  <div style="font-size:12px;letter-spacing:6px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase">Tezcatlipoca</div>
  <div style="font-size:11px;font-style:italic;color:rgba(160,130,100,.55);font-family:Georgia;margin-top:6px;letter-spacing:2px">War of the Gods: Tenochtitlan</div>
  <div style="margin-top:50px;background:rgba(10,6,20,.7);border:1px solid rgba(200,128,10,.35);padding:14px 32px">
    <div style="font-size:10px;letter-spacing:7px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase">Signature Move</div>
    <div style="font-size:22px;font-weight:900;color:rgba(255,215,0,.88);font-family:Georgia;letter-spacing:3px;margin-top:5px">✦ SHADOW DASH ✦</div>
  </div>
</div>
${FOOTER()}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#0e0820','#080518','#030109')}
${DRAW_STARS(200, 1920)}
${DRAW_AURA(540, 960, 700, 'rgba(80,40,150,.25)')}
// Smoke mirror concentric
x.globalAlpha=.06;x.strokeStyle='rgba(100,68,170,1)';
[380,320,260,200,140].forEach(r=>{x.lineWidth=r>280?3:1.5;x.beginPath();x.ellipse(540,960,r,r,0,0,Math.PI*2);x.stroke()});
x.globalAlpha=1;
// Left obsidian smoke stripe
const ls=x.createLinearGradient(0,0,200,1920);
ls.addColorStop(0,'rgba(22,10,42,.7)');ls.addColorStop(.5,'rgba(14,8,28,.4)');ls.addColorStop(1,'rgba(10,6,20,.7)');
x.fillStyle=ls;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(120,300,100,600);x.quadraticCurveTo(80,900,110,1200);x.quadraticCurveTo(130,1500,0,1920);x.fill();
// Right stripe
const rs=x.createLinearGradient(1080,0,880,1920);
rs.addColorStop(0,'rgba(22,10,42,.7)');rs.addColorStop(.5,'rgba(14,8,28,.4)');rs.addColorStop(1,'rgba(10,6,20,.7)');
x.fillStyle=rs;x.beginPath();x.moveTo(1080,0);x.quadraticCurveTo(960,300,980,600);x.quadraticCurveTo(1000,900,970,1200);x.quadraticCurveTo(950,1500,1080,1920);x.fill();
<\/script></body></html>` },

// ── STORY 6: CREATOR SPOTLIGHT ───────────────────────────────────────────
{ name: 'IG_Story_06_Creator', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;text-align:center;padding:0 70px">
  <div style="font-size:10px;letter-spacing:9px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase;margin-bottom:22px">Indie Game · 2025</div>
  <div style="width:90px;height:90px;border:2px solid rgba(200,128,10,.5);display:flex;align-items:center;justify-content:center;margin-bottom:22px">
    <div style="font-size:52px;text-shadow:0 0 30px rgba(255,24,0,.8)">𓂀</div>
  </div>
  <div style="font-size:13px;letter-spacing:6px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase;margin-bottom:10px">Created &amp; Designed by</div>
  <div style="font-size:88px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:8px;text-shadow:0 0 80px rgba(200,128,10,.9),0 0 140px rgba(255,215,0,.4);line-height:1">YEIYIES</div>
  <div style="width:240px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:24px auto"></div>
  <div style="font-size:28px;font-weight:900;color:rgba(255,255,255,.9);font-family:Georgia;letter-spacing:4px;text-shadow:0 0 40px rgba(255,24,0,.7)">WAR OF THE GODS</div>
  <div style="font-size:12px;letter-spacing:9px;color:rgba(200,128,10,.65);font-family:Georgia;margin-top:8px;text-transform:uppercase">Tenochtitlan</div>
  <div style="width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(200,128,10,.35),transparent);margin:28px 0"></div>
  <div style="font-size:14px;color:rgba(200,175,140,.7);font-family:Georgia;font-style:italic;line-height:1.9">One creator. 17 gods. A complete<br>Aztec mythology fighting game<br>with story mode, lore &amp; original music.</div>
  <div style="margin-top:32px;display:flex;gap:20px">
    <div style="border:1px solid rgba(200,128,10,.4);padding:8px 20px;font-size:10px;letter-spacing:5px;color:rgba(200,128,10,.75);font-family:Georgia;text-transform:uppercase">Browser</div>
    <div style="border:1px solid rgba(200,128,10,.4);padding:8px 20px;font-size:10px;letter-spacing:5px;color:rgba(200,128,10,.75);font-family:Georgia;text-transform:uppercase">Mobile</div>
    <div style="border:1px solid rgba(200,128,10,.4);padding:8px 20px;font-size:10px;letter-spacing:5px;color:rgba(200,128,10,.75);font-family:Georgia;text-transform:uppercase">Desktop</div>
  </div>
</div>
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#100820','#080518','#030109')}
${DRAW_STARS(180, 1920)}
// Gold particle shower
x.fillStyle='rgba(200,128,10,.25)';
for(let i=0;i<60;i++){
  const px=Math.random()*1080,py=Math.random()*1920,ps=Math.random()*3+1;
  x.globalAlpha=Math.random()*.2+.05;
  x.beginPath();x.ellipse(px,py,ps,ps,0,0,Math.PI*2);x.fill();
}
x.globalAlpha=1;
// Sun corona
x.globalAlpha=.05;
[480,400,320,240].forEach(r=>{
  x.strokeStyle='rgba(200,128,10,1)';x.lineWidth=r>350?3:1.5;
  x.beginPath();x.ellipse(540,960,r,r,0,0,Math.PI*2);x.stroke();
});
x.globalAlpha=1;
// Center aura warm
const ca=x.createRadialGradient(540,960,0,540,960,550);
ca.addColorStop(0,'rgba(200,80,10,.18)');ca.addColorStop(.4,'rgba(150,60,10,.08)');ca.addColorStop(1,'transparent');
x.fillStyle=ca;x.fillRect(0,0,1080,1920);
// Aztec step-fret corners
x.strokeStyle='rgba(200,128,10,.35)';x.lineWidth=2;x.fillStyle='transparent';
[[0,0,1],[1080,0,-1],[0,1920,1],[1080,1920,-1]].forEach(([cx,cy,dir])=>{
  const d=dir,s=Math.sign(cy===0?1:-1);
  x.beginPath();
  x.moveTo(cx+d*8,cy+s*8);x.lineTo(cx+d*68,cy+s*8);x.lineTo(cx+d*68,cy+s*22);x.lineTo(cx+d*22,cy+s*22);x.lineTo(cx+d*22,cy+s*68);x.lineTo(cx+d*8,cy+s*68);x.closePath();
  x.stroke();
});
<\/script></body></html>` },

// ── STORY 7: GAMEPLAY CALL-TO-ACTION ────────────────────────────────────
{ name: 'IG_Story_07_Play_Now', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:152px;left:0;right:0;text-align:center;padding:0 56px;z-index:20">
  <div style="font-size:11px;letter-spacing:8px;color:rgba(200,128,10,.7);font-family:Georgia;text-transform:uppercase;margin-bottom:12px">Now Available</div>
  <div style="font-size:62px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:5px;text-shadow:0 0 60px rgba(255,24,0,.9)">WAR OF<br>THE GODS</div>
  <div style="font-size:13px;letter-spacing:8px;color:rgba(200,128,10,.65);font-family:Georgia;margin-top:8px">Tenochtitlan</div>
</div>
<div style="position:absolute;top:620px;left:0;right:0;padding:0 60px;z-index:20;display:flex;flex-direction:column;gap:14px">
  ${[['20','Epic Battles'],['17','Aztec Gods'],['5','Acts of Story'],['3','Difficulty Levels']].map(([n,l])=>`
  <div style="display:flex;align-items:center;gap:20px;background:rgba(10,6,20,.72);border:1px solid rgba(200,128,10,.28);padding:16px 24px">
    <div style="font-size:38px;font-weight:900;color:rgba(255,215,0,.9);font-family:Georgia;min-width:64px">${n}</div>
    <div style="width:1px;height:38px;background:rgba(200,128,10,.35)"></div>
    <div style="font-size:14px;letter-spacing:4px;color:rgba(200,170,130,.75);font-family:Georgia;text-transform:uppercase">${l}</div>
  </div>`).join('')}
</div>
<div style="position:absolute;top:1100px;left:0;right:0;padding:0 60px;z-index:20">
  <div style="width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(255,24,0,.5),transparent);margin-bottom:28px"></div>
  <div style="font-size:13px;color:rgba(200,170,130,.65);font-family:Georgia;font-style:italic;line-height:1.9;text-align:center">Story Mode · VS Mode · Lore Library<br>Original Aztec Ceremonial Music<br><span style="color:rgba(255,215,0,.7)">Free to Play · No Download Required</span></div>
</div>
<div style="position:absolute;top:1380px;left:50%;transform:translateX(-50%);z-index:20;white-space:nowrap">
  <div style="background:linear-gradient(135deg,rgba(200,80,10,.9),rgba(255,24,0,.85));border:1px solid rgba(255,215,0,.5);padding:20px 60px;font-size:20px;font-weight:900;color:#fff;font-family:Georgia;letter-spacing:8px;text-transform:uppercase;text-shadow:0 0 20px rgba(255,24,0,.8)">PLAY FREE NOW</div>
</div>
${FOOTER('By Yeiyies · Browser / Mobile / Desktop')}
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#120a28','#0a0618','#040110')}
${DRAW_STARS(150, 450)}
${DRAW_AURA(540, 950, 650, 'rgba(90,50,160,.28)')}
${DRAW_WARRIOR(0.75, 140, 310, 0.85)}
${DRAW_GROUND_GLOW(1820, 'rgba(255,24,0,.22)')}
<\/script></body></html>` },

// ── STORY 8: TITLE CARD / CINEMATIC ─────────────────────────────────────
{ name: 'IG_Story_08_Title_Cinematic', html: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>${BASE}</style></head><body>
<canvas id="c" width="${W}" height="${H}"></canvas>
${AUTHOR_BADGE}
<div style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20;text-align:center;padding:0 60px">
  <div style="font-size:72px;margin-bottom:20px;text-shadow:0 0 50px rgba(255,24,0,.9);filter:drop-shadow(0 0 20px rgba(255,24,0,.5))">𓂀</div>
  <div style="font-size:11px;letter-spacing:10px;color:rgba(200,128,10,.65);font-family:Georgia;text-transform:uppercase;margin-bottom:18px">Digital Aztec Combat</div>
  <div style="font-size:74px;font-weight:900;color:#fff;font-family:Georgia;text-shadow:0 0 70px rgba(255,24,0,.9),0 0 130px rgba(255,24,0,.4);letter-spacing:5px;line-height:1">WAR OF<br>THE</div>
  <div style="font-size:92px;font-weight:900;color:#fff;font-family:Georgia;text-shadow:0 0 70px rgba(200,128,10,.9),0 0 130px rgba(255,215,0,.35);letter-spacing:9px;margin-top:-8px">GODS</div>
  <div style="width:220px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:24px auto"></div>
  <div style="font-size:14px;letter-spacing:10px;color:rgba(200,128,10,.7);font-family:Georgia;text-transform:uppercase">Tenochtitlan</div>
  <div style="font-size:12px;font-style:italic;color:rgba(220,190,140,.55);font-family:Georgia;margin-top:10px;letter-spacing:1.5px">"The battle begins before the first sword is swung."</div>
  <div style="margin-top:50px;display:flex;flex-direction:column;align-items:center;gap:8px">
    <div style="font-size:10px;letter-spacing:8px;color:rgba(200,128,10,.55);font-family:Georgia;text-transform:uppercase">A Game by</div>
    <div style="font-size:36px;font-weight:900;color:rgba(255,215,0,.85);font-family:Georgia;letter-spacing:6px;text-shadow:0 0 30px rgba(200,128,10,.6)">YEIYIES</div>
  </div>
</div>
<div style="position:absolute;bottom:0;left:0;right:0;height:160px;background:linear-gradient(to top,rgba(0,0,0,.98),transparent);z-index:18"></div>
<div class="vig"></div><div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
${DRAW_BG('#100828','#080518','#030109')}
${DRAW_STARS(260, 1920)}
// Aztec calendar sun corona
x.globalAlpha=.055;
[500,420,340,260,180].forEach(r=>{
  x.strokeStyle=r>300?'rgba(200,128,10,1)':'rgba(255,24,0,1)';
  x.lineWidth=r>380?3:r>260?1.5:1;
  x.beginPath();x.ellipse(540,960,r,r,0,0,Math.PI*2);x.stroke();
});
// Rotating tick marks on outer ring
x.strokeStyle='rgba(200,128,10,1)';x.lineWidth=2;
for(let i=0;i<20;i++){
  const a=i*Math.PI/10,r1=495,r2=510;
  x.beginPath();x.moveTo(540+r1*Math.cos(a),960+r1*Math.sin(a));x.lineTo(540+r2*Math.cos(a),960+r2*Math.sin(a));x.stroke();
}
x.globalAlpha=1;
// Smoke column left
const sl=x.createLinearGradient(0,0,220,1920);
sl.addColorStop(0,'rgba(22,10,42,.65)');sl.addColorStop(.5,'rgba(14,8,28,.35)');sl.addColorStop(1,'rgba(8,5,18,.65)');
x.fillStyle=sl;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(140,350,120,700);x.quadraticCurveTo(100,1050,130,1400);x.quadraticCurveTo(150,1680,0,1920);x.fill();
// Smoke column right
const sr=x.createLinearGradient(1080,0,860,1920);
sr.addColorStop(0,'rgba(22,10,42,.65)');sr.addColorStop(.5,'rgba(14,8,28,.35)');sr.addColorStop(1,'rgba(8,5,18,.65)');
x.fillStyle=sr;x.beginPath();x.moveTo(1080,0);x.quadraticCurveTo(940,350,960,700);x.quadraticCurveTo(980,1050,950,1400);x.quadraticCurveTo(930,1680,1080,1920);x.fill();
// Aztec dot border
x.fillStyle='rgba(200,128,10,.22)';
for(let i=70;i<1010;i+=70){x.beginPath();x.ellipse(i,22,3,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(i,1898,3,3,0,0,Math.PI*2);x.fill();}
for(let i=70;i<1850;i+=70){x.beginPath();x.ellipse(22,i,3,3,0,0,Math.PI*2);x.fill();x.beginPath();x.ellipse(1058,i,3,3,0,0,Math.PI*2);x.fill();}
// Center aura
const ca=x.createRadialGradient(540,960,0,540,960,600);
ca.addColorStop(0,'rgba(100,50,180,.22)');ca.addColorStop(.5,'rgba(70,30,140,.1)');ca.addColorStop(1,'transparent');
x.fillStyle=ca;x.fillRect(0,0,1080,1920);
<\/script></body></html>` },

];

async function run() {
  const browser = await chromium.launch();
  console.log('Generating 8 Instagram Stories for War of the Gods...\n');
  for (const s of STORIES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(s.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    const out = path.join(OUT, s.name + '.png');
    await page.screenshot({ path: out, fullPage: false });
    await page.close();
    console.log('  ✓', s.name + '.png');
  }
  await browser.close();
  console.log('\nAll 8 stories saved to:\n' + OUT);
}
run().catch(e => { console.error(e); process.exit(1); });
