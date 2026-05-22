export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export function getRandomColor(): string {
  const colors = [
    '#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5',
    '#ede9fe', '#ffe4e6', '#e0e7ff', '#ccfbf1',
    '#f5f5f4', '#fef9c3', '#f3e8ff', '#ffedd5',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getDarkColor(): string {
  const colors = [
    '#1e1b4b', '#1c1917', '#0f172a', '#172554',
    '#1e293b', '#312e81', '#1e1e2e', '#1a1a2e',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getWeekDates(): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

// ─── AI Response System ────────────────────────────────────────────────
// Subject knowledge organized by topic with basic / intermediate / expert levels

interface SubjectEntry {
  keywords: string[]
  basic: string
  intermediate: string
  expert: string
}

const subjectKnowledge: SubjectEntry[] = [
  {
    keywords: ['math', 'algebra', 'calculus', 'geometry', 'trigonometry', 'arithmetic', 'statistics', 'equation'],
    basic: "Here's a simple way to think about it: math is like a toolkit for solving problems. Start with the basics — addition, subtraction, multiplication, division — and build up step by step. The key is practice: try 2-3 problems daily to build muscle memory. Don't rush; understanding the 'why' behind each step matters more than speed.",
    intermediate: "Great question! At the intermediate level, focus on understanding how different areas of math connect. For example, algebra gives you the language to describe patterns, geometry gives you spatial reasoning, and statistics helps you make sense of data. A useful approach: when learning a new concept, try to find its real-world application. This makes abstract ideas concrete and easier to remember.",
    expert: "Excellent depth! At this level, you're looking at mathematical structures and proofs. Focus on rigorous thinking: define your terms clearly, understand the assumptions behind each theorem, and practice constructing proofs. Key areas include abstract algebra, real analysis, topology, and number theory. The beauty of advanced math is seeing how seemingly unrelated ideas — like group theory and geometry — connect through deep structural insights.",
  },
  {
    keywords: ['science', 'physics', 'chemistry', 'biology', 'quantum', 'thermodynamics', 'evolution', 'cell'],
    basic: "Think of science as the process of asking questions about how the world works and finding evidence-based answers. Start with observation — notice something interesting, ask why it happens, then test your ideas. The scientific method is your friend: observe, question, hypothesize, experiment, conclude. Don't worry about getting it wrong — every wrong answer teaches you something!",
    intermediate: "At the intermediate stage, you should focus on understanding the core principles that govern each branch of science. In physics: forces, energy, and motion. In chemistry: atoms, bonds, and reactions. In biology: cells, genetics, and evolution. Try to connect concepts across disciplines — for example, how chemical bonds enable biological processes. This interdisciplinary thinking is what separates good scientists from great ones.",
    expert: "At the expert level, you're engaging with the frontiers of human knowledge. This means understanding uncertainty, statistical significance, and the limits of current models. Key areas include quantum field theory, molecular biology, neurobiology, and climate science. Focus on primary literature — read papers, not just textbooks. Critically evaluate methodologies. The best scientists are those who know what they don't know and ask the right questions.",
  },
  {
    keywords: ['history', 'ancient', 'war', 'civilization', 'revolution', 'empire', 'timeline'],
    basic: "History is the story of us — how people lived, what they believed, and how societies changed over time. A good way to start is by understanding cause and effect: every event has roots in earlier events. Create a simple timeline of key events and practice explaining how one led to another. Focus on the big picture before diving into details.",
    intermediate: "At the intermediate level, move beyond dates and names to analyze themes and patterns. Look at history through different lenses: economic, social, political, and cultural. Compare how different civilizations handled similar challenges — like trade, governance, and conflict. This comparative approach reveals deeper insights about human nature and societal development.",
    expert: "At the expert level, engage with historiography — the study of how history itself is written. Examine primary sources critically: who wrote this, why, and what biases might they have? Explore counterfactual history ('what if' scenarios) to understand contingency. Key areas include economic history, social history, and postcolonial studies. The best historians understand that history is not a fixed story but an ongoing conversation with the past.",
  },
  {
    keywords: ['code', 'coding', 'programming', 'python', 'javascript', 'java', 'algorithm', 'software', 'web', 'app', 'function', 'variable'],
    basic: "Coding is like giving instructions to a computer. Start with the basics: variables (storing data), conditions (if/else), loops (repeating actions), and functions (reusable blocks). Python is a great first language because its syntax is clean and readable. Try small projects: a calculator, a to-do list, or a simple game. Remember: errors are normal — every error message is a clue that helps you learn!",
    intermediate: "At the intermediate level, focus on understanding how code is structured and how to write clean, maintainable code. Learn about data structures (arrays, objects, linked lists, trees) and algorithms (sorting, searching, recursion). Practice debugging systematically — use a debugger, not just print statements. Study design patterns — they're proven solutions to common problems. And most importantly, read other people's code; it's one of the fastest ways to improve.",
    expert: "At the expert level, you're thinking about architecture, performance, and scalability. Understand time and space complexity analysis (Big O notation). Master concurrency, parallelism, and distributed systems. Study compiler design, operating systems, and network protocols. Contribute to open source — it's the best way to learn from and collaborate with other experts. The best engineers don't just write code that works; they write code that's maintainable, testable, and elegant.",
  },
  {
    keywords: ['exam', 'test', 'study', 'prepare', 'revision', 'review', 'cram'],
    basic: "Start preparing early — even 20 minutes a day is better than cramming. Break your material into small chunks and review one chunk at a time. Use active recall: close your book and try to remember what you learned. This is far more effective than re-reading notes. Also, get enough sleep — your brain consolidates memories while you sleep!",
    intermediate: "At this level, use the Pomodoro Technique: 25 minutes of focused study, 5 minutes break. After 4 cycles, take a longer 15-30 minute break. Use spaced repetition: review material at increasing intervals (1 day, 3 days, 1 week, 1 month). Create concept maps to understand relationships between topics. Practice with past papers under timed conditions to build exam stamina.",
    expert: "At the expert level, focus on metacognition — thinking about your own thinking. Identify which study methods work best for you and optimize accordingly. Use the Feynman Technique: teach the concept to someone else (or pretend to). If you can't explain it simply, you haven't understood it well enough. Analyze past exam patterns and focus on high-yield topics. Practice retrieval under conditions similar to the actual exam (same time of day, same environment).",
  },
  {
    keywords: ['physics', 'motion', 'force', 'energy', 'wave', 'electricity', 'magnetism', 'relativity'],
    basic: "Physics is about understanding how things move and interact. Start with Newton's laws: an object stays at rest or in motion unless a force acts on it (inertia), force equals mass times acceleration (F=ma), and every action has an equal and opposite reaction. Think of everyday examples — a car accelerating, a ball falling, a magnet sticking to your fridge. Physics is everywhere!",
    intermediate: "At the intermediate level, you should be comfortable with mathematical descriptions of physical phenomena. Master energy conservation — it's one of the most powerful tools in physics. Understand the difference between classical and modern physics: classical physics describes everyday objects, while modern physics (quantum mechanics, relativity) describes the very small and the very fast. Practice solving problems using multiple approaches to build intuition.",
    expert: "At the expert level, you're working with advanced mathematical frameworks: Lagrangian and Hamiltonian mechanics, Maxwell's equations in tensor form, and the Dirac equation. Explore quantum field theory, general relativity, and string theory. Focus on symmetry principles — Noether's theorem connects symmetries to conservation laws. Read original papers by Feynman, Einstein, and Dirac to understand how great physicists think.",
  },
  {
    keywords: ['chemistry', 'element', 'reaction', 'molecule', 'atom', 'bond', 'periodic', 'acid', 'base'],
    basic: "Chemistry is the study of matter and how it changes. Start with the periodic table — it's your roadmap. Learn the first 20 elements and their symbols. Understand that atoms bond to become more stable: ionic bonds (transfer electrons), covalent bonds (share electrons). Think of chemical reactions as rearranging atoms — the same atoms just in different arrangements. The fun part: you can see chemistry everywhere — cooking, cleaning, even breathing!",
    intermediate: "At the intermediate level, focus on stoichiometry (calculating quantities in reactions), thermodynamics (energy changes), and kinetics (reaction rates). Master balancing chemical equations — it's essential for everything that follows. Understand the mole concept: it's the bridge between the atomic world and the laboratory. Learn about intermolecular forces — they explain why water boils at 100°C but methane boils at -161°C.",
    expert: "At the expert level, you're working with quantum chemistry, spectroscopy, and advanced organic synthesis. Understand molecular orbital theory, symmetry and group theory, and reaction mechanisms at the electron-pushing level. Explore computational chemistry — using computers to model molecular behavior. Read primary literature to understand current frontiers like photocatalysis, organometallic chemistry, and materials science.",
  },
  {
    keywords: ['biology', 'cell', 'dna', 'gene', 'evolution', 'ecosystem', 'organism', 'protein', 'photosynthesis'],
    basic: "Biology is the study of life. Start with the cell — it's the basic unit of life. Learn the difference between plant and animal cells, and understand what each organelle does. Think of DNA as an instruction manual for building and operating an organism. Evolution by natural selection is the unifying theory of biology: organisms with helpful traits survive and pass those traits on. It's simple but powerful!",
    intermediate: "At the intermediate level, understand how biological systems work at multiple levels — from molecules to ecosystems. Master cellular respiration and photosynthesis — they're the energy currencies of life. Learn about gene expression and regulation: how does the same DNA produce different cell types? Understand ecological relationships: food webs, nutrient cycles, and population dynamics. The key theme: everything in biology is connected.",
    expert: "At the expert level, engage with cutting-edge areas: genomics, proteomics, and systems biology. Understand CRISPR gene editing, epigenetics, and the microbiome. Explore how mathematical modeling is used to understand biological systems — from protein folding to population dynamics. Read primary research papers and understand experimental design. The frontier of biology is at the intersection of computation, engineering, and traditional biology.",
  },
  {
    keywords: ['psychology', 'brain', 'mind', 'behavior', 'cognitive', 'mental', 'emotion', 'personality', 'therapy'],
    basic: "Psychology is the scientific study of mind and behavior. Start with the major perspectives: biological (how the brain works), cognitive (how we think), behavioral (how we learn), and social (how others influence us). Learn about classical and operant conditioning — they explain a lot about why we do what we do. The brain is the most complex object in the known universe, so take it step by step!",
    intermediate: "At the intermediate level, explore research methods — how do psychologists actually know what they claim? Understand correlation vs. causation, experimental design, and statistical significance. Study major theories of personality (Freud, Jung, Big Five), development (Piaget, Erikson), and social psychology (conformity, obedience, group dynamics). Learn about cognitive biases — they affect everyone, including you!",
    expert: "At the expert level, engage with current research in cognitive neuroscience, neuropsychology, and clinical psychology. Understand brain imaging techniques (fMRI, EEG, PET) and what they can and cannot tell us. Explore the nature of consciousness — one of the biggest unanswered questions in science. Read primary literature on topics like memory reconsolidation, neuroplasticity, and the computational theory of mind.",
  },
  {
    keywords: ['philosophy', 'logic', 'ethics', 'argument', 'reason', 'truth', 'existence', 'knowledge', 'morality'],
    basic: "Philosophy is about asking fundamental questions and using reason to explore them. Start with logic: learn to identify arguments, premises, and conclusions. Understand common logical fallacies (straw man, ad hominem, false dilemma) — they'll make you a better thinker in everyday life. Ethics asks 'how should we live?' — explore different frameworks like utilitarianism (greatest good for the greatest number) and deontology (duty-based ethics).",
    intermediate: "At the intermediate level, dive into the major branches: metaphysics (what is real?), epistemology (what can we know?), ethics (how should we live?), and aesthetics (what is beauty?). Study the major philosophers — Plato, Aristotle, Descartes, Hume, Kant, Nietzsche — and understand their arguments in their historical context. Learn to construct and evaluate philosophical arguments rigorously. The goal is not to find final answers but to think more clearly.",
    expert: "At the expert level, engage with contemporary philosophical debates and specialized subfields. Explore philosophy of mind (the hard problem of consciousness), philosophy of science (what makes a theory scientific?), and meta-ethics (what does 'good' even mean?). Read primary texts carefully — the best philosophy is in the original arguments, not summaries. Write your own philosophical arguments and submit them to peer review.",
  },
  {
    keywords: ['economics', 'market', 'supply', 'demand', 'inflation', 'gdp', 'trade', 'finance', 'money', 'invest'],
    basic: "Economics is about how people make choices with limited resources. Start with the fundamental concept: opportunity cost — choosing one thing means giving up another. Supply and demand determine prices: when demand goes up and supply stays the same, prices rise. Think of economics as a way of understanding why people, businesses, and governments make the decisions they do.",
    intermediate: "At the intermediate level, understand the difference between microeconomics (individuals and firms) and macroeconomics (the whole economy). Learn about market structures (perfect competition, monopoly, oligopoly), externalities (when your actions affect others), and public goods. Master key macroeconomic concepts: GDP, inflation, unemployment, and fiscal vs. monetary policy. Explore how economic models simplify complex reality to make it understandable.",
    expert: "At the expert level, engage with advanced economic theory and econometrics. Understand game theory, behavioral economics (how psychology affects economic decisions), and development economics. Learn to build and critique economic models — all models are wrong, but some are useful. Explore the history of economic thought: from Smith to Marx to Keynes to Hayek. The frontier includes complexity economics, ecological economics, and the economics of inequality.",
  },
  {
    keywords: ['literature', 'poetry', 'novel', 'drama', 'essay', 'author', 'theme', 'narrative', 'character', 'plot'],
    basic: "Literature is the art of written expression. Start by reading actively — don't just follow the plot, ask questions: why did the author choose these words? What is the theme? How does the character change? Learn the basic elements: plot (what happens), character (who it happens to), setting (where it happens), theme (what it means), and style (how it's told). Every story has something to say about the human experience.",
    intermediate: "At the intermediate level, learn to analyze literature through different critical lenses: biographical (how does the author's life inform the work?), historical (what was happening when it was written?), psychological (what do characters' motivations reveal?), and feminist (how does the work engage with gender?). Understand literary movements: Romanticism, Realism, Modernism, Postmodernism. Practice close reading — analyzing a single passage in depth.",
    expert: "At the expert level, engage with literary theory — structuralism, post-structuralism, deconstruction, postcolonial theory, and ecocriticism. Read critical essays and scholarly articles to see how professional critics analyze texts. Explore comparative literature: how do different cultures and traditions approach similar themes? Write your own critical analysis and engage with the scholarly conversation. The best literary critics combine deep knowledge with fresh insight.",
  },
  {
    keywords: ['geography', 'map', 'continent', 'country', 'climate', 'population', 'urban', 'environment', 'landform'],
    basic: "Geography is the study of places and the relationships between people and their environments. Start by learning the continents and major countries on a map. Understand the difference between physical geography (mountains, rivers, climate) and human geography (cities, cultures, economies). A great way to learn: pick a country each day and learn one interesting fact about it.",
    intermediate: "At the intermediate level, explore how geographic factors shape human societies. Why are some regions densely populated while others are sparse? How does climate affect agriculture, culture, and economy? Learn about plate tectonics, weather systems, and biomes. Understand urban geography: why do cities develop where they do, and how do they grow? Use GIS (Geographic Information Systems) to analyze spatial data.",
    expert: "At the expert level, engage with critical geography and spatial analysis. Explore how geographic information systems (GIS) and remote sensing are used to study environmental change, urban development, and population dynamics. Understand political geography: borders, territories, and geopolitics. Study climate change impacts at regional scales. The frontier includes the geography of cyberspace, health geography, and sustainable development.",
  },
  {
    keywords: ['english', 'grammar', 'writing', 'vocabulary', 'essay', 'speech', 'communication', 'language'],
    basic: "Good communication starts with clear thinking. Focus on the basics: write complete sentences, use punctuation correctly, and organize your thoughts into paragraphs. Before writing, ask yourself: who is my audience and what do I want them to understand? Read your writing aloud — if it sounds awkward, it probably is. Practice writing a little every day, even if it's just a journal entry.",
    intermediate: "At the intermediate level, master different writing modes: narrative (telling a story), persuasive (convincing someone), expository (explaining something), and descriptive (painting a picture with words). Learn to write a strong thesis statement — it's the backbone of any essay. Study sentence variety: mix short and long sentences for rhythm. Use active voice more often than passive. Edit ruthlessly — cut every word that doesn't earn its place.",
    expert: "At the expert level, develop your unique voice while mastering the conventions of academic and professional writing. Study rhetoric — the art of persuasion — including ethos (credibility), pathos (emotion), and logos (logic). Understand genre conventions: how does a scientific paper differ from a literary analysis or a business report? Learn to give and receive constructive feedback. The best writers are also the best readers and editors.",
  },
  {
    keywords: ['astronomy', 'space', 'star', 'planet', 'galaxy', 'universe', 'solar', 'orbit', 'cosmos'],
    basic: "Astronomy is the study of everything beyond Earth. Start with our solar system: the Sun, eight planets, their moons, and other objects like asteroids and comets. Learn the order of the planets from the Sun (My Very Educated Mother Just Served Us Nachos — Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune). Stars are giant balls of burning gas — our Sun is a star! The Milky Way is our galaxy, and there are billions of other galaxies out there.",
    intermediate: "At the intermediate level, understand the life cycle of stars: from nebulae to protostars to main sequence stars, and then either white dwarfs (for small stars) or supernovae leading to neutron stars and black holes (for massive stars). Learn about the electromagnetic spectrum and how astronomers use different wavelengths to see invisible phenomena. Understand Kepler's laws of planetary motion and how they explain orbits.",
    expert: "At the expert level, engage with cosmology — the study of the universe's origin and evolution. Understand the Big Bang theory, cosmic microwave background radiation, dark matter, and dark energy. Explore general relativity and its predictions: black holes, gravitational waves, and the expansion of the universe. Read about current debates: the Hubble constant tension, the nature of dark matter, and the possibility of multiverses.",
  },
  {
    keywords: ['engineering', 'mechanical', 'electrical', 'civil', 'circuit', 'design', 'system', 'structure', 'material'],
    basic: "Engineering is about applying scientific principles to solve real-world problems. Start with the engineering design process: define the problem, research, brainstorm solutions, prototype, test, and improve. Understand the different branches: mechanical (moving things), electrical (electronics and power), civil (structures and infrastructure), and software (code and systems). Every great engineer started as a beginner!",
    intermediate: "At the intermediate level, focus on the mathematical foundations of your engineering discipline. For mechanical: statics, dynamics, and thermodynamics. For electrical: circuit analysis, signals, and systems. For civil: structural analysis, fluid mechanics, and geotechnical engineering. Learn to use industry-standard tools (CAD software, simulation tools, programming languages). Practice problem-solving methodically — break complex problems into smaller, manageable parts.",
    expert: "At the expert level, you're designing complex systems that must be safe, efficient, and reliable. Understand failure modes and safety factors. Learn project management and systems engineering — how to coordinate large teams and complex projects. Stay current with emerging technologies: AI in engineering, sustainable design, advanced materials (composites, nanomaterials). The best engineers combine deep technical knowledge with creativity and ethical responsibility.",
  },
  {
    keywords: ['music', 'theory', 'instrument', 'rhythm', 'melody', 'harmony', 'note', 'scale', 'chord'],
    basic: "Music is organized sound. Start with the basics: notes (pitch), rhythm (timing), and dynamics (loudness). Learn the major scale — it's the foundation of Western music. Understand that music theory is just a way of describing what sounds good — it's descriptive, not prescriptive. The best way to learn music: listen actively, practice regularly, and play with others.",
    intermediate: "At the intermediate level, study harmony and chord progressions. Understand how chords are built (triads, seventh chords) and how they function within a key. Learn about different musical forms (sonata, concerto, symphony, blues, jazz). Practice ear training — identifying intervals, chords, and rhythms by ear. Study music history to understand how different styles evolved and influenced each other.",
    expert: "At the expert level, explore advanced harmony, counterpoint, and orchestration. Understand serialism, atonality, and other 20th-century techniques. Study music cognition: how does the brain process music? Learn about acoustics and psychoacoustics — the physics of sound and how we perceive it. The best musicians combine technical mastery with emotional expression and deep theoretical knowledge.",
  },
  {
    keywords: ['geology', 'earth', 'rock', 'mineral', 'volcano', 'earthquake', 'tectonic', 'fossil', 'mountain'],
    basic: "Geology is the study of the Earth. Start by understanding plate tectonics — the Earth's surface is made of moving plates that cause earthquakes, volcanoes, and mountain building. Learn the three types of rocks: igneous (from cooled magma), sedimentary (from compressed sediments), and metamorphic (changed by heat and pressure). The rock cycle shows how rocks transform from one type to another over millions of years.",
    intermediate: "At the intermediate level, study Earth's internal structure: crust, mantle, outer core, and inner core. Understand radiometric dating — how we know rocks are millions or billions of years old. Learn about different types of volcanoes and their eruption styles. Study groundwater, aquifers, and how water shapes landscapes. Explore economic geology: where do valuable minerals and fossil fuels come from?",
    expert: "At the expert level, engage with advanced topics: seismology (using earthquake waves to image Earth's interior), geochemistry (chemical composition of Earth materials), and paleontology (fossil records and evolution). Understand Earth's climate history through geologic evidence. Explore planetary geology — applying geological principles to other planets. Current frontiers include deep Earth imaging, earthquake prediction research, and carbon sequestration.",
  },
  {
    keywords: ['medicine', 'anatomy', 'physiology', 'disease', 'treatment', 'diagnosis', 'symptom', 'health', 'body', 'doctor'],
    basic: "Medicine is the science and practice of maintaining health and treating disease. Start with basic anatomy — know the major organs and their functions (heart pumps blood, lungs exchange gases, brain controls everything). Understand that prevention is better than cure: healthy diet, regular exercise, adequate sleep, and stress management are the foundations of health.",
    intermediate: "At the intermediate level, understand how body systems work together: the cardiovascular system delivers oxygen and nutrients, the immune system fights infections, the nervous system coordinates responses, and the endocrine system regulates hormones. Learn about common diseases and their mechanisms. Understand the diagnostic process: history taking, physical examination, and diagnostic tests. Study pharmacology basics — how drugs work in the body.",
    expert: "At the expert level, engage with evidence-based medicine: critically evaluating research to make clinical decisions. Understand pathophysiology at the molecular level. Explore emerging fields: personalized medicine (tailoring treatment to your genes), immunotherapy (using the immune system to fight cancer), and regenerative medicine (growing new tissues and organs). The best doctors combine scientific knowledge with empathy and communication skills.",
  },
  {
    keywords: ['business', 'management', 'marketing', 'strategy', 'entrepreneur', 'startup', 'leadership', 'team'],
    basic: "Business is about creating value for customers. Start by understanding the basic functions: marketing (getting customers), operations (delivering products), finance (managing money), and human resources (managing people). Every business needs to solve a problem for its customers. The simplest business model: find a problem, create a solution, and charge for it.",
    intermediate: "At the intermediate level, understand competitive strategy: how does a business win in its market? Learn about Porter's Five Forces, SWOT analysis, and the Business Model Canvas. Understand financial statements: income statement, balance sheet, and cash flow statement. Study marketing concepts: target audience, value proposition, and marketing channels. Learn about organizational behavior — how people and teams work effectively.",
    expert: "At the expert level, engage with strategic thinking at the highest level. Understand corporate finance, mergers and acquisitions, and global business strategy. Learn about innovation management: how do successful companies consistently innovate? Study leadership theories and organizational culture. Explore emerging business models: platform businesses, subscription models, and circular economy. The best business leaders combine analytical rigor with vision and emotional intelligence.",
  },
]

function detectLevel(input: string): 'basic' | 'intermediate' | 'expert' {
  const lower = input.toLowerCase()
  if (/\b(advanced?|expert|professional|master|phd|doctorate|complex|deep)\b/.test(lower)) return 'expert'
  if (/\b(intermediate|medium|moderate|some)\b/.test(lower)) return 'intermediate'
  if (/\b(basic|beginner|simple|easy|new|start|just started|noob|dumb|explain like|eli5|fundamental)\b/.test(lower)) return 'basic'
  return 'intermediate'
}

function detectQuestionType(input: string): string {
  const lower = input.toLowerCase()
  if (/^(what|who)\s+(is|are|was|were|the)/.test(lower)) return 'definition'
  if (/^(how|why|what\s+is\s+the\s+(diff|reason|cause|purpose|meaning))/.test(lower)) return 'explanation'
  if (/^(when|where)\s/.test(lower)) return 'factual'
  if (/^how\s+(to|do|can|would|should|does)/.test(lower)) return 'howto'
  if (/\b(compare|contrast|difference|similar|versus|vs)\b/.test(lower)) return 'comparison'
  if (/\b(define|definition|meaning|what.*mean)\b/.test(lower)) return 'definition'
  if (/\b(explain|describe|elaborate|clarify)\b/.test(lower)) return 'explanation'
  if (/\b(example|show|demonstrate|instance)\b/.test(lower)) return 'example'
  if (/\b(tip|advice|suggest|recommend|best|how can i|how do i)\b/.test(lower)) return 'advice'
  if (lower.endsWith('?')) return 'question'
  return 'general'
}

function findBestSubject(input: string): SubjectEntry | null {
  const lower = input.toLowerCase()
  // Score each subject by how many keywords match
  let best: SubjectEntry | null = null
  let bestScore = 0
  for (const entry of subjectKnowledge) {
    const score = entry.keywords.reduce((s, kw) => s + (lower.includes(kw) ? 1 : 0), 0)
    if (score > bestScore) { bestScore = score; best = entry }
  }
  return best
}

const questionHandlers: Record<string, (subject: string, level: string) => string> = {
  definition: (s, l) => `Great question about ${s}! Here's a clear definition to help you understand:\n\n${
    l === 'basic'
      ? `In simple terms, ${s} is a fascinating subject that deals with fundamental ideas about how things work. Think of it as building blocks — once you understand the core concepts, everything else starts to make sense.`
      : l === 'expert'
        ? `At an advanced level, ${s} can be understood as a complex, interconnected system of principles and theories. The formal definition encompasses multiple dimensions, each with its own rich body of knowledge and ongoing research.`
        : `${s} is a broad field that covers a range of important concepts and principles. To really understand it, start with the foundational ideas and build up from there. Each concept connects to others, forming a web of understanding.`
  }`,
  explanation: (s, l) => `Let me explain how ${s} works:\n\n${
    l === 'basic'
      ? `Think of it this way: everything in ${s} follows certain rules or patterns. Once you recognize these patterns, complex ideas become much simpler. Start with one small part, understand it thoroughly, then move to the next.`
      : l === 'expert'
        ? `The underlying mechanisms in ${s} are multifaceted. A rigorous explanation requires understanding several interconnected principles. At the highest level, we see that what initially appear as separate phenomena are often manifestations of the same fundamental processes.`
        : `At its core, ${s} works through a combination of established principles and practical applications. The key is understanding how different elements interact and influence each other. Let me break it down into manageable parts.`
  }`,
  howto: (s, l) => `Here's a practical approach to ${s}:\n\n${
    l === 'basic'
      ? `1. Start with the fundamentals — make sure you understand the core concepts before moving on.\n2. Practice with simple examples first.\n3. Gradually increase complexity as your confidence grows.\n4. Don't be afraid to make mistakes — they're part of learning!`
      : l === 'expert'
        ? `1. Begin by reviewing the underlying principles and current best practices.\n2. Identify which advanced techniques are most relevant to your specific goal.\n3. Apply systematic methodology, documenting your process and results.\n4. Iterate based on feedback and new insights — mastery is a continuous journey.`
        : `1. Break down the task into smaller, manageable steps.\n2. Gather the tools and resources you'll need.\n3. Follow a structured approach, but stay flexible.\n4. Review your progress and adjust your strategy as needed.`
  }`,
  comparison: (s, l) => `Let me help you understand the differences and similarities:\n\n${
    l === 'basic'
      ? `Think of it like comparing two tools — each has its own strengths and best use cases. The key is understanding what makes each option unique and when to use which one. Start by listing what they have in common, then note what's different.`
      : l === 'expert'
        ? `A rigorous comparison requires analyzing multiple dimensions: theoretical foundations, practical applications, limitations, and trade-offs. Both approaches have merits, and the optimal choice often depends on specific contextual factors and constraints.`
        : `To compare these effectively, look at several key aspects: purpose, approach, strengths, and limitations. Neither is universally better — each has scenarios where it excels and others where it falls short. Understanding the trade-offs is the key.`
  }`,
  advice: (s, l) => `Here's my advice on ${s}:\n\n${
    l === 'basic'
      ? `Start small and be consistent. The most important thing is to take that first step and keep going, even if it's just 10 minutes a day. Find a study method that works for you — everyone learns differently!`
      : l === 'expert'
        ? `Focus on deepening your understanding through primary sources and hands-on practice. Connect with other experts in the field, contribute to discussions, and stay current with the latest developments. Don't forget to teach others — it's the best way to solidify your knowledge.`
        : `Build on your foundation by consistently challenging yourself. Seek out problems that stretch your understanding, and don't be afraid to revisit fundamentals when you hit a wall. The best learners are those who stay curious and humble.`
  }`,
}

export function getAIResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  if (!lower) return "I'd love to help! What would you like to learn about?"

  // Direct greeting detection
  if (/^(hey|hello|hi|yo|sup|good\s*(morning|afternoon|evening))/.test(lower))
    return "Hello! 👋 I'm your AI study assistant. I can help you with any subject — math, science, history, coding, and more. Just ask me a question!"

  if (/^(thanks|thank you|thx|ty|appreciate)/.test(lower))
    return "You're welcome! 😊 Keep up the great work. Is there anything else you'd like to learn about?"

  // Detect level and question type
  const level = detectLevel(input)
  const qType = detectQuestionType(input)

  // Find matching subject
  const subject = findBestSubject(input)
  if (subject) {
    let response = subject[level] + '\n\n'
    // Add a follow-up based on level
    if (level === 'basic') response += '💡 **Tip:** Would you like me to go deeper into any specific aspect? Just ask!'
    else if (level === 'intermediate') response += '📚 **Going deeper:** If you want the advanced version, just say "explain like I\'m an expert"!'
    else response += '🔬 **Further reading:** This is an advanced topic with active research. Want me to elaborate on any specific aspect?'
    return response
  }

  // Use question-type handler for generic questions
  if (questionHandlers[qType]) {
    const topic = lower.replace(/^(what|how|why|when|where|who|which)\s+/i, '').replace(/[?.!]$/, '')
    return questionHandlers[qType](topic, level)
  }

  // Fallback: generate a helpful response based on what we can detect
  if (/\b(help|confus|stuck|difficult|hard|trouble)\b/.test(lower))
    return "Don't worry! Everyone gets stuck sometimes. Here's what I recommend:\n\n1. **Take a step back** — review the fundamentals you already know.\n2. **Break it down** — identify exactly which part is confusing.\n3. **Ask specific questions** — the more specific, the easier it is to help.\n\nTry telling me the subject or topic you're studying, and I'll give you targeted guidance! 🎯"

  if (/\b(fun|interesting|cool|amazing|wow|nice|great)\b/.test(lower))
    return "I'm glad you think so! 🎉 Learning is a journey, and every step forward counts. Is there a specific subject you'd like to explore further?"

  if (/\b(sorry|mistake|wrong|error|fail)\b/.test(lower))
    return "Don't be hard on yourself! Every mistake is a learning opportunity. Thomas Edison said he found 10,000 ways that didn't work before inventing the light bulb. Keep going — you've got this! 💪"

  // Smart generic response
  const responses: Record<string, string> = {
    question: "That's a great question! To give you the best answer, could you tell me a bit more about which subject or topic you're studying? I can help with math, science, history, coding, psychology, economics, literature, and many more subjects!",
    howto: "Here's a general approach that works for most subjects:\n\n1. **Understand the fundamentals** — make sure you have the basics down\n2. **Practice actively** — don't just read, do problems and test yourself\n3. **Connect ideas** — see how new concepts relate to what you already know\n4. **Review regularly** — spaced repetition is key to long-term memory\n\nWant me to get more specific? Tell me the subject!",
    general: "I'm here to help you learn! 📚 I can explain concepts in any subject, give study advice, help with exam prep, or just chat about interesting topics. What would you like to explore today?",
  }
  return responses[qType] || responses.general
}

export function generateStudyPlan(subjects: string[], hoursPerDay: number, daysUntilExam: number, preferredTime: string): string {
  const times = preferredTime === 'morning' ? ['7:00 AM', '9:00 AM', '11:00 AM'] :
    preferredTime === 'afternoon' ? ['1:00 PM', '3:00 PM', '5:00 PM'] :
    ['9:00 AM', '2:00 PM', '7:00 PM']

  const sessionLength = Math.max(25, Math.round((hoursPerDay * 60) / Math.max(subjects.length, 1)))
  const breaks = subjects.length > 2 ? subjects.length - 1 : 1
  const breakDuration = Math.min(15, Math.round((hoursPerDay * 60 - sessionLength * subjects.length) / breaks))

  let plan = `📚 **Study Plan — ${daysUntilExam} Days Until Exam**\n\n`
  plan += `Subjects: ${subjects.join(', ')} | ${hoursPerDay}h/day | ${sessionLength}min sessions\n\n`
  plan += `=== Daily Schedule ===\n\n`

  subjects.forEach((subject, i) => {
    const time = times[i] || `${8 + i}:00 AM`
    plan += `${time} — **${subject}** (${sessionLength} min)\n`
    plan += `  • Review key concepts\n`
    plan += `  • Practice problems / active recall\n`
    plan += `  • Summarize what you learned\n`
    if (i < subjects.length - 1) {
      plan += `${' '.repeat(time.length)}  ── ${breakDuration} min break ──\n\n`
    }
  })

  plan += `\n=== Weekly Goals ===\n`
  const weeks = Math.ceil(daysUntilExam / 7)
  plan += `Week 1: Foundation — understand core concepts\n`
  if (weeks >= 2) plan += `Week 2: Practice — solve problems and past papers\n`
  if (weeks >= 3) plan += `Week 3: Advanced — tackle difficult topics\n`
  if (weeks >= 4) plan += `Week 4: Review — revise and take mock tests\n`

  plan += `\n=== Tips ===\n`
  plan += `✅ Take a 5-min break every 25 min (Pomodoro)\n`
  plan += `✅ Stay hydrated and get 7-8h sleep\n`
  plan += `✅ Review what you learned before bed\n`
  plan += `✅ Test yourself weekly to track progress\n`

  return plan
}

export function getActivityData(sessions: { date: string; duration: number; type: string }[], days: number) {
  const now = new Date()
  const data: { date: string; minutes: number }[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const daySessions = sessions.filter(s => s.date.startsWith(dateStr) && s.type === 'focus')
    const totalMin = daySessions.reduce((sum, s) => sum + s.duration, 0)
    data.push({ date: dateStr, minutes: Math.round(totalMin) })
  }

  return data
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Dynamic quiz question generator — works for ANY subject or topic
const knownBanks: Record<string, { q: string; options: string[]; correct: number }[]> = {
  math: [
    { q: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x²'], correct: 1 },
    { q: 'What is sin²θ + cos²θ equal to?', options: ['0', '1', '-1', 'sin θ'], correct: 1 },
    { q: 'What is the value of π approximately?', options: ['2.14', '3.14', '4.14', '5.14'], correct: 1 },
    { q: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correct: 2 },
    { q: 'What is the slope of y = 3x + 2?', options: ['2', '3', '-3', '1/3'], correct: 1 },
    { q: 'What is the area of a circle with radius r?', options: ['πr', '2πr', 'πr²', 'r²'], correct: 2 },
  ],
  science: [
    { q: 'What is the chemical symbol for water?', options: ['H₂O', 'CO₂', 'NaCl', 'O₂'], correct: 0 },
    { q: 'What planet is known as the Red Planet?', options: ['Venus', 'Mars', 'Jupiter', 'Saturn'], correct: 1 },
    { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi'], correct: 2 },
    { q: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Hydrogen'], correct: 2 },
    { q: 'What is the speed of light approximately?', options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], correct: 1 },
  ],
  history: [
    { q: 'In what year did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2 },
    { q: 'Who was the first US President?', options: ['Adams', 'Jefferson', 'Washington', 'Lincoln'], correct: 2 },
    { q: 'What ancient civilization built the pyramids?', options: ['Romans', 'Greeks', 'Egyptians', 'Mayans'], correct: 2 },
    { q: 'What year did the Titanic sink?', options: ['1910', '1911', '1912', '1913'], correct: 2 },
  ],
  coding: [
    { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correct: 0 },
    { q: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1 },
    { q: 'What is the output of typeof null in JavaScript?', options: ['null', 'undefined', 'object', 'boolean'], correct: 2 },
  ],
  biology: [
    { q: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], correct: 2 },
    { q: 'What is the basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Tissue'], correct: 2 },
    { q: 'What process converts sunlight into energy in plants?', options: ['Respiration', 'Digestion', 'Photosynthesis', 'Fermentation'], correct: 2 },
  ],
  physics: [
    { q: 'What is Newton\'s first law also known as?', options: ['Law of Gravity', 'Law of Inertia', 'Law of Motion', 'Law of Energy'], correct: 1 },
    { q: 'What is the unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1 },
    { q: 'What is the formula for kinetic energy?', options: ['mv', 'mv²', '½mv²', '½mv'], correct: 2 },
  ],
  chemistry: [
    { q: 'What is the pH of pure water?', options: ['5', '7', '9', '11'], correct: 1 },
    { q: 'What is the lightest element?', options: ['Helium', 'Hydrogen', 'Lithium', 'Oxygen'], correct: 1 },
    { q: 'What type of bond shares electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correct: 1 },
  ],
  geography: [
    { q: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Mississippi', 'Yangtze'], correct: 1 },
    { q: 'What is the largest continent?', options: ['Africa', 'North America', 'Asia', 'Europe'], correct: 2 },
    { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Madrid', 'Paris'], correct: 3 },
  ],
  english: [
    { q: 'What is a noun?', options: ['An action word', 'A naming word', 'A describing word', 'A connecting word'], correct: 1 },
    { q: 'What is a synonym?', options: ['A word with opposite meaning', 'A word with similar meaning', 'A word that sounds the same', 'A word that is spelled the same'], correct: 1 },
    { q: 'What is the past tense of "run"?', options: ['Runned', 'Ran', 'Running', 'Runs'], correct: 1 },
  ],
  psychology: [
    { q: 'Who is known as the father of psychology?', options: ['Freud', 'Jung', 'Wundt', 'Skinner'], correct: 2 },
    { q: 'What is classical conditioning associated with?', options: ['Freud', 'Pavlov', 'Skinner', 'Rogers'], correct: 1 },
    { q: 'What does IQ stand for?', options: ['Intelligence Quotient', 'Intellectual Quality', 'Internal Query', 'Individual Question'], correct: 0 },
  ],
  philosophy: [
    { q: 'Who said "I think, therefore I am"?', options: ['Plato', 'Aristotle', 'Descartes', 'Kant'], correct: 2 },
    { q: 'What is the study of knowledge called?', options: ['Metaphysics', 'Epistemology', 'Ethics', 'Logic'], correct: 1 },
    { q: 'Who wrote "The Republic"?', options: ['Aristotle', 'Socrates', 'Plato', 'Confucius'], correct: 2 },
  ],
  economics: [
    { q: 'What does GDP stand for?', options: ['Gross Domestic Product', 'Global Domestic Product', 'Gross Development Plan', 'General Demand Price'], correct: 0 },
    { q: 'What is inflation?', options: ['Rising prices', 'Falling prices', 'Stable prices', 'No prices'], correct: 0 },
    { q: 'What is supply and demand?', options: ['A pricing model', 'An economic model', 'A political theory', 'A marketing strategy'], correct: 1 },
  ],
  astronomy: [
    { q: 'What is the closest star to Earth?', options: ['Polaris', 'Sirius', 'The Sun', 'Alpha Centauri'], correct: 2 },
    { q: 'What is a galaxy?', options: ['A single star', 'A system of stars', 'A planet', 'An asteroid'], correct: 1 },
    { q: 'What is a black hole?', options: ['An empty space', 'A collapsed star', 'A dark planet', 'A wormhole'], correct: 1 },
  ],
  literature: [
    { q: 'Who wrote "Romeo and Juliet"?', options: ['Milton', 'Shakespeare', 'Dickens', 'Austen'], correct: 1 },
    { q: 'What is a metaphor?', options: ['A direct comparison', 'An implied comparison', 'A sound device', 'A rhyme scheme'], correct: 1 },
    { q: 'What is the main character called?', options: ['Antagonist', 'Protagonist', 'Narrator', 'Author'], correct: 1 },
  ],
}

// Suffix-based subject detection
const suffixSubjects: Record<string, string> = {
  ology: 'science',
  ologist: 'science',
  nomics: 'economics',
  ometry: 'math',
  physics: 'physics',
  istory: 'history',
  eography: 'geography',
  onomy: 'astronomy',
  osophy: 'philosophy',
  chology: 'psychology',
}

const dynamicTemplates = [
  (s: string) => ({
    q: `What is the primary focus of ${s}?`,
    correct: capitalize(s),
    wrong: [`The study of unrelated phenomena`, `A branch of theoretical mathematics`, `A subfield of ancient philosophy`, `A modern artistic movement`],
  }),
  (s: string) => ({
    q: `Which of the following is a key concept in ${s}?`,
    correct: `${capitalize(s)} Theory`,
    wrong: [`The Opposite Principle`, `Random Selection Theory`, `General Relativity`, `Natural Selection`],
  }),
  (s: string) => ({
    q: `What does the study of ${s} primarily involve?`,
    correct: `Analyzing and understanding ${s.toLowerCase()} phenomena`,
    wrong: [`Memorizing historical dates`, `Solving abstract equations`, `Studying celestial bodies`, `Analyzing literary texts`],
  }),
  (s: string) => ({
    q: `Which term is most closely associated with ${s}?`,
    correct: `${capitalize(s)}ic Analysis`,
    wrong: [`Linear Projection`, `Circular Reasoning`, `Binary Classification`, `Random Sampling`],
  }),
  (s: string) => ({
    q: `A person who specializes in ${s} is called a:`,
    correct: `${capitalize(s)}er`,
    wrong: [`${capitalize(s)}ist`, `${capitalize(s)}ian`, `${capitalize(s)}ic`, `${capitalize(s)}logist`],
  }),
  (s: string) => ({
    q: `What is a fundamental principle of ${s}?`,
    correct: `The ${capitalize(s)} Principle`,
    wrong: [`The Law of Diminishing Returns`, `The Theory of Everything`, `The Uncertainty Principle`, `The Conservation Law`],
  }),
  (s: string) => ({
    q: `What tool is commonly used in ${s}?`,
    correct: `${capitalize(s)}ic Analysis Toolkit`,
    wrong: [`A microscope`, `A telescope`, `A calculator`, `A compass`],
  }),
  (s: string) => ({
    q: `Which of the following best describes ${s}?`,
    correct: `A field that studies ${s.toLowerCase()} and its applications`,
    wrong: [`A method of teaching languages`, `A system of numerical analysis`, `A technique for artistic expression`, `A framework for political theory`],
  }),
]

export function generateQuizQuestions(subject: string, count: number = 5): { question: string; options: string[]; correctIndex: number }[] {
  const key = subject.toLowerCase().trim()

  // Try to find a matching known bank
  for (const [bankKey, bank] of Object.entries(knownBanks)) {
    if (key.includes(bankKey) || bankKey.includes(key)) {
      const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, Math.min(count, bank.length))
      return shuffled.map(q => {
        const shuffledOpts = shuffle(q.options)
        return {
          question: q.q,
          options: shuffledOpts,
          correctIndex: shuffledOpts.indexOf(q.options[q.correct]),
        }
      })
    }
  }

  // Check suffix-based matching
  for (const [suffix, category] of Object.entries(suffixSubjects)) {
    if (key.endsWith(suffix)) {
      const bank = knownBanks[category]
      if (bank) {
        const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, Math.min(count, bank.length))
        return shuffled.map(q => {
          const shuffledOpts = shuffle(q.options)
          return {
            question: q.q,
            options: shuffledOpts,
            correctIndex: shuffledOpts.indexOf(q.options[q.correct]),
          }
        })
      }
    }
  }

  // Dynamic generation for any unknown subject
  const questions: { question: string; options: string[]; correctIndex: number }[] = []
  const templates = shuffle(dynamicTemplates).slice(0, count)

  for (const template of templates) {
    const { q, correct, wrong } = template(key)
    const allOptions = shuffle([correct, ...wrong.slice(0, 3)])
    questions.push({
      question: q,
      options: allOptions,
      correctIndex: allOptions.indexOf(correct),
    })
  }

  return questions
}
