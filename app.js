(function () {
"use strict";
const WORDS = [...["Dog", "Cat", "Fish", "Bird", "Tree", "House", "Chair", "Cup", "Spoon", "Sun", "Moon", "Star", "Rain", "Snow", "Ice", "Fire", "Bed", "Shoe", "Hat", "Ring", "Key", "Door", "Road", "Phone", "Book", "Egg", "Milk", "Bread", "Cheese", "Cake", "Ball", "Box", "Clock", "Glove", "Sock", "Bike", "Boat", "Train", "Car", "Plane", "Frog", "Duck", "Cow", "Pig", "Sheep", "Horse", "Mouse", "Bear", "Lion", "Wolf", "Fox", "Owl", "Bee", "Ant", "Web", "Nest", "Leaf", "Root", "Branch", "Rock", "Sand", "Wave", "Cloud", "Wind", "Storm", "Lake", "Pond", "Hill", "Cave", "Path", "Bridge", "Gate", "Wall", "Roof", "Floor", "Lamp", "Rug", "Sink", "Bath", "Soap", "Towel", "Brush", "Comb", "Mirror", "Watch", "Belt", "Coat", "Scarf", "Purse", "Wallet", "Coin", "Bell", "Drum", "Flute", "Kite", "Sled", "Swing", "Slide", "Fence", "Barn", "Well", "Farm", "Field", "Seed", "Nut", "Fruit", "Grape", "Lemon", "Peach", "Plum", "Corn", "Rice", "Soup", "Salt", "Sugar", "Jam", "Butter", "Toast", "Juice", "Tea", "Shark", "Whale", "Crab", "Snail", "Spider", "Turtle", "Rabbit", "Squid", "Camel", "Zebra", "Tiger", "Panda", "Koala", "Goat", "Deer", "Chick", "Swan", "Peacock", "Parrot", "Robin", "Ship", "Truck", "Bus", "Van", "Jeep", "Scooter", "Skate", "Ladder", "Hammer", "Nail", "Screw", "Wrench", "Saw", "Axe", "Shovel", "Rake", "Hose", "Bucket", "Broom", "Mop", "Sponge", "Candle", "Match", "Torch", "Lantern", "Kettle", "Pan", "Pot", "Plate", "Bowl", "Fork", "Knife", "Napkin", "Tray", "Jar", "Bottle", "Straw", "Nose", "Eye", "Ear", "Hand", "Foot", "Arm", "Leg", "Head", "Chin", "Cheek", "Thumb", "Elbow", "Knee", "Wrist", "Ankle", "Skull", "Spine", "Rib", "Heart", "Lung", "Brain", "Blood", "Skin", "Bone", "Muscle", "Vein", "Puddle", "Thunder", "Lightning", "Frost", "Hail", "Breeze", "Fog", "Mist", "Dew", "Dust", "Mud", "Grass", "Weed", "Moss", "Vine", "Bush", "Twig"].map(w => ({
  w,
  tier: "Easy",
  pts: 1
})), ...["Toothbrush", "Sunflower", "Backpack", "Rainbow", "Football", "Birthday", "Breakfast", "Weekend", "Sandwich", "Kitchen", "Garden", "Laptop", "Blanket", "Mountain", "Ocean", "Castle", "Robot", "Pirate", "Ghost", "Dragon", "Wizard", "Teacher", "Doctor", "Farmer", "Painter", "Singer", "Dancer", "Wedding", "Snowman", "Campfire", "Treehouse", "Lighthouse", "Waterfall", "Bookshelf", "Umbrella", "Necklace", "Bracelet", "Sunglasses", "Notebook", "Calendar", "Envelope", "Passport", "Suitcase", "Elevator", "Escalator", "Skyscraper", "Apartment", "Bathroom", "Bedroom", "Fireplace", "Staircase", "Balcony", "Driveway", "Sidewalk", "Playground", "Classroom", "Library", "Hospital", "Airport", "Stadium", "Cinema", "Museum", "Aquarium", "Zookeeper", "Astronaut", "Scientist", "Detective", "Superhero", "Vampire", "Werewolf", "Mermaid", "Unicorn", "Dinosaur", "Butterfly", "Ladybug", "Squirrel", "Hedgehog", "Kangaroo", "Penguin", "Dolphin", "Octopus", "Jellyfish", "Volcano", "Avalanche", "Hurricane", "Tornado", "Earthquake", "Compass", "Telescope", "Microscope", "Calculator", "Keyboard", "Headphones", "Microphone", "Speaker", "Camera", "Bicycle", "Motorcycle", "Helicopter", "Refrigerator", "Dishwasher", "Microwave", "Thermostat", "Wardrobe", "Mattress", "Pillowcase", "Curtains", "Chandelier", "Doormat", "Flowerpot", "Greenhouse", "Orchard", "Vineyard", "Meadow", "Valley", "Canyon", "Glacier", "Rainforest", "Desert", "Savannah", "Coastline", "Peninsula", "Continent", "Hemisphere", "Equator", "Astronomer", "Archaeologist", "Photographer", "Journalist", "Architect", "Electrician", "Plumber", "Mechanic", "Librarian", "Chef", "Waiter", "Cashier", "Lifeguard", "Firefighter", "Paramedic", "Skateboard", "Trampoline", "Basketball", "Volleyball", "Badminton", "Gymnastics", "Wrestling", "Marathon", "Triathlon", "Tournament", "Championship", "Scoreboard", "Stopwatch", "Treadmill", "Dumbbell", "Gymnasium", "Locker room", "Referee", "Spectator", "Cheerleader", "Mascot", "Trophy case", "Certificate", "Diploma", "Graduation", "University", "Professor", "Principal", "Headmaster", "Curriculum", "Textbook", "Dictionary", "Thesaurus", "Chalkboard", "Whiteboard", "Projector", "Highlighter", "Stapler", "Paperclip", "Rubber band", "Filing cabinet", "Spreadsheet", "Presentation", "Conference", "Boardroom", "Headquarters", "Warehouse", "Factory", "Assembly line", "Forklift", "Container", "Cargo ship", "Submarine", "Battleship", "Aircraft carrier", "Spacecraft", "Satellite", "Planetarium", "Constellation", "Asteroid", "Meteorite", "Comet", "Nebula", "Galaxy", "Universe", "Wormhole", "Spaceship", "Cosmonaut", "Rocket launch", "Mission control", "Space station", "Zero gravity", "Moon landing", "Solar panel", "Wind turbine", "Power plant", "Nuclear reactor", "Electric car", "Traffic light", "Roundabout"].map(w => ({
  w,
  tier: "Medium",
  pts: 1
})), ...["Time flies", "Best friend", "Hard work", "Deep thought", "First date", "Road trip", "Home run", "Ice cream truck", "Full moon", "Bad luck", "Good luck", "Cold feet", "Sweet tooth", "Dead end", "Fresh start", "Small talk", "Big deal", "Worst case", "Main course", "Night owl", "Early bird", "Wild card", "Safe bet", "Long shot", "Close call", "Fine print", "Piece of cake", "Break a leg", "Spill the beans", "Hit the road", "Under the weather", "Once in a blue moon", "Costs an arm and a leg", "Bite the bullet", "Let the cat out of the bag", "Kill two birds with one stone", "On thin ice", "Burning the midnight oil", "Barking up the wrong tree", "Beat around the bush", "Cut corners", "Draw the line", "Face the music", "Get cold feet", "Go the extra mile", "Hit the sack", "In the same boat", "Jump the gun", "Keep an eye out", "Last straw", "Miss the boat", "Off the hook", "On the fence", "Out of the blue", "Pull yourself together", "Put it off", "Rain check", "Read between the lines", "Ring a bell", "See eye to eye", "Sit tight", "Speak of the devil", "Take it easy", "Talk of the town", "Throw in the towel", "Time will tell", "Turn a blind eye", "Under my skin", "Up in the air", "Water under the bridge", "Wear thin", "Weigh your options", "Wide awake", "Word of mouth", "Zero in on", "Back to square one", "Blessing in disguise", "Call it a day", "Break the ice", "Cry over spilled milk", "Curiosity killed the cat", "Actions speak louder than words", "Practice makes perfect", "Better late than never", "Easy come easy go", "No pain no gain", "When pigs fly", "Add fuel to the fire", "Elephant in the room", "Fish out of water", "Green with envy", "Hold your horses", "In hot water", "Kick the bucket", "Let sleeping dogs lie", "Mind over matter", "Once bitten twice shy", "Out of the woods", "Straight from the horse's mouth", "The ball is in your court", "Bark is worse than bite", "Been there done that", "Bend over backwards", "Bite off more than you can chew", "Blood is thicker than water", "Burn the candle at both ends", "Butterflies in your stomach", "By the skin of your teeth", "Don't judge a book by its cover", "Every cloud has a silver lining", "Get your act together", "Give the benefit of the doubt", "Go back to the drawing board", "Hit the nail on the head", "It takes two to tango", "Keep your chin up", "Let the chips fall where they may", "Make a long story short", "Not playing with a full deck", "Once in a lifetime", "Out of sight out of mind", "Piece of the puzzle", "Put all your eggs in one basket", "Quick as a flash", "Raining cats and dogs", "Slow and steady wins the race", "Take the bull by the horns", "The best of both worlds", "The grass is always greener", "The tip of the iceberg", "Third time's the charm", "Throw caution to the wind", "Time heals all wounds", "Turn over a new leaf", "Two peas in a pod", "Under the radar", "Up to speed", "What goes around comes around", "You can't have your cake and eat it too", "Bite your tongue", "Break the bank", "Caught red handed", "Chip on your shoulder", "Come rain or shine", "Cut to the chase", "Devil's advocate", "Down to the wire", "Get a taste of your own medicine", "Go cold turkey", "Hang in there", "Have a change of heart", "Hit close to home", "In the nick of time", "Jump on the bandwagon", "Learn the ropes", "Living on borrowed time", "Make ends meet", "Not my cup of tea", "On the same page", "Rome wasn't built in a day"].map(w => ({
  w,
  tier: "Hard",
  pts: 2
})), ...["Democracy", "Television", "Imagination", "Understanding", "Opportunity", "Generation", "Environment", "Technology", "Celebration", "Information", "Transportation", "Conversation", "Motivation", "Temperature", "Personality", "Philosophy", "Psychology", "Architecture", "Civilization", "Independence", "Responsibility", "Communication", "Determination", "Sophistication", "Exaggeration", "Congratulations", "Extraordinary", "Unbelievable", "Miscellaneous", "Simultaneously", "Consideration", "Recommendation", "Investigation", "Documentation", "Organization", "Administration", "Qualification", "Justification", "Reconciliation", "Interpretation", "Transformation", "Collaboration", "Appreciation", "Anticipation", "Sustainability", "Anniversary", "Bureaucracy", "Catastrophe", "Choreography", "Diplomacy", "Encyclopedia", "Extravagant", "Hypothesis", "Infrastructure", "Legislation", "Manufacturing", "Negotiation", "Nutritional", "Observatory", "Perpendicular", "Kaleidoscope", "Refrigeration", "Revolutionary", "Renaissance", "Subconscious", "Superstitious", "Unpredictable", "Vegetarian", "Vulnerability", "Xenophobia", "Procrastination", "Claustrophobia", "Anthropology", "Archaeology", "Meteorology", "Astrology", "Numerology", "Mythology", "Terminology", "Methodology", "Chronological", "Geographical", "Mathematical", "Philosophical", "Psychological", "Biographical", "Autobiography", "Bibliography", "Photography", "Cinematography", "Entrepreneurship", "Philanthropy", "Extraterrestrial", "Interdisciplinary", "Overpopulation", "Underestimate", "Overwhelming", "Unconventional", "Irresponsible", "Incomprehensible"].map(w => ({
  w,
  tier: "Curveball",
  pts: 3
})), ...["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Chad", "Chile", "China", "Colombia", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Ecuador", "Egypt", "El Salvador", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "Senegal", "Serbia", "Seychelles", "Singapore", "Slovakia", "Slovenia", "Somalia", "Spain", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "United States", "United Kingdom", "United Arab Emirates", "North Korea", "South Sudan", "Trinidad and Tobago", "Dominican Republic", "Antigua and Barbuda", "Saint Lucia", "Saint Kitts and Nevis", "Saint Vincent and the Grenadines", "Papua New Guinea", "Solomon Islands", "Marshall Islands", "Micronesia", "Timor-Leste", "Central African Republic", "Democratic Republic of Congo", "Equatorial Guinea", "Guinea-Bissau", "Ivory Coast", "Sierra Leone", "Cape Verde", "Sao Tome and Principe", "Comoros", "Mauritius", "Mauritania", "San Marino", "Vatican City", "North Macedonia"].map(w => ({
  w,
  tier: "Country",
  pts: 2
})), ...["London", "Paris", "Tokyo", "Berlin", "Madrid", "Rome", "Vienna", "Amsterdam", "Dublin", "Lisbon", "Prague", "Warsaw", "Budapest", "Athens", "Stockholm", "Oslo", "Helsinki", "Copenhagen", "Brussels", "Zurich", "Geneva", "Munich", "Hamburg", "Barcelona", "Seville", "Milan", "Naples", "Venice", "Florence", "Krakow", "Moscow", "Istanbul", "Cairo", "Nairobi", "Lagos", "Marrakech", "Casablanca", "Cape Town", "Johannesburg", "Dubai", "Doha", "Riyadh", "Tehran", "Baghdad", "Jerusalem", "Beirut", "Mumbai", "Delhi", "Bangalore", "Kolkata", "Karachi", "Lahore", "Dhaka", "Beijing", "Shanghai", "Hong Kong", "Seoul", "Osaka", "Kyoto", "Bangkok", "Hanoi", "Jakarta", "Manila", "Singapore City", "Kuala Lumpur", "Sydney", "Melbourne", "Auckland", "Wellington", "Toronto", "Vancouver", "Montreal", "Ottawa", "New York", "Los Angeles", "Chicago", "Houston", "Miami", "Boston", "Seattle", "Washington", "San Francisco", "Las Vegas", "Mexico City", "Havana", "Bogota", "Lima", "Santiago", "Buenos Aires", "Rio de Janeiro", "Sao Paulo", "Quito", "Caracas", "Montevideo", "Brasilia", "Reykjavik", "Edinburgh", "Glasgow", "Belfast", "Cardiff", "Manchester", "Liverpool", "Birmingham", "Leeds", "Bristol", "Oxford", "Cambridge", "Nottingham", "Sheffield", "Frankfurt", "Cologne", "Stuttgart", "Dusseldorf", "Rotterdam", "Antwerp", "Porto", "Valencia", "Turin", "Bologna", "Zagreb", "Belgrade", "Bucharest", "Sofia", "Bratislava", "Ljubljana", "Vilnius", "Riga", "Tallinn", "Minsk", "Kyiv", "St Petersburg", "Baku", "Yerevan", "Tbilisi", "Almaty", "Tashkent", "Islamabad", "Kathmandu", "Colombo", "Yangon", "Dallas", "Austin", "Phoenix", "Denver", "Atlanta", "Philadelphia", "Detroit", "Minneapolis", "Portland", "San Diego", "Nashville", "Orlando", "Tampa", "Charlotte", "Baltimore", "Pittsburgh", "Cleveland", "Cincinnati", "Kansas City", "St Louis", "New Orleans", "Salt Lake City", "Sacramento", "San Jose", "Fort Worth", "El Paso", "Memphis", "Louisville", "Milwaukee", "Albuquerque", "Tucson", "Fresno", "Omaha", "Raleigh", "Richmond", "Buffalo", "Rochester", "Hartford", "Providence", "Newark", "Calgary", "Edmonton", "Winnipeg", "Quebec City", "Halifax", "Guadalajara", "Monterrey", "Tijuana", "Cancun", "Medellin", "Cali", "Guayaquil", "La Paz", "Asuncion", "Cordoba", "Rosario", "Curitiba", "Salvador", "Fortaleza", "Recife", "Manaus", "Belem", "Porto Alegre", "Brisbane", "Perth", "Adelaide", "Christchurch", "Suva", "Port Moresby", "Male", "Phnom Penh", "Vientiane", "Ulaanbaatar", "Astana", "Bishkek", "Dushanbe", "Ashgabat", "Muscat", "Manama", "Amman"].map(w => ({
  w,
  tier: "City",
  pts: 2
})), ...["Albert Einstein", "Isaac Newton", "Charles Darwin", "Marie Curie", "Galileo Galilei", "Nikola Tesla", "Thomas Edison", "Leonardo da Vinci", "Michelangelo", "Vincent van Gogh", "Pablo Picasso", "Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "William Shakespeare", "Jane Austen", "Charles Dickens", "Mark Twain", "Ernest Hemingway", "Napoleon Bonaparte", "Julius Caesar", "Cleopatra", "Alexander the Great", "Winston Churchill", "Abraham Lincoln", "George Washington", "Franklin Roosevelt", "Queen Victoria", "Elizabeth I", "Henry VIII", "Genghis Khan", "Christopher Columbus", "Marco Polo", "Amelia Earhart", "Neil Armstrong", "Martin Luther King", "Nelson Mandela", "Mahatma Gandhi", "Mother Teresa", "Florence Nightingale", "Rosa Parks", "Malcolm X", "Frederick Douglass", "Harriet Tubman", "Anne Frank", "Sigmund Freud", "Karl Marx", "Adam Smith", "Confucius", "Aristotle", "Plato", "Socrates", "Julius Nyerere", "Emmeline Pankhurst", "Joan of Arc", "William Wallace", "Vlad the Impaler", "Catherine the Great", "Ivan the Terrible", "Otto von Bismarck", "Louis Pasteur", "Alexander Graham Bell", "Wright Brothers", "Guglielmo Marconi", "Benjamin Franklin", "Thomas Jefferson", "Karl Benz", "Henry Ford", "Walt Disney", "Coco Chanel", "Audrey Hepburn", "Marilyn Monroe", "Elvis Presley", "John Lennon", "Muhammad Ali", "Pele", "Lionel Messi", "Cristiano Ronaldo", "Serena Williams", "LeBron James", "Usain Bolt", "Simone Biles", "Tiger Woods", "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Taylor Swift", "Beyoncé", "Ed Sheeran", "Adele", "Rihanna", "Drake", "Elton John", "Paul McCartney", "Dolly Parton", "Billie Eilish", "Tom Hanks", "Meryl Streep", "Leonardo DiCaprio", "Emma Watson", "Dwayne Johnson", "Scarlett Johansson", "Denzel Washington", "Morgan Freeman", "Elon Musk", "Bill Gates", "Jeff Bezos", "Mark Zuckerberg", "Warren Buffett", "Steve Jobs", "Oprah Winfrey", "Stephen Hawking", "David Attenborough", "Jane Goodall", "Neil deGrasse Tyson", "Queen Elizabeth II", "King Charles III", "Prince William", "Princess Diana", "Greta Thunberg", "Malala Yousafzai", "J.K. Rowling", "Stephen King", "Gordon Ramsay", "Jamie Oliver", "Barack Obama", "Michelle Obama", "Angela Merkel", "Emmanuel Macron", "Justin Trudeau", "Jacinda Ardern", "Pope Francis", "Dalai Lama", "Kobe Bryant", "Michael Jordan", "Tom Brady", "David Beckham", "Will Smith", "Robert Downey Jr", "Johnny Depp", "Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Zendaya", "Harry Styles", "Ariana Grande", "Bruno Mars", "Shakira", "Lady Gaga", "Katy Perry", "Selena Gomez", "Marie Antoinette", "Louis XIV", "Peter the Great", "Suleiman the Magnificent", "Akbar the Great", "Tutankhamun", "Ramesses II", "Hammurabi", "Nebuchadnezzar", "Attila the Hun", "Hannibal Barca", "Spartacus", "Boudica", "King Arthur", "Robin Hood", "William the Conqueror", "Richard the Lionheart", "Charlemagne", "Martin Luther", "John Calvin", "Johannes Kepler", "Nicolaus Copernicus", "Charles Babbage", "Ada Lovelace", "Gregor Mendel", "Dmitri Mendeleev", "Michael Faraday", "James Clerk Maxwell", "Ernest Rutherford", "Niels Bohr", "Werner Heisenberg", "Max Planck", "Enrico Fermi", "J Robert Oppenheimer", "Alan Turing", "John von Neumann", "Rosalind Franklin", "Barbara McClintock", "Ferdinand Magellan", "Vasco da Gama", "Michael Phelps", "Katie Ledecky", "Naomi Osaka", "Coco Gauff", "Shohei Ohtani", "Patrick Mahomes", "Lewis Hamilton", "Max Verstappen", "Neymar", "Kylian Mbappe", "Erling Haaland", "Virat Kohli", "Sachin Tendulkar", "Andy Murray", "Emma Raducanu", "Allyson Felix", "Eliud Kipchoge", "Sam Smith", "Dua Lipa", "Olivia Rodrigo", "The Weeknd", "Justin Bieber", "Kendrick Lamar", "Jay-Z", "Kanye West", "Adam Sandler", "Tom Cruise", "Will Ferrell", "Chris Hemsworth", "Ryan Reynolds", "Margot Robbie", "Emma Stone", "Timothee Chalamet", "Florence Pugh", "Cillian Murphy", "Idris Elba", "Hugh Jackman", "Keanu Reeves", "Sundar Pichai", "Satya Nadella"].map(w => ({
  w,
  tier: "Person",
  pts: 3
})), ...["Theory of relativity", "Natural selection", "Photosynthesis", "Global warming", "Climate change", "Artificial intelligence", "Renewable energy", "Solar system", "Black hole", "Big Bang theory", "Quantum physics", "Nuclear fusion", "Nuclear fission", "Periodic table", "Chemical reaction", "DNA structure", "Human genome", "Stem cells", "Vaccination", "Herd immunity", "Greenhouse effect", "Ozone layer", "Carbon footprint", "Fossil fuels", "Deforestation", "Biodiversity", "Ecosystem", "Food chain", "Water cycle", "Plate tectonics", "Continental drift", "Industrial Revolution", "French Revolution", "Cold War", "World War One", "World War Two", "Berlin Wall", "Civil rights movement", "Suffragette movement", "Colonialism", "Apartheid", "The Holocaust", "United Nations", "European Union", "Supply and demand", "Inflation", "Stock market", "Cryptocurrency", "Blockchain", "Social media", "Cyberbullying", "Fake news", "Freedom of speech", "Human rights", "Gender equality", "Mental health", "Peer pressure", "Body image", "Social mobility", "Space exploration", "Time travel", "Parallel universe", "Genetic engineering", "Cloning", "Organ transplant", "Antibiotic resistance", "Pandemic", "Immune system", "Metabolism", "Puberty", "Adolescence", "Existentialism", "Utilitarianism", "Capitalism", "Socialism", "Communism", "Feminism", "Nationalism", "Globalization", "Multiculturalism", "Refugee crisis", "Income inequality", "Minimum wage", "Universal healthcare", "Renewable resources", "Endangered species", "Extinction event", "Ice age", "Evolution", "Gravity", "Magnetism", "Electricity", "Friction", "Velocity", "Momentum", "Radioactivity", "Speed of light", "Chain reaction", "Cell division", "Circulatory system", "Newton's laws of motion", "Laws of thermodynamics", "Conservation of energy", "Speed of sound", "Electromagnetic spectrum", "Wave-particle duality", "String theory", "Dark matter", "Dark energy", "Event horizon", "Multiverse theory", "Artificial neural network", "Machine learning", "Virtual reality", "Augmented reality", "Internet of things", "Autonomous vehicles", "Space race", "Arms race", "Nuclear deterrent", "Proxy war", "Iron Curtain", "Berlin Airlift", "Cuban Missile Crisis", "Marshall Plan", "Treaty of Versailles", "League of Nations", "Magna Carta", "Bill of Rights", "Declaration of Independence", "Emancipation Proclamation", "Trail of Tears", "Manifest Destiny", "Gold rush", "Great Depression", "New Deal", "Prohibition era", "Space shuttle program", "International Space Station", "Mars rover", "Fair trade", "Free trade agreement", "Trade deficit", "Gross domestic product", "Interest rate", "Compound interest", "Credit score", "Bankruptcy", "Recession", "Monopoly", "Free market", "Mixed economy", "Welfare state", "Universal basic income", "Gig economy", "Automation", "Outsourcing", "Corporate tax", "Tax evasion", "Whistleblower"].map(w => ({
  w,
  tier: "Concept",
  pts: 3
}))];
function Flame({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    stroke: "none"
  }, React.createElement("path", {
    d: "M12 22c4 0 7-3 7-7 0-3-2-5-3-7 0 2-1 3-2 3-2 0-2-3-1-6-4 2-6 6-6 10 0 4 2 7 5 7z"
  }));
}
function Play({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    stroke: "none"
  }, React.createElement("polygon", {
    points: "6,4 20,12 6,20"
  }));
}
function Check({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "4,13 9,18 20,6"
  }));
}
function SkipForward({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: color,
    stroke: "none"
  }, React.createElement("polygon", {
    points: "5,4 13,12 5,20"
  }), React.createElement("rect", {
    x: "16",
    y: "4",
    width: "3",
    height: "16"
  }));
}
function Hammer({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("rect", {
    x: "14.5",
    y: "2.5",
    width: "6",
    height: "7",
    rx: "1",
    transform: "rotate(45 17.5 6)"
  }), React.createElement("path", {
    d: "M15.5 9.5L5 20"
  }), React.createElement("path", {
    d: "M3 22l2-5 3 3-5 2z"
  }));
}
function Trophy({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M8 4h8v5a4 4 0 0 1-8 0V4z"
  }), React.createElement("path", {
    d: "M8 5H5a2 2 0 0 0 0 4h1"
  }), React.createElement("path", {
    d: "M16 5h3a2 2 0 0 1 0 4h-1"
  }), React.createElement("path", {
    d: "M10 15v2a2 2 0 0 0 4 0v-2"
  }), React.createElement("path", {
    d: "M8 21h8"
  }), React.createElement("path", {
    d: "M10 18h4"
  }));
}
function RotateCcw({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("path", {
    d: "M3 12a9 9 0 1 0 3-6.7"
  }), React.createElement("polyline", {
    points: "3,3 3,9 9,9"
  }));
}
function X({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round"
  }, React.createElement("line", {
    x1: "5",
    y1: "5",
    x2: "19",
    y2: "19"
  }), React.createElement("line", {
    x1: "19",
    y1: "5",
    x2: "5",
    y2: "19"
  }));
}
function HelpCircle({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), React.createElement("path", {
    d: "M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 1-1 1.9"
  }), React.createElement("line", {
    x1: "12",
    y1: "17",
    x2: "12",
    y2: "17.1"
  }));
}
function Users({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("circle", {
    cx: "9",
    cy: "8",
    r: "3.5"
  }), React.createElement("path", {
    d: "M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6"
  }), React.createElement("circle", {
    cx: "17.5",
    cy: "8.5",
    r: "2.8"
  }), React.createElement("path", {
    d: "M15.5 14.3c2.8.6 4.8 2.7 5 5.7"
  }));
}
function Trash2({
  size = 24,
  color = "currentColor",
  className
}) {
  return React.createElement("svg", {
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("polyline", {
    points: "3,6 5,6 21,6"
  }), React.createElement("path", {
    d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  }), React.createElement("path", {
    d: "M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
  }), React.createElement("line", {
    x1: "10",
    y1: "11",
    x2: "10",
    y2: "17"
  }), React.createElement("line", {
    x1: "14",
    y1: "11",
    x2: "14",
    y2: "17"
  }));
}
const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;
const TEAM_COLORS = ["#6E9B7A", "#C1502E", "#4E7FA8"];
const TEAM_COLORS_DIM = ["#3E5A47", "#6B2D19", "#2C465A"];
const ROUND_SECONDS = 60;
const FREE_SKIPS = 3;
const STORAGE_TEAM_KEY = "cavetalk:stats:teams";
const STORAGE_PLAYER_KEY = "cavetalk:stats:players";
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function CaveTalk() {
  const [phase, setPhase] = useState("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(["Team A", "Team B", "Team C"]);
  const [teamPlayers, setTeamPlayers] = useState(["", "", ""]);
  const [targetScore, setTargetScore] = useState(15);
  const [scores, setScores] = useState([0, 0, 0]);
  const [currentTeam, setCurrentTeam] = useState(0);
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [roundScore, setRoundScore] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [roundEndReason, setRoundEndReason] = useState(null);
  const [shake, setShake] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [teamStats, setTeamStats] = useState({});
  const [playerStats, setPlayerStats] = useState({});
  const [statsLoaded, setStatsLoaded] = useState(false);
  const intervalRef = useRef(null);
  useEffect(() => {
    try {
      const t = localStorage.getItem(STORAGE_TEAM_KEY);
      if (t) setTeamStats(JSON.parse(t));
    } catch (e) {}
    try {
      const p = localStorage.getItem(STORAGE_PLAYER_KEY);
      if (p) setPlayerStats(JSON.parse(p));
    } catch (e) {}
    setStatsLoaded(true);
  }, []);
  const saveStats = (key, obj) => {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {}
  };
  const parsePlayers = str => (str || "").split(",").map(s => s.trim()).filter(Boolean);
  const recordMatchStart = () => {
    const activeTeamNames = teamNames.slice(0, teamCount);
    const allPlayers = teamPlayers.slice(0, teamCount).flatMap(parsePlayers);
    setTeamStats(prev => {
      const next = {
        ...prev
      };
      activeTeamNames.forEach(name => {
        const cur = next[name] || {
          wins: 0,
          played: 0
        };
        next[name] = {
          ...cur,
          played: cur.played + 1
        };
      });
      saveStats(STORAGE_TEAM_KEY, next);
      return next;
    });
    if (allPlayers.length) {
      setPlayerStats(prev => {
        const next = {
          ...prev
        };
        allPlayers.forEach(name => {
          const cur = next[name] || {
            wins: 0,
            played: 0
          };
          next[name] = {
            ...cur,
            played: cur.played + 1
          };
        });
        saveStats(STORAGE_PLAYER_KEY, next);
        return next;
      });
    }
  };
  const recordWin = winnerIdx => {
    const winnerName = teamNames[winnerIdx];
    setTeamStats(prev => {
      const next = {
        ...prev
      };
      const cur = next[winnerName] || {
        wins: 0,
        played: 0
      };
      next[winnerName] = {
        ...cur,
        wins: cur.wins + 1
      };
      saveStats(STORAGE_TEAM_KEY, next);
      return next;
    });
    const winners = parsePlayers(teamPlayers[winnerIdx]);
    if (winners.length) {
      setPlayerStats(prev => {
        const next = {
          ...prev
        };
        winners.forEach(name => {
          const cur = next[name] || {
            wins: 0,
            played: 0
          };
          next[name] = {
            ...cur,
            wins: cur.wins + 1
          };
        });
        saveStats(STORAGE_PLAYER_KEY, next);
        return next;
      });
    }
  };
  const resetStats = () => {
    setTeamStats({});
    setPlayerStats({});
    saveStats(STORAGE_TEAM_KEY, {});
    saveStats(STORAGE_PLAYER_KEY, {});
  };
  const drawFrom = useCallback(currentDeck => {
    if (currentDeck.length === 0) {
      const fresh = shuffle(WORDS);
      return {
        card: fresh[0],
        rest: fresh.slice(1)
      };
    }
    return {
      card: currentDeck[0],
      rest: currentDeck.slice(1)
    };
  }, []);
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  const endRound = useCallback(reason => {
    clearTimer();
    setRoundEndReason(reason);
    setScores(prev => {
      const next = [...prev];
      if (next[currentTeam] >= targetScore) {
        setPhase("gameOver");
        recordWin(currentTeam);
      } else {
        setPhase("roundEnd");
      }
      return next;
    });
  }, [currentTeam, targetScore, teamNames, teamPlayers, teamCount]);
  useEffect(() => {
    if (phase !== "playing") return;
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endRound("time");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, endRound]);
  useEffect(() => {
    if (phase !== "playing" || !("wakeLock" in navigator)) return;
    let lock = null;
    let cancelled = false;
    const acquire = async () => {
      try {
        const l = await navigator.wakeLock.request("screen");
        if (cancelled) l.release().catch(() => {});else lock = l;
      } catch (e) {}
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && (!lock || lock.released)) acquire();
    };
    acquire();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      if (lock) lock.release().catch(() => {});
    };
  }, [phase]);
  useEffect(() => {
    document.documentElement.dataset.phase = phase;
  }, [phase]);
  const startGame = () => {
    setScores(Array(teamCount).fill(0));
    setCurrentTeam(0);
    setDeck(shuffle(WORDS));
    recordMatchStart();
    setPhase("ready");
  };
  const startRound = () => {
    const {
      card,
      rest
    } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
    setTimeLeft(ROUND_SECONDS);
    setRoundScore(0);
    setSkipsUsed(0);
    setPhase("playing");
  };
  const handleCorrect = () => {
    setScores(prev => {
      const next = [...prev];
      next[currentTeam] += currentCard.pts;
      return next;
    });
    setRoundScore(r => r + currentCard.pts);
    const {
      card,
      rest
    } = drawFrom(deck);
    setDeck(rest);
    setCurrentCard(card);
  };
  const handleSkip = () => {
    const nextSkipCount = skipsUsed + 1;
    setSkipsUsed(nextSkipCount);
    const penalized = nextSkipCount > FREE_SKIPS;
    if (penalized) {
      setScores(prev => {
        const next = [...prev];
        next[currentTeam] = Math.max(0, next[currentTeam] - 1);
        return next;
      });
      setRoundScore(r => r - 1);
    }
    const {
      card,
      rest
    } = drawFrom(deck);
    setDeck([...rest, currentCard]);
    setCurrentCard(card);
  };
  const handleBonk = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setTimeout(() => endRound("bonk"), 350);
  };
  const nextTurn = () => {
    setCurrentTeam(t => (t + 1) % teamCount);
    setPhase("ready");
  };
  const playAgain = () => {
    setScores(Array(teamCount).fill(0));
    setCurrentTeam(0);
    setDeck(shuffle(WORDS));
    recordMatchStart();
    setPhase("ready");
  };
  const winner = scores.slice(0, teamCount).findIndex(s => s >= targetScore);
  const hasWinner = winner !== -1;
  return React.createElement("div", {
    className: "app-shell w-full flex flex-col items-center",
    style: {
      background: "radial-gradient(ellipse at 50% -10%, #2A2118 0%, #1B1712 55%, #100D0A 100%)",
      color: "#F1E9D8"
    }
  }, React.createElement("style", null, `
        .font-display { font-family: 'Big Shoulders Stencil', sans-serif; letter-spacing: 0.02em; }
        .font-body { font-family: 'Space Grotesk', sans-serif; }
        @keyframes flicker {
          0%,100% { opacity: 1; transform: scale(1) rotate(0deg); }
          25% { opacity: 0.85; transform: scale(1.05) rotate(-2deg); }
          50% { opacity: 0.95; transform: scale(0.97) rotate(2deg); }
          75% { opacity: 0.9; transform: scale(1.03) rotate(-1deg); }
        }
        .flicker { animation: flicker 2.2s ease-in-out infinite; }
        @keyframes shakeAnim {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-10px) rotate(-1deg); }
          40% { transform: translateX(9px) rotate(1deg); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        .shake { animation: shakeAnim 0.4s ease-in-out; }
        @keyframes cardIn {
          0% { opacity: 0; transform: translateY(8px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-in { animation: cardIn 0.25s ease-out; }
        .chisel { text-shadow: 0 1px 0 rgba(255,255,255,0.08), 0 -1px 0 rgba(0,0,0,0.6); }
      `), React.createElement("div", {
    className: "w-full max-w-md flex-1 flex flex-col px-5 pt-6 pb-8 relative"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-2"
  }, React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement(Flame, {
    className: "flicker",
    size: 22,
    color: "#E8A33D"
  }), React.createElement("h1", {
    className: "font-display text-3xl chisel",
    style: {
      color: "#F1E9D8"
    }
  }, "CAVE TALK")), React.createElement("div", {
    className: "flex items-center gap-2"
  }, React.createElement("button", {
    onClick: () => setShowLeaderboard(true),
    className: "rounded-full p-2 border",
    style: {
      borderColor: "#4A4038"
    },
    "aria-label": "Leaderboard"
  }, React.createElement(Trophy, {
    size: 20,
    color: "#C9BBA3"
  })), React.createElement("button", {
    onClick: () => setShowRules(true),
    className: "rounded-full p-2 border",
    style: {
      borderColor: "#4A4038"
    },
    "aria-label": "Show rules"
  }, React.createElement(HelpCircle, {
    size: 20,
    color: "#C9BBA3"
  })))), React.createElement("p", {
    className: "font-body text-xs mb-6",
    style: {
      color: "#9A8C77"
    }
  }, "One-syllable clues only. Slip up, get bonked."), phase === "setup" && React.createElement("div", {
    className: "flex flex-col gap-5 font-body"
  }, React.createElement("div", null, React.createElement("label", {
    className: "text-xs uppercase tracking-wide",
    style: {
      color: "#9A8C77"
    }
  }, "Teams"), React.createElement("div", {
    className: "grid grid-cols-2 gap-2 mt-1"
  }, [2, 3].map(n => React.createElement("button", {
    key: n,
    onClick: () => setTeamCount(n),
    className: "rounded-xl py-3 font-body font-medium",
    style: {
      background: teamCount === n ? "#E8A33D" : "#241E18",
      color: teamCount === n ? "#1B1712" : "#C9BBA3",
      border: "2px solid #4A4038"
    }
  }, n, " Teams")))), Array.from({
    length: teamCount
  }, (_, i) => i).map(i => {
    const defaultName = ["Team A", "Team B", "Team C"][i];
    return React.createElement("div", {
      key: i
    }, React.createElement("label", {
      className: "text-xs uppercase tracking-wide",
      style: {
        color: TEAM_COLORS[i]
      }
    }, "Team ", i + 1), React.createElement("input", {
      value: teamNames[i],
      onChange: e => {
        const next = [...teamNames];
        next[i] = e.target.value || defaultName;
        setTeamNames(next);
      },
      className: "mt-1 w-full rounded-xl px-4 py-3 text-lg font-body outline-none",
      style: {
        background: "#241E18",
        border: `2px solid ${TEAM_COLORS[i]}`,
        color: "#F1E9D8"
      },
      placeholder: defaultName
    }), React.createElement("input", {
      value: teamPlayers[i],
      onChange: e => {
        const next = [...teamPlayers];
        next[i] = e.target.value;
        setTeamPlayers(next);
      },
      className: "mt-2 w-full rounded-xl px-4 py-2 text-base font-body outline-none",
      style: {
        background: "#1D1712",
        border: "1px solid #3A322A",
        color: "#C9BBA3"
      },
      placeholder: "Players (optional, comma separated)"
    }));
  }), React.createElement("div", null, React.createElement("label", {
    className: "text-xs uppercase tracking-wide",
    style: {
      color: "#9A8C77"
    }
  }, "Play to"), React.createElement("div", {
    className: "grid grid-cols-4 gap-2 mt-1"
  }, [10, 15, 20, 30].map(n => React.createElement("button", {
    key: n,
    onClick: () => setTargetScore(n),
    className: "rounded-xl py-3 text-sm font-body font-medium",
    style: {
      background: targetScore === n ? "#E8A33D" : "#241E18",
      color: targetScore === n ? "#1B1712" : "#C9BBA3",
      border: "2px solid #4A4038"
    }
  }, n)))), React.createElement("button", {
    onClick: startGame,
    className: "mt-4 rounded-xl py-4 font-display text-2xl flex items-center justify-center gap-2 chisel",
    style: {
      background: "#E8A33D",
      color: "#1B1712"
    }
  }, React.createElement(Play, {
    size: 22
  }), " START GAME")), phase === "ready" && React.createElement("div", {
    className: "flex-1 flex flex-col"
  }, React.createElement(ScoreBar, {
    teamNames: teamNames,
    scores: scores,
    targetScore: targetScore,
    currentTeam: currentTeam,
    teamCount: teamCount
  }), React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center gap-6 font-body"
  }, React.createElement(Users, {
    size: 36,
    color: TEAM_COLORS[currentTeam]
  }), React.createElement("div", {
    className: "text-center"
  }, React.createElement("p", {
    className: "text-sm",
    style: {
      color: "#9A8C77"
    }
  }, "Up next"), React.createElement("p", {
    className: "font-display text-4xl chisel",
    style: {
      color: TEAM_COLORS[currentTeam]
    }
  }, teamNames[currentTeam])), React.createElement("p", {
    className: "text-sm text-center px-6",
    style: {
      color: "#9A8C77"
    }
  }, "Pass the phone to your Wordsmith. 60 seconds, one-syllable clues only."), React.createElement("button", {
    onClick: startRound,
    className: "rounded-xl px-8 py-4 font-display text-2xl flex items-center gap-2 chisel",
    style: {
      background: TEAM_COLORS[currentTeam],
      color: "#100D0A"
    }
  }, React.createElement(Play, {
    size: 22
  }), " START ROUND"))), phase === "playing" && currentCard && React.createElement("div", {
    className: "flex-1 flex flex-col"
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4 font-body"
  }, React.createElement("span", {
    className: "text-sm",
    style: {
      color: TEAM_COLORS[currentTeam]
    }
  }, teamNames[currentTeam]), React.createElement("span", {
    className: "font-display text-4xl chisel tabular-nums",
    style: {
      color: timeLeft <= 10 ? "#C1502E" : "#F1E9D8"
    }
  }, timeLeft), React.createElement("span", {
    className: "text-sm",
    style: {
      color: "#9A8C77"
    }
  }, "+", roundScore, " this round")), React.createElement("div", {
    key: currentCard.w,
    className: "card-in flex-1 rounded-2xl flex flex-col items-center justify-center px-6 py-10 mb-5",
    style: {
      background: "linear-gradient(160deg, #2E2721 0%, #221C17 100%)",
      border: "1px solid #4A4038"
    }
  }, React.createElement("span", {
    className: "text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-5 font-body",
    style: {
      background: "#3A2F26",
      color: "#E8A33D"
    }
  }, currentCard.tier, " · ", currentCard.pts, " pt", currentCard.pts > 1 ? "s" : ""), React.createElement("p", {
    className: "font-display text-5xl text-center chisel leading-tight",
    style: {
      color: "#F1E9D8"
    }
  }, currentCard.w)), React.createElement("div", {
    className: "grid grid-cols-3 gap-3 font-body"
  }, React.createElement("button", {
    onClick: handleSkip,
    className: "rounded-xl py-4 flex flex-col items-center gap-1",
    style: {
      background: "#241E18",
      border: `2px solid ${skipsUsed >= FREE_SKIPS ? "#C1502E" : "#4A4038"}`,
      color: skipsUsed >= FREE_SKIPS ? "#E8917A" : "#C9BBA3"
    }
  }, React.createElement(SkipForward, {
    size: 20
  }), React.createElement("span", {
    className: "text-xs"
  }, skipsUsed >= FREE_SKIPS ? "Skip (-1 pt)" : `Skip (${FREE_SKIPS - skipsUsed} left)`)), React.createElement("button", {
    onClick: handleCorrect,
    className: "rounded-xl py-4 flex flex-col items-center gap-1",
    style: {
      background: "#6E9B7A",
      color: "#10241A"
    }
  }, React.createElement(Check, {
    size: 22
  }), React.createElement("span", {
    className: "text-xs font-medium"
  }, "Correct")), React.createElement("button", {
    onClick: handleBonk,
    className: `rounded-xl py-4 flex flex-col items-center gap-1 ${shake ? "shake" : ""}`,
    style: {
      background: "#C1502E",
      color: "#2A0F08"
    }
  }, React.createElement(Hammer, {
    size: 20
  }), React.createElement("span", {
    className: "text-xs font-medium"
  }, "Bonk!"))), React.createElement("p", {
    className: "text-center text-xs mt-3",
    style: {
      color: "#6B5F50"
    }
  }, "Other team: bonk the second a multi-syllable word slips out.")), phase === "roundEnd" && React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center gap-5 font-body text-center"
  }, React.createElement("p", {
    className: "font-display text-3xl chisel",
    style: {
      color: roundEndReason === "bonk" ? "#C1502E" : "#E8A33D"
    }
  }, roundEndReason === "bonk" ? "BONKED!" : "TIME'S UP"), React.createElement("p", {
    style: {
      color: "#C9BBA3"
    }
  }, teamNames[currentTeam], " scored ", React.createElement("span", {
    style: {
      color: TEAM_COLORS[currentTeam]
    }
  }, "+", roundScore), " this round"), React.createElement(ScoreBar, {
    teamNames: teamNames,
    scores: scores,
    targetScore: targetScore,
    currentTeam: currentTeam,
    teamCount: teamCount
  }), React.createElement("button", {
    onClick: nextTurn,
    className: "mt-4 rounded-xl px-8 py-4 font-display text-xl chisel uppercase",
    style: {
      background: "#E8A33D",
      color: "#1B1712"
    }
  }, teamNames[(currentTeam + 1) % teamCount], "'S TURN")), phase === "gameOver" && hasWinner && React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center gap-5 font-body text-center"
  }, React.createElement(Trophy, {
    size: 48,
    color: TEAM_COLORS[winner]
  }), React.createElement("p", {
    className: "font-display text-4xl chisel uppercase",
    style: {
      color: TEAM_COLORS[winner]
    }
  }, teamNames[winner], " WINS"), React.createElement("p", {
    style: {
      color: "#C9BBA3"
    },
    className: "flex items-center gap-3"
  }, Array.from({
    length: teamCount
  }, (_, i) => i).map(i => React.createElement("span", {
    key: i,
    style: {
      color: i === winner ? TEAM_COLORS[i] : "#C9BBA3"
    }
  }, teamNames[i], " ", scores[i]))), React.createElement("button", {
    onClick: playAgain,
    className: "mt-4 rounded-xl px-8 py-4 font-display text-xl flex items-center gap-2 chisel",
    style: {
      background: "#E8A33D",
      color: "#1B1712"
    }
  }, React.createElement(RotateCcw, {
    size: 20
  }), " PLAY AGAIN"))), showRules && React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end",
    style: {
      background: "rgba(0,0,0,0.7)"
    },
    onClick: () => setShowRules(false)
  }, React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "w-full max-w-md mx-auto rounded-t-2xl p-6 safe-bottom font-body max-h-[80vh] overflow-y-auto",
    style: {
      background: "#211B16",
      border: "1px solid #4A4038"
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("p", {
    className: "font-display text-2xl chisel",
    style: {
      color: "#F1E9D8"
    }
  }, "HOW TO PLAY"), React.createElement("button", {
    onClick: () => setShowRules(false)
  }, React.createElement(X, {
    size: 22,
    color: "#C9BBA3"
  }))), React.createElement("ul", {
    className: "text-sm space-y-3",
    style: {
      color: "#C9BBA3"
    }
  }, React.createElement("li", null, "• One player (the Wordsmith) sees a word and must get their team to guess it in 60 seconds."), React.createElement("li", null, "• Clues can only use ", React.createElement("b", null, "one-syllable words"), ". \"A,\" \"the,\" \"of\" are fine."), React.createElement("li", null, "• No rhyming, no spelling, no sounds-like clues."), React.createElement("li", null, "• The ", React.createElement("b", null, "other team"), " listens closely — the moment a multi-syllable word slips out, they tap ", React.createElement("b", null, "Bonk!"), " The card is lost and the turn ends immediately."), React.createElement("li", null, "• Tap ", React.createElement("b", null, "Skip"), " to pass a hard card to the back of the deck. You get 3 free skips per turn — after that, every skip costs your team 1 point."), React.createElement("li", null, "• Tap ", React.createElement("b", null, "Correct"), " the instant your team guesses right — points add up live."), React.createElement("li", null, "• First team to the target score wins.")))), showLeaderboard && React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end",
    style: {
      background: "rgba(0,0,0,0.7)"
    },
    onClick: () => {
      setShowLeaderboard(false);
      setConfirmReset(false);
    }
  }, React.createElement("div", {
    onClick: e => e.stopPropagation(),
    className: "w-full max-w-md mx-auto rounded-t-2xl p-6 safe-bottom font-body max-h-[80vh] overflow-y-auto",
    style: {
      background: "#211B16",
      border: "1px solid #4A4038"
    }
  }, React.createElement("div", {
    className: "flex items-center justify-between mb-4"
  }, React.createElement("p", {
    className: "font-display text-2xl chisel",
    style: {
      color: "#F1E9D8"
    }
  }, "LEADERBOARD"), React.createElement("button", {
    onClick: () => {
      setShowLeaderboard(false);
      setConfirmReset(false);
    }
  }, React.createElement(X, {
    size: 22,
    color: "#C9BBA3"
  }))), React.createElement("p", {
    className: "text-xs uppercase tracking-wide mb-2",
    style: {
      color: "#9A8C77"
    }
  }, "Teams"), React.createElement("div", {
    className: "space-y-2 mb-5"
  }, Object.entries(teamStats).sort((a, b) => b[1].wins - a[1].wins).map(([name, s]) => React.createElement("div", {
    key: name,
    className: "flex items-center justify-between rounded-lg px-3 py-2",
    style: {
      background: "#241E18"
    }
  }, React.createElement("span", {
    style: {
      color: "#F1E9D8"
    }
  }, name), React.createElement("span", {
    className: "text-sm",
    style: {
      color: "#E8A33D"
    }
  }, s.wins, "W · ", s.played, "P"))), Object.keys(teamStats).length === 0 && React.createElement("p", {
    className: "text-sm",
    style: {
      color: "#6B5F50"
    }
  }, "No games recorded yet.")), React.createElement("p", {
    className: "text-xs uppercase tracking-wide mb-2",
    style: {
      color: "#9A8C77"
    }
  }, "Players"), React.createElement("div", {
    className: "space-y-2 mb-5"
  }, Object.entries(playerStats).sort((a, b) => b[1].wins - a[1].wins).map(([name, s]) => React.createElement("div", {
    key: name,
    className: "flex items-center justify-between rounded-lg px-3 py-2",
    style: {
      background: "#241E18"
    }
  }, React.createElement("span", {
    style: {
      color: "#F1E9D8"
    }
  }, name), React.createElement("span", {
    className: "text-sm",
    style: {
      color: "#E8A33D"
    }
  }, s.wins, "W · ", s.played, "P"))), Object.keys(playerStats).length === 0 && React.createElement("p", {
    className: "text-sm",
    style: {
      color: "#6B5F50"
    }
  }, "Add player names at setup (comma separated) to track individuals.")), React.createElement("button", {
    onClick: () => {
      if (confirmReset) {
        resetStats();
        setConfirmReset(false);
      } else {
        setConfirmReset(true);
      }
    },
    className: "w-full rounded-xl py-3 flex items-center justify-center gap-2 text-sm",
    style: {
      background: confirmReset ? "#C1502E" : "#241E18",
      color: confirmReset ? "#2A0F08" : "#C9BBA3",
      border: "2px solid #4A4038"
    }
  }, React.createElement(Trash2, {
    size: 16
  }), " ", confirmReset ? "Tap again to confirm reset" : "Reset stats"), React.createElement("p", {
    className: "text-xs text-center mt-3",
    style: {
      color: "#6B5F50"
    }
  }, "Stats are saved on this device and persist across games."))));
}
function ScoreBar({
  teamNames,
  scores,
  targetScore,
  currentTeam,
  teamCount
}) {
  return React.createElement("div", {
    className: "flex gap-3 mb-2 font-body"
  }, Array.from({
    length: teamCount
  }, (_, i) => i).map(i => React.createElement("div", {
    key: i,
    className: "flex-1 rounded-xl px-3 py-2",
    style: {
      background: "#241E18",
      border: `2px solid ${i === currentTeam ? TEAM_COLORS[i] : "#3A322A"}`
    }
  }, React.createElement("p", {
    className: "text-xs truncate",
    style: {
      color: TEAM_COLORS[i]
    }
  }, teamNames[i]), React.createElement("div", {
    className: "flex items-baseline justify-between"
  }, React.createElement("span", {
    className: "font-display text-2xl chisel",
    style: {
      color: "#F1E9D8"
    }
  }, scores[i]), React.createElement("span", {
    className: "text-[10px]",
    style: {
      color: "#6B5F50"
    }
  }, "/ ", targetScore)))));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(CaveTalk, null));
})();
