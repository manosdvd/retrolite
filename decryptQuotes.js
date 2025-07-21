const decryptQuotes = [
    // --- Original Quotes ---
    {
        id: 1,
        quote: "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
        title: "The Rapid Canid's Leap",
        source: "Traditional Pangram",
        notes: "A sentence used to test typewriters and display fonts."
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

    // --- Movie Quotes ---
    {
        id: 9,
        quote: "I AM YOUR FATHER",
        title: "A Shocking Revelation",
        source: "Darth Vader, from Star Wars: The Empire Strikes Back",
        notes: "A famous, often misquoted, line from a space opera sequel."
    },
    {
        id: 10,
        quote: "THERES NO PLACE LIKE HOME",
        title: "The Ruby Slipper Mantra",
        source: "Dorothy Gale, from The Wizard of Oz",
        notes: "A heartfelt realization from a journey to a magical land."
    },
    {
        id: 11,
        quote: "I HAVE A FEELING WERE NOT IN KANSAS ANYMORE",
        title: "Entering a New World",
        source: "Dorothy Gale, from The Wizard of Oz",
        notes: "An observation made upon arriving in a strange, colorful land."
    },
    {
        id: 12,
        quote: "HOUSTON WE HAVE A PROBLEM",
        title: "The Understated Crisis",
        source: "Jim Lovell, from Apollo 13",
        notes: "A calm report of a major issue during a space mission."
    },
    {
        id: 13,
        quote: "JUST KEEP SWIMMING",
        title: "The Optimist's Motto",
        source: "Dory, from Finding Nemo",
        notes: "A piece of advice from a very forgetful blue fish."
    },
    {
        id: 14,
        quote: "WHY SO SERIOUS",
        title: "The Agent of Chaos",
        source: "The Joker, from The Dark Knight (Christopher Nolan)",
        notes: "A chilling question posed by a classic comic book villain."
    },
    {
        id: 15,
        quote: "YOU CANT HANDLE THE TRUTH",
        title: "The Courtroom Confession",
        source: "Col. Nathan R. Jessep, from A Few Good Men (Aaron Sorkin)",
        notes: "A shouted declaration from a high-ranking military officer on trial."
    },
    {
        id: 16,
        quote: "I SEE DEAD PEOPLE",
        title: "The Sixth Sense",
        source: "Cole Sear, from The Sixth Sense (M. Night Shyamalan)",
        notes: "A whispered secret from a boy with a supernatural ability."
    },
    {
        id: 17,
        quote: "ROADES WHERE WERE GOING WE DONT NEED ROADS",
        title: "The Future of Travel",
        source: "Doc Brown, from Back to the Future",
        notes: "A confident statement before traveling through time."
    },
    {
        id: 18,
        quote: "WAX ON WAX OFF",
        title: "The Art of Defense",
        source: "Mr. Miyagi, from The Karate Kid",
        notes: "A simple instruction that teaches a powerful lesson in martial arts."
    },

    // --- Literature Quotes ---
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

    // --- Historical & Philosophical Quotes ---
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

    // --- Science & Technology Quotes ---
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

    // --- Proverbs & Common Sayings ---
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
    
    // --- More Pangrams ---
    {
        id: 45,
        quote: "PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS",
        title: "The Bartender's Pangram",
        source: "Traditional Pangram",
        notes: "A classic sentence that contains every letter of the alphabet."
    },
    {
        id: 46,
        quote: "HOW QUICKLY DAFT JUMPING ZEBRAS VEX",
        title: "The Vexing Zebra",
        source: "Traditional Pangram",
        notes: "A compact sentence containing every letter of the alphabet."
    },
    {
        id: 47,
        quote: "SPHINX OF BLACK QUARTZ JUDGE MY VOW",
        title: "The Egyptian Judge",
        source: "Traditional Pangram",
        notes: "A well-known pangram with a mysterious tone."
    },

    // --- Video Game Quotes ---
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

    // --- Art & Music Quotes ---
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

    // --- More Science Quotes ---
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

    // --- More Literature Quotes (Famous First Lines) ---
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

    // --- More Historical & Political Quotes ---
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

    // --- More Proverbs ---
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

    // --- Pop Culture Additions (Batch 1) ---
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
        id: 101,
        quote: "YESTERDAY ALL MY TROUBLES SEEMED SO FAR AWAY",
        title: "The Ballad of Nostalgia",
        source: "The Beatles (song)",
        notes: "The beginning of a timeless ballad about longing for the past."
    },
    {
        id: 102,
        quote: "I SEE A RED DOOR AND I WANT IT PAINTED BLACK",
        title: "The Color of Grief",
        source: "The Rolling Stones (song)",
        notes: "A line from a rock song expressing a desire to erase color and joy."
    },
    {
        id: 103,
        quote: "HELLO IS IT ME YOURE LOOKING FOR",
        title: "The Hopeful Question",
        source: "Lionel Richie (song)",
        notes: "The opening of a famous love song from the eighties."
    },
    {
        id: 104,
        quote: "WE WILL WE WILL ROCK YOU",
        title: "The Stadium Anthem",
        source: "Queen (song)",
        notes: "A simple but powerful chant designed for audience participation."
    },
    {
        id: 105,
        quote: "I GET KNOCKED DOWN BUT I GET UP AGAIN",
        title: "The Song of Resilience",
        source: "Chumbawamba (song)",
        notes: "The defiant chorus of an unforgettable one-hit wonder."
    },

    // --- Pop Culture Additions (Batch 2) ---
    {
        id: 106,
        quote: "IM THE KING OF THE WORLD",
        title: "The Titanic Proclamation",
        source: "Jack Dawson, from Titanic (James Cameron)",
        notes: "An exuberant shout from the bow of a famously ill-fated ship."
    },
    {
        id: 107,
        quote: "YOURE GONNA NEED A BIGGER BOAT",
        title: "The Underestimation",
        source: "Chief Brody, from Jaws",
        notes: "A classic line delivered after seeing the size of a great white shark."
    },
    {
        id: 108,
        quote: "SAY HELLO TO MY LITTLE FRIEND",
        title: "The Aggressive Introduction",
        source: "Tony Montana, from Scarface",
        notes: "A gangster's famous last stand introduction to his firearm."
    },
    {
        id: 109,
        quote: "KEEP THE CHANGE YA FILTHY ANIMAL",
        title: "The Movie Quote Prank",
        source: "Johnny, from Angels with Filthy Souls (in Home Alone)",
        notes: "A line from a fictional gangster movie used to scare off a pizza boy."
    },
    {
        id: 110,
        quote: "WITH GREAT POWER COMES GREAT RESPONSIBILITY",
        title: "The Hero's Code",
        source: "Uncle Ben, from Spider-Man (Stan Lee)",
        notes: "A wise uncle's final advice to his super-powered nephew."
    },
    {
        id: 111,
        quote: "NO SOUP FOR YOU",
        title: "The Strict Chef",
        source: "The Soup Nazi, from Seinfeld (Larry David)",
        notes: "The harsh verdict from a famously temperamental soup vendor."
    },
    {
        id: 112,
        quote: "TREAT YO SELF",
        title: "The Day of Indulgence",
        source: "Tom & Donna, from Parks and Recreation",
        notes: "The motto for an annual day of extreme self-pampering."
    },
    {
        id: 113,
        quote: "IVE MADE A HUGE MISTAKE",
        title: "The Magician's Regret",
        source: "G.O.B. Bluth, from Arrested Development (Mitchell Hurwitz)",
        notes: "The recurring realization of a man known for his grand illusions."
    },
    {
        id: 114,
        quote: "CHANGE MY MIND",
        title: "The Debate Challenge",
        source: "Steven Crowder (internet meme)",
        notes: "A meme format inviting people to challenge a stated opinion."
    },
    {
        id: 115,
        quote: "SURPRISED PIKACHU",
        title: "Feigned Shock",
        source: "Pokémon (anime)",
        notes: "A meme used to express shock at a completely predictable outcome."
    },
    {
        id: 116,
        quote: "SOMEBODY ONCE TOLD ME THE WORLD IS GONNA ROLL ME",
        title: "The Ogre's Anthem",
        source: "Smash Mouth (song)",
        notes: "The opening line of a song that became the theme for a green ogre."
    },
    {
        id: 117,
        quote: "ITS THE EYE OF THE TIGER ITS THE THRILL OF THE FIGHT",
        title: "The Training Montage",
        source: "Survivor (song)",
        notes: "The iconic chorus of a song about rising up to a challenge."
    },
    {
        id: 118,
        quote: "WHO LET THE DOGS OUT",
        title: "The Unanswered Question",
        source: "Baha Men (song)",
        notes: "The catchy, repetitive question from a memorable early 2000s hit."
    },
    {
        id: 119,
        quote: "THATLL DO PIG THATLL DO",
        title: "The Farmer's Approval",
        source: "Farmer Hoggett, from Babe",
        notes: "A farmer's quiet words of praise to his sheep-herding pig."
    },

    // --- TikTok & Viral Trends (Batch 1) ---
    {
        id: 120,
        quote: "ITS CORN A BIG LUMP WITH KNOBS",
        title: "The Corn Kid",
        source: "Tariq (viral video)",
        notes: "An interview with a child expressing his deep love for corn."
    },
    {
        id: 121,
        quote: "MY MONEY DONT JIGGLE JIGGLE IT FOLDS",
        title: "The Jiggle Jiggle Rap",
        source: "Louis Theroux (viral sound)",
        notes: "A rap that went viral from a documentarian's old interview."
    },
    {
        id: 122,
        quote: "BOMBASTIC SIDE EYE",
        title: "The Side Eye",
        source: "TikTok Trend",
        notes: "A popular sound used to express judgment or disapproval."
    },
    {
        id: 123,
        quote: "DELULU IS THE SOLULU",
        title: "The Solution",
        source: "TikTok Slang",
        notes: "A viral phrase suggesting that being delusional is the solution."
    },
    {
        id: 124,
        quote: "LET HIM COOK",
        title: "The Chef's Kiss",
        source: "Internet Slang",
        notes: "A meme phrase used to tell people to let someone continue what they're doing well."
    },
    {
        id: 125,
        quote: "ITS GIVING MAIN CHARACTER ENERGY",
        title: "The Vibe Check",
        source: "TikTok Slang",
        notes: "A popular phrase used to describe someone who seems like the protagonist."
    },
    {
        id: 126,
        quote: "HOW OFTEN DO YOU THINK ABOUT THE ROMAN EMPIRE",
        title: "The Ancient Question",
        source: "TikTok Trend",
        notes: "A viral trend where people asked the men in their lives this specific question."
    },
    {
        id: 127,
        quote: "CHRISSY WAKE UP I DONT LIKE THIS",
        title: "The Upside Down",
        source: "Eddie Munson, from Stranger Things (The Duffer Brothers)",
        notes: "A line from a popular sci-fi show that was remixed into a viral song."
    },

    // --- TikTok & Viral Trends (Batch 2) ---
    {
        id: 128,
        quote: "OH NO OUR TABLE ITS BROKEN",
        title: "The Broken Table",
        source: "America's Funniest Home Videos (viral sound)",
        notes: "A viral sound from a home video used to express dismay."
    },
    {
        id: 129,
        quote: "I AM A SURGEON",
        title: "The Surgeon's Declaration",
        source: "Dr. Shaun Murphy, from The Good Doctor",
        notes: "A clip from a medical drama used to show expertise or frustration."
    },
    {
        id: 130,
        quote: "HE LOOKED AT ME AND I LOOKED AT HIM",
        title: "The Stare Down",
        source: "TikTok Sound",
        notes: "A viral sound describing a moment of intense, unspoken communication."
    },
    {
        id: 131,
        quote: "THEY DID SURGERY ON A GRAPE",
        title: "The Grape Surgery",
        source: "Internet Meme",
        notes: "A meme celebrating a feat of incredible precision and technology."
    },
    {
        id: 132,
        quote: "OKAY LETS GO",
        title: "The Enthusiastic Start",
        source: "TikTok Sound",
        notes: "A viral sound from a popular creator used to kick off an activity."
    },
    {
        id: 133,
        quote: "YOU THINK YOU JUST FELL OUT OF A COCONUT TREE",
        title: "The Coconut Tree",
        source: "Kamala Harris (viral sound)",
        notes: "A bizarre and memorable question from a politician that became a viral sound."
    },
    {
        id: 134,
        quote: "I LIKE TO SEE YOU WIGGLE WIGGLE",
        title: "The Wiggle Wiggle",
        source: "Louis Theroux (viral sound)",
        notes: "A lyric from the 'Jiggle Jiggle' rap that became its own trend."
    },
    {
        id: 135,
        quote: "GOOD SOUP",
        title: "The Soup Review",
        source: "Adam Sackler, from Girls (Lena Dunham)",
        notes: "A simple, satisfying line from a TV show that became a sound for anything good."
    },

    // --- Nerdy & Genre Favorites ---
    {
        id: 136,
        quote: "THE NEEDS OF THE MANY OUTWEIGH THE NEEDS OF THE FEW",
        title: "The Vulcan Philosophy",
        source: "Spock, from Star Trek II: The Wrath of Khan",
        notes: "A core principle of Vulcan logic, famously spoken by Spock."
    },
    {
        id: 137,
        quote: "MAKE IT SO",
        title: "The Captain's Command",
        source: "Captain Picard, from Star Trek: The Next Generation",
        notes: "The signature command of Captain Jean-Luc Picard."
    },
    {
        id: 138,
        quote: "YOU SHALL NOT PASS",
        title: "The Bridge Stand",
        source: "Gandalf, from The Lord of the Rings (J.R.R. Tolkien)",
        notes: "A wizard's powerful declaration against a fiery demon."
    },
    {
        id: 139,
        quote: "I CAN DO THIS ALL DAY",
        title: "The Super Soldier's Resolve",
        source: "Steve Rogers, from Captain America: The First Avenger",
        notes: "A defiant statement in the face of overwhelming odds."
    },
    {
        id: 140,
        quote: "I AM IRON MAN",
        title: "The Hero's Identity",
        source: "Tony Stark, from Iron Man",
        notes: "The public declaration that launched a cinematic universe."
    },
    {
        id: 141,
        quote: "IM BATMAN",
        title: "The Dark Knight's Introduction",
        source: "Batman, from Batman (Tim Burton)",
        notes: "The simple, intimidating introduction of Gotham's protector."
    },
    {
        id: 142,
        quote: "I AIM TO MISBEHAVE",
        title: "The Smuggler's Creed",
        source: "Mal Reynolds, from Serenity (Joss Whedon)",
        notes: "A declaration of rebellious intent from the captain of a Firefly-class ship."
    },
    {
        id: 143,
        quote: "SIX SEASONS AND A MOVIE",
        title: "The Community Rallying Cry",
        source: "Abed Nadir, from Community (Dan Harmon)",
        notes: "A meta-joke from a TV show that became a fan campaign."
    },
    {
        id: 144,
        quote: "A LONG TIME AGO WE USED TO BE FRIENDS",
        title: "The Veronica Mars Theme",
        source: "The Dandy Warhols (song)",
        notes: "The opening line of the theme song for a teen noir detective series."
    },
    {
        id: 145,
        quote: "I WANT TO BELIEVE",
        title: "The X-Files Poster",
        source: "The X-Files (Chris Carter)",
        notes: "The iconic phrase from a poster in Fox Mulder's office."
    },
    {
        id: 146,
        quote: "IN SPACE NO ONE CAN HEAR YOU SCREAM",
        title: "The Alien Tagline",
        source: "Alien (Ridley Scott)",
        notes: "The terrifying tagline from a classic 1979 sci-fi horror film."
    },
    {
        id: 147,
        quote: "HERES JOHNNY",
        title: "The Shining Breakdown",
        source: "Jack Torrance, from The Shining (Stephen King)",
        notes: "A chilling ad-libbed line from a classic horror movie."
    },
    {
        id: 148,
        quote: "COOL COOL COOL",
        title: "Abed's Catchphrase",
        source: "Abed Nadir, from Community (Dan Harmon)",
        notes: "The go-to phrase of a pop-culture obsessed character."
    },
    {
        id: 149,
        quote: "WE HAVE DONE THE IMPOSSIBLE AND THAT MAKES US MIGHTY",
        title: "The Serenity Crew's Motto",
        source: "Mal Reynolds, from Serenity (Joss Whedon)",
        notes: "A line from Captain Mal Reynolds celebrating his crew's accomplishments."
    }
];
