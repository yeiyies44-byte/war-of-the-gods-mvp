#!/usr/bin/env python3
"""Rewrite drawFacePaint with fully symmetric faces.
Both eyes same size (_eyeN for both at x+7/x+14).
All sockets same dimensions. All cheek marks mirrored."""

with open('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html') as f:
    lines = f.readlines()

print(f"Total lines: {len(lines)}")

# Replace lines 3445-3663 (1-indexed) = 0-idx [3444:3663]
new_fn = """\
// Per-god faces — symmetric construction (lEye=x+7, rEye=x+14, equal sockets)
function drawFacePaint(f, x, y, fac, g) {
  const gi=f.godIdx;
  const lEye=x+7, rEye=x+14;
  switch(gi){
    case 0:{ // Tezcatlipoca — purple, gold brow, mirror ring left eye, smoke marks
      cx.fillStyle='#2A1840';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#C89820';cx.fillRect(x+5,y+2,16,2);
      cx.fillStyle='#E8B020';cx.fillRect(x+5,y+3,8,6);cx.fillStyle='#2A1840';cx.fillRect(x+6,y+4,6,4);
      _eyeN(lEye,y,'#FF3318');_eyeN(rEye,y,'#FFCC00');
      cx.fillStyle='#181020';cx.fillRect(x+12,y+8,2,2);
      cx.fillStyle='#C89820';cx.fillRect(x+11,y+10,1,1);cx.fillRect(x+14,y+10,1,1);
      break;}
    case 1:{ // Quetzalcoatl — dark serpent skin, scale blocks BOTH cheeks, amber eyes, fangs + tongue
      cx.fillStyle='#0C1810';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#1C6830';
      cx.fillRect(x+5,y+2,4,4);cx.fillRect(x+5,y+6,4,3);
      cx.fillRect(x+17,y+2,4,4);cx.fillRect(x+17,y+6,4,3);
      cx.fillStyle='#28A048';
      cx.fillRect(x+5,y+2,2,1);cx.fillRect(x+7,y+4,2,1);cx.fillRect(x+5,y+6,2,1);cx.fillRect(x+7,y+8,2,1);
      cx.fillRect(x+17,y+2,2,1);cx.fillRect(x+19,y+4,2,1);cx.fillRect(x+17,y+6,2,1);cx.fillRect(x+19,y+8,2,1);
      cx.fillStyle='#080C08';cx.fillRect(x+9,y+2,8,2);
      _eyeN(lEye,y,'#FF9020');_eyeN(rEye,y,'#FF9020');
      cx.fillStyle='#1C6830';cx.fillRect(x+9,y+8,8,3);
      cx.fillStyle='#F0ECD8';cx.fillRect(x+10,y+8,2,3);cx.fillRect(x+15,y+8,2,3);
      cx.fillStyle='#CC2010';cx.fillRect(x+12,y+11,2,1);
      break;}
    case 2:{ // Huitzilopochtli — blue, dark brow, red stripe, BOTH sun eyes, centered beak
      cx.fillStyle='#1060B0';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#080C28';cx.fillRect(x+5,y+2,16,3);
      cx.fillStyle='#CC2000';cx.fillRect(x+5,y+6,16,2);
      _eyeN(lEye,y,'#FFD000');_eyeN(rEye,y,'#FFD000');
      cx.fillStyle='#E8C000';cx.fillRect(x+9,y+8,8,4);
      cx.fillStyle='#C09A00';cx.fillRect(x+9,y+10,8,1);
      cx.fillStyle='#101828';cx.fillRect(x+9,y+9,8,1);
      break;}
    case 3:{ // Tlaloc — symmetric goggle rings BOTH same size, turquoise eyes, bifid tongue
      cx.fillStyle='#0A3010';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#18883A';
      cx.fillRect(x+5,y+2,8,2);cx.fillRect(x+5,y+8,8,2);cx.fillRect(x+5,y+2,2,8);cx.fillRect(x+11,y+2,2,8);
      cx.fillRect(x+13,y+2,8,2);cx.fillRect(x+13,y+8,8,2);cx.fillRect(x+13,y+2,2,8);cx.fillRect(x+19,y+2,2,8);
      cx.fillStyle='#FFFFFF';cx.fillRect(x+7,y+4,4,4);cx.fillRect(x+15,y+4,4,4);
      cx.fillStyle='#20D0FF';cx.fillRect(x+7,y+4,3,4);cx.fillRect(x+15,y+4,3,4);
      cx.fillStyle='#0A1A20';cx.fillRect(x+8,y+5,2,3);cx.fillRect(x+16,y+5,2,3);
      cx.fillStyle='rgba(255,255,255,0.95)';cx.fillRect(x+7,y+4,1,1);cx.fillRect(x+15,y+4,1,1);
      cx.fillStyle='#18883A';cx.fillRect(x+11,y+9,2,3);cx.fillRect(x+14,y+9,2,3);
      cx.fillStyle='#20B848';cx.fillRect(x+11,y+9,1,2);cx.fillRect(x+14,y+9,1,2);
      break;}
    case 4:{ // Xipe Totec — bipartita dorada/roja, both eyes same size
      const xL=fac===1?x+5:x+13,xR=fac===1?x+13:x+5;
      cx.fillStyle='#D4A020';cx.fillRect(xR,y+2,8,10);
      cx.fillStyle='#A02020';cx.fillRect(xL,y+2,8,10);
      cx.fillStyle='#3A0808';cx.fillRect(x+12,y+2,2,10);
      cx.fillStyle='#F0D040';cx.fillRect(x+12,y+3,1,1);cx.fillRect(x+12,y+6,1,1);cx.fillRect(x+12,y+9,1,1);
      _eyeN(lEye,y,'#FF8040');_eyeN(rEye,y,'#CC3010');
      break;}
    case 5:{ // Coatlicue — dark jade, SYMMETRIC hollow sockets, yellow slit eyes, fangs
      cx.fillStyle='#183020';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#080C08';cx.fillRect(x+5,y+2,8,7);cx.fillRect(x+13,y+2,8,7);
      cx.fillStyle='#183020';cx.fillRect(x+6,y+3,6,5);cx.fillRect(x+14,y+3,6,5);
      _eyeN(lEye,y,'#D8D010');_eyeN(rEye,y,'#D8D010');
      cx.fillStyle='#E8E4D8';cx.fillRect(x+10,y+8,2,3);cx.fillRect(x+15,y+8,2,3);
      cx.fillStyle='#CC1010';cx.fillRect(x+12,y+10,2,2);
      break;}
    case 6:{ // Chalchihuitlicue — jade, bead dots BOTH cheeks, disc ornaments both, nariguera, smile
      cx.fillStyle='#10A898';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#067060';cx.fillRect(x+5,y+2,16,2);
      cx.fillStyle='#00FFCC';
      cx.fillRect(x+6,y+5,1,1);cx.fillRect(x+8,y+4,1,1);cx.fillRect(x+8,y+6,1,1);
      cx.fillRect(x+19,y+5,1,1);cx.fillRect(x+17,y+4,1,1);cx.fillRect(x+17,y+6,1,1);
      cx.fillStyle='#00C8A8';cx.fillRect(x+5,y+4,2,5);cx.fillRect(x+19,y+4,2,5);
      cx.fillStyle='#AAEEDD';cx.fillRect(x+5,y+5,1,3);cx.fillRect(x+20,y+5,1,3);
      _eyeN(lEye,y,'#00EED0');_eyeN(rEye,y,'#00EED0');
      cx.fillStyle='#00FFCC';cx.fillRect(x+11,y+8,4,2);
      _smile(x,y);
      break;}
    case 7:{ // Mictlantecuhtli — skull, SYMMETRIC sockets BOTH SAME SIZE, red eyes, nasal, grin
      cx.fillStyle='#EAE0C8';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#BEB0A0';cx.fillRect(x+5,y+2,2,10);cx.fillRect(x+19,y+2,2,10);
      cx.fillStyle='#080606';cx.fillRect(x+5,y+2,8,7);cx.fillRect(x+13,y+2,8,7);
      cx.fillStyle='#EAE0C8';cx.fillRect(x+6,y+3,6,5);cx.fillRect(x+14,y+3,6,5);
      _eyeN(lEye,y,'#FF0808');_eyeN(rEye,y,'#FF0808');
      cx.fillStyle='#080606';cx.fillRect(x+12,y+7,2,2);
      cx.fillStyle='#EAE0C8';for(let i=0;i<7;i++)cx.fillRect(x+7+i*2,y+9,1,3);
      cx.fillStyle='#080606';for(let i=0;i<6;i++)cx.fillRect(x+8+i*2,y+9,1,3);
      break;}
    case 8:{ // Mictecacihuatl — skull, SYMMETRIC sockets, purple eyes, flowers BOTH cheeks, teeth
      cx.fillStyle='#DDD0B0';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#B8A888';cx.fillRect(x+5,y+2,2,10);cx.fillRect(x+19,y+2,2,10);
      cx.fillStyle='#140A14';cx.fillRect(x+5,y+2,8,7);cx.fillRect(x+13,y+2,8,7);
      cx.fillStyle='#DDD0B0';cx.fillRect(x+6,y+3,6,5);cx.fillRect(x+14,y+3,6,5);
      _eyeN(lEye,y,'#9030CC');_eyeN(rEye,y,'#9030CC');
      cx.fillStyle='#140A14';cx.fillRect(x+12,y+7,2,2);
      cx.fillStyle='#E85810';
      cx.fillRect(x+5,y+8,5,1);cx.fillRect(x+6,y+7,3,3);
      cx.fillRect(x+16,y+8,5,1);cx.fillRect(x+17,y+7,3,3);
      cx.fillStyle='#FFD820';cx.fillRect(x+7,y+8,1,1);cx.fillRect(x+18,y+8,1,1);
      cx.fillStyle='#EAE4D0';for(let i=0;i<5;i++)cx.fillRect(x+8+i*2,y+10,1,2);
      cx.fillStyle='#181010';for(let i=0;i<4;i++)cx.fillRect(x+9+i*2,y+10,1,2);
      break;}
    case 9:{ // Tonatiuh — red/gold bicolor, solar glow BOTH eyes same, open mouth + tongue
      cx.fillStyle='#CC3A08';cx.fillRect(x+5,y+2,16,4);
      cx.fillStyle='#E89A18';cx.fillRect(x+5,y+6,16,6);
      _eyeN(lEye,y,'#FF8800');_eyeN(rEye,y,'#FF8800');
      cx.fillStyle='rgba(255,160,0,0.45)';cx.fillRect(x+5,y+3,8,5);cx.fillRect(x+13,y+3,8,5);
      cx.fillStyle='#801808';cx.fillRect(x+10,y+9,7,2);
      cx.fillStyle='#DD1010';cx.fillRect(x+11,y+10,5,3);
      cx.fillStyle='#FF2020';cx.fillRect(x+12,y+10,3,2);
      break;}
    case 10:{ // Xolotl — dark dog, muzzle, 3 symmetric stripes, SAME sockets, amber eyes, tears, nose
      cx.fillStyle='#3A2818';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#6A4828';cx.fillRect(x+7,y+6,12,6);
      cx.fillStyle='#CC1010';cx.fillRect(x+7,y+2,2,9);cx.fillRect(x+12,y+2,2,9);cx.fillRect(x+17,y+2,2,7);
      cx.fillStyle='#1A0C08';cx.fillRect(x+5,y+2,8,7);cx.fillRect(x+13,y+2,8,7);
      cx.fillStyle='#3A2818';cx.fillRect(x+6,y+3,6,5);cx.fillRect(x+14,y+3,6,5);
      _eyeN(lEye,y,'#C07820');_eyeN(rEye,y,'#C07820');
      cx.fillStyle='#4A7ABB';cx.fillRect(x+8,y+7,2,4);cx.fillRect(x+15,y+7,2,4);
      cx.fillStyle='#1A0808';cx.fillRect(x+11,y+9,4,2);
      cx.fillStyle='#100606';cx.fillRect(x+12,y+9,2,1);
      break;}
    case 11:{ // Coyolxauhqui — pale moon, crescent center, BOTH closed arch eyes SAME, cascabeles BOTH cheeks
      cx.fillStyle='#EAE0CC';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#8898CC';cx.fillRect(x+10,y+2,6,2);cx.fillStyle='#EAE0CC';cx.fillRect(x+11,y+2,4,1);
      cx.fillStyle='#504030';
      cx.fillRect(x+7,y+4,6,1);cx.fillRect(x+8,y+5,4,1);cx.fillRect(x+7,y+4,1,2);cx.fillRect(x+12,y+4,1,2);
      cx.fillRect(x+14,y+4,6,1);cx.fillRect(x+15,y+5,4,1);cx.fillRect(x+14,y+4,1,2);cx.fillRect(x+19,y+4,1,2);
      cx.fillStyle='#D09818';cx.fillRect(x+6,y+7,6,4);cx.fillRect(x+14,y+7,6,4);
      cx.fillStyle='#F0C020';cx.fillRect(x+7,y+8,4,2);cx.fillRect(x+15,y+8,4,2);
      cx.fillStyle='#D09818';cx.fillRect(x+9,y+8,1,2);cx.fillRect(x+17,y+8,1,2);
      cx.fillStyle='rgba(255,220,30,0.5)';cx.fillRect(x+7,y+8,1,1);cx.fillRect(x+15,y+8,1,1);
      cx.fillStyle='#8A7050';cx.fillRect(x+12,y+10,2,1);
      break;}
    case 12:{ // Ometeotl — split teal/red, spiral divider, left eye teal same construction, right eye red same
      cx.fillStyle='#1A7888';cx.fillRect(x+5,y+2,8,10);
      cx.fillStyle='#882020';cx.fillRect(x+13,y+2,8,10);
      cx.fillStyle='#DDEEDD';cx.fillRect(x+12,y+2,2,10);
      cx.fillStyle='#FFFFFF';cx.fillRect(x+12,y+4,1,1);cx.fillRect(x+13,y+5,1,1);cx.fillRect(x+12,y+6,1,1);
      cx.fillStyle='#080608';cx.fillRect(lEye,y+3,4,1);
      cx.fillStyle='#FFFFFF';cx.fillRect(lEye,y+4,4,3);
      cx.fillStyle='#080608';cx.fillRect(lEye-1,y+4,1,3);cx.fillRect(lEye+4,y+4,1,3);cx.fillRect(lEye,y+7,4,1);
      cx.fillStyle='#00D8E8';cx.fillRect(lEye+1,y+4,2,2);
      cx.fillStyle='#080608';cx.fillRect(lEye+1,y+5,1,1);
      cx.fillStyle='rgba(255,255,255,0.9)';cx.fillRect(lEye+1,y+4,1,1);
      cx.fillStyle='#080608';cx.fillRect(rEye,y+3,4,1);
      cx.fillStyle='#FFFFFF';cx.fillRect(rEye,y+4,4,3);
      cx.fillStyle='#080608';cx.fillRect(rEye-1,y+4,1,3);cx.fillRect(rEye+4,y+4,1,3);cx.fillRect(rEye,y+7,4,1);
      cx.fillStyle='#FF5800';cx.fillRect(rEye+1,y+4,2,2);
      cx.fillStyle='#080608';cx.fillRect(rEye+1,y+5,1,1);
      cx.fillStyle='rgba(255,255,255,0.9)';cx.fillRect(rEye+1,y+4,1,1);
      break;}
    case 13:{ // Tlaltecuhtli — RED face, symmetric lateral toad eyes, wide gaping maw, gold teeth, tongue
      cx.fillStyle='#B02010';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#781008';cx.fillRect(x+5,y+2,16,2);
      cx.fillStyle='#060808';cx.fillRect(x+5,y+2,5,6);cx.fillRect(x+16,y+2,5,6);
      cx.fillStyle='#FFFFFF';cx.fillRect(x+5,y+3,4,4);cx.fillRect(x+17,y+3,4,4);
      cx.fillStyle='#060808';
      cx.fillRect(x+5,y+3,1,4);cx.fillRect(x+8,y+3,1,4);cx.fillRect(x+5,y+7,4,1);
      cx.fillRect(x+17,y+3,1,4);cx.fillRect(x+20,y+3,1,4);cx.fillRect(x+17,y+7,4,1);
      cx.fillStyle='#A8C010';cx.fillRect(x+6,y+3,2,4);cx.fillRect(x+18,y+3,2,4);
      cx.fillStyle='#060808';cx.fillRect(x+6,y+4,2,3);cx.fillRect(x+18,y+4,2,3);
      cx.fillStyle='rgba(255,255,255,0.9)';cx.fillRect(x+6,y+3,1,1);cx.fillRect(x+18,y+3,1,1);
      cx.fillStyle='#400808';cx.fillRect(x+7,y+7,12,5);
      cx.fillStyle='#E0C030';cx.fillRect(x+8,y+7,2,1);cx.fillRect(x+11,y+7,2,1);cx.fillRect(x+14,y+7,2,1);cx.fillRect(x+17,y+7,1,1);
      cx.fillStyle='#CC1010';cx.fillRect(x+9,y+9,8,2);
      break;}
    case 14:{ // Tlazolteotl — ochre/black, SYMMETRIC gold rings SAME SIZE, both white eyes same
      cx.fillStyle='#CC8820';cx.fillRect(x+5,y+2,16,5);
      cx.fillStyle='#080808';cx.fillRect(x+5,y+7,16,5);
      cx.fillStyle='#FFD040';
      cx.fillRect(x+5,y+2,8,1);cx.fillRect(x+5,y+7,8,1);cx.fillRect(x+5,y+2,1,6);cx.fillRect(x+12,y+2,1,6);
      cx.fillRect(x+13,y+2,8,1);cx.fillRect(x+13,y+7,8,1);cx.fillRect(x+13,y+2,1,6);cx.fillRect(x+20,y+2,1,6);
      cx.fillStyle='#CC8820';cx.fillRect(x+6,y+3,6,4);cx.fillRect(x+14,y+3,6,4);
      cx.fillStyle='#FFFFFF';cx.fillRect(x+7,y+4,4,2);cx.fillRect(x+15,y+4,4,2);
      cx.fillStyle='#080808';cx.fillRect(x+8,y+4,2,2);cx.fillRect(x+16,y+4,2,2);
      cx.fillStyle='rgba(255,255,255,0.9)';cx.fillRect(x+7,y+4,1,1);cx.fillRect(x+15,y+4,1,1);
      cx.fillStyle='#D8D0B8';cx.fillRect(x+9,y+9,8,1);
      break;}
    case 15:{ // Xochipilli — gold, BOTH pink eyes, flower BOTH cheeks, smile
      cx.fillStyle='#D89020';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#A86810';cx.fillRect(x+5,y+2,16,2);
      _eyeN(lEye,y,'#E83080');_eyeN(rEye,y,'#E83080');
      cx.fillStyle='#FF4890';
      cx.fillRect(x+5,y+7,5,1);cx.fillRect(x+6,y+6,3,3);
      cx.fillRect(x+16,y+7,5,1);cx.fillRect(x+17,y+6,3,3);
      cx.fillStyle='#FFE020';cx.fillRect(x+7,y+7,1,1);cx.fillRect(x+18,y+7,1,1);
      _smile(x,y);
      break;}
    case 16:{ // Xochiquetzal — gold, BOTH brows, both violet eyes, blush BOTH cheeks, red lips
      cx.fillStyle='#D09030';cx.fillRect(x+5,y+2,16,10);
      cx.fillStyle='#906010';cx.fillRect(x+5,y+2,16,1);
      cx.fillStyle='#200C00';cx.fillRect(x+5,y+2,8,3);cx.fillRect(x+13,y+2,8,3);
      _eyeN(lEye,y,'#8030C0');_eyeN(rEye,y,'#8030C0');
      cx.fillStyle='rgba(220,80,60,0.45)';cx.fillRect(x+5,y+8,5,2);cx.fillRect(x+16,y+8,5,2);
      cx.fillStyle='#C83020';cx.fillRect(x+10,y+10,7,2);
      cx.fillStyle='#E04828';cx.fillRect(x+11,y+10,5,1);
      break;}
  }
}
"""

new_lines = [l + '\n' for l in new_fn.split('\n')][:-1]
print(f"Replacing {3663-3444} lines with {len(new_lines)} lines")
lines[3444:3663] = new_lines

with open('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html', 'w') as f:
    f.writelines(lines)

print(f"Done. New total lines: {len(lines)}")
