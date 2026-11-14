/**
 * Rich mock data presets and dynamic generator for offline/demo/evaluation use.
 */

export const MOCK_SETS = {
  biology: {
    topic: 'Photosynthesis & Cellular Respiration',
    summary: 'Photosynthesis transforms solar light energy into chemical energy stored in glucose, releasing oxygen. Cellular respiration subsequently breaks down glucose to produce cellular ATP, creating a vital biological cycle.',
    difficulty: 'Intermediate',
    estimatedStudyTimeMinutes: 20,
    keyConcepts: [
      {
        id: 'c1',
        concept: 'Light-Dependent Reactions',
        definition: 'Occur across the thylakoid membrane where photons excite chlorophyll, splitting water (photolysis) to yield ATP, NADPH, and O2 byproduct.',
        importance: 'Essential',
      },
      {
        id: 'c2',
        concept: 'The Calvin Cycle',
        definition: 'Light-independent series of enzyme reactions in the stroma that utilizes ATP and NADPH to fix atmospheric CO2 into G3P/glucose.',
        importance: 'Essential',
      },
      {
        id: 'c3',
        concept: 'ATP Synthase Complex',
        definition: 'Enzyme powered by proton gradient (chemiosmosis) that phosphorylates ADP into ATP.',
        importance: 'High',
      },
      {
        id: 'c4',
        concept: 'Mitochondrial Respiration',
        definition: 'The aerobic breakdown of pyruvate through the Krebs cycle and oxidative phosphorylation yielding ~30-32 ATP.',
        importance: 'Helpful',
      },
    ],
    flashcards: [
      {
        id: 1,
        front: 'Where inside plant cells do the light-dependent reactions take place?',
        back: 'In the thylakoid membranes of chloroplasts.',
        hint: 'Think of the flattened green sac structures.',
        category: 'Cell Biology',
      },
      {
        id: 2,
        front: 'What is the primary source of the oxygen gas released during photosynthesis?',
        back: 'Water molecules (H2O) split during photolysis in Photosystem II.',
        hint: 'It does not come from Carbon Dioxide.',
        category: 'Biochemistry',
      },
      {
        id: 3,
        front: 'What enzyme catalyses the primary carbon-fixing reaction in the Calvin cycle?',
        back: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).',
        hint: 'Most abundant enzyme on planet Earth.',
        category: 'Enzymes',
      },
      {
        id: 4,
        front: 'What are the two energy-carrier molecules produced by the light reactions to fuel the Calvin cycle?',
        back: 'ATP (Adenosine Triphosphate) and NADPH (Nicotinamide Adenine Dinucleotide Phosphate).',
        hint: 'One carries high-energy phosphate bonds, the other carries high-energy electrons/hydrogen.',
        category: 'Energy Transfer',
      },
      {
        id: 5,
        front: 'What is the difference between aerobic and anaerobic respiration?',
        back: 'Aerobic respiration requires oxygen and produces ~30-32 ATP; anaerobic fermentation occurs without oxygen producing only 2 net ATP and lactate or ethanol.',
        hint: 'Consider oxygen dependency and ATP yield.',
        category: 'Respiration',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Which molecule acts as the initial electron donor in Photosystem II?',
        options: ['Water (H2O)', 'Carbon Dioxide (CO2)', 'Glucose (C6H12O6)', 'NADPH'],
        correctIndex: 0,
        explanation: 'Water molecules are split through photolysis at PS II to replace electrons energized by sunlight.',
      },
      {
        id: 2,
        question: 'In which part of the chloroplast does the Calvin Cycle occur?',
        options: ['Stroma', 'Thylakoid lumen', 'Outer membrane', 'Inner membrane space'],
        correctIndex: 0,
        explanation: 'The stroma is the fluid-filled space surrounding the thylakoids, containing the enzymes needed for carbon fixation.',
      },
      {
        id: 3,
        question: 'What is the overall balanced chemical formula for oxygenic photosynthesis?',
        options: [
          '6CO2 + 6H2O + light -> C6H12O6 + 6O2',
          'C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP',
          'CO2 + H2O -> CH2O + O2',
          '6CO2 + 12H2O -> C6H12O6 + 6H2O + 6CO',
        ],
        correctIndex: 0,
        explanation: 'Six molecules of carbon dioxide and six molecules of water are converted into one glucose molecule and six oxygen molecules.',
      },
      {
        id: 4,
        question: 'Which factor would NOT directly limit the rate of photosynthesis in bright sunlight?',
        options: [
          'Atmospheric nitrogen concentration',
          'Carbon dioxide concentration',
          'Ambient temperature',
          'Water availability',
        ],
        correctIndex: 0,
        explanation: 'Nitrogen gas (N2) is inert and not a direct reactant in the photosynthetic pathway, whereas CO2, light, water, and temperature are major limiting factors.',
      },
    ],
  },
  git: {
    topic: 'Git & Distributed Version Control',
    summary: 'Git is a distributed version control system designed to track changes in source code during software development, enabling branching, merging, and distributed collaboration.',
    difficulty: 'Beginner',
    estimatedStudyTimeMinutes: 15,
    keyConcepts: [
      {
        id: 'c1',
        concept: 'Three Tree Architecture',
        definition: 'Working Directory, Staging Area (Index), and Git Repository (HEAD commit history).',
        importance: 'Essential',
      },
      {
        id: 'c2',
        concept: 'Commit Hashes (SHA-1 / SHA-256)',
        definition: 'Cryptographic hash identifying a snapshot of the repository state and its parent links.',
        importance: 'High',
      },
      {
        id: 'c3',
        concept: 'Branching & Fast-Forward',
        definition: 'Branches are lightweight pointers to commits. Merging without divergence moves the pointer forward.',
        importance: 'High',
      },
    ],
    flashcards: [
      {
        id: 1,
        front: 'What does `git fetch` do compared to `git pull`?',
        back: '`git fetch` downloads remote commits without merging them into your current branch; `git pull` runs `git fetch` followed by `git merge`.',
        hint: 'One is safe and inspectable, the other mutates your working branch immediately.',
        category: 'Remotes',
      },
      {
        id: 2,
        front: 'What is the difference between `git reset --soft` and `git reset --hard`?',
        back: '`--soft` resets HEAD but keeps changes staged; `--hard` resets HEAD, staging, and deletes uncommitted changes in the working directory.',
        hint: 'One preserves changes for re-committing; the other discards them.',
        category: 'History',
      },
      {
        id: 3,
        front: 'What does the `.gitignore` file do?',
        back: 'Specifies intentionally untracked files and patterns that Git should ignore and not prompt to commit.',
        hint: 'Used for build outputs, logs, and sensitive credentials.',
        category: 'Configuration',
      },
    ],
    quiz: [
      {
        id: 1,
        question: 'Which command moves changes from the working directory into the staging area (index)?',
        options: ['git add', 'git commit', 'git push', 'git checkout'],
        correctIndex: 0,
        explanation: '`git add` stages modified or new files, preparing them to be bundled into the next commit snapshot.',
      },
      {
        id: 2,
        question: 'What is a "merge conflict" in Git?',
        options: [
          'When conflicting changes are made to the same lines of a file in different branches being merged',
          'When two developers use the same branch name',
          'When Git runs out of memory during a push',
          'When a commit message is left completely empty',
        ],
        correctIndex: 0,
        explanation: 'A merge conflict occurs when Git cannot automatically reconcile differing modifications to the same lines in both branches.',
      },
      {
        id: 3,
        question: 'What command creates and switches to a new branch in a single step?',
        options: ['git checkout -b <name>', 'git branch <name>', 'git switch --force <name>', 'git new <name>'],
        correctIndex: 0,
        explanation: '`git checkout -b <name>` (or `git switch -c <name>`) creates the new branch pointer and updates HEAD to point to it.',
      },
    ],
  },
};

export function getMockStudySet(inputTopic = '', mode = 'all', difficulty = 'Intermediate') {
  const normalized = (inputTopic || '').toLowerCase();
  let baseSet;

  if (normalized.includes('git') || normalized.includes('code') || normalized.includes('programming')) {
    baseSet = JSON.parse(JSON.stringify(MOCK_SETS.git));
  } else {
    baseSet = JSON.parse(JSON.stringify(MOCK_SETS.biology));
  }

  // If user provided a specific topic name, adapt title
  if (inputTopic && inputTopic.trim().length > 2) {
    baseSet.topic = inputTopic.trim().slice(0, 60);
  }

  baseSet.difficulty = difficulty || 'Intermediate';

  if (mode === 'flashcards') {
    baseSet.quiz = [];
  } else if (mode === 'quiz') {
    baseSet.flashcards = [];
  }

  return baseSet;
}
