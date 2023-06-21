describe('pass group phase', () => {
    it('passes', () => {
        cy.visit('localhost:3000');
        cy.get('input#password').type('motdepassetournoi')
        cy.get('button').click()
        cy.get('div').contains('Démarré').click()

        for (let i = 1; i < 4; i++) {
            cy.get('input#score1').each((i) => cy.wrap(i).clear().type(Math.floor(Math.random() * 5).toString()))
            cy.get('input#score2').each((i) => cy.wrap(i).clear().type(Math.floor(Math.random() * 5).toString()))
            cy.get('select').select(i)
        }
    })
})