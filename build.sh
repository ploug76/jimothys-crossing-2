#!/bin/bash
# Build index.html from src/ and inject the shared leaderboard (own board id: jimothys-crossing-2)
set -e
cd "$(dirname "$0")"
( cat src/a_head.html; echo "/* fonts */"; cat src/font.js src/b_core.js src/c_game.js src/d_sprites.js src/e_render.js src/f_main.js; echo '</script></body></html>' ) > index.html
PALB_CONFIG_FILE=/workspace/leaderboard/config.firestore.js PALB_TITLE="Jimothy's Crossing 2" python3 /workspace/leaderboard/inject.py jimothys-crossing-2 "$PWD/index.html" >/dev/null
echo built $(wc -c < index.html)
# Game controller support (Peter 10/29): re-add the gamepad.js + gamepad-config.js block after every rebuild
python3 - "$PWD/index.html" <<'PY'
import sys,re
p=sys.argv[1];s=open(p).read()
B='<!-- gamepad:start -->\n<script src="gamepad.js?v=2"></script>\n<script src="gamepad-config.js?v=2"></script>\n<!-- gamepad:end -->\n'
s=re.sub(r'<!-- gamepad:start -->.*?<!-- gamepad:end -->\n?','',s,flags=re.S);i=s.rfind('</body>');open(p,'w').write(s[:i]+B+s[i:])
PY
# Studio logo (Peter 10/30): re-add the tiny title-screen logo after every rebuild
python3 - "$PWD/index.html" <<'PY'
import sys,re
p=sys.argv[1];s=open(p).read()
B='<script src="studio-logo.js?v=1" data-src="studio-logo.webp" data-alt="Book of Heaven Studios" data-when="state===\'title\'" data-corner="br" data-cornerl="br" data-h="54" data-hl="46"></script>\n'
s=re.sub(r'<script src="studio-logo\.js[^>]*></script>\n?','',s);i=s.rfind('</body>');open(p,'w').write(s[:i]+B+s[i:])
PY
