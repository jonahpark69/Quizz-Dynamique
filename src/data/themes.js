// TODO: Replace this seed data with the exact structure migrated from legacy-source/quiz.js.
// Keep all theme IDs/questions stable once linked to real legacy content.
export default [
  {
    id: 'general',
    label: 'Culture generale',
    description: 'Questions variees pour valider la migration.',
    settings: {
      questionTimeLimit: 20,
      globalTimeLimit: 120
    },
    questions: [
      {
        id: 'general-1',
        text: 'Quelle ville est la capitale de l Italie ?',
        answers: [
          { label: 'Rome', value: 'rome' },
          { label: 'Milan', value: 'milan' },
          { label: 'Naples', value: 'naples' },
          { label: 'Turin', value: 'turin' }
        ],
        correctAnswer: 'rome'
      },
      {
        id: 'general-2',
        text: 'Quel ocean borde la cote ouest de la France ?',
        answers: [
          { label: 'Ocean Atlantique', value: 'atlantique' },
          { label: 'Ocean Indien', value: 'indien' },
          { label: 'Ocean Pacifique', value: 'pacifique' },
          { label: 'Ocean Arctique', value: 'arctique' }
        ],
        correctAnswer: 'atlantique'
      }
    ]
  },
  {
    id: 'cinema',
    label: 'Cinema',
    description: 'Modele avec reponses image + texte.',
    settings: {
      questionTimeLimit: 25,
      globalTimeLimit: 150
    },
    questions: [
      {
        id: 'cinema-1',
        text: 'Quel film a gagne l Oscar du meilleur film en 2020 ?',
        answers: [
          {
            label: 'Parasite',
            value: 'parasite',
            imageSrc: 'cinema/parasite.jpg'
          },
          {
            label: 'Joker',
            value: 'joker',
            imageSrc: 'cinema/joker.jpg'
          },
          {
            label: '1917',
            value: '1917',
            imageSrc: 'cinema/1917.jpg'
          }
        ],
        correctAnswer: 'parasite'
      }
    ]
  }
]
