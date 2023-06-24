describe('pass group phase', () => {
    it('passes', () => {
        cy.visit('localhost:3000');
        cy.get('input#password').type('motdepassetournoi')
        cy.get('button').click()
        cy.get('div').contains('Démarré').click()
        cy.get('button').contains('Suivant').click()
    })
})

