export interface AnimalAvatarPreset {
  id: string;
  label: string;
  dataUrl: string;
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, ' ').trim())}`;
}

export const ANIMAL_AVATARS: AnimalAvatarPreset[] = [
  {
    id: 'cat',
    label: 'Mèo Cam',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#dff2ff"/>
        <circle cx="80" cy="146" r="46" fill="#4086ee"/>
        <polygon points="36,70 42,26 70,50" fill="#f9943b"/>
        <polygon points="43,62 46,36 63,51" fill="#ffd2b3"/>
        <polygon points="124,70 118,26 90,50" fill="#f9943b"/>
        <polygon points="117,62 114,36 97,51" fill="#ffd2b3"/>
        <ellipse cx="80" cy="86" rx="46" ry="42" fill="#ffa959"/>
        <ellipse cx="80" cy="98" rx="28" ry="22" fill="#fff4e6"/>
        <path d="M74 50 L80 60 L86 50" stroke="#e0741c" stroke-width="4" stroke-linecap="round" fill="none"/>
        <path d="M64 47 L69 57" stroke="#e0741c" stroke-width="3.5" stroke-linecap="round"/>
        <path d="M96 47 L91 57" stroke="#e0741c" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="62" cy="80" r="6" fill="#1e293b"/>
        <circle cx="60" cy="78" r="2" fill="#ffffff"/>
        <circle cx="98" cy="80" r="6" fill="#1e293b"/>
        <circle cx="96" cy="78" r="2" fill="#ffffff"/>
        <ellipse cx="51" cy="90" rx="6.5" ry="4" fill="#ff8fa3" opacity="0.65"/>
        <ellipse cx="109" cy="90" rx="6.5" ry="4" fill="#ff8fa3" opacity="0.65"/>
        <polygon points="75,91 85,91 80,97" fill="#ff6b81"/>
        <path d="M72 101 Q76 106 80 100 Q84 106 88 101" stroke="#334155" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M36 86 L50 88 M36 96 L50 94" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M124 86 L110 88 M124 96 L110 94" stroke="#b45309" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `),
  },
  {
    id: 'puppy',
    label: 'Cún Corgi',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#e6faef"/>
        <circle cx="80" cy="146" r="46" fill="#38bdf8"/>
        <ellipse cx="38" cy="82" rx="14" ry="28" transform="rotate(14 38 82)" fill="#c97a3d"/>
        <ellipse cx="122" cy="82" rx="14" ry="28" transform="rotate(-14 122 82)" fill="#c97a3d"/>
        <ellipse cx="80" cy="84" rx="44" ry="40" fill="#f4b16e"/>
        <circle cx="62" cy="78" r="14" fill="#c97a3d"/>
        <ellipse cx="80" cy="98" rx="26" ry="21" fill="#fffaf0"/>
        <circle cx="62" cy="78" r="5.5" fill="#1e293b"/>
        <circle cx="60" cy="76" r="2" fill="#ffffff"/>
        <circle cx="98" cy="78" r="5.5" fill="#1e293b"/>
        <circle cx="96" cy="76" r="2" fill="#ffffff"/>
        <ellipse cx="50" cy="91" rx="6" ry="3.8" fill="#fb7185" opacity="0.55"/>
        <ellipse cx="110" cy="91" rx="6" ry="3.8" fill="#fb7185" opacity="0.55"/>
        <ellipse cx="80" cy="90" rx="7" ry="5" fill="#1e293b"/>
        <path d="M72 99 Q80 107 88 99" stroke="#334155" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M76 103 Q80 114 84 103 Z" fill="#fb7185"/>
      </svg>
    `),
  },
  {
    id: 'panda',
    label: 'Gấu Trúc',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#ede9fe"/>
        <circle cx="80" cy="146" r="46" fill="#2563eb"/>
        <circle cx="43" cy="50" r="17" fill="#1e293b"/>
        <circle cx="117" cy="50" r="17" fill="#1e293b"/>
        <ellipse cx="80" cy="86" rx="46" ry="42" fill="#ffffff"/>
        <ellipse cx="60" cy="80" rx="13" ry="16" transform="rotate(-14 60 80)" fill="#1e293b"/>
        <ellipse cx="100" cy="80" rx="13" ry="16" transform="rotate(14 100 80)" fill="#1e293b"/>
        <circle cx="61" cy="79" r="4.5" fill="#ffffff"/>
        <circle cx="62" cy="79" r="2.2" fill="#0f172a"/>
        <circle cx="99" cy="79" r="4.5" fill="#ffffff"/>
        <circle cx="98" cy="79" r="2.2" fill="#0f172a"/>
        <ellipse cx="48" cy="95" rx="6.5" ry="4" fill="#fda4af" opacity="0.8"/>
        <ellipse cx="112" cy="95" rx="6.5" ry="4" fill="#fda4af" opacity="0.8"/>
        <ellipse cx="80" cy="92" rx="6.5" ry="4.5" fill="#1e293b"/>
        <path d="M72 101 Q76 106 80 100 Q84 106 88 101" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'bunny',
    label: 'Thỏ Trắng',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#ffe8f0"/>
        <circle cx="80" cy="148" r="44" fill="#60a5fa"/>
        <ellipse cx="58" cy="44" rx="12" ry="30" transform="rotate(-10 58 44)" fill="#ffffff"/>
        <ellipse cx="58" cy="46" rx="6.5" ry="21" transform="rotate(-10 58 46)" fill="#ffb3c6"/>
        <ellipse cx="102" cy="44" rx="12" ry="30" transform="rotate(10 102 44)" fill="#ffffff"/>
        <ellipse cx="102" cy="46" rx="6.5" ry="21" transform="rotate(10 102 46)" fill="#ffb3c6"/>
        <ellipse cx="80" cy="90" rx="44" ry="39" fill="#ffffff"/>
        <circle cx="62" cy="85" r="5.5" fill="#1e293b"/>
        <circle cx="60" cy="83" r="2" fill="#ffffff"/>
        <circle cx="98" cy="85" r="5.5" fill="#1e293b"/>
        <circle cx="96" cy="83" r="2" fill="#ffffff"/>
        <ellipse cx="50" cy="95" rx="6.5" ry="4" fill="#ff8fa3" opacity="0.7"/>
        <ellipse cx="110" cy="95" rx="6.5" ry="4" fill="#ff8fa3" opacity="0.7"/>
        <polygon points="76,94 84,94 80,99" fill="#fb7185"/>
        <path d="M73 103 Q77 107 80 102 Q83 107 87 103" stroke="#475569" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'fox',
    label: 'Cáo Nhỏ',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#dbeafe"/>
        <circle cx="80" cy="146" r="46" fill="#0ea5e9"/>
        <polygon points="34,76 42,24 74,52" fill="#ea580c"/>
        <polygon points="43,66 47,36 66,53" fill="#fff7ed"/>
        <polygon points="126,76 118,24 86,52" fill="#ea580c"/>
        <polygon points="117,66 113,36 94,53" fill="#fff7ed"/>
        <ellipse cx="80" cy="86" rx="46" ry="40" fill="#f97316"/>
        <path d="M35 90 Q58 76 80 100 Q102 76 125 90 Q118 126 80 126 Q42 126 35 90 Z" fill="#fff7ed"/>
        <circle cx="62" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="60" cy="78" r="2" fill="#ffffff"/>
        <circle cx="98" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="96" cy="78" r="2" fill="#ffffff"/>
        <ellipse cx="50" cy="92" rx="6" ry="3.8" fill="#fb7185" opacity="0.55"/>
        <ellipse cx="110" cy="92" rx="6" ry="3.8" fill="#fb7185" opacity="0.55"/>
        <circle cx="80" cy="98" r="5.5" fill="#1e293b"/>
        <path d="M73 106 Q80 112 87 106" stroke="#334155" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'frog',
    label: 'Ếch Xanh',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#fef9c3"/>
        <circle cx="80" cy="148" r="44" fill="#3b82f6"/>
        <circle cx="56" cy="56" r="18" fill="#4ade80"/>
        <circle cx="104" cy="56" r="18" fill="#4ade80"/>
        <ellipse cx="80" cy="92" rx="48" ry="37" fill="#4ade80"/>
        <ellipse cx="80" cy="104" rx="34" ry="20" fill="#dcfce7"/>
        <circle cx="56" cy="56" r="11" fill="#ffffff"/>
        <circle cx="56" cy="56" r="5.5" fill="#1e293b"/>
        <circle cx="54" cy="54" r="2" fill="#ffffff"/>
        <circle cx="104" cy="56" r="11" fill="#ffffff"/>
        <circle cx="104" cy="56" r="5.5" fill="#1e293b"/>
        <circle cx="102" cy="54" r="2" fill="#ffffff"/>
        <ellipse cx="47" cy="91" rx="7" ry="4.5" fill="#fb7185" opacity="0.65"/>
        <ellipse cx="113" cy="91" rx="7" ry="4.5" fill="#fb7185" opacity="0.65"/>
        <path d="M62 94 Q80 109 98 94" stroke="#14532d" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
  {
    id: 'chick',
    label: 'Gà Con',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#e0f2fe"/>
        <circle cx="80" cy="148" r="44" fill="#f97316"/>
        <path d="M74 42 Q80 24 88 38 Q96 28 92 44" fill="#facc15"/>
        <ellipse cx="80" cy="88" rx="45" ry="42" fill="#fde047"/>
        <ellipse cx="42" cy="96" rx="10" ry="16" transform="rotate(20 42 96)" fill="#facc15"/>
        <ellipse cx="118" cy="96" rx="10" ry="16" transform="rotate(-20 118 96)" fill="#facc15"/>
        <circle cx="62" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="60" cy="78" r="2" fill="#ffffff"/>
        <circle cx="98" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="96" cy="78" r="2" fill="#ffffff"/>
        <ellipse cx="49" cy="90" rx="6.5" ry="4" fill="#fb7185" opacity="0.65"/>
        <ellipse cx="111" cy="90" rx="6.5" ry="4" fill="#fb7185" opacity="0.65"/>
        <polygon points="73,88 87,88 80,99" fill="#f97316"/>
      </svg>
    `),
  },
  {
    id: 'bear',
    label: 'Gấu Nâu',
    dataUrl: svgToDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
        <rect width="160" height="160" rx="80" fill="#fef3c7"/>
        <circle cx="80" cy="148" r="44" fill="#4086ee"/>
        <circle cx="44" cy="52" r="16" fill="#a16207"/>
        <circle cx="44" cy="52" r="8.5" fill="#fde68a"/>
        <circle cx="116" cy="52" r="16" fill="#a16207"/>
        <circle cx="116" cy="52" r="8.5" fill="#fde68a"/>
        <ellipse cx="80" cy="88" rx="45" ry="41" fill="#b47528"/>
        <ellipse cx="80" cy="98" rx="22" ry="17" fill="#fef3c7"/>
        <circle cx="62" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="60" cy="78" r="2" fill="#ffffff"/>
        <circle cx="98" cy="80" r="5.5" fill="#1e293b"/>
        <circle cx="96" cy="78" r="2" fill="#ffffff"/>
        <ellipse cx="49" cy="91" rx="6.5" ry="4" fill="#fb7185" opacity="0.55"/>
        <ellipse cx="111" cy="91" rx="6.5" ry="4" fill="#fb7185" opacity="0.55"/>
        <ellipse cx="80" cy="91" rx="6.5" ry="4.5" fill="#1e293b"/>
        <path d="M73 100 Q77 104 80 99 Q83 104 87 100" stroke="#334155" stroke-width="2.8" stroke-linecap="round" fill="none"/>
      </svg>
    `),
  },
];

export function getRandomAnimalAvatar(excludeUrl?: string): string {
  const pool = excludeUrl
    ? ANIMAL_AVATARS.filter((item) => item.dataUrl !== excludeUrl)
    : ANIMAL_AVATARS;
  const source = pool.length > 0 ? pool : ANIMAL_AVATARS;
  const index = Math.floor(Math.random() * source.length);
  return source[index].dataUrl;
}

export function isCustomUploadedAvatar(avatarUrl?: string): boolean {
  if (!avatarUrl) return false;
  return (
    avatarUrl.startsWith('data:image/jpeg') ||
    avatarUrl.startsWith('data:image/png') ||
    avatarUrl.startsWith('data:image/webp') ||
    avatarUrl.startsWith('data:image/gif')
  );
}
