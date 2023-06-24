describe('field and hour', () => {
    it('passes', () => {
        cy.visit('localhost:3000');
        cy.get('input#password').type('motdepassetournoi')
        cy.get('button').click()
        cy.get('div').contains('Démarré').click()
        cy.get('input#field').each((i) => {
            cy.wrap(i).clear().type('Terrain 1')
        })
        cy.get('input#hour').each((i) => {
            cy.wrap(i).clear().type('12h30')
        })
    })
})