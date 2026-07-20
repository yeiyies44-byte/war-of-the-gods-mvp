'use strict';

// ─── constants from the game ───────────────────────────────────────────────
const W = 800, H = 480;
const PLAT = { x:180, y:352, w:440, h:28 };
const BASE_SPD=3.4, BASE_J=-11.5, BASE_DJ=-9.8, GRAV=0.52, MAXFALL=15, FRIC=0.80;

const GODS = [
  { name:'TEZCATLIPOCA', short:'TEZCAT',  title:'The Smoking Mirror',    specName:'SHADOW DASH',
    stat:[5,4,3,2], sm:1.2, jm:1.0,  dm:1.0, wm:0.8 },
  { name:'QUETZALCOATL', short:'QUETZ',   title:'The Feathered Serpent', specName:'FEATHER STORM',
    stat:[3,5,3,2], sm:0.9, jm:1.15, dm:0.9, wm:0.7, triJump:true },
  { name:'HUITZILOPOCHTLI',short:'HUITZIL',title:'God of Sun & War',     specName:'SOLAR SLAM',
    stat:[3,3,5,5], sm:0.85,jm:0.85, dm:1.4, wm:1.5 },
  { name:'TLALOC',         short:'TLALOC', title:'God of Rain & Thunder', specName:'THUNDER BOLT',
    stat:[3,4,4,4], sm:0.95,jm:1.05, dm:1.1, wm:1.2 },
  { name:'XIPE TOTEC',     short:'XIPE',   title:'The Flayed One',        specName:'BLOOD FRENZY',
    stat:[4,3,4,3], sm:1.0, jm:0.9,  dm:1.2, wm:1.0 },
  { name:'COATLICUE',      short:'COATL',  title:'She of the Serpent Skirt',specName:'SERPENT PAIR',
    stat:[4,3,5,4], sm:0.9, jm:0.85, dm:1.3, wm:1.3 },
  { name:'CHALCHIHUITLICUE',short:'CHALCHI',title:'She of the Jade Skirt',specName:'JADE TORRENT',
    stat:[3,5,3,2], sm:1.1, jm:1.1,  dm:0.9, wm:0.7 },
  { name:'MICTLANTECUHTLI',short:'MICTLAN',title:'Lord of the Dead',      specName:'BONE RAIN',
    stat:[3,2,5,5], sm:0.75,jm:0.7,  dm:1.5, wm:1.7 },
  { name:'MICTECACIHUATL', short:'MICTECA',title:'Lady of the Dead',      specName:'DEATH BLOOM',
    stat:[4,4,4,3], sm:1.0, jm:0.95, dm:1.2, wm:1.0 },
  { name:'TONATIUH',       short:'TONATI', title:'Movement of the Sun',   specName:'SOLAR FLARE',
    stat:[4,2,3,5], sm:1.1, jm:0.9,  dm:1.5, wm:0.75},
  { name:'XOLOTL',         short:'XOLOTL', title:'The Dark Twin',         specName:'SHADOW STEP',
    stat:[5,4,2,2], sm:1.35,jm:1.2,  dm:1.1, wm:0.7 },
  { name:'COYOLXAUHQUI',   short:'COYO',   title:'The Painted Moon',      specName:'CRESCENT BLADE',
    stat:[3,5,2,3], sm:1.0, jm:1.05, dm:1.3, wm:0.9 },
  { name:'OMETEOTL',       short:'OMETE',  title:'The Dual Creator',      specName:'ENERGY SHIFT',
    stat:[3,4,3,3], sm:1.0, jm:1.0,  dm:1.1, wm:1.0 },
  { name:'TLALTECUHTLI',   short:'TLALT',  title:'The Devouring Earth',   specName:'FISSURE STOMP',
    stat:[2,2,5,5], sm:0.8, jm:0.75, dm:1.3, wm:1.8 },
  { name:'TLAZOLTEOTL',    short:'TLAZO',  title:'Eater of Filth',        specName:'STEAM PURGE',
    stat:[4,4,3,3], sm:0.95,jm:0.9,  dm:1.2, wm:1.0 },
  { name:'XOCHIPILLI',     short:'XOCHI',  title:'Prince of Flowers',     specName:'PETAL DANCE',
    stat:[4,4,3,2], sm:1.15,jm:1.1,  dm:0.9, wm:0.75},
  { name:'XOCHIQUETZAL',   short:'XOQUET', title:'The Precious Feather Flower',specName:'SILK THREAD',
    stat:[3,4,3,3], sm:1.05,jm:1.1,  dm:1.0, wm:0.85},
];

const SPEC_CD = [150,120,190,140,280,160,110,220,170,200,155,175,215,245,185,160,195];

const DIFF_AI = [
  { tMin:50, tRng:65, atkR:62,  jCh:0.006, sMult:0.30, aCh:0.38 },
  { tMin:20, tRng:40, atkR:85,  jCh:0.012, sMult:1.00, aCh:0.60 },
  { tMin:5,  tRng:13, atkR:108, jCh:0.030, sMult:2.60, aCh:0.88 },
];

// ─── seeded RNG so the run is reproducible ─────────────────────────────────
let seed = 42;
function rand() {
  seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296);
}

// ─── fighter factory ────────────────────────────────────────────────────────
function makeFighter(x, godIdx, isAI, isP2) {
  const mj = GODS[godIdx].triJump ? 3 : 2;
  return {
    x, y:280, vx:0, vy:0, w:26, h:40,
    onGround:false, jumpsLeft:mj, maxJumps:mj,
    facing:isP2?-1:1, djTimer:0, stepT:0,
    hp:100, maxHp:100, godIdx, isAI, isP2,
    atkTimer:0, atkCD:0, hitbox:null,
    hitstun:0, knockCD:0,
    aiState:'CHASE', aiTimer:0, aiJumpCD:0,
    specialCD:0, rage:0, _ometeStance:false,
  };
}

// ─── physics ─────────────────────────────────────────────────────────────
function stepFighter(f, il, ir, ij, ia) {
  if(f.hitstun>0){f.hitstun--;il=ir=ij=ia=false;}
  const g=GODS[f.godIdx], spd=BASE_SPD*g.sm;
  if      (il){f.vx=-spd;f.facing=-1;}
  else if (ir){f.vx= spd;f.facing= 1;}
  else        {f.vx*=FRIC;if(Math.abs(f.vx)<0.1)f.vx=0;}
  if(f.onGround&&Math.abs(f.vx)>0.3) f.stepT++;
  else if(f.onGround) f.stepT=0;
  if(ij&&f.jumpsLeft>0){
    f.vy=(f.jumpsLeft===f.maxJumps?BASE_J:BASE_DJ)*g.jm;
    f.jumpsLeft--;
    if(f.jumpsLeft<f.maxJumps-1) f.djTimer=18;
  }
  f.vy=Math.min(f.vy+GRAV,MAXFALL);
  f.x+=f.vx; f.y+=f.vy;
  if(f.djTimer>0) f.djTimer--;
  if(f.atkCD>0)   f.atkCD--;
  if(f.knockCD>0) f.knockCD--;
  if(ia&&f.atkCD===0){f.atkTimer=14;f.atkCD=30;}
  if(f.atkTimer>0){
    f.atkTimer--;
    f.hitbox={x:f.facing===1?f.x+f.w:f.x-30,y:f.y+4,w:30,h:26};
    if(f.atkTimer===0) f.hitbox=null;
  } else f.hitbox=null;
  f.onGround=false;
  const pfy=(f.y-f.vy)+f.h;
  if(f.vy>=0&&pfy<=PLAT.y+1&&f.y+f.h>=PLAT.y&&f.x+f.w>PLAT.x+6&&f.x<PLAT.x+PLAT.w-6){
    f.y=PLAT.y-f.h;f.vy=0;f.onGround=true;f.jumpsLeft=f.maxJumps;
  }
  if(f.specialCD>0) f.specialCD--;
  if(f.rage>0) f.rage--;
}

// ─── AI ──────────────────────────────────────────────────────────────────
function aiTick(ai, tgt, difficulty) {
  let il=false,ir=false,ij=false,ia=false,is=false;
  const d=DIFF_AI[difficulty];
  const dx=tgt.x-ai.x, dist=Math.abs(dx);
  ai.aiTimer--;
  if(ai.aiTimer<=0){
    ai.aiTimer=d.tMin+Math.floor(rand()*d.tRng);
    if(dist>180)                              ai.aiState='CHASE';
    else if(dist<70&&rand()<d.aCh)            ai.aiState='ATTACK';
    else if(dist<70)                          ai.aiState='RETREAT';
    else                                      ai.aiState=rand()<.5?'CHASE':'ATTACK';
  }
  if(ai.aiState==='CHASE')   {ir=dx>20;il=dx<-20;}
  if(ai.aiState==='ATTACK')  {ir=dx>10;il=dx<-10;ia=dist<d.atkR;}
  if(ai.aiState==='RETREAT') {il=dx>0;ir=dx<0;}
  if(ai.aiJumpCD>0) ai.aiJumpCD--;
  if(ai.onGround&&ai.aiJumpCD===0&&
    (rand()<d.jCh||ai.x<PLAT.x+20||ai.x>PLAT.x+PLAT.w-50)){ij=true;ai.aiJumpCD=55;}
  if(ai.specialCD===0){
    const m=d.sMult;
    const p=[
      dist>55&&dist<190&&rand()<.018*m,
      dist<160&&ai.onGround&&rand()<.014*m,
      dist<90&&rand()<.010*m,
      dist>30&&rand()<.013*m,
      dist<110&&rand()<.009*m,
      dist<160&&rand()<.012*m,
      dist>40&&dist<200&&rand()<.015*m,
      rand()<.010*m,
      dist<130&&rand()<.011*m,
      dist>30&&dist<200&&rand()<.014*m,
      dist<100&&rand()<.016*m,
      rand()<.012*m,
      dist>0&&rand()<.013*m,
      dist<120&&ai.onGround&&rand()<.011*m,
      dist<160&&rand()<.013*m,
      dist>40&&dist<180&&rand()<.014*m,
      dist>40&&dist<180&&rand()<.013*m,
    ];
    if(p[ai.godIdx]) is=true;
  }
  return {il,ir,ij,ia,is};
}

// ─── hit detection ────────────────────────────────────────────────────────
function doHits(F, events) {
  for(let a=0;a<2;a++){
    const att=F[a],def=F[1-a];
    if(!att.hitbox||att.knockCD>0) continue;
    const h=att.hitbox;
    if(h.x<def.x+def.w&&h.x+h.w>def.x&&h.y<def.y+def.h&&h.y+h.h>def.y){
      const ga=GODS[att.godIdx],gd=GODS[def.godIdx];
      const rageMult=att.rage>0?1.8:1.0;
      const dmg=Math.round((7+rand()*8)*ga.dm*rageMult);
      def.hp=Math.max(0,def.hp-dmg);
      const fr=1-def.hp/def.maxHp;
      def.vx=att.facing*(5+fr*14)/gd.wm;
      def.vy=-6-fr*5;
      def.hitstun=18+Math.floor(fr*16);
      att.knockCD=10; att.hitbox=null;
      events.push(`  HIT! ${GODS[att.godIdx].short}→${GODS[def.godIdx].short}: -${dmg}hp (${def.hp} remaining)`);
    }
  }
}

// ─── specials ─────────────────────────────────────────────────────────────
function doSpecial(f, fIdx, F, specials, events) {
  f.specialCD = SPEC_CD[f.godIdx];
  events.push(`  ★ SPECIAL: ${GODS[f.godIdx].short} uses ${GODS[f.godIdx].specName}!`);
  switch(f.godIdx){
    case 0:{ // Tezcatlipoca — Shadow Dash
      const startX=f.x;
      f.x=Math.max(0,Math.min(W-f.w,f.x+f.facing*165));
      const sx=Math.min(startX,f.x)-6,ex=Math.max(startX+f.w,f.x+f.w)+6;
      specials.push({type:'sweep',x:sx,y:f.y-6,w:ex-sx,h:f.h+12,
        owner:fIdx,damage:16,life:8,maxLife:8,hit:false});
      break;}
    case 1:{ // Quetzalcoatl — Feather Storm
      [-0.28,0,0.28].forEach(angle=>{
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:Math.cos(angle)*5.5*f.facing,vy:Math.sin(angle)*5.5,
          r:6,owner:fIdx,damage:12,life:70,maxLife:70,hit:false});
      });
      break;}
    case 2:{ // Huitzilopochtli — Solar Slam
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:28,life:35,maxLife:35,hit:false,r:0});
      break;}
    case 3:{ // Tlaloc — Thunder Bolt
      specials.push({type:'orb',x:f.facing===1?f.x+f.w:f.x,y:f.y+f.h*0.4,
        vx:f.facing*3.5,vy:0,r:9,owner:fIdx,damage:19,life:130,maxLife:130,hit:false});
      break;}
    case 4:{ // Xipe Totec — Blood Frenzy
      f.rage=185;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:0,life:20,maxLife:20,hit:true,r:0});
      break;}
    case 5:{ // Coatlicue — Serpent Pair
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.3,
        vx:f.facing*5.5,vy:-2.5,r:7,owner:fIdx,damage:13,life:78,maxLife:78,hit:false});
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.7,
        vx:f.facing*5.5,vy:2.5,r:7,owner:fIdx,damage:13,life:78,maxLife:78,hit:false});
      break;}
    case 6:{ // Chalchihuitlicue — Jade Torrent
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
        vx:f.facing*8.0,vy:0,r:15,owner:fIdx,damage:18,life:60,maxLife:60,hit:false});
      break;}
    case 7:{ // Mictlantecuhtli — Bone Rain
      const tx=F[1-fIdx].x+F[1-fIdx].w/2;
      for(let bi=0;bi<5;bi++){
        specials.push({type:'orb',x:tx+(bi-2)*26,y:-18,
          vx:(bi-2)*0.4,vy:6.5+rand()*1.5,r:5,
          owner:fIdx,damage:14,life:85,maxLife:85,hit:false});
      }
      break;}
    case 8:{ // Mictecacihuatl — Death Bloom
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:20,life:38,maxLife:38,hit:false,r:0});
      [-1,0,1].forEach(dir=>{
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:f.facing*4.0,vy:dir*5.0,r:6,
          owner:fIdx,damage:10,life:55,maxLife:55,hit:false});
      });
      break;}
    case 9:{ // Tonatiuh — Solar Flare
      const tgt9=F[1-fIdx];
      const dx9=(tgt9.x+tgt9.w/2)-(f.x+f.w/2), dy9=(tgt9.y+tgt9.h/2)-(f.y+f.h/2);
      const d9=Math.hypot(dx9,dy9)||1;
      const missingHp=1-tgt9.hp/tgt9.maxHp;
      const bonusDmg=Math.round(14+missingHp*22);
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.4,
        vx:(dx9/d9)*11,vy:(dy9/d9)*11,
        r:5,owner:fIdx,damage:bonusDmg,life:55,maxLife:55,hit:false});
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.4,
        vx:(dx9/d9)*11+f.facing*0.6,vy:(dy9/d9)*11+0.5,
        r:3,owner:fIdx,damage:9,life:55,maxLife:55,hit:false});
      break;}
    case 10:{ // Xolotl — Shadow Step
      const tgt10=F[1-fIdx];
      f.x=Math.max(0,Math.min(W-f.w,tgt10.x+tgt10.facing*-40));
      f.y=tgt10.y; f.facing=tgt10.facing;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:20,life:18,maxLife:18,hit:false,r:0});
      break;}
    case 11:{ // Coyolxauhqui — Crescent Blade
      [-0.22,0,0.22].forEach((angle,i)=>{
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
          vx:Math.cos(angle)*6.5*f.facing,vy:Math.sin(angle)*6.5,
          r:9-i*2,owner:fIdx,damage:14,life:72,maxLife:72,hit:false});
      });
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
        vx:-f.facing*4.8,vy:-4.0,
        r:7,owner:fIdx,damage:11,life:62,maxLife:62,hit:false});
      break;}
    case 12:{ // Ometeotl — Energy Shift
      f._ometeStance=!f._ometeStance;
      if(f._ometeStance){
        const tgt12=F[1-fIdx];
        const dx12=(tgt12.x+tgt12.w/2)-(f.x+f.w/2), dy12=(tgt12.y+tgt12.h/2)-(f.y+f.h/2);
        const d12=Math.hypot(dx12,dy12)||1;
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:(dx12/d12)*5.0,vy:(dy12/d12)*5.0,
          r:10,owner:fIdx,damage:24,life:80,maxLife:80,hit:false});
      } else {
        specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
          owner:fIdx,damage:16,life:40,maxLife:40,hit:false,r:0});
      }
      break;}
    case 13:{ // Tlaltecuhtli — Fissure Stomp
      const shockW=160,shockX=f.facing===1?f.x+f.w:f.x-shockW;
      specials.push({type:'sweep',x:shockX,y:f.y,w:shockW,h:f.h+8,
        owner:fIdx,damage:24,life:15,maxLife:15,hit:false});
      for(let bi=0;bi<4;bi++){
        specials.push({type:'orb',x:f.x+f.w/2+f.facing*(38+bi*30),y:f.y+f.h*0.5,
          vx:f.facing*(1.2+bi*0.5),vy:-4.5-bi*1.3,
          r:5,owner:fIdx,damage:9,life:58,maxLife:58,hit:false});
      }
      break;}
    case 14:{ // Tlazolteotl — Steam Purge
      specials.push({type:'sweep',x:f.facing===1?f.x+f.w:f.x-128,y:f.y-10,w:128,h:f.h+20,
        owner:fIdx,damage:20,life:22,maxLife:22,hit:false});
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:12,life:34,maxLife:34,hit:false,r:0});
      break;}
    case 15:{ // Xochipilli — Petal Dance
      [-0.45,-0.18,0,0.18,0.45].forEach((angle,i)=>{
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.35,
          vx:Math.cos(angle)*5.8*f.facing,vy:Math.sin(angle)*5.8-1.2,
          r:4+i%2,owner:fIdx,damage:11,life:65,maxLife:65,hit:false});
      });
      break;}
    case 16:{ // Xochiquetzal — Silk Thread
      const tgt16=F[1-fIdx];
      specials.push({type:'orb',x:tgt16.x+tgt16.w/2,y:tgt16.y+tgt16.h*0.3,
        vx:0,vy:0,r:14,owner:fIdx,damage:18,life:42,maxLife:42,hit:false});
      const dx16=tgt16.x-f.x;
      f.x=Math.max(0,Math.min(W-f.w,f.x+dx16*0.55));
      f.facing=dx16>0?1:-1;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:0,life:16,maxLife:16,hit:true,r:0});
      break;}
  }
}

function updateSpecials(specials, F, events) {
  for(const s of specials){
    s.life--;
    if(s.type==='orb')  {s.x+=s.vx;s.y+=s.vy;}
    if(s.type==='solar'){s.r=Math.min(68,s.r+4.8);}
  }
  for(const s of specials){
    if(s.hit||s.type==='afterimage'||(s.type==='sweep'&&s.life<0)) continue;
    const def=F[1-s.owner];
    if(!def||def.hp<=0) continue;
    let hit=false;
    if(s.type==='orb'){
      const nx=Math.max(def.x,Math.min(s.x,def.x+def.w));
      const ny=Math.max(def.y,Math.min(s.y,def.y+def.h));
      hit=Math.hypot(s.x-nx,s.y-ny)<s.r;
    }
    if(s.type==='solar'&&s.damage>0){
      const nx=Math.max(def.x,Math.min(s.x,def.x+def.w));
      const ny=Math.max(def.y,Math.min(s.y,def.y+def.h));
      hit=Math.hypot(s.x-nx,s.y-ny)<s.r;
    }
    if(s.type==='sweep'){
      hit=s.x<def.x+def.w&&s.x+s.w>def.x&&s.y<def.y+def.h&&s.y+s.h>def.y;
    }
    if(hit){
      const att=F[s.owner],gd=GODS[def.godIdx];
      const rageMult=att&&att.rage>0?1.8:1.0;
      const fr=1-def.hp/def.maxHp;
      const dmg=Math.round(s.damage*rageMult);
      def.hp=Math.max(0,def.hp-dmg);
      if(s.type==='solar'){
        const ang=Math.atan2(def.y+def.h/2-s.y,def.x+def.w/2-s.x);
        def.vx=Math.cos(ang)*(7+fr*9)/gd.wm;
        def.vy=Math.sin(ang)*(7+fr*9)-4;
      } else {
        const dir=s.type==='sweep'?(F[s.owner]?.facing||1):(s.vx>=0?1:-1);
        def.vx=dir*(5+fr*12)/gd.wm;
        def.vy=-6-fr*4;
      }
      def.hitstun=18+Math.floor(fr*14);
      s.hit=true;
      events.push(`  SPECIAL HIT! ${GODS[s.owner].short}→${GODS[def.godIdx].short}: -${dmg}hp  [${GODS[s.owner].specName}] (${def.hp} remaining)`);
    }
  }
  const before = specials.length;
  while(specials.length) specials.pop();
  const kept = [];
  for(const s of [...Array(before)].map((_,i)=>specials[i]).filter(Boolean)) {
    // can't do this, let's filter differently
  }
}

// ─── simple bar renderer ───────────────────────────────────────────────────
function hpBar(hp, maxHp, width=20) {
  const filled = Math.round((hp/maxHp)*width);
  return '[' + '█'.repeat(filled) + '░'.repeat(width-filled) + `] ${hp}`;
}

function renderFrame(F, frame, events) {
  const p = F[0], e = F[1];
  const pg = GODS[p.godIdx], eg = GODS[e.godIdx];
  const dist = Math.abs(p.x - e.x);

  const pPos = p.onGround ? 'ground' : `air(${Math.round(p.vy)})`;
  const ePos = e.onGround ? 'ground' : `air(${Math.round(e.vy)})`;
  const pState = p.hitstun>0?'HITSTUN':p.atkTimer>0?'SWING':p.rage>0?'BERSERK':p.aiState||'fight';
  const eState = e.hitstun>0?'HITSTUN':e.atkTimer>0?'SWING':e.rage>0?'BERSERK':e.aiState;
  const pSpec = p.specialCD>0?`CD:${p.specialCD}`:'READY';
  const eSpec = e.specialCD>0?`CD:${e.specialCD}`:'READY';

  console.log(`\n┌─ Frame ${String(frame).padStart(4,'0')} ──────────────────────────────────────────────────────────┐`);
  console.log(`│ ${pg.short.padEnd(8)} ${hpBar(p.hp,p.maxHp)} [${pSpec}]  ${pPos} [${pState}]`);
  console.log(`│ ${eg.short.padEnd(8)} ${hpBar(e.hp,e.maxHp)} [${eSpec}]  ${ePos} [${eState}]`);
  console.log(`│ dist=${Math.round(dist)}  P1x=${Math.round(p.x)} P2x=${Math.round(e.x)}`);
  if(events.length) {
    for(const ev of events) console.log(`│${ev}`);
  }
  console.log(`└──────────────────────────────────────────────────────────────────────┘`);
}

// ─── Player "AI" — controls for Tezcatlipoca (P1, human side) ─────────────
// Simple but deliberate strategy: rush, attack, use Shadow Dash when off cooldown
function p1Think(me, enemy) {
  const dx = enemy.x - me.x;
  const dist = Math.abs(dx);
  let il=false, ir=false, ij=false, ia=false, is=false;

  // Face enemy
  if(dx > 0) ir = true; else il = true;

  // Attack when close enough
  if(dist < 70 && me.atkCD === 0 && me.hitstun === 0) ia = true;

  // Jump to follow if enemy is above or to escape hitstun
  if(!me.onGround && me.jumpsLeft > 0 && enemy.y < me.y - 30) ij = true;
  // Jump over enemy if too close and at edge
  if(me.onGround && (me.x < PLAT.x+30 || me.x > PLAT.x+PLAT.w-60)) ij = true;

  // Use Shadow Dash: when in range and cooldown ready
  if(me.specialCD === 0 && dist > 60 && dist < 200 && me.hitstun === 0) is = true;

  return {il, ir, ij, ia, is};
}

// ─── run one full fight ────────────────────────────────────────────────────
function runFight(p1GodIdx, p2GodIdx, difficulty, label) {
  const F = [
    makeFighter(280, p1GodIdx, false, false),
    makeFighter(490, p2GodIdx, true,  true),
  ];
  F[1].aiTimer = DIFF_AI[difficulty].tMin;

  let specials = [];
  let frame = 0;
  const MAX_FRAMES = 3600; // 60s at 60fps

  console.log(`\n${'═'.repeat(72)}`);
  console.log(`  FIGHT: ${GODS[p1GodIdx].name} vs ${GODS[p2GodIdx].name}`);
  console.log(`  ${GODS[p1GodIdx].title} vs ${GODS[p2GodIdx].title}`);
  console.log(`  Difficulty: ${['MACEHUAL','CUAUHTLI','TLATOANI'][difficulty]}`);
  console.log(`${'═'.repeat(72)}`);

  // only print every N frames to keep output readable
  const PRINT_EVERY = 30;
  let lastPrintedFrame = -1;

  while(frame < MAX_FRAMES) {
    frame++;
    const events = [];

    // P1 input (my strategy)
    const p1 = p1Think(F[0], F[1]);

    // P2 AI input
    const p2 = aiTick(F[1], F[0], difficulty);

    // step both fighters
    stepFighter(F[0], p1.il, p1.ir, p1.ij, p1.ia);
    if(p1.is && F[0].specialCD===0) doSpecial(F[0], 0, F, specials, events);

    stepFighter(F[1], p2.il, p2.ir, p2.ij, p2.ia);
    if(p2.is && F[1].specialCD===0) doSpecial(F[1], 1, F, specials, events);

    doHits(F, events);

    // update specials
    {
      for(const s of specials){
        s.life--;
        if(s.type==='orb')  {s.x+=s.vx;s.y+=s.vy;}
        if(s.type==='solar'){s.r=Math.min(68,s.r+4.8);}
      }
      for(const s of specials){
        if(s.hit||s.type==='afterimage'||(s.type==='sweep'&&s.life<0)) continue;
        const def=F[1-s.owner];
        if(!def||def.hp<=0) continue;
        let hit=false;
        if(s.type==='orb'){
          const nx=Math.max(def.x,Math.min(s.x,def.x+def.w));
          const ny=Math.max(def.y,Math.min(s.y,def.y+def.h));
          hit=Math.hypot(s.x-nx,s.y-ny)<s.r;
        }
        if(s.type==='solar'&&s.damage>0){
          const nx=Math.max(def.x,Math.min(s.x,def.x+def.w));
          const ny=Math.max(def.y,Math.min(s.y,def.y+def.h));
          hit=Math.hypot(s.x-nx,s.y-ny)<s.r;
        }
        if(s.type==='sweep'){
          hit=s.x<def.x+def.w&&s.x+s.w>def.x&&s.y<def.y+def.h&&s.y+s.h>def.y;
        }
        if(hit){
          const attF=F[s.owner],gd=GODS[def.godIdx];
          const rageMult=attF&&attF.rage>0?1.8:1.0;
          const fr=1-def.hp/def.maxHp;
          const dmg=Math.round(s.damage*rageMult);
          def.hp=Math.max(0,def.hp-dmg);
          if(s.type==='solar'){
            const ang=Math.atan2(def.y+def.h/2-s.y,def.x+def.w/2-s.x);
            def.vx=Math.cos(ang)*(7+fr*9)/gd.wm;
            def.vy=Math.sin(ang)*(7+fr*9)-4;
          } else {
            const dir=s.type==='sweep'?(F[s.owner]?.facing||1):(s.vx>=0?1:-1);
            def.vx=dir*(5+fr*12)/gd.wm;
            def.vy=-6-fr*4;
          }
          def.hitstun=18+Math.floor(fr*14);
          s.hit=true;
          events.push(`  SPECIAL HIT! ${GODS[s.owner].short}→${GODS[def.godIdx].short}: -${dmg}hp  [${GODS[s.owner].specName}] (${def.hp} remaining)`);
        }
      }
      const kept=specials.filter(s=>s.life>0&&s.y<H+80);
      specials.length=0; for(const s of kept) specials.push(s);
    }

    // push fighters apart
    {
      const a=F[0],b=F[1];
      if(Math.abs((a.y+a.h)-(b.y+b.h))<24){
        const overlap=Math.min(a.x+a.w-b.x, b.x+b.w-a.x);
        if(overlap>0){
          const push=overlap*0.5+0.5;
          if(a.x<b.x){a.x-=push;b.x+=push;}
          else        {a.x+=push;b.x-=push;}
        }
      }
    }

    // print on events or every PRINT_EVERY frames
    if(events.length > 0 || frame % PRINT_EVERY === 0) {
      if(frame !== lastPrintedFrame) {
        renderFrame(F, frame, events);
        lastPrintedFrame = frame;
      }
    }

    // check KO
    for(let i=0;i<2;i++){
      const f=F[i];
      if(f.hp<=0||f.y>H+120||f.x+f.w<-100||f.x>W+100){
        const wi=i===0?1:0;
        const winner = wi===0 ? GODS[p1GodIdx].short : GODS[p2GodIdx].short;
        const loser  = wi===0 ? GODS[p2GodIdx].short : GODS[p1GodIdx].short;
        const koType = f.hp<=0 ? 'KO' : f.y>H+120 ? 'RING OUT (fell)' : 'RING OUT (blasted)';
        console.log(`\n  ╔══════════════════════════════════════════╗`);
        console.log(`  ║  ${winner} WINS!  (${koType})  Frame ${frame}  ║`);
        console.log(`  ║  ${GODS[p1GodIdx].short}: ${F[0].hp}hp   ${GODS[p2GodIdx].short}: ${F[1].hp}hp  ║`);
        console.log(`  ╚══════════════════════════════════════════╝\n`);
        return { winner: wi, frame, p1hp: F[0].hp, p2hp: F[1].hp, koType };
      }
    }
  }
  console.log(`  TIME OVER — ${F[0].hp > F[1].hp ? GODS[p1GodIdx].short : GODS[p2GodIdx].short} wins on HP`);
  return { winner: F[0].hp > F[1].hp ? 0 : 1, frame, p1hp: F[0].hp, p2hp: F[1].hp, koType:'TIME' };
}

// ─── STORY MODE: Tezcatlipoca's campaign ──────────────────────────────────
const STORY_LEVELS = [
  { name:'The Rivalry Begins',    enemy:1  },
  { name:'Trial by Storm',        enemy:3  },
  { name:'The Obsidian Temple',   enemy:2  },
  { name:"The Temptation",        enemy:5  },
  { name:"The Mirror's Dream",    enemy:8  },
  { name:'The Rite of Renewal',   enemy:4  },
  { name:'The Jade Flood',        enemy:6  },
  { name:'The Shattered Moon',    enemy:11 },
  { name:"The Fifth Sun's Trial", enemy:9  },
  { name:'Garden of Ecstasy',     enemy:15 },
  { name:'The Steam Bath of Sins',enemy:14 },
  { name:'The Dark River',        enemy:10 },
  { name:'The Devouring Earth',   enemy:13 },
  { name:'The Ninth Level',       enemy:7  },
  { name:'Garden of Lost Souls',  enemy:16 },
  { name:'The Last Brotherhood',  enemy:1  },
  { name:'The Burning Guardian',  enemy:2  },
  { name:'The Serpent Judgment',  enemy:5  },
  { name:'The Dual Threshold',    enemy:12 },
  { name:'Beyond the 13th Heaven',enemy:12 },
];

const DIFFICULTY = 1; // CUAUHTLI (medium)

console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║         WAR OF THE GODS: TENOCHTITLAN  — STORY MODE                ║');
console.log('║         Playing as: TEZCATLIPOCA, The Smoking Mirror               ║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');

let wins=0, losses=0;
const results=[];

for(let lvl=0; lvl<STORY_LEVELS.length; lvl++){
  const lv = STORY_LEVELS[lvl];
  const ACT = lvl<5?'ACT I':lvl<10?'ACT II':lvl<15?'ACT III':'ACT IV';
  console.log(`\n\n  ── ${ACT} | Level ${lvl+1}: "${lv.name}" ──`);
  console.log(`     Tezcatlipoca vs ${GODS[lv.enemy].name}`);

  // best of 3 rounds
  let p1rw=0, p2rw=0, roundNum=0;
  while(p1rw<2 && p2rw<2) {
    roundNum++;
    console.log(`\n  [ Round ${roundNum} ]`);
    // reset seed per round for variety
    seed = 42 + lvl*1000 + roundNum*17;
    const res = runFight(0, lv.enemy, DIFFICULTY, lv.name);
    if(res.winner===0) p1rw++; else p2rw++;
  }
  const matchWin = p1rw >= 2;
  console.log(`\n  ══ MATCH RESULT: ${matchWin?'TEZCATLIPOCA VICTORIOUS':'DEFEAT'} (${p1rw}-${p2rw}) ══`);
  if(matchWin) wins++; else losses++;
  results.push({ level: lv.name, enemy: GODS[lv.enemy].name, p1rw, p2rw, win: matchWin });
}

console.log('\n\n');
console.log('╔══════════════════════════════════════════════════════════════════════╗');
console.log('║                    CAMPAIGN COMPLETE — SUMMARY                      ║');
console.log('╠══════════════════════════════════════════════════════════════════════╣');
for(const r of results){
  const icon = r.win ? '✓' : '✗';
  console.log(`║ ${icon} ${r.level.padEnd(28)} vs ${r.enemy.padEnd(18)} ${r.p1rw}-${r.p2rw} ║`);
}
console.log('╠══════════════════════════════════════════════════════════════════════╣');
console.log(`║  Wins: ${wins}/20   Losses: ${losses}/20  ${wins===20?'PERFECT CAMPAIGN!':''}`.padEnd(71)+'║');
console.log('╚══════════════════════════════════════════════════════════════════════╝');
