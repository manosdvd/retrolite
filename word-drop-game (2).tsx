// Word list will be loaded from external file
let VALID_WORDS = new Set();

// Cache for word validations
const wordValidationCache = new Map();  'MUTE', 'MUTT', 'MYTH', 'NABS', 'NAGS', 'NAIL', 'NAME', 'NAPE', 'NAPS', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEON', 'NERD', 'NEST', 'NETS', 'NEWS', 'NEWT', 'NEXT', 'NICE', 'NICK', 'NIGH', 'NINE', 'NIPS', 'NODE', 'NODS', 'NONE', 'NOON', 'NOPE', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'NOVA', 'NUMB', 'NUNS', 'NUTS', 'OAKS', 'OARS', 'OATH', 'OATS', 'OBEY', 'ODDS', 'ODES', 'ODOR', 'OILS', 'OILY', 'OKAY', 'OKRA', 'OLDS', 'OMEN', 'OMIT', 'ONCE', 'ONES', 'ONLY', 'ONTO', 'OOPS', 'OOZE', 'OPEN', 'OPTS', 'ORAL', 'ORBS', 'ORES', 'OTIC', 'OTTO', 'OUCH', 'OURS', 'OUST', 'OUTS', 'OVAL', 'OVEN', 'OVER', 'OWED', 'OWES', 'OWLS', 'OWNS', 'OXEN', 'PACE', 'PACK', 'PACT', 'PADS', 'PAGE', 'PAID', 'PAIL', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PANE', 'PANS', 'PAPA', 'PARK', 'PART', 'PASS', 'PAST', 'PATE', 'PATH', 'PATS', 'PAVE', 'PAWS', 'PAYS', 'PEAK', 'PEAL', 'PEAR', 'PEAS', 'PEAT', 'PECK', 'PEEK', 'PEEL', 'PEEP', 'PEER', 'PELT', 'PENS', 'PENT', 'PERK', 'PERM', 'PERT', 'PEST', 'PETS', 'PICK', 'PIED', 'PIER', 'PIES', 'PIGS', 'PIKE', 'PILE', 'PILL', 'PIMP', 'PINE', 'PING', 'PINK', 'PINS', 'PIPE', 'PIPS', 'PITS', 'PITY', 'PLAN', 'PLAY', 'PLEA', 'PLOT', 'PLOW', 'PLOY', 'PLUG', 'PLUM', 'PLUS', 'POEM', 'POET', 'POKE', 'POLE', 'POLL', 'POLO', 'POND', 'PONY', 'POOL', 'POOR', 'POPE', 'POPS', 'PORE', 'PORK', 'PORT', 'POSE', 'POSH', 'POST', 'POSY', 'POTS', 'POUR', 'POUT', 'PRAY', 'PREP', 'PREY', 'PRIM', 'PROD', 'PROF', 'PROP', 'PROS', 'PROW', 'PUBS', 'PUFF', 'PUGS', 'PULL', 'PULP', 'PUMA', 'PUMP', 'PUNK', 'PUNS', 'PUPA', 'PUPS', 'PURE', 'PURL', 'PURR', 'PUSH', 'PUTS', 'PUTT', 'QUAD', 'QUAY', 'QUIT', 'QUIZ', 'RACE', 'RACK', 'RACY', 'RAFT', 'RAGE', 'RAGS', 'RAID', 'RAIL', 'RAIN', 'RAKE', 'RAMP', 'RAMS', 'RANG', 'RANK', 'RANT', 'RARE', 'RASP', 'RATE', 'RATS', 'RAVE', 'RAYS', 'RAZE', 'READ', 'REAL', 'REAP', 'REAR', 'REDS', 'REED', 'REEF', 'REEL', 'RELY', 'REND', 'RENT', 'REPS', 'REST', 'REVS', 'RIBS', 'RICE', 'RICH', 'RICK', 'RIDE', 'RIDS', 'RIFE', 'RIFF', 'RIGS', 'RILE', 'RILL', 'RIMS', 'RIND', 'RING', 'RINK', 'RIOT', 'RIPE', 'RIPS', 'RISE', 'RISK', 'RITE', 'RITZ', 'ROAD', 'ROAM', 'ROAN', 'ROAR', 'ROBE', 'ROCK', 'RODE', 'RODS', 'ROLE', 'ROLL', 'ROMP', 'ROOF', 'ROOK', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'ROSY', 'ROTE', 'ROTS', 'ROUT', 'ROWS', 'RUBS', 'RUBY', 'RUDE', 'RUGS', 'RUIN', 'RULE', 'RUMP', 'RUNS', 'RUNT', 'RUSE', 'RUSH', 'RUST', 'RUTS', 'SACK', 'SAFE', 'SAGE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SANE', 'SANG', 'SANK', 'SAPS', 'SASH', 'SAVE', 'SAWN', 'SAWS', 'SAYS', 'SCAN', 'SCAR', 'SEAL', 'SEAM', 'SEAR', 'SEAS', 'SEAT', 'SECT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SEEP', 'SEES', 'SELF', 'SELL', 'SEMI', 'SEND', 'SENT', 'SETS', 'SEWN', 'SEWS', 'SHAG', 'SHAM', 'SHED', 'SHIP', 'SHOD', 'SHOE', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIFT', 'SIGH', 'SIGN', 'SILK', 'SILL', 'SILO', 'SILT', 'SING', 'SINK', 'SIPS', 'SIRE', 'SITS', 'SIZE', 'SKEW', 'SKID', 'SKIM', 'SKIN', 'SKIP', 'SKIT', 'SLAB', 'SLAM', 'SLAP', 'SLAT', 'SLAW', 'SLAY', 'SLED', 'SLEW', 'SLID', 'SLIM', 'SLIP', 'SLIT', 'SLOB', 'SLOG', 'SLOT', 'SLOW', 'SLUG', 'SLUM', 'SLUR', 'SMOG', 'SNAP', 'SNIP', 'SNOB', 'SNOT', 'SNOW', 'SNUB', 'SNUG', 'SOAK', 'SOAP', 'SOAR', 'SOBS', 'SOCK', 'SODA', 'SODS', 'SOFA', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOLO', 'SOME', 'SONG', 'SONS', 'SOON', 'SOOT', 'SOPS', 'SORE', 'SORT', 'SOUL', 'SOUP', 'SOUR', 'SOWN', 'SOWS', 'SOYA', 'SPAN', 'SPAR', 'SPAT', 'SPAY', 'SPEC', 'SPED', 'SPIN', 'SPIT', 'SPOT', 'SPRY', 'SPUD', 'SPUN', 'SPUR', 'STAB', 'STAG', 'STAR', 'STAT', 'STAY', 'STEM', 'STEP', 'STEW', 'STIR', 'STOP', 'STOW', 'STUB', 'STUD', 'STUN', 'SUBS', 'SUCH', 'SUDS', 'SUED', 'SUIT', 'SULK', 'SUMS', 'SUNG', 'SUNK', 'SUNS', 'SUPS', 'SURE', 'SURF', 'SWAB', 'SWAG', 'SWAM', 'SWAN', 'SWAP', 'SWAT', 'SWAY', 'SWIM', 'SWOP', 'SWUM', 'TABS', 'TACK', 'TACT', 'TAGS', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TAME', 'TAMS', 'TANK', 'TAPE', 'TAPS', 'TARE', 'TART', 'TASK', 'TAUT', 'TAXI', 'TEAK', 'TEAL', 'TEAM', 'TEAR', 'TEAS', 'TECH', 'TEED', 'TEEM', 'TEEN', 'TELL', 'TEMP', 'TEND', 'TENS', 'TENT', 'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THAW', 'THEE', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUD', 'THUG', 'THUS', 'TICK', 'TIDE', 'TIDY', 'TIED', 'TIER', 'TIES', 'TIFF', 'TILE', 'TILL', 'TILT', 'TIME', 'TINE', 'TING', 'TINS', 'TINY', 'TIPS', 'TIRE', 'TOAD', 'TOES', 'TOFU', 'TOGA', 'TOLD', 'TOLL', 'TOMB', 'TOME', 'TONE', 'TONG', 'TONS', 'TOOK', 'TOOL', 'TOOT', 'TOPS', 'TORE', 'TORN', 'TOSS', 'TOUR', 'TOUT', 'TOWN', 'TOYS', 'TRAM', 'TRAP', 'TRAY', 'TREE', 'TREK', 'TRIM', 'TRIO', 'TRIP', 'TROD', 'TROT', 'TROY', 'TRUE', 'TSAR', 'TUBA', 'TUBE', 'TUBS', 'TUCK', 'TUFT', 'TUGS', 'TUNA', 'TUNE', 'TURD', 'TURF', 'TURN', 'TUSK', 'TUTU', 'TWIG', 'TWIN', 'TWIT', 'TYKE', 'TYPE', 'UBER', 'UGLY', 'UNDO', 'UNIT', 'UPON', 'URGE', 'URNS', 'USED', 'USER', 'USES', 'VAIN', 'VAMP', 'VANE', 'VARY', 'VASE', 'VAST', 'VATS', 'VEAL', 'VEER', 'VEIL', 'VEIN', 'VENT', 'VERB', 'VERY', 'VEST', 'VETO', 'VETS', 'VIAL', 'VIBE', 'VICE', 'VIEW', 'VILE', 'VINE', 'VISA', 'VOID', 'VOLT', 'VOTE', 'VOWS', 'WADE', 'WADS', 'WAGE', 'WAGS', 'WAIL', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WAND', 'WANT', 'WARD', 'WARM', 'WARN', 'WARP', 'WARS', 'WART', 'WASH', 'WASP', 'WAVE', 'WAVY', 'WAYS', 'WEAK', 'WEAL', 'WEAN', 'WEAR', 'WEBS', 'WEDS', 'WEED', 'WEEK', 'WEEP', 'WELD', 'WELL', 'WELT', 'WENT', 'WEPT', 'WERE', 'WEST', 'WHAT', 'WHEY', 'WHIM', 'WHIP', 'WHIR', 'WHIZ', 'WHOM', 'WICK', 'WIDE', 'WIFE', 'WIGS', 'WILD', 'WILL', 'WILT', 'WILY', 'WIMP', 'WIND', 'WINE', 'WING', 'WINK', 'WINS', 'WIPE', 'WIRE', 'WIRY', 'WISE', 'WISH', 'WISP', 'WITH', 'WITS', 'WOES', 'WOKE', 'WOLF', 'WOMB', 'WONT', 'WOOD', 'WOOF', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'WORN', 'WRAP', 'WREN', 'WRIT', 'YAKS', 'YAMS', 'YARD', 'YARN', 'YAWN', 'YEAR', 'YEAS', 'YELL', 'YELP', 'YENS', 'YEPS', 'YEWS', 'YIPS', 'YOKE', 'YOLK', 'YORE', 'YOUR', 'YOWL', 'YOYO', 'YUCK', 'YULE', 'YUPS', 'ZAPS', 'ZEAL', 'ZEST', 'ZETA', 'ZINC', 'ZIPS', 'ZITS', 'ZONE', 'ZOOM', 'ZOOS',

  // 5+ letter words
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOAST', 'BOBBY', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARSH', 'HATE', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'QUOTE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REPAY', 'REPLY', 'RIGHT', 'RIGID', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SNAKE', 'SNOW', 'SOLID', 'SOLVE', 'SORRY', 'SORT', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIRED', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST', 'TYLER', 'UNCLE', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOURS', 'YOUTH', 'ACUTE', 'ADMIN', 'AGILE', 'ALBUM', 'AMBER', 'AMPLE', 'ANGEL', 'ANGRY', 'ANKLE', 'ANTIC', 'APART', 'ARENA', 'ARGUE', 'ARISE', 'ARMOR', 'ARROW', 'ASIDE', 'ASSET', 'ATTIC', 'AUDIO', 'AUDIT', 'AVOID', 'AWAKE', 'BADGE', 'BADLY', 'BAGEL', 'BAKER', 'BALMY', 'BANAL', 'BANJO', 'BASIC', 'BATCH', 'BEACH', 'BEARD', 'BEAST', 'BEGAN', 'BEGIN', 'BEING', 'BELLY', 'BELOW', 'BENCH', 'BERRY', 'BIKER', 'BILLY', 'BINGO', 'BIRTH', 'BITTY', 'BLACK', 'BLADE', 'BLAME', 'BLAND', 'BLANK', 'BLAST', 'BLAZE', 'BLEAK', 'BLESS', 'BLIND', 'BLINK', 'BLISS', 'BLOCK', 'BLOOD', 'BLOOM', 'BLOWN', 'BLUES', 'BLUFF', 'BLUNT', 'BLUSH', 'BOARD', 'BOAST', 'BOBBY', 'BONUS', 'BOOST', 'BOOTH', 'BOOZE', 'BORAX', 'BOUND', 'BOXER', 'BRACK', 'BRAID', 'BRAIN', 'BRAKE', 'BRAND', 'BRASS', 'BRAVE', 'BRAVO', 'BREAD', 'BREAK', 'BREED', 'BRICK', 'BRIDE', 'BRIEF', 'BRINE', 'BRING', 'BRINK', 'BRISK', 'BROAD', 'BROIL', 'BROKE', 'BROOD', 'BROOK', 'BROOM', 'BROWN', 'BRUSH', 'BUILD', 'BUILT', 'BULKY', 'BULLY', 'BUNCH', 'BUNNY', 'BURST', 'BUYER', 'BYLAW', 'CABAL', 'CABIN', 'CABLE', 'CACHE', 'CADET', 'CAGED', 'CAGEY', 'CAIRN', 'CAMEL', 'CANAL', 'CANDY', 'CANNY', 'CANOE', 'CARBO', 'CARDS', 'CARGO', 'CARRY', 'CARVE', 'CATCH', 'CATER', 'CAUSE', 'CEASE', 'CEDAR', 'CHAIN', 'CHAIR', 'CHAMP', 'CHAOS', 'CHARD', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHEAT', 'CHECK', 'CHEEK', 'CHESS', 'CHEST', 'CHICK', 'CHIEF', 'CHILD', 'CHILL', 'CHIMP', 'CHINA', 'CHIRP', 'CHIVE', 'CHOCK', 'CHOIR', 'CHOKE', 'CHORD', 'CHORE', 'CHOSE', 'CHUNK', 'CHURN', 'CHUTE', 'CIDER', 'CIGAR', 'CINCH', 'CIRCA', 'CIVIC', 'CIVIL', 'CLACK', 'CLAIM', 'CLAMP', 'CLANG', 'CLANK', 'CLASH', 'CLASS', 'CLEAN', 'CLEAR', 'CLEAT', 'CLEFT', 'CLERK', 'CLICK', 'CLIFF', 'CLIMB', 'CLING', 'CLOAK', 'CLOCK', 'CLONE', 'CLOSE', 'CLOTH', 'CLOUD', 'CLOUT', 'CLOWN', 'CLUBS', 'CLUCK', 'CLUED', 'CLUMP', 'CLUNG', 'COACH', 'COAST', 'COCOA', 'CODED', 'CODER', 'CODES', 'COLON', 'COLOR', 'COMET', 'COMIC', 'COMMA', 'CONCH', 'CONDO', 'CORAL', 'CORNY', 'COUCH', 'COUGH', 'COULD', 'COUNT', 'COUPE', 'COURT', 'COVER', 'COWBOY', 'CRACK', 'CRAFT', 'CRAMP', 'CRANE', 'CRANK', 'CRASH', 'CRASS', 'CRATE', 'CRAVE', 'CRAZY', 'CREAK', 'CREAM', 'CREEP', 'CREME', 'CREPE', 'CRESS', 'CRIBS', 'CRICK', 'CRIED', 'CRIES', 'CRIME', 'CRIMP', 'CRISP', 'CROAK', 'CROCK', 'CRONE', 'CROOK', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CRUEL', 'CRUMB', 'CRUNK', 'CRUSH', // Comprehensive English word dictionary for validation
const VALID_WORDS = new Set([
  // 3-letter words
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'END', 'FEW', 'GOT', 'LET', 'MAN', 'MAY', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CAT', 'DOG', 'SUN', 'RUN', 'BIG', 'RED', 'HOT', 'YES', 'TOP', 'WIN', 'WAY', 'TRY', 'EAT', 'BAD', 'GOD', 'JOB', 'LOT', 'FUN', 'AGE', 'BED', 'BOX', 'CUT', 'EYE', 'FAR', 'GUN', 'LAW', 'LIE', 'MOM', 'POP', 'SIT', 'SIX', 'TAX', 'WAR', 'WON', 'CAR', 'EAR', 'FAN', 'HAT', 'JAR', 'KEY', 'LEG', 'MAP', 'NET', 'OWL', 'PEN', 'RAT', 'SEA', 'TEN', 'VAN', 'WET', 'ZOO', 'ACE', 'ADD', 'AID', 'AIR', 'ARM', 'ART', 'ASK', 'BAG', 'BAR', 'BAT', 'BEE', 'BET', 'BIT', 'BOW', 'BUS', 'BUY', 'COP', 'COW', 'CRY', 'CUP', 'DIE', 'DIG', 'DOT', 'DRY', 'EGG', 'FIG', 'FIT', 'FLY', 'FOG', 'FOX', 'GAP', 'GAS', 'GEL', 'GEM', 'GIG', 'GUM', 'GUY', 'HIT', 'HOP', 'HUG', 'ICE', 'ILL', 'INK', 'INN', 'JAM', 'JET', 'JOG', 'JOY', 'KID', 'KIT', 'LAP', 'LID', 'LIP', 'LOG', 'MAD', 'MIX', 'MOB', 'MUD', 'NUT', 'OIL', 'PAD', 'PAN', 'PAW', 'PAY', 'PEG', 'PET', 'PIE', 'PIG', 'PIN', 'PIT', 'POT', 'RIB', 'RID', 'ROD', 'ROW', 'RUB', 'RUG', 'SAD', 'SAP', 'SAW', 'SET', 'SHY', 'SIN', 'SIP', 'SKY', 'SOB', 'SOD', 'SON', 'SOP', 'SOW', 'SOY', 'SPA', 'SPY', 'TAB', 'TAG', 'TAN', 'TAP', 'TAR', 'TEA', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOY', 'TUG', 'TUB', 'URN', 'VET', 'VIA', 'WIG', 'WIT', 'YAM', 'YEP', 'YET', 'YEW', 'ZIP',
  
  // 4-letter words
  'ABLE', 'ABLY', 'ACHE', 'ACID', 'ACRE', 'ACTS', 'ADDS', 'AGED', 'AGES', 'AIDE', 'AIDS', 'AIMS', 'AIRS', 'AIRY', 'AJAR', 'AKIN', 'ALLY', 'ALSO', 'AMID', 'AMPS', 'ANDS', 'ANEW', 'ANTE', 'ANTI', 'ANTS', 'APES', 'APEX', 'APPS', 'ARCS', 'AREA', 'ARGS', 'ARID', 'ARMS', 'ARMY', 'ARTS', 'ATOM', 'ATOP', 'AUNT', 'AUTO', 'AVER', 'AWAY', 'AWED', 'AXES', 'AXIS', 'AXLE', 'BABY', 'BACK', 'BADE', 'BAGS', 'BAIL', 'BAIT', 'BAKE', 'BALD', 'BALL', 'BALM', 'BAND', 'BANE', 'BANG', 'BANK', 'BANS', 'BARE', 'BARK', 'BARN', 'BARS', 'BASE', 'BASH', 'BASK', 'BASS', 'BAST', 'BATH', 'BATS', 'BAWL', 'BAYS', 'BEAD', 'BEAK', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEDS', 'BEEN', 'BEER', 'BEES', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BETS', 'BIAS', 'BIDS', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BITS', 'BLOW', 'BLUE', 'BLUR', 'BOAR', 'BOAT', 'BOBS', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOUT', 'BOWL', 'BOYS', 'BRED', 'BREW', 'BROW', 'BUGS', 'BULK', 'BULL', 'BUMP', 'BUNK', 'BURN', 'BURP', 'BURY', 'BUSH', 'BUSK', 'BUST', 'BUSY', 'BUYS', 'BUZZ', 'BYTE', 'CAFE', 'CAGE', 'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CANE', 'CANS', 'CAPE', 'CAPS', 'CARD', 'CARE', 'CARS', 'CART', 'CASE', 'CASH', 'CAST', 'CATS', 'CAVE', 'CELL', 'CHEF', 'CHEW', 'CHIN', 'CHIP', 'CHOP', 'CHUM', 'CITE', 'CITY', 'CLAD', 'CLAM', 'CLAN', 'CLAP', 'CLAW', 'CLAY', 'CLEF', 'CLIP', 'CLOD', 'CLOG', 'CLOT', 'CLUB', 'CLUE', 'COAL', 'COAT', 'COAX', 'COCK', 'CODE', 'COIN', 'COLD', 'COLT', 'COMA', 'COMB', 'COME', 'CONE', 'COOK', 'COOL', 'COPE', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST', 'COSY', 'COZY', 'CRAB', 'CREW', 'CRIB', 'CROP', 'CROW', 'CUBE', 'CUBS', 'CUFF', 'CULT', 'CUPS', 'CURB', 'CURE', 'CURL', 'CUTE', 'CUTS', 'CZAR', 'DADS', 'DAFT', 'DAMP', 'DARE', 'DARK', 'DARN', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DAZE', 'DEAD', 'DEAF', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEER', 'DEFY', 'DEMO', 'DENT', 'DENY', 'DESK', 'DIAL', 'DICE', 'DIED', 'DIET', 'DIME', 'DINE', 'DIRE', 'DIRT', 'DISC', 'DISH', 'DIVE', 'DOCK', 'DOCS', 'DOER', 'DOES', 'DOGS', 'DOME', 'DONE', 'DOOM', 'DOOR', 'DOPE', 'DOSE', 'DOTS', 'DOVE', 'DOWN', 'DOZE', 'DRAB', 'DRAG', 'DRAW', 'DREW', 'DRIP', 'DROP', 'DRUG', 'DRUM', 'DUAL', 'DUCK', 'DUDE', 'DUEL', 'DUES', 'DULL', 'DULY', 'DUMB', 'DUMP', 'DUNK', 'DUPE', 'DUSK', 'DUST', 'DUTY', 'DYED', 'DYES', 'EACH', 'EARL', 'EARN', 'EARS', 'EASE', 'EAST', 'EASY', 'EATS', 'ECHO', 'EDDY', 'EDGE', 'EDGY', 'EDIT', 'EELS', 'EGGS', 'ELSE', 'EMIT', 'ENDS', 'ENVY', 'EPIC', 'ETCH', 'EURO', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT', 'EXPO', 'EYED', 'EYES', 'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANS', 'FARE', 'FARM', 'FAST', 'FATE', 'FATS', 'FAWN', 'FAZE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEES', 'FEET', 'FELL', 'FELT', 'FEND', 'FERN', 'FEST', 'FEUD', 'FIAT', 'FIGS', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FINS', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FITS', 'FIVE', 'FIZZ', 'FLAG', 'FLAK', 'FLAP', 'FLAT', 'FLAW', 'FLAX', 'FLEA', 'FLED', 'FLEE', 'FLEW', 'FLEX', 'FLIP', 'FLOG', 'FLOP', 'FLOW', 'FLUE', 'FOAL', 'FOAM', 'FOBS', 'FOES', 'FOIL', 'FOLD', 'FOLK', 'FOND', 'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORE', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FOWL', 'FOXY', 'FRAY', 'FREE', 'FRET', 'FROM', 'FROG', 'FUEL', 'FULL', 'FUME', 'FUND', 'FUNK', 'FURY', 'FUSE', 'FUSS', 'FUZZ', 'GAIN', 'GAIT', 'GALA', 'GALE', 'GALL', 'GAME', 'GANG', 'GAPE', 'GAPS', 'GARB', 'GAVE', 'GAWK', 'GAZE', 'GEAR', 'GEEK', 'GEMS', 'GENE', 'GENT', 'GERM', 'GETS', 'GIFT', 'GILD', 'GILL', 'GILT', 'GIRL', 'GIST', 'GIVE', 'GLAD', 'GLEN', 'GLOW', 'GLUE', 'GLUM', 'GLUT', 'GNAT', 'GNAW', 'GOAL', 'GOAT', 'GODS', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GONG', 'GOOD', 'GOOF', 'GORE', 'GORY', 'GOSH', 'GOTH', 'GOUT', 'GOWN', 'GRAB', 'GRAD', 'GRAM', 'GRAY', 'GREW', 'GREY', 'GRID', 'GRIM', 'GRIN', 'GRIP', 'GRIT', 'GROW', 'GRUB', 'GULF', 'GULL', 'GULP', 'GUMS', 'GUNS', 'GURU', 'GUSH', 'GUST', 'GUTS', 'GUYS', 'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARE', 'HARM', 'HARP', 'HART', 'HASH', 'HATE', 'HAUL', 'HAVE', 'HAWK', 'HAZE', 'HAZY', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HECK', 'HEED', 'HEEL', 'HEIR', 'HELD', 'HELL', 'HELM', 'HELP', 'HENS', 'HERB', 'HERD', 'HERE', 'HERO', 'HERS', 'HEWN', 'HICK', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HILT', 'HIND', 'HINT', 'HIPS', 'HIRE', 'HISS', 'HITS', 'HIVE', 'HOAX', 'HOBS', 'HOCK', 'HOES', 'HOGS', 'HOLD', 'HOLE', 'HOLY', 'HOME', 'HONE', 'HOOD', 'HOOF', 'HOOK', 'HOOP', 'HOOT', 'HOPE', 'HOPS', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HOWL', 'HUBS', 'HUED', 'HUES', 'HUGE', 'HULK', 'HULL', 'HUMP', 'HUNG', 'HUNK', 'HUNT', 'HURT', 'HUSH', 'HUSK', 'HUTS', 'HYMN', 'HYPE', 'IBEX', 'ICED', 'ICES', 'ICON', 'IDEA', 'IDLE', 'IDOL', 'IFFY', 'INCH', 'INFO', 'INKS', 'INKY', 'INNS', 'INTO', 'IONS', 'IRIS', 'IRON', 'ISLE', 'ITCH', 'ITEM', 'JABS', 'JACK', 'JADE', 'JAGS', 'JAIL', 'JAMS', 'JARS', 'JAVA', 'JAWS', 'JAZZ', 'JEAN', 'JEEP', 'JEER', 'JELL', 'JERK', 'JEST', 'JETS', 'JIBS', 'JIGS', 'JILT', 'JINX', 'JOBS', 'JOCK', 'JOEY', 'JOGS', 'JOHN', 'JOIN', 'JOKE', 'JOLT', 'JOTS', 'JOWL', 'JOYS', 'JUDO', 'JUGS', 'JULY', 'JUMP', 'JUNE', 'JUNK', 'JURY', 'JUST', 'JUTE', 'KALE', 'KEEN', 'KEEP', 'KEPT', 'KEYS', 'KICK', 'KIDS', 'KILL', 'KILN', 'KILO', 'KILT', 'KIND', 'KING', 'KINK', 'KIPS', 'KISS', 'KITE', 'KITS', 'KNEE', 'KNEW', 'KNIT', 'KNOB', 'KNOT', 'KNOW', 'LABS', 'LACE', 'LACK', 'LACY', 'LADS', 'LADY', 'LAID', 'LAKE', 'LAMB', 'LAME', 'LAMP', 'LAND', 'LANE', 'LAPS', 'LARD', 'LARK', 'LASH', 'LAST', 'LATE', 'LAUD', 'LAWN', 'LAWS', 'LAZY', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEGS', 'LEND', 'LENS', 'LENT', 'LESS', 'LEST', 'LETS', 'LEVY', 'LEWD', 'LIAR', 'LICE', 'LICK', 'LIDS', 'LIED', 'LIES', 'LIFE', 'LIFT', 'LIKE', 'LILY', 'LIMB', 'LIME', 'LIMP', 'LINE', 'LINK', 'LINT', 'LION', 'LIPS', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAN', 'LOBE', 'LOCK', 'LODE', 'LOFT', 'LONE', 'LONG', 'LOOK', 'LOOM', 'LOOP', 'LOOT', 'LORD', 'LORE', 'LOSE', 'LOSS', 'LOST', 'LOTS', 'LOUD', 'LOUR', 'LOUT', 'LOVE', 'LOWS', 'LUCK', 'LULL', 'LUMP', 'LUNG', 'LURE', 'LURK', 'LUSH', 'LUST', 'LUTE', 'LYNX', 'LYRE',
  
  // 5+ letter words
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN', 'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE', 'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE', 'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ARROW', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID', 'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW', 'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD', 'BOAST', 'BOBBY', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED', 'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP', 'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN', 'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT', 'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN', 'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY', 'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS', 'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE', 'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT', 'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT', 'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH', 'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FRUIT', 'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAIN', 'GRAND', 'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS', 'GUEST', 'GUIDE', 'HAPPY', 'HARSH', 'HEART', 'HEAVY', 'HENCE', 'HENRY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN', 'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES', 'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE', 'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL', 'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA', 'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED', 'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE', 'MUSIC', 'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR', 'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY', 'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PLACE', 'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'POINT', 'POUND', 'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD', 'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'QUOTE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO', 'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REPAY', 'REPLY', 'RIGHT', 'RIGID', 'RIVAL', 'RIVER', 'ROBIN', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE', 'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE', 'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT', 'SHOWN', 'SIGHT', 'SILLY', 'SINCE', 'SIXTH', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE', 'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SNAKE', 'SOLID', 'SOLVE', 'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT', 'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL', 'STEEP', 'STEER', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM', 'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET', 'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEAMS', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT', 'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE', 'THREW', 'THROW', 'THUMB', 'TIGER', 'TIGHT', 'TIRED', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL', 'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE', 'TRICK', 'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST', 'TYLER', 'UNCLE', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE', 'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'VOICE', 'WASTE', 'WATCH', 'WATER', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD', 'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOURS', 'YOUTH', 'ZEBRA'
]);

// Cache for word validations
const wordValidationCache = new Map(); 'TOO', 'USE', 'CAT', 'DOG', 'SUN', 'RUN', 'BIG', 'RED', 'HOT', 'YES', 'TOP', 'WIN', 'WAY', 'TRY', 'EAT', 'BAD', 'GOD', 'JOB', 'LOT', 'FUN', 'AGE', 'BED', 'BOX', 'CUT', 'EYE', 'FAR', 'GUN', 'LAW', 'LIE', 'MOM', 'POP', 'SIT', 'SIX', 'TAX', 'WAR', 'WON', 'CAR', 'EAR', 'FAN', 'HAT', 'JAR', 'KEY', 'LEG', 'MAP', 'NET', 'OWL', 'PEN', 'RAT', 'SEA', 'TEN', 'VAN', 'WET', 'ZOO', 'ACE', 'ADD', 'AID', 'AIR', 'ARM', 'ART', 'ASK', 'BAG', 'BAR', 'BAT', 'BEE', 'BET', 'BIT', 'BOW', 'BUS', 'BUY', 'COP', 'COW', 'CRY', 'CUP', 'DIE', 'DIG', 'DOT', 'DRY', 'EGG', 'FEW', 'FIG', 'FIT', 'FLY', 'FOG', 'FOX', 'GAP', 'GAS', 'GEL', 'GEM', 'GIG', 'GUM', 'GUY', 'HIT', 'HOP', 'HUG', 'ICE', 'ILL', 'INK', 'INN', 'JAM', 'JET', 'JOG', 'JOY', 'KID', 'KIT', 'LAP', 'LID', 'LIP', 'LOG', 'MAD', 'MIX', 'MOB', 'MUD', 'NUT', 'OIL', 'PAD', 'PAN', 'PAW', 'PAY', 'PEG', 'PET', 'PIE', 'PIG', 'PIN', 'PIT', 'POT', 'RIB', 'RID', 'ROD', 'ROW', 'RUB', 'RUG', 'SAD', 'SAP', 'SAW', 'SET', 'SHY', 'SIN', 'SIP', 'SKY', 'SOB', 'SOD', 'SON', 'SOP', 'SOW', 'SOY', 'SPA', 'SPY', 'TAB', 'TAG', 'TAN', 'TAP', 'TAR', 'TEA', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOY', 'TUG', 'TUB', 'URN', 'VET', 'VIA', 'WIG', 'WIT', 'YAM', 'YEP', 'YET', 'YEW', 'ZIP', 'ABS', 'ACT', 'ADS', 'AFT', 'AIM', 'APE', 'APT', 'ARC', 'ATE', 'AWE', 'AXE', 'BAD', 'BAN', 'BAY', 'BIN', 'BUD', 'BUG', 'BUM', 'BUN', 'CAB', 'CAD', 'CAM', 'CAN', 'CAP', 'COB', 'COD', 'COG', 'COT', 'COW', 'COX', 'COY', 'COZ', 'CUB', 'CUD', 'CUE', 'DAB', 'DAD', 'DAM', 'DEN', 'DEW', 'DIM', 'DIN', 'DIP', 'DOC', 'DUB', 'DUD', 'DUE', 'DUG', 'DUN', 'DUO', 'DYE', 'EAR', 'EEL', 'ELF', 'ELK', 'ELM', 'EMU', 'ERA', 'ERR', 'EVE', 'EWE', 'FAD', 'FED', 'FEE', 'FEW', 'FIB', 'FIG', 'FIN', 'FIR', 'FIX', 'FOB', 'FOE', 'FOR', 'FRY', 'FUR', 'GAB', 'GAG', 'GAL', 'GAP', 'GAY', 'GEL', 'GYM', 'HAD', 'HAG', 'HAM', 'HAS', 'HAY', 'HEM', 'HEN', 'HEP', 'HER', 'HEW', 'HEX', 'HEY', 'HID', 'HIM', 'HIP', 'HIS', 'HIT', 'HOB', 'HOD', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUM', 'HUN', 'HUT', 'ICE', 'ICY', 'ILL', 'IMP', 'INK', 'ION', 'IRE', 'IRK', 'ITS', 'IVY', 'JAB', 'JAG', 'JAM', 'JAR', 'JAW', 'JAY', 'JET', 'JIG', 'JOB', 'JOG', 'JOT', 'JOW', 'JOY', 'JUG', 'JUT', 'KEG', 'KEN', 'KEY', 'KID', 'KIN', 'KIT', 'LAB', 'LAD', 'LAG', 'LAP', 'LAW', 'LAX', 'LAY', 'LEA', 'LED', 'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LIT', 'LOB', 'LOG', 'LOT', 'LOW', 'LYE', 'MAC', 'MAD', 'MAP', 'MAT', 'MAW', 'MAX', 'MAY', 'MEN', 'MET', 'MID', 'MIX', 'MOB', 'MOD', 'MOM', 'MOP', 'MOW', 'MUD', 'MUG', 'MUM', 'NAB', 'NAG', 'NAP', 'NAY', 'NET', 'NEW', 'NIB', 'NIT', 'NIX', 'NOB', 'NOD', 'NOR', 'NOT', 'NOW', 'NUB', 'NUN', 'NUT', 'OAK', 'OAR', 'OAT', 'ODD', 'ODE', 'OFF', 'OFT', 'OIL', 'OLD', 'ONE', 'OPT', 'ORB', 'ORE', 'OUR', 'OUT', 'OWE', 'OWL', 'OWN', 'PAD', 'PAL', 'PAN', 'PAP', 'PAR', 'PAT', 'PAW', 'PAX', 'PAY', 'PEA', 'PEG', 'PEN', 'PEP', 'PER', 'PET', 'PEW', 'PIE', 'PIG', 'PIN', 'PIT', 'PLY', 'POD', 'POP', 'POT', 'POW', 'POX', 'PRO', 'PRY', 'PUB', 'PUG', 'PUN', 'PUP', 'PUS', 'PUT', 'QUA', 'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RAW', 'RAY', 'RED', 'REF', 'REM', 'REP', 'REV', 'RIB', 'RID', 'RIG', 'RIM', 'RIP', 'ROB', 'ROD', 'ROE', 'ROT', 'ROW', 'RUB', 'RUG', 'RUM', 'RUN', 'RUT', 'RYE', 'SAC', 'SAD', 'SAG', 'SAP', 'SAT', 'SAW', 'SAY', 'SEA', 'SET', 'SEW', 'SEX', 'SHE', 'SHY', 'SIN', 'SIP', 'SIR', 'SIS', 'SIT', 'SIX', 'SKI', 'SKY', 'SLY', 'SOB', 'SOD', 'SON', 'SOP', 'SOT', 'SOW', 'SOY', 'SPA', 'SPY', 'STY', 'SUB', 'SUM', 'SUN', 'SUP', 'TAB', 'TAD', 'TAG', 'TAN', 'TAP', 'TAR', 'TAT', 'TAX', 'TEA', 'TEN', 'THE', 'THY', 'TIC', 'TIE', 'TIN', 'TIP', 'TIT', 'TOE', 'TON', 'TOO', 'TOP', 'TOT', 'TOW', 'TOY', 'TRY', 'TUB', 'TUG', 'TUN', 'TUT', 'TWO', 'UGH', 'UMP', 'URN', 'USE', 'VAN', 'VAT', 'VET', 'VEX', 'VIA', 'VIE', 'VOW', 'WAD', 'WAG', 'WAN', 'WAR', 'WAS', 'WAX', 'WAY', 'WEB', 'WED', 'WEE', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WOE', 'WOK', 'WON', 'WOO', 'WOW', 'YAK', 'YAM', 'YAP', 'YAW', 'YEA', 'YEP', 'YES', 'YET', 'YEW', 'YIN', 'YIP', 'YOU', 'YOW', 'YUK', 'YUP', 'ZAP', 'ZED', 'ZEE', 'ZEN', 'ZIP', 'ZIT', 'ZOO',

  // 4-letter words  
  'ABLE', 'ABLY', 'ABUT', 'ACHE', 'ACID', 'ACME', 'ACNE', 'ACRE', 'ACTS', 'ADDS', 'AFAR', 'AGED', 'AGES', 'AIDE', 'AIDS', 'AIMS', 'AIRS', 'AIRY', 'AJAR', 'AKIN', 'ALLY', 'ALSO', 'AMID', 'AMPS', 'ANDS', 'ANEW', 'ANTE', 'ANTI', 'ANTS', 'APES', 'APEX', 'APPS', 'ARCS', 'AREA', 'ARGS', 'ARID', 'ARMS', 'ARMY', 'ARTS', 'ATOM', 'ATOP', 'AUNT', 'AUTO', 'AVER', 'AWAY', 'AWED', 'AXES', 'AXIS', 'AXLE', 'BABY', 'BACK', 'BADE', 'BAGS', 'BAIL', 'BAIT', 'BAKE', 'BALD', 'BALL', 'BALM', 'BAND', 'BANE', 'BANG', 'BANK', 'BANS', 'BARE', 'BARK', 'BARN', 'BARS', 'BASE', 'BASH', 'BASK', 'BASS', 'BAST', 'BATH', 'BATS', 'BAWL', 'BAYS', 'BEAD', 'BEAK', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEDS', 'BEEN', 'BEER', 'BEES', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BETS', 'BIAS', 'BIDS', 'BIKE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BITS', 'BLOW', 'BLUE', 'BLUR', 'BOAR', 'BOAT', 'BOBS', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOUT', 'BOWL', 'BOYS', 'BRED', 'BREW', 'BROW', 'BUGS', 'BULK', 'BULL', 'BUMP', 'BUNK', 'BURN', 'BURP', 'BURY', 'BUSH', 'BUSK', 'BUST', 'BUSY', 'BUYS', 'BUZZ', 'BYTE', 'CAFE', 'CAGE', 'CAKE', 'CALL', 'CALM', 'CAME', 'CAMP', 'CANE', 'CANS', 'CAPE', 'CAPS', 'CARD', 'CARE', 'CARS', 'CART', 'CASE', 'CASH', 'CAST', 'CATS', 'CAVE', 'CELL', 'CHEF', 'CHEW', 'CHIN', 'CHIP', 'CHOP', 'CHUM', 'CITE', 'CITY', 'CLAD', 'CLAM', 'CLAN', 'CLAP', 'CLAW', 'CLAY', 'CLEF', 'CLIP', 'CLOD', 'CLOG', 'CLOT', 'CLUB', 'CLUE', 'COAL', 'COAT', 'COAX', 'COCK', 'CODE', 'COIN', 'COLD', 'COLT', 'COMA', 'COMB', 'COME', 'CONE', 'COOK', 'COOL', 'COPE', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST', 'COSY', 'COZY', 'CRAB', 'CREW', 'CRIB', 'CROP', 'CROW', 'CUBE', 'CUBS', 'CUFF', 'CULT', 'CUPS', 'CURB', 'CURE', 'CURL', 'CUTE', 'CUTS', 'CZAR', 'DADS', 'DAFT', 'DAMP', 'DARE', 'DARK', 'DARN', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DAZE', 'DEAD', 'DEAF', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEER', 'DEFY', 'DEMO', 'DENT', 'DENY', 'DESK', 'DIAL', 'DICE', 'DIED', 'DIET', 'DIME', 'DINE', 'DIRE', 'DIRT', 'DISC', 'DISH', 'DIVE', 'DOCK', 'DOCS', 'DOER', 'DOES', 'DOGS', 'DOME', 'DONE', 'DOOM', 'DOOR', 'DOPE', 'DOSE', 'DOTS', 'DOVE', 'DOWN', 'DOZE', 'DRAB', 'DRAG', 'DRAW', 'DREW', 'DRIP', 'DROP', 'DRUG', 'DRUM', 'DUAL', 'DUCK', 'DUDE', 'DUEL', 'DUES', 'DULL', 'DULY', 'DUMB', 'DUMP', 'DUNK', 'DUPE', 'DUSK', 'DUST', 'DUTY', 'DYED', 'DYES', 'EACH', 'EARL', 'EARN', 'EARS', 'EASE', 'EAST', 'EASY', 'EATS', 'ECHO', 'EDDY', 'EDGE', 'EDGY', 'EDIT', 'EELS', 'EGGS', 'ELSE', 'EMIT', 'ENDS', 'ENVY', 'EPIC', 'ETCH', 'EURO', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT', 'EXPO', 'EYED', 'EYES', 'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANS', 'FARE', 'FARM', 'FAST', 'FATE', 'FATS', 'FAWN', 'FAZE', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEES', 'FEET', 'FELL', 'FELT', 'FEND', 'FERN', 'FEST', 'FEUD', 'FEVER', 'FIAT', 'FIDO', 'FIEF', 'FIFE', 'FIGS', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FINS', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FITS', 'FIVE', 'FIZZ', 'FLAG', 'FLAK', 'FLAP', 'FLAT', 'FLAW', 'FLAX', 'FLEA', 'FLED', 'FLEE', 'FLEW', 'FLEX', 'FLIP', 'FLOG', 'FLOP', 'FLOW', 'FLUE', 'FOAL', 'FOAM', 'FOBS', 'FOES', 'FOGY', 'FOIL', 'FOLD', 'FOLK', 'FOND', 'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORE', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FOWL', 'FOXY', 'FRAY', 'FREE', 'FRET', 'FROM', 'FROG', 'FUEL', 'FULL', 'FUME', 'FUND', 'FUNK', 'FURY', 'FUSE', 'FUSS', 'FUZZ', 'GAIN', 'GAIT', 'GALA', 'GALE', 'GALL', 'GAME', 'GANG', 'GAPE', 'GAPS', 'GARB', 'GAVE', 'GAWK', 'GAZE', 'GEAR', 'GEEK', 'GEMS', 'GENE', 'GENT', 'GERM', 'GETS', 'GIFT', 'GILD', 'GILL', 'GILT', 'GIRL', 'GIST', 'GIVE', 'GLAD', 'GLEN', 'GLOW', 'GLUE', 'GLUM', 'GLUT', 'GNAT', 'GNAW', 'GOAL', 'GOAT', 'GODS', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GONG', 'GOOD', 'GOOF', 'GORE', 'GORY', 'GOSH', 'GOTH', 'GOUT', 'GOWN', 'GRAB', 'GRAD', 'GRAM', 'GRAY', 'GREW', 'GREY', 'GRID', 'GRIM', 'GRIN', 'GRIP', 'GRIT', 'GROW', 'GRUB', 'GULF', 'GULL', 'GULP', 'GUMS', 'GUNS', 'GURU', 'GUSH', 'GUST', 'GUTS', 'GUYS', 'GUZZLE', 'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARE', 'HARM', 'HARP', 'HART', 'HASH', 'HATE', 'HAUL', 'HAVE', 'HAWK', 'HAZE', 'HAZY', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HECK', 'HEED', 'HEEL', 'HEIR', 'HELD', 'HELL', 'HELM', 'HELP', 'HENS', 'HERB', 'HERD', 'HERE', 'HERO', 'HERS', 'HEWN', 'HICK', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HILT', 'HIND', 'HINT', 'HIPS', 'HIRE', 'HISS', 'HITS', 'HIVE', 'HOAX', 'HOBS', 'HOCK', 'HOES', 'HOGS', 'HOLD', 'HOLE', 'HOLY', 'HOME', 'HONE', 'HOOD', 'HOOF', 'HOOK', 'HOOP', 'HOOT', 'HOPE', 'HOPS', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HOWL', 'HUBS', 'HUED', 'HUES', 'HUGE', 'HULK', 'HULL', 'HUMP', 'HUNG', 'HUNK', 'HUNT', 'HURT', 'HUSH', 'HUSK', 'HUTS', 'HYMN', 'HYPE', 'IBEX', 'ICED', 'ICES', 'ICON', 'IDEA', 'IDLE', 'IDOL', 'IFFY', 'INCH', 'INFO', 'INKS', 'INKY', 'INNS', 'INTO', 'IONS', 'IRIS', 'IRON', 'ISLE', 'ITCH', 'ITEM', 'JABS', 'JACK', 'JADE', 'JAGS', 'JAIL', 'JAMS', 'JARS', 'JAVA', 'JAWS', 'JAZZ', 'JEAN', 'JEEP', 'JEER', 'JELL', 'JERK', 'JEST', 'JETS', 'JIBS', 'JIGS', 'JILT', 'JINX', 'JOBS', 'JOCK', 'JOEY', 'JOGS', 'JOHN', 'JOIN', 'JOKE', 'JOLT', 'JOTS', 'JOWL', 'JOYS', 'JUDO', 'JUGS', 'JULY', 'JUMP', 'JUNE', 'JUNK', 'JURY', 'JUST', 'JUTE', 'KALE', 'KEEN', 'KEEP', 'KEPT', 'KEYS', 'KICK', 'KIDS', 'KILL', 'KILN', 'KILO', 'KILT', 'KIND', 'KING', 'KINK', 'KIPS', 'KISS', 'KITE', 'KITS', 'KNEE', 'KNEW', 'KNIT', 'KNOB', 'KNOT', 'KNOW', 'LABS', 'LACE', 'LACK', 'LACY', 'LADS', 'LADY', 'LAID', 'LAKE', 'LAMB', 'LAME', 'LAMP', 'LAND', 'LANE', 'LAPS', 'LARD', 'LARK', 'LASH', 'LAST', 'LATE', 'LAUD', 'LAWN', 'LAWS', 'LAZY', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEGS', 'LEND', 'LENS', 'LENT', 'LESS', 'LEST', 'LETS', 'LEVY', 'LEWD', 'LIAR', 'LICE', 'LICK', 'LIDS', 'LIED', 'LIES', 'LIFE', 'LIFT', 'LIKE', 'LILY', 'LIMB', 'LIME', 'LIMP', 'LINE', 'LINK', 'LINT', 'LION', 'LIPS', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAN', 'LOBE', 'LOCK', 'LODE', 'LOFT', 'LONE', 'LONG', 'LOOK', 'LOOM', 'LOOP', 'LOOT', 'LORD', 'LORE', 'LOSE', 'LOSS', 'LOST', 'LOTS', 'LOUD', 'LOUR', 'LOUT', 'LOVE', 'LOWS', 'LUCK', 'LULL', 'LUMP', 'LUNG', 'LURE', 'LURK', 'LUSH', 'LUST', 'LUTE', 'LYNX', 'LYRE', 'MACE', 'MADE', 'MAID', 'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MALT', 'MAMA', 'MANE', 'MANY', 'MAPS', 'MARE', 'MARK', 'MARS', 'MART', 'MASH', 'MASK', 'MASS', 'MAST', 'MATE', 'MATH', 'MATS', 'MAUL', 'MAYO', 'MAZE', 'MEAD', 'MEAL', 'MEAN', 'MEAT', 'MEEK', 'MEET', 'MELD', 'MELT', 'MEMO', 'MEND', 'MENU', 'MEOW', 'MERE', 'MESH', 'MESS', 'MICE', 'MIDI', 'MILD', 'MILE', 'MILK', 'MILL', 'MIME', 'MIND', 'MINE', 'MINI', 'MINK', 'MINT', 'MISS', 'MIST', 'MITT', 'MOAN', 'MOAT', 'MOCK', 'MODE', 'MOLD', 'MOLE', 'MOLT', 'MOMS', 'MONK', 'MOOD', 'MOON', 'MOOR', 'MOPE', 'MOPS', 'MORE', 'MOST', 'MOTH', 'MOVE', 'MUCH', 'MUCK', 'MUDS', 'MUFF', 'MUGS', 'MULE', 'MULL', 'MUMS', 'MUNK', 'MUSE', 'MUSH', 'MUSK', 'MUST', 'MUTEimport React, { useState, useEffect, useCallback, useRef } from 'react';

const ROWS = 9;
const COLS = 8;
const INITIAL_DROP_INTERVAL = 3000; // Slower for word thinking
const LEVEL_SPEED_MULTIPLIER = 0.95;

// Scrabble letter frequencies (approximate distribution)
const LETTER_POOL = [
  'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', // 9 A's
  'B', 'B', // 2 B's
  'C', 'C', // 2 C's
  'D', 'D', 'D', 'D', // 4 D's
  'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', // 12 E's
  'F', 'F', // 2 F's
  'G', 'G', 'G', // 3 G's
  'H', 'H', // 2 H's
  'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', // 9 I's
  'J', // 1 J
  'K', // 1 K
  'L', 'L', 'L', 'L', // 4 L's
  'M', 'M', // 2 M's
  'N', 'N', 'N', 'N', 'N', 'N', // 6 N's
  'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', // 8 O's
  'P', 'P', // 2 P's
  'Q', // 1 Q
  'R', 'R', 'R', 'R', 'R', 'R', // 6 R's
  'S', 'S', 'S', 'S', // 4 S's
  'T', 'T', 'T', 'T', 'T', 'T', // 6 T's
  'U', 'U', 'U', 'U', // 4 U's
  'V', 'V', // 2 V's
  'W', 'W', // 2 W's
  'X', // 1 X
  'Y', 'Y', // 2 Y's
  'Z' // 1 Z
];

// Comprehensive English word dictionary for validation
const VALID_WORDS = new Set([
  // 3-letter words
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'END', 'FEW', 'GOT', 'LET', 'MAN', 'MAY', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CAT', 'DOG', 'SUN', 'RUN', 'BIG', 'RED', 'HOT', 'YES', 'TOP', 'WIN', 'WAY', 'TRY', 'EAT', 'BAD', 'GOD', 'JOB', 'LOT', 'FUN', 'AGE', 'BED', 'BOX', 'CUT', 'EYE', 'FAR', 'GUN', 'LAW', 'LIE', 'MOM', 'POP', 'SIT', 'SIX', 'TAX', 'WAR', 'WON', 'CAR', 'EAR', 'FAN', 'HAT', 'JAR', 'KEY', 'LEG', 'MAP', 'NET', 'OWL', 'PEN', 'RAT', 'SEA', 'TEN', 'VAN', 'WET', 'ZOO', 'ACE', 'ADD', 'AID', 'AIR', 'ARM', 'ART', 'ASK', 'BAG', 'BAR', 'BAT', 'BEE', 'BET', 'BIT', 'BOW', 'BUS', 'BUY', 'COP', 'COW', 'CRY', 'CUP', 'DIE', 'DIG', 'DOT', 'DRY', 'EGG', 'FEW', 'FIG', 'FIT', 'FLY', 'FOG', 'FOX', 'GAP', 'GAS', 'GEL', 'GEM', 'GET', 'GIG', 'GUM', 'GUY', 'HIT', 'HOP', 'HUG', 'ICE', 'ILL', 'INK', 'INN', 'JAM', 'JET', 'JOG', 'JOY', 'KID', 'KIT', 'LAP', 'LID', 'LIP', 'LOG', 'MAD', 'MIX', 'MOB', 'MUD', 'NUT', 'OIL', 'PAD', 'PAN', 'PAW', 'PAY', 'PEG', 'PET', 'PIE', 'PIG', 'PIN', 'PIT', 'POT', 'RIB', 'RID', 'ROD', 'ROW', 'RUB', 'RUG', 'SAD', 'SAP', 'SAW', 'SET', 'SHY', 'SIN', 'SIP', 'SKY', 'SOB', 'SOD', 'SON', 'SOP', 'SOW', 'SOY', 'SPA', 'SPY', 'TAB', 'TAG', 'TAN', 'TAP', 'TAR', 'TEA', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOY', 'TUG', 'TUB', 'URN', 'VET', 'VIA', 'WIG', 'WIN', 'WIT', 'YAM', 'YEP', 'YET', 'YEW', 'ZIP',
  
  // 4-letter words
  'WORD', 'TIME', 'WORK', 'YEAR', 'BACK', 'GOOD', 'JUST', 'LIFE', 'OVER', 'ALSO', 'WELL', 'KNOW', 'WANT', 'COME', 'MAKE', 'TAKE', 'LOOK', 'FIND', 'GIVE', 'HELP', 'TURN', 'MOVE', 'PLAY', 'HAND', 'PART', 'CALL', 'TELL', 'KEEP', 'SHOW', 'NEED', 'SEEM', 'FEEL', 'HEAR', 'TALK', 'WALK', 'OPEN', 'STOP', 'READ', 'BOOK', 'TREE', 'TALK', 'WALK', 'OPEN', 'STOP', 'READ', 'BOOK', 'TREE', 'FACE', 'FACT', 'HAND', 'HIGH', 'LAST', 'LEFT', 'LONG', 'MUCH', 'NEXT', 'ONCE', 'ONLY', 'PART', 'SAME', 'SURE', 'TEAM', 'TRUE', 'VERY', 'WEEK', 'YEAR', 'ABLE', 'AWAY', 'BACK', 'BEST', 'BODY', 'CALL', 'CAME', 'CASE', 'DONE', 'DOWN', 'EACH', 'EVEN', 'EVER', 'EYES', 'FEEL', 'FIND', 'FORM', 'FULL', 'GAME', 'GIVE', 'GONE', 'HALF', 'HEAD', 'HELP', 'HERE', 'HOME', 'IDEA', 'INTO', 'KEEP', 'KIND', 'KNOW', 'LAST', 'LATE', 'LIKE', 'LINE', 'LIVE', 'LONG', 'LOOK', 'MAKE', 'MANY', 'MEAN', 'MORE', 'MOST', 'MOVE', 'NAME', 'NEED', 'NEWS', 'NICE', 'OPEN', 'OVER', 'PAID', 'PLAN', 'PLAY', 'REAL', 'SAID', 'SAME', 'SEEM', 'SEND', 'SHOW', 'SIDE', 'SOME', 'STILL', 'SUCH', 'TAKE', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIS', 'TIME', 'TURN', 'USED', 'VERY', 'WANT', 'WAYS', 'WELL', 'WENT', 'WERE', 'WHAT', 'WHEN', 'WILL', 'WITH', 'WORK', 'BLUE', 'COLD', 'DARK', 'EASY', 'FAST', 'FIRE', 'FIVE', 'FOUR', 'FREE', 'GIRL', 'HARD', 'HEAR', 'HOPE', 'HOUR', 'HUGE', 'JUMP', 'KING', 'LADY', 'LAND', 'LOVE', 'MAIN', 'MIND', 'MOON', 'NEAR', 'NICE', 'PARK', 'PICK', 'POOR', 'PULL', 'PUSH', 'RICH', 'ROAD', 'ROCK', 'SAFE', 'SELL', 'SHIP', 'SING', 'SLOW', 'SOFT', 'SONG', 'SOON', 'STAR', 'STAY', 'TALL', 'TOWN', 'UGLY', 'WARM', 'WIDE', 'WILD', 'WIND', 'WISE', 'YOUNG', 'BEAR', 'BIRD', 'FISH', 'FOOD', 'FOOT', 'HAIR', 'HOLE', 'LEAF', 'MEAT', 'MILK', 'MOON', 'NOSE', 'RAIN', 'ROOM', 'SAND', 'SKIN', 'SNOW', 'TREE', 'WALL', 'WOOD', 'ARMY', 'BANK', 'BELL', 'BIKE', 'BOAT', 'BONE', 'BOOT', 'BOWL', 'CAKE', 'CARD', 'CART', 'CITY', 'COAT', 'COIN', 'COOK', 'DOOR', 'DRUM', 'DUCK', 'FARM', 'GATE', 'GIFT', 'GOAL', 'GOLD', 'HALL', 'HILL', 'HOLE', 'ICON', 'ITEM', 'JOKE', 'LAMP', 'LIST', 'LOCK', 'LOOP', 'MAIL', 'MARK', 'MASK', 'MAZE', 'MENU', 'MICE', 'NOTE', 'PAGE', 'PILL', 'PIPE', 'POOL', 'ROOF', 'ROPE', 'RULE', 'SEAT', 'SHOP', 'SIGN', 'STEP', 'TOOL', 'TOWN', 'TURN', 'WAVE', 'WIRE', 'ZERO', 'ABLE', 'ACID', 'AGES', 'ALSO', 'AREA', 'ARTS', 'AWAY', 'BABY', 'BAGS', 'BALL', 'BAND', 'BASE', 'BEAR', 'BEAT', 'BEEN', 'BELL', 'BELT', 'BEST', 'BILL', 'BITS', 'BLOW', 'BLUE', 'BOAT', 'BODY', 'BONE', 'BOOK', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BOYS', 'BUSY', 'CALL', 'CALM', 'CAME', 'CAMP', 'CARE', 'CARS', 'CASE', 'CASH', 'CAST', 'CELL', 'CHAT', 'CHEF', 'CHIN', 'CHIP', 'CITY', 'CLAY', 'CLIP', 'CLUB', 'CODE', 'COIN', 'COLD', 'COME', 'COOL', 'COPY', 'CORD', 'CORN', 'COST', 'CREW', 'CROP', 'CUTE', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DEAD', 'DEAL', 'DEAR', 'DEBT', 'DEEP', 'DESK', 'DICE', 'DIET', 'DIRT', 'DISH', 'DOCK', 'DOGS', 'DONE', 'DOOR', 'DOSE', 'DOWN', 'DRAW', 'DREW', 'DROP', 'DRUG', 'DULL', 'DUST', 'DUTY', 'EACH', 'EARN', 'EARS', 'EAST', 'EASY', 'EDGE', 'EGGS', 'ELSE', 'ENDS', 'EVEN', 'EVER', 'EVIL', 'EXIT', 'EYES', 'FACE', 'FACT', 'FAIL', 'FAIR', 'FALL', 'FAME', 'FARM', 'FAST', 'FATE', 'FEAR', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FIVE', 'FLAG', 'FLAT', 'FLEW', 'FLOW', 'FOLK', 'FOOD', 'FOOT', 'FORM', 'FORT', 'FOUR', 'FREE', 'FROM', 'FUEL', 'FULL', 'FUND', 'GAIN', 'GAME', 'GATE', 'GAVE', 'GEAR', 'GIFT', 'GIRL', 'GIVE', 'GLAD', 'GOAL', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GREW', 'GRID', 'GROW', 'GUNS', 'GUYS', 'HAIR', 'HALF', 'HALL', 'HAND', 'HANG', 'HARD', 'HARM', 'HATE', 'HEAD', 'HEAR', 'HEAT', 'HELD', 'HELL', 'HELP', 'HERE', 'HERO', 'HIDE', 'HIGH', 'HILL', 'HINT', 'HIRE', 'HITS', 'HOLD', 'HOLE', 'HOME', 'HOOD', 'HOOK', 'HOPE', 'HORN', 'HOST', 'HOUR', 'HUGE', 'HUNG', 'HUNT', 'HURT', 'ICON', 'IDEA', 'INCH', 'INTO', 'IRON', 'ITEM', 'JAIL', 'JAZZ', 'JOBS', 'JOIN', 'JOKE', 'JUMP', 'JUNE', 'JURY', 'JUST', 'KEEN', 'KEEP', 'KEPT', 'KEYS', 'KICK', 'KIDS', 'KILL', 'KIND', 'KING', 'KNEE', 'KNEW', 'KNOW', 'LACK', 'LADY', 'LAID', 'LAKE', 'LAMP', 'LAND', 'LAST', 'LATE', 'LAWS', 'LAZY', 'LEAD', 'LEAF', 'LEAN', 'LEFT', 'LEGS', 'LENS', 'LENT', 'LESS', 'LIED', 'LIES', 'LIFE', 'LIFT', 'LIKE', 'LINE', 'LINK', 'LIPS', 'LIST', 'LIVE', 'LOAN', 'LOCK', 'LONG', 'LOOK', 'LORD', 'LOSE', 'LOSS', 'LOST', 'LOTS', 'LOUD', 'LOVE', 'LUCK', 'LUNG', 'MADE', 'MAIL', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MANY', 'MARK', 'MARS', 'MASS', 'MATE', 'MATH', 'MEAL', 'MEAN', 'MEAT', 'MEET', 'MELT', 'MENU', 'MESS', 'MICE', 'MILE', 'MILK', 'MIND', 'MINE', 'MISS', 'MODE', 'MOOD', 'MOON', 'MORE', 'MOST', 'MOVE', 'MUCH', 'MUST', 'NAME', 'NEAR', 'NECK', 'NEED', 'NEWS', 'NEXT', 'NICE', 'NINE', 'NODE', 'NONE', 'NOON', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'ODDS', 'OILS', 'OKAY', 'ONCE', 'ONLY', 'ONTO', 'OPEN', 'ORAL', 'OVER', 'PACE', 'PACK', 'PAGE', 'PAID', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PEAK', 'PICK', 'PILE', 'PILL', 'PINK', 'PIPE', 'PLAN', 'PLAY', 'PLOT', 'PLUG', 'PLUS', 'POEM', 'POET', 'POLL', 'POOL', 'POOR', 'PORT', 'POST', 'POUR', 'PRAY', 'PREP', 'PULL', 'PURE', 'PUSH', 'QUIT', 'RACE', 'RAIL', 'RAIN', 'RANK', 'RARE', 'RATE', 'READ', 'REAL', 'REAR', 'RELY', 'RENT', 'RICH', 'RIDE', 'RING', 'RISE', 'RISK', 'ROAD', 'ROCK', 'ROLE', 'ROLL', 'ROOF', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'RULE', 'RUNS', 'RUSH', 'SAFE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SAVE', 'SAYS', 'SEAT', 'SEEK', 'SEEM', 'SEEN', 'SELL', 'SEND', 'SENT', 'SHIP', 'SHIT', 'SHOE', 'SHOP', 'SHOT', 'SHOW', 'SHUT', 'SICK', 'SIDE', 'SIGN', 'SING', 'SINK', 'SIZE', 'SKIN', 'SKIP', 'SLIP', 'SLOW', 'SNAP', 'SNOW', 'SOAP', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOME', 'SONG', 'SOON', 'SORT', 'SOUL', 'SOUP', 'SPOT', 'STAR', 'STAY', 'STEP', 'STIR', 'STOP', 'SUCH', 'SUIT', 'SURE', 'SWIM', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TANK', 'TAPE', 'TASK', 'TAXI', 'TEAM', 'TEAR', 'TELL', 'TEND', 'TENT', 'TERM', 'TEST', 'TEXT', 'THAN', 'THAT', 'THEM', 'THEN', 'THEY', 'THIN', 'THIS', 'THUS', 'TIDE', 'TIED', 'TIES', 'TIME', 'TINY', 'TIPS', 'TIRE', 'TOLD', 'TONE', 'TOOK', 'TOOL', 'TOPS', 'TOUR', 'TOWN', 'TOYS', 'TREE', 'TRIP', 'TRUE', 'TUBE', 'TUNE', 'TURN', 'TYPE', 'UNIT', 'UPON', 'USED', 'USER', 'USES', 'VARY', 'VAST', 'VERY', 'VIEW', 'VISA', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WANT', 'WARD', 'WARM', 'WARN', 'WASH', 'WAVE', 'WAYS', 'WEAK', 'WEAR', 'WEEK', 'WELL', 'WENT', 'WERE', 'WEST', 'WHAT', 'WHEN', 'WHOM', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WIND', 'WINE', 'WING', 'WINS', 'WIRE', 'WISE', 'WISH', 'WITH', 'WOLF', 'WOOD', 'WORD', 'WORE', 'WORK', 'WORN', 'YARD', 'YEAH', 'YEAR', 'YOUR', 'ZERO', 'ZONE',
  
  // 5+ letter words
  'HOUSE', 'WATER', 'LIGHT', 'WORLD', 'NIGHT', 'RIGHT', 'POINT', 'GROUP', 'PLACE', 'THINK', 'FIRST', 'SMALL', 'GREAT', 'WHERE', 'NEVER', 'EVERY', 'WOULD', 'COULD', 'SHOULD', 'MIGHT', 'STILL', 'THESE', 'THOSE', 'THERE', 'THEIR', 'WHILE', 'BEING', 'AFTER', 'UNDER', 'OTHER', 'HEART', 'POWER', 'MONEY', 'MUSIC', 'OFTEN', 'UNTIL', 'QUITE', 'SINCE', 'THIRD', 'CLEAR', 'CLOSE', 'EARLY', 'LARGE', 'LOCAL', 'MAJOR', 'PARTY', 'ROYAL', 'HAPPY', 'YOUNG', 'HUMAN', 'VOICE', 'SOUND', 'SPACE', 'STORY', 'TABLE', 'CHAIR', 'FLOOR', 'SMILE', 'LAUGH', 'TEACH', 'LEARN', 'STUDY', 'DRINK', 'SLEEP', 'DREAM', 'AWAKE', 'ALIVE', 'ALONE', 'SWEET', 'PEACE', 'QUIET', 'QUICK', 'ROUND', 'SHARP', 'CLEAN', 'DIRTY', 'EMPTY', 'PLAIN', 'CHEAP', 'WHOLE', 'FRESH', 'HEAVY', 'LIGHT', 'THICK', 'EQUAL', 'FINAL', 'FRONT', 'PAPER', 'GLASS', 'METAL', 'STORM', 'RIVER', 'OCEAN', 'BEACH', 'PLANT', 'FIELD', 'WOMAN', 'CHILD', 'BREAD', 'CHESS', 'BEACH', 'CREAM', 'PHONE', 'FRAME', 'KNIFE', 'SPOON', 'PLATE', 'HONEY', 'ANGEL', 'TIGER', 'HORSE', 'SNAKE', 'GRASS', 'BREAD', 'GRAPE', 'APPLE', 'PEACH', 'LEMON', 'CROWN', 'SMART', 'BRAVE', 'LUCKY', 'MAGIC', 'ROYAL', 'SPACE', 'EARTH', 'HEART', 'BRAIN', 'BLOOD', 'TOUCH', 'RADIO', 'VIDEO', 'MOVIE', 'DANCE', 'PIECE', 'PICTURE', 'NATURE', 'SPRING', 'SUMMER', 'WINTER', 'FRIEND', 'FAMILY', 'MOTHER', 'FATHER', 'SISTER', 'BROTHER', 'YELLOW', 'ORANGE', 'PURPLE', 'GREEN', 'BROWN', 'WHITE', 'BLACK', 'SEVEN', 'EIGHT', 'TWELVE', 'TWENTY', 'THIRTY', 'FIFTY', 'SIXTY', 'HUNDRED', 'THOUSAND', 'MILLION', 'FLOWER', 'GARDEN', 'ANIMAL', 'FOREST', 'DESERT', 'ISLAND', 'MOUNTAIN', 'VALLEY', 'LETTER', 'SCHOOL', 'OFFICE', 'MARKET', 'BRIDGE', 'CASTLE', 'CHURCH', 'HANDLE', 'BUTTON', 'WINDOW', 'CORNER', 'CIRCLE', 'SQUARE', 'TRAVEL', 'ARRIVE', 'DEPART', 'RETURN', 'CHANGE', 'ANSWER', 'LISTEN', 'FOLLOW', 'FORGET', 'REMEMBER', 'BROKEN', 'STRONG', 'SIMPLE', 'DOUBLE', 'SINGLE', 'COUPLE', 'LEADER', 'MEMBER', 'PLAYER', 'SINGER', 'WRITER', 'ARTIST', 'DOCTOR', 'DRIVER', 'FARMER', 'TEACHER', 'WORKER', 'FINGER', 'SHOULDER', 'POCKET', 'JACKET', 'SEASON', 'REASON', 'PERSON', 'PEOPLE', 'NOTICE', 'CHOOSE', 'ENOUGH', 'WEIGHT', 'HEIGHT', 'LENGTH', 'BREATH', 'HEALTH', 'WEALTH', 'FORGET', 'RECENT', 'FUTURE', 'SPIRIT', 'ENERGY', 'WISDOM', 'BEAUTY', 'CHANCE', 'OPTION', 'CHOICE', 'RESULT', 'MATTER', 'MOMENT', 'SECOND', 'MINUTE', 'BEFORE', 'DURING', 'WITHIN', 'EXCEPT', 'UNLESS', 'THOUGH', 'AROUND', 'ACROSS', 'REALLY', 'SURELY', 'RATHER', 'EITHER', 'INDEED', 'BEYOND', 'MYSELF', 'ITSELF', 'AMOUNT', 'DEGREE', 'NUMBER', 'SYSTEM', 'METHOD', 'POLICY', 'AGREED', 'SOCIAL', 'PUBLIC', 'MODERN', 'RECENT', 'LISTEN', 'MIDDLE', 'PLAYER', 'KEEPER', 'HOLDER', 'FINGER', 'MANNER', 'MATTER', 'GATHER', 'FATHER', 'MOTHER', 'SISTER', 'DOCTOR', 'FINGER', 'CORNER', 'BORDER', 'MARKET', 'RATHER', 'GATHER', 'SILVER', 'DINNER', 'SUMMER', 'BUTTER', 'LETTER', 'BETTER', 'BITTER', 'LITTLE', 'MIDDLE', 'PURPLE', 'SIMPLE', 'CIRCLE', 'BOTTLE', 'SETTLE', 'BATTLE', 'CATTLE', 'RATTLE', 'GENTLE', 'NEEDLE', 'FIDDLE', 'PUZZLE', 'PEOPLE', 'COUPLE', 'DOUBLE', 'TRIPLE', 'SINGLE', 'SYMBOL', 'MUSCLE', 'RESCUE', 'SECURE', 'FIGURE', 'FUTURE', 'NATURE', 'MATURE', 'ENSURE', 'EXPERT', 'EXTEND', 'RECORD', 'REPORT', 'EFFORT', 'EFFECT', 'OBJECT', 'REJECT', 'EXPECT', 'ASPECT', 'PERMIT', 'SUBMIT', 'COMMIT', 'CREDIT', 'PROFIT', 'OFFSET', 'OUTPUT', 'INPUT', 'LAYOUT', 'MAKEUP', 'BACKUP', 'PICKUP', 'LOOKUP', 'COOKIE', 'ROOKIE', 'HOODIE', 'GOODIE', 'HAPPEN', 'KITTEN', 'MITTEN', 'BUTTON', 'COTTON', 'BOTTOM', 'AUTUMN', 'LISTEN', 'POISON', 'PRISON', 'REASON', 'SEASON', 'LESSON', 'WEAPON', 'BEACON', 'COMMON', 'SALMON', 'CANNON', 'BUTTON', 'MUTTON', 'BELLOW', 'YELLOW', 'FOLLOW', 'HOLLOW', 'PILLOW', 'WINDOW', 'SHADOW', 'MEADOW', 'NARROW', 'SORROW', 'BORROW', 'MELLOW', 'FELLOW', 'DOLLAR', 'COLLAR', 'CELLAR', 'REGULAR', 'POPULAR', 'SIMILAR', 'FAMILIAR', 'SPECIAL', 'GENERAL', 'SEVERAL', 'NATURAL', 'CENTRAL', 'FEDERAL', 'LIBERAL', 'CAPITAL', 'DIGITAL', 'TYPICAL', 'LOGICAL', 'MAGICAL', 'MEDICAL', 'RADICAL', 'MUSICAL', 'OPTICAL', 'ETHICAL', 'TYPICAL', 'CLASSIC', 'PLASTIC', 'ELASTIC', 'ORGANIC', 'DYNAMIC', 'GRAPHIC', 'TRAFFIC', 'PACIFIC', 'SCIENCE', 'SILENCE', 'BALANCE', 'FINANCE', 'ROMANCE', 'ADVANCE', 'SERVICE', 'SURFACE', 'PURPOSE', 'PROMISE', 'PRECISE', 'BECAUSE', 'DECLINE', 'MACHINE', 'EXAMINE', 'COMBINE', 'IMAGINE', 'SOMEONE', 'WELCOME', 'OUTCOME', 'AWESOME', 'TROUBLE', 'CAPABLE', 'NOTABLE', 'USEABLE', 'DURABLE', 'VISIBLE', 'ENABLED', 'SKILLED', 'WEALTHY', 'HEALTHY', 'STEALTH', 'BENEATH', 'BREATHE', 'CLOTHES', 'KITCHEN', 'CHICKEN', 'MACHINE', 'RAINBOW', 'MAILBOX', 'TOOLBOX', 'COWBOY', 'TOMBOY', 'ENJOY', 'EMPLOY', 'DEPLOY', 'STORY', 'GLORY', 'WORRY', 'SORRY', 'CHERRY', 'BERRY', 'FERRY', 'MERRY', 'TERRY', 'CARRY', 'MARRY', 'PARRY', 'HARRY', 'LARRY', 'BARRY'
]);

// Cache for word validations
const wordValidationCache = new Map();

const WordDropGame = () => {
  const [grid, setGrid] = useState([]);
  const [preview, setPreview] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [dropInterval, setDropInterval] = useState(INITIAL_DROP_INTERVAL);
  const [isPaused, setIsPaused] = useState(false);
  const [particles, setParticles] = useState([]);
  const [fallingBlocks, setFallingBlocks] = useState([]);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [wordSubmissionFeedback, setWordSubmissionFeedback] = useState('');
  const [wordsLoading, setWordsLoading] = useState(true);
  const gameAreaRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const blockAnimationRef = useRef(null);

  // Load word list from external file
  useEffect(() => {
    const loadWordList = async () => {
      try {
        setWordsLoading(true);
        const response = await fetch('/retrolite-master/dyslexiawords.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const wordData = await response.json();
        
        // Handle different possible JSON structures
        let words = [];
        if (Array.isArray(wordData)) {
          words = wordData;
        } else if (wordData.words && Array.isArray(wordData.words)) {
          words = wordData.words;
        } else if (typeof wordData === 'object') {
          // If it's an object, try to extract words from values or keys
          words = Object.keys(wordData);
        }
        
        // Convert to uppercase and filter for minimum length
        const validWords = words
          .map(word => word.toString().toUpperCase().trim())
          .filter(word => word.length >= 3 && /^[A-Z]+$/.test(word));
        
        VALID_WORDS = new Set(validWords);
        console.log(`Loaded ${VALID_WORDS.size} words from dictionary`);
        
      } catch (error) {
        console.warn('Failed to load word list from file, using fallback:', error);
        
        // Fallback to a basic word list if file loading fails
        VALID_WORDS = new Set([
          'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'END', 'FEW', 'GOT', 'LET', 'MAN', 'MAY', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CAT', 'DOG', 'SUN', 'RUN', 'BIG', 'RED', 'HOT', 'YES', 'TOP', 'WIN', 'WAY', 'TRY', 'EAT', 'BAD', 'GOD', 'JOB', 'LOT', 'FUN', 'AGE', 'BED', 'BOX', 'CUT', 'EYE', 'FAR', 'GUN', 'LAW', 'LIE', 'MOM', 'POP', 'SIT', 'SIX', 'TAX', 'WAR', 'WON', 'WORD', 'TIME', 'WORK', 'YEAR', 'BACK', 'GOOD', 'JUST', 'LIFE', 'OVER', 'ALSO', 'WELL', 'KNOW', 'WANT', 'COME', 'MAKE', 'TAKE', 'LOOK', 'FIND', 'GIVE', 'HELP', 'TURN', 'MOVE', 'PLAY', 'HAND', 'PART', 'CALL', 'TELL', 'KEEP', 'SHOW', 'NEED', 'SEEM', 'FEEL', 'HEAR', 'TALK', 'WALK', 'OPEN', 'STOP', 'READ', 'BOOK', 'TREE', 'HOUSE', 'WATER', 'LIGHT', 'WORLD', 'NIGHT', 'RIGHT', 'POINT', 'GROUP', 'PLACE', 'THINK', 'FIRST', 'SMALL', 'GREAT', 'WHERE', 'NEVER', 'EVERY', 'WOULD', 'COULD', 'SHOULD', 'MIGHT', 'STILL', 'THESE', 'THOSE', 'THERE', 'THEIR', 'WHILE', 'BEING', 'AFTER', 'UNDER', 'OTHER'
        ]);
        console.log(`Using fallback word list with ${VALID_WORDS.size} words`);
      } finally {
        setWordsLoading(false);
      }
    };
    
    loadWordList();
  }, []);

  // Simple haptic feedback
  const hapticFeedback = (type = 'light') => {
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(25);
          break;
        case 'success':
          navigator.vibrate([50, 30, 50]);
          break;
        case 'error':
          navigator.vibrate([100, 50, 100]);
          break;
        default:
          navigator.vibrate(15);
      }
    }
  };

  const createParticleExplosion = (row, col, letter) => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: `particle-${row}-${col}-${Date.now()}-${i}`,
      x: col * 12.5 + 6.25,
      y: row * 11.1 + 5.55,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 8 - 3,
      color,
      life: 1
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 800);
  };

  const generateRandomLetter = () => LETTER_POOL[Math.floor(Math.random() * LETTER_POOL.length)];

  const createInitialGrid = useCallback(() => {
    let newGrid = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    
    // Fill bottom 4 rows with random letters
    for (let row = ROWS - 4; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        newGrid[row][col] = generateRandomLetter();
      }
    }
    
    return newGrid;
  }, []);

  const isValidWord = (word) => {
    if (word.length < 3) return false;
    
    const upperWord = word.toUpperCase();
    
    // Check cache first
    if (wordValidationCache.has(upperWord)) {
      return wordValidationCache.get(upperWord);
    }
    
    // Check against our comprehensive word list
    const isValid = VALID_WORDS.has(upperWord);
    
    // Cache the result
    wordValidationCache.set(upperWord, isValid);
    
    return isValid;
  };const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      console.log(`API response status for "${word}":`, response.status);
      
      const isValid = response.ok;
      
      if (isValid) {
        const data = await response.json();
        console.log(`Word "${word}" found in dictionary:`, data[0]?.meanings?.length > 0);
      }
      
      // Cache the result
      wordValidationCache.set(upperWord, isValid);
      console.log(`Cached result for "${upperWord}":`, isValid);
      
      return isValid;
    } catch (error) {
      console.warn('Dictionary API error:', error);
      
      // Fallback to basic validation for common words
      const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'HAD', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'END', 'FEW', 'GOT', 'LET', 'MAN', 'MAY', 'PUT', 'SAY', 'SHE', 'TOO', 'USE', 'CAT', 'DOG', 'SUN', 'RUN', 'BIG', 'RED', 'HOT', 'YES', 'TOP', 'WIN', 'WAY', 'TRY', 'EAT', 'BAD', 'GOD', 'JOB', 'LOT', 'FUN', 'AGE', 'BED', 'BOX', 'CUT', 'EYE', 'FAR', 'GUN', 'LAW', 'LIE', 'MOM', 'POP', 'SIT', 'SIX', 'TAX', 'WAR', 'WON', 'WORD', 'TIME', 'WORK', 'YEAR', 'BACK', 'GOOD', 'JUST', 'LIFE', 'OVER', 'ALSO', 'WELL', 'KNOW', 'WANT', 'COME', 'MAKE', 'TAKE', 'LOOK', 'FIND', 'GIVE', 'HELP', 'TURN', 'MOVE', 'PLAY', 'HAND', 'PART', 'CALL', 'TELL', 'KEEP', 'SHOW', 'NEED', 'SEEM', 'FEEL', 'HEAR', 'TALK', 'WALK', 'OPEN', 'STOP', 'READ', 'BOOK', 'TREE', 'HOUSE', 'WATER', 'LIGHT', 'WORLD', 'NIGHT', 'RIGHT', 'POINT', 'GROUP', 'PLACE', 'THINK', 'FIRST', 'SMALL', 'GREAT', 'WHERE', 'NEVER', 'EVERY', 'WOULD', 'COULD', 'SHOULD', 'MIGHT', 'STILL', 'LONG', 'HIGH', 'LAST', 'NEXT', 'BEST', 'MUCH', 'MANY', 'MOST', 'SOME', 'EACH', 'SAME', 'ONLY', 'VERY', 'WHAT', 'WHEN', 'THEN', 'THAN', 'MORE', 'LESS', 'EVEN', 'SUCH', 'LIKE', 'BOTH', 'SAID', 'MADE', 'CAME', 'TOOK', 'WENT', 'SEEN', 'BEEN', 'HAVE', 'WILL', 'FROM', 'INTO', 'WITH', 'THEY', 'THEM', 'WERE', 'THEIR', 'WOULD', 'THERE', 'COULD', 'OTHER', 'AFTER', 'THESE', 'THINK', 'WHERE', 'BEING', 'EVERY', 'GREAT', 'MIGHT', 'SHALL', 'STILL', 'THOSE', 'UNDER', 'WHILE'];
      const fallbackValid = commonWords.includes(upperWord);
      console.log(`Using fallback for "${upperWord}":`, fallbackValid);
      
      // Cache fallback result
      wordValidationCache.set(upperWord, fallbackValid);
      
      return fallbackValid;
    }
  };

  const clearSelectedLetters = () => {
    if (selectedLetters.length === 0) return;

    const newGrid = grid.map(row => [...row]);
    let points = 0;
    
    selectedLetters.forEach(({ row, col }) => {
      createParticleExplosion(row, col, newGrid[row][col]);
      newGrid[row][col] = null;
      points += 10;
    });
    
    // Word length bonus
    if (selectedLetters.length > 3) {
      points += (selectedLetters.length - 3) * 20;
    }
    
    // Rare letter bonus
    selectedLetters.forEach(({ row, col }) => {
      const letter = grid[row][col];
      if (['Q', 'X', 'Z', 'J', 'K'].includes(letter)) {
        points += 50;
      }
    });
    
    hapticFeedback('success');
    setScore(prev => prev + points);
    setSelectedLetters([]);
    setCurrentWord('');
    
    return newGrid;
  };

  const dropBlocks = (grid, animate = true) => {
    const newGrid = Array(ROWS).fill().map(() => Array(COLS).fill(null));
    const fallingAnimations = [];
    
    for (let col = 0; col < COLS; col++) {
      const column = [];
      for (let row = ROWS - 1; row >= 0; row--) {
        if (grid[row][col] !== null) {
          column.push({ letter: grid[row][col], originalRow: row });
        }
      }
      
      for (let i = 0; i < column.length; i++) {
        const newRow = ROWS - 1 - i;
        const originalRow = column[i].originalRow;
        newGrid[newRow][col] = column[i].letter;
        
        if (animate && originalRow !== newRow) {
          fallingAnimations.push({
            id: `falling-${originalRow}-${col}-${Date.now()}`,
            col,
            startRow: originalRow,
            endRow: newRow,
            currentY: originalRow * 11.1 + 5.55,
            targetY: newRow * 11.1 + 5.55,
            velocityY: 0,
            letter: column[i].letter,
            startTime: Date.now()
          });
        }
      }
    }
    
    if (animate && fallingAnimations.length > 0) {
      setFallingBlocks(fallingAnimations);
      animateFallingBlocks(fallingAnimations);
    }
    
    return newGrid;
  };

  const animateFallingBlocks = (initialBlocks) => {
    if (initialBlocks.length === 0) return;
    
    const startTime = Date.now();
    
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) / 1000;
      
      setFallingBlocks(prevBlocks => {
        const updatedBlocks = prevBlocks.map(block => {
          const gravity = 600;
          const distancePercent = block.velocityY * elapsed + 0.5 * gravity * elapsed * elapsed;
          const newY = (block.startRow * 11.1 + 5.55) + distancePercent;
          
          if (newY >= block.targetY) {
            return null;
          }
          
          return {
            ...block,
            currentY: newY
          };
        }).filter(Boolean);
        
        if (updatedBlocks.length > 0) {
          blockAnimationRef.current = requestAnimationFrame(animate);
        } else {
          blockAnimationRef.current = null;
        }
        
        return updatedBlocks;
      });
    };
    
    blockAnimationRef.current = requestAnimationFrame(animate);
  };

  const handleLetterClick = (row, col) => {
    if (gameOver || isPaused || fallingBlocks.length > 0 || !grid[row][col]) return;
    
    const letterPos = { row, col };
    const isAlreadySelected = selectedLetters.some(pos => pos.row === row && pos.col === col);
    
    if (isAlreadySelected) {
      // Deselect letter
      setSelectedLetters(prev => prev.filter(pos => !(pos.row === row && pos.col === col)));
      setCurrentWord(prev => {
        const letterIndex = selectedLetters.findIndex(pos => pos.row === row && pos.col === col);
        return prev.slice(0, letterIndex) + prev.slice(letterIndex + 1);
      });
      hapticFeedback('light');
    } else {
      // Select letter
      setSelectedLetters(prev => [...prev, letterPos]);
      setCurrentWord(prev => prev + grid[row][col]);
      hapticFeedback('light');
    }
  };

  const submitWord = async () => {
    if (currentWord.length < 3) {
      setWordSubmissionFeedback('Words must be at least 3 letters!');
      hapticFeedback('error');
      setTimeout(() => setWordSubmissionFeedback(''), 2000);
      return;
    }
    
    setIsValidatingWord(true);
    setWordSubmissionFeedback('Checking word...');
    
    try {
      const valid = await isValidWord(currentWord);
      
      if (!valid) {
        setWordSubmissionFeedback(`"${currentWord}" is not a valid word!`);
        hapticFeedback('error');
        setWordSubmissionFeedback('');
        setTimeout(() => setWordSubmissionFeedback(''), 2000);
        return;
      }
      
      setWordSubmissionFeedback(`Great! "${currentWord}" is valid!`);
      hapticFeedback('success');
      
      const clearedGrid = clearSelectedLetters();
      const droppedGrid = dropBlocks(clearedGrid);
      setGrid(droppedGrid);
      
      setTimeout(() => setWordSubmissionFeedback(''), 2000);
      
      const newLevel = Math.floor(score / 1000) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setDropInterval(prev => Math.max(1000, prev * LEVEL_SPEED_MULTIPLIER));
      }
    } catch (error) {
      console.error('Word validation error:', error);
      setWordSubmissionFeedback('Error checking word. Try again!');
      hapticFeedback('error');
      setTimeout(() => setWordSubmissionFeedback(''), 2000);
    } finally {
      setIsValidatingWord(false);
    }
  };

  const clearSelection = () => {
    setSelectedLetters([]);
    setCurrentWord('');
    hapticFeedback('light');
  };

  const dropPreviewRow = useCallback(() => {
    setPreview(currentPreview => {
      if (currentPreview.length === 0 || fallingBlocks.length > 0) {
        return currentPreview;
      }
      
      setGrid(currentGrid => {
        const newGrid = currentGrid.map(row => [...row]);
        
        // Check for game over
        for (let col = 0; col < COLS; col++) {
          if (newGrid[0][col] !== null) {
            setGameOver(true);
            return currentGrid;
          }
        }
        
        // Add preview letters to top row
        for (let col = 0; col < COLS; col++) {
          if (currentPreview[col]) {
            newGrid[0][col] = currentPreview[col];
          }
        }
        
        const droppedGrid = dropBlocks(newGrid);
        setScore(prev => prev + 25); // Survival bonus
        
        return droppedGrid;
      });
      
      return [];
    });
  }, [fallingBlocks]);

  // Progress animation
  useEffect(() => {
    if (!gameOver && !isPaused) {
      const animate = (currentTime) => {
        if (lastTimeRef.current === 0) {
          lastTimeRef.current = currentTime;
        }
        
        const deltaTime = currentTime - lastTimeRef.current;
        
        if (deltaTime >= 33) {
          const progressPerMs = 100 / dropInterval;
          
          setPreviewProgress(prev => {
            const newProgress = prev + (progressPerMs * deltaTime);
            
            if (newProgress >= 100) {
              setPreview(current => {
                if (current.length < COLS - 1) {
                  return [...current, generateRandomLetter()];
                } else if (current.length === COLS - 1) {
                  const finalPreview = [...current, generateRandomLetter()];
                  setTimeout(() => dropPreviewRow(), 100);
                  return finalPreview;
                }
                return current;
              });
              return 0;
            }
            
            return newProgress;
          });
          
          lastTimeRef.current = currentTime;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [dropInterval, gameOver, isPaused, dropPreviewRow]);

  // Initialize game
  useEffect(() => {
    setGrid(createInitialGrid());
    setPreview([]);
    setPreviewProgress(0);
    lastTimeRef.current = 0;
  }, [createInitialGrid]);

  // Timer
  useEffect(() => {
    if (!gameOver && !isPaused) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameOver, isPaused]);

  // Particle animation
  useEffect(() => {
    if (particles.length === 0) return;
    
    const animateParticles = () => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx * 0.6,
        y: particle.y + particle.vy * 0.6,
        vy: particle.vy + 4 * 0.6,
        life: particle.life - 0.04
      })).filter(p => p.life > 0));
    };
    
    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [particles]);

  const resetGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setGrid(createInitialGrid());
    setPreview([]);
    setSelectedLetters([]);
    setCurrentWord('');
    setScore(0);
    setLevel(1);
    setTimeElapsed(0);
    setGameOver(false);
    setDropInterval(INITIAL_DROP_INTERVAL);
    setIsPaused(false);
    setParticles([]);
    setFallingBlocks([]);
    setIsValidatingWord(false);
    if (blockAnimationRef.current) {
      cancelAnimationFrame(blockAnimationRef.current);
    }
    setPreviewProgress(0);
    lastTimeRef.current = 0;
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
    lastTimeRef.current = 0;
    hapticFeedback('light');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLetterColor = (letter) => {
    // Color letters by frequency/value
    const rare = ['Q', 'X', 'Z', 'J', 'K'];
    const uncommon = ['F', 'H', 'V', 'W', 'Y', 'B', 'C', 'M', 'P'];
    const common = ['G', 'L', 'D', 'S', 'U'];
    const veryCommon = ['N', 'T', 'R'];
    const mostCommon = ['A', 'E', 'I', 'O'];
    
    if (rare.includes(letter)) return '#8B5CF6'; // Purple for rare
    if (uncommon.includes(letter)) return '#EF4444'; // Red for uncommon
    if (common.includes(letter)) return '#F59E0B'; // Orange for common
    if (veryCommon.includes(letter)) return '#10B981'; // Green for very common
    if (mostCommon.includes(letter)) return '#3B82F6'; // Blue for most common
    return '#6B7280'; // Gray default
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4 text-white">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 mb-4 shadow-lg border border-purple-500/30 relative">
          <div className="flex justify-between items-center text-sm font-medium">
            <div className="flex flex-col items-center">
              <span className="text-xs opacity-75 text-purple-300">Score</span>
              <span className="text-xl font-bold text-yellow-300">
                {score.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs opacity-75 text-blue-300">Level</span>
              <span className="text-xl font-bold text-blue-300">
                {level}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs opacity-75 text-green-300">Time</span>
              <span className="text-xl font-bold text-green-300">
                {formatTime(timeElapsed)}
              </span>
            </div>
          </div>
          
          <button
            onClick={togglePause}
            className="absolute -top-2 -right-2 w-10 h-10 bg-purple-600 rounded-full shadow-lg flex items-center justify-center text-sm hover:bg-purple-700 transition-colors border-2 border-white/20"
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
        </div>

        {/* Current Word Display */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-lg border border-yellow-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-yellow-300">Current Word</span>
            <span className="text-sm text-yellow-300">{currentWord.length} letters</span>
          </div>
          <div className="bg-black/50 rounded-lg p-3 mb-3 min-h-[40px] flex items-center">
            <span className="text-2xl font-bold text-white tracking-wider">
              {currentWord || 'Tap letters to spell...'}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={submitWord}
              disabled={currentWord.length < 3}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Submit Word ✓
            </button>
            <button
              onClick={clearSelection}
              disabled={currentWord.length === 0}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Clear ✗
            </button>
          </div>
          {wordSubmissionFeedback && (
            <div className={`mt-2 text-center text-sm font-medium ${
              wordSubmissionFeedback.includes('Great') ? 'text-green-300' : 'text-red-300'
            }`}>
              {wordSubmissionFeedback}
            </div>
          )}
        </div>
        
        {/* Preview Row */}
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 mb-4 shadow-lg border border-cyan-500/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-cyan-300">Next Letters</span>
            <span className="text-sm font-medium text-cyan-300">{preview.length}/{COLS}</span>
          </div>
          
          <div className="w-full bg-black/50 rounded-full h-2 mb-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-none"
              style={{ 
                width: `${(preview.length * 100 + previewProgress) / COLS}%`
              }}
            />
          </div>
          
          <div className="grid grid-cols-8 gap-1 h-10">
            {Array(COLS).fill().map((_, col) => (
              <div
                key={col}
                className="rounded border transition-colors duration-300 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: preview[col] ? getLetterColor(preview[col]) : 'rgba(255,255,255,0.05)',
                  borderColor: preview[col] ? '#ffffff80' : '#ffffff20',
                  color: 'white'
                }}
              >
                {preview[col] || ''}
              </div>
            ))}
          </div>
        </div>
        
        {/* Game Area */}
        <div 
          ref={gameAreaRef}
          className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/10 overflow-hidden"
        >
          <div className="grid grid-cols-8 gap-1">
            {grid.map((row, rowIndex) =>
              row.map((letter, colIndex) => {
                if (!letter) return (
                  <div 
                    key={`${rowIndex}-${colIndex}`}
                    className="aspect-square"
                  />
                );
                
                const isSelected = selectedLetters.some(pos => pos.row === rowIndex && pos.col === colIndex);
                const isFalling = fallingBlocks.some(fb => 
                  fb.col === colIndex && fb.endRow === rowIndex
                );
                
                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`aspect-square rounded-lg transition-all duration-200 transform flex items-center justify-center text-sm font-bold ${
                      isSelected ? 'scale-110 ring-2 ring-yellow-400' : 'hover:scale-105'
                    } ${isFalling ? 'opacity-0' : 'opacity-100'}`}
                    style={{
                      backgroundColor: getLetterColor(letter),
                      boxShadow: isSelected 
                        ? `0 0 20px ${getLetterColor(letter)}, 0 4px 8px rgba(0,0,0,0.3)`
                        : `0 2px 8px ${getLetterColor(letter)}40, 0 1px 4px rgba(0,0,0,0.3)`,
                      border: `2px solid ${isSelected ? '#fbbf24' : 'rgba(255,255,255,0.2)'}`,
                      color: 'white'
                    }}
                    onClick={() => handleLetterClick(rowIndex, colIndex)}
                    disabled={gameOver || isPaused}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
          
          {/* Falling Letters */}
          {fallingBlocks.map(block => (
            <div
              key={block.id}
              className="absolute pointer-events-none rounded-lg flex items-center justify-center text-sm font-bold"
              style={{
                left: block.col * 12.5 + '%',
                top: block.currentY + '%',
                width: '12.5%',
                height: '11.1%',
                backgroundColor: getLetterColor(block.letter),
                boxShadow: `0 4px 12px ${getLetterColor(block.letter)}60, 0 2px 6px rgba(0,0,0,0.4)`,
                border: '2px solid rgba(255,255,255,0.3)',
                transform: 'translate(0, -50%)',
                zIndex: 10,
                color: 'white'
              }}
            >
              {block.letter}
            </div>
          ))}
          
          {/* Particles */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute pointer-events-none"
              style={{
                left: particle.x + '%',
                top: particle.y + '%',
                width: '3px',
                height: '3px',
                backgroundColor: particle.color,
                opacity: particle.life,
                transform: 'translate(-50%, -50%)',
                borderRadius: '1px'
              }}
            />
          ))}
        </div>
        
        {/* Game Over Screen */}
        {gameOver && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
            <div className="bg-black/80 backdrop-blur-sm p-6 rounded-xl text-center max-w-sm mx-4 shadow-xl border border-red-500/30">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-4 text-red-400">Game Over!</h2>
              <div className="mb-6 space-y-2">
                <p>Final Score: {score.toLocaleString()}</p>
                <p>Level Reached: {level}</p>
                <p>Time Survived: {formatTime(timeElapsed)}</p>
              </div>
              <button
                onClick={resetGame}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Play Again 🎮
              </button>
            </div>
          </div>
        )}

        {/* Pause overlay */}
        {isPaused && !gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="bg-black/80 backdrop-blur-sm p-6 rounded-xl text-center shadow-xl border border-blue-500/30">
              <div className="text-4xl mb-4">⏸️</div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">Game Paused</h3>
              <button
                onClick={togglePause}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Resume ▶️
              </button>
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-4 text-center">
          <div className="text-xs opacity-75 space-y-1 bg-black/20 backdrop-blur-sm rounded-xl p-3 border border-white/10">
            <p>📝 Tap letters to spell words • Submit to check dictionary!</p>
            <p>⏱️ Uses real dictionary API for validation!</p>
            <p>⏱️ Clear letters before new ones drop!</p>
            <p>🎯 Longer words = more points!</p>
            <div className="flex justify-center gap-2 mt-2 text-xs">
              <span className="px-2 py-1 rounded" style={{backgroundColor: '#8B5CF6'}}>Rare</span>
              <span className="px-2 py-1 rounded" style={{backgroundColor: '#EF4444'}}>Uncommon</span>
              <span className="px-2 py-1 rounded" style={{backgroundColor: '#F59E0B'}}>Common</span>
              <span className="px-2 py-1 rounded" style={{backgroundColor: '#10B981'}}>Frequent</span>
              <span className="px-2 py-1 rounded" style={{backgroundColor: '#3B82F6'}}>Very Common</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDropGame;
        