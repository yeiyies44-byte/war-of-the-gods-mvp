'use strict';

const W = 800, H = 480;
const PLAT = { x:180, y:352, w:440, h:28 };
const BASE_SPD=3.4, BASE_J=-11.5, BASE_DJ=-9.8, GRAV=0.52, MAXFALL=15, FRIC=0.80;

const GODS = [
  { name:'TEZCATLIPOCA',    short:'TEZCAT',   title:'The Smoking Mirror',       specName:'SHADOW DASH',    stat:[5,4,3,2], sm:1.2,  jm:1.0,  dm:1.0,  wm:0.8  },
  { name:'QUETZALCOATL',    short:'QUETZ',    title:'The Feathered Serpent',    specName:'FEATHER STORM',  stat:[3,5,3,2], sm:0.9,  jm:1.15, dm:0.9,  wm:0.7,  triJump:true },
  { name:'HUITZILOPOCHTLI', short:'HUITZIL',  title:'God of Sun & War',         specName:'SOLAR SLAM',     stat:[3,3,5,5], sm:0.85, jm:0.85, dm:1.4,  wm:1.5  },
  { name:'TLALOC',          short:'TLALOC',   title:'God of Rain & Thunder',    specName:'THUNDER BOLT',   stat:[3,4,4,4], sm:0.95, jm:1.05, dm:1.1,  wm:1.2  },
  { name:'XIPE TOTEC',      short:'XIPE',     title:'The Flayed One',           specName:'BLOOD FRENZY',   stat:[4,3,4,3], sm:1.0,  jm:0.9,  dm:1.2,  wm:1.0  },
  { name:'COATLICUE',       short:'COATL',    title:'She of the Serpent Skirt', specName:'SERPENT PAIR',   stat:[4,3,5,4], sm:0.9,  jm:0.85, dm:1.3,  wm:1.3  },
  { name:'CHALCHIHUITLICUE',short:'CHALCHI',  title:'She of the Jade Skirt',    specName:'JADE TORRENT',   stat:[3,5,3,2], sm:1.1,  jm:1.1,  dm:0.9,  wm:0.7  },
  { name:'MICTLANTECUHTLI', short:'MICTLAN',  title:'Lord of the Dead',         specName:'BONE RAIN',      stat:[3,2,5,5], sm:0.75, jm:0.7,  dm:1.5,  wm:1.7  },
  { name:'MICTECACIHUATL',  short:'MICTECA',  title:'Lady of the Dead',         specName:'DEATH BLOOM',    stat:[4,4,4,3], sm:1.0,  jm:0.95, dm:1.2,  wm:1.0  },
  { name:'TONATIUH',        short:'TONATI',   title:'Movement of the Sun',      specName:'SOLAR FLARE',    stat:[4,2,3,5], sm:1.1,  jm:0.9,  dm:1.5,  wm:0.75 },
  { name:'XOLOTL',          short:'XOLOTL',   title:'The Dark Twin',            specName:'SHADOW STEP',    stat:[5,4,2,2], sm:1.35, jm:1.2,  dm:1.1,  wm:0.7  },
  { name:'COYOLXAUHQUI',    short:'COYO',     title:'The Painted Moon',         specName:'CRESCENT BLADE', stat:[3,5,2,3], sm:1.0,  jm:1.05, dm:1.3,  wm:0.9  },
  { name:'OMETEOTL',        short:'OMETE',    title:'The Dual Creator',         specName:'ENERGY SHIFT',   stat:[3,4,3,3], sm:1.0,  jm:1.0,  dm:1.1,  wm:1.0  },
  { name:'TLALTECUHTLI',    short:'TLALT',    title:'The Devouring Earth',      specName:'FISSURE STOMP',  stat:[2,2,5,5], sm:0.8,  jm:0.75, dm:1.3,  wm:1.8  },
  { name:'TLAZOLTEOTL',     short:'TLAZO',    title:'Eater of Filth',           specName:'STEAM PURGE',    stat:[4,4,3,3], sm:0.95, jm:0.9,  dm:1.2,  wm:1.0  },
  { name:'XOCHIPILLI',      short:'XOCHI',    title:'Prince of Flowers',        specName:'PETAL DANCE',    stat:[4,4,3,2], sm:1.15, jm:1.1,  dm:0.9,  wm:0.75 },
  { name:'XOCHIQUETZAL',    short:'XOQUET',   title:'The Precious Feather Flower',specName:'SILK THREAD',  stat:[3,4,3,3], sm:1.05, jm:1.1,  dm:1.0,  wm:0.85 },
];

const SPEC_CD = [150,120,190,140,280,160,110,220,170,200,155,175,215,245,185,160,195];

const DIFF_AI = [
  { tMin:50, tRng:65, atkR:62,  jCh:0.006, sMult:0.30, aCh:0.38 },
  { tMin:20, tRng:40, atkR:85,  jCh:0.012, sMult:1.00, aCh:0.60 },
  { tMin:5,  tRng:13, atkR:108, jCh:0.030, sMult:2.60, aCh:0.88 },
];

// Seeded RNG — different seed each call for variety
let seed = 0;
function srand(s) { seed = s >>> 0; }
function rand() {
  seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296);
}

// ── fighter ──────────────────────────────────────────────────────────────
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

// ── physics ───────────────────────────────────────────────────────────────
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
    f.y=PLAT.y-f.h; f.vy=0; f.onGround=true; f.jumpsLeft=f.maxJumps;
  }
  if(f.specialCD>0) f.specialCD--;
  if(f.rage>0) f.rage--;
}

// ── AI ────────────────────────────────────────────────────────────────────
function aiTick(ai, tgt, diff) {
  let il=false,ir=false,ij=false,ia=false,is=false;
  const d=DIFF_AI[diff];
  const dx=tgt.x-ai.x, dist=Math.abs(dx);
  ai.aiTimer--;
  if(ai.aiTimer<=0){
    ai.aiTimer=d.tMin+Math.floor(rand()*d.tRng);
    if(dist>180)                          ai.aiState='CHASE';
    else if(dist<70&&rand()<d.aCh)        ai.aiState='ATTACK';
    else if(dist<70)                      ai.aiState='RETREAT';
    else                                  ai.aiState=rand()<.5?'CHASE':'ATTACK';
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

// ── specials ──────────────────────────────────────────────────────────────
function doSpecial(f, fIdx, F, specials) {
  f.specialCD = SPEC_CD[f.godIdx];
  switch(f.godIdx){
    case 0:{ // Shadow Dash — teleport toward enemy, leave sweep
      const startX=f.x;
      f.x=Math.max(PLAT.x+10,Math.min(PLAT.x+PLAT.w-f.w-10, f.x+f.facing*140));
      const sx=Math.min(startX,f.x)-6, ex=Math.max(startX+f.w,f.x+f.w)+6;
      specials.push({type:'sweep',x:sx,y:f.y-6,w:ex-sx,h:f.h+12,
        owner:fIdx,damage:16,life:8,maxLife:8,hit:false});
      break;}
    case 1:{ // Feather Storm
      [-0.28,0,0.28].forEach(a=>{
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:Math.cos(a)*5.5*f.facing,vy:Math.sin(a)*5.5,
          r:6,owner:fIdx,damage:12,life:70,maxLife:70,hit:false});
      }); break;}
    case 2:{ // Solar Slam
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:28,life:35,maxLife:35,hit:false,r:0}); break;}
    case 3:{ // Thunder Bolt
      specials.push({type:'orb',x:f.facing===1?f.x+f.w:f.x,y:f.y+f.h*0.4,
        vx:f.facing*3.5,vy:0,r:9,owner:fIdx,damage:19,life:130,maxLife:130,hit:false}); break;}
    case 4:{ // Blood Frenzy
      f.rage=185;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:0,life:20,maxLife:20,hit:true,r:0}); break;}
    case 5:{ // Serpent Pair
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.3,
        vx:f.facing*5.5,vy:-2.5,r:7,owner:fIdx,damage:13,life:78,maxLife:78,hit:false});
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.7,
        vx:f.facing*5.5,vy:2.5,r:7,owner:fIdx,damage:13,life:78,maxLife:78,hit:false}); break;}
    case 6:{ // Jade Torrent
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
        vx:f.facing*8.0,vy:0,r:15,owner:fIdx,damage:18,life:60,maxLife:60,hit:false}); break;}
    case 7:{ // Bone Rain
      const tx=F[1-fIdx].x+F[1-fIdx].w/2;
      for(let bi=0;bi<5;bi++)
        specials.push({type:'orb',x:tx+(bi-2)*26,y:-18,
          vx:(bi-2)*0.4,vy:6.5+rand()*1.5,r:5,
          owner:fIdx,damage:14,life:85,maxLife:85,hit:false}); break;}
    case 8:{ // Death Bloom
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:20,life:38,maxLife:38,hit:false,r:0});
      [-1,0,1].forEach(dir=>
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:f.facing*4.0,vy:dir*5.0,r:6,
          owner:fIdx,damage:10,life:55,maxLife:55,hit:false})); break;}
    case 9:{ // Solar Flare
      const tgt9=F[1-fIdx];
      const dx9=(tgt9.x+tgt9.w/2)-(f.x+f.w/2),dy9=(tgt9.y+tgt9.h/2)-(f.y+f.h/2);
      const d9=Math.hypot(dx9,dy9)||1;
      const bonus=Math.round(14+(1-tgt9.hp/tgt9.maxHp)*22);
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.4,
        vx:(dx9/d9)*11,vy:(dy9/d9)*11,
        r:5,owner:fIdx,damage:bonus,life:55,maxLife:55,hit:false}); break;}
    case 10:{ // Shadow Step
      const tgt10=F[1-fIdx];
      f.x=Math.max(0,Math.min(W-f.w,tgt10.x+tgt10.facing*-40));
      f.y=tgt10.y; f.facing=tgt10.facing;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:20,life:18,maxLife:18,hit:false,r:0}); break;}
    case 11:{ // Crescent Blade
      [-0.22,0,0.22].forEach((a,i)=>
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
          vx:Math.cos(a)*6.5*f.facing,vy:Math.sin(a)*6.5,
          r:9-i*2,owner:fIdx,damage:14,life:72,maxLife:72,hit:false}));
      specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.45,
        vx:-f.facing*4.8,vy:-4.0,r:7,owner:fIdx,damage:11,life:62,maxLife:62,hit:false}); break;}
    case 12:{ // Energy Shift
      f._ometeStance=!f._ometeStance;
      if(f._ometeStance){
        const tgt12=F[1-fIdx];
        const dx12=(tgt12.x+tgt12.w/2)-(f.x+f.w/2),dy12=(tgt12.y+tgt12.h/2)-(f.y+f.h/2);
        const d12=Math.hypot(dx12,dy12)||1;
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h/2,
          vx:(dx12/d12)*5.0,vy:(dy12/d12)*5.0,
          r:10,owner:fIdx,damage:24,life:80,maxLife:80,hit:false});
      } else {
        specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
          owner:fIdx,damage:16,life:40,maxLife:40,hit:false,r:0});
      } break;}
    case 13:{ // Fissure Stomp
      const shockW=160,shockX=f.facing===1?f.x+f.w:f.x-shockW;
      specials.push({type:'sweep',x:shockX,y:f.y,w:shockW,h:f.h+8,
        owner:fIdx,damage:24,life:15,maxLife:15,hit:false});
      for(let bi=0;bi<4;bi++)
        specials.push({type:'orb',x:f.x+f.w/2+f.facing*(38+bi*30),y:f.y+f.h*0.5,
          vx:f.facing*(1.2+bi*0.5),vy:-4.5-bi*1.3,
          r:5,owner:fIdx,damage:9,life:58,maxLife:58,hit:false}); break;}
    case 14:{ // Steam Purge
      specials.push({type:'sweep',x:f.facing===1?f.x+f.w:f.x-128,y:f.y-10,w:128,h:f.h+20,
        owner:fIdx,damage:20,life:22,maxLife:22,hit:false});
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:12,life:34,maxLife:34,hit:false,r:0}); break;}
    case 15:{ // Petal Dance
      [-0.45,-0.18,0,0.18,0.45].forEach((a,i)=>
        specials.push({type:'orb',x:f.x+f.w/2,y:f.y+f.h*0.35,
          vx:Math.cos(a)*5.8*f.facing,vy:Math.sin(a)*5.8-1.2,
          r:4+i%2,owner:fIdx,damage:11,life:65,maxLife:65,hit:false})); break;}
    case 16:{ // Silk Thread
      const tgt16=F[1-fIdx];
      specials.push({type:'orb',x:tgt16.x+tgt16.w/2,y:tgt16.y+tgt16.h*0.3,
        vx:0,vy:0,r:14,owner:fIdx,damage:18,life:42,maxLife:42,hit:false});
      const dx16=tgt16.x-f.x;
      f.x=Math.max(0,Math.min(W-f.w,f.x+dx16*0.55));
      f.facing=dx16>0?1:-1;
      specials.push({type:'solar',x:f.x+f.w/2,y:f.y+f.h/2,
        owner:fIdx,damage:0,life:16,maxLife:16,hit:true,r:0}); break;}
  }
}

// ── specials update ───────────────────────────────────────────────────────
function tickSpecials(specials, F) {
  const hits = [];
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
      const attF=F[s.owner], gd=GODS[def.godIdx];
      const rm=attF&&attF.rage>0?1.8:1.0;
      const fr=1-def.hp/def.maxHp;
      const dmg=Math.round(s.damage*rm);
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
      hits.push({owner:s.owner, dmg, defHp:def.hp, specName:GODS[s.owner].specName});
    }
  }
  const kept=specials.filter(s=>s.life>0&&s.y<H+80);
  specials.length=0; for(const s of kept) specials.push(s);
  return hits;
}

// ── normal hit detection ──────────────────────────────────────────────────
function doHits(F) {
  const hits = [];
  for(let a=0;a<2;a++){
    const att=F[a],def=F[1-a];
    if(!att.hitbox||att.knockCD>0) continue;
    const h=att.hitbox;
    if(h.x<def.x+def.w&&h.x+h.w>def.x&&h.y<def.y+def.h&&h.y+h.h>def.y){
      const ga=GODS[att.godIdx],gd=GODS[def.godIdx];
      const rm=att.rage>0?1.8:1.0;
      const dmg=Math.round((7+rand()*8)*ga.dm*rm);
      def.hp=Math.max(0,def.hp-dmg);
      const fr=1-def.hp/def.maxHp;
      def.vx=att.facing*(5+fr*14)/gd.wm;
      def.vy=-6-fr*5;
      def.hitstun=18+Math.floor(fr*16);
      att.knockCD=10; att.hitbox=null;
      hits.push({owner:a, dmg, defHp:def.hp});
    }
  }
  return hits;
}

// ── PLAYER STRATEGY ───────────────────────────────────────────────────────
// Smart Tezcatlipoca:
//   - Wait until both on ground before engaging
//   - Stay in the CENTER third of the platform (x 280–450)
//   - Shadow Dash: only on ground, enemy in good range, not near edges
//   - Attack: when close and cooldown ready
//   - Jump: to follow airborne enemy or escape edge
function p1Think(me, enemy, frame) {
  let il=false, ir=false, ij=false, ia=false, is=false;

  const dx = enemy.x - me.x;
  const dist = Math.abs(dx);
  const platCenter = PLAT.x + PLAT.w/2;   // 400
  const platLeft   = PLAT.x + 60;          // 240
  const platRight  = PLAT.x + PLAT.w - 80; // 540

  // Don't act while in hitstun
  if(me.hitstun > 0) return {il,ir,ij,ia,is};

  // Retreat from edges first — platform safety
  if(me.onGround && me.x < platLeft) { ir=true; return {il,ir,ij,ia,is}; }
  if(me.onGround && me.x > platRight){ il=true; return {il,ir,ij,ia,is}; }

  // Face the enemy
  if(dx > 0) { ir = dist > 20; }
  else        { il = dist > 20; }

  // Attack when in range and cooldown ready
  if(dist < 65 && me.atkCD === 0) ia = true;

  // Shadow Dash: on ground, enemy in sweet range (80–160), both away from edges, special ready
  const safeToLeft  = me.x > platLeft + 30;
  const safeToRight = me.x < platRight - 30;
  const dashDir = dx > 0 ? 1 : -1;
  const willLandSafe = dashDir === 1
    ? (me.x + 140) < platRight + 20
    : (me.x - 140) > platLeft  - 20;

  if( me.specialCD === 0 &&
      me.onGround &&
      dist > 80 && dist < 170 &&
      ((dashDir === 1 && safeToRight && willLandSafe) ||
       (dashDir === -1 && safeToLeft  && willLandSafe)) ) {
    is = true;
  }

  // Jump: follow enemy when they're airborne and above; or when at edge to avoid falling
  if(me.onGround && me.jumpsLeft === me.maxJumps){
    if(!enemy.onGround && enemy.y < me.y - 40) ij = true;
  }
  // Double-jump recovery if falling off edge
  if(!me.onGround && me.jumpsLeft > 0 && me.x < PLAT.x + 20) { ir=true; ij=true; }
  if(!me.onGround && me.jumpsLeft > 0 && me.x > PLAT.x+PLAT.w - 46) { il=true; ij=true; }

  return {il,ir,ij,ia,is};
}

// ── push-apart ────────────────────────────────────────────────────────────
function pushApart(F) {
  const a=F[0],b=F[1];
  if(Math.abs((a.y+a.h)-(b.y+b.h))<24){
    const overlap=Math.min(a.x+a.w-b.x, b.x+b.w-a.x);
    if(overlap>0){
      const push=overlap*0.5+0.5;
      if(a.x<b.x){a.x-=push;b.x+=push;} else {a.x+=push;b.x-=push;}
    }
  }
}

// ── run one round ─────────────────────────────────────────────────────────
function runRound(p1GodIdx, p2GodIdx, diff, roundSeed) {
  srand(roundSeed);
  const F = [
    makeFighter(280, p1GodIdx, false, false),
    makeFighter(490, p2GodIdx, true,  true),
  ];
  F[1].aiTimer = DIFF_AI[diff].tMin + 5;

  const specials = [];
  const log = [];   // key events only
  let frame = 0;
  const MAX_FRAMES = 4200;

  while(frame < MAX_FRAMES) {
    frame++;

    const p1 = p1Think(F[0], F[1], frame);
    const p2 = aiTick(F[1], F[0], diff);

    // track specials fired this frame
    const beforeSpec0 = F[0].specialCD;
    const beforeSpec1 = F[1].specialCD;

    stepFighter(F[0], p1.il, p1.ir, p1.ij, p1.ia);
    if(p1.is && F[0].specialCD===0) doSpecial(F[0], 0, F, specials);

    stepFighter(F[1], p2.il, p2.ir, p2.ij, p2.ia);
    if(p2.is && F[1].specialCD===0) doSpecial(F[1], 1, F, specials);

    // log specials fired
    if(F[0].specialCD > 0 && beforeSpec0 === 0)
      log.push({f:frame, type:'special', owner:0, name:GODS[p1GodIdx].specName});
    if(F[1].specialCD > 0 && beforeSpec1 === 0)
      log.push({f:frame, type:'special', owner:1, name:GODS[p2GodIdx].specName});

    const hits = doHits(F);
    for(const h of hits)
      log.push({f:frame, type:'hit', owner:h.owner, dmg:h.dmg, defHp:h.defHp});

    const specHits = tickSpecials(specials, F);
    for(const h of specHits)
      log.push({f:frame, type:'specHit', owner:h.owner, dmg:h.dmg, defHp:h.defHp, specName:h.specName});

    pushApart(F);

    for(let i=0;i<2;i++){
      const f=F[i];
      if(f.hp<=0||f.y>H+120||f.x+f.w<-100||f.x>W+100){
        const wi = i===0?1:0;
        const koType = f.hp<=0?'KO':f.y>H+120?'ring-out (fell)':'ring-out (blasted)';
        return { winner:wi, frame, p1hp:Math.max(0,F[0].hp), p2hp:Math.max(0,F[1].hp), koType, log };
      }
    }
  }
  // time over — HP decides
  const wi = F[0].hp >= F[1].hp ? 0 : 1;
  return { winner:wi, frame, p1hp:F[0].hp, p2hp:F[1].hp, koType:'time over', log };
}

// ── HP bar ────────────────────────────────────────────────────────────────
function bar(hp, max=100, w=18) {
  const f=Math.max(0,Math.round((hp/max)*w));
  return '[' + '█'.repeat(f) + '░'.repeat(w-f) + `] ${String(hp).padStart(3)}`;
}

// ── STORY MODE LEVELS ─────────────────────────────────────────────────────
const STORY_LEVELS = [
  // ACT I — THE FIVE SUNS
  { id:0,  act:'ACT I',   name:'The Rivalry Begins',     enemy:1,  scenario:'founding',
    intro: ['TEZCATLIPOCA: "Quetzalcoatl. Your golden age ends today."',
            'QUETZALCOATL: "You bring only shadow, brother. I bring light."',
            'TEZCATLIPOCA: "Then let the sun decide who is worthy!"'],
    outro: ['TEZCATLIPOCA: "Your light... was not enough, feathered one."',
            'QUETZALCOATL: "This is not over, Smoking Mirror..."'],
    wisdom:'QUETZALCOATL: "The greatest revolution begins not in war, but in the mind that dares to question itself."' },

  { id:1,  act:'ACT I',   name:'Trial by Storm',         enemy:3,  scenario:'founding',
    intro: ['TLALOC: "Intruder! The night jungle belongs to the rain!"',
            'TEZCATLIPOCA: "Rain or obsidian — I care not. Stand aside."',
            'TLALOC: "Feel the thunder of a thousand ages!"'],
    outro: ['TEZCATLIPOCA: "Your storm clouds disperse before my mirror."',
            'TLALOC: "The rains will return... they always do."'],
    wisdom:'TLALOC: "Patience carves canyons where force cannot."' },

  { id:2,  act:'ACT I',   name:'The Obsidian Temple',    enemy:2,  scenario:'founding',
    intro: ['HUITZILOPOCHTLI: "This sacred temple is not for shadows."',
            'TEZCATLIPOCA: "All sacred things cast a shadow, Sun God."',
            'HUITZILOPOCHTLI: "Then I will burn yours away!"'],
    outro: ['TEZCATLIPOCA: "Even the sun bows to the Smoking Mirror."',
            'HUITZILOPOCHTLI: "The fifth sun... will remember this defeat."'],
    wisdom:'HUITZILOPOCHTLI: "The sun does not rise to prove itself — it rises because it must. Purpose is everything."' },

  { id:3,  act:'ACT I',   name:'The Temptation',         enemy:5,  scenario:'founding',
    intro: ['COATLICUE: "You dare cross into Mictlan\'s border alone?"',
            'TEZCATLIPOCA: "I seek the weapon that will reshape creation."',
            'COATLICUE: "The earth mother does not yield to shadows!"'],
    outro: ['TEZCATLIPOCA: "Creation belongs to whoever is strong enough."',
            'COATLICUE: "You will regret disturbing the earth\'s roots..."'],
    wisdom:'COATLICUE: "Creation and destruction are the same hand. Honor where you come from."' },

  { id:4,  act:'ACT I',   name:"The Mirror's Dream",     enemy:8,  scenario:'founding',
    intro: ['MICTECACIHUATL: "You seek power over death itself?"',
            'TEZCATLIPOCA: "I seek the truth hidden within my mirror."',
            'MICTECACIHUATL: "Then face what the mirror truly shows — yourself!"'],
    outro: ['TEZCATLIPOCA: "I have seen the abyss... and found power there."',
            'NARRATOR: "Act One closes. The mirror now shows further truths."'],
    wisdom:'MICTECACIHUATL: "Memory is the only immortality any of us are given. Do not let it die."' },

  // ACT II — THE CREATION WARS
  { id:5,  act:'ACT II',  name:'The Rite of Renewal',    enemy:4,  scenario:'yopico',
    intro: ['XIPE TOTEC: "The Flayed One bars your path, shadow."',
            'TEZCATLIPOCA: "Then I offer you the only sacrifice I know: my enemies."',
            'XIPE TOTEC: "Blood and renewal — so be it!"'],
    outro: ['TEZCATLIPOCA: "Your rites are broken. Creation does not need your violence."',
            'XIPE TOTEC: "Without sacrifice, the seeds never grow..."'],
    wisdom:'XIPE TOTEC: "The husk must fall for the new corn to grow. Do not cling to who you were."' },

  { id:6,  act:'ACT II',  name:'The Jade Flood',         enemy:6,  scenario:'pantitlan',
    intro: ['CHALCHIHUITLICUE: "The Jade Skirt does not yield to the Mirror!"',
            'TEZCATLIPOCA: "You flooded the world once. I will not let you again."',
            'CHALCHIHUITLICUE: "The water does not ask for permission!"'],
    outro: ['TEZCATLIPOCA: "The flood breaks against the obsidian shore."',
            'CHALCHIHUITLICUE: "You cannot hold back all rivers, shadow."'],
    wisdom:'CHALCHIHUITLICUE: "Channel your grief, your love, your fury — not to destroy, but to shape."' },

  { id:7,  act:'ACT II',  name:'The Shattered Moon',     enemy:11, scenario:'coatepec',
    intro: ['COYOLXAUHQUI: "Do you seek to finish what was done to me?"',
            'TEZCATLIPOCA: "I seek what was hidden in your fragments."',
            'COYOLXAUHQUI: "The moon does not forgive. Neither shall I!"'],
    outro: ['TEZCATLIPOCA: "The moon fragments contain what I need."',
            'COYOLXAUHQUI: "Look up and see what power costs."'],
    wisdom:'COYOLXAUHQUI: "Every scar you carry is not defeat — it is survival made visible."' },

  { id:8,  act:'ACT II',  name:"The Fifth Sun's Trial",  enemy:9,  scenario:'cuauhxicalco',
    intro: ['TONATIUH: "The Fifth Sun demands blood before it moves. Pay the price."',
            'TEZCATLIPOCA: "I do not pay ransoms to suns I can replace."',
            'TONATIUH: "Solar fire will reduce you to ash!"'],
    outro: ['TEZCATLIPOCA: "A sun that demands before it shines is a tyrant, not a god."',
            'TONATIUH: "Without willing sacrifice... you leave the world in darkness."'],
    wisdom:'TONATIUH: "Find what moves YOU forward and honor the cost it required."' },

  { id:9,  act:'ACT II',  name:'Garden of Ecstasy',      enemy:15, scenario:'xochitlicacan',
    intro: ['XOCHIPILLI: "Come — dance with the dead. Forget your purpose."',
            'TEZCATLIPOCA: "Your flowers are beautiful. But I do not lose myself in beauty."',
            'XOCHIPILLI: "Everything loses itself here, shadow. That is the gift!"'],
    outro: ['TEZCATLIPOCA: "Your flowers cannot root me. I know who I am."',
            'XOCHIPILLI: "Then you are missing the only thing that makes existence bearable... joy."'],
    wisdom:'XOCHIPILLI: "Joy is sacred. Guard it."' },

  // ACT III — THE MICTLAN DESCENT
  { id:10, act:'ACT III', name:'The Steam Bath of Sins',  enemy:14, scenario:'temazcalli',
    intro: ['TLAZOLTEOTL: "Into the temazcal you come. Let me eat what you have hidden."',
            'TEZCATLIPOCA: "You eat filth and call it power. I call it weakness."',
            'TLAZOLTEOTL: "Fight me with every ugly truth!"'],
    outro: ['TEZCATLIPOCA: "I do not fear my shadow. That is why you cannot consume me."',
            'TLAZOLTEOTL: "Rare... a god who has already confessed to himself."'],
    wisdom:'TLAZOLTEOTL: "You do not have to purify yourself alone. Ask for the steam bath."' },

  { id:11, act:'ACT III', name:'The Dark River',          enemy:10, scenario:'apanohuaia',
    intro: ['XOLOTL: "The dog-headed one awaits at Apanohuaia. Earn your crossing."',
            'TEZCATLIPOCA: "I helped create you, Xolotl. You know what I carry."',
            'XOLOTL: "Then show me you deserve the other side. Fight!"'],
    outro: ['TEZCATLIPOCA: "The river parts for the strong of spirit."',
            'XOLOTL: "Never forget that the ones who crossed before you needed a guide too."'],
    wisdom:'XOLOTL: "Grief is love with nowhere to go. Give it somewhere — a name spoken, an altar lit."' },

  { id:12, act:'ACT III', name:'The Devouring Earth',     enemy:13, scenario:'tlaltepac',
    intro: ['TLALTECUHTLI: "The earth monster rises! All things return to the dark soil!"',
            'TEZCATLIPOCA: "Quetzalcoatl and I split you once. I will do it alone."',
            'TLALTECUHTLI: "This time I will devour you both!"'],
    outro: ['TEZCATLIPOCA: "The world was made from your body. Remember your purpose."',
            'TLALTECUHTLI: "My hunger is eternal... but you reminded me of the cost."'],
    wisdom:'TLALTECUHTLI: "Even a wound can hold weight. Even broken ground can grow something new."' },

  { id:13, act:'ACT III', name:'The Ninth Level',         enemy:7,  scenario:'chicunauhmictlan',
    intro: ['MICTLANTECUHTLI: "No living god reaches my court without nine trials."',
            'TEZCATLIPOCA: "I have crossed eight of your rivers. The ninth belongs to me now."',
            'MICTLANTECUHTLI: "The Lord of the Dead yields to none!"'],
    outro: ['TEZCATLIPOCA: "The Ninth Level of Mictlan is mine."',
            'MICTLANTECUHTLI: "Find the truth about your own purpose."'],
    wisdom:'MICTLANTECUHTLI: "Death is the teacher that makes every moment matter."' },

  { id:14, act:'ACT III', name:'Garden of Lost Souls',    enemy:16, scenario:'tamoanchan',
    intro: ['XOCHIQUETZAL: "I did not expect the Smoking Mirror here in Tamoanchan."',
            'TEZCATLIPOCA: "I seek the thread of fate itself."',
            'XOCHIQUETZAL: "That thread is mine to weave. You will not take it without a cost!"'],
    outro: ['TEZCATLIPOCA: "The thread of fate is in my mirror. I see the convergence."',
            'XOCHIQUETZAL: "Are you prepared for the truth?"'],
    wisdom:'XOCHIQUETZAL: "The garden is here, now, incomplete and stunning. Be in it."' },

  // ACT IV — THE FINAL CONVERGENCE
  { id:15, act:'ACT IV',  name:'The Last Brotherhood',    enemy:1,  scenario:'tollan',
    intro: ['QUETZALCOATL: "Brother. You have crossed all the worlds. I knew it would come to this."',
            'TEZCATLIPOCA: "Every age ends with us, Feathered Serpent. It always comes back."',
            'QUETZALCOATL: "Let this be the truest fight — not for power, but for what survives us!"'],
    outro: ['TEZCATLIPOCA: "I understand now why we were always rivals. Two halves of the same truth."',
            'QUETZALCOATL: "The mirror shows both of us, Tezcatlipoca. Do not forget that."'],
    wisdom:'QUETZALCOATL: "Love the ones who make you see yourself clearly. That is the rarest gift."' },

  { id:16, act:'ACT IV',  name:'The Burning Guardian',    enemy:2,  scenario:'templo_mayor',
    intro: ['HUITZILOPOCHTLI: "You dare approach the final sun with the blood of the gods on your hands?"',
            'TEZCATLIPOCA: "I approach with the truth of all the ages. Stand aside."',
            'HUITZILOPOCHTLI: "The sun does not move for shadow! YOU will move!"'],
    outro: ['TEZCATLIPOCA: "Your fire cannot match what I carry in this mirror."',
            'HUITZILOPOCHTLI: "What lives at the top has no mercy for the unprepared."'],
    wisdom:'HUITZILOPOCHTLI: "Know the difference between the battles you chose and those chosen for you."' },

  { id:17, act:'ACT IV',  name:'The Serpent Judgment',    enemy:5,  scenario:'coatepec_birth',
    intro: ['COATLICUE: "You come trailing the blood of gods across three worlds. Kneel."',
            'TEZCATLIPOCA: "I kneel to no one, Mother. But I carry something for you."',
            'COATLICUE: "Then show me! The earth will judge what you hold worthy!"'],
    outro: ['TEZCATLIPOCA: "I carry everything I learned from the fallen gods."',
            'COATLICUE: "But even the earth does not know what Ometeotl will ask. Go now."'],
    wisdom:'COATLICUE: "Be the contradiction. Wholeness is not weakness. It is the most dangerous thing you can become."' },

  { id:18, act:'ACT IV',  name:'The Dual Threshold',      enemy:12, scenario:'omeyocan',
    intro: ['OMETEOTL: "Tezcatlipoca. You carry seventeen truths. You stand at Omeyocan."',
            'TEZCATLIPOCA: "I have seen the Five Suns. I have crossed Mictlan."',
            'OMETEOTL: "The origin is not a place. It is a question. Can you hold both answers at once?"'],
    outro: ['TEZCATLIPOCA: "Creation is not a moment. It is a continuous act."',
            'OMETEOTL: "Almost. One last fight. Then you will see what the mirror was always meant to show."'],
    wisdom:'OMETEOTL: "Stop negotiating with your own greatness. You were made to be complete."' },

  { id:19, act:'ACT IV',  name:'Beyond the 13th Heaven',  enemy:12, scenario:'first_sun',
    intro: ['OMETEOTL: "Now, Tezcatlipoca. Look into your mirror one final time. What do you see?"',
            'TEZCATLIPOCA: "I see the smoke... and the reflection of everything that could be."',
            'OMETEOTL: "Then let us finish what began before the First Sun. The Source awaits!"'],
    outro: ['TEZCATLIPOCA: "The smoke clears. The mirror shows only one thing now: the present moment."',
            'OMETEOTL: "You understand at last. The smoking mirror was never for past or future."',
            'NARRATOR: "TEZCATLIPOCA has traversed all worlds and discovered the truth of obsidian."'],
    wisdom:'OMETEOTL: "You carry both darkness and light, both wound and wonder. Honor all of it. That is the war of the gods — and it lives inside you."' },
];

const DIFFICULTY = 2; // TLATOANI (Hard)
const STORY_MAX_LIVES = 3;
const WINS_NEEDED = 2; // best of 3

// ── MAIN STORY LOOP ───────────────────────────────────────────────────────
console.log('\n');
console.log('╔══════════════════════════════════════════════════════════════════════════╗');
console.log('║      WAR OF THE GODS: TENOCHTITLAN                                      ║');
console.log('║      STORY MODE  ·  Difficulty: TLATOANI  ·  Lives: 3 per level         ║');
console.log('╠══════════════════════════════════════════════════════════════════════════╣');
console.log('║      Playing as TEZCATLIPOCA — The Smoking Mirror                        ║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝');

let gameOver = false;
let gameOverLevel = -1;
const matchResults = [];
let globalSeed = Date.now() & 0xFFFFFFFF;

for(let lvl = 0; lvl < STORY_LEVELS.length && !gameOver; lvl++) {
  const lv = STORY_LEVELS[lvl];
  const enemy = GODS[lv.enemy];

  console.log(`\n\n┌─────────────────────────────────────────────────────────────────────────┐`);
  console.log(`│  ${lv.act} · Level ${String(lvl+1).padStart(2)}/${STORY_LEVELS.length}: "${lv.name}"`);
  console.log(`│  ${GODS[0].title} vs ${enemy.title}`);
  console.log(`└─────────────────────────────────────────────────────────────────────────┘`);

  // Print intro dialogue
  console.log('');
  for(const line of lv.intro) console.log(`  ${line}`);
  console.log('');

  let lives = STORY_MAX_LIVES;
  let matchWon = false;
  let attemptNum = 0;

  while(lives > 0 && !matchWon) {
    attemptNum++;
    let p1rw = 0, p2rw = 0, roundNum = 0;
    const roundLog = [];

    if(attemptNum > 1) {
      console.log(`  ⟳ Attempt ${attemptNum}  (${lives} ${lives===1?'life':'lives'} remaining)\n`);
    }

    while(p1rw < WINS_NEEDED && p2rw < WINS_NEEDED) {
      roundNum++;
      globalSeed = (globalSeed * 1664525 + 1013904223) >>> 0;
      const res = runRound(0, lv.enemy, DIFFICULTY, globalSeed + lvl*100 + roundNum*7);

      if(res.winner === 0) p1rw++; else p2rw++;

      // Build round summary
      const normalHits = res.log.filter(e=>e.type==='hit');
      const specFired  = res.log.filter(e=>e.type==='special');
      const specHit    = res.log.filter(e=>e.type==='specHit');
      const p1Dmg = res.log.filter(e=>(e.type==='hit'||e.type==='specHit')&&e.owner===0).reduce((s,e)=>s+e.dmg,0);
      const p2Dmg = res.log.filter(e=>(e.type==='hit'||e.type==='specHit')&&e.owner===1).reduce((s,e)=>s+e.dmg,0);

      const roundWinner = res.winner===0 ? '✓ TEZCAT' : '✗ '+enemy.short;
      console.log(`  Round ${roundNum}: ${roundWinner.padEnd(12)} | ${bar(res.p1hp)} vs ${bar(res.p2hp)} | ${res.koType} (frame ${res.frame})`);

      // Print notable moments
      const p1Specials = specFired.filter(e=>e.owner===0);
      const p2Specials = specFired.filter(e=>e.owner===1);
      const p1SpecHits = specHit.filter(e=>e.owner===0);
      const p2SpecHits = specHit.filter(e=>e.owner===1);
      const moments = [];
      if(p1Specials.length) moments.push(`    TEZCAT fired ${GODS[0].specName} ×${p1Specials.length}${p1SpecHits.length?' ('+p1SpecHits.length+' hit)':' (missed)'}`);
      if(p2Specials.length) moments.push(`    ${enemy.short} fired ${enemy.specName} ×${p2Specials.length}${p2SpecHits.length?' ('+p2SpecHits.length+' hit)':' (missed)'}`);
      if(normalHits.filter(e=>e.owner===0).length || p1Dmg)
        moments.push(`    TEZCAT dealt ${p1Dmg} total dmg (${normalHits.filter(e=>e.owner===0).length} punches + ${p1SpecHits.length} special hits)`);
      if(normalHits.filter(e=>e.owner===1).length || p2Dmg)
        moments.push(`    ${enemy.short} dealt ${p2Dmg} total dmg (${normalHits.filter(e=>e.owner===1).length} punches + ${p2SpecHits.length} special hits)`);
      for(const m of moments) console.log(m);

      roundLog.push(res);
    }

    const matchWinner = p1rw >= WINS_NEEDED;
    matchWon = matchWinner;

    console.log(`\n  ─── MATCH: ${matchWinner ? '★ TEZCATLIPOCA WINS' : '☠ DEFEATED'} (${p1rw}–${p2rw}) ───`);

    if(!matchWon) {
      lives--;
      if(lives > 0) {
        console.log(`  The mirror cracks... ${lives} ${lives===1?'chance remains':'chances remain'}.`);
      } else {
        console.log(`  ☠ GAME OVER — Tezcatlipoca falls at "${lv.name}"`);
        console.log(`  ${enemy.short}: "Your obsidian mirror is broken, shadow. You were not ready."`);
        gameOver = true;
        gameOverLevel = lvl;
      }
    }
  }

  matchResults.push({ lvl:lvl+1, name:lv.name, enemy:enemy.name, won:matchWon, lives });

  if(matchWon) {
    // Outro
    console.log('');
    for(const line of lv.outro) console.log(`  ${line}`);
    // Wisdom
    console.log(`\n  ✦ WISDOM UNLOCKED:`);
    console.log(`  ${lv.wisdom}`);
  }
}

// ── FINAL SCREEN ──────────────────────────────────────────────────────────
console.log('\n');
if(!gameOver) {
  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                  ★  CAMPAIGN COMPLETE  ★                                ║');
  console.log('║  "The smoke clears. The smoking mirror was never for past or future.     ║');
  console.log('║   It was for seeing clearly — what is real, right now."                 ║');
  console.log('╠══════════════════════════════════════════════════════════════════════════╣');
} else {
  console.log('╔══════════════════════════════════════════════════════════════════════════╗');
  console.log('║                  ☠  CAMPAIGN ENDED                                      ║');
  console.log(`║  Fell at Level ${String(gameOverLevel+1).padEnd(2)}: ${STORY_LEVELS[gameOverLevel].name.padEnd(53)}║`);
  console.log('╠══════════════════════════════════════════════════════════════════════════╣');
}

let wins=0;
for(const r of matchResults){
  const icon = r.won ? '✓' : '✗';
  const godName = GODS[STORY_LEVELS[r.lvl-1].enemy].short;
  console.log(`║ ${icon} Lv${String(r.lvl).padStart(2)} ${r.name.padEnd(30)} vs ${godName.padEnd(8)} ${r.won?'WIN ':'LOSS'}║`);
  if(r.won) wins++;
}
console.log('╠══════════════════════════════════════════════════════════════════════════╣');
const pct = Math.round(wins/matchResults.length*100);
console.log(`║  Result: ${wins}/${matchResults.length} levels cleared (${pct}%)`.padEnd(75)+'║');
console.log('╚══════════════════════════════════════════════════════════════════════════╝');
