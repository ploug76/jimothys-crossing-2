#!/bin/bash
# Build index.html from src/ and inject the shared leaderboard (own board id: jimothys-crossing-2)
set -e
cd "$(dirname "$0")"
( cat src/a_head.html; echo "/* fonts */"; cat src/font.js src/b_core.js src/c_game.js src/d_sprites.js src/e_render.js src/f_main.js; echo '</script></body></html>' ) > index.html
PALB_CONFIG_FILE=/workspace/leaderboard/config.firestore.js PALB_TITLE="Jimothy's Crossing 2" python3 /workspace/leaderboard/inject.py jimothys-crossing-2 "$PWD/index.html" >/dev/null
echo built $(wc -c < index.html)
