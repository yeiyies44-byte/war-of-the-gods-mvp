#!/usr/bin/env python3
"""Patch INAH-accurate body forms for War of the Gods sprites.
Keeps all existing colors; only changes shapes/structures."""

with open('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# ── Section 3: Body extras (lines 3871-4086, 0-idx 3870:4086) ──────────────
s3 = """\
  // God-specific body extras — INAH-verified forms (jun 2026)
  if(f.godIdx===0){ // Tezcatlipoca — bead necklace (2 rows), obsidian foot-mirror, smoke
    // 2-strand bead necklace (INAH: not diagonal sash)
    cx.fillStyle=g.hi;
    for(let b=0;b<6;b++){cx.fillRect(x+1+b*4,y+13,3,2);}
    for(let b=0;b<6;b++){cx.fillRect(x+1+b*4,y+16,3,2);}
    // Obsidian foot-mirror replacing right foot (INAH key attribute)
    const fmX=fac===1?x+f.w-11:x+3;
    cx.fillStyle=g.alt;cx.fillRect(fmX,y+31,9,7);
    cx.fillStyle='#0a0218';cx.fillRect(fmX+1,y+32,7,5);
    cx.fillStyle='#ff1800';cx.fillRect(fmX+3,y+34,3,2);
    // Smoking mirror on back
    const mx=fac===1?x+1:x+f.w-9;
    cx.fillStyle='#100820';cx.fillRect(mx,y+18,8,9);
    cx.fillStyle='#2a1850';cx.fillRect(mx+1,y+19,6,7);
    cx.fillStyle='#ff1800';cx.fillRect(mx+3,y+21,2,3);
    // Smoke wisps
    const sa=0.18+Math.sin(t*.004)*.12;
    cx.fillStyle=`rgba(80,50,130,${sa.toFixed(2)})`;
    cx.fillRect(mx+2,y+14,2,5);cx.fillRect(mx+1,y+9,2,5);
  } else if(f.godIdx===1){ // Quetzalcoatl — feather collar, RATTLESNAKE diamond-chevron scales (INAH)
    cx.fillStyle=g.alt;cx.fillRect(x,y+10,f.w,5);cx.fillRect(x-2,y+12,3,5);cx.fillRect(x+f.w-1,y+12,3,5);
    cx.fillStyle=g.acc;cx.fillRect(x+2,y+8,f.w-4,4);
    cx.fillStyle='#00b060';cx.fillRect(x+1,y+10,f.w-2,2);
    // Rattlesnake diamond/chevron pattern (INAH: cascabel rattlesnake, not generic lizard)
    cx.fillStyle='#1a5828';
    cx.fillRect(x+5,y+17,3,2);cx.fillRect(x+11,y+17,3,2);cx.fillRect(x+17,y+17,3,2);
    cx.fillRect(x+8,y+20,3,2);cx.fillRect(x+14,y+20,3,2);cx.fillRect(x+20,y+20,3,2);
    cx.fillRect(x+5,y+23,3,2);cx.fillRect(x+11,y+23,3,2);cx.fillRect(x+17,y+23,3,2);
    cx.fillStyle='#28a048';
    cx.fillRect(x+6,y+17,1,1);cx.fillRect(x+12,y+17,1,1);cx.fillRect(x+18,y+17,1,1);
    cx.fillRect(x+9,y+20,1,1);cx.fillRect(x+15,y+20,1,1);cx.fillRect(x+21,y+20,1,1);
    // Rattle tail at base
    cx.fillStyle=g.acc;cx.fillRect(x+9,y+30,8,5);cx.fillRect(x+10,y+28,6,3);
    cx.fillStyle=g.hi;cx.fillRect(x+11,y+31,4,3);
  } else if(f.godIdx===2){ // Huitzilopochtli — suit, chimalli in RIGHT hand, xiuhatlatl back arm (INAH)
    cx.fillStyle='#10B0C0';cx.fillRect(x+2,y+12,f.w-4,16);
    cx.fillStyle='#088898';
    for(let fi=0;fi<4;fi++){cx.fillRect(x+3+fi*5,y+13,4,3);cx.fillRect(x+5+fi*5,y+16,4,3);}
    // Chimalli (round shield) in RIGHT/weapon-arm hand (INAH correction)
    const chX=fac===1?x+f.w-9:x+2;
    cx.fillStyle='#E8C800';cx.fillRect(chX,y+14,8,8);
    cx.fillStyle='#C09000';cx.fillRect(chX+1,y+15,6,6);
    cx.fillStyle='#E8C800';cx.fillRect(chX+2,y+16,4,4);
    cx.fillStyle='rgba(255,240,0,0.6)';cx.fillRect(chX+3,y+17,2,2);
    // Xiuhatlatl (atlatl) in back arm (INAH: left hand holds spear-thrower)
    const atX=fac===1?x+1:x+f.w-4;
    cx.fillStyle=g.hat;cx.fillRect(atX,y+8,3,20);
    cx.fillStyle=g.acc;cx.fillRect(atX,y+7,3,3);cx.fillRect(atX-1,y+6,5,2);
    // Xiuhcoatl fire serpent burst
    cx.fillStyle='rgba(255,120,0,0.65)';cx.fillRect(fac===1?x+f.w-7:x+2,y+9,5,12);
  } else if(f.godIdx===3){ // Tlaloc — mosaic chest, jade shoulders, bifid tongue (INAH)
    cx.fillStyle='#009088';cx.fillRect(x+4,y+13,f.w-8,8);
    cx.fillStyle='#00C0B0';
    for(let ci=0;ci<3;ci++)for(let ri=0;ri<2;ri++) cx.fillRect(x+5+ci*5,y+14+ri*3,4,2);
    cx.fillStyle='#004466';cx.fillRect(x+1,y+11,5,7);cx.fillRect(x+f.w-6,y+11,5,7);
    cx.fillStyle=g.alt;cx.fillRect(x+2,y+12,3,5);cx.fillRect(x+f.w-5,y+12,3,5);
    // Bifid (forked) tongue from lower lip (INAH: key Tlaloc attribute)
    cx.fillStyle=g.hat;cx.fillRect(x+10,y+12,2,5);cx.fillRect(x+14,y+12,2,5);
    cx.fillStyle=g.hi;cx.fillRect(x+10,y+15,1,3);cx.fillRect(x+15,y+15,1,3);
    const wd=0.45+Math.sin(t*.012)*.3;
    cx.fillStyle=`rgba(32,208,255,${wd.toFixed(2)})`;
    cx.fillRect(x-2,y+22,3,10);cx.fillRect(x+f.w-1,y+25,3,8);
  } else if(f.godIdx===4){ // Xipe Totec — unchanged (no INAH reference image)
    cx.fillStyle='rgba(180,20,20,0.35)';cx.fillRect(x+2,y+12,f.w-4,18);
    cx.fillStyle='#cc8800';cx.fillRect(x+4,y+13,f.w-8,3);
    cx.fillStyle='rgba(200,40,0,0.55)';
    cx.fillRect(x+3,y+24,2,8);cx.fillRect(x+f.w-5,y+24,2,8);
    cx.fillStyle=g.alt;cx.fillRect(x+5,y+14,f.w-10,3);
  } else if(f.godIdx===5){ // Coatlicue — INAH: hand+heart+skull necklace, serpent-head arms, tooth joints
    // Necklace: hands and hearts alternating
    cx.fillStyle=g.hi;
    cx.fillRect(x+2,y+13,4,3);cx.fillRect(x+3,y+11,2,3);
    cx.fillRect(x+7,y+14,4,2);
    cx.fillRect(x+12,y+13,4,3);cx.fillRect(x+13,y+11,2,3);
    cx.fillRect(x+17,y+14,4,2);
    // Skull pendant at necklace center
    cx.fillStyle='#c8c0b0';cx.fillRect(x+10,y+16,6,5);
    cx.fillStyle='#0a0c08';cx.fillRect(x+11,y+17,2,2);cx.fillRect(x+14,y+17,2,2);
    cx.fillStyle='#c8c0b0';for(let sk=0;sk<4;sk++) cx.fillRect(x+10+sk,y+20,1,2);
    // Serpent heads at arm ends (INAH: hands replaced by serpent heads)
    cx.fillStyle=g.acc;
    cx.fillRect(x+1,y+12,3,4);cx.fillRect(x+f.w-4,y+12,3,4);
    cx.fillStyle=g.hi;cx.fillRect(x+1,y+12,1,2);cx.fillRect(x+f.w-3,y+12,1,2);
    // Tooth/spike marks at elbow joints
    cx.fillStyle='#c8c0b0';
    cx.fillRect(x+1,y+20,2,2);cx.fillRect(x+f.w-3,y+20,2,2);
    // Serpent skirt at base
    cx.fillStyle='#206828';
    cx.fillRect(x+1,y+24,f.w-2,8);
    cx.fillStyle='#30a040';cx.fillRect(x+2,y+25,3,6);cx.fillRect(x+8,y+24,3,7);cx.fillRect(x+14,y+25,3,6);cx.fillRect(x+20,y+24,3,7);
  } else if(f.godIdx===6){ // Chalchihuitlicue — INAH: huipil tunic, 3 bead strands, hands at abdomen
    // Full huipil tunic (INAH: rectangular tunic covering torso)
    cx.fillStyle=g.body;cx.fillRect(x+2,y+10,f.w-4,22);
    cx.fillStyle=g.hi;cx.fillRect(x+3,y+11,f.w-6,2);
    cx.fillStyle=g.alt;cx.fillRect(x+3,y+30,f.w-6,2);
    // Exactly 3 bead strands (INAH: not full bib)
    cx.fillStyle='#00DDCC';
    for(let b=0;b<5;b++) cx.fillRect(x+3+b*4,y+14,3,2);
    cx.fillStyle='#00B8A8';
    for(let b=0;b<5;b++) cx.fillRect(x+3+b*4,y+17,3,2);
    cx.fillStyle='#009888';
    for(let b=0;b<5;b++) cx.fillRect(x+3+b*4,y+20,3,2);
    // Hands at abdomen (INAH: hands folded at belly)
    cx.fillStyle='#00DDCC';cx.fillRect(x+3,y+24,5,4);cx.fillRect(x+f.w-8,y+24,5,4);
    cx.fillStyle='#00B8A8';cx.fillRect(x+4,y+25,3,2);cx.fillRect(x+f.w-7,y+25,3,2);
    const wa=0.38+Math.sin(t*0.007)*0.28;
    cx.fillStyle=`rgba(0,200,170,${wa.toFixed(2)})`;
    cx.fillRect(x+1,y+28,f.w-2,10);
  } else if(f.godIdx===7){ // Mictlantecuhtli — INAH: ribcage, liver below torso, paper rosette accents
    cx.fillStyle=g.hi;
    for(let rib=0;rib<4;rib++){
      cx.fillRect(x+3,y+13+rib*4,4,2);
      cx.fillRect(x+f.w-7,y+13+rib*4,4,2);
    }
    cx.fillStyle='#c8bca8';
    for(let sp=0;sp<5;sp++) cx.fillRect(x+11,y+12+sp*4,4,3);
    // Liver hanging below ribcage (INAH: exposed organs)
    cx.fillStyle=g.acc;cx.fillRect(x+8,y+28,10,5);
    cx.fillStyle=g.hi;cx.fillRect(x+9,y+29,8,3);
    cx.fillStyle='rgba(180,50,20,0.5)';cx.fillRect(x+10,y+29,5,2);
    // Paper rosette squares at shoulder level (INAH attribute)
    cx.fillStyle=g.alt;
    cx.fillRect(x+1,y+11,5,4);cx.fillRect(x+f.w-6,y+11,5,4);
    cx.fillStyle=g.hi;cx.fillRect(x+2,y+12,3,2);cx.fillRect(x+f.w-5,y+12,3,2);
    cx.fillStyle='#1a1a1a';
    cx.fillRect(x+2,y+21,3,2);cx.fillRect(x+f.w-5,y+21,3,2);
  } else if(f.godIdx===8){ // Mictecacihuatl — INAH: ribs + liver, matted hair, flowers
    const pa=0.22+Math.sin(t*.008)*.14;
    cx.fillStyle=`rgba(200,100,255,${pa.toFixed(2)})`;cx.fillRect(x-2,y+18,f.w+4,22);
    // Visible ribs (INAH: decomposed body shows bones)
    cx.fillStyle=g.hi;
    for(let rib=0;rib<3;rib++){
      cx.fillRect(x+4,y+14+rib*4,4,2);
      cx.fillRect(x+f.w-8,y+14+rib*4,4,2);
    }
    // Liver below ribs (INAH: exposed organs)
    cx.fillStyle=g.acc;cx.fillRect(x+8,y+25,10,4);
    cx.fillStyle=g.hat;cx.fillRect(x+9,y+26,8,2);
    // Flowers on shoulders
    cx.fillStyle='#FF9900';cx.fillRect(x,y+14,5,5);cx.fillRect(x+f.w-5,y+14,5,5);
    cx.fillStyle='#FFCC00';cx.fillRect(x+1,y+15,3,3);cx.fillRect(x+f.w-4,y+15,3,3);
    cx.fillStyle='#FF6600';cx.fillRect(x+2,y+16,1,1);cx.fillRect(x+f.w-3,y+16,1,1);
    // Matted tangled hair draping on sides (INAH: decomposed fleshless form)
    cx.fillStyle='#140808';
    cx.fillRect(x+3,y+2,3,14);cx.fillRect(x+f.w-6,y+2,3,14);
    cx.fillStyle='#1c1010';cx.fillRect(x+4,y+3,2,12);cx.fillRect(x+f.w-5,y+3,2,12);
    // Hip flowers
    cx.fillStyle='#FF9900';cx.fillRect(x+3,y+25,4,4);cx.fillRect(x+f.w-7,y+25,4,4);
    cx.fillStyle='#FFCC00';cx.fillRect(x+4,y+26,2,2);cx.fillRect(x+f.w-6,y+26,2,2);
  } else if(f.godIdx===9){ // Tonatiuh — solar chest plates, 4-directional rays (confirmed by INAH)
    cx.fillStyle=g.acc;cx.fillRect(x+3,y+12,f.w-6,5);
    cx.fillStyle='#CC3A08';cx.fillRect(x+3,y+17,f.w-6,5);
    const fa=0.45+Math.sin(t*.010)*.30;
    cx.fillStyle=`rgba(255,180,0,${fa.toFixed(2)})`;
    cx.fillRect(x+Math.round(f.w/2)-1,y-8,3,7);
    cx.fillRect(x+Math.round(f.w/2)-1,y+f.h+1,3,7);
    cx.fillRect(x-8,y+Math.round(f.h/2)-1,7,3);
    cx.fillRect(x+f.w+1,y+Math.round(f.h/2)-1,7,3);
    cx.fillStyle='#C09000';cx.fillRect(fac===1?x+f.w-7:x+2,y+8,4,14);
    cx.fillStyle='#FFD800';cx.fillRect(fac===1?x+f.w-6:x+3,y+8,2,6);
    cx.fillStyle=`rgba(255,200,0,${fa.toFixed(2)})`;cx.fillRect(fac===1?x+f.w-8:x+1,y+5,6,5);
  } else if(f.godIdx===10){ // Xolotl — INAH: conch-shell ehecacozcatl pectoral, dark dog body, lightning
    // Ehecacozcatl (conch shell cross-section) pectoral (INAH: replaces generic gold collar)
    cx.fillStyle=g.acc;cx.fillRect(x+6,y+9,14,7);
    cx.fillStyle='#C09000';cx.fillRect(x+7,y+10,12,5);
    cx.fillStyle=g.body;cx.fillRect(x+8,y+10,10,4);
    // Conch spiral cross-section
    cx.fillStyle='#FFD800';cx.fillRect(x+11,y+11,4,3);
    cx.fillStyle=g.body;cx.fillRect(x+12,y+12,2,1);
    cx.fillStyle='#C09000';cx.fillRect(x+13,y+11,1,1);
    cx.fillStyle='#1c1008';cx.fillRect(x+3,y+16,f.w-6,14);
    cx.fillStyle='#2a1810';cx.fillRect(x+4,y+17,f.w-8,12);
    const la=0.32+Math.sin(t*.018)*.28;
    cx.fillStyle=`rgba(68,153,255,${la.toFixed(2)})`;cx.fillRect(x-3,y+17,4,f.h-17);
  } else if(f.godIdx===11){ // Coyolxauhqui — cascabeles, crescent moons, silver glow (confirmed INAH)
    const ma=0.28+Math.sin(t*.007)*.20;
    cx.fillStyle=`rgba(200,210,255,${ma.toFixed(2)})`;
    cx.fillRect(x-5,y+10,5,f.h-10);cx.fillRect(x+f.w,y+10,5,f.h-10);
    cx.fillStyle=g.acc;
    cx.fillRect(x+5,y+13,6,5);cx.fillRect(x+f.w-11,y+13,6,5);
    cx.fillStyle=g.body;cx.fillRect(x+6,y+14,4,3);cx.fillRect(x+f.w-10,y+14,4,3);
    cx.fillStyle='#D09818';
    for(let cb=0;cb<4;cb++) cx.fillRect(x+3+cb*5,y+20,4,4);
    cx.fillStyle='#F0C020';
    for(let cb=0;cb<4;cb++) cx.fillRect(x+4+cb*5,y+21,2,2);
    cx.fillStyle=g.alt;cx.fillRect(x+3,y+26,f.w-6,3);
  } else if(f.godIdx===12){ // Ometeotl — dual split body (modern interpretive, intentional)
    cx.fillStyle=g.acc+'99';cx.fillRect(x+3,y+12,Math.round(f.w/2)-3,18);
    cx.fillStyle=g.alt+'99';cx.fillRect(x+Math.round(f.w/2),y+12,Math.round(f.w/2)-3,18);
    cx.fillStyle='#00FFCC';cx.fillRect(x+6,y+18,3,3);
    cx.fillStyle='#FF0055';cx.fillRect(x+f.w-9,y+18,3,3);
    const da=0.32+Math.sin(t*.009)*.20;
    cx.fillStyle=`rgba(0,255,200,${da.toFixed(2)})`;cx.fillRect(x,y+Math.round(f.h/2)-1,Math.round(f.w/2),2);
    cx.fillStyle=`rgba(255,0,85,${da.toFixed(2)})`;cx.fillRect(x+Math.round(f.w/2),y+Math.round(f.h/2)-1,Math.round(f.w/2),2);
    cx.fillStyle=g.acc;cx.fillRect(x+4,y-5,4,5);
    cx.fillStyle=g.alt;cx.fillRect(x+f.w-8,y-5,4,5);
  } else if(f.godIdx===13){ // Tlaltecuhtli — INAH: stone monolith, skull at belt, earth cracks
    cx.fillStyle='#502010';
    cx.fillRect(x+1,y+11,6,21);cx.fillRect(x+f.w-7,y+11,6,21);
    cx.fillRect(x+4,y+8,f.w-8,5);
    cx.fillStyle='#8a1808';cx.fillRect(x+7,y+12,f.w-14,14);
    // Skull at belt/waist (INAH: skull iconography on the monolith belt)
    cx.fillStyle=g.hi;cx.fillRect(x+9,y+24,8,5);
    cx.fillStyle=g.alt;cx.fillRect(x+9,y+24,2,2);cx.fillRect(x+15,y+24,2,2);
    cx.fillStyle=g.body;for(let ti=0;ti<4;ti++) cx.fillRect(x+9+ti*2,y+28,1,2);
    cx.fillStyle=g.acc;
    cx.fillRect(x+7,y+14,3,10);cx.fillRect(x+f.w-10,y+14,3,10);
    cx.fillRect(x+10,y+20,f.w-20,2);
    if(f.onGround&&Math.abs(f.vx)<0.5){
      cx.fillStyle='rgba(180,80,20,0.45)';cx.fillRect(x-8,y+f.h,f.w+16,3);
      cx.fillStyle='rgba(100,180,50,0.28)';cx.fillRect(x-12,y+f.h+3,f.w+24,2);
    }
  } else if(f.godIdx===14){ // Tlazolteotl — unchanged
    const sta=0.18+Math.sin(t*.011)*.14;
    cx.fillStyle=`rgba(255,100,180,${sta.toFixed(2)})`;
    cx.fillRect(x-4,y+16,5,16);cx.fillRect(x+f.w-1,y+20,5,12);
    cx.fillStyle=g.acc;
    cx.fillRect(x+5,y+4,3,3);cx.fillRect(x+f.w-8,y+4,3,3);
    cx.fillStyle=g.alt;cx.fillRect(x+4,y+16,f.w-8,4);
    cx.fillStyle=g.acc+'aa';cx.fillRect(x+2,y+28,f.w-4,8);
  } else if(f.godIdx===15){ // Xochipilli — unchanged
    cx.fillStyle=g.acc;
    cx.fillRect(x+Math.round(f.w/2)-3,y-7,7,7);
    cx.fillStyle=g.alt;cx.fillRect(x+Math.round(f.w/2)-1,y-9,3,3);
    cx.fillStyle='#ff4488';cx.fillRect(x+2,y-6,3,3);cx.fillRect(x+f.w-5,y-6,3,3);
    const ba=0.22+Math.sin(t*.014)*.18;
    cx.fillStyle=`rgba(255,150,180,${ba.toFixed(2)})`;cx.fillRect(x+2,y+14,f.w-4,14);
    cx.fillStyle=g.alt;cx.fillRect(x+5,y+10,f.w-10,3);
  } else if(f.godIdx===16){ // Xochiquetzal — unchanged
    cx.fillStyle=g.alt;
    cx.fillRect(x-5,y+12,5,20);cx.fillRect(x+f.w,y+12,5,20);
    cx.fillRect(x-3,y+6,4,12);cx.fillRect(x+f.w-1,y+6,4,12);
    cx.fillStyle=g.acc;cx.fillRect(x+3,y+10,f.w-6,4);
    const ga=0.18+Math.sin(t*.008)*.13;
    cx.fillStyle=`rgba(255,200,50,${ga.toFixed(2)})`;cx.fillRect(x+1,y+8,f.w-2,28);
  }
"""

# ── Section 2: drawHeaddress case 10 (lines 3740-3745, 0-idx 3739:3745) ───
s2 = """\
    case 10:{ // Xolotl — orejas caídas/floppy hanging at sides (INAH: xoloitzcuintli)
      cx.fillStyle='#7700cc';
      cx.fillRect(x-2+Math.round(cfx*0.6),y+2,5,14);cx.fillRect(x+f.w-3-Math.round(cfx*0.6),y+2,5,14);
      cx.fillStyle='#4499ff';
      cx.fillRect(x-1+Math.round(cfx*0.6),y+4,3,9);cx.fillRect(x+f.w-4-Math.round(cfx*0.6),y+4,3,9);
      break;}
"""

# ── Section 1: drawFacePaint case 10 (lines 3568-3579, 0-idx 3567:3579) ───
s1 = """\
    case 10:{ // Xolotl — dark dog face, 3-stripe face paint (INAH), hollow weeping eyes, black nose
      cx.fillStyle='#3A2818';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#6A4828';cx.fillRect(x+7,y+6,12,6);
      // 3 vertical stripe face paint (INAH: replaces diamond — red/dark/amber stripes)
      cx.fillStyle='#CC1010';cx.fillRect(x+7,y+2,2,9);cx.fillRect(x+12,y+2,2,9);cx.fillRect(x+17,y+2,2,7);
      cx.fillStyle='#1A0C08';cx.fillRect(nearX-2,y+2,8,7);cx.fillRect(farX-2,y+3,7,6);
      cx.fillStyle='#3A2818';cx.fillRect(nearX-1,y+3,6,5);cx.fillRect(farX-1,y+4,5,4);
      _eyeN(nearX,y,'#C07820');
      _eyeF(farX,y,'#C07820');
      cx.fillStyle='#4A7ABB';cx.fillRect(nearX+1,y+7,2,5);cx.fillRect(farX+1,y+7,1,4);
      cx.fillStyle='#1A0808';cx.fillRect(x+11,y+9,4,2);
      cx.fillStyle='#100606';cx.fillRect(x+12,y+9,2,1);
      break;}
"""

# Convert new sections to line lists
def to_lines(s):
    return [l + '\n' for l in s.split('\n')][:-1]  # strip trailing empty from split

s3_lines = to_lines(s3)
s2_lines = to_lines(s2)
s1_lines = to_lines(s1)

print(f"s3 lines: {len(s3_lines)}, replacing lines 3871-4086 ({4086-3870} lines)")
print(f"s2 lines: {len(s2_lines)}, replacing lines 3740-3745 ({3745-3739} lines)")
print(f"s1 lines: {len(s1_lines)}, replacing lines 3568-3579 ({3579-3567} lines)")

# Apply in reverse order (largest index first) so indices stay valid
lines[3870:4086] = s3_lines
lines[3739:3745] = s2_lines
lines[3567:3579] = s1_lines

with open('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html', 'w') as f:
    f.writelines(lines)

print(f"Done. New total lines: {len(lines)}")
