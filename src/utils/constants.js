export const SAMPLE_TOPICS = [
  {
    title: 'Photosynthesis & Respiration',
    category: 'Biology',
    description: 'Light reactions, Calvin cycle, ATP synthase, and mitochondrial electron transport.',
    prompt: `Photosynthesis is the process used by plants, algae, and cyanobacteria to convert light energy into chemical energy stored in glucose. It occurs in two main stages: the light-dependent reactions in the thylakoid membrane (producing ATP, NADPH, and releasing O2 from water photolysis), and the Calvin Cycle in the stroma (using ATP and NADPH to fix CO2 into sugars via RuBisCO). Cellular respiration is the reverse metabolic pathway taking place in mitochondria, breaking down glucose through glycolysis, the Krebs cycle, and oxidative phosphorylation to yield approximately 30-32 ATP molecules.`,
  },
  {
    title: 'Git Version Control System',
    category: 'Computer Science',
    description: 'Working directory, staging index, commit DAGs, branching, merging, and merge conflicts.',
    prompt: `Git is a distributed version control system designed by Linus Torvalds. It tracks file changes across three areas: the working directory, the staging area (index), and the git directory (commits stored as immutable SHA-1/SHA-256 snapshots). Branching creates lightweight movable pointers to commits. Merging combines histories: fast-forward moves the branch pointer forward when histories have not diverged, whereas a three-way merge creates a merge commit with two parents. Merge conflicts occur when divergent branches modify the exact same lines of a file.`,
  },
  {
    title: 'Quantum Computing 101',
    category: 'Physics',
    description: 'Qubits, superposition, entanglement, quantum gates, and quantum supremacy.',
    prompt: `Quantum computing leverages the fundamental principles of quantum mechanics to process information exponentially faster than classical computers for specific problem spaces. While classical computers rely on binary bits (0 or 1), quantum systems utilize quantum bits or qubits that can exist in a superposition of both |0⟩ and |1⟩ states simultaneously. Quantum entanglement links two or more qubits such that the quantum state of each qubit cannot be described independently. Quantum gates (such as Hadamard and CNOT) manipulate probability amplitudes to perform calculations.`,
  },
  {
    title: 'The Roman Republic to Empire',
    category: 'History',
    description: 'Senate, Julius Caesar, crossing the Rubicon, Pax Romana, and Augustus.',
    prompt: `The Roman Republic was founded around 509 BC and governed by elected magistrates, a Senate representing aristocratic patricians, and popular assemblies. The late republic faced immense political instability, social wars, and the rise of powerful generals including Julius Caesar. Caesar's crossing of the Rubicon in 49 BC triggered a civil war leading to his appointment as Dictator perpetuo. Following his assassination on the Ides of March 44 BC, his adopted heir Octavian defeated Mark Antony and Cleopatra at Actium, becoming Augustus in 27 BC and inaugurating the Pax Romana as Rome's first Emperor.`,
  },
];

export const DIFFICULTY_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: 'Core definitions & foundational concepts' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Standard undergraduate level synthesis' },
  { id: 'Advanced', label: 'Advanced', desc: 'In-depth analysis, edge cases & nuances' },
];

export const STUDY_MODES = [
  { id: 'all', label: 'Complete Study Set', desc: 'Flashcards + Quiz + Concepts' },
  { id: 'flashcards', label: 'Flashcards Only', desc: 'Fast memorization & active recall' },
  { id: 'quiz', label: 'Quiz Only', desc: 'Test knowledge with immediate feedback' },
];
