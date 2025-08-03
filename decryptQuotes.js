const decryptQuotes = [
    {
        id: 119,
        quote: "THATLL DO PIG THATLL DO",
        title: "The Farmer's Approval",
        source: "Farmer Hoggett, from Babe",
        notes: "A farmer's quiet words of praise to his sheep-herding pig."
    },
    {
        id: 17,
        quote: "ROADS WHERE WERE GOING WE DONT NEED ROADS",
        title: "The Future of Travel",
        source: "Doc Brown, from Back to the Future",
        notes: "A confident statement before traveling through time."
    },
    {
        id: 181,
        quote: "THE INTERNET IS JUST A WORLD PASSING NOTES IN A CLASSROOM",
        title: "The Digital Schoolhouse",
        source: "Jon Stewart",
        notes: "A simple, funny, and accurate description of the internet's social dynamics."
    },
    {
        id: 11,
        quote: "I HAVE A FEELING WERE NOT IN KANSAS ANYMORE",
        title: "Entering a New World",
        source: "Dorothy Gale, from The Wizard of Oz",
        notes: "An observation made upon arriving in a strange, colorful land."
    },
    {
        id: 191,
        quote: "THE TROUBLE WITH HAVING AN OPEN MIND OF COURSE IS THAT PEOPLE WILL INSIST ON COMING ALONG AND TRYING TO PUT THINGS IN IT",
        title: "The Open Mind Problem",
        source: "Terry Pratchett",
        notes: "A cynical yet funny observation from the 'Discworld' series."
    },
    
    {
        id: 104,
        quote: "WE WILL WE WILL ROCK YOU",
        title: "The Stadium Anthem",
        source: "Queen (song)",
        notes: "A simple but powerful chant designed for audience participation."
    },
    {
        id: 121,
        quote: "MY MONEY DONT JIGGLE JIGGLE IT FOLDS",
        title: "The Jiggle Jiggle Rap",
        source: "Louis Theroux (viral sound)",
        notes: "A rap that went viral from a documentarian's old interview."
    },
    {
        id: 13,
        quote: "JUST KEEP SWIMMING",
        title: "The Optimist's Motto",
        source: "Dory, from Finding Nemo",
        notes: "A piece of advice from a very forgetful blue fish."
    },
    {
        id: 177,
        quote: "TAKE ON ME TAKE ME ON",
        title: "The Sketchbook Serenade",
        source: "A-ha (song)",
        notes: "The catchy chorus from a song famous for its groundbreaking pencil-sketch animation music video."
    },
    {
        id: 190,
        quote: "I LOVE DEADLINES I LOVE THE WHOOSHING NOISE THEY MAKE AS THEY GO BY",
        title: "The Procrastinator's Anthem",
        source: "Douglas Adams",
        notes: "A witty and relatable take on the pressure of deadlines."
    },
    {
        id: 187,
        quote: "I CAN RESIST EVERYTHING EXCEPT TEMPTATION",
        title: "The Wildean Paradox",
        source: "Oscar Wilde",
        notes: "A classic epigram on the nature of desire from the play 'Lady Windermere's Fan'."
    },
    {
        id: 10,
        quote: "THERES NO PLACE LIKE HOME",
        title: "The Ruby Slipper Mantra",
        source: "Dorothy Gale, from The Wizard of Oz",
        notes: "A heartfelt realization from a journey to a magical land."
    },
    {
        id: 139,
        quote: "I CAN DO THIS ALL DAY",
        title: "The Super Soldier's Resolve",
        source: "Steve Rogers, from Captain America: The First Avenger",
        notes: "A defiant statement in the face of overwhelming odds."
    },
    {
        id: 143,
        quote: "SIX SEASONS AND A MOVIE",
        title: "The Community Rallying Cry",
        source: "Abed Nadir, from Community (Dan Harmon)",
        notes: "A meta-joke from a TV show that became a fan campaign."
    },
    {
        id: 162,
        quote: "NOBODY PUTS BABY IN A CORNER",
        title: "The Final Dance",
        source: "Johnny Castle, from Dirty Dancing",
        notes: "A defiant declaration before the triumphant final dance number."
    },
    {
        id: 172,
        quote: "DO IT LADY",
        title: "The Simple Command",
        source: "Jay Renshaw (Chit)",
        notes: "A catchphrase from the 'Chit' sketch series on TikTok and YouTube."
    },
    {
        id: 153,
        quote: "ITS THE FOR ME",
        title: "The Defining Detail",
        source: "Modern Slang",
        notes: "A phrasal template used to point out a specific, noteworthy detail about something or someone."
    },
    {
        id: 109,
        quote: "KEEP THE CHANGE YA FILTHY ANIMAL",
        title: "The Movie Quote Prank",
        source: "Johnny, from Angels with Filthy Souls (in Home Alone)",
        notes: "A line from a fictional gangster movie used to scare off a pizza boy."
    },
    {
        id: 113,
        quote: "IVE MADE A HUGE MISTAKE",
        title: "The Magician's Regret",
        source: "G.O.B. Bluth, from Arrested Development (Mitchell Hurwitz)",
        notes: "The recurring realization of a man known for his grand illusions."
    },
    {
        id: 132,
        quote: "OKAY LETS GO",
        title: "The Enthusiastic Start",
        source: "TikTok Sound",
        notes: "A viral sound from a popular creator used to kick off an activity."
    },
    {
        id: 116,
        quote: "SOMEBODY ONCE TOLD ME THE WORLD IS GONNA ROLL ME",
        title: "The Ogre's Anthem",
        source: "Smash Mouth (song)",
        notes: "The opening line of a song that became the theme for a green ogre."
    },
    {
        id: 101,
        quote: "YESTERDAY ALL MY TROUBLES SEEMED SO FAR AWAY",
        title: "The Ballad of Nostalgia",
        source: "The Beatles (song)",
        notes: "The beginning of a timeless ballad about longing for the past."
    },
    {
        id: 15,
        quote: "YOU CANT HANDLE THE TRUTH",
        title: "The Courtroom Confession",
        source: "Col. Nathan R. Jessep, from A Few Good Men (Aaron Sorkin)",
        notes: "A shouted declaration from a high-ranking military officer on trial."
    },
    {
        id: 122,
        quote: "BOMBASTIC SIDE EYE",
        title: "The Side Eye",
        source: "TikTok Trend",
        notes: "A popular sound used to express judgment or disapproval."
    },
    {
        id: 144,
        quote: "A LONG TIME AGO WE USED TO BE FRIENDS",
        title: "The Veronica Mars Theme",
        source: "The Dandy Warhols (song)",
        notes: "The opening line of the theme song for a teen noir detective series."
    },
    {
        id: 169,
        quote: "ITS A DANGEROUS BUSINESS FRODO GOING OUT YOUR DOOR",
        title: "The First Step of Adventure",
        source: "Bilbo Baggins, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "A hobbit's warning about the unpredictable nature of adventure."
    },
    {
        id: 147,
        quote: "HERES JOHNNY",
        title: "The Shining Breakdown",
        source: "Jack Torrance, from The Shining (Stephen King)",
        notes: "A chilling ad-libbed line from a classic horror movie."
    },
    {
        id: 157,
        quote: "MY NAME IS INIGO MONTOYA YOU KILLED MY FATHER PREPARE TO DIE",
        title: "The Duelist's Vow",
        source: "Inigo Montoya, from The Princess Bride",
        notes: "The iconic, oft-repeated line from a swordsman seeking revenge."
    },
    {
        id: 131,
        quote: "THEY DID SURGERY ON A GRAPE",
        title: "The Grape Surgery",
        source: "Internet Meme",
        notes: "A meme celebrating a feat of incredible precision and technology."
    },
    {
        id: 16,
        quote: "I SEE DEAD PEOPLE",
        title: "The Sixth Sense",
        source: "Cole Sear, from The Sixth Sense (M. Night Shyamalan)",
        notes: "A whispered secret from a boy with a supernatural ability."
    },
    
    {
        id: 114,
        quote: "CHANGE MY MIND",
        title: "The Debate Challenge",
        source: "Steven Crowder (internet meme)",
        notes: "A meme format inviting people to challenge a stated opinion."
    },
    {
        id: 14,
        quote: "WHY SO SERIOUS",
        title: "The Agent of Chaos",
        source: "The Joker, from The Dark Knight (Christopher Nolan)",
        notes: "A chilling question posed by a classic comic book villain."
    },
    {
        id: 106,
        quote: "IM THE KING OF THE WORLD",
        title: "The Titanic Proclamation",
        source: "Jack Dawson, from Titanic (James Cameron)",
        notes: "An exuberant shout from the bow of a famously ill-fated ship."
    },
    {
        id: 173,
        quote: "WELL BACK TO IT THEN",
        title: "The Return to Work",
        source: "Jay Renshaw (Chit)",
        notes: "A catchphrase from the 'Chit' sketch series on TikTok and YouTube."
    },
    {
        id: 142,
        quote: "I AIM TO MISBEHAVE",
        title: "The Smuggler's Creed",
        source: "Mal Reynolds, from Serenity (Joss Whedon)",
        notes: "A declaration of rebellious intent from the captain of a Firefly-class ship."
    },
    {
        id: 107,
        quote: "YOURE GONNA NEED A BIGGER BOAT",
        title: "The Underestimation",
        source: "Chief Brody, from Jaws",
        notes: "A classic line delivered after seeing the size of a great white shark."
    },
    {
        id: 150,
        quote: "NO CAP",
        title: "The Honest Truth",
        source: "Modern Slang",
        notes: "A phrase used to emphasize that one is not lying or exaggerating."
    },
    {
        id: 129,
        quote: "I AM A SURGEON",
        title: "The Surgeon's Declaration",
        source: "Dr. Shaun Murphy, from The Good Doctor",
        notes: "A clip from a medical drama used to show expertise or frustration."
    },
    {
        id: 125,
        quote: "ITS GIVING MAIN CHARACTER ENERGY",
        title: "The Vibe Check",
        source: "TikTok Slang",
        notes: "A popular phrase used to describe someone who seems like the protagonist."
    },
    
    {
        id: 165,
        quote: "EVEN THE SMALLEST PERSON CAN CHANGE THE COURSE OF THE FUTURE",
        title: "The Power of the Small",
        source: "Galadriel, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "A reminder that great deeds can be done by the most unlikely of heroes."
    },
    {
        id: 12,
        quote: "HOUSTON WE HAVE A PROBLEM",
        title: "The Understated Crisis",
        source: "Jim Lovell, from Apollo 13",
        notes: "A calm report of a major issue during a space mission."
    },
    {
        id: 160,
        quote: "THATS WHAT SHE SAID",
        title: "The Office Gag",
        source: "Michael Scott, from The Office",
        notes: "A juvenile joke used to add unintended innuendo to innocent phrases."
    },
    {
        id: 159,
        quote: "LIFE IS LIKE A BOX OF CHOCOLATES YOU NEVER KNOW WHAT YOURE GONNA GET",
        title: "The Gumpism",
        source: "Forrest Gump, from Forrest Gump",
        notes: "A simple philosophy on the unpredictability of life."
    },
    {
        id: 133,
        quote: "YOU THINK YOU JUST FELL OUT OF A COCONUT TREE",
        title: "The Coconut Tree",
        source: "Kamala Harris (viral sound)",
        notes: "A bizarre and memorable question from a politician that became a viral sound."
    },
    {
        id: 145,
        quote: "I WANT TO BELIEVE",
        title: "The X-Files Poster",
        source: "The X-Files (Chris Carter)",
        notes: "The iconic phrase from a poster in Fox Mulder's office."
    },
    {
        id: 164,
        quote: "WIBBLY WOBBLY TIMEY WIMEY STUFF",
        title: "The Doctor's Explanation",
        source: "The Tenth Doctor, from Doctor Who",
        notes: "A non-technical explanation for the complex nature of time travel."
    },
    
    {
        id: 123,
        quote: "DELULU IS THE SOLULU",
        title: "The Solution",
        source: "TikTok Slang",
        notes: "A viral phrase suggesting that being delusional is the solution."
    },
    {
        id: 135,
        quote: "GOOD SOUP",
        title: "The Soup Review",
        source: "Adam Sackler, from Girls (Lena Dunham)",
        notes: "A simple, satisfying line from a TV show that became a sound for anything good."
    },
    {
        id: 108,
        quote: "SAY HELLO TO MY LITTLE FRIEND",
        title: "The Aggressive Introduction",
        source: "Tony Montana, from Scarface",
        notes: "A gangster's famous last stand introduction to his firearm."
    },
    {
        id: 140,
        quote: "I AM IRON MAN",
        title: "The Hero's Identity",
        source: "Tony Stark, from Iron Man",
        notes: "The public declaration that launched a cinematic universe."
    },
    {
        id: 158,
        quote: "INCONCEIVABLE",
        title: "The Word That Means Nothing",
        source: "Vizzini, from The Princess Bride",
        notes: "A word repeatedly used by a character who may not know what it means."
    },
    {
        id: 149,
        quote: "WE HAVE DONE THE IMPOSSIBLE AND THAT MAKES US MIGHTY",
        title: "The Serenity Crew's Motto",
        source: "Mal Reynolds, from Serenity (Joss Whedon)",
        notes: "A line from Captain Mal Reynolds celebrating his crew's accomplishments."
    },
    {
        id: 128,
        quote: "OH NO OUR TABLE ITS BROKEN",
        title: "The Broken Table",
        source: "America's Funniest Home Videos (viral sound)",
        notes: "A viral sound from a home video used to express dismay."
    },
    {
        id: 118,
        quote: "WHO LET THE DOGS OUT",
        title: "The Unanswered Question",
        source: "Baha Men (song)",
        notes: "The catchy, repetitive question from a memorable early 2000s hit."
    },
    {
        id: 105,
        quote: "I GET KNOCKED DOWN BUT I GET UP AGAIN",
        title: "The Song of Resilience",
        source: "Chumbawamba (song)",
        notes: "The defiant chorus of an unforgettable one-hit wonder."
    },
    {
        id: 136,
        quote: "THE NEEDS OF THE MANY OUTWEIGH THE NEEDS OF THE FEW",
        title: "The Vulcan Philosophy",
        source: "Spock, from Star Trek II: The Wrath of Khan",
        notes: "A core principle of Vulcan logic, famously spoken by Spock."
    },
    {
        id: 115,
        quote: "SURPRISED PIKACHU",
        title: "Feigned Shock",
        source: "Pokémon (anime)",
        notes: "A meme used to express shock at a completely predictable outcome."
    },
    {
        id: 130,
        quote: "HE LOOKED AT ME AND I LOOKED AT HIM",
        title: "The Stare Down",
        source: "TikTok Sound",
        notes: "A viral sound describing a moment of intense, unspoken communication."
    },
    {
        id: 146,
        quote: "IN SPACE NO ONE CAN HEAR YOU SCREAM",
        title: "The Alien Tagline",
        source: "Alien (Ridley Scott)",
        notes: "The terrifying tagline from a classic 1979 sci-fi horror film."
    },
    {
        id: 102,
        quote: "I SEE A RED DOOR AND I WANT IT PAINTED BLACK",
        title: "The Color of Grief",
        source: "The Rolling Stones (song)",
        notes: "A line from a rock song expressing a desire to erase color and joy."
    },
    {
        id: 120,
        quote: "ITS CORN A BIG LUMP WITH KNOBS",
        title: "The Corn Kid",
        source: "Tariq (viral video)",
        notes: "An interview with a child expressing his deep love for corn."
    },
    {
        id: 124,
        quote: "LET HIM COOK",
        title: "The Chef's Kiss",
        source: "Internet Slang",
        notes: "A meme phrase used to tell people to let someone continue what they're doing well."
    },
    {
        id: 117,
        quote: "ITS THE EYE OF THE TIGER ITS THE THRILL OF THE FIGHT",
        title: "The Training Montage",
        source: "Survivor (song)",
        notes: "The iconic chorus of a song about rising up to a challenge."
    },
    {
        id: 163,
        quote: "ON WEDNESDAYS WE WEAR PINK",
        title: "The Plastics' Rule",
        source: "Karen Smith, from Mean Girls",
        notes: "One of the strict, arbitrary rules of a popular high school clique."
    },
    {
        id: 137,
        quote: "MAKE IT SO",
        title: "The Captain's Command",
        source: "Captain Picard, from Star Trek: The Next Generation",
        notes: "The signature command of Captain Jean-Luc Picard."
    },
    {
        id: 156,
        quote: "THE RIZZ",
        title: "The Unspoken Charisma",
        source: "Gen Z Slang",
        notes: "A term for skill in charming or seducing a potential romantic partner, short for charisma."
    },
    {
        id: 171,
        quote: "THE WORLD IS INDEED FULL OF PERIL AND IN IT THERE ARE MANY DARK PLACES BUT STILL THERE IS MUCH THAT IS FAIR",
        title: "A Glimmer of Hope",
        source: "Haldir, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "An elf's balanced perspective on the state of the world."
    },
    {
        id: 168,
        quote: "DEEDS WILL NOT BE LESS VALIANT BECAUSE THEY ARE UNSUNG",
        title: "The Unsung Hero",
        source: "Aragorn, from The Return of the King (J.R.R. Tolkien)",
        notes: "A king's reflection on the nature of quiet, uncelebrated bravery."
    },
    {
        id: 170,
        quote: "I DONT KNOW HALF OF YOU HALF AS WELL AS I SHOULD LIKE AND I LIKE LESS THAN HALF OF YOU HALF AS WELL AS YOU DESERVE",
        title: "The Farewell Speech",
        source: "Bilbo Baggins, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "A famously confusing and insulting line from a hobbit's birthday speech."
    },
    {
        id: 103,
        quote: "HELLO IS IT ME YOURE LOOKING FOR",
        title: "The Hopeful Question",
        source: "Lionel Richie (song)",
        notes: "The opening of a famous love song from the eighties."
    },
    {
        id: 166,
        quote: "I WOULD RATHER SHARE ONE LIFETIME WITH YOU THAN FACE ALL THE AGES OF THIS WORLD ALONE",
        title: "Arwen's Choice",
        source: "Arwen, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "An elf's declaration of love and her choice of mortality."
    },
    {
        id: 127,
        quote: "CHRISSY WAKE UP I DONT LIKE THIS",
        title: "The Upside Down",
        source: "Eddie Munson, from Stranger Things (The Duffer Brothers)",
        notes: "A line from a popular sci-fi show that was remixed into a viral song."
    },
    {
        id: 155,
        quote: "GHOSTING",
        title: "The Sudden Disappearance",
        source: "Modern Dating Slang",
        notes: "The act of suddenly ending all communication with someone without explanation."
    },
    {
        id: 138,
        quote: "YOU SHALL NOT PASS",
        title: "The Bridge Stand",
        source: "Gandalf, from The Lord of the Rings (J.R.R. Tolkien)",
        notes: "A wizard's powerful declaration against a fiery demon."
    },
    {
        id: 2,
        quote: "TO BE OR NOT TO BE THAT IS THE QUESTION",
        title: "The Existential Dilemma",
        source: "Hamlet, from Hamlet (William Shakespeare)",
        notes: "From a famous soliloquy about life and death."
    },
    {
        id: 3,
        quote: "I THINK THEREFORE I AM",
        title: "The Foundation of Thought",
        source: "René Descartes",
        notes: "A philosophical proposition regarding existence."
    },
    {
        id: 4,
        quote: "ALL THE WORLD IS A STAGE",
        title: "Life's Grand Performance",
        source: "Jaques, from As You Like It (William Shakespeare)",
        notes: "A quote comparing human life to a theatrical play."
    },
    {
        id: 5,
        quote: "THE TRUTH IS OUT THERE",
        title: "The Unseen Reality",
        source: "The X-Files (Chris Carter)",
        notes: "The tagline from a popular show about paranormal investigations."
    },
    {
        id: 6,
        quote: "MAY THE FORCE BE WITH YOU",
        title: "The Cosmic Blessing",
        source: "Various Characters, from Star Wars (George Lucas)",
        notes: "A familiar farewell from a science fantasy epic."
    },
    {
        id: 7,
        quote: "LIVE LONG AND PROSPER",
        title: "The Vulcan Farewell",
        source: "Spock, from Star Trek (Gene Roddenberry)",
        notes: "A blessing from a logical alien race."
    },
    {
        id: 8,
        quote: "IT WAS THE BEST OF TIMES IT WAS THE WORST OF TIMES",
        title: "A Tale of Two Eras",
        source: "A Tale of Two Cities (Charles Dickens)",
        notes: "The opening of a historical novel about a revolution."
    },
    {
        id: 9,
        quote: "I AM YOUR FATHER",
        title: "A Shocking Revelation",
        source: "Darth Vader, from Star Wars: The Empire Strikes Back",
        notes: "A famous, often misquoted, line from a space opera sequel."
    },
    {
        id: 18,
        quote: "WAX ON WAX OFF",
        title: "The Art of Defense",
        source: "Mr. Miyagi, from The Karate Kid",
        notes: "A simple instruction that teaches a powerful lesson in martial arts."
    },
    {
        id: 19,
        quote: "IT IS A TRUTH UNIVERSALLY ACKNOWLEDGED",
        title: "The Opening Gambit",
        source: "Pride and Prejudice (Jane Austen)",
        notes: "The famous first line of a classic romance novel."
    },
    {
        id: 20,
        quote: "THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF",
        title: "The Inaugural Address",
        source: "Franklin D. Roosevelt",
        notes: "A powerful statement made during a time of great national crisis."
    },
    {
        id: 21,
        quote: "ALL ANIMALS ARE EQUAL BUT SOME ARE MORE EQUAL THAN OTHERS",
        title: "The Farm's New Law",
        source: "Animal Farm (George Orwell)",
        notes: "A cynical revision of rules in a political allegory."
    },
    {
        id: 22,
        quote: "IT IS NOT IN THE STARS TO HOLD OUR DESTINY BUT IN OURSELVES",
        title: "The Power of Will",
        source: "Cassius, from Julius Caesar (William Shakespeare)",
        notes: "A declaration of free will from a famous playwright."
    },
    {
        id: 23,
        quote: "THE JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP",
        title: "The First Move",
        source: "Lao Tzu",
        notes: "An ancient proverb about the importance of starting."
    },
    {
        id: 24,
        quote: "NOT ALL THOSE WHO WANDER ARE LOST",
        title: "The Riddle of Strider",
        source: "Poem about Aragorn, from The Lord of the Rings (J.R.R. Tolkien)",
        notes: "A line from a poem about a hidden king in a fantasy epic."
    },
    {
        id: 25,
        quote: "SO WE BEAT ON BOATS AGAINST THE CURRENT BORNE BACK CEASELESSLY INTO THE PAST",
        title: "The Final Line",
        source: "Nick Carraway, from The Great Gatsby (F. Scott Fitzgerald)",
        notes: "The concluding thought of a novel about the American Dream."
    },
    {
        id: 26,
        quote: "STAY GOLD PONYBOY",
        title: "A Parting Word",
        source: "Johnny Cade, from The Outsiders (S.E. Hinton)",
        notes: "A final piece of advice given to a young greaser."
    },
    {
        id: 27,
        quote: "I HAVE A DREAM",
        title: "The March on Washington",
        source: "Martin Luther King Jr.",
        notes: "The cornerstone of a pivotal speech in the Civil Rights Movement."
    },
    {
        id: 28,
        quote: "GIVE ME LIBERTY OR GIVE ME DEATH",
        title: "The Call to Revolution",
        source: "Patrick Henry",
        notes: "A fiery declaration from a founding father of the United States."
    },
    {
        id: 29,
        quote: "THE UNEXAMINED LIFE IS NOT WORTH LIVING",
        title: "Socratic Wisdom",
        source: "Socrates",
        notes: "A philosopher's defense of his life's work of questioning everything."
    },
    {
        id: 30,
        quote: "KNOWLEDGE IS POWER",
        title: "The Power of Knowing",
        source: "Sir Francis Bacon",
        notes: "A famous aphorism asserting the value of information."
    },
    {
        id: 31,
        quote: "THAT IS ONE SMALL STEP FOR A MAN ONE GIANT LEAP FOR MANKIND",
        title: "The Moon Landing",
        source: "Neil Armstrong",
        notes: "The first words spoken by a human on the lunar surface."
    },
    {
        id: 32,
        quote: "VENI VIDI VICI",
        title: "The Swift Victory",
        source: "Julius Caesar",
        notes: "Latin for 'I came, I saw, I conquered', a report of a quick war."
    },
    {
        id: 33,
        quote: "THE END JUSTIFIES THE MEANS",
        title: "A Machiavellian Idea",
        source: "Niccolò Machiavelli (attributed)",
        notes: "A controversial statement about outcomes versus methods."
    },
    {
        id: 34,
        quote: "IF I HAVE SEEN FURTHER IT IS BY STANDING ON THE SHOULDERS OF GIANTS",
        title: "A Humble Acknowledgment",
        source: "Isaac Newton",
        notes: "A famous scientist's recognition of his predecessors."
    },
    {
        id: 35,
        quote: "EUREKA",
        title: "The Bath Time Discovery",
        source: "Archimedes",
        notes: "A cry of discovery related to measuring volume and buoyancy."
    },
    {
        id: 36,
        quote: "THE IMPORTANT THING IS NOT TO STOP QUESTIONING",
        title: "The Mind of a Genius",
        source: "Albert Einstein",
        notes: "A quote about curiosity from the world's most famous physicist."
    },
    {
        id: 37,
        quote: "WHAT HATH GOD WROUGHT",
        title: "The First Telegram",
        source: "Samuel Morse",
        notes: "The first message sent over a long-distance telegraph line."
    },
    {
        id: 38,
        quote: "THE UNIVERSE IS UNDER NO OBLIGATION TO MAKE SENSE TO YOU",
        title: "Cosmic Indifference",
        source: "Neil deGrasse Tyson",
        notes: "A reminder from an astrophysicist about the nature of reality."
    },
    {
        id: 39,
        quote: "ACTIONS SPEAK LOUDER THAN WORDS",
        title: "The Proof of Intent",
        source: "Traditional Proverb",
        notes: "A proverb about the importance of doing over saying."
    },
    {
        id: 40,
        quote: "A PENNY SAVED IS A PENNY EARNED",
        title: "The Frugal Mindset",
        source: "Benjamin Franklin (popularized)",
        notes: "A classic saying about the value of saving money."
    },
    {
        id: 41,
        quote: "TWO HEADS ARE BETTER THAN ONE",
        title: "The Value of Teamwork",
        source: "Traditional Proverb",
        notes: "A proverb promoting collaboration to solve problems."
    },
    {
        id: 42,
        quote: "THE EARLY BIRD CATCHES THE WORM",
        title: "The Reward for Punctuality",
        source: "Traditional Proverb",
        notes: "A saying that encourages starting early to achieve success."
    },
    {
        id: 43,
        quote: "WHERE THERES A WILL THERES A WAY",
        title: "The Power of Determination",
        source: "Traditional Proverb",
        notes: "A proverb about how resolve can overcome any obstacle."
    },
    {
        id: 44,
        quote: "FORTUNE FAVORS THE BOLD",
        title: "The Reward for Bravery",
        source: "Latin Proverb",
        notes: "A saying suggesting that courage brings good luck."
    },
    
    
    
    {
        id: 48,
        quote: "THE CAKE IS A LIE",
        title: "A False Promise",
        source: "GLaDOS, from Portal (Valve)",
        notes: "A famous phrase from a puzzle-based video game suggesting deception."
    },
    {
        id: 49,
        quote: "ITS A ME MARIO",
        title: "The Plumber's Greeting",
        source: "Mario, from Super Mario 64",
        notes: "The signature catchphrase of a beloved video game hero."
    },
    {
        id: 50,
        quote: "STAY AWHILE AND LISTEN",
        title: "The Storyteller's Invitation",
        source: "Deckard Cain, from Diablo",
        notes: "An iconic line from a wise character in a dark fantasy game."
    },
    {
        id: 51,
        quote: "WAR WAR NEVER CHANGES",
        title: "The Post-Apocalyptic Truth",
        source: "Narrator, from Fallout",
        notes: "The recurring opening line from a series of role-playing games."
    },
    {
        id: 52,
        quote: "DO A BARREL ROLL",
        title: "The Pilot's Command",
        source: "Peppy Hare, from Star Fox 64",
        notes: "A memorable instruction from an ace pilot in a space shooter game."
    },
    {
        id: 53,
        quote: "ITS DANGEROUS TO GO ALONE TAKE THIS",
        title: "The Hero's First Gift",
        source: "Old Man, from The Legend of Zelda",
        notes: "Words of caution at the beginning of a legendary adventure."
    },
    {
        id: 54,
        quote: "FINISH HIM",
        title: "The Announcer's Decree",
        source: "Announcer, from Mortal Kombat",
        notes: "A famous command from a fighting game urging a final move."
    },
    {
        id: 55,
        quote: "EVERY ARTIST WAS FIRST AN AMATEUR",
        title: "The Humble Beginning",
        source: "Ralph Waldo Emerson",
        notes: "A quote reminding us that all experts start as beginners."
    },
    {
        id: 56,
        quote: "ART WASHES AWAY FROM THE SOUL THE DUST OF EVERYDAY LIFE",
        title: "The Purpose of Art",
        source: "Pablo Picasso",
        notes: "A famous painter's view on the cleansing power of creativity."
    },
    {
        id: 57,
        quote: "I DREAM MY PAINTING AND I PAINT MY DREAM",
        title: "The Artist's Vision",
        source: "Vincent van Gogh",
        notes: "A quote from a post-impressionist painter on his creative process."
    },
    {
        id: 58,
        quote: "MUSIC CAN CHANGE THE WORLD",
        title: "The Power of Song",
        source: "Ludwig van Beethoven",
        notes: "A belief in the transformative power of music."
    },
    {
        id: 59,
        quote: "WITHOUT MUSIC LIFE WOULD BE A MISTAKE",
        title: "The Philosopher's Anthem",
        source: "Friedrich Nietzsche",
        notes: "A strong statement on the necessity of music from a German philosopher."
    },
    {
        id: 60,
        quote: "WHERE WORDS FAIL MUSIC SPEAKS",
        title: "The Universal Language",
        source: "Hans Christian Andersen",
        notes: "A quote about music's ability to convey what words cannot."
    },
    {
        id: 61,
        quote: "SOMEWHERE SOMETHING INCREDIBLE IS WAITING TO BE KNOWN",
        title: "The Cosmic Search",
        source: "Carl Sagan",
        notes: "A quote from an astronomer about the endless possibilities of discovery."
    },
    {
        id: 62,
        quote: "SCIENCE IS A WAY OF THINKING MUCH MORE THAN IT IS A BODY OF KNOWLEDGE",
        title: "The Scientific Method",
        source: "Carl Sagan",
        notes: "A definition of science that emphasizes process over facts."
    },
    {
        id: 63,
        quote: "THE GOOD THING ABOUT SCIENCE IS THAT ITS TRUE WHETHER OR NOT YOU BELIEVE IN IT",
        title: "Objective Reality",
        source: "Neil deGrasse Tyson",
        notes: "A scientist's take on the factual nature of scientific truth."
    },
    {
        id: 64,
        quote: "WE ARE ALL MADE OF STAR STUFF",
        title: "Our Cosmic Origin",
        source: "Carl Sagan",
        notes: "A line explaining that the elements of our bodies were forged in stars."
    },
    {
        id: 65,
        quote: "NOTHING IN LIFE IS TO BE FEARED IT IS ONLY TO BE UNDERSTOOD",
        title: "The Cure for Fear",
        source: "Marie Curie",
        notes: "A quote from a pioneering physicist and chemist about knowledge."
    },
    {
        id: 66,
        quote: "ABSENCE OF EVIDENCE IS NOT EVIDENCE OF ABSENCE",
        title: "A Logical Principle",
        source: "Carl Sagan",
        notes: "A reminder that we cannot conclude something doesn't exist just because we haven't found it."
    },
    {
        id: 67,
        quote: "IT WAS A BRIGHT COLD DAY IN APRIL AND THE CLOCKS WERE STRIKING THIRTEEN",
        title: "An Unsettling Start",
        source: "1984 (George Orwell)",
        notes: "The opening line of a classic dystopian novel."
    },
    {
        id: 68,
        quote: "CALL ME ISHMAEL",
        title: "A Simple Introduction",
        source: "Ishmael, from Moby Dick (Herman Melville)",
        notes: "One of the most famous opening lines in all of literature."
    },
    {
        id: 69,
        quote: "THE MAN IN BLACK FLED ACROSS THE DESERT AND THE GUNSLINGER FOLLOWED",
        title: "The Eternal Chase",
        source: "The Gunslinger (Stephen King)",
        notes: "The epic first sentence of a dark fantasy series."
    },
    {
        id: 70,
        quote: "ALL HAPPY FAMILIES ARE ALIKE EACH UNHAPPY FAMILY IS UNHAPPY IN ITS OWN WAY",
        title: "The Anna Karenina Principle",
        source: "Anna Karenina (Leo Tolstoy)",
        notes: "The opening of a tragic novel about society and love."
    },
    {
        id: 71,
        quote: "IT IS A FAR FAR BETTER THING THAT I DO THAN I HAVE EVER DONE",
        title: "The Ultimate Sacrifice",
        source: "Sydney Carton, from A Tale of Two Cities (Charles Dickens)",
        notes: "The final thoughts of a character making a noble sacrifice."
    },
    {
        id: 72,
        quote: "I AM NO BIRD AND NO NET ENSNARES ME",
        title: "A Declaration of Independence",
        source: "Jane Eyre, from Jane Eyre (Charlotte Brontë)",
        notes: "A governess's powerful statement of her own free will."
    },
    {
        id: 73,
        quote: "BEWARE FOR I AM FEARLESS AND THEREFORE POWERFUL",
        title: "The Creature's Warning",
        source: "The Creature, from Frankenstein (Mary Shelley)",
        notes: "A warning from a misunderstood creation in a gothic novel."
    },
    {
        id: 74,
        quote: "ASK NOT WHAT YOUR COUNTRY CAN DO FOR YOU ASK WHAT YOU CAN DO FOR YOUR COUNTRY",
        title: "A Call to Civic Action",
        source: "John F. Kennedy",
        notes: "A famous line from a US presidential inaugural address."
    },
    {
        id: 75,
        quote: "THOSE WHO CANNOT REMEMBER THE PAST ARE CONDEMNED TO REPEAT IT",
        title: "The Lesson of History",
        source: "George Santayana",
        notes: "A philosopher's warning about the importance of historical knowledge."
    },
    {
        id: 76,
        quote: "MR GORBACHEV TEAR DOWN THIS WALL",
        title: "The Challenge at the Gate",
        source: "Ronald Reagan",
        notes: "A direct challenge issued by a US president at the Brandenburg Gate."
    },
    {
        id: 77,
        quote: "WE HOLD THESE TRUTHS TO BE SELF EVIDENT THAT ALL MEN ARE CREATED EQUAL",
        title: "The Declaration's Core",
        source: "The US Declaration of Independence",
        notes: "The foundational phrase of a historic document."
    },
    {
        id: 78,
        quote: "THE BUCK STOPS HERE",
        title: "The Weight of Command",
        source: "Harry S. Truman",
        notes: "A US president's motto signifying ultimate responsibility."
    },
    {
        id: 79,
        quote: "SPEAK SOFTLY AND CARRY A BIG STICK",
        title: "The Roosevelt Corollary",
        source: "Theodore Roosevelt",
        notes: "A US president's philosophy on foreign policy."
    },
    {
        id: 80,
        quote: "A WATCHED POT NEVER BOILS",
        title: "The Paradox of Patience",
        source: "Traditional Proverb",
        notes: "A saying about how time seems to slow down when you're waiting."
    },
    {
        id: 81,
        quote: "DONT COUNT YOUR CHICKENS BEFORE THEY HATCH",
        title: "A Warning Against Hubris",
        source: "Traditional Proverb",
        notes: "A proverb advising not to celebrate an outcome before it's certain."
    },
    {
        id: 82,
        quote: "IF IT AINT BROKE DONT FIX IT",
        title: "The Pragmatist's Creed",
        source: "Traditional Proverb",
        notes: "A saying that cautions against unnecessary changes."
    },
    {
        id: 83,
        quote: "PEOPLE WHO LIVE IN GLASS HOUSES SHOULD NOT THROW STONES",
        title: "The Hypocrite's Folly",
        source: "Traditional Proverb",
        notes: "A warning not to criticize others for faults you also possess."
    },
    {
        id: 84,
        quote: "THE PEN IS MIGHTIER THAN THE SWORD",
        title: "The Power of Words",
        source: "Edward Bulwer-Lytton",
        notes: "A proverb celebrating the influence of writing over violence."
    },
    {
        id: 85,
        quote: "YOU CAN LEAD A HORSE TO WATER BUT YOU CANT MAKE IT DRINK",
        title: "The Limits of Influence",
        source: "Traditional Proverb",
        notes: "A saying about how you can't force someone to accept help."
    },
    {
        id: 86,
        quote: "I AM THE ONE WHO KNOCKS",
        title: "The Danger",
        source: "Walter White, from Breaking Bad (Vince Gilligan)",
        notes: "A chilling declaration of power from a high school chemistry teacher."
    },
    {
        id: 87,
        quote: "WINTER IS COMING",
        title: "The House Motto",
        source: "House Stark Motto, from Game of Thrones (George R.R. Martin)",
        notes: "The ominous words of a noble family in a fantasy epic."
    },
    {
        id: 88,
        quote: "HOW YOU DOIN",
        title: "The Pick-Up Line",
        source: "Joey Tribbiani, from Friends",
        notes: "The signature catchphrase of a charming, food-loving friend."
    },
    {
        id: 89,
        quote: "BAZINGA",
        title: "The Gotcha Moment",
        source: "Sheldon Cooper, from The Big Bang Theory",
        notes: "A physicist's triumphant exclamation after a practical joke."
    },
    {
        id: 90,
        quote: "ILL BE BACK",
        title: "The Cyborg's Promise",
        source: "The Terminator, from The Terminator (James Cameron)",
        notes: "A simple but menacing promise from a futuristic assassin."
    },
    {
        id: 91,
        quote: "MY PRECIOUS",
        title: "The Ring's Obsession",
        source: "Gollum, from The Lord of the Rings (J.R.R. Tolkien)",
        notes: "The desperate whisper of a creature corrupted by a powerful ring."
    },
    {
        id: 92,
        quote: "I VOLUNTEER AS TRIBUTE",
        title: "The Ultimate Sacrifice",
        source: "Katniss Everdeen, from The Hunger Games (Suzanne Collins)",
        notes: "A sister's selfless act to save her younger sibling from a deadly game."
    },
    {
        id: 93,
        quote: "AVENGERS ASSEMBLE",
        title: "The Final Battle Cry",
        source: "Captain America, from Avengers: Endgame",
        notes: "The long-awaited command to a team of Earth's mightiest heroes."
    },
    {
        id: 94,
        quote: "ONE DOES NOT SIMPLY WALK INTO MORDOR",
        title: "The Council's Warning",
        source: "Boromir, from The Lord of the Rings (J.R.R. Tolkien)",
        notes: "A statement of caution that became a legendary internet meme."
    },
    {
        id: 95,
        quote: "THIS IS FINE",
        title: "The Denial",
        source: "KC Green, Gunshow (webcomic)",
        notes: "A meme featuring a dog in a burning room, representing calm acceptance of chaos."
    },
    {
        id: 96,
        quote: "I TOOK AN ARROW IN THE KNEE",
        title: "The Guard's Lament",
        source: "Town Guard, from The Elder Scrolls V: Skyrim",
        notes: "A phrase from a video game used to explain an early retirement from adventuring."
    },
    {
        id: 97,
        quote: "IS THIS A PIGEON",
        title: "The Misidentification",
        source: "The Brave Fighter of Sun Fighbird (anime)",
        notes: "A meme from an anime showing a character mistaking a butterfly."
    },
    {
        id: 98,
        quote: "NEVER GONNA GIVE YOU UP",
        title: "The Ultimate Prank",
        source: "Rick Astley (song)",
        notes: "The first line of a song used in a classic bait-and-switch internet meme."
    },
    {
        id: 99,
        quote: "MUCH WOW VERY AMAZE",
        title: "The Doge's Thoughts",
        source: "Doge (internet meme)",
        notes: "The internal monologue of a Shiba Inu, written in broken English."
    },
    {
        id: 100,
        quote: "IS THIS THE REAL LIFE IS THIS JUST FANTASY",
        title: "The Bohemian Rhapsody",
        source: "Queen (song)",
        notes: "The opening lines of a legendary and theatrical rock opera."
    },
    {
        id: 112,
        quote: "TREAT YO SELF",
        title: "The Day of Indulgence",
        source: "Tom & Donna, from Parks and Recreation",
        notes: "The motto for an annual day of extreme self-pampering."
    },
    {
        id: 141,
        quote: "IM BATMAN",
        title: "The Dark Knight's Introduction",
        source: "Batman, from Batman (Tim Burton)",
        notes: "The simple, intimidating introduction of Gotham's protector."
    },
    {
        id: 110,
        quote: "WITH GREAT POWER COMES GREAT RESPONSIBILITY",
        title: "The Hero's Code",
        source: "Uncle Ben, from Spider-Man (Stan Lee)",
        notes: "A wise uncle's final advice to his super-powered nephew."
    },
    {
        id: 126,
        quote: "HOW OFTEN DO YOU THINK ABOUT THE ROMAN EMPIRE",
        title: "The Ancient Question",
        source: "TikTok Trend",
        notes: "A viral trend where people asked the men in their lives this specific question."
    },
    {
        id: 167,
        quote: "FAITHLESS IS HE THAT SAYS FAREWELL WHEN THE ROAD DARKENS",
        title: "The Dwarf's Loyalty",
        source: "Gimli, from The Fellowship of the Ring (J.R.R. Tolkien)",
        notes: "A statement of loyalty and commitment in the face of danger."
    },
    {
        id: 134,
        quote: "I LIKE TO SEE YOU WIGGLE WIGGLE",
        title: "The Wiggle Wiggle",
        source: "Louis Theroux (viral sound)",
        notes: "A lyric from the 'Jiggle Jiggle' rap that became its own trend."
    },
    {
        id: 161,
        quote: "HERES LOOKING AT YOU KID",
        title: "The Casablanca Toast",
        source: "Rick Blaine, from Casablanca",
        notes: "An iconic, affectionate toast from a classic film noir."
    },
    {
        id: 111,
        quote: "NO SOUP FOR YOU",
        title: "The Strict Chef",
        source: "The Soup Nazi, from Seinfeld (Larry David)",
        notes: "The harsh verdict from a famously temperamental soup vendor."
    },
    {
        id: 174,
        quote: "DONT STOP BELIEVIN HOLD ON TO THAT FEELIN",
        title: "The Arena Rock Anthem",
        source: "Journey (song)",
        notes: "An iconic chorus known for its uplifting message and piano riff."
    },
    {
        id: 175,
        quote: "I WILL SURVIVE",
        title: "The Disco Declaration",
        source: "Gloria Gaynor (song)",
        notes: "A powerful anthem of personal strength and resilience after a breakup."
    },
    {
        id: 176,
        quote: "THUNDERBOLT AND LIGHTNING VERY VERY FRIGHTENING ME",
        title: "The Galileo Figaro",
        source: "Queen (song)",
        notes: "A memorable, high-pitched line from the operatic section of a rock classic."
    },
    {
        id: 178,
        quote: "THE REPORTS OF MY DEATH ARE GREATLY EXAGGERATED",
        title: "The Premature Obituary",
        source: "Mark Twain",
        notes: "A famous, and slightly misquoted, response to a newspaper's error."
    },
    {
        id: 179,
        quote: "GET YOUR FACTS FIRST THEN YOU CAN DISTORT THEM AS YOU PLEASE",
        title: "The Humorist's Method",
        source: "Mark Twain",
        notes: "A witty take on the importance of truth, even when you plan to bend it."
    },
    {
        id: 180,
        quote: "IF YOU DON'T STICK TO YOUR VALUES WHEN THEY'RE BEING TESTED THEY'RE NOT VALUES THEY'RE HOBBIES",
        title: "The Test of Conviction",
        source: "Jon Stewart",
        notes: "A satirical host's point about the nature of true principles."
    },
    {
        id: 182,
        quote: "HAVE YOU EVER NOTICED THAT ANYBODY DRIVING SLOWER THAN YOU IS AN IDIOT AND ANYONE GOING FASTER THAN YOU IS A MANIAC",
        title: "The Rules of the Road",
        source: "George Carlin",
        notes: "A classic observation on the self-centered perspective of every driver."
    },
    {
        id: 183,
        quote: "A HOUSE IS JUST A PLACE TO KEEP YOUR STUFF WHILE YOU GO OUT AND GET MORE STUFF",
        title: "The Philosophy of Stuff",
        source: "George Carlin",
        notes: "A comedian's cynical but accurate summary of consumer culture."
    },
    {
        id: 184,
        quote: "WHATS THE DEAL WITH AIRLINE FOOD",
        title: "The Quintessential Observation",
        source: "Jerry Seinfeld",
        notes: "The archetypal observational comedy setup, synonymous with the comedian himself."
    },
    {
        id: 185,
        quote: "I USED TO DO DRUGS I STILL DO BUT I USED TO TOO",
        title: "The One-Liner",
        source: "Mitch Hedberg",
        notes: "A perfect example of a comedian's unique, absurd, and grammatically brilliant humor."
    },
    {
        id: 186,
        quote: "YOURE ONLY GIVEN A LITTLE SPARK OF MADNESS YOU MUSTNT LOSE IT",
        title: "The Spark of Madness",
        source: "Robin Williams",
        notes: "A quote that reflects the beloved comedian's own brilliant and chaotic energy."
    },
    {
        id: 188,
        quote: "I AM SO CLEVER THAT SOMETIMES I DONT UNDERSTAND A SINGLE WORD OF WHAT I AM SAYING",
        title: "The Burden of Genius",
        source: "Oscar Wilde",
        notes: "A self-deprecating boast that perfectly captures the author's wit."
    },
    {
        id: 189,
        quote: "THE SHIPS HUNG IN THE SKY IN MUCH THE SAME WAY THAT BRICKS DONT",
        title: "The Art of Anti-Description",
        source: "Douglas Adams, from The Hitchhiker's Guide to the Galaxy",
        notes: "A famously unhelpful but hilarious description of alien spacecraft."
    },
    {
        id: 192,
        quote: "I'D RATHER HAVE A BOTTLE IN FRONT OF ME THAN A FRONTAL LOBOTOMY",
        title: "The Algonquin Round Table Wit",
        source: "Dorothy Parker",
        notes: "A classic example of the author's sharp, dark, and playful humor."
    },
    {
        id: 193,
        quote: "HE HAD THE LOOK OF ONE WHO HAD DRUNK THE CUP OF LIFE AND FOUND A DEAD BEETLE AT THE BOTTOM",
        title: "The Unfortunate Discovery",
        source: "P.G. Wodehouse",
        notes: "A masterful and humorous description of a man's utter disappointment."
    },
    {
        id: 194,
        quote: "NEVER HALF ASS TWO THINGS WHOLE ASS ONE THING",
        title: "The Swanson Pyramid of Greatness",
        source: "Ron Swanson, from Parks and Recreation",
        notes: "A core tenet from a libertarian's guide to life."
    },
    {
        id: 195,
        quote: "GIVE ME ALL THE BACON AND EGGS YOU HAVE",
        title: "The Diner Order",
        source: "Ron Swanson, from Parks and Recreation",
        notes: "A request that is not a question, but a statement of fact."
    },
    {
        id: 196,
        quote: "REALITY HAS A WELL KNOWN LIBERAL BIAS",
        title: "The Colbert Report Truth",
        source: "Stephen Colbert",
        notes: "A famous satirical line on the nature of facts and political spin."
    },
    {
        id: 197,
        quote: "I NEED MORE COWBELL",
        title: "The Producer's Demand",
        source: "Saturday Night Live",
        notes: "The only prescription for a rock song, according to producer Bruce Dickinson."
    },
    {
        id: 198,
        quote: "I LIVE IN A VAN DOWN BY THE RIVER",
        title: "The Motivational Speaker",
        source: "Matt Foley, from Saturday Night Live",
        notes: "The bleak residence of a highly unorthodox motivational speaker."
    },
    {
        id: 199,
        quote: "AND NOW FOR SOMETHING COMPLETELY DIFFERENT",
        title: "The Python Transition",
        source: "Monty Python's Flying Circus",
        notes: "The classic non-sequitur used to link unrelated comedy sketches."
    },
    {
        id: 200,
        quote: "NOBODY EXPECTS THE SPANISH INQUISITION",
        title: "The Surprise Entrance",
        source: "Monty Python's Flying Circus",
        notes: "A catchphrase heralding the arrival of a comically inept inquisitorial squad."
    },
    {
        id: 201,
        quote: "ITS JUST A FLESH WOUND",
        title: "The Black Knight's Understatement",
        source: "Monty Python and the Holy Grail",
        notes: "A knight's defiant response after losing a limb in a sword fight."
    },
    {
        id: 202,
        quote: "HOMEY DONT PLAY THAT",
        title: "The Clown's Refusal",
        source: "Homey D. Clown, from In Living Color",
        notes: "The signature phrase of a clown who is not to be trifled with."
    },
    {
        id: 203,
        quote: "LOOK WHAT I CAN DO",
        title: "The Annoying Child",
        source: "Stuart, from Mad TV",
        notes: "The simple, repetitive plea for attention from a very strange little boy."
    },
    {
        id: 204,
        quote: "IM CRUSHING YOUR HEAD",
        title: "The Forced Perspective",
        source: "Kids in the Hall",
        notes: "A simple but effective visual gag performed from a distance."
    },
    {
        id: 205,
        quote: "WHATS UP DOC",
        title: "The Rabbit's Greeting",
        source: "Bugs Bunny, from Looney Tunes",
        notes: "The cool, casual greeting of a famously unflappable rabbit."
    },
    {
        id: 207,
        quote: "I AM SMARTER THAN THE AVERAGE BEAR",
        title: "The Bear's Boast",
        source: "Yogi Bear",
        notes: "The confident self-assessment of a picnic-basket-pilfering bear."
    },
    {
        id: 208,
        quote: "THATS ALL FOLKS",
        title: "The End of the Show",
        source: "Porky Pig, from Looney Tunes",
        notes: "The classic, stuttering sign-off from the end of many Warner Bros. cartoons."
    },
    {
        id: 209,
        quote: "COME ON DOWN",
        title: "The Price is Right Invitation",
        source: "The Price is Right",
        notes: "The exciting call for a contestant to leave the audience and join the game."
    },
    {
        id: 210,
        quote: "SURVEY SAYS",
        title: "The Family Feud Reveal",
        source: "Family Feud",
        notes: "The host's famous line before revealing an answer on the board."
    },
    {
        id: 211,
        quote: "WHERES THE BEEF",
        title: "The Fast Food Question",
        source: "Wendy's Commercial",
        notes: "A catchphrase from an 80s commercial questioning the substance of competitors' burgers."
    },
    {
        id: 212,
        quote: "I'VE FALLEN AND I CANT GET UP",
        title: "The Medical Alert",
        source: "LifeCall Commercial",
        notes: "A dramatic line from a commercial that became a cultural touchstone and punchline."
    },
    {
        id: 213,
        quote: "WASSUP",
        title: "The Budweiser Greeting",
        source: "Budweiser Commercial",
        notes: "A simple greeting that became a massive pop culture phenomenon in the early 2000s."
    },
    {
        id: 214,
        quote: "LIFE ISNT ABOUT GETTING AND HAVING ITS ABOUT GIVING AND BEING",
        title: "Inspirational Quote",
        source: "Kevin Kruse",
        notes: "A quote by Kevin Kruse."
    },
    {
        id: 215,
        quote: "WHATEVER THE MIND OF MAN CAN CONCEIVE AND BELIEVE IT CAN ACHIEVE",
        title: "Inspirational Quote",
        source: "Napoleon Hill",
        notes: "A quote by Napoleon Hill."
    },
    {
        id: 216,
        quote: "STRIVE NOT TO BE A SUCCESS BUT RATHER TO BE OF VALUE",
        title: "Inspirational Quote",
        source: "Albert Einstein",
        notes: "A quote by Albert Einstein."
    },
    {
        id: 217,
        quote: "TWO ROADS DIVERGED IN A WOOD AND I I TOOK THE ONE LESS TRAVELED BY AND THAT HAS MADE ALL THE DIFFERENCE",
        title: "Inspirational Quote",
        source: "Robert Frost",
        notes: "A quote by Robert Frost."
    },
    {
        id: 218,
        quote: "I ATTRIBUTE MY SUCCESS TO THIS I NEVER GAVE OR TOOK ANY EXCUSE",
        title: "Inspirational Quote",
        source: "Florence Nightingale",
        notes: "A quote by Florence Nightingale."
    },
    {
        id: 219,
        quote: "YOU MISS 100% OF THE SHOTS YOU DONT TAKE",
        title: "Inspirational Quote",
        source: "Wayne Gretzky",
        notes: "A quote by Wayne Gretzky."
    },
    {
        id: 221,
        quote: "THE MOST DIFFICULT THING IS THE DECISION TO ACT THE REST IS MERELY TENACITY",
        title: "Inspirational Quote",
        source: "Amelia Earhart",
        notes: "A quote by Amelia Earhart."
    },
    {
        id: 222,
        quote: "EVERY STRIKE BRINGS ME CLOSER TO THE NEXT HOME RUN",
        title: "Inspirational Quote",
        source: "Babe Ruth",
        notes: "A quote by Babe Ruth."
    },
    {
        id: 223,
        quote: "DEFINITENESS OF PURPOSE IS THE STARTING POINT OF ALL ACHIEVEMENT",
        title: "Inspirational Quote",
        source: "W. Clement Stone",
        notes: "A quote by W. Clement Stone."
    },
    {
        id: 224,
        quote: "WE MUST BALANCE CONSPICUOUS CONSUMPTION WITH CONSCIOUS CAPITALISM",
        title: "Inspirational Quote",
        source: "Kevin Kruse",
        notes: "A quote by Kevin Kruse."
    },
    {
        id: 225,
        quote: "LIFE IS WHAT HAPPENS TO YOU WHILE YOURE BUSY MAKING OTHER PLANS",
        title: "Inspirational Quote",
        source: "John Lennon",
        notes: "A quote by John Lennon."
    },
    {
        id: 226,
        quote: "WE BECOME WHAT WE THINK ABOUT",
        title: "Inspirational Quote",
        source: "Earl Nightingale",
        notes: "A quote by Earl Nightingale."
    },
    {
        id: 227,
        quote: "TWENTY YEARS FROM NOW YOU WILL BE MORE DISAPPOINTED BY THE THINGS THAT YOU DIDNT DO THAN BY THE ONES YOU DID DO",
        title: "Inspirational Quote",
        source: "Mark Twain",
        notes: "A quote by Mark Twain."
    },
    {
        id: 228,
        quote: "LIFE IS 10% WHAT HAPPENS TO ME AND 90% OF HOW I REACT TO IT",
        title: "Inspirational Quote",
        source: "Charles Swindoll",
        notes: "A quote by Charles Swindoll."
    },
    {
        id: 229,
        quote: "THE MOST COMMON WAY PEOPLE GIVE UP THEIR POWER IS BY THINKING THEY DONT HAVE ANY",
        title: "Inspirational Quote",
        source: "Alice Walker",
        notes: "A quote by Alice Walker."
    },
    {
        id: 230,
        quote: "THE MIND IS EVERYTHING WHAT YOU THINK YOU BECOME",
        title: "Inspirational Quote",
        source: "Buddha",
        notes: "A quote by Buddha."
    },
    {
        id: 231,
        quote: "THE BEST TIME TO PLANT A TREE WAS 20 YEARS AGO THE SECOND BEST TIME IS NOW",
        title: "Inspirational Quote",
        source: "Chinese Proverb",
        notes: "A quote by Chinese Proverb."
    },
    {
        id: 232,
        quote: "AN UNEXAMINED LIFE IS NOT WORTH LIVING",
        title: "Inspirational Quote",
        source: "Socrates",
        notes: "A quote by Socrates."
    },
    {
        id: 233,
        quote: "EIGHTY PERCENT OF SUCCESS IS SHOWING UP",
        title: "Inspirational Quote",
        source: "Woody Allen",
        notes: "A quote by Woody Allen."
    },
    {
        id: 234,
        quote: "YOUR TIME IS LIMITED SO DONT WASTE IT LIVING SOMEONE ELSES LIFE",
        title: "Inspirational Quote",
        source: "Steve Jobs",
        notes: "A quote by Steve Jobs."
    },
    {
        id: 235,
        quote: "WINNING ISNT EVERYTHING BUT WANTING TO WIN IS",
        title: "Inspirational Quote",
        source: "Vince Lombardi",
        notes: "A quote by Vince Lombardi."
    },
    {
        id: 236,
        quote: "I AM NOT A PRODUCT OF MY CIRCUMSTANCES I AM A PRODUCT OF MY DECISIONS",
        title: "Inspirational Quote",
        source: "Stephen Covey",
        notes: "A quote by Stephen Covey."
    },
    {
        id: 237,
        quote: "EVERY CHILD IS AN ARTIST  THE PROBLEM IS HOW TO REMAIN AN ARTIST ONCE HE GROWS UP",
        title: "Inspirational Quote",
        source: "Pablo Picasso",
        notes: "A quote by Pablo Picasso."
    },
    {
        id: 238,
        quote: "YOU CAN NEVER CROSS THE OCEAN UNTIL YOU HAVE THE COURAGE TO LOSE SIGHT OF THE SHORE",
        title: "Inspirational Quote",
        source: "Christopher Columbus",
        notes: "A quote by Christopher Columbus."
    },
    {
        id: 239,
        quote: "IVE LEARNED THAT PEOPLE WILL FORGET WHAT YOU SAID PEOPLE WILL FORGET WHAT YOU DID BUT PEOPLE WILL NEVER FORGET HOW YOU MADE THEM FEEL",
        title: "Inspirational Quote",
        source: "Maya Angelou",
        notes: "A quote by Maya Angelou."
    },
    {
        id: 240,
        quote: "EITHER YOU RUN THE DAY OR THE DAY RUNS YOU",
        title: "Inspirational Quote",
        source: "Jim Rohn",
        notes: "A quote by Jim Rohn."
    },
    {
        id: 241,
        quote: "WHETHER YOU THINK YOU CAN OR YOU THINK YOU CANT YOURE RIGHT",
        title: "Inspirational Quote",
        source: "Henry Ford",
        notes: "A quote by Henry Ford."
    },
    {
        id: 242,
        quote: "THE TWO MOST IMPORTANT DAYS IN YOUR LIFE ARE THE DAY YOU ARE BORN AND THE DAY YOU FIND OUT WHY",
        title: "Inspirational Quote",
        source: "Mark Twain",
        notes: "A quote by Mark Twain."
    },
    {
        id: 243,
        quote: "WHATEVER YOU CAN DO OR DREAM YOU CAN BEGIN IT  BOLDNESS HAS GENIUS POWER AND MAGIC IN IT",
        title: "Inspirational Quote",
        source: "Johann Wolfgang von Goethe",
        notes: "A quote by Johann Wolfgang von Goethe."
    },
    {
        id: 244,
        quote: "THE BEST REVENGE IS MASSIVE SUCCESS",
        title: "Inspirational Quote",
        source: "Frank Sinatra",
        notes: "A quote by Frank Sinatra."
    },
    {
        id: 245,
        quote: "PEOPLE OFTEN SAY THAT MOTIVATION DOESNT LAST WELL NEITHER DOES BATHING  THATS WHY WE RECOMMEND IT DAILY",
        title: "Inspirational Quote",
        source: "Zig Ziglar",
        notes: "A quote by Zig Ziglar."
    },
    {
        id: 246,
        quote: "LIFE SHRINKS OR EXPANDS IN PROPORTION TO ONES COURAGE",
        title: "Inspirational Quote",
        source: "Anais Nin",
        notes: "A quote by Anais Nin."
    },
    {
        id: 247,
        quote: "IF YOU HEAR A VOICE WITHIN YOU SAY YOU CANNOT PAINT THEN BY ALL MEANS PAINT AND THAT VOICE WILL BE SILENCED",
        title: "Inspirational Quote",
        source: "Vincent Van Gogh",
        notes: "A quote by Vincent Van Gogh."
    },
    {
        id: 248,
        quote: "THERE IS ONLY ONE WAY TO AVOID CRITICISM DO NOTHING SAY NOTHING AND BE NOTHING",
        title: "Inspirational Quote",
        source: "Aristotle",
        notes: "A quote by Aristotle."
    },
    {
        id: 249,
        quote: "ASK AND IT WILL BE GIVEN TO YOU SEARCH AND YOU WILL FIND KNOCK AND THE DOOR WILL BE OPENED FOR YOU",
        title: "Inspirational Quote",
        source: "Jesus",
        notes: "A quote by Jesus."
    },
    {
        id: 250,
        quote: "THE ONLY PERSON YOU ARE DESTINED TO BECOME IS THE PERSON YOU DECIDE TO BE",
        title: "Inspirational Quote",
        source: "Ralph Waldo Emerson",
        notes: "A quote by Ralph Waldo Emerson."
    },
    {
        id: 251,
        quote: "GO CONFIDENTLY IN THE DIRECTION OF YOUR DREAMS  LIVE THE LIFE YOU HAVE IMAGINED",
        title: "Inspirational Quote",
        source: "Henry David Thoreau",
        notes: "A quote by Henry David Thoreau."
    },
    {
        id: 252,
        quote: "WHEN I STAND BEFORE GOD AT THE END OF MY LIFE I WOULD HOPE THAT I WOULD NOT HAVE A SINGLE BIT OF TALENT LEFT AND COULD SAY I USED EVERYTHING YOU GAVE ME",
        title: "Inspirational Quote",
        source: "Erma Bombeck",
        notes: "A quote by Erma Bombeck."
    },
    {
        id: 253,
        quote: "FEW THINGS CAN HELP AN INDIVIDUAL MORE THAN TO PLACE RESPONSIBILITY ON HIM AND TO LET HIM KNOW THAT YOU TRUST HIM",
        title: "Inspirational Quote",
        source: "Booker T. Washington",
        notes: "A quote by Booker T. Washington."
    },
    {
        id: 254,
        quote: "CERTAIN THINGS CATCH YOUR EYE BUT PURSUE ONLY THOSE THAT CAPTURE THE HEART",
        title: "Inspirational Quote",
        source: " Ancient Indian Proverb",
        notes: "A quote by  Ancient Indian Proverb."
    },
    {
        id: 255,
        quote: "BELIEVE YOU CAN AND YOURE HALFWAY THERE",
        title: "Inspirational Quote",
        source: "Theodore Roosevelt",
        notes: "A quote by Theodore Roosevelt."
    },
    {
        id: 256,
        quote: "EVERYTHING YOUVE EVER WANTED IS ON THE OTHER SIDE OF FEAR",
        title: "Inspirational Quote",
        source: "George Addair",
        notes: "A quote by George Addair."
    },
    {
        id: 257,
        quote: "WE CAN EASILY FORGIVE A CHILD WHO IS AFRAID OF THE DARK THE REAL TRAGEDY OF LIFE IS WHEN MEN ARE AFRAID OF THE LIGHT",
        title: "Inspirational Quote",
        source: "Plato",
        notes: "A quote by Plato."
    },
    {
        id: 258,
        quote: "TEACH THY TONGUE TO SAY I DO NOT KNOW AND THOUS SHALT PROGRESS",
        title: "Inspirational Quote",
        source: "Maimonides",
        notes: "A quote by Maimonides."
    },
    {
        id: 259,
        quote: "START WHERE YOU ARE USE WHAT YOU HAVE  DO WHAT YOU CAN",
        title: "Inspirational Quote",
        source: "Arthur Ashe",
        notes: "A quote by Arthur Ashe."
    },
    {
        id: 260,
        quote: "WHEN I WAS 5 YEARS OLD MY MOTHER ALWAYS TOLD ME THAT HAPPINESS WAS THE KEY TO LIFE  WHEN I WENT TO SCHOOL THEY ASKED ME WHAT I WANTED TO BE WHEN I GREW UP  I WROTE DOWN HAPPY  THEY TOLD ME I DIDNT UNDERSTAND THE ASSIGNMENT AND I TOLD THEM THEY DIDNT UNDERSTAND LIFE",
        title: "Inspirational Quote",
        source: "John Lennon",
        notes: "A quote by John Lennon."
    },
    {
        id: 261,
        quote: "FALL SEVEN TIMES AND STAND UP EIGHT",
        title: "Inspirational Quote",
        source: "Japanese Proverb",
        notes: "A quote by Japanese Proverb."
    },
    {
        id: 262,
        quote: "WHEN ONE DOOR OF HAPPINESS CLOSES ANOTHER OPENS BUT OFTEN WE LOOK SO LONG AT THE CLOSED DOOR THAT WE DO NOT SEE THE ONE THAT HAS BEEN OPENED FOR US",
        title: "Inspirational Quote",
        source: "Helen Keller",
        notes: "A quote by Helen Keller."
    },
    {
        id: 263,
        quote: "EVERYTHING HAS BEAUTY BUT NOT EVERYONE CAN SEE",
        title: "Inspirational Quote",
        source: "Confucius",
        notes: "A quote by Confucius."
    },
    {
        id: 264,
        quote: "HOW WONDERFUL IT IS THAT NOBODY NEED WAIT A SINGLE MOMENT BEFORE STARTING TO IMPROVE THE WORLD",
        title: "Inspirational Quote",
        source: "Anne Frank",
        notes: "A quote by Anne Frank."
    },
    {
        id: 265,
        quote: "WHEN I LET GO OF WHAT I AM I BECOME WHAT I MIGHT BE",
        title: "Inspirational Quote",
        source: "Lao Tzu",
        notes: "A quote by Lao Tzu."
    },
    {
        id: 266,
        quote: "LIFE IS NOT MEASURED BY THE NUMBER OF BREATHS WE TAKE BUT BY THE MOMENTS THAT TAKE OUR BREATH AWAY",
        title: "Inspirational Quote",
        source: "Maya Angelou",
        notes: "A quote by Maya Angelou."
    },
    {
        id: 267,
        quote: "HAPPINESS IS NOT SOMETHING READYMADE  IT COMES FROM YOUR OWN ACTIONS",
        title: "Inspirational Quote",
        source: "Dalai Lama",
        notes: "A quote by Dalai Lama."
    },
    {
        id: 268,
        quote: "IF YOURE OFFERED A SEAT ON A ROCKET SHIP DONT ASK WHAT SEAT JUST GET ON",
        title: "Inspirational Quote",
        source: "Sheryl Sandberg",
        notes: "A quote by Sheryl Sandberg."
    },
    {
        id: 269,
        quote: "FIRST HAVE A DEFINITE CLEAR PRACTICAL IDEAL A GOAL AN OBJECTIVE SECOND HAVE THE NECESSARY MEANS TO ACHIEVE YOUR ENDS WISDOM MONEY MATERIALS AND METHODS THIRD ADJUST ALL YOUR MEANS TO THAT END",
        title: "Inspirational Quote",
        source: "Aristotle",
        notes: "A quote by Aristotle."
    },
    {
        id: 270,
        quote: "IF THE WIND WILL NOT SERVE TAKE TO THE OARS",
        title: "Inspirational Quote",
        source: "Latin Proverb",
        notes: "A quote by Latin Proverb."
    },
    {
        id: 271,
        quote: "YOU CANT FALL IF YOU DONT CLIMB  BUT THERES NO JOY IN LIVING YOUR WHOLE LIFE ON THE GROUND",
        title: "Inspirational Quote",
        source: "Unknown",
        notes: "A quote by Unknown."
    },
    {
        id: 272,
        quote: "WE MUST BELIEVE THAT WE ARE GIFTED FOR SOMETHING AND THAT THIS THING AT WHATEVER COST MUST BE ATTAINED",
        title: "Inspirational Quote",
        source: "Marie Curie",
        notes: "A quote by Marie Curie."
    },
    {
        id: 273,
        quote: "TOO MANY OF US ARE NOT LIVING OUR DREAMS BECAUSE WE ARE LIVING OUR FEARS",
        title: "Inspirational Quote",
        source: "Les Brown",
        notes: "A quote by Les Brown."
    },
    {
        id: 274,
        quote: "CHALLENGES ARE WHAT MAKE LIFE INTERESTING AND OVERCOMING THEM IS WHAT MAKES LIFE MEANINGFUL",
        title: "Inspirational Quote",
        source: "Joshua J. Marine",
        notes: "A quote by Joshua J. Marine."
    },
    {
        id: 275,
        quote: "IF YOU WANT TO LIFT YOURSELF UP LIFT UP SOMEONE ELSE",
        title: "Inspirational Quote",
        source: "Booker T. Washington",
        notes: "A quote by Booker T. Washington."
    },
    {
        id: 276,
        quote: "I HAVE BEEN IMPRESSED WITH THE URGENCY OF DOING KNOWING IS NOT ENOUGH WE MUST APPLY BEING WILLING IS NOT ENOUGH WE MUST DO",
        title: "Inspirational Quote",
        source: "Leonardo da Vinci",
        notes: "A quote by Leonardo da Vinci."
    },
    {
        id: 277,
        quote: "LIMITATIONS LIVE ONLY IN OUR MINDS  BUT IF WE USE OUR IMAGINATIONS OUR POSSIBILITIES BECOME LIMITLESS",
        title: "Inspirational Quote",
        source: "Jamie Paolinetti",
        notes: "A quote by Jamie Paolinetti."
    },
    {
        id: 278,
        quote: "YOU TAKE YOUR LIFE IN YOUR OWN HANDS AND WHAT HAPPENS A TERRIBLE THING NO ONE TO BLAME",
        title: "Inspirational Quote",
        source: "Erica Jong",
        notes: "A quote by Erica Jong."
    },
    {
        id: 279,
        quote: "WHATS MONEY A MAN IS A SUCCESS IF HE GETS UP IN THE MORNING AND GOES TO BED AT NIGHT AND IN BETWEEN DOES WHAT HE WANTS TO DO",
        title: "Inspirational Quote",
        source: "Bob Dylan",
        notes: "A quote by Bob Dylan."
    },
    {
        id: 280,
        quote: "I DIDNT FAIL THE TEST I JUST FOUND 100 WAYS TO DO IT WRONG",
        title: "Inspirational Quote",
        source: "Benjamin Franklin",
        notes: "A quote by Benjamin Franklin."
    },
    {
        id: 281,
        quote: "IN ORDER TO SUCCEED YOUR DESIRE FOR SUCCESS SHOULD BE GREATER THAN YOUR FEAR OF FAILURE",
        title: "Inspirational Quote",
        source: "Bill Cosby",
        notes: "A quote by Bill Cosby."
    },
    {
        id: 282,
        quote: "A PERSON WHO NEVER MADE A MISTAKE NEVER TRIED ANYTHING NEW",
        title: "Inspirational Quote",
        source: " Albert Einstein",
        notes: "A quote by  Albert Einstein."
    },
    {
        id: 283,
        quote: "THE PERSON WHO SAYS IT CANNOT BE DONE SHOULD NOT INTERRUPT THE PERSON WHO IS DOING IT",
        title: "Inspirational Quote",
        source: "Chinese Proverb",
        notes: "A quote by Chinese Proverb."
    },
    {
        id: 284,
        quote: "THERE ARE NO TRAFFIC JAMS ALONG THE EXTRA MILE",
        title: "Inspirational Quote",
        source: "Roger Staubach",
        notes: "A quote by Roger Staubach."
    },
    {
        id: 285,
        quote: "IT IS NEVER TOO LATE TO BE WHAT YOU MIGHT HAVE BEEN",
        title: "Inspirational Quote",
        source: "George Eliot",
        notes: "A quote by George Eliot."
    },
    {
        id: 286,
        quote: "YOU BECOME WHAT YOU BELIEVE",
        title: "Inspirational Quote",
        source: "Oprah Winfrey",
        notes: "A quote by Oprah Winfrey."
    },
    {
        id: 287,
        quote: "I WOULD RATHER DIE OF PASSION THAN OF BOREDOM",
        title: "Inspirational Quote",
        source: "Vincent van Gogh",
        notes: "A quote by Vincent van Gogh."
    },
    {
        id: 288,
        quote: "A TRULY RICH MAN IS ONE WHOSE CHILDREN RUN INTO HIS ARMS WHEN HIS HANDS ARE EMPTY",
        title: "Inspirational Quote",
        source: "Unknown",
        notes: "A quote by Unknown."
    },
    {
        id: 289,
        quote: "IT IS NOT WHAT YOU DO FOR YOUR CHILDREN BUT WHAT YOU HAVE TAUGHT THEM TO DO FOR THEMSELVES THAT WILL MAKE THEM SUCCESSFUL HUMAN BEINGS",
        title: "Inspirational Quote",
        source: "Ann Landers",
        notes: "A quote by Ann Landers."
    },
    {
        id: 290,
        quote: "IF YOU WANT YOUR CHILDREN TO TURN OUT WELL SPEND TWICE AS MUCH TIME WITH THEM AND HALF AS MUCH MONEY",
        title: "Inspirational Quote",
        source: "Abigail Van Buren",
        notes: "A quote by Abigail Van Buren."
    },
    {
        id: 291,
        quote: "BUILD YOUR OWN DREAMS OR SOMEONE ELSE WILL HIRE YOU TO BUILD THEIRS",
        title: "Inspirational Quote",
        source: "Farrah Gray",
        notes: "A quote by Farrah Gray."
    },
    {
        id: 292,
        quote: "THE BATTLES THAT COUNT ARENT THE ONES FOR GOLD MEDALS THE STRUGGLES WITHIN YOURSELF–THE INVISIBLE BATTLES INSIDE ALL OF US–THATS WHERE ITS AT",
        title: "Inspirational Quote",
        source: "Jesse Owens",
        notes: "A quote by Jesse Owens."
    },
    {
        id: 293,
        quote: "EDUCATION COSTS MONEY  BUT THEN SO DOES IGNORANCE",
        title: "Inspirational Quote",
        source: "Sir Claus Moser",
        notes: "A quote by Sir Claus Moser."
    },
    {
        id: 294,
        quote: "I HAVE LEARNED OVER THE YEARS THAT WHEN ONES MIND IS MADE UP THIS DIMINISHES FEAR",
        title: "Inspirational Quote",
        source: "Rosa Parks",
        notes: "A quote by Rosa Parks."
    },
    {
        id: 295,
        quote: "IT DOES NOT MATTER HOW SLOWLY YOU GO AS LONG AS YOU DO NOT STOP",
        title: "Inspirational Quote",
        source: "Confucius",
        notes: "A quote by Confucius."
    },
    {
        id: 296,
        quote: "IF YOU LOOK AT WHAT YOU HAVE IN LIFE YOULL ALWAYS HAVE MORE IF YOU LOOK AT WHAT YOU DONT HAVE IN LIFE YOULL NEVER HAVE ENOUGH",
        title: "Inspirational Quote",
        source: "Oprah Winfrey",
        notes: "A quote by Oprah Winfrey."
    },
    {
        id: 297,
        quote: "REMEMBER THAT NOT GETTING WHAT YOU WANT IS SOMETIMES A WONDERFUL STROKE OF LUCK",
        title: "Inspirational Quote",
        source: "Dalai Lama",
        notes: "A quote by Dalai Lama."
    },
    {
        id: 298,
        quote: "YOU CANT USE UP CREATIVITY  THE MORE YOU USE THE MORE YOU HAVE",
        title: "Inspirational Quote",
        source: "Maya Angelou",
        notes: "A quote by Maya Angelou."
    },
    {
        id: 299,
        quote: "DREAM BIG AND DARE TO FAIL",
        title: "Inspirational Quote",
        source: "Norman Vaughan",
        notes: "A quote by Norman Vaughan."
    },
    {
        id: 300,
        quote: "OUR LIVES BEGIN TO END THE DAY WE BECOME SILENT ABOUT THINGS THAT MATTER",
        title: "Inspirational Quote",
        source: "Martin Luther King Jr.",
        notes: "A quote by Martin Luther King Jr."
    },
    {
        id: 301,
        quote: "DO WHAT YOU CAN WHERE YOU ARE WITH WHAT YOU HAVE",
        title: "Inspirational Quote",
        source: "Teddy Roosevelt",
        notes: "A quote by Teddy Roosevelt."
    },
    {
        id: 302,
        quote: "IF YOU DO WHAT YOUVE ALWAYS DONE YOULL GET WHAT YOUVE ALWAYS GOTTEN",
        title: "Inspirational Quote",
        source: "Tony Robbins",
        notes: "A quote by Tony Robbins."
    },
    {
        id: 303,
        quote: "DREAMING AFTER ALL IS A FORM OF PLANNING",
        title: "Inspirational Quote",
        source: "Gloria Steinem",
        notes: "A quote by Gloria Steinem."
    },
    {
        id: 304,
        quote: "ITS YOUR PLACE IN THE WORLD ITS YOUR LIFE GO ON AND DO ALL YOU CAN WITH IT AND MAKE IT THE LIFE YOU WANT TO LIVE",
        title: "Inspirational Quote",
        source: "Mae Jemison",
        notes: "A quote by Mae Jemison."
    },
    {
        id: 305,
        quote: "YOU MAY BE DISAPPOINTED IF YOU FAIL BUT YOU ARE DOOMED IF YOU DONT TRY",
        title: "Inspirational Quote",
        source: "Beverly Sills",
        notes: "A quote by Beverly Sills."
    },
    {
        id: 306,
        quote: "REMEMBER NO ONE CAN MAKE YOU FEEL INFERIOR WITHOUT YOUR CONSENT",
        title: "Inspirational Quote",
        source: "Eleanor Roosevelt",
        notes: "A quote by Eleanor Roosevelt."
    },
    {
        id: 307,
        quote: "LIFE IS WHAT WE MAKE IT ALWAYS HAS BEEN ALWAYS WILL BE",
        title: "Inspirational Quote",
        source: "Grandma Moses",
        notes: "A quote by Grandma Moses."
    },
    {
        id: 308,
        quote: "THE QUESTION ISNT WHO IS GOING TO LET ME ITS WHO IS GOING TO STOP ME",
        title: "Inspirational Quote",
        source: "Ayn Rand",
        notes: "A quote by Ayn Rand."
    },
    {
        id: 309,
        quote: "WHEN EVERYTHING SEEMS TO BE GOING AGAINST YOU REMEMBER THAT THE AIRPLANE TAKES OFF AGAINST THE WIND NOT WITH IT",
        title: "Inspirational Quote",
        source: "Henry Ford",
        notes: "A quote by Henry Ford."
    },
    {
        id: 310,
        quote: "ITS NOT THE YEARS IN YOUR LIFE THAT COUNT ITS THE LIFE IN YOUR YEARS",
        title: "Inspirational Quote",
        source: "Abraham Lincoln",
        notes: "A quote by Abraham Lincoln."
    },
    {
        id: 311,
        quote: "CHANGE YOUR THOUGHTS AND YOU CHANGE YOUR WORLD",
        title: "Inspirational Quote",
        source: "Norman Vincent Peale",
        notes: "A quote by Norman Vincent Peale."
    },
    {
        id: 312,
        quote: "EITHER WRITE SOMETHING WORTH READING OR DO SOMETHING WORTH WRITING",
        title: "Inspirational Quote",
        source: "Benjamin Franklin",
        notes: "A quote by Benjamin Franklin."
    },
    {
        id: 313,
        quote: "NOTHING IS IMPOSSIBLE THE WORD ITSELF SAYS IM POSSIBLE",
        title: "Inspirational Quote",
        source: "–Audrey Hepburn",
        notes: "A quote by –Audrey Hepburn."
    },
    {
        id: 314,
        quote: "THE ONLY WAY TO DO GREAT WORK IS TO LOVE WHAT YOU DO",
        title: "Inspirational Quote",
        source: "Steve Jobs",
        notes: "A quote by Steve Jobs."
    },
    {
        id: 315,
        quote: "IF YOU CAN DREAM IT YOU CAN ACHIEVE IT",
        title: "Inspirational Quote",
        source: "Zig Ziglar",
        notes: "A quote by Zig Ziglar."
    }
]
