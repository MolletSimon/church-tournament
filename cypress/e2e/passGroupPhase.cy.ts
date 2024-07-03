describe('pass group phase', () => {
    it('passes', () => {
        cy.visit('localhost:3000/admin/tournament/STSYMkfhGwfBd8U15KEt');
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).clear()
        })
        cy.get('select[id="group"]').select('Groupe 2')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).clear()
        })
        cy.get('select[id="group"]').select('Groupe 3')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).clear()
        })
        cy.get('select[id="group"]').select('Groupe 4')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).clear()
        })
        cy.get('select[id="group"]').select('Groupe 1')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).type((Math.floor(Math.random() * 4)).toString())
        })
        cy.get('select[id="group"]').select('Groupe 2')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).type((Math.floor(Math.random() * 4)).toString())
        })
        cy.get('select[id="group"]').select('Groupe 3')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).type((Math.floor(Math.random() * 4)).toString())
        })
        cy.get('select[id="group"]').select('Groupe 4')
        cy.get('input').each(($el, index, $list) => {
            cy.wrap($el).type((Math.floor(Math.random() * 4)).toString())
        })
    })
})

