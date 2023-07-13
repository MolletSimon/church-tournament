describe('create tournament with 24 teams and 3 phases', () => {
  it('passes', () => {
    login()
      cy.get('button#createTournament').click()
      cy.get('input#name').type(`Coupe des Hauts de France` );
      cy.get('input#date').type('2023-07-08')
      cy.get('button').contains('Suivant').click()
      teams24.forEach(team => {
        cy.get('input#teamName').type(team);
        cy.get('button').contains('Valider').click()
      })
      createTournament()


  })
})

/*describe('create tournament with 12 teams and 3 phases', () => {
  it('passes', () => {
    let tournamentName = 'Tournoi test by cypress 12 teams - ' + new Date().toLocaleTimeString()
    login()
    cy.get('button#createTournament').click()
    cy.get('input#name').type(tournamentName);
    cy.get('input#date').type('2023-07-08')
    cy.get('button').contains('Suivant').click()
    teams12.forEach(team => {
      cy.get('input#teamName').type(team);
      cy.get('button').contains('Valider').click()
    })
    createTournament()
  })
})*/

const login = () => {
  cy.visit('localhost:3000');
  cy.get('input#password').type('motdepassetournoi')
  cy.get('button').click()
}

const createTournament = () => {
  cy.get('button').contains('Suivant').click()
  cy.get('input').type('3')
  cy.get('input#phaseName0').type("Brassage");
  cy.get('input#phaseName1').type("Poules");
  cy.get('input#phaseName2').type("Eliminations");
  cy.get('select#phaseType0').select('Poules');
  cy.get('select#phaseType1').select('Poules');
  cy.get('select#phaseType2').select('Elimination directe');
  cy.get('button').contains('Enregistrer').click()
  cy.get('button').contains('Suivant').click()
  cy.get('input#numberGroups0').clear().type("4");
  cy.get('input#numberGroups1').clear().type("4");
  cy.get('input#numberTeams0').clear().type("6");
  cy.get('input#numberTeams1').clear().type("4");
  cy.get('input#numberQualified0').clear().type("4");
  cy.get('input#numberQualified1').clear().type("2");
  cy.get('button').contains('Suivant').click();
  cy.get('button').contains('Enregistrer').click();
}

const teams24 = [
  'Evreux',
  'Eglise de Meulan',
  'Ekklesia Amiens',
  'Connect 3',
  'Caen COTO',
  'Team cassard 2',
  'Team cassard 1',
  'FCSN',
  'Église de meulan',
  'Team Émeraude',
  'Connect 2',
  'Connect 1',
  'EEDC Clamart Team',
  'Les Cowboys',
  'One',
  'Flers',
  'Les stratiotes',
  'FC Sully',
  'MLK Sports',
  'No Urgences',
  'HAC (Hope Ambassador Connect)',
  'MEAC',
  'Rouen',
  'ASCO'
]



const teams12 = [
  'ASCO', 'Ciel Ouvert 1', 'Ciel Ouvert 2', 'Ciel Ouvert 3', 'FC Sully', 'SC Bernay', 'Les mureaux',
  'MLK FC 1', 'MLK FC 2', 'MG x EVL', 'Caen Chateau', 'MEAC'
]

export{}