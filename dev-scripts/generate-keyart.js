// run: node generate-keyart.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT = path.join(process.env.HOME, 'Desktop', 'War of the Gods — Key Art');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const IMAGES = [

// ── 1. MAIN KEY ART POSTER ──────────────────────────────────────────────────
{ name: '01_Key_Art_Poster', w: 1200, h: 1600, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;width:1200px;height:1600px;overflow:hidden;font-family:'Georgia',serif}
.p{position:absolute;width:1200px;height:1600px;overflow:hidden}
.bg{background:radial-gradient(ellipse 100% 100% at 50% 40%,#110820 0%,#05030f 60%,#020109 100%)}
.split{position:absolute;left:599px;top:0;bottom:0;width:3px;background:linear-gradient(to bottom,transparent,rgba(255,215,0,.6) 30%,rgba(255,24,0,1) 50%,rgba(255,215,0,.6) 70%,transparent);z-index:20}
.left{position:absolute;left:0;top:0;width:600px;height:1600px;background:radial-gradient(ellipse 90% 70% at 65% 40%,rgba(200,120,40,.22) 0%,rgba(90,40,10,.1) 40%,transparent 70%)}
.right{position:absolute;right:0;top:0;width:600px;height:1600px;background:radial-gradient(ellipse 80% 90% at 50% 55%,rgba(90,90,154,.18) 0%,transparent 70%)}
.face{position:absolute;left:20px;top:100px;font-size:0}
.title{position:absolute;bottom:240px;left:0;right:0;text-align:center;color:#fff}
.pre{font-size:13px;letter-spacing:9px;color:rgba(200,128,10,.8);text-transform:uppercase;margin-bottom:10px}
.war{font-size:90px;font-weight:900;font-family:'Georgia',serif;text-shadow:0 0 60px rgba(255,24,0,.9),0 0 120px rgba(255,24,0,.4);line-height:1;letter-spacing:6px}
.of{font-size:28px;letter-spacing:16px;color:rgba(255,215,0,.8);margin:6px 0}
.gods{font-size:102px;font-weight:900;font-family:'Georgia',serif;text-shadow:0 0 60px rgba(200,128,10,.9),0 0 120px rgba(255,215,0,.3);letter-spacing:8px}
.loc{font-size:16px;letter-spacing:14px;color:rgba(200,128,10,.7);margin-top:14px}
.line{width:280px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:18px auto}
.tag{font-size:15px;font-style:italic;color:rgba(220,200,160,.8);letter-spacing:1px}
.bar{position:absolute;bottom:0;left:0;right:0;height:220px;background:linear-gradient(to top,rgba(0,0,0,.98),transparent);z-index:30;display:flex;align-items:flex-end;justify-content:space-between;padding:0 60px 48px}
.plat{border:1px solid rgba(200,128,10,.5);padding:6px 18px;font-family:Georgia;font-size:11px;letter-spacing:4px;color:rgba(200,128,10,.8);display:inline-block;margin:0 6px}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 85% at 50% 50%,transparent 35%,rgba(0,0,0,.25) 65%,rgba(0,0,0,.8) 100%);z-index:40;pointer-events:none}
.border{position:absolute;inset:0;border:3px solid rgba(200,128,10,.35);z-index:50;pointer-events:none}
.corner{position:absolute;width:70px;height:70px}
.corner svg{width:70px;height:70px}
</style></head><body>
<div class="p bg">
  <!-- LEFT: face rendering via canvas -->
  <div class="left"></div>
  <div class="right"></div>
  <canvas id="fc" width="600" height="1600" style="position:absolute;left:0;top:0;z-index:5"></canvas>
  <canvas id="bc" width="600" height="1600" style="position:absolute;left:600px;top:0;z-index:5"></canvas>
  <div class="split"></div>
  <div class="title">
    <div class="pre">Pixel Agents Studio &nbsp;·&nbsp; Presents</div>
    <div class="war">WAR OF THE</div>
    <div class="of">· · ·</div>
    <div class="gods">GODS</div>
    <div class="loc">Tenochtitlan &nbsp;·&nbsp; The Digital Descent</div>
    <div class="line"></div>
    <div class="tag">"The battle begins before the first sword is swung."</div>
  </div>
  <div class="bar">
    <div style="color:rgba(200,128,10,.7);font-family:Georgia;font-size:10px;letter-spacing:4px">M &nbsp;MATURE 17+</div>
    <div><span class="plat">Browser</span><span class="plat">Mobile</span><span class="plat">Desktop</span></div>
    <div style="color:rgba(255,215,0,.8);font-family:Georgia;font-size:18px;letter-spacing:4px;text-align:right">2025<br><span style="font-size:10px;color:rgba(200,128,10,.6);letter-spacing:6px">AVAILABLE NOW</span></div>
  </div>
  <div class="vig"></div>
  <div class="border"></div>
</div>
<script>
// Face canvas
(function(){
const c=document.getElementById('fc'),x=c.getContext('2d');
// Dark gradient bg
const bg=x.createRadialGradient(390,550,20,390,550,600);
bg.addColorStop(0,'#1a1030');bg.addColorStop(.4,'#0e0820');bg.addColorStop(1,'#04020a');
x.fillStyle=bg;x.fillRect(0,0,600,1600);
// Warm side light
const wl=x.createRadialGradient(520,500,0,520,500,400);
wl.addColorStop(0,'rgba(200,120,30,.25)');wl.addColorStop(1,'transparent');
x.fillStyle=wl;x.fillRect(0,0,600,1600);
// FACE BASE
x.save();x.beginPath();x.ellipse(320,560,210,260,0,0,Math.PI*2);x.clip();
const skin=x.createRadialGradient(390,480,10,350,520,300);
skin.addColorStop(0,'#c8844a');skin.addColorStop(.2,'#a06030');skin.addColorStop(.5,'#5a2e14');skin.addColorStop(.8,'#2a1008');skin.addColorStop(1,'#100408');
x.fillStyle=skin;x.fillRect(0,200,600,900);x.restore();
// Black eye band
x.fillStyle='rgba(5,2,14,.88)';x.beginPath();x.roundRect(110,490,440,80,8);x.fill();
// Eyes - red ember
function eye(ex,ey){
  x.save();
  const eg=x.createRadialGradient(ex,ey,0,ex,ey,40);
  eg.addColorStop(0,'#ff2200');eg.addColorStop(.3,'#cc1800');eg.addColorStop(.6,'#550800');eg.addColorStop(1,'rgba(0,0,0,0)');
  x.globalAlpha=.8;x.fillStyle=eg;x.beginPath();x.ellipse(ex,ey,40,26,0,0,Math.PI*2);x.fill();
  x.globalAlpha=1;
  x.fillStyle='#0c0408';x.beginPath();x.ellipse(ex,ey,30,19,0,0,Math.PI*2);x.fill();
  x.fillStyle='#cc1800';x.beginPath();x.ellipse(ex,ey,20,13,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff2800';x.beginPath();x.ellipse(ex,ey,11,9,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff5522';x.beginPath();x.ellipse(ex,ey,5,4.5,0,0,Math.PI*2);x.fill();
  x.fillStyle='#000';x.beginPath();x.ellipse(ex,ey,3,3.5,0,0,Math.PI*2);x.fill();
  x.fillStyle='rgba(255,180,100,.5)';x.beginPath();x.ellipse(ex-4,ey-3,2.5,2,0,0,Math.PI*2);x.fill();
  x.restore();
}
eye(205,530);eye(435,525);
// Blood tear
x.strokeStyle='rgba(200,17,0,.7)';x.lineWidth=3;x.lineCap='round';
x.beginPath();x.moveTo(435,548);x.quadraticCurveTo(438,570,434,590);x.stroke();
x.fillStyle='rgba(200,17,0,.65)';x.beginPath();x.ellipse(434,595,4,5,0,0,Math.PI*2);x.fill();
// Nose shadow
x.fillStyle='rgba(5,2,10,.5)';x.beginPath();x.ellipse(290,650,7,3,-.3,0,Math.PI*2);x.fill();
// Lips
x.fillStyle='#5a2015';
x.beginPath();x.moveTo(225,720);x.quadraticCurveTo(320,740,420,720);x.quadraticCurveTo(395,750,320,755);x.quadraticCurveTo(250,750,225,720);x.fill();
x.strokeStyle='rgba(10,2,4,.8)';x.lineWidth=2;
x.beginPath();x.moveTo(225,720);x.quadraticCurveTo(320,715,420,720);x.stroke();
// Sweat
x.strokeStyle='rgba(180,110,60,.5)';x.lineWidth=2.5;x.lineCap='round';
x.beginPath();x.moveTo(415,455);x.quadraticCurveTo(420,490,418,530);x.stroke();
x.fillStyle='rgba(180,110,60,.4)';x.beginPath();x.ellipse(418,534,3.5,2.5,0,0,Math.PI*2);x.fill();
// Hair (dark)
x.fillStyle='#0c0818';
x.beginPath();x.moveTo(80,330);x.quadraticCurveTo(90,180,180,120);x.quadraticCurveTo(260,80,330,75);x.quadraticCurveTo(230,180,200,290);x.quadraticCurveTo(170,340,145,480);x.fill();
x.fillStyle='#0e0c1e';
x.beginPath();x.moveTo(560,320);x.quadraticCurveTo(550,178,465,118);x.quadraticCurveTo(388,78,330,74);x.quadraticCurveTo(420,178,455,288);x.quadraticCurveTo(488,340,510,478);x.fill();
// Headband jade beads
x.fillStyle='#120c20';
x.beginPath();x.ellipse(320,265,240,30,.05,0,Math.PI*2);x.fill();
[160,230,320,415,485].forEach((bx,i)=>{
  x.fillStyle=i===2?'#186030':'#208040';x.beginPath();x.ellipse(bx,265,i===2?16:11,i===2?16:11,0,0,Math.PI*2);x.fill();
  x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(bx,265,i===2?8:5.5,i===2?8:5.5,0,0,Math.PI*2);x.fill();
});
// Face paint markings
x.strokeStyle='rgba(100,68,170,.6)';x.lineWidth=2;
x.beginPath();x.moveTo(112,670);x.quadraticCurveTo(175,695,235,710);x.stroke();
x.strokeStyle='rgba(200,120,10,.5)';
x.beginPath();x.moveTo(410,650);x.quadraticCurveTo(472,672,530,680);x.stroke();
// Smoke wisps
x.globalAlpha=.3;
x.strokeStyle='#6644aa';x.lineWidth=5;
x.beginPath();x.moveTo(320,240);x.quadraticCurveTo(305,170,315,100);x.stroke();
x.lineWidth=3;
x.beginPath();x.moveTo(310,238);x.quadraticCurveTo(285,165,295,95);x.stroke();
x.globalAlpha=1;
// Shadow sweep left
const ls=x.createLinearGradient(0,0,200,0);
ls.addColorStop(0,'rgba(4,2,10,.95)');ls.addColorStop(1,'transparent');
x.fillStyle=ls;x.fillRect(0,0,200,1600);
// Shadow bottom
const bs=x.createLinearGradient(0,1300,0,1600);
bs.addColorStop(0,'transparent');bs.addColorStop(1,'rgba(0,0,0,.98)');
x.fillStyle=bs;x.fillRect(0,1300,600,300);
})();

// Body canvas
(function(){
const c=document.getElementById('bc'),x=c.getContext('2d');
const bg=x.createRadialGradient(300,800,0,300,800,700);
bg.addColorStop(0,'#0e0c20');bg.addColorStop(.5,'#080614');bg.addColorStop(1,'#04020a');
x.fillStyle=bg;x.fillRect(0,0,600,1600);
// Aura glow
const ag=x.createRadialGradient(300,800,0,300,800,380);
ag.addColorStop(0,'rgba(90,90,154,.2)');ag.addColorStop(1,'transparent');
x.fillStyle=ag;x.fillRect(0,0,600,1600);
// Ground ember
const geg=x.createRadialGradient(300,1460,0,300,1460,200);
geg.addColorStop(0,'rgba(255,30,0,.22)');geg.addColorStop(1,'transparent');
x.fillStyle=geg;x.fillRect(0,1300,600,300);
// CAPE
x.fillStyle='#100c20';
x.beginPath();x.moveTo(220,270);x.quadraticCurveTo(130,400,110,650);x.quadraticCurveTo(90,880,125,1100);x.quadraticCurveTo(148,1200,175,1220);x.quadraticCurveTo(195,1225,195,1180);x.quadraticCurveTo(185,1060,190,880);x.quadraticCurveTo(198,660,208,500);x.quadraticCurveTo(218,380,220,270);x.fill();
// Legs
x.fillStyle='#1a1435';
// left leg
x.beginPath();x.moveTo(235,990);x.quadraticCurveTo(220,1100,215,1220);x.lineTo(238,1220);x.quadraticCurveTo(250,1100,260,990);x.fill();
// right leg
x.beginPath();x.moveTo(330,990);x.quadraticCurveTo(348,1100,355,1220);x.lineTo(334,1220);x.quadraticCurveTo(325,1100,308,990);x.fill();
// BODY ARMOR
const armor=x.createRadialGradient(290,650,0,290,650,280);
armor.addColorStop(0,'#2a2050');armor.addColorStop(.4,'#16102a');armor.addColorStop(1,'#08060f');
x.fillStyle=armor;
x.beginPath();x.moveTo(220,380);x.quadraticCurveTo(205,440,202,560);x.quadraticCurveTo(200,680,215,970);x.lineTo(375,970);x.quadraticCurveTo(390,680,388,560);x.quadraticCurveTo(385,440,372,380);x.quadraticCurveTo(340,362,295,360);x.quadraticCurveTo(250,362,220,380);x.fill();
// Armor shine
x.strokeStyle='rgba(200,128,10,.4)';x.lineWidth=2;
x.beginPath();x.moveTo(225,385);x.quadraticCurveTo(210,480,208,580);x.stroke();
// Scale pattern
x.fillStyle='#16103a';x.strokeStyle='#5544aa';x.lineWidth=1.2;
[[260,430],[295,422],[330,422],[365,430],[250,460],[283,452],[317,452],[350,452],[383,460],[242,490],[273,482],[305,482],[337,482],[368,482],[398,490]].forEach(([ex,ey])=>{
  x.beginPath();x.ellipse(ex,ey,18,11,0,0,Math.PI*2);x.fill();x.stroke();
});
// Chest medallion
x.fillStyle='#08050f';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(300,620,42,42,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='#0d0a1e';x.beginPath();x.ellipse(300,620,33,33,0,0,Math.PI*2);x.fill();
x.strokeStyle='rgba(150,100,220,.5)';x.lineWidth=1;x.setLineDash([6,4]);
x.beginPath();x.ellipse(300,620,42,42,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
// Mirror glint
x.fillStyle='rgba(140,110,200,.5)';x.beginPath();x.ellipse(291,612,6,4,-0.5,0,Math.PI*2);x.fill();
// Belt
x.fillStyle='#16102a';x.strokeStyle='#5544aa';x.lineWidth=2;
x.beginPath();x.moveTo(210,850);x.lineTo(395,850);x.lineTo(398,888);x.quadraticCurveTo(300,905,202,888);x.closePath();x.fill();x.stroke();
x.strokeStyle='#ffd700';x.lineWidth=3;
x.beginPath();x.moveTo(210,850);x.lineTo(395,850);x.stroke();
// Skull ornament
x.fillStyle='#e8d8c0';x.strokeStyle='#b0a080';x.lineWidth=1.5;
x.beginPath();x.ellipse(300,868,16,14,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='#1a0808';
[[293,864],[307,864]].forEach(([ex,ey])=>{x.beginPath();x.ellipse(ex,ey,3.5,3.5,0,0,Math.PI*2);x.fill()});
// PAULDRONS
x.fillStyle='#1a1435';x.strokeStyle='#5544aa';x.lineWidth=2;
[[175,360,155,380,138,420,158,435,180,420,192,390,192,370],[418,360,436,380,454,420,434,435,412,420,400,390,400,370]].forEach(pts=>{
  x.beginPath();x.moveTo(pts[0],pts[1]);
  for(let i=2;i<pts.length;i+=2)x.lineTo(pts[i],pts[i+1]);
  x.closePath();x.fill();x.stroke();
});
// Jade pauldron inlays
[[162,398],[430,396]].forEach(([ex,ey])=>{
  x.fillStyle='#208040';x.strokeStyle='#10502a';x.lineWidth=1.5;
  x.beginPath();x.ellipse(ex,ey,15,10,0,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(ex,ey,7,5,0,0,Math.PI*2);x.fill();
});
// ARMS
x.fillStyle=armor;x.strokeStyle='rgba(58,40,112,.8)';x.lineWidth=1.5;
// Left arm
x.beginPath();x.moveTo(205,380);x.quadraticCurveTo(170,430,150,490);x.quadraticCurveTo(134,546,142,582);x.quadraticCurveTo(158,602,175,594);x.quadraticCurveTo(192,578,200,540);x.quadraticCurveTo(215,480,218,415);x.closePath();x.fill();x.stroke();
// Right arm
x.beginPath();x.moveTo(387,380);x.quadraticCurveTo(422,430,444,490);x.quadraticCurveTo(460,546,452,582);x.quadraticCurveTo(436,602,418,594);x.quadraticCurveTo(400,578,392,540);x.quadraticCurveTo(378,480,375,415);x.closePath();x.fill();x.stroke();
// MACUAHUITL (obsidian club)
x.save();x.translate(142,560);x.rotate(-.25);
// Handle
x.fillStyle='#2a1808';x.strokeStyle='#c8800a';x.lineWidth=2;
x.beginPath();x.roundRect(-14,0,28,130,6);x.fill();x.stroke();
// Club body
x.fillStyle='#3a2010';x.strokeStyle='#1e1008';x.lineWidth=2;
x.beginPath();x.roundRect(-18,-210,36,220,4);x.fill();x.stroke();
// Obsidian blades
const bladeGrad=x.createLinearGradient(-30,-200,10,-200);
bladeGrad.addColorStop(0,'#c0c0d8');bladeGrad.addColorStop(.3,'#606080');bladeGrad.addColorStop(1,'#0a0a16');
x.fillStyle=bladeGrad;
[[-200],[-175],[-150],[-125],[-100],[-75],[-50],[-25]].forEach(([by])=>{
  x.beginPath();x.moveTo(-18,by);x.lineTo(-36,by+7);x.lineTo(-34,by+22);x.lineTo(-18,by+18);x.fill();
  x.beginPath();x.moveTo(18,by);x.lineTo(36,by+7);x.lineTo(34,by+22);x.lineTo(18,by+18);x.fill();
});
// Blood
x.fillStyle='rgba(200,17,0,.5)';x.beginPath();x.ellipse(-34,-158,5,3,0,0,Math.PI*2);x.fill();
x.restore();
// SHIELD (right hand)
x.fillStyle='#1a1030';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(455,582,68,68,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='#c8800a';x.lineWidth=2.5;
[52,40,28].forEach(r=>{x.beginPath();x.ellipse(455,582,r,r,0,0,Math.PI*2);x.stroke()});
// Shield center mirror
x.fillStyle='#08050f';x.strokeStyle='#9966ff';x.lineWidth=2;
x.beginPath();x.ellipse(455,582,18,18,0,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='rgba(140,100,210,.5)';x.beginPath();x.ellipse(449,576,5,3,-.4,0,Math.PI*2);x.fill();
// HEAD
// Feathers
['#0c4018','#0a3a14','#0e4818'].forEach((col,i)=>{
  x.fillStyle=col;x.strokeStyle='#208040';x.lineWidth=1;
  const fx=[290,270,310,255,325,242,340][i*2]||300;
  x.beginPath();x.moveTo(fx,200);x.quadraticCurveTo(fx-10,-60,fx-3,-100);x.quadraticCurveTo(fx+5,-60,fx+12,200);x.fill();x.stroke();
  x.fillStyle='rgba(255,215,0,.65)';x.beginPath();x.ellipse(fx+4,-95,7,12,0,0,Math.PI*2);x.fill();
});
[258,278,298,318,338].forEach((fx,i)=>{
  x.fillStyle='#0c4018';x.strokeStyle='#208040';x.lineWidth=1;
  x.beginPath();x.moveTo(fx,200);x.quadraticCurveTo(fx-8,-40+i*5,fx,-80+i*3);x.quadraticCurveTo(fx+8,-40+i*5,fx+10,200);x.fill();
});
// Helmet
x.fillStyle='#120c28';x.strokeStyle='#5544aa';x.lineWidth=2.5;
x.beginPath();x.ellipse(300,248,68,52,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='#ffd700';x.lineWidth=3;
x.beginPath();x.arc(300,248,68,Math.PI,0);x.stroke();
// Head
x.fillStyle='#6a3218';
x.beginPath();x.ellipse(300,320,52,58,0,0,Math.PI*2);x.fill();
// Eye band
x.fillStyle='rgba(5,2,14,.9)';x.beginPath();x.roundRect(252,308,96,22,4);x.fill();
// Eyes glow
[[274,318],[326,318]].forEach(([ex,ey])=>{
  x.fillStyle='#ff2200';x.beginPath();x.ellipse(ex,ey,7,5,0,0,Math.PI*2);x.fill();
});
// Smoke aura glow
x.globalAlpha=.25;
const bodyAura=x.createRadialGradient(300,650,0,300,650,300);
bodyAura.addColorStop(0,'#6644aa');bodyAura.addColorStop(1,'transparent');
x.fillStyle=bodyAura;x.fillRect(0,350,600,700);
x.globalAlpha=1;
// Shadow right edge
const rs=x.createLinearGradient(500,0,600,0);
rs.addColorStop(0,'transparent');rs.addColorStop(1,'rgba(0,0,0,.92)');
x.fillStyle=rs;x.fillRect(0,0,600,1600);
const bs2=x.createLinearGradient(0,1300,0,1600);
bs2.addColorStop(0,'transparent');bs2.addColorStop(1,'rgba(0,0,0,.98)');
x.fillStyle=bs2;x.fillRect(0,1300,600,300);
})();
</script></body></html>` },

// ── 2. TWITTER / X BANNER ───────────────────────────────────────────────────
{ name: '02_Twitter_Banner', w: 1500, h: 500, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1500px;height:500px;overflow:hidden;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;left:0;top:0;width:1500px;height:500px;z-index:10;pointer-events:none}
.center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center}
.sub{font-size:13px;letter-spacing:9px;color:rgba(200,128,10,.8);text-transform:uppercase;margin-bottom:8px}
.main{font-size:72px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(255,24,0,.9),0 0 100px rgba(255,24,0,.4);letter-spacing:8px;line-height:1}
.loc{font-size:15px;letter-spacing:12px;color:rgba(200,128,10,.7);margin-top:10px}
.tag{font-size:13px;font-style:italic;color:rgba(220,190,140,.7);margin-top:6px;letter-spacing:1px}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse 70% 100% at 50% 50%,transparent 20%,rgba(0,0,0,.15) 60%,rgba(0,0,0,.7) 100%);z-index:9}
.border{position:absolute;inset:0;border:3px solid rgba(200,128,10,.3);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1500" height="500"></canvas>
<div class="txt">
  <div class="center">
    <div class="sub">War of the Gods</div>
    <div class="main">TENOCHTITLAN</div>
    <div class="loc">The Digital Descent · 17 Gods · One Mirror</div>
    <div class="tag">"The battle begins before the first sword is swung."</div>
  </div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
// Sky gradient
const sky=x.createLinearGradient(0,0,0,500);
sky.addColorStop(0,'#030110');sky.addColorStop(.4,'#0a0620');sky.addColorStop(.7,'#12082a');sky.addColorStop(1,'#06030f');
x.fillStyle=sky;x.fillRect(0,0,1500,500);
// Left char silhouette
const ls=x.createRadialGradient(220,200,0,220,300,320);
ls.addColorStop(0,'rgba(200,100,20,.18)');ls.addColorStop(1,'transparent');
x.fillStyle=ls;x.fillRect(0,0,600,500);
x.fillStyle='rgba(14,10,28,.85)';
x.beginPath();x.moveTo(180,0);x.quadraticCurveTo(130,60,110,150);x.quadraticCurveTo(90,240,100,350);x.quadraticCurveTo(115,420,148,460);x.lineTo(162,460);x.quadraticCurveTo(178,405,182,320);x.quadraticCurveTo(188,220,200,160);x.quadraticCurveTo(220,80,240,0);x.fill();
// Right char silhouette
const rs=x.createRadialGradient(1280,200,0,1280,300,320);
rs.addColorStop(0,'rgba(90,90,154,.18)');rs.addColorStop(1,'transparent');
x.fillStyle=rs;x.fillRect(900,0,600,500);
x.fillStyle='rgba(14,10,28,.85)';
x.beginPath();x.moveTo(1320,0);x.quadraticCurveTo(1370,60,1390,150);x.quadraticCurveTo(1410,240,1400,350);x.quadraticCurveTo(1385,420,1352,460);x.lineTo(1338,460);x.quadraticCurveTo(1322,405,1318,320);x.quadraticCurveTo(1312,220,1300,160);x.quadraticCurveTo(1280,80,1260,0);x.fill();
// Center glow
const cg=x.createRadialGradient(750,250,0,750,250,400);
cg.addColorStop(0,'rgba(90,50,140,.15)');cg.addColorStop(.5,'rgba(60,30,100,.08)');cg.addColorStop(1,'transparent');
x.fillStyle=cg;x.fillRect(0,0,1500,500);
// Ground line
x.strokeStyle='rgba(255,24,0,.4)';x.lineWidth=1;
x.beginPath();x.moveTo(0,460);x.lineTo(1500,460);x.stroke();
// Gold horizon glow
const hg=x.createLinearGradient(0,440,0,500);
hg.addColorStop(0,'transparent');hg.addColorStop(.5,'rgba(200,80,10,.12)');hg.addColorStop(1,'rgba(255,30,0,.06)');
x.fillStyle=hg;x.fillRect(0,440,1500,60);
// Obsidian stars
for(let i=0;i<120;i++){
  const sx=Math.random()*1500,sy=Math.random()*300;
  const sv=Math.random();
  x.fillStyle=sv>.85?'rgba(255,215,0,'+(sv*.3+.05)+')':'rgba(255,255,255,'+(sv*.12+.02)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.8+.3,sv*.8+.3,0,0,Math.PI*2);x.fill();
}
// Center divider glow
const dg=x.createLinearGradient(745,0,755,0);
dg.addColorStop(0,'transparent');dg.addColorStop(.5,'rgba(255,215,0,.7)');dg.addColorStop(1,'transparent');
x.fillStyle=dg;x.fillRect(748,40,4,420);
</script></body></html>` },

// ── 3. INSTAGRAM SQUARE ─────────────────────────────────────────────────────
{ name: '03_Instagram_Square', w: 1080, h: 1080, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1080px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;inset:0;z-index:10;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:80px}
.pre{font-size:12px;letter-spacing:9px;color:rgba(200,128,10,.75);text-transform:uppercase;margin-bottom:12px}
.w{font-size:56px;font-weight:900;color:#fff;text-shadow:0 0 50px rgba(255,24,0,.9);letter-spacing:5px;line-height:1}
.of{font-size:22px;letter-spacing:12px;color:rgba(255,215,0,.7);margin:6px 0}
.g{font-size:68px;font-weight:900;color:#fff;text-shadow:0 0 50px rgba(200,128,10,.9);letter-spacing:7px}
.div{width:200px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:14px 0}
.tag{font-size:13px;font-style:italic;color:rgba(220,190,140,.75);letter-spacing:1px}
.vig{position:absolute;inset:0;z-index:9;background:radial-gradient(ellipse 80% 80% at 50% 50%,transparent 30%,rgba(0,0,0,.2) 65%,rgba(0,0,0,.85) 100%)}
.border{position:absolute;inset:0;border:4px solid rgba(200,128,10,.35);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1080" height="1080"></canvas>
<div class="txt">
  <div class="pre">Pixel Agents Studio</div>
  <div class="w">WAR OF THE</div>
  <div class="of">· · ·</div>
  <div class="g">GODS</div>
  <div class="div"></div>
  <div class="tag">Tenochtitlan · The Digital Descent</div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
const bg=x.createRadialGradient(540,400,0,540,600,700);
bg.addColorStop(0,'#120a28');bg.addColorStop(.4,'#0a0618');bg.addColorStop(1,'#030109');
x.fillStyle=bg;x.fillRect(0,0,1080,1080);
// Central warrior silhouette
const wg=x.createRadialGradient(540,480,0,540,600,480);
wg.addColorStop(0,'rgba(90,60,160,.3)');wg.addColorStop(.4,'rgba(60,40,120,.15)');wg.addColorStop(1,'transparent');
x.fillStyle=wg;x.fillRect(0,0,1080,1080);
// Warrior body
x.fillStyle='rgba(18,12,36,.9)';
x.beginPath();
// Head/headdress
x.ellipse(540,180,55,65,0,0,Math.PI*2);x.fill();
// Feathers
['#0c4018','#0a3814'].forEach((col,i)=>{
  x.fillStyle=col;
  x.beginPath();x.moveTo(540,130);x.quadraticCurveTo(520-i*20,-80+i*20,525-i*18,-130+i*15);x.quadraticCurveTo(535-i*18,-80+i*20,540,130);x.fill();
  x.beginPath();x.moveTo(540,130);x.quadraticCurveTo(560+i*20,-80+i*20,555+i*18,-130+i*15);x.quadraticCurveTo(545+i*18,-80+i*20,540,130);x.fill();
});
// Body
x.fillStyle='rgba(18,12,36,.9)';
x.beginPath();x.moveTo(450,270);x.quadraticCurveTo(420,450,418,630);x.quadraticCurveTo(416,760,430,960);x.lineTo(470,960);x.quadraticCurveTo(475,760,480,630);x.lineTo(540,650);x.lineTo(600,630);x.quadraticCurveTo(606,760,610,960);x.lineTo(650,960);x.quadraticCurveTo(664,760,662,630);x.quadraticCurveTo(660,450,630,270);x.closePath();x.fill();
// Cape
x.fillStyle='rgba(14,10,28,.85)';
x.beginPath();x.moveTo(450,270);x.quadraticCurveTo(360,400,340,620);x.quadraticCurveTo(325,800,350,980);x.lineTo(375,980);x.quadraticCurveTo(378,800,390,630);x.quadraticCurveTo(410,430,450,290);x.fill();
// Eye glow
const eg=x.createRadialGradient(540,188,0,540,188,120);
eg.addColorStop(0,'rgba(255,24,0,.4)');eg.addColorStop(.4,'rgba(200,10,0,.15)');eg.addColorStop(1,'transparent');
x.fillStyle=eg;x.fillRect(420,100,240,200);
[[518,188],[562,188]].forEach(([ex,ey])=>{
  x.fillStyle='#ff2800';x.beginPath();x.ellipse(ex,ey,9,6,0,0,Math.PI*2);x.fill();
});
// Chest medallion
x.fillStyle='#08050f';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(540,480,38,38,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='rgba(150,100,220,.5)';x.lineWidth=1;x.setLineDash([5,4]);
x.beginPath();x.ellipse(540,480,38,38,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
x.fillStyle='rgba(120,80,180,.5)';x.beginPath();x.ellipse(532,473,5,3,-.4,0,Math.PI*2);x.fill();
// Smoke wisps
x.globalAlpha=.25;x.strokeStyle='#6644aa';x.lineWidth=8;
x.beginPath();x.moveTo(540,110);x.quadraticCurveTo(525,30,530,-50);x.stroke();
x.lineWidth=5;x.beginPath();x.moveTo(528,108);x.quadraticCurveTo(510,25,515,-45);x.stroke();
x.globalAlpha=1;
// Ember ground glow
const gg=x.createRadialGradient(540,1050,0,540,1050,350);
gg.addColorStop(0,'rgba(255,30,0,.2)');gg.addColorStop(1,'transparent');
x.fillStyle=gg;x.fillRect(0,800,1080,280);
// Stars
for(let i=0;i<80;i++){
  const sx=Math.random()*1080,sy=Math.random()*320;
  const sv=Math.random();
  x.fillStyle='rgba(255,255,255,'+(sv*.1+.02)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.6+.2,sv*.6+.2,0,0,Math.PI*2);x.fill();
}
</script></body></html>` },

// ── 4. MOBILE WALLPAPER ─────────────────────────────────────────────────────
{ name: '04_Mobile_Wallpaper', w: 1080, h: 1920, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;inset:0;z-index:10;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:120px}
.name{font-size:14px;letter-spacing:10px;color:rgba(200,128,10,.7);text-transform:uppercase;margin-bottom:16px}
.w{font-size:62px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(255,24,0,.9);letter-spacing:6px;line-height:1}
.of{font-size:24px;letter-spacing:14px;color:rgba(255,215,0,.7);margin:8px 0}
.g{font-size:76px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(200,128,10,.9);letter-spacing:8px}
.div{width:220px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:18px 0}
.tag{font-size:14px;font-style:italic;color:rgba(220,190,140,.7);letter-spacing:1px;text-align:center;padding:0 40px}
.vig{position:absolute;inset:0;z-index:9;background:radial-gradient(ellipse 80% 70% at 50% 50%,transparent 25%,rgba(0,0,0,.1) 55%,rgba(0,0,0,.75) 100%)}
.border{position:absolute;inset:0;border:4px solid rgba(200,128,10,.3);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1080" height="1920"></canvas>
<div class="txt">
  <div class="name">Tezcatlipoca · The Smoking Mirror</div>
  <div class="w">WAR OF THE</div>
  <div class="of">· · ·</div>
  <div class="g">GODS</div>
  <div class="div"></div>
  <div class="tag">"The battle begins before the first sword is swung."</div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
// BG
const bg=x.createLinearGradient(0,0,0,1920);
bg.addColorStop(0,'#020109');bg.addColorStop(.3,'#0a0620');bg.addColorStop(.6,'#120830');bg.addColorStop(1,'#06030f');
x.fillStyle=bg;x.fillRect(0,0,1080,1920);
// Center aura
const ca=x.createRadialGradient(540,900,0,540,900,700);
ca.addColorStop(0,'rgba(90,60,160,.35)');ca.addColorStop(.5,'rgba(60,30,120,.18)');ca.addColorStop(1,'transparent');
x.fillStyle=ca;x.fillRect(0,0,1080,1920);
// Warrior silhouette (full body, tall)
// Cape
x.fillStyle='rgba(14,10,28,.95)';
x.beginPath();x.moveTo(490,380);x.quadraticCurveTo(380,560,355,820);x.quadraticCurveTo(330,1060,368,1320);x.quadraticCurveTo(390,1460,420,1480);x.quadraticCurveTo(448,1490,450,1440);x.quadraticCurveTo(448,1280,455,1060);x.quadraticCurveTo(465,820,485,640);x.quadraticCurveTo(502,490,505,380);x.fill();
// Armor body
const armor=x.createRadialGradient(540,900,0,540,900,380);
armor.addColorStop(0,'#2a2050');armor.addColorStop(.4,'#16102a');armor.addColorStop(1,'#08060f');
x.fillStyle=armor;
x.beginPath();x.moveTo(448,440);x.quadraticCurveTo(420,580,415,760);x.quadraticCurveTo(410,940,420,1140);x.lineTo(440,1140);x.quadraticCurveTo(452,940,458,760);x.lineTo(540,785);x.lineTo(622,760);x.quadraticCurveTo(630,940,640,1140);x.lineTo(660,1140);x.quadraticCurveTo(670,940,665,760);x.quadraticCurveTo(660,580,632,440);x.quadraticCurveTo(596,415,540,413);x.quadraticCurveTo(484,415,448,440);x.fill();
// Legs
x.fillStyle='#1a1435';
x.beginPath();x.moveTo(448,1140);x.quadraticCurveTo(432,1320,425,1520);x.lineTo(458,1520);x.quadraticCurveTo(472,1320,478,1140);x.fill();
x.beginPath();x.moveTo(602,1140);x.quadraticCurveTo(618,1320,626,1520);x.lineTo(658,1520);x.quadraticCurveTo(650,1320,638,1140);x.fill();
// Belt
x.fillStyle='#16102a';x.strokeStyle='#ffd700';x.lineWidth=4;
x.beginPath();x.moveTo(415,1040);x.lineTo(665,1040);x.lineTo(668,1090);x.quadraticCurveTo(540,1115,412,1090);x.closePath();x.fill();x.stroke();
// Chest medallion
x.fillStyle='#08050f';x.strokeStyle='#6644aa';x.lineWidth=4;
x.beginPath();x.ellipse(540,730,48,48,0,0,Math.PI*2);x.fill();x.stroke();
x.setLineDash([7,5]);x.strokeStyle='rgba(150,100,220,.5)';x.lineWidth=1.5;
x.beginPath();x.ellipse(540,730,48,48,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
x.fillStyle='rgba(130,90,200,.55)';x.beginPath();x.ellipse(530,721,7,4,-.4,0,Math.PI*2);x.fill();
// Scale armor
x.fillStyle='#16103a';x.strokeStyle='#5544aa';x.lineWidth=1.5;
[[480,510],[520,500],[560,500],[600,510],[466,548],[504,538],[542,538],[580,538],[618,548]].forEach(([ex,ey])=>{
  x.beginPath();x.ellipse(ex,ey,22,14,0,0,Math.PI*2);x.fill();x.stroke();
});
// Pauldrons
x.fillStyle='#1a1435';x.strokeStyle='#5544aa';x.lineWidth=2.5;
[[[430,440],[400,468],[382,518],[405,542],[435,528],[450,500],[455,465]],
 [[650,440],[680,468],[698,518],[675,542],[645,528],[630,500],[625,465]]].forEach(pts=>{
  x.beginPath();pts.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.fill();x.stroke();
});
// Jade inlays
[[406,492],[674,490]].forEach(([ex,ey])=>{
  x.fillStyle='#208040';x.strokeStyle='#10502a';x.lineWidth=2;
  x.beginPath();x.ellipse(ex,ey,18,12,0,0,Math.PI*2);x.fill();x.stroke();
  x.fillStyle='rgba(48,176,96,.7)';x.beginPath();x.ellipse(ex,ey,9,6,0,0,Math.PI*2);x.fill();
});
// Arms
x.fillStyle=armor;
x.beginPath();x.moveTo(455,445);x.quadraticCurveTo(408,520,385,600);x.quadraticCurveTo(368,670,380,720);x.quadraticCurveTo(398,748,420,738);x.quadraticCurveTo(445,720,455,680);x.quadraticCurveTo(472,600,475,510);x.closePath();x.fill();
x.beginPath();x.moveTo(625,445);x.quadraticCurveTo(672,520,695,600);x.quadraticCurveTo(712,670,700,720);x.quadraticCurveTo(682,748,660,738);x.quadraticCurveTo(635,720,625,680);x.quadraticCurveTo(608,600,605,510);x.closePath();x.fill();
// Head
// Feathers (tall)
['#0c4018','#0a3814','#0e4818'].forEach((col,i)=>{
  const offsets=[[-30,0],[0,0],[30,0]];const[ox]=offsets[i];
  x.fillStyle=col;x.strokeStyle='#1a6030';x.lineWidth=1;
  x.beginPath();x.moveTo(540+ox,220);x.quadraticCurveTo(525+ox,-80,530+ox,-160);x.quadraticCurveTo(545+ox,-80,555+ox,220);x.fill();x.stroke();
  x.fillStyle='rgba(255,215,0,.7)';x.beginPath();x.ellipse(540+ox,-155,9,14,0,0,Math.PI*2);x.fill();
});
[-60,-40].forEach(ox=>{
  x.fillStyle='#0c4018';x.beginPath();x.moveTo(540+ox,220);x.quadraticCurveTo(520+ox,-40,525+ox,-110);x.quadraticCurveTo(540+ox,-40,550+ox,220);x.fill();
  x.fillStyle='#0c4018';x.beginPath();x.moveTo(540-ox,220);x.quadraticCurveTo(520-ox,-40,525-ox,-110);x.quadraticCurveTo(540-ox,-40,550-ox,220);x.fill();
});
x.fillStyle='#120c28';x.strokeStyle='#5544aa';x.lineWidth=3;
x.beginPath();x.ellipse(540,278,80,62,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='#ffd700';x.lineWidth=4;x.beginPath();x.arc(540,278,80,Math.PI,0);x.stroke();
x.fillStyle='#6a3218';x.beginPath();x.ellipse(540,380,62,70,0,0,Math.PI*2);x.fill();
x.fillStyle='rgba(5,2,14,.9)';x.beginPath();x.roundRect(472,366,136,28,5);x.fill();
[[516,379],[564,379]].forEach(([ex,ey])=>{
  const eg=x.createRadialGradient(ex,ey,0,ex,ey,28);
  eg.addColorStop(0,'rgba(255,24,0,.7)');eg.addColorStop(1,'transparent');
  x.fillStyle=eg;x.beginPath();x.ellipse(ex,ey,28,18,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff2800';x.beginPath();x.ellipse(ex,ey,9,6,0,0,Math.PI*2);x.fill();
});
// Smoke wisps
x.globalAlpha=.3;x.strokeStyle='#6644aa';x.lineWidth=10;
x.beginPath();x.moveTo(540,200);x.quadraticCurveTo(520,80,525,-20);x.stroke();
x.lineWidth=7;x.beginPath();x.moveTo(525,198);x.quadraticCurveTo(498,72,503,-18);x.stroke();
x.globalAlpha=1;
// Ground glow
const gg=x.createRadialGradient(540,1880,0,540,1880,500);
gg.addColorStop(0,'rgba(255,30,0,.28)');gg.addColorStop(1,'transparent');
x.fillStyle=gg;x.fillRect(0,1600,1080,320);
// Stars
for(let i=0;i<160;i++){
  const sx=Math.random()*1080,sy=Math.random()*500;
  const sv=Math.random();
  x.fillStyle='rgba(255,255,255,'+(sv*.12+.02)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.8+.2,sv*.8+.2,0,0,Math.PI*2);x.fill();
}
</script></body></html>` },

// ── 5. CHARACTER CARD ───────────────────────────────────────────────────────
{ name: '05_Character_Card_Tezcatlipoca', w: 800, h: 1120, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:800px;height:1120px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.card{position:absolute;inset:0;z-index:10;pointer-events:none}
.header{position:absolute;top:0;left:0;right:0;height:68px;background:linear-gradient(to right,rgba(22,10,42,.95),rgba(40,20,70,.9),rgba(22,10,42,.95));border-bottom:2px solid rgba(200,128,10,.5);display:flex;align-items:center;justify-content:space-between;padding:0 32px}
.game-tag{font-size:11px;letter-spacing:7px;color:rgba(200,128,10,.8);text-transform:uppercase}
.type-tag{font-size:11px;letter-spacing:5px;color:rgba(90,90,154,.9);text-transform:uppercase}
.portrait-area{position:absolute;top:68px;left:0;right:0;height:560px}
.name-block{position:absolute;bottom:490px;left:0;right:0;text-align:center;z-index:20}
.god-name{font-size:46px;font-weight:900;color:#fff;text-shadow:0 0 40px rgba(255,24,0,.9);letter-spacing:4px}
.god-title{font-size:13px;letter-spacing:7px;color:rgba(255,100,50,.8);text-transform:uppercase;margin-top:4px}
.spec-block{position:absolute;bottom:430px;left:50%;transform:translateX(-50%);background:rgba(10,6,20,.85);border:1px solid rgba(200,128,10,.5);padding:8px 28px;white-space:nowrap;z-index:20;text-align:center}
.spec-label{font-size:10px;letter-spacing:6px;color:rgba(200,128,10,.7);text-transform:uppercase}
.spec-name{font-size:18px;color:rgba(255,215,0,.9);letter-spacing:3px;font-weight:700}
.stats{position:absolute;bottom:68px;left:0;right:0;padding:0 36px 0;z-index:20}
.stat-row{display:flex;align-items:center;margin-bottom:14px;gap:12px}
.stat-label{font-size:10px;letter-spacing:5px;color:rgba(200,128,10,.7);text-transform:uppercase;width:80px;text-align:right}
.stat-bar{flex:1;height:8px;background:rgba(255,255,255,.06);border:1px solid rgba(200,128,10,.2);border-radius:0}
.stat-fill{height:100%;background:linear-gradient(to right,rgba(200,128,10,.8),rgba(255,215,0,.9))}
.stat-val{font-size:12px;color:rgba(255,215,0,.8);width:24px;text-align:right}
.desc-block{position:absolute;bottom:300px;left:0;right:0;padding:0 36px;z-index:20}
.desc-line{width:100%;height:1px;background:linear-gradient(to right,transparent,rgba(200,128,10,.4),transparent);margin-bottom:14px}
.desc-text{font-size:13px;font-style:italic;color:rgba(220,190,150,.75);letter-spacing:1px;text-align:center;line-height:1.7}
.cry-text{font-size:14px;color:rgba(255,100,50,.8);text-align:center;margin-top:10px;font-style:italic}
.footer{position:absolute;bottom:0;left:0;right:0;height:68px;background:linear-gradient(to right,rgba(22,10,42,.95),rgba(40,20,70,.9),rgba(22,10,42,.95));border-top:2px solid rgba(200,128,10,.4);display:flex;align-items:center;justify-content:center;gap:40px}
.stat-chip{text-align:center}
.chip-val{font-size:22px;font-weight:900;color:rgba(255,215,0,.9)}
.chip-lbl{font-size:9px;letter-spacing:4px;color:rgba(200,128,10,.6);text-transform:uppercase}
.border{position:absolute;inset:0;border:3px solid rgba(90,90,154,.3);z-index:12;pointer-events:none}
.corner-tl,.corner-tr,.corner-bl,.corner-br{position:absolute;width:40px;height:40px;z-index:13}
.corner-tl{top:68px;left:0;border-top:2px solid rgba(200,128,10,.7);border-left:2px solid rgba(200,128,10,.7)}
.corner-tr{top:68px;right:0;border-top:2px solid rgba(200,128,10,.7);border-right:2px solid rgba(200,128,10,.7)}
.corner-bl{bottom:68px;left:0;border-bottom:2px solid rgba(200,128,10,.7);border-left:2px solid rgba(200,128,10,.7)}
.corner-br{bottom:68px;right:0;border-bottom:2px solid rgba(200,128,10,.7);border-right:2px solid rgba(200,128,10,.7)}
</style></head><body>
<canvas id="c" width="800" height="1120"></canvas>
<div class="card">
  <div class="header">
    <div class="game-tag">War of the Gods · Tenochtitlan</div>
    <div class="type-tag">Agile · Trickster</div>
  </div>
  <div class="portrait-area"></div>
  <div class="name-block">
    <div class="god-name">TEZCATLIPOCA</div>
    <div class="god-title">The Smoking Mirror</div>
  </div>
  <div class="spec-block">
    <div class="spec-label">Signature Move</div>
    <div class="spec-name">✦ SHADOW DASH ✦</div>
  </div>
  <div class="desc-block">
    <div class="desc-line"></div>
    <div class="desc-text">Agile trickster of the digital cosmos. Moves like obsidian smoke — unseen until the strike lands. Wields the Smoking Mirror to see all truths.</div>
    <div class="cry-text">"Shadow rises!"</div>
  </div>
  <div class="stats">
    ${[['Speed','5'],['Jump','4'],['Power','3'],['Weight','2']].map(([l,v])=>`
    <div class="stat-row">
      <div class="stat-label">${l}</div>
      <div class="stat-bar"><div class="stat-fill" style="width:${parseInt(v)*20}%"></div></div>
      <div class="stat-val">${v}</div>
    </div>`).join('')}
  </div>
  <div class="footer">
    <div class="stat-chip"><div class="chip-val">5</div><div class="chip-lbl">Speed</div></div>
    <div class="stat-chip"><div class="chip-val">17</div><div class="chip-lbl">Gods</div></div>
    <div class="stat-chip"><div class="chip-val">20</div><div class="chip-lbl">Battles</div></div>
    <div class="stat-chip"><div class="chip-val">3</div><div class="chip-lbl">Acts</div></div>
  </div>
  <div class="border"></div>
  <div class="corner-tl"></div><div class="corner-tr"></div>
  <div class="corner-bl"></div><div class="corner-br"></div>
</div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
const bg=x.createRadialGradient(400,400,0,400,600,600);
bg.addColorStop(0,'#160a2a');bg.addColorStop(.5,'#0c0618');bg.addColorStop(1,'#04020a');
x.fillStyle=bg;x.fillRect(0,0,800,1120);
// Character aura
const ag=x.createRadialGradient(400,400,0,400,400,380);
ag.addColorStop(0,'rgba(90,60,160,.3)');ag.addColorStop(.5,'rgba(60,30,120,.12)');ag.addColorStop(1,'transparent');
x.fillStyle=ag;x.fillRect(0,0,800,800);
// Character silhouette portrait
// Cape
x.fillStyle='rgba(16,12,32,.95)';
x.beginPath();x.moveTo(352,148);x.quadraticCurveTo(268,220,250,360);x.quadraticCurveTo(232,500,260,640);x.lineTo(285,640);x.quadraticCurveTo(278,500,295,375);x.quadraticCurveTo(314,250,350,160);x.fill();
// Body
const armor=x.createRadialGradient(400,380,0,400,380,260);
armor.addColorStop(0,'#2a2050');armor.addColorStop(.4,'#16102a');armor.addColorStop(1,'#08060f');
x.fillStyle=armor;
x.beginPath();x.moveTo(312,180);x.quadraticCurveTo(290,260,288,380);x.quadraticCurveTo(286,490,295,628);x.lineTo(505,628);x.quadraticCurveTo(514,490,512,380);x.quadraticCurveTo(510,260,488,180);x.quadraticCurveTo(452,163,400,162);x.quadraticCurveTo(348,163,312,180);x.fill();
// Legs stub
x.fillStyle='#1a1435';
x.beginPath();x.moveTo(310,628);x.quadraticCurveTo(298,700,293,760);x.lineTo(342,760);x.quadraticCurveTo(350,700,357,628);x.fill();
x.beginPath();x.moveTo(490,628);x.quadraticCurveTo(502,700,507,760);x.lineTo(458,760);x.quadraticCurveTo(450,700,443,628);x.fill();
// Scale armor
x.fillStyle='#16103a';x.strokeStyle='#5544aa';x.lineWidth=1.2;
[[350,225],[390,216],[430,216],[470,225],[338,258],[376,248],[414,248],[452,248],[490,258]].forEach(([ex,ey])=>{
  x.beginPath();x.ellipse(ex,ey,20,12,0,0,Math.PI*2);x.fill();x.stroke();
});
// Medallion
x.fillStyle='#08050f';x.strokeStyle='#6644aa';x.lineWidth=3;
x.beginPath();x.ellipse(400,370,40,40,0,0,Math.PI*2);x.fill();x.stroke();
x.setLineDash([6,4]);x.strokeStyle='rgba(150,100,220,.5)';x.lineWidth=1.5;
x.beginPath();x.ellipse(400,370,40,40,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
x.fillStyle='rgba(130,90,200,.55)';x.beginPath();x.ellipse(391,362,6,4,-.4,0,Math.PI*2);x.fill();
// Belt
x.fillStyle='#16102a';x.strokeStyle='#ffd700';x.lineWidth=2.5;
x.beginPath();x.moveTo(285,540);x.lineTo(515,540);x.lineTo(517,572);x.quadraticCurveTo(400,588,283,572);x.closePath();x.fill();x.stroke();
// Pauldrons
x.fillStyle='#1a1435';x.strokeStyle='#5544aa';x.lineWidth=2;
[[[308,182],[282,208],[268,248],[288,268],[308,254],[320,230],[325,198]],
 [[492,182],[518,208],[532,248],[512,268],[492,254],[480,230],[475,198]]].forEach(pts=>{
  x.beginPath();pts.forEach(([px,py],i)=>i?x.lineTo(px,py):x.moveTo(px,py));x.closePath();x.fill();x.stroke();
});
// Arms
x.fillStyle=armor;
x.beginPath();x.moveTo(315,188);x.quadraticCurveTo(280,248,262,318);x.quadraticCurveTo(248,374,260,410);x.quadraticCurveTo(276,430,294,422);x.quadraticCurveTo(315,405,322,370);x.quadraticCurveTo(340,308,345,235);x.closePath();x.fill();
x.beginPath();x.moveTo(485,188);x.quadraticCurveTo(520,248,538,318);x.quadraticCurveTo(552,374,540,410);x.quadraticCurveTo(524,430,506,422);x.quadraticCurveTo(485,405,478,370);x.quadraticCurveTo(460,308,455,235);x.closePath();x.fill();
// Macuahuitl
x.save();x.translate(255,408);x.rotate(-.3);
x.fillStyle='#2a1808';x.strokeStyle='#c8800a';x.lineWidth=2;
x.beginPath();x.roundRect(-13,0,26,100,5);x.fill();x.stroke();
x.fillStyle='#3a2010';x.beginPath();x.roundRect(-16,-165,32,172,4);x.fill();
const bg2=x.createLinearGradient(-28,-165,10,-165);
bg2.addColorStop(0,'#c0c0d8');bg2.addColorStop(.3,'#606080');bg2.addColorStop(1,'#0a0a16');
x.fillStyle=bg2;
[[-160],[-138],[-116],[-94],[-72],[-50],[-28]].forEach(([by])=>{
  x.beginPath();x.moveTo(-16,by);x.lineTo(-30,by+5);x.lineTo(-28,by+18);x.lineTo(-16,by+14);x.fill();
  x.beginPath();x.moveTo(16,by);x.lineTo(30,by+5);x.lineTo(28,by+18);x.lineTo(16,by+14);x.fill();
});
x.restore();
// Head
['#0c4018','#0a3814'].forEach((col,i)=>{
  x.fillStyle=col;x.strokeStyle='#1a6030';x.lineWidth=1;
  [-20,0,20].forEach(ox=>{
    x.beginPath();x.moveTo(400+ox,88);x.quadraticCurveTo(388+ox,-20,392+ox,-75);x.quadraticCurveTo(402+ox,-20,412+ox,88);x.fill();x.stroke();
  });
});
x.fillStyle='rgba(255,215,0,.65)';
[-20,0,20].forEach(ox=>{x.beginPath();x.ellipse(400+ox,-70,6,10,0,0,Math.PI*2);x.fill()});
x.fillStyle='#120c28';x.strokeStyle='#5544aa';x.lineWidth=2.5;
x.beginPath();x.ellipse(400,110,64,50,0,0,Math.PI*2);x.fill();x.stroke();
x.strokeStyle='#ffd700';x.lineWidth=3;x.beginPath();x.arc(400,110,64,Math.PI,0);x.stroke();
x.fillStyle='#6a3218';x.beginPath();x.ellipse(400,175,50,58,0,0,Math.PI*2);x.fill();
x.fillStyle='rgba(5,2,14,.88)';x.beginPath();x.roundRect(343,161,114,24,4);x.fill();
[[374,172],[426,172]].forEach(([ex,ey])=>{
  const eg=x.createRadialGradient(ex,ey,0,ex,ey,24);
  eg.addColorStop(0,'rgba(255,24,0,.65)');eg.addColorStop(1,'transparent');
  x.fillStyle=eg;x.beginPath();x.ellipse(ex,ey,24,16,0,0,Math.PI*2);x.fill();
  x.fillStyle='#ff2800';x.beginPath();x.ellipse(ex,ey,8,5.5,0,0,Math.PI*2);x.fill();
});
// Smoke
x.globalAlpha=.3;x.strokeStyle='#6644aa';x.lineWidth=7;
x.beginPath();x.moveTo(400,68);x.quadraticCurveTo(384,-10,388,-60);x.stroke();
x.globalAlpha=1;
// Bottom fade
const bf=x.createLinearGradient(0,640,0,800);
bf.addColorStop(0,'transparent');bf.addColorStop(1,'rgba(0,0,0,.98)');
x.fillStyle=bf;x.fillRect(0,640,800,480);
</script></body></html>` },

// ── 6. LORE TEASER ──────────────────────────────────────────────────────────
{ name: '06_Lore_Teaser', w: 1200, h: 630, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;inset:0;z-index:10;pointer-events:none;display:flex}
.left-txt{flex:0 0 580px;padding:60px 50px 60px 60px;display:flex;flex-direction:column;justify-content:center}
.pre{font-size:11px;letter-spacing:8px;color:rgba(200,128,10,.7);text-transform:uppercase;margin-bottom:20px}
.headline{font-size:42px;font-weight:900;color:#fff;line-height:1.1;letter-spacing:2px;text-shadow:0 0 40px rgba(255,24,0,.5)}
.headline span{color:rgba(255,215,0,.9)}
.body-txt{margin-top:20px;font-size:14px;color:rgba(200,175,140,.7);line-height:1.8;letter-spacing:.5px;font-style:italic}
.cta{margin-top:28px;display:inline-block;border:1px solid rgba(200,128,10,.6);padding:10px 28px;font-size:11px;letter-spacing:7px;color:rgba(200,128,10,.9);text-transform:uppercase}
.div-v{width:2px;background:linear-gradient(to bottom,transparent,rgba(200,128,10,.5) 20%,rgba(255,24,0,.8) 50%,rgba(200,128,10,.5) 80%,transparent)}
.right-txt{flex:1;padding:60px 50px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
.lore-title{font-size:13px;letter-spacing:8px;color:rgba(90,90,154,.9);text-transform:uppercase;margin-bottom:16px}
.lore-body{font-size:13.5px;color:rgba(180,160,140,.7);line-height:1.9;letter-spacing:.3px}
.lore-body em{color:rgba(255,215,0,.75);font-style:normal}
.vig{position:absolute;inset:0;z-index:9;background:radial-gradient(ellipse 90% 90% at 50% 50%,transparent 30%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.75) 100%)}
.border{position:absolute;inset:0;border:3px solid rgba(200,128,10,.3);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1200" height="630"></canvas>
<div class="txt">
  <div class="left-txt">
    <div class="pre">The Digital Descent · Lore</div>
    <div class="headline">The Fifth Sun<br>Did Not End<br>in <span>Fire or Flood.</span></div>
    <div class="body-txt">It ended when reality itself was compressed. The Mexica cosmos was uploaded into the Humoformic Grid — a vast obsidian network. Mountains became data. Rivers became bandwidth.</div>
    <div class="cta">Discover the Lore ›</div>
  </div>
  <div class="div-v"></div>
  <div class="right-txt">
    <div class="lore-title">The Obsidian Protocol</div>
    <div class="lore-body">
      <em>17 gods.</em> Each holds a shard of the Smoking Mirror.<br><br>
      Tezcatlipoca shattered it across the digital realm.<br>
      The gods called it <em>cosmic destruction.</em><br>
      He called it <em>liberation.</em><br><br>
      Now every god locks their shard behind<br>
      divine combat. To defeat them is to<br>
      understand what they are protecting.<br><br>
      <em>The war begins inside you.</em>
    </div>
  </div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
const bg=x.createLinearGradient(0,0,1200,0);
bg.addColorStop(0,'#0e0820');bg.addColorStop(.4,'#0a0618');bg.addColorStop(.6,'#080518');bg.addColorStop(1,'#06040e');
x.fillStyle=bg;x.fillRect(0,0,1200,630);
// Left warm glow
const lg=x.createRadialGradient(200,315,0,200,315,380);
lg.addColorStop(0,'rgba(200,80,10,.14)');lg.addColorStop(1,'transparent');
x.fillStyle=lg;x.fillRect(0,0,600,630);
// Right cold glow
const rg=x.createRadialGradient(1000,315,0,1000,315,380);
rg.addColorStop(0,'rgba(90,90,154,.14)');rg.addColorStop(1,'transparent');
x.fillStyle=rg;x.fillRect(600,0,600,630);
// Grid texture (Humoformic Grid)
x.strokeStyle='rgba(90,90,154,.055)';x.lineWidth=.5;
for(let i=0;i<1200;i+=40){x.beginPath();x.moveTo(i,0);x.lineTo(i,630);x.stroke();}
for(let i=0;i<630;i+=40){x.beginPath();x.moveTo(0,i);x.lineTo(1200,i);x.stroke();}
// Circuit nodes
x.fillStyle='rgba(90,90,154,.12)';
[[120,80],[200,220],[80,440],[320,520],[480,160],[550,380],[640,80],[720,480],[880,200],[960,420],[1080,100],[1140,340]].forEach(([nx,ny])=>{
  x.beginPath();x.ellipse(nx,ny,4,4,0,0,Math.PI*2);x.fill();
  x.strokeStyle='rgba(90,90,154,.07)';x.lineWidth=.5;
  x.beginPath();x.moveTo(nx,ny);x.lineTo(nx+30+Math.random()*60,ny+Math.random()*40-20);x.stroke();
});
// Smoke mirror watermark (right side)
x.strokeStyle='rgba(100,68,170,.08)';x.lineWidth=2;
[160,130,100,70].forEach(r=>{x.beginPath();x.ellipse(1000,315,r,r,0,0,Math.PI*2);x.stroke()});
// Stars sparse
for(let i=0;i<60;i++){
  const sx=Math.random()*1200,sy=Math.random()*630,sv=Math.random();
  x.fillStyle='rgba(255,255,255,'+(sv*.08+.015)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.5+.15,sv*.5+.15,0,0,Math.PI*2);x.fill();
}
// Gold accent lines
x.strokeStyle='rgba(200,128,10,.18)';x.lineWidth=1;
x.beginPath();x.moveTo(0,628);x.lineTo(1200,628);x.stroke();
x.beginPath();x.moveTo(0,2);x.lineTo(1200,2);x.stroke();
</script></body></html>` },

// ── 7. ROSTER SILHOUETTES ───────────────────────────────────────────────────
{ name: '07_Roster_Teaser', w: 1920, h: 1080, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;inset:0;z-index:10;pointer-events:none}
.top-bar{position:absolute;top:48px;left:0;right:0;text-align:center}
.game-title{font-size:52px;font-weight:900;color:#fff;text-shadow:0 0 60px rgba(255,24,0,.8);letter-spacing:8px}
.sub-title{font-size:14px;letter-spacing:12px;color:rgba(200,128,10,.75);text-transform:uppercase;margin-top:8px}
.divline{width:400px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:14px auto}
.bottom-bar{position:absolute;bottom:40px;left:0;right:0;text-align:center}
.count{font-size:18px;letter-spacing:10px;color:rgba(200,128,10,.8);text-transform:uppercase}
.tagline{font-size:15px;font-style:italic;color:rgba(220,190,150,.65);margin-top:8px;letter-spacing:1px}
.vig{position:absolute;inset:0;z-index:9;background:radial-gradient(ellipse 95% 95% at 50% 50%,transparent 30%,rgba(0,0,0,.1) 60%,rgba(0,0,0,.7) 100%)}
.border{position:absolute;inset:0;border:3px solid rgba(200,128,10,.28);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1920" height="1080"></canvas>
<div class="txt">
  <div class="top-bar">
    <div class="game-title">WAR OF THE GODS</div>
    <div class="sub-title">Tenochtitlan · The Digital Descent</div>
    <div class="divline"></div>
  </div>
  <div class="bottom-bar">
    <div class="count">17 Gods · 20 Battles · One Obsidian Destiny</div>
    <div class="tagline">"The battle begins before the first sword is swung."</div>
  </div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
const bg=x.createLinearGradient(0,0,0,1080);
bg.addColorStop(0,'#030110');bg.addColorStop(.4,'#080520');bg.addColorStop(.7,'#100830');bg.addColorStop(1,'#04020a');
x.fillStyle=bg;x.fillRect(0,0,1920,1080);
// Ground glow
const gg=x.createLinearGradient(0,850,0,1080);
gg.addColorStop(0,'transparent');gg.addColorStop(.5,'rgba(200,80,10,.1)');gg.addColorStop(1,'rgba(255,30,0,.06)');
x.fillStyle=gg;x.fillRect(0,850,1920,230);
// Ground line
x.strokeStyle='rgba(200,100,10,.3)';x.lineWidth=1;
x.beginPath();x.moveTo(0,860);x.lineTo(1920,860);x.stroke();
// Stars
for(let i=0;i<200;i++){
  const sx=Math.random()*1920,sy=Math.random()*400;
  const sv=Math.random();
  x.fillStyle='rgba(255,255,255,'+(sv*.1+.015)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.7+.2,sv*.7+.2,0,0,Math.PI*2);x.fill();
}
// 17 god silhouettes
const gods=[
  {name:'TEZCAT',  col:'#ff1800',x:96},
  {name:'QUETZ',   col:'#e8b800',x:208},
  {name:'HUITZIL', col:'#ffd700',x:320},
  {name:'TLALOC',  col:'#00aaff',x:432},
  {name:'XIPE',    col:'#ff4444',x:544},
  {name:'COATL',   col:'#80c020',x:656},
  {name:'CHALCHI', col:'#00e8c0',x:768},
  {name:'MICTLAN', col:'#cc2200',x:880},
  {name:'MICTECA', col:'#cc66ff',x:992},
  {name:'TONATI',  col:'#ffb800',x:1104},
  {name:'XOLOTL',  col:'#4499ff',x:1216},
  {name:'COYO',    col:'#ccccff',x:1328},
  {name:'OMETE',   col:'#00ffcc',x:1440},
  {name:'TLALT',   col:'#88cc44',x:1552},
  {name:'TLAZO',   col:'#ff44aa',x:1664},
  {name:'XOCHI',   col:'#ff88bb',x:1776},
  {name:'XOQUET',  col:'#ffcc44',x:1888},
];
gods.forEach((g,i)=>{
  const gx=g.x,gy=860;
  const isTezcat=i===0;
  const ht=isTezcat?300:200+Math.floor(Math.random()*80);
  // Glow beneath
  const glow=x.createRadialGradient(gx,gy,0,gx,gy,80);
  const gr=parseInt(g.col.slice(1,3),16),gg2=parseInt(g.col.slice(3,5),16),gb=parseInt(g.col.slice(5,7),16);
  glow.addColorStop(0,'rgba('+gr+','+gg2+','+gb+',.2)');
  glow.addColorStop(1,'transparent');
  x.fillStyle=glow;x.fillRect(gx-80,gy-80,160,80);
  // Silhouette body
  const alpha=isTezcat?0.88:0.55+Math.random()*.2;
  x.fillStyle=isTezcat?'rgba(22,16,42,'+alpha+')':'rgba(12,8,24,'+alpha+')';
  // Body
  x.beginPath();
  x.ellipse(gx,gy-ht*.18,isTezcat?28:22,isTezcat?32:26,0,0,Math.PI*2);x.fill();
  x.beginPath();
  x.moveTo(gx-30,gy-ht*.36);
  x.quadraticCurveTo(gx-32,gy-ht*.7,gx-28,gy-ht*.82);
  x.lineTo(gx-14,gy-ht*.83);
  x.quadraticCurveTo(gx-12,gy-ht*.7,gx-10,gy-ht*.36);
  x.lineTo(gx,gy-ht*.34);
  x.lineTo(gx+10,gy-ht*.36);
  x.quadraticCurveTo(gx+12,gy-ht*.7,gx+14,gy-ht*.83);
  x.lineTo(gx+28,gy-ht*.82);
  x.quadraticCurveTo(gx+32,gy-ht*.7,gx+30,gy-ht*.36);
  x.lineTo(gx+20,gy);x.lineTo(gx-20,gy);x.closePath();x.fill();
  // Eye glow
  const hexToRgb=h=>{const r=parseInt(h.slice(1,3),16),g2=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return[r,g2,b]};
  const eyeRgb=hexToRgb(g.col);
  const eyeGlow=x.createRadialGradient(gx,gy-ht*.85,0,gx,gy-ht*.85,isTezcat?20:14);
  eyeGlow.addColorStop(0,'rgba('+eyeRgb[0]+','+eyeRgb[1]+','+eyeRgb[2]+',.7)');
  eyeGlow.addColorStop(1,'transparent');
  x.fillStyle=eyeGlow;x.beginPath();x.ellipse(gx,gy-ht*.85,isTezcat?20:14,isTezcat?14:10,0,0,Math.PI*2);x.fill();
  x.fillStyle=g.col;x.globalAlpha=isTezcat?1:.85;const eo=isTezcat?8:6;
  [[gx-eo,gy-ht*.85],[gx+eo,gy-ht*.85]].forEach(([ex,ey])=>{
    x.beginPath();x.ellipse(ex,ey,isTezcat?4.5:3,isTezcat?3:2,0,0,Math.PI*2);x.fill();
  });
  x.globalAlpha=1;
  // Weapon/special glow indicator
  if(isTezcat){
    x.strokeStyle='rgba(200,128,10,.5)';x.lineWidth=2;
    x.beginPath();x.ellipse(gx,gy-ht*.55,35,35,0,0,Math.PI*2);x.stroke();
    x.setLineDash([4,3]);x.strokeStyle='rgba(200,128,10,.25)';
    x.beginPath();x.ellipse(gx,gy-ht*.55,50,50,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
  }
  // Name label
  x.fillStyle=isTezcat?'rgba(255,215,0,.85)':'rgba(200,128,10,.55)';
  x.font=(isTezcat?11:9)+'px Georgia';x.textAlign='center';
  x.fillText(g.name,gx,gy+20);
});
// Central divine smoke
x.globalAlpha=.12;
const csmoke=x.createRadialGradient(960,500,0,960,500,600);
csmoke.addColorStop(0,'#6644aa');csmoke.addColorStop(1,'transparent');
x.fillStyle=csmoke;x.fillRect(0,0,1920,1080);
x.globalAlpha=1;
</script></body></html>` },

// ── 8. LOADING / TITLE SCREEN ───────────────────────────────────────────────
{ name: '08_Loading_Screen', w: 1920, h: 1080, html: `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1920px;height:1080px;overflow:hidden;background:#000;font-family:Georgia,serif}
canvas{position:absolute;left:0;top:0}
.txt{position:absolute;inset:0;z-index:10;pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center}
.eyeglyph{font-size:64px;margin-bottom:24px;text-shadow:0 0 40px rgba(255,24,0,.9);filter:drop-shadow(0 0 20px rgba(255,24,0,.6))}
.sub{font-size:12px;letter-spacing:12px;color:rgba(200,128,10,.7);text-transform:uppercase;margin-bottom:18px}
.main{font-size:110px;font-weight:900;color:#fff;text-shadow:0 0 80px rgba(255,24,0,.9),0 0 160px rgba(255,24,0,.4);letter-spacing:12px;line-height:1}
.of{font-size:32px;letter-spacing:18px;color:rgba(255,215,0,.75);margin:10px 0}
.gods{font-size:124px;font-weight:900;color:#fff;text-shadow:0 0 80px rgba(200,128,10,.9),0 0 160px rgba(255,215,0,.3);letter-spacing:14px}
.divline{width:500px;height:2px;background:linear-gradient(to right,transparent,rgba(255,215,0,.7),rgba(255,24,0,.9),rgba(255,215,0,.7),transparent);margin:22px 0}
.loc{font-size:18px;letter-spacing:16px;color:rgba(200,128,10,.7);text-transform:uppercase}
.tag{font-size:16px;font-style:italic;color:rgba(220,190,140,.65);margin-top:14px;letter-spacing:2px}
.press{position:absolute;bottom:80px;font-size:12px;letter-spacing:10px;color:rgba(200,128,10,.55);text-transform:uppercase}
.vig{position:absolute;inset:0;z-index:9;background:radial-gradient(ellipse 85% 85% at 50% 50%,transparent 20%,rgba(0,0,0,.12) 55%,rgba(0,0,0,.7) 100%)}
.border{position:absolute;inset:0;border:4px solid rgba(200,128,10,.28);z-index:11;pointer-events:none}
</style></head><body>
<canvas id="c" width="1920" height="1080"></canvas>
<div class="txt">
  <div class="eyeglyph">𓂀</div>
  <div class="sub">Pixel Agents Studio &nbsp;·&nbsp; Presents</div>
  <div class="main">WAR OF THE</div>
  <div class="of">· · · · ·</div>
  <div class="gods">GODS</div>
  <div class="divline"></div>
  <div class="loc">Tenochtitlan &nbsp;·&nbsp; The Digital Descent</div>
  <div class="tag">"The battle begins before the first sword is swung."</div>
  <div class="press">Press Any Key to Begin</div>
</div>
<div class="vig"></div>
<div class="border"></div>
<script>
const c=document.getElementById('c'),x=c.getContext('2d');
const bg=x.createRadialGradient(960,540,0,960,540,1100);
bg.addColorStop(0,'#120a28');bg.addColorStop(.3,'#0a0618');bg.addColorStop(.6,'#070414');bg.addColorStop(1,'#030109');
x.fillStyle=bg;x.fillRect(0,0,1920,1080);
// Stars
for(let i=0;i<300;i++){
  const sx=Math.random()*1920,sy=Math.random()*1080,sv=Math.random();
  x.fillStyle=sv>.9?'rgba(255,215,0,'+(sv*.2+.04)+')':'rgba(255,255,255,'+(sv*.1+.015)+')';
  x.beginPath();x.ellipse(sx,sy,sv*.9+.2,sv*.9+.2,0,0,Math.PI*2);x.fill();
}
// Central divine aura
const ca=x.createRadialGradient(960,540,0,960,540,600);
ca.addColorStop(0,'rgba(100,50,180,.2)');ca.addColorStop(.4,'rgba(70,30,140,.1)');ca.addColorStop(1,'transparent');
x.fillStyle=ca;x.fillRect(0,0,1920,1080);
// Sun corona rings
x.globalAlpha=.06;
[350,300,250,200].forEach((r,i)=>{
  x.strokeStyle=i%2===0?'rgba(200,128,10,1)':'rgba(255,24,0,1)';
  x.lineWidth=i%2===0?2:1;
  x.beginPath();x.ellipse(960,540,r,r,0,0,Math.PI*2);x.stroke();
});
x.globalAlpha=1;
// Aztec calendar ring outer (decorative)
x.globalAlpha=.055;
x.strokeStyle='rgba(200,128,10,1)';x.lineWidth=14;
x.beginPath();x.ellipse(960,540,480,480,0,0,Math.PI*2);x.stroke();
x.setLineDash([22,14]);x.strokeStyle='rgba(255,215,0,1)';x.lineWidth=4;
x.beginPath();x.ellipse(960,540,480,480,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
x.globalAlpha=1;
// Obsidian smoke columns (left and right)
const smLeft=x.createLinearGradient(0,0,320,1080);
smLeft.addColorStop(0,'rgba(22,10,42,.7)');smLeft.addColorStop(.5,'rgba(14,8,28,.5)');smLeft.addColorStop(1,'rgba(6,4,14,.8)');
x.fillStyle=smLeft;x.beginPath();
x.moveTo(0,0);x.quadraticCurveTo(200,200,180,400);x.quadraticCurveTo(160,600,200,800);x.quadraticCurveTo(220,950,0,1080);x.fill();
const smRight=x.createLinearGradient(1920,0,1600,1080);
smRight.addColorStop(0,'rgba(22,10,42,.7)');smRight.addColorStop(.5,'rgba(14,8,28,.5)');smRight.addColorStop(1,'rgba(6,4,14,.8)');
x.fillStyle=smRight;x.beginPath();
x.moveTo(1920,0);x.quadraticCurveTo(1720,200,1740,400);x.quadraticCurveTo(1760,600,1720,800);x.quadraticCurveTo(1700,950,1920,1080);x.fill();
// Ground ember
const gg=x.createLinearGradient(0,900,0,1080);
gg.addColorStop(0,'transparent');gg.addColorStop(.5,'rgba(200,80,10,.12)');gg.addColorStop(1,'rgba(255,30,0,.07)');
x.fillStyle=gg;x.fillRect(0,900,1920,180);
// Conch shell dots (decorative border)
x.fillStyle='rgba(200,128,10,.2)';
for(let i=80;i<1840;i+=80){
  x.beginPath();x.ellipse(i,22,3,3,0,0,Math.PI*2);x.fill();
  x.beginPath();x.ellipse(i,1058,3,3,0,0,Math.PI*2);x.fill();
}
for(let i=60;i<1020;i+=80){
  x.beginPath();x.ellipse(22,i,3,3,0,0,Math.PI*2);x.fill();
  x.beginPath();x.ellipse(1898,i,3,3,0,0,Math.PI*2);x.fill();
}
</script></body></html>` },

];

async function run() {
  const browser = await chromium.launch();
  for (const img of IMAGES) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: img.w, height: img.h });
    await page.setContent(img.html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const out = path.join(OUT, img.name + '.png');
    await page.screenshot({ path: out, fullPage: false });
    await page.close();
    console.log('✓', img.name + '.png');
  }
  await browser.close();
  console.log('\nAll 8 images saved to:', OUT);
}
run().catch(e => { console.error(e); process.exit(1); });
