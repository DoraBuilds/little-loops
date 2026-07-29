import React from "react";

// ─── Dog: BISCUIT ─────────────────────────────────────────────────────────────

const DogSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="dg-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFDF6A" />
        <stop offset="100%" stopColor="#D4961A" />
      </radialGradient>
      <radialGradient id="dg-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFF8E0" />
        <stop offset="100%" stopColor="#FFE8A0" />
      </radialGradient>
      <radialGradient id="dg-ear" cx="30%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#E8A820" />
        <stop offset="100%" stopColor="#A06010" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Floppy ears */}
    <ellipse cx="50" cy="71" rx="20" ry="28" fill="url(#dg-ear)" transform="rotate(-15,50,71)" />
    <ellipse cx="110" cy="71" rx="20" ry="28" fill="url(#dg-ear)" transform="rotate(15,110,71)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#dg-body)" />
    <ellipse cx="80" cy="124" rx="26" ry="20" fill="url(#dg-belly)" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#dg-body)" />
    <ellipse cx="104" cy="151" rx="14" ry="9" fill="url(#dg-body)" />
    {/* Collar */}
    <rect x="58" y="106" width="44" height="9" rx="4.5" fill="#E83838" />
    <circle cx="80" cy="110.5" r="5" fill="#F5C800" />
    {/* Head */}
    <circle cx="80" cy="76" r="38" fill="url(#dg-body)" />
    {/* Snout */}
    <ellipse cx="80" cy="88" rx="20" ry="14" fill="url(#dg-belly)" />
    {/* Nose */}
    <ellipse cx="80" cy="82" rx="8" ry="6" fill="#3A1A08" />
    <ellipse cx="77.5" cy="80.5" rx="2.5" ry="2" fill="rgba(255,255,255,0.55)" />
    {/* Eyes */}
    <circle cx="62" cy="68" r="10" fill="#3A2010" />
    <circle cx="98" cy="68" r="10" fill="#3A2010" />
    <circle cx="64.5" cy="65.5" r="3.5" fill="white" />
    <circle cx="100.5" cy="65.5" r="3.5" fill="white" />
    <circle cx="65.5" cy="64.5" r="1.5" fill="white" opacity="0.8" />
    <circle cx="101.5" cy="64.5" r="1.5" fill="white" opacity="0.8" />
    {/* Smile */}
    <path d="M70,95 Q80,103 90,95" stroke="#5A2A08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="53" cy="79" rx="9" ry="6" fill="rgba(255,140,80,0.28)" />
    <ellipse cx="107" cy="79" rx="9" ry="6" fill="rgba(255,140,80,0.28)" />
    {/* Highlights */}
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.22)" />
    <ellipse cx="67" cy="112" rx="11" ry="8" fill="rgba(255,255,255,0.18)" />
  </svg>
);

// ─── Unicorn: SPARKLE ─────────────────────────────────────────────────────────

const UnicornSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="uni-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F0D0E8" />
      </radialGradient>
      <radialGradient id="uni-horn" cx="30%" cy="20%" r="70%">
        <stop offset="0%" stopColor="#FFE87A" />
        <stop offset="100%" stopColor="#D4A010" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Mane behind head */}
    <ellipse cx="104" cy="55" rx="14" ry="20" fill="#E879F9" transform="rotate(20,104,55)" />
    <ellipse cx="96" cy="48" rx="12" ry="18" fill="#818CF8" transform="rotate(10,96,48)" />
    <ellipse cx="88" cy="43" rx="10" ry="16" fill="#F472B6" transform="rotate(0,88,43)" />
    {/* Horn */}
    <polygon points="80,12 74,52 86,52" fill="url(#uni-horn)" />
    <line x1="80" y1="18" x2="80" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#uni-body)" />
    {/* Tail */}
    <ellipse cx="126" cy="118" rx="12" ry="20" fill="#F472B6" transform="rotate(20,126,118)" />
    <ellipse cx="130" cy="115" rx="8" ry="15" fill="#818CF8" transform="rotate(25,130,115)" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#uni-body)" />
    <ellipse cx="104" cy="151" rx="14" ry="9" fill="url(#uni-body)" />
    {/* Head */}
    <circle cx="80" cy="76" r="38" fill="url(#uni-body)" />
    {/* Snout blush area */}
    <ellipse cx="80" cy="88" rx="18" ry="13" fill="rgba(255,180,220,0.3)" />
    <circle cx="74" cy="87" r="3" fill="rgba(200,100,150,0.5)" />
    <circle cx="86" cy="87" r="3" fill="rgba(200,100,150,0.5)" />
    {/* Eyes */}
    <circle cx="63" cy="70" r="11" fill="#5B3080" />
    <circle cx="97" cy="70" r="11" fill="#5B3080" />
    <circle cx="65.5" cy="67" r="4" fill="white" />
    <circle cx="99.5" cy="67" r="4" fill="white" />
    <circle cx="66.5" cy="66" r="2" fill="white" opacity="0.9" />
    <circle cx="100.5" cy="66" r="2" fill="white" opacity="0.9" />
    {/* Eyelashes */}
    <path d="M54,63 Q56,57 60,60" stroke="#5B3080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M57,60 Q61,55 64,59" stroke="#5B3080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M88,63 Q90,57 94,60" stroke="#5B3080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M91,60 Q95,55 98,59" stroke="#5B3080" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Smile */}
    <path d="M70,95 Q80,103 90,95" stroke="#CC70A0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="53" cy="79" rx="9" ry="6" fill="rgba(255,100,180,0.25)" />
    <ellipse cx="107" cy="79" rx="9" ry="6" fill="rgba(255,100,180,0.25)" />
    {/* Star sparkles */}
    <path d="M42,42 L44,36 L46,42 L52,44 L46,46 L44,52 L42,46 L36,44 Z" fill="#FFE87A" opacity="0.9" />
    <path d="M118,38 L119.5,34 L121,38 L125,39.5 L121,41 L119.5,45 L118,41 L114,39.5 Z" fill="#F472B6" opacity="0.9" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.35)" />
  </svg>
);

// ─── Dinosaur: CHOMPY ─────────────────────────────────────────────────────────

const DinosaurSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="dino-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#7FE860" />
        <stop offset="100%" stopColor="#3A9828" />
      </radialGradient>
      <radialGradient id="dino-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#D8F8C0" />
        <stop offset="100%" stopColor="#A8E888" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Tail */}
    <ellipse cx="125" cy="128" rx="18" ry="12" fill="url(#dino-body)" transform="rotate(20,125,128)" />
    <ellipse cx="138" cy="135" rx="10" ry="7" fill="url(#dino-body)" transform="rotate(30,138,135)" />
    {/* Body */}
    <ellipse cx="78" cy="120" rx="46" ry="36" fill="url(#dino-body)" />
    <ellipse cx="78" cy="122" rx="28" ry="22" fill="url(#dino-belly)" />
    {/* Back spikes */}
    <polygon points="42,97 50,80 58,97" fill="#2A8018" />
    <polygon points="58,90 66,72 74,90" fill="#2A8018" />
    <polygon points="74,87 82,68 90,87" fill="#2A8018" />
    <polygon points="90,90 98,73 106,90" fill="#2A8018" />
    {/* Paws */}
    <ellipse cx="56" cy="148" rx="14" ry="10" fill="url(#dino-body)" />
    <ellipse cx="100" cy="148" rx="14" ry="10" fill="url(#dino-body)" />
    <line x1="50" y1="152" x2="52" y2="157" stroke="#2A8018" strokeWidth="2" strokeLinecap="round" />
    <line x1="56" y1="153" x2="56" y2="158" stroke="#2A8018" strokeWidth="2" strokeLinecap="round" />
    <line x1="62" y1="152" x2="60" y2="157" stroke="#2A8018" strokeWidth="2" strokeLinecap="round" />
    {/* Head */}
    <circle cx="80" cy="75" r="36" fill="url(#dino-body)" />
    <ellipse cx="80" cy="87" rx="16" ry="12" fill="url(#dino-belly)" />
    {/* Eyes */}
    <circle cx="63" cy="66" r="11" fill="#1A3A08" />
    <circle cx="97" cy="66" r="11" fill="#1A3A08" />
    <circle cx="65.5" cy="63" r="4" fill="white" />
    <circle cx="99.5" cy="63" r="4" fill="white" />
    <circle cx="66.5" cy="62" r="2" fill="white" opacity="0.9" />
    <circle cx="100.5" cy="62" r="2" fill="white" opacity="0.9" />
    {/* Nostrils */}
    <circle cx="74" cy="80" r="3" fill="rgba(30,80,10,0.5)" />
    <circle cx="86" cy="80" r="3" fill="rgba(30,80,10,0.5)" />
    {/* Open smile with teeth */}
    <path d="M65,86 Q80,98 95,86" stroke="#1A4808" strokeWidth="2" fill="rgba(20,60,10,0.3)" strokeLinecap="round" />
    <rect x="71" y="86" width="6" height="5" rx="1" fill="white" />
    <rect x="79" y="88" width="6" height="5" rx="1" fill="white" />
    <rect x="87" y="86" width="6" height="5" rx="1" fill="white" />
    {/* Blush */}
    <ellipse cx="52" cy="77" rx="9" ry="6" fill="rgba(255,160,80,0.25)" />
    <ellipse cx="108" cy="77" rx="9" ry="6" fill="rgba(255,160,80,0.25)" />
    <ellipse cx="64" cy="61" rx="9" ry="7" fill="rgba(255,255,255,0.22)" />
    <ellipse cx="66" cy="108" rx="11" ry="8" fill="rgba(255,255,255,0.18)" />
  </svg>
);

// ─── Bunny: COTTON ────────────────────────────────────────────────────────────

const BunnySVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="bun-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E8D8F0" />
      </radialGradient>
      <radialGradient id="bun-inner-ear" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFB0D8" />
        <stop offset="100%" stopColor="#F070A0" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Ears */}
    <ellipse cx="58" cy="40" rx="14" ry="30" fill="url(#bun-body)" />
    <ellipse cx="102" cy="40" rx="14" ry="30" fill="url(#bun-body)" />
    <ellipse cx="58" cy="40" rx="7" ry="22" fill="url(#bun-inner-ear)" />
    <ellipse cx="102" cy="40" rx="7" ry="22" fill="url(#bun-inner-ear)" />
    {/* Fluffy tail */}
    <circle cx="125" cy="128" r="12" fill="url(#bun-body)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#bun-body)" />
    <ellipse cx="80" cy="124" rx="26" ry="20" fill="rgba(255,220,240,0.4)" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#bun-body)" />
    <ellipse cx="104" cy="151" rx="14" ry="9" fill="url(#bun-body)" />
    {/* Head */}
    <circle cx="80" cy="76" r="36" fill="url(#bun-body)" />
    {/* Eyes */}
    <circle cx="63" cy="70" r="10" fill="#5B2080" />
    <circle cx="97" cy="70" r="10" fill="#5B2080" />
    <circle cx="65.5" cy="67" r="3.5" fill="white" />
    <circle cx="99.5" cy="67" r="3.5" fill="white" />
    <circle cx="66.5" cy="66" r="1.5" fill="white" opacity="0.9" />
    <circle cx="100.5" cy="66" r="1.5" fill="white" opacity="0.9" />
    {/* Nose */}
    <ellipse cx="80" cy="82" rx="5" ry="4" fill="#FF8CB0" />
    {/* Mouth */}
    <path d="M75,86 Q80,91 85,86" stroke="#DD6090" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80,86 L80,91" stroke="#DD6090" strokeWidth="1.5" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="48" y1="81" x2="72" y2="83" stroke="rgba(180,140,200,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="48" y1="86" x2="72" y2="86" stroke="rgba(180,140,200,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="88" y1="83" x2="112" y2="81" stroke="rgba(180,140,200,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="88" y1="86" x2="112" y2="86" stroke="rgba(180,140,200,0.6)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="53" cy="80" rx="9" ry="6" fill="rgba(255,130,180,0.3)" />
    <ellipse cx="107" cy="80" rx="9" ry="6" fill="rgba(255,130,180,0.3)" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.35)" />
    <ellipse cx="66" cy="112" rx="11" ry="8" fill="rgba(255,255,255,0.25)" />
  </svg>
);

// ─── Cat: MOCHI ───────────────────────────────────────────────────────────────

const CatSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="cat-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFCC80" />
        <stop offset="100%" stopColor="#E07830" />
      </radialGradient>
      <radialGradient id="cat-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFF8F0" />
        <stop offset="100%" stopColor="#FFE8C0" />
      </radialGradient>
      <radialGradient id="cat-inner-ear" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFB0A0" />
        <stop offset="100%" stopColor="#E07878" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Curvy tail */}
    <path d="M126,130 Q145,100 130,80 Q118,65 122,80 Q128,98 120,125 Z" fill="url(#cat-body)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#cat-body)" />
    <ellipse cx="80" cy="124" rx="26" ry="20" fill="url(#cat-belly)" />
    {/* Body stripes */}
    <path d="M62,102 Q80,99 98,102" stroke="rgba(180,90,20,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <path d="M60,114 Q80,111 100,114" stroke="rgba(180,90,20,0.4)" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#cat-body)" />
    <ellipse cx="104" cy="151" rx="14" ry="9" fill="url(#cat-body)" />
    {/* Pointy ears */}
    <polygon points="52,53 44,28 68,42" fill="url(#cat-body)" />
    <polygon points="108,53 116,28 92,42" fill="url(#cat-body)" />
    <polygon points="54,51 48,32 66,43" fill="url(#cat-inner-ear)" />
    <polygon points="106,51 112,32 94,43" fill="url(#cat-inner-ear)" />
    {/* Head */}
    <circle cx="80" cy="76" r="36" fill="url(#cat-body)" />
    <ellipse cx="80" cy="87" rx="18" ry="13" fill="url(#cat-belly)" />
    {/* Forehead stripes */}
    <path d="M68,56 Q80,53 92,56" stroke="rgba(180,90,20,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M72,50 Q80,47 88,50" stroke="rgba(180,90,20,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Slit eyes */}
    <ellipse cx="63" cy="70" rx="10" ry="11" fill="#1A4010" />
    <ellipse cx="97" cy="70" rx="10" ry="11" fill="#1A4010" />
    <ellipse cx="63" cy="70" rx="4" ry="9" fill="#0A1A08" />
    <ellipse cx="97" cy="70" rx="4" ry="9" fill="#0A1A08" />
    <ellipse cx="64.5" cy="66" rx="2.5" ry="3" fill="white" opacity="0.7" />
    <ellipse cx="98.5" cy="66" rx="2.5" ry="3" fill="white" opacity="0.7" />
    {/* Nose */}
    <polygon points="80,81 76,85 84,85" fill="#E05878" />
    {/* Mouth */}
    <path d="M75,85 Q80,91 85,85" stroke="#C04060" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M80,85 L80,90" stroke="#C04060" strokeWidth="1.5" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="46" y1="82" x2="72" y2="85" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="46" y1="87" x2="72" y2="87" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="46" y1="92" x2="72" y2="89" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="88" y1="85" x2="114" y2="82" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="88" y1="87" x2="114" y2="87" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="88" y1="89" x2="114" y2="92" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="53" cy="80" rx="9" ry="6" fill="rgba(255,120,100,0.25)" />
    <ellipse cx="107" cy="80" rx="9" ry="6" fill="rgba(255,120,100,0.25)" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.22)" />
  </svg>
);

// ─── Bear: CUBBY ──────────────────────────────────────────────────────────────

const BearSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="bear-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#D4924A" />
        <stop offset="100%" stopColor="#8A4A18" />
      </radialGradient>
      <radialGradient id="bear-muzzle" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#F8E8C0" />
        <stop offset="100%" stopColor="#E8C880" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Round ears */}
    <circle cx="50" cy="48" r="18" fill="url(#bear-body)" />
    <circle cx="110" cy="48" r="18" fill="url(#bear-body)" />
    <circle cx="50" cy="48" r="10" fill="url(#bear-muzzle)" />
    <circle cx="110" cy="48" r="10" fill="url(#bear-muzzle)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#bear-body)" />
    <ellipse cx="80" cy="124" rx="28" ry="22" fill="url(#bear-muzzle)" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#bear-body)" />
    <ellipse cx="104" cy="151" rx="14" ry="9" fill="url(#bear-body)" />
    {/* Head */}
    <circle cx="80" cy="76" r="38" fill="url(#bear-body)" />
    {/* Muzzle */}
    <ellipse cx="80" cy="88" rx="20" ry="14" fill="url(#bear-muzzle)" />
    {/* Nose */}
    <ellipse cx="80" cy="82" rx="9" ry="7" fill="#2A1008" />
    <ellipse cx="77" cy="80" rx="3" ry="2.5" fill="rgba(255,255,255,0.5)" />
    {/* Eyes */}
    <circle cx="62" cy="68" r="11" fill="#2A1008" />
    <circle cx="98" cy="68" r="11" fill="#2A1008" />
    <circle cx="64.5" cy="65" r="4" fill="white" />
    <circle cx="100.5" cy="65" r="4" fill="white" />
    <circle cx="65.5" cy="64" r="2" fill="white" opacity="0.9" />
    <circle cx="101.5" cy="64" r="2" fill="white" opacity="0.9" />
    {/* Smile */}
    <path d="M68,94 Q80,104 92,94" stroke="#4A1A08" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="52" cy="78" rx="9" ry="6" fill="rgba(255,130,80,0.28)" />
    <ellipse cx="108" cy="78" rx="9" ry="6" fill="rgba(255,130,80,0.28)" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="67" cy="112" rx="11" ry="8" fill="rgba(255,255,255,0.15)" />
  </svg>
);

// ─── Fox: EMBER ───────────────────────────────────────────────────────────────

const FoxSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="fox-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FF8C50" />
        <stop offset="100%" stopColor="#C04818" />
      </radialGradient>
      <radialGradient id="fox-cream" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFF8F0" />
        <stop offset="100%" stopColor="#F8E8D0" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Bushy tail */}
    <ellipse cx="122" cy="130" rx="20" ry="28" fill="url(#fox-body)" transform="rotate(15,122,130)" />
    <ellipse cx="125" cy="142" rx="13" ry="16" fill="url(#fox-cream)" transform="rotate(15,125,142)" />
    {/* Body */}
    <ellipse cx="78" cy="122" rx="46" ry="36" fill="url(#fox-body)" />
    <ellipse cx="78" cy="124" rx="26" ry="20" fill="url(#fox-cream)" />
    {/* Paws */}
    <ellipse cx="56" cy="151" rx="14" ry="9" fill="url(#fox-body)" />
    <ellipse cx="100" cy="151" rx="14" ry="9" fill="url(#fox-body)" />
    {/* Pointy ears */}
    <polygon points="52,55 38,24 70,48" fill="url(#fox-body)" />
    <polygon points="108,55 122,24 90,48" fill="url(#fox-body)" />
    <polygon points="42,35 38,24 52,33" fill="#2A0808" />
    <polygon points="118,35 122,24 108,33" fill="#2A0808" />
    <polygon points="54,52 44,32 66,46" fill="url(#fox-cream)" />
    <polygon points="106,52 116,32 94,46" fill="url(#fox-cream)" />
    {/* Head */}
    <circle cx="80" cy="76" r="36" fill="url(#fox-body)" />
    {/* Face cream marking */}
    <polygon points="80,100 55,68 105,68" fill="url(#fox-cream)" />
    <ellipse cx="80" cy="88" rx="18" ry="12" fill="url(#fox-cream)" />
    {/* Nose */}
    <ellipse cx="80" cy="81" rx="7" ry="5.5" fill="#2A0808" />
    <ellipse cx="77.5" cy="79.5" rx="2.5" ry="2" fill="rgba(255,255,255,0.5)" />
    {/* Eyes */}
    <circle cx="63" cy="68" r="10" fill="#2A1808" />
    <circle cx="97" cy="68" r="10" fill="#2A1808" />
    <circle cx="65.5" cy="65" r="3.5" fill="white" />
    <circle cx="99.5" cy="65" r="3.5" fill="white" />
    <circle cx="66.5" cy="64" r="1.5" fill="white" opacity="0.9" />
    <circle cx="100.5" cy="64" r="1.5" fill="white" opacity="0.9" />
    {/* Smile */}
    <path d="M70,94 Q80,102 90,94" stroke="#5A2010" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="52" cy="78" rx="9" ry="6" fill="rgba(255,160,100,0.3)" />
    <ellipse cx="108" cy="78" rx="9" ry="6" fill="rgba(255,160,100,0.3)" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.22)" />
  </svg>
);

// ─── Penguin: PUDGE ───────────────────────────────────────────────────────────

const PenguinSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="peng-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#4A5A8A" />
        <stop offset="100%" stopColor="#1A2040" />
      </radialGradient>
      <radialGradient id="peng-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#E8EEF8" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Wings */}
    <ellipse cx="42" cy="112" rx="14" ry="28" fill="url(#peng-body)" transform="rotate(-10,42,112)" />
    <ellipse cx="118" cy="112" rx="14" ry="28" fill="url(#peng-body)" transform="rotate(10,118,112)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#peng-body)" />
    <ellipse cx="80" cy="124" rx="28" ry="26" fill="url(#peng-belly)" />
    {/* Orange feet */}
    <ellipse cx="62" cy="152" rx="14" ry="8" fill="#FF9A20" />
    <ellipse cx="98" cy="152" rx="14" ry="8" fill="#FF9A20" />
    <line x1="56" y1="156" x2="54" y2="161" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    <line x1="62" y1="157" x2="62" y2="162" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    <line x1="68" y1="156" x2="70" y2="161" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    <line x1="92" y1="156" x2="90" y2="161" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    <line x1="98" y1="157" x2="98" y2="162" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    <line x1="104" y1="156" x2="106" y2="161" stroke="#E07A10" strokeWidth="2" strokeLinecap="round" />
    {/* Head */}
    <circle cx="80" cy="74" r="36" fill="url(#peng-body)" />
    {/* Face white patch */}
    <ellipse cx="80" cy="82" rx="22" ry="26" fill="url(#peng-belly)" />
    {/* Beak */}
    <polygon points="80,80 72,86 88,86" fill="#FF9A20" />
    {/* Eyes (white with dark pupils) */}
    <circle cx="63" cy="65" r="11" fill="white" />
    <circle cx="97" cy="65" r="11" fill="white" />
    <circle cx="63" cy="65" r="7" fill="#1A2040" />
    <circle cx="97" cy="65" r="7" fill="#1A2040" />
    <circle cx="65" cy="62" r="3" fill="white" />
    <circle cx="99" cy="62" r="3" fill="white" />
    <circle cx="66" cy="61" r="1.5" fill="white" opacity="0.9" />
    <circle cx="100" cy="61" r="1.5" fill="white" opacity="0.9" />
    {/* Blush */}
    <ellipse cx="52" cy="76" rx="9" ry="6" fill="rgba(255,120,100,0.3)" />
    <ellipse cx="108" cy="76" rx="9" ry="6" fill="rgba(255,120,100,0.3)" />
    <ellipse cx="64" cy="59" rx="9" ry="7" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="67" cy="112" rx="11" ry="8" fill="rgba(255,255,255,0.12)" />
  </svg>
);

// ─── Owl: HOOT ────────────────────────────────────────────────────────────────

const OwlSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="owl-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#C0A0F0" />
        <stop offset="100%" stopColor="#7040B0" />
      </radialGradient>
      <radialGradient id="owl-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#F8F0FF" />
        <stop offset="100%" stopColor="#E0C8F8" />
      </radialGradient>
      <radialGradient id="owl-eye-ring" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#E8D088" />
        <stop offset="100%" stopColor="#B09020" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Wings */}
    <ellipse cx="42" cy="116" rx="18" ry="30" fill="url(#owl-body)" transform="rotate(-10,42,116)" />
    <ellipse cx="118" cy="116" rx="18" ry="30" fill="url(#owl-body)" transform="rotate(10,118,116)" />
    {/* Body */}
    <ellipse cx="80" cy="122" rx="46" ry="36" fill="url(#owl-body)" />
    <ellipse cx="80" cy="124" rx="28" ry="24" fill="url(#owl-belly)" />
    {/* Belly feather rows */}
    <path d="M66,108 Q80,103 94,108" stroke="rgba(180,140,240,0.4)" strokeWidth="2" fill="none" />
    <path d="M62,118 Q80,113 98,118" stroke="rgba(180,140,240,0.4)" strokeWidth="2" fill="none" />
    <path d="M64,128 Q80,123 96,128" stroke="rgba(180,140,240,0.4)" strokeWidth="2" fill="none" />
    {/* Feet */}
    <ellipse cx="62" cy="151" rx="12" ry="7" fill="#C8A020" />
    <ellipse cx="98" cy="151" rx="12" ry="7" fill="#C8A020" />
    {/* Ear tufts */}
    <polygon points="58,48 52,28 70,45" fill="url(#owl-body)" />
    <polygon points="102,48 108,28 90,45" fill="url(#owl-body)" />
    {/* Head */}
    <circle cx="80" cy="75" r="38" fill="url(#owl-body)" />
    {/* Golden eye rings (signature owl feature) */}
    <circle cx="63" cy="70" r="17" fill="url(#owl-eye-ring)" />
    <circle cx="97" cy="70" r="17" fill="url(#owl-eye-ring)" />
    {/* Pupils */}
    <circle cx="63" cy="70" r="12" fill="#1A0A40" />
    <circle cx="97" cy="70" r="12" fill="#1A0A40" />
    <circle cx="63" cy="70" r="8" fill="#3A2080" />
    <circle cx="97" cy="70" r="8" fill="#3A2080" />
    <circle cx="65.5" cy="67" r="4" fill="white" />
    <circle cx="99.5" cy="67" r="4" fill="white" />
    <circle cx="66.5" cy="66" r="2" fill="white" opacity="0.9" />
    <circle cx="100.5" cy="66" r="2" fill="white" opacity="0.9" />
    {/* Beak */}
    <polygon points="80,84 74,90 86,90" fill="#C8A020" />
    {/* Blush */}
    <ellipse cx="48" cy="82" rx="9" ry="6" fill="rgba(255,140,100,0.25)" />
    <ellipse cx="112" cy="82" rx="9" ry="6" fill="rgba(255,140,100,0.25)" />
    <ellipse cx="63" cy="58" rx="9" ry="7" fill="rgba(255,255,255,0.2)" />
    <ellipse cx="66" cy="112" rx="11" ry="8" fill="rgba(255,255,255,0.15)" />
  </svg>
);

// ─── Dragon: SPARKY ───────────────────────────────────────────────────────────

const DragonSVG = () => (
  <svg viewBox="0 0 160 165" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
    <defs>
      <radialGradient id="drag-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#60C8F0" />
        <stop offset="100%" stopColor="#2068C0" />
      </radialGradient>
      <radialGradient id="drag-belly" cx="40%" cy="35%" r="60%">
        <stop offset="0%" stopColor="#C8F0FF" />
        <stop offset="100%" stopColor="#88D8F8" />
      </radialGradient>
      <radialGradient id="drag-wing" cx="35%" cy="25%" r="75%">
        <stop offset="0%" stopColor="#A080E8" />
        <stop offset="100%" stopColor="#5030A0" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="158" rx="44" ry="7" fill="rgba(0,0,0,0.12)" />
    {/* Wings */}
    <path d="M55,95 Q30,55 20,40 Q35,55 48,80 Z" fill="url(#drag-wing)" />
    <path d="M105,95 Q130,55 140,40 Q125,55 112,80 Z" fill="url(#drag-wing)" />
    <path d="M55,95 Q35,70 25,50 L20,40 Q30,45 40,60 Q48,75 55,95 Z" fill="url(#drag-wing)" opacity="0.7" />
    <path d="M105,95 Q125,70 135,50 L140,40 Q130,45 120,60 Q112,75 105,95 Z" fill="url(#drag-wing)" opacity="0.7" />
    {/* Tail */}
    <path d="M126,125 Q148,110 145,90 Q140,80 132,95 Q128,108 120,120 Z" fill="url(#drag-body)" />
    {/* Body */}
    <ellipse cx="80" cy="120" rx="46" ry="36" fill="url(#drag-body)" />
    <ellipse cx="80" cy="122" rx="28" ry="22" fill="url(#drag-belly)" />
    {/* Belly scales */}
    <path d="M66,108 Q80,104 94,108" stroke="rgba(100,200,240,0.5)" strokeWidth="2" fill="none" />
    <path d="M62,118 Q80,114 98,118" stroke="rgba(100,200,240,0.5)" strokeWidth="2" fill="none" />
    {/* Paws */}
    <ellipse cx="56" cy="149" rx="14" ry="10" fill="url(#drag-body)" />
    <ellipse cx="104" cy="149" rx="14" ry="10" fill="url(#drag-body)" />
    <line x1="50" y1="153" x2="48" y2="158" stroke="#1850A0" strokeWidth="2" strokeLinecap="round" />
    <line x1="56" y1="154" x2="56" y2="159" stroke="#1850A0" strokeWidth="2" strokeLinecap="round" />
    <line x1="62" y1="153" x2="64" y2="158" stroke="#1850A0" strokeWidth="2" strokeLinecap="round" />
    {/* Head ridge spikes */}
    <polygon points="65,50 60,30 72,47" fill="#A080E8" />
    <polygon points="80,46 80,26 88,45" fill="#A080E8" />
    <polygon points="95,50 100,30 88,47" fill="#A080E8" />
    {/* Horns */}
    <polygon points="60,54 52,34 66,50" fill="#8060D0" />
    <polygon points="100,54 108,34 94,50" fill="#8060D0" />
    {/* Head */}
    <circle cx="80" cy="76" r="36" fill="url(#drag-body)" />
    {/* Snout */}
    <ellipse cx="80" cy="88" rx="18" ry="12" fill="url(#drag-belly)" />
    <circle cx="74" cy="86" r="3" fill="rgba(30,100,200,0.4)" />
    <circle cx="86" cy="86" r="3" fill="rgba(30,100,200,0.4)" />
    {/* Tiny flame puff */}
    <ellipse cx="80" cy="98" rx="8" ry="5" fill="#FFB020" opacity="0.8" />
    <ellipse cx="78" cy="95" rx="5" ry="4" fill="#FF6010" opacity="0.7" />
    <ellipse cx="82" cy="94" rx="4" ry="3" fill="#FFE030" opacity="0.8" />
    {/* Slit eyes */}
    <circle cx="63" cy="68" r="11" fill="#0A2870" />
    <circle cx="97" cy="68" r="11" fill="#0A2870" />
    <circle cx="63" cy="68" r="7" fill="#1848A0" />
    <circle cx="97" cy="68" r="7" fill="#1848A0" />
    <ellipse cx="63" cy="68" rx="3" ry="7" fill="#030820" />
    <ellipse cx="97" cy="68" rx="3" ry="7" fill="#030820" />
    <ellipse cx="64.5" cy="64" rx="2.5" ry="3" fill="white" opacity="0.7" />
    <ellipse cx="98.5" cy="64" rx="2.5" ry="3" fill="white" opacity="0.7" />
    {/* Smile */}
    <path d="M68,94 Q80,103 92,94" stroke="#1050B0" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="52" cy="79" rx="9" ry="6" fill="rgba(160,200,255,0.3)" />
    <ellipse cx="108" cy="79" rx="9" ry="6" fill="rgba(160,200,255,0.3)" />
    {/* Sparkles */}
    <path d="M28,76 L30,70 L32,76 L38,78 L32,80 L30,86 L28,80 L22,78 Z" fill="#FFE030" opacity="0.9" />
    <path d="M124,60 L126,56 L128,60 L132,61.5 L128,63 L126,67 L124,63 L120,61.5 Z" fill="#80D0FF" opacity="0.9" />
    <ellipse cx="64" cy="62" rx="9" ry="7" fill="rgba(255,255,255,0.25)" />
    <ellipse cx="67" cy="110" rx="11" ry="8" fill="rgba(255,255,255,0.18)" />
  </svg>
);

// ─── Animal Data ──────────────────────────────────────────────────────────────

export interface AnimalData {
  id: string;
  name: string;
  tagline: string;
  bgFrom: string;
  bgTo: string;
  SVGComponent: React.FC;
}

export const ANIMALS: AnimalData[] = [
  {
    id: "dog",
    name: "BISCUIT",
    tagline: "Your loyal sunshine buddy",
    bgFrom: "#F5A623",
    bgTo: "#E8921A",
    SVGComponent: DogSVG,
  },
  {
    id: "unicorn",
    name: "SPARKLE",
    tagline: "Magical and always bright",
    bgFrom: "#FF6B9D",
    bgTo: "#E85088",
    SVGComponent: UnicornSVG,
  },
  {
    id: "dinosaur",
    name: "CHOMPY",
    tagline: "Roar your way through the day",
    bgFrom: "#56C449",
    bgTo: "#3A9830",
    SVGComponent: DinosaurSVG,
  },
  {
    id: "bunny",
    name: "COTTON",
    tagline: "Soft, sweet, and full of hops",
    bgFrom: "#9B7FE8",
    bgTo: "#7B5AD0",
    SVGComponent: BunnySVG,
  },
  {
    id: "cat",
    name: "MOCHI",
    tagline: "Curious cat, big heart",
    bgFrom: "#FF8B6A",
    bgTo: "#E86048",
    SVGComponent: CatSVG,
  },
  {
    id: "bear",
    name: "CUBBY",
    tagline: "Big hugs for big days",
    bgFrom: "#5BB8F5",
    bgTo: "#3898E0",
    SVGComponent: BearSVG,
  },
  {
    id: "fox",
    name: "EMBER",
    tagline: "Clever, quick, and bold",
    bgFrom: "#FF6B4A",
    bgTo: "#E04828",
    SVGComponent: FoxSVG,
  },
  {
    id: "penguin",
    name: "PUDGE",
    tagline: "Cool in any weather",
    bgFrom: "#2DD4BF",
    bgTo: "#18B0A0",
    SVGComponent: PenguinSVG,
  },
  {
    id: "owl",
    name: "HOOT",
    tagline: "Wise eyes, warm heart",
    bgFrom: "#8B5CF6",
    bgTo: "#6D38E0",
    SVGComponent: OwlSVG,
  },
  {
    id: "dragon",
    name: "SPARKY",
    tagline: "Fierce, friendly, and fantastic",
    bgFrom: "#3B82F6",
    bgTo: "#1D5FD0",
    SVGComponent: DragonSVG,
  },
];

// ─── Animal Card ──────────────────────────────────────────────────────────────

interface AnimalCardProps {
  animal: AnimalData;
  onSelect?: (animal: AnimalData) => void;
  isSelected?: boolean;
  isLocked?: boolean;
}

export const AnimalCard: React.FC<AnimalCardProps> = ({
  animal,
  onSelect,
  isSelected = false,
  isLocked = false,
}) => {
  const { name, tagline, bgFrom, bgTo, SVGComponent } = animal;

  return (
    <button
      type="button"
      onClick={() => !isLocked && onSelect?.(animal)}
      aria-label={`${name} companion${isLocked ? " (locked)" : ""}`}
      className={[
        "relative flex flex-col items-center rounded-3xl overflow-hidden",
        "transition-all duration-200",
        isLocked ? "opacity-60 grayscale cursor-not-allowed" : "cursor-pointer active:scale-95",
        isSelected
          ? "ring-4 ring-white ring-offset-2 scale-105 shadow-2xl"
          : "shadow-lg hover:shadow-xl hover:scale-[1.02]",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: 160,
        minHeight: 230,
        background: `linear-gradient(160deg, ${bgFrom} 0%, ${bgTo} 100%)`,
      }}
    >
      {/* Inner radial light — gives the card a 3D pop */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 35%, rgba(255,255,255,0.38) 0%, transparent 62%)",
        }}
      />

      {/* Animal illustration */}
      <div className="relative z-10 w-full px-3 pt-4" style={{ height: 165 }}>
        <SVGComponent />
      </div>

      {/* Name + tagline */}
      <div className="relative z-10 w-full px-4 pb-5 pt-1 text-center">
        <p
          className="font-black text-white uppercase tracking-widest text-base leading-none"
          style={{
            fontFamily: "'Fredoka', sans-serif",
            textShadow: "0 1px 4px rgba(0,0,0,0.22)",
          }}
        >
          {name}
        </p>
        <p
          className="text-white/80 text-xs mt-1 leading-tight"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          {tagline}
        </p>
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-black/20">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-white drop-shadow" fill="currentColor">
            <path d="M12 1C9.239 1 7 3.239 7 6v1H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-2V6c0-2.761-2.239-5-5-5zm0 2c1.657 0 3 1.343 3 3v1H9V6c0-1.657 1.343-3 3-3zm0 10a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </div>
      )}

      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
};

// ─── Animal Gallery ───────────────────────────────────────────────────────────

interface AnimalGalleryProps {
  selectedId?: string;
  lockedIds?: string[];
  onSelect?: (animal: AnimalData) => void;
}

export const AnimalGallery: React.FC<AnimalGalleryProps> = ({
  selectedId,
  lockedIds = [],
  onSelect,
}) => (
  <div className="flex flex-wrap justify-center gap-4 p-4">
    {ANIMALS.map((animal) => (
      <AnimalCard
        key={animal.id}
        animal={animal}
        isSelected={selectedId === animal.id}
        isLocked={lockedIds.includes(animal.id)}
        onSelect={onSelect}
      />
    ))}
  </div>
);
