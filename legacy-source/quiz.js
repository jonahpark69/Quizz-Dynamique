console.log("Quiz JS loaded...");

const getElement = (selector) => document.querySelector(selector);
const showElement = (element) => (element.style.display = "");
const hideElement = (element) => (element.style.display = "none");
const setText = (element, text) => (element.textContent = text);

const createAnswerButton = (answer, onClick) => {
  const btn = document.createElement("button");
  btn.classList.add("answer-btn");
  if (typeof answer === "string") {
    btn.textContent = answer;
  } else if (answer && answer.imageSrc) {
    btn.classList.add("answer-btn--image", "is-loading");
    const img = document.createElement("img");
    img.src = answer.imageSrc;
    img.alt = answer.label || "Réponse";
    img.loading = "lazy";
    img.decoding = "async";
    img.setAttribute("fetchpriority", "low");
    const handleImageReady = () => btn.classList.remove("is-loading");
    img.addEventListener("load", handleImageReady);
    img.addEventListener("error", handleImageReady);
    const label = document.createElement("span");
    label.classList.add("sr-only");
    label.textContent = answer.label || "Réponse";
    btn.appendChild(img);
    btn.appendChild(label);
  }
  btn.addEventListener("click", onClick);
  return btn;
};

const updateScoreDisplay = (scoreElement, score, total) => {
  scoreElement.textContent = formatScoreLabel(score, total);
};

const lockAnswers = (container) => {
  const buttons = container.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
};

const markCorrectAnswer = (container, correctIndex) => {
  const buttons = container.querySelectorAll("button");
  if (buttons[correctIndex]) {
    buttons[correctIndex].classList.add("correct");
  }
};

const loadFromLocalStorage = (key, defaultValue) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const startTimer = (duration, onTick, onComplete) => {
  let timeLeft = duration;
  const timerId = setInterval(() => {
    timeLeft--;
    onTick(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(timerId);
      onComplete();
    }
  }, 1000);
  return timerId;
};

const baseThemes = [
  {
    id: "general",
    label: "Culture générale",
    description: "Faits, records, pays, histoire rapide.",
    questions: [
      {
        text: "Quelle est la capitale de la France ?",
        answers: ["Paris", "Lyon", "Marseille", "Bordeaux"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle est la capitale de l'Italie ?",
        answers: ["Rome", "Milan", "Naples", "Venise"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle est la monnaie du Japon ?",
        answers: ["Yen", "Won", "Yuan", "Rouble"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans quel continent se trouve le Sahara ?",
        answers: ["Afrique", "Asie", "Amérique", "Europe"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Combien y a-t-il de continents sur Terre ?",
        answers: ["7", "5", "6", "8"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est le plus grand océan ?",
        answers: ["Pacifique", "Atlantique", "Indien", "Arctique"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est le plus grand mammifère ?",
        answers: ["Baleine bleue", "Éléphant d'Afrique", "Giraffe", "Hippopotame"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est le symbole chimique de l'eau ?",
        answers: ["H2O", "O2", "CO2", "NaCl"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle est la capitale du Canada ?",
        answers: ["Ottawa", "Toronto", "Vancouver", "Montréal"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel pays a pour capitale Canberra ?",
        answers: ["Australie", "Nouvelle-Zélande", "Canada", "Afrique du Sud"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Dans quel pays se trouve la ville de Rio de Janeiro ?",
        answers: ["Brésil", "Argentine", "Portugal", "Mexique"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "En quelle année l'homme a-t-il marché sur la Lune pour la première fois ?",
        answers: ["1969", "1959", "1975", "1981"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle est la plus haute montagne du monde ?",
        answers: ["Everest", "K2", "Kilimandjaro", "Mont Blanc"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel est le plus petit des continents ?",
        answers: ["Océanie", "Europe", "Antarctique", "Amérique du Sud"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "En quelle année a commencé la Première Guerre mondiale ?",
        answers: ["1914", "1939", "1929", "1918"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel courant océanique chaud influence le climat de l'Europe de l'Ouest ?",
        answers: ["Gulf Stream", "El Niño", "Kuroshio", "Labrador"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle est la distance moyenne entre la Terre et le Soleil ?",
        answers: [
          "150 millions de km",
          "15 millions de km",
          "1,5 million de km",
          "300 millions de km",
        ],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Combien de chromosomes possède l'être humain ?",
        answers: ["46", "23", "44", "48"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel est le plus long os du corps humain ?",
        answers: ["Fémur", "Tibia", "Humérus", "Radius"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel est le symbole chimique de l'or ?",
        answers: ["Au", "Ag", "O", "Gd"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "cinema",
    label: "Cinéma & séries",
    description: "Répliques, acteurs, univers, scènes cultes.",
    questions: [
      {
        text: "Quel film d'animation met en scène un ogre vert ?",
        answers: ["Shrek", "Toy Story", "Cars", "L'Âge de glace"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans Harry Potter, à quelle maison appartient Harry ?",
        answers: ["Gryffondor", "Serpentard", "Serdaigle", "Poufsouffle"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel super-héros est aussi Bruce Wayne ?",
        answers: ["Batman", "Superman", "Spider-Man", "Iron Man"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans Star Wars, comment s'appelle le maître Jedi de Luke ?",
        answers: ["Yoda", "Obi-Wan Kenobi", "Mace Windu", "Qui-Gon Jinn"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel film raconte l'histoire d'un paquebot qui coule en 1912 ?",
        answers: ["Titanic", "Abyss", "Pearl Harbor", "Le Monde de Nemo"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel personnage est joué par Johnny Depp dans Pirates des Caraïbes ?",
        answers: ["Jack Sparrow", "Will Turner", "Hector Barbossa", "Davy Jones"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans Friends, comment s'appelle le café où ils se retrouvent ?",
        answers: ["Central Perk", "Monk's Café", "Cafe Nervosa", "Bean Scene"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle série suit les familles Stark et Lannister ?",
        answers: ["Game of Thrones", "The Witcher", "Vikings", "The Crown"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans Breaking Bad, quel est le nom d'alias de Walter White ?",
        answers: ["Heisenberg", "Scarface", "Dexter", "The Punisher"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel film de Christopher Nolan parle de rêves imbriqués ?",
        answers: ["Inception", "Interstellar", "Memento", "Dunkirk"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Dans The Office (US), comment s'appelle le manager régional ?",
        answers: ["Michael Scott", "Jim Halpert", "Dwight Schrute", "Stanley Hudson"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel film met en scène des dinosaures clonés dans un parc ?",
        answers: ["Jurassic Park", "King Kong", "Avatar", "Godzilla"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Dans Stranger Things, comment s'appelle la fille aux pouvoirs ?",
        answers: ["Eleven", "Max", "Nancy", "Joy"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel film français met en scène un homme riche tétraplégique et son aide-soignant ?",
        answers: ["Intouchables", "La Haine", "Le Dîner de cons", "Amélie Poulain"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Dans Le Seigneur des Anneaux, qui guide la Communauté ?",
        answers: ["Gandalf", "Aragorn", "Legolas", "Boromir"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel réalisateur a signé Pulp Fiction ?",
        answers: ["Quentin Tarantino", "Martin Scorsese", "Ridley Scott", "David Fincher"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Dans Matrix, quelle est la pilule qui révèle la vérité ?",
        answers: ["Rouge", "Bleue", "Verte", "Noire"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel film a remporté l'Oscar du meilleur film en 2020 ?",
        answers: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Dans la série Sherlock (BBC), quel est le prénom de Watson ?",
        answers: ["John", "James", "Joseph", "Jack"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel film culte se déroule en grande partie dans un motel tenu par Norman Bates ?",
        answers: ["Psychose", "Orange mécanique", "Fenêtre sur cour", "Chinatown"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "music",
    label: "Musique",
    description: "Genres, artistes, décennies, blind test soft.",
    questions: [
      {
        text: "Quel instrument a généralement six cordes ?",
        answers: ["Guitare", "Piano", "Saxophone", "Violoncelle"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel artiste est surnommé le King of Pop ?",
        answers: ["Michael Jackson", "Prince", "Elvis Presley", "Stevie Wonder"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel groupe a chanté \"Bohemian Rhapsody\" ?",
        answers: ["Queen", "The Beatles", "U2", "Coldplay"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Qui chante \"Shape of You\" ?",
        answers: ["Ed Sheeran", "Bruno Mars", "Justin Bieber", "Shawn Mendes"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle chanteuse interprète \"Hello\" (2015) ?",
        answers: ["Adele", "Rihanna", "Beyoncé", "Sia"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel style musical est associé au rap ?",
        answers: ["Hip-hop", "Jazz", "Classique", "Reggae"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel duo français est derrière \"Around the World\" ?",
        answers: ["Daft Punk", "Justice", "Air", "Phoenix"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel groupe a chanté \"Smells Like Teen Spirit\" ?",
        answers: ["Nirvana", "Metallica", "Muse", "Green Day"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle chanteuse est connue pour l'album \"Back to Black\" ?",
        answers: ["Amy Winehouse", "Adele", "Madonna", "Katy Perry"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel groupe britannique a chanté \"Wonderwall\" ?",
        answers: ["Oasis", "Blur", "Radiohead", "The Cure"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel compositeur a écrit \"Les Quatre Saisons\" ?",
        answers: ["Vivaldi", "Mozart", "Bach", "Chopin"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle décennie est associée à la naissance du hip-hop ?",
        answers: ["Années 1970", "Années 1960", "Années 1980", "Années 1990"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel festival français se déroule à Clisson ?",
        answers: ["Hellfest", "Solidays", "Les Vieilles Charrues", "Main Square"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel artiste a sorti l'album \"25\" ?",
        answers: ["Adele", "Taylor Swift", "Lady Gaga", "Billie Eilish"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel instrument est joué par un batteur ?",
        answers: ["Batterie", "Violon", "Flûte", "Harpe"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel groupe est derrière l'album \"The Dark Side of the Moon\" ?",
        answers: ["Pink Floyd", "The Rolling Stones", "Led Zeppelin", "The Doors"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel style musical est né en Jamaïque à la fin des années 60 ?",
        answers: ["Reggae", "Salsa", "Funk", "Techno"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel courant musical est associé à la \"French Touch\" ?",
        answers: ["Électro", "Blues", "Country", "Gospel"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel compositeur est à l'origine de la 5e symphonie ?",
        answers: ["Beethoven", "Haydn", "Debussy", "Ravel"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel artiste est connu pour la chanson \"Like a Rolling Stone\" ?",
        answers: ["Bob Dylan", "Bruce Springsteen", "David Bowie", "Elton John"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "gaming",
    label: "Jeux vidéo",
    description: "Consoles, licences, mécaniques, personnages.",
    questions: [
      {
        text: "Quel héros porte une casquette rouge et saute sur des Goombas ?",
        answers: ["Mario", "Sonic", "Crash", "Link"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans Zelda, comment s'appelle le héros ?",
        answers: ["Link", "Zelda", "Ganon", "Epona"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel personnage est une créature jaune électrique ?",
        answers: ["Pikachu", "Charizard", "Bulbizarre", "Salamèche"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle entreprise fabrique la console Switch ?",
        answers: ["Nintendo", "Sony", "Microsoft", "Sega"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel jeu sandbox utilise des blocs pour construire ?",
        answers: ["Minecraft", "Roblox", "Fortnite", "Terraria"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel jeu battle royale populaire met en scène 100 joueurs ?",
        answers: ["Fortnite", "Overwatch", "Rocket League", "Splatoon"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans quel jeu de course lance-t-on des carapaces ?",
        answers: ["Mario Kart", "F-Zero", "Need for Speed", "Gran Turismo"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle console portable Nintendo a deux écrans ?",
        answers: ["Nintendo DS", "Game Boy", "PSP", "Switch Lite"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel personnage est le héros de God of War ?",
        answers: ["Kratos", "Atreus", "Zeus", "Hades"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel studio a créé The Witcher ?",
        answers: ["CD Projekt Red", "Bethesda", "Ubisoft", "Square Enix"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle console Sony est sortie en 1994 ?",
        answers: ["PlayStation", "PlayStation 2", "PlayStation 3", "PSP"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel jeu est à l'origine du genre \"Souls-like\" ?",
        answers: ["Dark Souls", "Skyrim", "Diablo", "Assassin's Creed"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Comment s'appelle l'épée emblématique de Cloud dans FFVII ?",
        answers: ["Buster Sword", "Masamune", "Excalibur", "Keyblade"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel jeu MOBA très populaire oppose deux équipes de cinq ?",
        answers: ["League of Legends", "Valorant", "Counter-Strike", "FIFA"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel jeu met en scène des portails pour résoudre des puzzles ?",
        answers: ["Portal", "Half-Life", "Doom", "BioShock"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel moteur graphique est développé par Epic Games ?",
        answers: ["Unreal Engine", "Frostbite", "Source", "Unity"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel jeu a popularisé le mode battle royale avant Fortnite ?",
        answers: ["PUBG", "Halo", "Rocket League", "Destiny"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel personnage est le héros de Metroid ?",
        answers: ["Samus Aran", "Lara Croft", "Jill Valentine", "Bayonetta"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Dans Pokémon, quel est le type de Pikachu ?",
        answers: ["Électrik", "Feu", "Eau", "Plante"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel jeu met en scène le sorceleur Geralt de Riv ?",
        answers: ["The Witcher", "Dragon Age", "Elder Scrolls", "Fable"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "sport",
    label: "Sport",
    description: "Règles, grands événements, légendes, clubs.",
    questions: [
      {
        text: "Combien de joueurs composent une équipe de football sur le terrain ?",
        answers: ["11", "10", "9", "12"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel sport se joue avec un ballon ovale ?",
        answers: ["Rugby", "Football", "Basketball", "Handball"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel sport se joue avec une raquette et un volant ?",
        answers: ["Badminton", "Tennis", "Squash", "Ping-pong"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Dans quel sport marque-t-on des paniers ?",
        answers: ["Basketball", "Handball", "Baseball", "Volley"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle compétition sportive a lieu tous les 4 ans et réunit des pays ?",
        answers: ["Jeux Olympiques", "Coupe Davis", "Tour de France", "Six Nations"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel pays a remporté la Coupe du monde de football en 2018 ?",
        answers: ["France", "Croatie", "Brésil", "Allemagne"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel sport pratique Usain Bolt ?",
        answers: ["Sprint", "Saut en hauteur", "Marathon", "Décathlon"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel sport se joue sur glace avec un palet ?",
        answers: ["Hockey sur glace", "Patinage artistique", "Curling", "Bandy"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Combien de points vaut un essai au rugby ?",
        answers: ["5", "3", "7", "10"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel Grand Chelem se joue sur terre battue ?",
        answers: ["Roland-Garros", "Wimbledon", "US Open", "Open d'Australie"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel est le nom du stade du FC Barcelone ?",
        answers: ["Camp Nou", "Santiago Bernabéu", "Old Trafford", "Anfield"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "En NBA, combien de points vaut un tir derrière la ligne ?",
        answers: ["3", "2", "4", "1"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel pays a inventé le football moderne ?",
        answers: ["Angleterre", "Brésil", "France", "Italie"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Combien de sets faut-il gagner pour remporter un match de Grand Chelem masculin ?",
        answers: ["3", "2", "4", "5"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel club a remporté le plus de Ligues des champions ?",
        answers: ["Real Madrid", "AC Milan", "Liverpool", "Bayern Munich"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel est le record du monde du 100 m masculin ?",
        answers: ["9,58 s", "9,72 s", "9,80 s", "10,01 s"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel pays a remporté le plus de Coupes du monde de football ?",
        answers: ["Brésil", "Allemagne", "Italie", "Argentine"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel joueur a remporté le plus de Ballons d'Or ?",
        answers: ["Lionel Messi", "Cristiano Ronaldo", "Zinedine Zidane", "Michel Platini"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle compétition cycliste se termine traditionnellement à Paris ?",
        answers: ["Tour de France", "Giro", "Vuelta", "Paris-Roubaix"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Dans quel sport trouve-t-on la règle du hors-jeu ?",
        answers: ["Football", "Basketball", "Rugby", "Tennis"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "science",
    label: "Science & espace",
    description: "Planètes, corps humain, technologies, fun facts.",
    questions: [
      {
        text: "Quelle planète est connue comme la planète rouge ?",
        answers: ["Mars", "Vénus", "Jupiter", "Mercure"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle planète est la plus proche du Soleil ?",
        answers: ["Mercure", "Mars", "Vénus", "Jupiter"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est l'astre au centre du système solaire ?",
        answers: ["Soleil", "Lune", "Jupiter", "Sirius"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Combien de planètes compte le système solaire ?",
        answers: ["8", "7", "9", "10"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel organe pompe le sang dans le corps humain ?",
        answers: ["Cœur", "Poumons", "Foie", "Rein"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle force nous maintient au sol ?",
        answers: ["Gravité", "Magnétisme", "Friction", "Inertie"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est le symbole chimique de l'eau ?",
        answers: ["H2O", "O2", "CO2", "NaCl"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel gaz est indispensable à la respiration humaine ?",
        answers: ["Oxygène", "Azote", "Hélium", "Argon"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel est le plus grand organe du corps humain ?",
        answers: ["Peau", "Foie", "Cœur", "Poumons"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Comment s'appelle notre galaxie ?",
        answers: ["Voie lactée", "Andromède", "Sombrero", "Orion"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle planète possède des anneaux bien visibles ?",
        answers: ["Saturne", "Mars", "Mercure", "Vénus"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel scientifique a formulé la théorie de la relativité ?",
        answers: ["Einstein", "Newton", "Galilée", "Curie"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle unité mesure l'intensité du courant électrique ?",
        answers: ["Ampère", "Volt", "Watt", "Ohm"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel est le symbole chimique du fer ?",
        answers: ["Fe", "Fi", "Ir", "Fr"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quelle planète est la plus grande du système solaire ?",
        answers: ["Jupiter", "Saturne", "Neptune", "Uranus"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel télescope spatial a été lancé en 1990 ?",
        answers: ["Hubble", "Webb", "Kepler", "Spitzer"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle est la vitesse approximative de la lumière ?",
        answers: ["300 000 km/s", "150 000 km/s", "30 000 km/s", "3 000 km/s"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle est la première femme à être allée dans l'espace ?",
        answers: ["Valentina Terechkova", "Sally Ride", "Mae Jemison", "Eileen Collins"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle particule porte une charge négative ?",
        answers: ["Électron", "Proton", "Neutron", "Positron"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Sur quelle planète se trouve le volcan Olympus Mons ?",
        answers: ["Mars", "Vénus", "Jupiter", "Mercure"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "tech",
    label: "Technologie & internet",
    description: "Réseaux sociaux, culture web, sécurité.",
    questions: [
      {
        text: "Quel moteur de recherche est le plus utilisé ?",
        answers: ["Google", "Bing", "DuckDuckGo", "Qwant"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel réseau social était connu pour des messages courts ?",
        answers: ["Twitter", "Instagram", "TikTok", "LinkedIn"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel navigateur est développé par Google ?",
        answers: ["Chrome", "Firefox", "Safari", "Edge"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel service appartient à Meta ?",
        answers: ["Instagram", "Snapchat", "Pinterest", "Discord"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel appareil utilise le système iOS ?",
        answers: ["iPhone", "Pixel", "Galaxy", "ThinkPad"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel langage structure les pages web ?",
        answers: ["HTML", "CSS", "Python", "SQL"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel langage gère la mise en forme des pages web ?",
        answers: ["CSS", "HTML", "Java", "C++"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle plateforme de streaming est très utilisée par les gamers ?",
        answers: ["Twitch", "Vimeo", "Dailymotion", "Deezer"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Que signifie URL ?",
        answers: ["Uniform Resource Locator", "Universal Route Link", "Unified Random List", "User Readable Link"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Que signifie HTTPS ?",
        answers: [
          "HyperText Transfer Protocol Secure",
          "HyperText Transfer Protocol Simple",
          "High Transfer Text Protocol Secure",
          "Hyper Transfer Secure Packet",
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Que signifie VPN ?",
        answers: ["Virtual Private Network", "Verified Public Node", "Virtual Public Network", "Visual Private Node"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Que signifie 2FA ?",
        answers: ["Authentification à deux facteurs", "Accès à deux fichiers", "Autorisation à double fil", "Analyse à deux flux"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel format d'image est compressé avec perte ?",
        answers: ["JPEG", "PNG", "SVG", "GIF"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel protocole est utilisé pour transférer des fichiers ?",
        answers: ["FTP", "SMTP", "IMAP", "SNMP"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Qu'est-ce que le phishing ?",
        answers: [
          "Une technique de fraude par imitation",
          "Un antivirus",
          "Un moteur de recherche",
          "Un type de Wi-Fi",
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel est le port par défaut du HTTPS ?",
        answers: ["443", "80", "22", "21"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel langage rend les pages web interactives ?",
        answers: ["JavaScript", "HTML", "CSS", "SQL"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel système de gestion de versions est le plus utilisé ?",
        answers: ["Git", "SVN", "Mercurial", "Perforce"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Que signifie RAM ?",
        answers: ["Random Access Memory", "Read Access Module", "Rapid Active Memory", "Remote Access Memory"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle entreprise développe Android ?",
        answers: ["Google", "Apple", "Microsoft", "Samsung"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "food",
    label: "Food & cuisine du monde",
    description: "Plats, pays d'origine, ingrédients, traditions.",
    questions: [
      {
        text: "La pizza Margherita vient de quel pays ?",
        answers: ["Italie", "Espagne", "France", "Grèce"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Le sushi est une spécialité de quel pays ?",
        answers: ["Japon", "Chine", "Corée", "Thaïlande"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Le guacamole vient de quel pays ?",
        answers: ["Mexique", "Pérou", "Espagne", "Chili"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "La baguette est un symbole culinaire de quel pays ?",
        answers: ["France", "Italie", "Belgique", "Suisse"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel ingrédient est la base du houmous ?",
        answers: ["Pois chiches", "Lentilles", "Haricots rouges", "Petits pois"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Le curry est souvent associé à quel pays ?",
        answers: ["Inde", "Italie", "Maroc", "Japon"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel plat italien est fait de pâte et sauce tomate ?",
        answers: ["Spaghetti", "Sushi", "Tacos", "Pad thaï"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel fromage est traditionnellement utilisé pour la raclette ?",
        answers: ["Fromage à raclette", "Roquefort", "Brie", "Comté"],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "La paella vient de quel pays ?",
        answers: ["Espagne", "Portugal", "Italie", "Argentine"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le tajine est une spécialité de quel pays ?",
        answers: ["Maroc", "Liban", "Turquie", "Égypte"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le kimchi est une spécialité de quel pays ?",
        answers: ["Corée", "Chine", "Japon", "Vietnam"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le pho est une soupe traditionnelle de quel pays ?",
        answers: ["Vietnam", "Thaïlande", "Chine", "Laos"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le ceviche est un plat originaire de quel pays ?",
        answers: ["Pérou", "Brésil", "Colombie", "Argentine"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "La feta est un fromage traditionnel de quel pays ?",
        answers: ["Grèce", "Italie", "Espagne", "France"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le risotto est préparé principalement avec quel ingrédient ?",
        answers: ["Riz", "Boulgour", "Pâtes", "Quinoa"],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Le tiramisu contient traditionnellement quel fromage ?",
        answers: ["Mascarpone", "Mozzarella", "Parmesan", "Pecorino"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Le ramen est une spécialité de quel pays ?",
        answers: ["Japon", "Corée", "Chine", "Indonésie"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Le curry rouge est associé à quel pays ?",
        answers: ["Thaïlande", "Inde", "Japon", "Turquie"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Le pain naan est associé à quelle cuisine ?",
        answers: ["Indienne", "Mexicaine", "Italienne", "Grecque"],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "La poutine vient de quel pays ?",
        answers: ["Canada", "États-Unis", "France", "Belgique"],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
  {
    id: "image-quiz",
    label: "Quiz avec image",
    description: "Analyse visuelle et culture générale en images.",
    answerType: "image",
    questions: [
      {
        text: "Quelle image montre le Taj Mahal ?",
        promptImage: "",
        promptAlt: "Monument à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Taj-Mahal.jpg",
            label: "Taj Mahal",
          },
          {
            imageSrc: "../assets/images/quiz-image/Opéra-de-Sydney.jpg",
            label: "Opéra de Sydney",
          },
          {
            imageSrc: "../assets/images/quiz-image/Colisée.jpg",
            label: "Colisée",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tour Eiffel.jpg",
            label: "Tour Eiffel",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel drapeau est celui du Canada ?",
        promptImage: "",
        promptAlt: "Drapeau à reconnaître",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/flag-canada.jpg",
            label: "Canada",
          },
          {
            imageSrc: "../assets/images/quiz-image/flag_america.jpg",
            label: "États-Unis",
          },
          {
            imageSrc: "../assets/images/quiz-image/flag-united-kingdom.jpg",
            label: "Royaume-Uni",
          },
          {
            imageSrc: "../assets/images/quiz-image/flag-australia.jpg",
            label: "Australie",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle image montre un panda géant ?",
        promptImage: "",
        promptAlt: "Animal à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Panda-géant.jpg",
            label: "Panda géant",
          },
          {
            imageSrc: "../assets/images/quiz-image/Koala.jpg",
            label: "Koala",
          },
          {
            imageSrc: "../assets/images/quiz-image/Ours-polaire.jpg",
            label: "Ours polaire",
          },
          {
            imageSrc: "../assets/images/quiz-image/Raton-laveur.jpg",
            label: "Raton laveur",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle image montre un kiwi ?",
        promptImage: "",
        promptAlt: "Fruit à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Kiwi.jpg",
            label: "Kiwi",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mangue.jpg",
            label: "Mangue",
          },
          {
            imageSrc: "../assets/images/quiz-image/Papaye.jpg",
            label: "Papaye",
          },
          {
            imageSrc: "../assets/images/quiz-image/Avocat.jpg",
            label: "Avocat",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle image montre Saturne ?",
        promptImage: "",
        promptAlt: "Planète à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Saturne.jpg",
            label: "Saturne",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mars.jpg",
            label: "Mars",
          },
          {
            imageSrc: "../assets/images/quiz-image/Neptune.jpg",
            label: "Neptune",
          },
          {
            imageSrc: "../assets/images/quiz-image/Jupiter.jpg",
            label: "Jupiter",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle photo correspond à l'Italie ?",
        promptImage: "",
        promptAlt: "Carte à reconnaître",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Italie.jpg",
            label: "Italie",
          },
          {
            imageSrc: "../assets/images/quiz-image/Grèce.jpg",
            label: "Grèce",
          },
          {
            imageSrc: "../assets/images/quiz-image/Espagne.jpg",
            label: "Espagne",
          },
          {
            imageSrc: "../assets/images/quiz-image/Portugal.jpg",
            label: "Portugal",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel image correspond à Netflix ?",
        promptImage: "",
        promptAlt: "Logo à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Netflix.jpg",
            label: "Netflix",
          },
          {
            imageSrc: "../assets/images/quiz-image/Spotify.jpg",
            label: "Spotify",
          },
          {
            imageSrc: "../assets/images/quiz-image/YouTube Music.jpg",
            label: "YouTube Music",
          },
          {
            imageSrc: "../assets/images/quiz-image/Twitch.jpg",
            label: "Twitch",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quel monument religieux correspond à la basilique Saint-Pierre ?",
        promptImage: "",
        promptAlt: "Monument religieux à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Basilique Saint-Pierre.jpg",
            label: "Basilique Saint-Pierre",
          },
          {
            imageSrc: "../assets/images/quiz-image/Cathédrale Notre-Dame.jpg",
            label: "Cathédrale Notre-Dame",
          },
          {
            imageSrc: "../assets/images/quiz-image/Sagrada Família.jpg",
            label: "Sagrada Família",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mosquée bleue.jpg",
            label: "Mosquée bleue",
          },
        ],
        correct: 0,
        difficulty: "easy",
      },
      {
        text: "Quelle ville correspond à New York ?",
        promptImage: "",
        promptAlt: "Ville à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/New York.jpg",
            label: "New York",
          },
          {
            imageSrc: "../assets/images/quiz-image/Paris.jpg",
            label: "Paris",
          },
          {
            imageSrc: "../assets/images/quiz-image/Londres.jpg",
            label: "Londres",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tokyo.jpg",
            label: "Tokyo",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel sport correspond au basketball ?",
        promptImage: "",
        promptAlt: "Sport à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Basketball.jpg",
            label: "Basketball",
          },
          {
            imageSrc: "../assets/images/quiz-image/Football.jpg",
            label: "Football",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tennis.jpg",
            label: "Tennis",
          },
          {
            imageSrc: "../assets/images/quiz-image/Rugby.jpg",
            label: "Rugby",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel instrument est un saxophone ?",
        promptImage: "",
        promptAlt: "Instrument à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Saxophone.jpg",
            label: "Saxophone",
          },
          {
            imageSrc: "../assets/images/quiz-image/Trompette.jpg",
            label: "Trompette",
          },
          {
            imageSrc: "../assets/images/quiz-image/Clarinette.jpg",
            label: "Clarinette",
          },
          {
            imageSrc: "../assets/images/quiz-image/Flûte traversière.jpg",
            label: "Flûte traversière",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel paysage correspond au Grand Canyon ?",
        promptImage: "",
        promptAlt: "Paysage à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Grand Canyon.jpg",
            label: "Grand Canyon",
          },
          {
            imageSrc: "../assets/images/quiz-image/Chutes du Niagara.jpg",
            label: "Chutes du Niagara",
          },
          {
            imageSrc: "../assets/images/quiz-image/Désert du Sahara.jpg",
            label: "Désert du Sahara",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mont Fuji.jpg",
            label: "Mont Fuji",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel véhicule est un bus londonien ?",
        promptImage: "",
        promptAlt: "Véhicule à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Bus londonien.jpg",
            label: "Bus londonien",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tramway.jpg",
            label: "Tramway",
          },
          {
            imageSrc: "../assets/images/quiz-image/Taxi new-yorkais.jpg",
            label: "Taxi new-yorkais",
          },
          {
            imageSrc: "../assets/images/quiz-image/Métro parisien.jpg",
            label: "Métro parisien",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel image correspond au surf ?",
        promptImage: "",
        promptAlt: "Sport nautique à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Surf.jpg",
            label: "Surf",
          },
          {
            imageSrc: "../assets/images/quiz-image/Kayak.jpg",
            label: "Kayak",
          },
          {
            imageSrc: "../assets/images/quiz-image/Plongée.jpg",
            label: "Plongée",
          },
          {
            imageSrc: "../assets/images/quiz-image/Voile.jpg",
            label: "Voile",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel bâtiment est le Burj Khalifa ?",
        promptImage: "",
        promptAlt: "Bâtiment à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Burj Khalifa.jpg",
            label: "Burj Khalifa",
          },
          {
            imageSrc: "../assets/images/quiz-image/Empire State Building.jpg",
            label: "Empire State Building",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tour Shanghai.jpg",
            label: "Tour Shanghai",
          },
          {
            imageSrc: "../assets/images/quiz-image/Willis Tower.jpg",
            label: "Willis Tower",
          },
        ],
        correct: 0,
        difficulty: "medium",
      },
      {
        text: "Quel image correspond à Tesla ?",
        promptImage: "",
        promptAlt: "Logo automobile à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Tesla.jpg",
            label: "Tesla",
          },
          {
            imageSrc: "../assets/images/quiz-image/BMW.jpg",
            label: "BMW",
          },
          {
            imageSrc: "../assets/images/quiz-image/Audi.jpg",
            label: "Audi",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mercedes.jpg",
            label: "Mercedes",
          },
        ],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel site historique correspond au Machu Picchu ?",
        promptImage: "",
        promptAlt: "Site historique à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Machu Picchu.jpg",
            label: "Machu Picchu",
          },
          {
            imageSrc: "../assets/images/quiz-image/Angkor Wat.jpg",
            label: "Angkor Wat",
          },
          {
            imageSrc: "../assets/images/quiz-image/Petra.jpg",
            label: "Petra",
          },
          {
            imageSrc: "../assets/images/quiz-image/Acropole d'Athènes.jpg",
            label: "Acropole d'Athènes",
          },
        ],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quelle image est un macaron ?",
        promptImage: "",
        promptAlt: "Dessert à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Macaron.jpg",
            label: "Macaron",
          },
          {
            imageSrc: "../assets/images/quiz-image/Éclair.jpg",
            label: "Éclair",
          },
          {
            imageSrc: "../assets/images/quiz-image/Tiramisu.jpg",
            label: "Tiramisu",
          },
          {
            imageSrc: "../assets/images/quiz-image/Baklava.jpg",
            label: "Baklava",
          },
        ],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel est ce mouvement artistique ?",
        promptImage: "",
        promptAlt: "Œuvre artistique à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Impressionnisme.jpg",
            label: "Impressionnisme",
          },
          {
            imageSrc: "../assets/images/quiz-image/Surréalisme.jpg",
            label: "Surréalisme",
          },
          {
            imageSrc: "../assets/images/quiz-image/Cubisme.jpg",
            label: "Cubisme",
          },
          {
            imageSrc: "../assets/images/quiz-image/Baroque.jpg",
            label: "Baroque",
          },
        ],
        correct: 0,
        difficulty: "hard",
      },
      {
        text: "Quel est ce symbole national ?",
        promptImage: "",
        promptAlt: "Symbole national à identifier",
        answers: [
          {
            imageSrc: "../assets/images/quiz-image/Statue de la Liberté.jpg",
            label: "Statue de la Liberté",
          },
          {
            imageSrc: "../assets/images/quiz-image/Christ Rédempteur.jpg",
            label: "Christ Rédempteur",
          },
          {
            imageSrc: "../assets/images/quiz-image/Big Ben.jpg",
            label: "Big Ben",
          },
          {
            imageSrc: "../assets/images/quiz-image/Mont Rushmore.jpg",
            label: "Mont Rushmore",
          },
        ],
        correct: 0,
        difficulty: "hard",
      },
    ],
  },
];

const AUDIO_LABELS = {
  default: "Lecture",
  playing: "Lecture en cours",
};

const AUDIO_STATUS_COPY = {
  "audio.statusPlaying": "Lecture en cours",
  "audio.statusReady": "Audio prêt",
  "audio.statusSpeechReady": "Synthèse vocale prête",
  "audio.statusSpeechAvailable": "Synthèse vocale disponible",
  "audio.statusSpeechUnavailable": "Synthèse vocale indisponible",
  "audio.statusUnavailable": "Audio indisponible",
  "audio.statusLoading": "Chargement des voix...",
  "audio.statusStopped": "Lecture arrêtée",
  "audio.statusNotFound": "Audio introuvable",
  "audio.statusSpeech": "Synthèse vocale",
};

const STATUS_LABELS = {
  correct: "Bonne réponse",
  wrong: "Mauvaise réponse",
  timeout: "Temps écoulé",
};

const DIFFICULTY_LABELS = {
  easy: "Facile",
  medium: "Moyen",
  hard: "Difficile",
};

const REWARD_BADGES = {
  starter: { title: "Décollage", description: "5 bonnes réponses." },
  top10: { title: "Top 10", description: "10 bonnes réponses." },
  expert: { title: "Expert", description: "15 bonnes réponses." },
  perfect: { title: "Sans faute", description: "Score parfait sur le thème." },
};

const REWARD_STATUS = {
  earned: "Débloqué",
  locked: "À débloquer",
};

const TRAINING_COMPLETE_LABEL = "Entraînement terminé !";
const SPEECH_LOCALE = "fr-FR";
const VOICE_PREFIX = "fr";

const formatScoreLabel = (score, total) => `Votre score : ${score} / ${total}`;
const formatTweetText = (score, total) =>
  `J'ai fait un score de ${score}/${total} sur le Quiz Dynamique ! 🎯`;

const getAudioStatusCopy = (statusKey) => AUDIO_STATUS_COPY[statusKey] || "";

const buildThemesById = (themeList) =>
  themeList.reduce((acc, theme) => {
    acc[theme.id] = theme;
    return acc;
  }, {});

const themes = baseThemes;
const themesById = buildThemesById(themes);

const hintsByQuestionText = {
  "Quel courant océanique chaud influence le climat de l'Europe de l'Ouest ?":
    "Courant chaud de l'Atlantique Nord issu du golfe du Mexique.",
  "Quelle est la distance moyenne entre la Terre et le Soleil ?":
    "Environ une unité astronomique (cent cinquante millions de km).",
  "Combien de chromosomes possède l'être humain ?":
    "Total de chromosomes = deux fois 23.",
  "Quel est le plus long os du corps humain ?":
    "Os long situé dans la cuisse.",
  "Quel est le symbole chimique de l'or ?":
    "Symbole dérivé du mot latin aurum.",
  "Quel réalisateur a signé Pulp Fiction ?":
    "Même réalisateur que Reservoir Dogs et Kill Bill.",
  "Dans Matrix, quelle est la pilule qui révèle la vérité ?":
    "Choisis la couleur qui te sort de l'illusion, pas celle qui la prolonge.",
  "Quel film a remporté l'Oscar du meilleur film en 2020 ?":
    "Film sud-coréen primé sur les inégalités sociales.",
  "Dans la série Sherlock (BBC), quel est le prénom de Watson ?":
    "Prénom masculin anglais très courant, initiale J.",
  "Quel film culte se déroule en grande partie dans un motel tenu par Norman Bates ?":
    "Thriller d'Hitchcock célèbre pour une scène de douche.",
  "Quel groupe est derrière l'album \"The Dark Side of the Moon\" ?":
    "Groupe britannique de rock progressif mené par Gilmour et Waters.",
  "Quel style musical est né en Jamaïque à la fin des années 60 ?":
    "Genre jamaïcain popularisé par Bob Marley.",
  "Quel courant musical est associé à la \"French Touch\" ?":
    "Mouvement électro français incarné par Daft Punk et Justice.",
  "Quel compositeur est à l'origine de la 5e symphonie ?":
    "Compositeur allemand devenu sourd, auteur du motif \"Ta-ta-ta-taaa\".",
  "Quel artiste est connu pour la chanson \"Like a Rolling Stone\" ?":
    "Auteur-compositeur folk américain, prix Nobel 2016.",
  "Quel moteur graphique est développé par Epic Games ?":
    "Moteur maison d'Epic, utilisé pour Fortnite et Gears of War.",
  "Quel jeu a popularisé le mode battle royale avant Fortnite ?":
    "Titre abrégé en PUBG, signé PlayerUnknown.",
  "Quel personnage est le héros de Metroid ?":
    "Chasseuse de primes en armure orange.",
  "Dans Pokémon, quel est le type de Pikachu ?":
    "Mascotte jaune qui lance des éclairs.",
  "Quel jeu met en scène le sorceleur Geralt de Riv ?":
    "Adaptation des romans d'Andrzej Sapkowski.",
  "Quel est le record du monde du 100 m masculin ?":
    "Usain Bolt l'a établi à Berlin en 2009 (sous 9,6 s).",
  "Quel pays a remporté le plus de Coupes du monde de football ?":
    "Sélection auriverde, cinq étoiles sur le maillot.",
  "Quel joueur a remporté le plus de Ballons d'Or ?":
    "Surnommé la Pulga, multiple Ballon d'Or.",
  "Quelle compétition cycliste se termine traditionnellement à Paris ?":
    "Grand Tour qui finit sur les Champs-Élysées.",
  "Dans quel sport trouve-t-on la règle du hors-jeu ?":
    "Sport où elle empêche d'attendre devant le but adverse.",
  "Quel télescope spatial a été lancé en 1990 ?":
    "Observatoire en orbite nommé d'après Edwin, lancé en 1990.",
  "Quelle est la vitesse approximative de la lumière ?":
    "Près de trois cent mille kilomètres par seconde dans le vide.",
  "Quelle est la première femme à être allée dans l'espace ?":
    "Cosmonaute soviétique qui a volé en 1963.",
  "Quelle particule porte une charge négative ?":
    "Particule légère qui orbite autour du noyau.",
  "Sur quelle planète se trouve le volcan Olympus Mons ?":
    "Plus haut volcan du système solaire, sur la planète rouge.",
  "Quel est le port par défaut du HTTPS ?":
    "Port sécurisé qui succède au 80.",
  "Quel langage rend les pages web interactives ?":
    "Langage exécuté dans le navigateur, souvent abrégé en JS.",
  "Quel système de gestion de versions est le plus utilisé ?":
    "VCS utilisé par GitHub et GitLab.",
  "Que signifie RAM ?":
    "Initiales de la mémoire vive : Random Access Memory.",
  "Quelle entreprise développe Android ?":
    "Entreprise qui édite aussi Chrome et Gmail.",
  "Le tiramisu contient traditionnellement quel fromage ?":
    "Dessert italien à base de fromage crémeux.",
  "Le ramen est une spécialité de quel pays ?":
    "Bol de nouilles servi dans un bouillon asiatique.",
  "Le curry rouge est associé à quel pays ?":
    "Recette au lait de coco venue de Thaïlande.",
  "Le pain naan est associé à quelle cuisine ?":
    "Pain plat cuit au tandoor dans la cuisine indienne.",
  "La poutine vient de quel pays ?":
    "Plat de frites, sauce brune et fromage en grains venu du Québec.",
};

const getAnswerLabel = (question) => {
  if (!question || !Array.isArray(question.answers)) {
    return "";
  }
  const answer = question.answers[question.correct];
  if (typeof answer === "string") {
    return answer;
  }
  if (answer && typeof answer === "object") {
    return answer.label || "";
  }
  return "";
};

const hintStopWords = new Set([
  "de",
  "la",
  "le",
  "les",
  "du",
  "des",
  "d",
  "l",
  "aux",
  "au",
  "et",
]);

const toRoman = (value) => {
  const map = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];
  let remaining = value;
  let result = "";
  for (const [number, symbol] of map) {
    while (remaining >= number) {
      result += symbol;
      remaining -= number;
    }
  }
  return result || value.toString();
};

const buildAutoHint = (question) => {
  const label = getAnswerLabel(question).trim();
  if (!label) {
    return "";
  }
  const text = (question.text || "").toLowerCase();
  const compact = label.replace(/\s+/g, " ").trim();
  const lettersOnly = label.replace(/[^A-Za-zÀ-ÿ]/g, "");
  const digitsOnly = (label.match(/\d+/g) || []).join("");
  const words = compact.split(/[\s-]+/).filter(Boolean);

  if (text.includes("année") && digitsOnly) {
    const year = parseInt(digitsOnly, 10);
    if (Number.isFinite(year) && year > 0) {
      const century = Math.floor((year - 1) / 100) + 1;
      return `Année du ${toRoman(century)}e siècle.`;
    }
  }

  if (/^\d+$/.test(compact)) {
    const digits = compact.length;
    return `Nombre à ${digits} chiffre${digits > 1 ? "s" : ""}.`;
  }

  if (/\d/.test(compact)) {
    if (compact.length <= 6) {
      return `Réponse en ${compact.length} caractères, contient un chiffre.`;
    }
    if (digitsOnly) {
      return `Indice : contient le nombre ${digitsOnly}.`;
    }
  }

  if (words.length >= 2) {
    const majorWords = words.filter(
      (word) => !hintStopWords.has(word.toLowerCase())
    );
    const initialSource = majorWords.length ? majorWords : words;
    const initials = initialSource
      .map((word) => word[0]?.toUpperCase())
      .filter(Boolean)
      .join(".");
    return `${words.length} mots. Initiales : ${initials}.`;
  }

  if (lettersOnly.length) {
    const first = lettersOnly[0].toUpperCase();
    const last = lettersOnly[lettersOnly.length - 1].toLowerCase();
    if (lettersOnly.length <= 4) {
      return `${lettersOnly.length} lettres. Commence par "${first}" et finit par "${last}".`;
    }
    return `${lettersOnly.length} lettres. Commence par "${first}".`;
  }

  return `Réponse en ${compact.length} caractères.`;
};

const difficultyOrder = {
  easy: 0,
  medium: 1,
  hard: 2,
};

const DEFAULT_TIME_LIMITS = {
  easy: 30,
  medium: 30,
  hard: 30,
};

// Fonction pour mélanger un tableau (algorithme Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Mélanger les questions
const shuffleQuestions = (questions) => shuffleArray(questions);

// Mélanger les réponses d'une question
const shuffleAnswers = (question) => {
  const answers = question.answers;
  const correctIndex = question.correct;
  const correctAnswer = answers[correctIndex];
  
  // Créer un tableau d'indices et les mélanger
  const indices = Array.from({ length: answers.length }, (_, i) => i);
  const shuffledIndices = shuffleArray(indices);
  
  // Réorganiser les réponses selon les indices mélangés
  const shuffledAnswers = shuffledIndices.map(i => answers[i]);
  
  // Trouver le nouvel index de la réponse correcte
  const newCorrectIndex = shuffledAnswers.indexOf(correctAnswer);
  
  return {
    ...question,
    answers: shuffledAnswers,
    correct: newCorrectIndex,
  };
};

const getDifficultyRank = (difficulty) =>
  difficultyOrder[difficulty] ?? difficultyOrder.medium;

const normalizeQuestion = (question) => {
  const difficulty = question.difficulty || "medium";
  const timeLimit = Number.isFinite(question.timeLimit)
    ? question.timeLimit
    : DEFAULT_TIME_LIMITS[difficulty] ?? DEFAULT_TIME_LIMITS.medium;
  const hint =
    question.hint || hintsByQuestionText[question.text] || buildAutoHint(question);
  return {
    ...question,
    difficulty,
    timeLimit,
    hint,
  };
};

const buildProgressiveQuestions = (questionSet = []) => {
  const sorted = questionSet
    .map((question, index) => ({
      ...normalizeQuestion(question),
      _index: index,
    }))
    .sort((a, b) => {
      const diff =
        getDifficultyRank(a.difficulty) - getDifficultyRank(b.difficulty);
      return diff || a._index - b._index;
    })
    .map(({ _index, ...question }) => question);
  
  // Mélanger les questions au début de chaque quiz
  const shuffledQuestions = shuffleQuestions(sorted);
  
  // Mélanger les réponses pour chaque question
  return shuffledQuestions.map(question => shuffleAnswers(question));
};

const TIME_TRIAL_DURATION = 240;
const AUDIO_BASE_PATH = "../assets/audio";
const USE_SPEECH_ONLY = true;
const INFINITE_TOTAL_LABEL = "∞";

let currentTheme = themes[0];
let activeQuestions = buildProgressiveQuestions(currentTheme.questions);
let questionStats = new Array(activeQuestions.length).fill(null);
let questionStartTime = null;
let audioStatusMessage = "";
let audioAvailable = false;
let audioFallbackText = "";
let audioSourceForQuestion = "";
let isAudioPlaying = false;
let speechUtterance = null;
let speechVoices = [];
let preferredVoice = null;
const audioPlayer = new Audio();
audioPlayer.preload = "auto";
let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let questionTimerId = null;
let globalTimerId = null;
let globalTimeLeft = 0;
let isTimeTrial = false;
let isFlashcardMode = false;
let isInfiniteMode = false;
let infiniteQuestionCount = 0;

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const restartThemeBtn = getElement("#restart-theme-btn");
const backHomeBtn = getElement("#back-home-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");
const tweetBtn = getElement("#tweet-btn");
const timeTrialToggle = getElement("#time-trial-toggle");
const timeTrialDurationInput = getElement("#time-trial-duration");
const flashcardToggle = getElement("#flashcard-toggle");
const infiniteToggle = getElement("#infinite-toggle");
const timerDiv = getElement("#timer-div");
const globalTimerDiv = getElement("#global-timer-div");
const globalTimeLeftSpan = getElement("#global-time-left");
const progressFill = getElement("#progress-fill");
const themeLabel = getElement("#theme-label");
const themeInputs = document.querySelectorAll('input[name="quiz-theme"]');
const questionMedia = getElement("#question-media");
const questionImage = getElement("#question-image");
const questionActions = getElement("#question-actions");
const playAudioBtn = getElement("#play-audio-btn");
const audioStatus = getElement("#audio-status");
const hintBtn = getElement("#hint-btn");
const hintStatus = getElement("#hint-status");
const hintBox = getElement("#hint-box");
const statsScreen = getElement("#stats-screen");
const statsCorrect = getElement("#stats-correct");
const statsWrong = getElement("#stats-wrong");
const statsAverageTime = getElement("#stats-average-time");
const statsList = getElement("#stats-list");
const rewardsScreen = getElement("#rewards-screen");
const rewardsList = getElement("#rewards-list");

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");

// Init
if (startBtn) {
  startBtn.addEventListener("click", startQuiz);
} else {
  console.error("startBtn not found");
}
if (nextBtn) {
  nextBtn.addEventListener("click", nextQuestion);
}
if (restartThemeBtn) {
  restartThemeBtn.addEventListener("click", restartCurrentTheme);
}
if (backHomeBtn) {
  backHomeBtn.addEventListener("click", returnToHome);
}
if (restartBtn) {
  restartBtn.addEventListener("click", restartQuiz);
}
if (tweetBtn) {
  tweetBtn.addEventListener("click", tweetScore);
}
if (playAudioBtn) {
  playAudioBtn.addEventListener("click", toggleAudioPlayback);
}
if (hintBtn) {
  hintBtn.addEventListener("click", revealHint);
}

setText(bestScoreValue, bestScore);

const clearTimers = () => {
  clearInterval(questionTimerId);
  clearInterval(globalTimerId);
  questionTimerId = null;
  globalTimerId = null;
};

const updateProgressBar = () => {
  if (!progressFill) {
    return;
  }
  const total = activeQuestions.length;
  const current = Math.min(currentQuestionIndex + 1, total);
  const percent = total ? Math.round((current / total) * 100) : 0;
  progressFill.style.width = `${percent}%`;
};

const updateThemeCards = () => {
  if (!themeInputs.length) {
    return;
  }
  themeInputs.forEach((input) => {
    const theme = themesById[input.value];
    if (!theme) {
      return;
    }
    const card = input.closest(".theme-card");
    if (!card) {
      return;
    }
    const title = card.querySelector(".theme-card__title");
    const desc = card.querySelector(".theme-card__desc");
    if (title) {
      setText(title, theme.label);
    }
    if (desc) {
      setText(desc, theme.description || "");
    }
  });
};

updateThemeCards();

const preloadedImages = new Set();

const preloadImages = (sources = []) => {
  sources.forEach((src) => {
    if (!src || preloadedImages.has(src)) {
      return;
    }
    const img = new Image();
    img.decoding = "async";
    img.setAttribute("fetchpriority", "low");
    img.src = src;
    preloadedImages.add(src);
  });
};

const collectQuestionImages = (question) => {
  if (!question) {
    return [];
  }
  const sources = [];
  if (question.promptImage) {
    sources.push(question.promptImage);
  }
  (question.answers || []).forEach((answer) => {
    if (answer && typeof answer === "object" && answer.imageSrc) {
      sources.push(answer.imageSrc);
    }
  });
  return sources;
};

const preloadUpcomingQuestions = (count = 2) => {
  if (!activeQuestions.length) {
    return;
  }
  const sources = [];
  for (let offset = 1; offset <= count; offset += 1) {
    const question = activeQuestions[currentQuestionIndex + offset];
    if (question) {
      sources.push(...collectQuestionImages(question));
    }
  }
  if (!sources.length) {
    return;
  }
  const schedule = () => preloadImages(sources);
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    window.requestIdleCallback(schedule);
  } else {
    setTimeout(schedule, 0);
  }
};

const isImageQuestion = (question) =>
  Boolean(
    (question && question.promptImage) ||
      question?.answerType === "image" ||
      currentTheme?.answerType === "image"
  );

const isAudioDisabledForQuestion = (question) =>
  Boolean(currentTheme?.disableAudio || question?.disableAudio);

const getSelectedTheme = () => {
  const selectedInput = Array.from(themeInputs).find((input) => input.checked);
  if (selectedInput && themesById[selectedInput.value]) {
    return themesById[selectedInput.value];
  }
  return themes[0] || baseThemes[0];
};

const updateThemeLabel = (theme) => {
  if (!themeLabel || !theme) {
    return;
  }
  setText(themeLabel, theme.label);
};

const getDifficultyLabel = (difficulty) =>
  DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS.medium;

const formatSeconds = (value) => {
  if (!Number.isFinite(value)) {
    return "0s";
  }
  return `${value.toFixed(1)} s`;
};

const hasSpeechSupport = () =>
  "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

const pickPreferredVoice = (voices) => {
  if (!voices.length) {
    return null;
  }
  const prefix = VOICE_PREFIX;
  return (
    voices.find(
      (voice) => voice.lang.toLowerCase().startsWith(prefix) && voice.localService
    ) ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith(prefix)) ||
    voices.find((voice) => voice.localService) ||
    voices[0]
  );
};

const loadSpeechVoices = () => {
  if (!hasSpeechSupport()) {
    speechVoices = [];
    preferredVoice = null;
    return;
  }
  const voices = window.speechSynthesis.getVoices();
  speechVoices = Array.isArray(voices) ? voices : [];
  preferredVoice = pickPreferredVoice(speechVoices);
};

const updateAudioUI = ({ playing, available, status, statusKey }) => {
  if (typeof available === "boolean") {
    audioAvailable = available;
  }
  if (typeof statusKey === "string") {
    audioStatusMessage = statusKey ? getAudioStatusCopy(statusKey) : "";
  } else if (typeof status === "string") {
    audioStatusMessage = status;
  }
  if (typeof playing === "boolean") {
    isAudioPlaying = playing;
  }
  if (!playAudioBtn) {
    return;
  }
  playAudioBtn.disabled = !audioAvailable;
  playAudioBtn.classList.toggle("is-playing", Boolean(playing));
  playAudioBtn.textContent = isAudioPlaying
    ? AUDIO_LABELS.playing
    : AUDIO_LABELS.default;
  if (audioStatus) {
    setText(audioStatus, audioStatusMessage);
  }
};

const stopAudio = ({ showStatus } = { showStatus: false }) => {
  if (!audioPlayer.paused) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
  }
  if (hasSpeechSupport()) {
    window.speechSynthesis.cancel();
  }
  if (showStatus) {
    updateAudioUI({ playing: false, statusKey: "audio.statusStopped" });
  } else {
    isAudioPlaying = false;
  }
};

const getAudioSource = (question, index) => {
  if (USE_SPEECH_ONLY) {
    return null;
  }
  if (question && question.audioSrc) {
    return question.audioSrc;
  }
  const safeIndex = Number.isFinite(index) ? index : 0;
  return `${AUDIO_BASE_PATH}/question-${String(safeIndex + 1).padStart(
    2,
    "0"
  )}.mp3`;
};

const speakQuestion = (text) => {
  if (!hasSpeechSupport()) {
    updateAudioUI({ playing: false, statusKey: "audio.statusUnavailable" });
    return;
  }
  const speakNow = () => {
    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    speechUtterance = new SpeechSynthesisUtterance(text);
    speechUtterance.lang = SPEECH_LOCALE;
    if (!speechVoices.length) {
      loadSpeechVoices();
    }
    if (preferredVoice) {
      speechUtterance.voice = preferredVoice;
    }
    speechUtterance.rate = 1;
    speechUtterance.pitch = 1;
    speechUtterance.volume = 1;
    speechUtterance.onstart = () => {
      updateAudioUI({ playing: true, statusKey: "audio.statusPlaying" });
    };
    speechUtterance.onend = () => {
      updateAudioUI({ playing: false, statusKey: "audio.statusReady" });
    };
    speechUtterance.onerror = () => {
      updateAudioUI({ playing: false, statusKey: "audio.statusUnavailable" });
    };
    window.speechSynthesis.speak(speechUtterance);
    setTimeout(() => {
      if (!window.speechSynthesis.speaking) {
        window.speechSynthesis.speak(speechUtterance);
      }
    }, 200);
    updateAudioUI({ playing: true, statusKey: "audio.statusSpeech" });
  };

  if (!speechVoices.length) {
    loadSpeechVoices();
  }
  if (!preferredVoice && speechVoices.length) {
    preferredVoice = pickPreferredVoice(speechVoices);
  }
  if (!speechVoices.length) {
    updateAudioUI({ playing: false, statusKey: "audio.statusLoading" });
    window.speechSynthesis.onvoiceschanged = () => {
      loadSpeechVoices();
      preferredVoice = pickPreferredVoice(speechVoices);
      speakNow();
    };
    return;
  }
  speakNow();
};

const playAudioFile = async (src, fallbackText) => {
  audioFallbackText = fallbackText;
  if (audioPlayer.src !== src) {
    audioPlayer.src = src;
  }
  try {
    await audioPlayer.play();
    updateAudioUI({ playing: true, statusKey: "audio.statusPlaying" });
  } catch (error) {
    if (hasSpeechSupport()) {
      speakQuestion(fallbackText);
    } else {
      updateAudioUI({ playing: false, statusKey: "audio.statusNotFound" });
    }
  }
};

const prepareAudioForQuestion = () => {
  stopAudio();
  const q = activeQuestions[currentQuestionIndex];
  if (!q) {
    updateAudioUI({ playing: false, available: false, statusKey: "" });
    return;
  }
  const disableAudio = isAudioDisabledForQuestion(q);
  if (questionActions) {
    questionActions.classList.toggle("hidden", disableAudio);
  }
  if (disableAudio) {
    updateAudioUI({ playing: false, available: false, statusKey: "" });
    return;
  }
  if (USE_SPEECH_ONLY) {
    const speechAvailable = hasSpeechSupport();
    updateAudioUI({
      playing: false,
      available: speechAvailable,
      statusKey: speechAvailable
        ? "audio.statusSpeechReady"
        : "audio.statusSpeechUnavailable",
    });
    return;
  }
  const src = getAudioSource(q, currentQuestionIndex);
  audioSourceForQuestion = src;
  audioFallbackText = q.text;
  if (src) {
    updateAudioUI({ playing: false, available: true, statusKey: "audio.statusReady" });
  } else if (hasSpeechSupport()) {
    updateAudioUI({
      playing: false,
      available: true,
      statusKey: "audio.statusSpeechAvailable",
    });
  } else {
    updateAudioUI({
      playing: false,
      available: false,
      statusKey: "audio.statusUnavailable",
    });
  }
};

function toggleAudioPlayback() {
  if (!playAudioBtn) {
    return;
  }
  if (isAudioPlaying) {
    stopAudio({ showStatus: true });
    return;
  }
  const q = activeQuestions[currentQuestionIndex];
  if (!q) {
    return;
  }
  if (isAudioDisabledForQuestion(q)) {
    updateAudioUI({ playing: false, available: false, statusKey: "" });
    return;
  }
  if (USE_SPEECH_ONLY) {
    if (hasSpeechSupport()) {
      speakQuestion(q.text);
    } else {
      updateAudioUI({ playing: false, statusKey: "audio.statusSpeechUnavailable" });
    }
    return;
  }
  const src = getAudioSource(q, currentQuestionIndex);
  if (src) {
    playAudioFile(src, q.text);
  } else if (hasSpeechSupport()) {
    speakQuestion(q.text);
  } else {
    updateAudioUI({ playing: false, statusKey: "audio.statusUnavailable" });
  }
}

audioPlayer.addEventListener("ended", () => {
  updateAudioUI({ playing: false, statusKey: "audio.statusReady" });
});

audioPlayer.addEventListener("error", () => {
  if (hasSpeechSupport() && audioFallbackText) {
    speakQuestion(audioFallbackText);
  } else {
    updateAudioUI({ playing: false, statusKey: "audio.statusNotFound" });
  }
});

if (hasSpeechSupport()) {
  loadSpeechVoices();
  window.speechSynthesis.onvoiceschanged = loadSpeechVoices;
}

const resetHintUI = () => {
  if (hintBox) {
    hintBox.classList.add("hidden");
    setText(hintBox, "");
  }
  if (hintStatus) {
    setText(hintStatus, "");
  }
  if (hintBtn) {
    hintBtn.disabled = true;
    hintBtn.classList.add("hidden");
    hintBtn.classList.remove("is-used");
    hintBtn.setAttribute("aria-expanded", "false");
  }
};

const setupHintForQuestion = (question) => {
  resetHintUI();
  if (!hintBtn || !hintBox || !question) {
    return;
  }
  const hasHint = question.difficulty === "hard" && Boolean(question.hint);
  if (!hasHint) {
    return;
  }
  hintBtn.classList.remove("hidden");
  hintBtn.disabled = false;
  hintBtn.setAttribute("aria-expanded", "false");
};

function revealHint() {
  const question = activeQuestions[currentQuestionIndex];
  if (!hintBtn || !hintBox || !question) {
    return;
  }
  if (question.difficulty !== "hard" || !question.hint) {
    return;
  }
  setText(hintBox, question.hint);
  hintBox.classList.remove("hidden");
  hintBtn.disabled = true;
   hintBtn.classList.add("is-used");
  hintBtn.setAttribute("aria-expanded", "true");
}

const resetStats = () => {
  questionStats = new Array(activeQuestions.length).fill(null);
  questionStartTime = null;
  if (statsList) {
    statsList.innerHTML = "";
  }
  if (statsCorrect) {
    setText(statsCorrect, "0");
  }
  if (statsWrong) {
    setText(statsWrong, "0");
  }
  if (statsAverageTime) {
    setText(statsAverageTime, "0s");
  }
};

const recordQuestionStats = ({ isCorrect, timedOut }) => {
  if (isInfiniteMode) {
    return;
  }
  if (questionStats[currentQuestionIndex]) {
    return;
  }
  const q = activeQuestions[currentQuestionIndex];
  if (!q) {
    return;
  }
  const now = Date.now();
  const timeSpent = questionStartTime ? (now - questionStartTime) / 1000 : 0;
  questionStats[currentQuestionIndex] = {
    text: q.text,
    difficulty: q.difficulty,
    isCorrect: Boolean(isCorrect) && !timedOut,
    timedOut: Boolean(timedOut),
    timeSpent,
  };
};

const renderStats = () => {
  if (!statsList) {
    return;
  }
  const entries = questionStats.filter(Boolean);
  const correctCount = entries.filter((entry) => entry.isCorrect).length;
  const wrongCount = entries.length - correctCount;
  const averageTime = entries.length
    ? entries.reduce((sum, entry) => sum + entry.timeSpent, 0) / entries.length
    : 0;

  setText(statsCorrect, correctCount.toString());
  setText(statsWrong, wrongCount.toString());
  setText(statsAverageTime, formatSeconds(averageTime));

  statsList.innerHTML = "";
  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.classList.add("stats-item");

    const title = document.createElement("div");
    title.classList.add("stats-question");
    title.textContent = `${index + 1}. ${entry.text}`;

    const meta = document.createElement("div");
    meta.classList.add("stats-meta");

    const difficultyBadge = document.createElement("span");
    difficultyBadge.classList.add(
      "stats-badge",
      `stats-badge--${entry.difficulty || "medium"}`
    );
    difficultyBadge.textContent = getDifficultyLabel(entry.difficulty);

    const statusBadge = document.createElement("span");
    if (entry.timedOut) {
      statusBadge.classList.add("stats-badge", "stats-badge--timeout");
      statusBadge.textContent = STATUS_LABELS.timeout;
    } else if (entry.isCorrect) {
      statusBadge.classList.add("stats-badge", "stats-badge--good");
      statusBadge.textContent = STATUS_LABELS.correct;
    } else {
      statusBadge.classList.add("stats-badge", "stats-badge--bad");
      statusBadge.textContent = STATUS_LABELS.wrong;
    }

    const timeBadge = document.createElement("span");
    timeBadge.classList.add("stats-time");
    timeBadge.textContent = formatSeconds(entry.timeSpent);

    meta.append(difficultyBadge, statusBadge, timeBadge);
    item.append(title, meta);
    statsList.appendChild(item);
  });
};

const rewardDefinitions = [
  { id: "starter", threshold: 5 },
  { id: "top10", threshold: 10 },
  { id: "expert", threshold: 15 },
  { id: "perfect", isPerfect: true },
];

const renderRewards = () => {
  if (!rewardsList) {
    return;
  }
  const entries = questionStats.filter(Boolean);
  const correctCount = entries.filter((entry) => entry.isCorrect).length;
  const totalQuestions = activeQuestions.length;

  rewardsList.innerHTML = "";
  rewardDefinitions.forEach((reward) => {
    const isPerfect =
      reward.isPerfect && totalQuestions > 0 && correctCount === totalQuestions;
    const earned =
      isPerfect || (!reward.isPerfect && correctCount >= reward.threshold);

    const rewardCopy = REWARD_BADGES[reward.id];

    const card = document.createElement("div");
    card.classList.add(
      "reward-card",
      earned ? "reward-card--earned" : "reward-card--locked"
    );

    const icon = document.createElement("div");
    icon.classList.add("reward-card__icon");
    icon.textContent = reward.isPerfect ? "100%" : `${reward.threshold}+`;

    const title = document.createElement("div");
    title.classList.add("reward-card__title");
    title.textContent = rewardCopy?.title || reward.id;

    const description = document.createElement("div");
    description.classList.add("reward-card__desc");
    description.textContent = rewardCopy?.description || "";

    const status = document.createElement("div");
    status.classList.add("reward-card__status");
    status.textContent = earned
      ? REWARD_STATUS.earned
      : REWARD_STATUS.locked;

    card.append(icon, title, description, status);
    rewardsList.appendChild(card);
  });
};

const getTimeTrialDuration = () => {
  if (!timeTrialDurationInput) {
    return TIME_TRIAL_DURATION;
  }
  const rawValue = parseInt(timeTrialDurationInput.value, 10);
  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return TIME_TRIAL_DURATION;
  }
  return rawValue;
};

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);
  if (rewardsScreen) {
    hideElement(rewardsScreen);
  }
  if (statsScreen) {
    hideElement(statsScreen);
  }

  clearTimers();
  resetHintUI();
  currentTheme = getSelectedTheme();
  if (!currentTheme || !Array.isArray(currentTheme.questions)) {
    currentTheme = themes[0] || baseThemes[0];
  }
  activeQuestions = buildProgressiveQuestions(currentTheme?.questions || []);
  updateThemeLabel(currentTheme);
  resetStats();
  currentQuestionIndex = 0;
  infiniteQuestionCount = 0;
  score = 0;
  isFlashcardMode = flashcardToggle ? flashcardToggle.checked : false;
  isInfiniteMode = infiniteToggle ? infiniteToggle.checked : false;
  isTimeTrial =
    !isFlashcardMode && !isInfiniteMode && timeTrialToggle
      ? timeTrialToggle.checked
      : false;

  setText(
    totalQuestionsSpan,
    isInfiniteMode ? INFINITE_TOTAL_LABEL : activeQuestions.length
  );

  if (isFlashcardMode) {
    hideElement(globalTimerDiv);
    hideElement(timerDiv);
  } else if (isTimeTrial) {
    globalTimeLeft = getTimeTrialDuration();
    setText(globalTimeLeftSpan, globalTimeLeft);
    showElement(globalTimerDiv);
    hideElement(timerDiv);
    globalTimerId = startTimer(
      globalTimeLeft,
      (timeLeft) => {
        globalTimeLeft = timeLeft;
        setText(globalTimeLeftSpan, timeLeft);
      },
      () => {
        recordQuestionStats({ isCorrect: false, timedOut: true });
        lockAnswers(answersDiv);
        endQuiz();
      }
    );
  } else {
    hideElement(globalTimerDiv);
    showElement(timerDiv);
  }

  showQuestion();
}

function showQuestion() {
  clearInterval(questionTimerId);

  const q = activeQuestions[currentQuestionIndex];
  if (!q) {
    endQuiz();
    return;
  }
  setText(questionText, q.text);
  const displayIndex = isInfiniteMode
    ? infiniteQuestionCount + 1
    : currentQuestionIndex + 1;
  setText(currentQuestionIndexSpan, displayIndex);
  updateProgressBar();
  setupHintForQuestion(q);
  questionStartTime = Date.now();
  const isImage = isImageQuestion(q);
  const promptSrc = isImage ? q.promptImage : "";
  if (questionMedia && questionImage) {
    if (promptSrc) {
      questionMedia.classList.remove("hidden");
      questionMedia.classList.add("is-loading");
      questionImage.decoding = "async";
      questionImage.loading = "eager";
      questionImage.setAttribute("fetchpriority", "high");
      questionImage.onload = () => questionMedia.classList.remove("is-loading");
      questionImage.onerror = () => questionMedia.classList.remove("is-loading");
      questionImage.src = promptSrc;
      questionImage.alt = q.promptAlt || q.text || "Illustration de la question";
    } else {
      questionMedia.classList.add("hidden");
      questionMedia.classList.remove("is-loading");
      questionImage.src = "";
      questionImage.alt = "";
    }
  }
  answersDiv.classList.toggle("answers--image", isImage);
  prepareAudioForQuestion();

  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  if (isFlashcardMode) {
    nextBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.add("hidden");
  }

  preloadUpcomingQuestions(2);

  if (isTimeTrial || isFlashcardMode) {
    return;
  }

  setText(timeLeftSpan, q.timeLimit);
  questionTimerId = startTimer(
    q.timeLimit,
    (timeLeft) => setText(timeLeftSpan, timeLeft),
    () => {
      recordQuestionStats({ isCorrect: false, timedOut: true });
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
}

function selectAnswer(index, btn) {
  clearInterval(questionTimerId);

  const q = activeQuestions[currentQuestionIndex];
  if (index === q.correct) {
    if (!isFlashcardMode) {
      score++;
    }
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }

  recordQuestionStats({ isCorrect: index === q.correct, timedOut: false });
  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (isInfiniteMode) {
    infiniteQuestionCount++;
    if (currentQuestionIndex >= activeQuestions.length) {
      activeQuestions = buildProgressiveQuestions(currentTheme?.questions || []);
      currentQuestionIndex = 0;
    }
    showQuestion();
    return;
  }
  if (currentQuestionIndex < activeQuestions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  clearTimers();
  stopAudio();
  resetHintUI();
  hideElement(questionScreen);
  showElement(resultScreen);

  if (isFlashcardMode) {
    scoreText.textContent = TRAINING_COMPLETE_LABEL;
    setText(bestScoreEnd, bestScore);
  } else {
    updateScoreDisplay(scoreText, score, activeQuestions.length);
    if (score > bestScore) {
      bestScore = score;
      saveToLocalStorage("bestScore", bestScore);
    }
    setText(bestScoreEnd, bestScore);
  }
  renderStats();
  if (statsScreen) {
    showElement(statsScreen);
  }
  renderRewards();
  if (rewardsScreen) {
    showElement(rewardsScreen);
  }
}

function restartCurrentTheme() {
  hideElement(resultScreen);
  if (rewardsScreen) {
    hideElement(rewardsScreen);
  }
  if (statsScreen) {
    hideElement(statsScreen);
  }
  startQuiz();
}

function returnToHome() {
  clearTimers();
  stopAudio();
  hideElement(questionScreen);
  hideElement(resultScreen);
  if (rewardsScreen) {
    hideElement(rewardsScreen);
  }
  if (statsScreen) {
    hideElement(statsScreen);
  }
  showElement(introScreen);
  setText(bestScoreValue, bestScore);
}

function restartQuiz() {
  clearTimers();
  stopAudio();
  resetHintUI();
  hideElement(resultScreen);
  if (rewardsScreen) {
    hideElement(rewardsScreen);
  }
  if (statsScreen) {
    hideElement(statsScreen);
  }
  showElement(introScreen);

  setText(bestScoreValue, bestScore);
}

function tweetScore() {
  const totalQuestions = activeQuestions.length;
  const tweetText = formatTweetText(score, totalQuestions);
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}`;
  window.open(tweetUrl, "_blank");
}
