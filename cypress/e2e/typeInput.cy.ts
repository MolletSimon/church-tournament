describe('field and hour', () => {
    it('passes', () => {
        cy.visit('localhost:3000');
        cy.get('input#password').type('motdepassetournoi')
        cy.get('button').click()
        cy.get('div').contains('Démarré').click()
        for (let i = 0; i < 4; i++) {
            cy.get('select#group').select(i)
            cy.get('input#score1').each((i) => {
                cy.wrap(i).clear().type(Math.floor(Math.random() * 5).toString())
            })
            cy.get('input#score2').each((i) => {
                cy.wrap(i).clear().type(Math.floor(Math.random() * 5).toString())
                cy.wait(1000)
            })
        }
    })
})