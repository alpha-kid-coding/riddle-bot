const RIDDLE_SETS = [
  [
    {
      question: "The more of me you take, the more you leave behind. What am I?",
      clues: [
        "I appear when you walk on soft ground.",
        "Detectives sometimes look for me at a crime scene."
      ],
      answer: "Footsteps",
      acceptedAnswers: ["foot steps", "foot step", "footstep"]
    },
    {
      question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?",
      clues: [
        "You might fold me and put me in your pocket.",
        "Explorers use me to find their way."
      ],
      answer: "A map"
    },
    {
      question: "I have keys but no locks. I have space but no room. You can enter, but you can't go outside. What am I?",
      clues: [
        "Writers and gamers use me every day.",
        "I have letters arranged in rows."
      ],
      answer: "A keyboard"
    },
    {
      question: "I'm tall when I'm young, and I'm short when I'm old. What am I?",
      clues: [
        "I melt as I burn.",
        "I light up a dark room on birthdays."
      ],
      answer: "A candle"
    },
    {
      question: "What has hands but can't clap?",
      clues: [
        "I tick and tock all day long.",
        "People hang me on the wall to tell the time."
      ],
      answer: "A clock"
    },
    {
      question: "I fly without wings. I cry without eyes. Wherever I go, darkness follows. What am I?",
      clues: [
        "I float across the sky on stormy days.",
        "Farmers hope I bring rain to their crops."
      ],
      answer: "A cloud"
    },
    {
      question: "What can you catch but not throw?",
      clues: [
        "You might get one when running too fast.",
        "Rest and soup can help you recover from me."
      ],
      answer: "A cold"
    },
    {
      question: "I have a neck but no head. I have two arms but no hands. What am I?",
      clues: [
        "You wear me to look sharp.",
        "Buttons or a zipper might close me up."
      ],
      answer: "A shirt"
    },
    {
      question: "What gets wetter the more it dries?",
      clues: [
        "You use me after a bath or shower.",
        "I am soft and usually hung on a rack."
      ],
      answer: "A towel"
    },
    {
      question: "I'm light as a feather, yet the strongest person can't hold me for more than a few minutes. What am I?",
      clues: [
        "You do this without thinking, about 12–20 times per minute.",
        "You need me to stay alive."
      ],
      answer: "Your breath"
    },
    {
      question: "What belongs to you, but other people use it more than you do?",
      clues: [
        "Your friends and teachers say it when they talk to you.",
        "It is not your phone or your toys."
      ],
      answer: "Your name"
    },
    {
      question: "I go all around the world but never leave the corner. What am I?",
      clues: [
        "You lick me to stick me on a letter.",
        "I have a picture and a price printed on me."
      ],
      answer: "A stamp"
    },
    {
      question: "What has a head, a tail, is brown, and has no legs?",
      clues: [
        "Some people flip me to make a decision.",
        "I jingle in your pocket."
      ],
      answer: "A penny"
    },
    {
      question: "I'm found in December, but not in any other month. What am I?",
      clues: [
        "Look at the spelling, not the calendar events.",
        "I'm a letter hiding inside the word."
      ],
      answer: "The letter D"
    },
  ],
  [
    {
      question: "What has to be broken before you can use it?",
      clues: [
        "Chickens hatch out of me.",
        "You might fry me for breakfast."
      ],
      answer: "An egg"
    },
    {
      question: "What is full of holes but still holds water?",
      clues: [
        "You use me to wash dishes or wipe spills.",
        "I am soft and squishy when wet."
      ],
      answer: "A sponge"
    },
    {
      question: "What goes up but never comes down?",
      clues: [
        "You celebrate a new one each year on your birthday.",
        "Grandparents have a higher number than kids."
      ],
      answer: "Your age"
    },
    {
      question: "I'm not alive, but I grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
      clues: [
        "Campfires and candles make me.",
        "Firefighters work hard to put me out."
      ],
      answer: "Fire"
    },
    {
      question: "What has legs but doesn't walk?",
      clues: [
        "You might sit at me to eat dinner.",
        "I have four legs and a flat top."
      ],
      answer: "A table"
    },
    {
      question: "What has one eye but can't see?",
      clues: [
        "Tailors and sewers use me every day.",
        "Thread goes through my tiny hole."
      ],
      answer: "A needle"
    },
    {
      question: "What gets bigger the more you take away from it?",
      clues: [
        "Diggers make me in the ground.",
        "The more dirt you remove, the larger I become."
      ],
      answer: "A hole"
    },
    {
      question: "What has many teeth but can't bite?",
      clues: [
        "You pull me through your hair in the morning.",
        "I help untangle messy locks."
      ],
      answer: "A comb"
    },
    {
      question: "What has words but never speaks?",
      clues: [
        "You read me before bed or at school.",
        "I have pages, a cover, and a spine."
      ],
      answer: "A book"
    },
    {
      question: "What invention lets you look right through a wall?",
      clues: [
        "Sunlight shines through me.",
        "You might open me to let in fresh air."
      ],
      answer: "A window"
    },
    {
      question: "What has a thumb and four fingers but is not alive?",
      clues: [
        "You wear me on your hand when it is cold outside.",
        "I keep your fingers warm in winter."
      ],
      answer: "A glove"
    },
    {
      question: "What building has the most stories?",
      clues: [
        "Librarians work inside me.",
        "You go here to borrow books."
      ],
      answer: "A library"
    },
    {
      question: "What can you hold in your right hand but never in your left hand?",
      clues: [
        "It is part of your own body.",
        "It bends in the middle of your arm."
      ],
      answer: "Your left elbow"
    },
    {
      question: "What has a head and a tail but no body?",
      clues: [
        "You flip me to decide who goes first.",
        "I am a small piece of metal with two sides."
      ],
      answer: "A coin"
    },
    {
      question: "What has a ring but no finger?",
      clues: [
        "You might hear me in the morning to wake up.",
        "I buzz or beep when it is time to get up."
      ],
      answer: "An alarm clock"
    },
    {
      question: "What runs all around the backyard but never moves?",
      clues: [
        "I mark the edge of a yard or garden.",
        "You might climb over me or go through a gate in me."
      ],
      answer: "A fence"
    }
  ],
  [
    {
      question: "What has a face and two hands but no arms or legs?",
      clues: [
        "You check me to know when school starts.",
        "I can hang on a wall."
      ],
      answer: "A clock"
    },
    {
      question: "What has four wheels and flies?",
      clues: [
        "I am usually parked outside.",
        "The flying thing is an insect, not the vehicle."
      ],
      answer: "A garbage truck"
    },
    {
      question: "What comes once in a minute, twice in a moment, but never in a thousand years?",
      clues: [
        "Think about letters in words.",
        "It is the letter M."
      ],
      answer: "The letter M"
    },
    {
      question: "What has one head, one foot, and four legs?",
      clues: [
        "You sleep on me at night.",
        "I usually have pillows and blankets on top."
      ],
      answer: "A bed"
    },
    {
      question: "What has to be filled before it can be used?",
      clues: [
        "You carry me in class.",
        "I can hold pencils and pens."
      ],
      answer: "A pencil case"
    },
    {
      question: "What kind of room has no doors or windows?",
      clues: [
        "You might find me in a forest.",
        "Some are safe to eat, others are not."
      ],
      answer: "A mushroom"
    },
    {
      question: "What has an eye but cannot see?",
      clues: [
        "Storms are known for me.",
        "I can be at the center of a hurricane."
      ],
      answer: "A hurricane"
    },
    {
      question: "What can travel all around the world while staying in one spot?",
      clues: [
        "I stick to an envelope.",
        "Mail carriers see me all the time."
      ],
      answer: "A stamp"
    },
    {
      question: "What has many rings but no fingers?",
      clues: [
        "You can answer me.",
        "I can sit in your pocket."
      ],
      answer: "A telephone"
    },
    {
      question: "What can fill a room but takes up no space?",
      clues: [
        "You flip a switch for me.",
        "The sun gives me during the day."
      ],
      answer: "Light"
    },
    {
      question: "What has a bottom at the top?",
      clues: [
        "You wear me when it is cold.",
        "I go on your head."
      ],
      answer: "Your legs"
    },
    {
      question: "What can you keep after giving to someone?",
      clues: [
        "Friends share me often.",
        "You do this with words."
      ],
      answer: "Your word"
    },
    {
      question: "What has a bark but no bite?",
      clues: [
        "You might climb me in a park.",
        "I grow leaves and branches."
      ],
      answer: "A tree"
    },
    {
      question: "What has keys but can’t open locks?",
      clues: [
        "Musicians play me.",
        "I can be grand or upright."
      ],
      answer: "A piano"
    },
    {
      question: "What has ears but cannot hear?",
      clues: [
        "You can boil or grill me.",
        "It grows on a stalk in fields."
      ],
      answer: "Corn"
    },
    {
      question: "What kind of coat is best put on wet?",
      clues: [
        "Painters use me.",
        "I come in many colors."
      ],
      answer: "A coat of paint"
    },
    {
      question: "What goes up when rain comes down?",
      clues: [
        "You wear me on your feet.",
        "Puddles make this happen."
      ],
      answer: "An umbrella"
    },
    {
      question: "What can you serve but never eat?",
      clues: [
        "Tennis players do this.",
        "It starts a point in a game."
      ],
      answer: "A tennis ball"
    },
    {
      question: "What has legs but does not walk?",
      clues: [
        "You might sit on me in class.",
        "I usually has four legs."
      ],
      answer: "A chair"
    },
    {
      question: "What invention lets you look through a wall?",
      clues: [
        "You can open me to get fresh air.",
        "It is made of glass."
      ],
      answer: "A window"
    },
    {
      question: "What is easy to lift but hard to throw?",
      clues: [
        "You need it every second.",
        "It is all around you."
      ],
      answer: "A feather"
    },
    {
      question: "What has words, but never talks?",
      clues: [
        "You use me to find meanings.",
        "I list terms in alphabetical order."
      ],
      answer: "A dictionary"
    },
    {
      question: "What kind of band never plays music?",
      clues: [
        "You might wear me on your wrist.",
        "Rubber is a common material for me."
      ],
      answer: "A rubber band"
    },
    {
      question: "What can run but never gets tired?",
      clues: [
        "You turn me on with a handle.",
        "Water comes out of me."
      ],
      answer: "A faucet"
    },
    {
      question: "What starts with T, ends with T, and has T inside it?",
      clues: [
        "You drink from me.",
        "I have a spout and a lid."
      ],
      answer: "A teapot"
    }
  ],
  [
    {
      question: "What has a lot of keys but cannot open any doors?",
      clues: [
        "You can play songs on me.",
        "I can be found in concert halls."
      ],
      answer: "A piano"
    },
    {
      question: "What has one horn but does not honk?",
      clues: [
        "I live in myths and fairy tales.",
        "I look like a horse."
      ],
      answer: "A unicorn"
    },
    {
      question: "What can you hear but not see or touch?",
      clues: [
        "I happen when you make noise in a canyon.",
        "I repeat what you say."
      ],
      answer: "An echo"
    },
    {
      question: "What has branches but no fruit, trunk, or leaves?",
      clues: [
        "People save money in me.",
        "You might have an account with me."
      ],
      answer: "A bank"
    },
    {
      question: "What goes through cities and fields, but never moves?",
      clues: [
        "Cars travel on me.",
        "I can be paved with asphalt."
      ],
      answer: "A road"
    },
    {
      question: "What can you hold without ever touching it?",
      clues: [
        "You do this while speaking.",
        "It is made of words."
      ],
      answer: "A conversation"
    },
    {
      question: "What has many needles but does not sew?",
      clues: [
        "I stay green in winter.",
        "I am often used as a Christmas tree."
      ],
      answer: "A pine tree"
    },
    {
      question: "What has an end but no beginning, a home but no family, and a space without a room?",
      clues: [
        "This is about letters in a word.",
        "The word is keyboard."
      ],
      answer: "A keyboard"
    },
    {
      question: "What begins with an E but only contains one letter?",
      clues: [
        "You can mail one.",
        "It holds a message."
      ],
      answer: "An envelope"
    },
    {
      question: "What has cities, but no people?",
      clues: [
        "Travelers use me.",
        "I can show roads and oceans."
      ],
      answer: "A map"
    },
    {
      question: "What can be cracked, made, told, and played?",
      clues: [
        "People laugh at me.",
        "Comedians tell me."
      ],
      answer: "A joke"
    },
    {
      question: "What has a thumb and four fingers but is not a hand?",
      clues: [
        "You wear me in cold weather.",
        "Baseball players use one too."
      ],
      answer: "A glove"
    },
    {
      question: "What can run, jump, and swim but has no legs?",
      clues: [
        "Athletes pass me around.",
        "I can be kicked or thrown."
      ],
      answer: "A ball"
    },
    {
      question: "What room can no one enter?",
      clues: [
        "It grows in damp places.",
        "It can be edible or poisonous."
      ],
      answer: "A mushroom"
    },
    {
      question: "What has a bed but never sleeps?",
      clues: [
        "Boats float on me.",
        "I flow to the sea."
      ],
      answer: "A river"
    },
    {
      question: "What can you break, even if you never pick it up or touch it?",
      clues: [
        "It is about trust.",
        "People hope you keep this."
      ],
      answer: "A promise"
    },
    {
      question: "What has eyes but cannot see?",
      clues: [
        "You put me in soup and salads.",
        "I can make you cry while cutting."
      ],
      answer: "A potato"
    },
    {
      question: "What has one head, one foot, and four legs?",
      clues: [
        "You sleep on me.",
        "I am in your bedroom."
      ],
      answer: "A bed"
    },
    {
      question: "What can be long or short; be grown or bought; be painted or left bare?",
      clues: [
        "They are on your fingers.",
        "People trim me with clippers."
      ],
      answer: "Nails"
    },
    {
      question: "What kind of tree can you carry in your hand?",
      clues: [
        "It is part of your hand.",
        "High fives use it."
      ],
      answer: "A palm"
    },
    {
      question: "What has to be broken before you can use it?",
      clues: [
        "You may scramble or fry me.",
        "Chickens lay me."
      ],
      answer: "An egg"
    },
    {
      question: "What has many words but never speaks?",
      clues: [
        "You can look up definitions in me.",
        "It is usually sorted alphabetically."
      ],
      answer: "A dictionary"
    },
    {
      question: "What can get bigger the more you take away?",
      clues: [
        "It is dug into the ground.",
        "Shovels can make one."
      ],
      answer: "A hole"
    },
    {
      question: "What has a neck but no head?",
      clues: [
        "You might drink water from me.",
        "I can be made of plastic or glass."
      ],
      answer: "A bottle"
    },
    {
      question: "What has many teeth, but cannot bite?",
      clues: [
        "You use me on your hair.",
        "It helps remove tangles."
      ],
      answer: "A comb"
    }
  ],
  [
    {
      question: "What has a heart that doesn’t beat?",
      clues: [
        "You can find me in a deck.",
        "Kings, queens, and aces appear with me."
      ],
      answer: "A card"
    },
    {
      question: "What has stripes but no clothes?",
      clues: [
        "I am an animal.",
        "I look like a horse."
      ],
      answer: "A zebra"
    },
    {
      question: "What has pages but is not a website?",
      clues: [
        "You can read me.",
        "I may have a bookmark."
      ],
      answer: "A book"
    },
    {
      question: "What can you open but not touch?",
      clues: [
        "You can do this with your mouth.",
        "You might do it when surprised."
      ],
      answer: "Your mouth"
    },
    {
      question: "What has one wheel and one seat?",
      clues: [
        "You ride me for balance practice.",
        "Circus performers often use me."
      ],
      answer: "A unicycle"
    },
    {
      question: "What gets sharper the more you use it?",
      clues: [
        "You use it for writing ideas.",
        "Students carry one in a pencil case."
      ],
      answer: "Your mind"
    },
    {
      question: "What has a shell but no phone service?",
      clues: [
        "I move slowly.",
        "I can hide inside my home."
      ],
      answer: "A turtle"
    },
    {
      question: "What is full of keys but can’t open any lock?",
      clues: [
        "Musicians press me.",
        "I can be electric or acoustic."
      ],
      answer: "A piano"
    },
    {
      question: "What has a ring but no finger?",
      clues: [
        "People answer me.",
        "I can be a mobile device."
      ],
      answer: "A phone"
    },
    {
      question: "What has wheels and can fly, but not in the sky?",
      clues: [
        "You roll me along the road.",
        "The flying part is an insect on me."
      ],
      answer: "A garbage truck"
    },
    {
      question: "What has leaves but is not a tree?",
      clues: [
        "You read me in school.",
        "I can be a notebook."
      ],
      answer: "A notebook"
    },
    {
      question: "What can run but never sweats?",
      clues: [
        "You can turn me on in the kitchen.",
        "Water comes from me."
      ],
      answer: "A faucet"
    },
    {
      question: "What can be played but has no cards?",
      clues: [
        "You hear me on headphones.",
        "Artists release albums of me."
      ],
      answer: "Music"
    },
    {
      question: "What has a cap but no head?",
      clues: [
        "You might twist me off.",
        "I cover a drink container."
      ],
      answer: "A bottle"
    },
    {
      question: "What has hands and a face but no body?",
      clues: [
        "I hang on walls.",
        "I tell you when lunch starts."
      ],
      answer: "A clock"
    },
    {
      question: "What can you catch but not hold?",
      clues: [
        "People sometimes get me in winter.",
        "Soup and rest may help."
      ],
      answer: "A cold"
    },
    {
      question: "What has words but no voice?",
      clues: [
        "You may keep me on a shelf.",
        "I can be fiction or nonfiction."
      ],
      answer: "A book"
    },
    {
      question: "What goes up when the rain comes down?",
      clues: [
        "You wear me on your feet.",
        "Puddles make me rise."
      ],
      answer: "An umbrella"
    },
    {
      question: "What has a spine but no bones?",
      clues: [
        "I can have chapters.",
        "Libraries keep many of me."
      ],
      answer: "A book"
    },
    {
      question: "What kind of room has no floor or ceiling?",
      clues: [
        "I grow in damp places.",
        "Some are used in pizza toppings."
      ],
      answer: "A mushroom"
    },
    {
      question: "What has an eye but can’t blink?",
      clues: [
        "Thread passes through me.",
        "I help fix clothes."
      ],
      answer: "A needle"
    },
    {
      question: "What can be cracked, made, and told?",
      clues: [
        "People laugh at me.",
        "Comedians use me."
      ],
      answer: "A joke"
    },
    {
      question: "What has many stories but no ending?",
      clues: [
        "You can visit me downtown.",
        "You borrow books from me."
      ],
      answer: "A library"
    },
    {
      question: "What has a tail and head but no body?",
      clues: [
        "You can flip me.",
        "I can be worth a dollar."
      ],
      answer: "A coin"
    },
    {
      question: "What starts with P, ends with E, and has thousands of letters?",
      clues: [
        "Mail workers handle me.",
        "Stamps are used with me."
      ],
      answer: "A post office"
    }
  ],
  [
    {
      question: "What has one eye but can’t see?",
      clues: [
        "Sewing uses me.",
        "Thread goes through me."
      ],
      answer: "A needle"
    },
    {
      question: "What can be full but still empty?",
      clues: [
        "Think about a container.",
        "It can be full of holes."
      ],
      answer: "A sponge"
    },
    {
      question: "What has teeth but cannot chew?",
      clues: [
        "You use me in front of a mirror.",
        "I untangle hair."
      ],
      answer: "A comb"
    },
    {
      question: "What has bark but no bite?",
      clues: [
        "Birds may nest in me.",
        "I can lose leaves in autumn."
      ],
      answer: "A tree"
    },
    {
      question: "What gets bigger when more is taken away?",
      clues: [
        "You can dig me.",
        "I can be in your backyard."
      ],
      answer: "A hole"
    },
    {
      question: "What can travel around the world while staying in one corner?",
      clues: [
        "I stick to envelopes.",
        "Post offices sell me."
      ],
      answer: "A stamp"
    },
    {
      question: "What has keys but can’t open doors?",
      clues: [
        "I am used on a computer.",
        "You type with me."
      ],
      answer: "A keyboard"
    },
    {
      question: "What has four legs but can’t walk?",
      clues: [
        "Meals are served on me.",
        "Chairs go around me."
      ],
      answer: "A table"
    },
    {
      question: "What has no life but can die?",
      clues: [
        "I power your phone.",
        "You recharge me."
      ],
      answer: "A battery"
    },
    {
      question: "What can fill a room but takes no space?",
      clues: [
        "You can switch me on.",
        "The sun gives me."
      ],
      answer: "Light"
    },
    {
      question: "What has a neck but no head?",
      clues: [
        "You can pour from me.",
        "I might hold milk."
      ],
      answer: "A bottle"
    },
    {
      question: "What has one foot but no legs?",
      clues: [
        "I can stand in a living room.",
        "I may hold a lampshade."
      ],
      answer: "A lamp"
    },
    {
      question: "What has many keys but no locks and can sing?",
      clues: [
        "A musician can sit in front of me.",
        "I can be grand."
      ],
      answer: "A piano"
    },
    {
      question: "What can be written and spoken but never heard?",
      clues: [
        "You can send me on paper.",
        "I can start with Dear."
      ],
      answer: "A letter"
    },
    {
      question: "What can you break without touching?",
      clues: [
        "It is about trust.",
        "People try to keep it."
      ],
      answer: "A promise"
    },
    {
      question: "What is easy to get into but hard to get out of?",
      clues: [
        "People can be in this at school.",
        "You might need to focus to avoid it."
      ],
      answer: "Trouble"
    },
    {
      question: "What has an ear but cannot hear?",
      clues: [
        "You can eat me at a barbecue.",
        "I grow on a stalk."
      ],
      answer: "Corn"
    },
    {
      question: "What can you hold in your left hand but not in your right?",
      clues: [
        "It is part of your body.",
        "Bend your arm to find it."
      ],
      answer: "Your right elbow"
    },
    {
      question: "What has to be broken to be useful?",
      clues: [
        "You may scramble me.",
        "I have a shell."
      ],
      answer: "An egg"
    },
    {
      question: "What has many rings but no jewelry?",
      clues: [
        "You answer me when I call.",
        "I might buzz in your pocket."
      ],
      answer: "A phone"
    },
    {
      question: "What goes up but never comes down?",
      clues: [
        "You celebrate it once a year.",
        "It increases on birthdays."
      ],
      answer: "Your age"
    },
    {
      question: "What has words and numbers but can’t talk?",
      clues: [
        "You hang it on a wall.",
        "It shows months."
      ],
      answer: "A calendar"
    },
    {
      question: "What has cities but no houses?",
      clues: [
        "You use me for directions.",
        "I might fold."
      ],
      answer: "A map"
    },
    {
      question: "What has wings but doesn’t fly?",
      clues: [
        "You find me in many buildings.",
        "People walk up and down me."
      ],
      answer: "A staircase"
    },
    {
      question: "What can’t talk but replies when spoken to?",
      clues: [
        "You might hear me in mountains.",
        "I repeat your words."
      ],
      answer: "An echo"
    }
  ]
];

const RIDDLES = RIDDLE_SETS[0];
