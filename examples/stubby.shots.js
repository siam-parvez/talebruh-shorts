// A STRAY DOG BECAME A WAR HERO (Sergeant Stubby, WWI): the shot list. Everything is cut paper.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, line } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { NIGHT, nightPage, dayPage, ground, Wf, pop, dog, heart } from './extras.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

const MUD = '#6E5A44', GAS = '#A9B07A';
function medal(x, y, s = 1) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_poly([[-30, -90], [30, -90], [15, -20], [-15, -20]]), P.crimson, { shadow: 0.4, edge: 3 }); cut(P_circ(0, 20, 45), P.gold, { shadow: 0.6, edge: 4 }); cut(P_poly([[0, -8], [10, 14], [32, 14], [14, 28], [20, 50], [0, 36], [-20, 50], [-14, 28], [-32, 14], [-10, 14]]), '#A87A22', { shadow: 0, edge: 0 }); ctx.restore(); }
function soldier(x, y, h, o = {}) { K.figure({ x, y, h, role: 'guard', dir: o.dir || 1, walk: o.walk, arm: o.arm }); }
function trench(seed) { dayPage(seed, 1400, MUD); for (let i = 0; i < 9; i++) cut(P_rr(-60 + i * 140, 1340 - (i % 2) * 20, 150, 70, 30), '#B8A27A', { shadow: 0.6, edge: 4 }); }
function gas(x, y, s, a = 1, t = 0) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); for (const [dx, dy, r] of [[-120, 0, 90], [-30, -50, 110], [80, -10, 95], [170, 20, 80], [20, 40, 90]]) { const r2 = r + Math.sin(t * 2 + dx) * 8; ctx.moveTo(dx + r2, dy); ctx.arc(dx, dy, r2, 0, TAU); } }, GAS, { shadow: 0.4, edge: 4 }); ctx.restore(); }
function museum(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-420, -560, 840, 560, 4), P.stone); cut(P_poly([[-460, -560], [0, -760], [460, -560]]), P.stoneDark); for (let i = 0; i < 6; i++) cut(P_rr(-370 + i * 140, -500, 60, 500, 6), '#D2C4A6', { shadow: 0.4, edge: 4 }); cut(P_rr(-480, -30, 960, 40, 4), P.stoneDark); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);

  // 0 · a stray dog snuck into WWI and came home a hero
  { const hr = Wf('hero', 0, 3.2);
    add({ id: 'S01', at: 0, cam: [540, 1150], zoom: 0.1, note: 'the dog trots into a trench, a medal lands on him', draw(lt, d, t) {
      trench(1); soldier(220, 1400, 520, {}); soldier(880, 1400, 520, { dir: -1 });
      dog(lerp(-100, 520, eo(clamp(lt / 2.2))), 1420, 1.15, 1, { walk: lt < 2.2 ? lt * 10 : null, coat: lt > hr ? P.royal : null });
      K.ribbon('WORLD WAR I', 540, 330, pop(lt, 0.15, 0.4), 84);
      medal(600, 1080, pop(lt, hr) * 1.2);
    } });
    cue(0.05, 'whoosh'); cue(0.15, 'pop', { gain: 0.6 }); cue(hr, 'sparkle', { dur: 1 }); }

  // 1 · 1917, a stray puppy wandered into soldiers training at Yale
  { const st = cut_(1), ya = Wf('yale', 1, st + 3.6) - st;
    add({ id: 'S02', at: st, cam: [540, 1100], zoom: 0.08, note: 'soldiers drill by a college hall, the puppy wanders in', draw(lt, d, t) {
      dayPage(2, 1450, '#7E8B5A');
      cut(P_rr(160, 640, 760, 560, 4), '#A8503E', { shadow: 0.6, edge: 5 }); cut(P_poly([[140, 650], [540, 470], [940, 650]]), '#5E3B28'); for (let i = 0; i < 5; i++) { rr(210 + i * 145, 760, 70, 110, 30); ctx.fillStyle = P.ink; ctx.fill(); }
      for (let i = 0; i < 4; i++) soldier(140 + i * 140, 1450, 400, { walk: lt * 7 + i });
      dog(lerp(1150, 790, eo(clamp(lt / 3))), 1460, 0.75, -1, { walk: lt < 3 ? lt * 10 : null });
      K.ribbon('1917', 540, 230, pop(lt, 0.1, 0.4));
      K.slip('YALE, CONNECTICUT', 540, 400, pop(lt, ya), -0.02, 52);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop', { gain: 0.5 }); cue(st + ya, 'pop'); }

  // 2 · Robert Conroy smuggled him to France: map route
  { const st = cut_(2), sm = Wf('smuggled', 2, st + 1.6) - st, fr = Wf('france', 2, st + 3.4) - st;
    add({ id: 'S03', at: st, cam: [540, 860], zoom: 0.07, note: 'map: dashed route from USA to France, a ship follows it', draw(lt, d, t) {
      const p = eio(seg(lt, sm, fr + 0.3));
      const m = K.map({ labels: [['NEW HAVEN', 420, 640], ['FRANCE', 720, 1040]], seed: 3 });
      if (p > 0) { const h = K.dashedRoute(m.route, p); K.ship(h[0], h[1] + 30, 0.28, 0); }
      K.slip('CPL. ROBERT CONROY', 540, 1300, pop(lt, 0.15), -0.02, 48);
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop'); cue(st + sm, 'slide', { dur: 1.6 }); cue(st + fr, 'pop'); }

  // 3 · an officer caught him, the dog saluted
  { const st = cut_(3), sa = Wf('saluted', 3, st + 1.8) - st;
    add({ id: 'S04', at: st, cam: [600, 1150], zoom: 0.12, note: 'officer stares down, the dog raises a paw to salute', draw(lt, d, t) {
      dayPage(4, 1450, MUD); cut(P_rr(-300, 600, W + 600, 850, 0), '#9C8C70', { shadow: 0, edge: 0 });
      K.figure({ x: 300, y: 1450, h: 720, role: 'guard', arm: lt > sa + 0.3 ? 130 : 0 });
      dog(720, 1460, 1.2, -1, { salute: lt > sa });
      K.slip('OFFICER', 300, 560, pop(lt, 0.15), -0.03, 50);
      if (lt > sa) K.slip('SALUTE!', 760, 640, pop(lt, sa), 0.04, 66);
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'pop', { gain: 0.5 }); cue(st + sa, 'boing', { gain: 0.5 }); }

  // 4 · so he could stay
  { const st = cut_(4);
    add({ id: 'S05', at: st, cam: [600, 1150], zoom: 0.08, note: 'officer salutes back, a heart pops', draw(lt, d, t) {
      dayPage(5, 1450, MUD); cut(P_rr(-300, 600, W + 600, 850, 0), '#9C8C70', { shadow: 0, edge: 0 });
      K.figure({ x: 300, y: 1450, h: 720, role: 'guard', arm: 130 }); dog(720, 1460, 1.2, -1, { salute: true });
      heart(540, 640, pop(lt, 0.2) * 1.3);
      K.slip('HE STAYS', 540, 400, pop(lt, 0.3), -0.03, 64);
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'sparkle', { dur: 0.8 }); }

  // 5 · survived a gas attack, then warned the men when gas was coming
  { const st = cut_(5), wn = Wf('warn', 5, st + 2.4) - st;
    add({ id: 'S06', at: st, cam: [540, 1150], zoom: 0.08, note: 'gas cloud rolls in; dog in a gas mask barks the warning', draw(lt, d, t) {
      trench(6);
      gas(lerp(1300, 860, eo(clamp(lt / d))), 900, 1.3, 0.85, t); gas(lerp(1500, 1080, eo(clamp(lt / d))), 1150, 1.0, 0.75, t);
      soldier(200, 1400, 500, { arm: lt > wn + 0.5 ? 150 : 10 });
      dog(560, 1420, 1.1, 1, { mask: lt > 0.6 });
      if (lt > wn) K.slip('WOOF!', 640, 820, pop(lt, wn), 0.05, 70);
      K.slip('GAS!', 300, 420, pop(lt, 0.3), -0.04, 80);
    } });
    cue(st, 'whoosh'); cue(st + 0.3, 'pop'); cue(st, 'slide', { dur: 3, gain: 0.5 }); cue(st + wn, 'boing', { gain: 0.5 }); }

  // 6 · he found wounded soldiers
  { const st = cut_(6), wd = Wf('wounded', 6, st + 0.4) - st;
    add({ id: 'S07', at: st, cam: [540, 1150], zoom: 0.1, note: 'night: the dog finds a soldier lying in the mud', draw(lt, d, t) {
      nightPage(7); ground(1400, '#3A3030');
      ctx.save(); ctx.translate(180, 1330); ctx.rotate(Math.PI / 2); K.figure({ x: 0, y: 0, h: 440, role: 'guard' }); ctx.restore();
      dog(lerp(1150, 880, eo(clamp(lt / 0.8))), 1410, 1.0, -1, { walk: lt < 0.8 ? lt * 12 : null });
      K.slip('FOUND!', 540, 640, pop(lt, wd + 0.3), 0.03, 66);
    } });
    cue(st, 'whoosh'); cue(st + wd + 0.3, 'pop'); }

  // 7 · legend says he caught a German spy by the seat of his pants
  { const st = cut_(7), sp = Wf('spy', 7, st + 1.8) - st, pa = Wf('pants', 7, st + 3.2) - st;
    add({ id: 'S08', at: st, cam: [540, 1150], zoom: 0.08, note: 'a spy sneaks off; the dog grabs his trousers', draw(lt, d, t) {
      trench(8);
      const caught = lt > pa - 0.3; const sx = caught ? 620 + Math.sin(lt * 20) * 6 : lerp(300, 620, eo(clamp(lt / (pa - 0.3))));
      K.figure({ x: sx, y: 1400, h: 600, role: 'merchant', walk: caught ? lt * 20 : lt * 8, arm: caught ? 140 : 30 });
      dog(caught ? sx - 250 : lerp(-200, sx - 280, eo(clamp(lt / (pa - 0.3)))), 1420, 1.0, 1, { walk: lt * 12 });
      K.slip('LEGEND SAYS...', 540, 330, pop(lt, 0.1), -0.03, 56);
      K.slip('SPY', 760, 520, pop(lt, sp), 0.04, 70);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'pop'); cue(st + sp, 'pop'); cue(st + pa - 0.3, 'boing'); }

  // 8 · met three presidents, known as Sergeant Stubby
  { const st = cut_(8), pr = Wf('presidents', 8, st + 1.4) - st, sg = Wf('sergeant', 8, st + 3) - st;
    add({ id: 'S09', at: st, cam: [540, 1100], zoom: 0.08, note: 'three presidents, Stubby in his medal coat, ribbon SGT. STUBBY', draw(lt, d, t) {
      K.hall();
      for (let i = 0; i < 3; i++) K.figure({ x: 160 + i * 190, y: 1480, h: 540, role: 'merchant', arm: lt > pr ? 40 : 0 });
      if (lt > pr) K.slip('3 PRESIDENTS', 350, 560, pop(lt, pr), -0.03, 50);
      dog(860, 1490, 1.0, -1, { coat: P.royal }); medal(830, 1300, 0.4); medal(880, 1300, 0.4);
      K.ribbon('SGT. STUBBY', 540, 330, pop(lt, sg, 0.4), 90);
    } });
    cue(st, 'whoosh'); cue(st + pr, 'pop'); cue(st + sg, 'sparkle', { dur: 1 }); }

  // 9 · today, he's at the Smithsonian
  { const st = cut_(9), sm = Wf('smithsonian', 9, st + 0.8) - st;
    add({ id: 'S10', at: st, cam: [540, 1100], zoom: 0.08, note: 'the museum; Stubby in a glass case', draw(lt, d, t) {
      dayPage(10, 1450, P.stoneDark); museum(540, 1450, 1.05);
      dog(760, 1420, 0.85, -1, { coat: P.royal }); cut(P_rr(560, 1080, 400, 360, 6), 'rgba(200,225,230,0.35)', { shadow: 0, edge: 5 });
      K.slip('SMITHSONIAN', 540, 360, pop(lt, sm), -0.02, 64);
    } });
    cue(st, 'whoosh'); cue(st + sm, 'pop'); }

  // 10 · not bad for a stray who wandered into the wrong place (loop to shot 1)
  { const st = cut_(10), pl = Wf('place', 10, st + 2.4) - st;
    add({ id: 'S11', at: st, cam: [540, 1150], zoom: 0.1, note: 'back at the trench: the stray trots in again', draw(lt, d, t) {
      trench(11); soldier(220, 1400, 520, {}); soldier(880, 1400, 520, { dir: -1 });
      dog(lerp(-150, 500, eo(clamp(lt / d))), 1420, 1.15, 1, { walk: lt * 10 });
      K.slip('THE WRONG PLACE?', 540, 400, pop(lt, pl), 0.03, 60);
    } });
    cue(st, 'whoosh'); cue(st + pl, 'pop'); }

  return { shots: S, cues: CUES };
}
