describe('Tutorial Single', () => {
    beforeEach(function() {
        cy.loginByStore();
        cy.visit('/tutorials/1');
    })

    it('should allow logged in user to visit tutorials page', function() {
        cy.contains('Sine Waves');
    })
    it('should play the tutorial and user synth with the play button', function() {
        cy.get('#tutorial-play-button').click();
        cy.wait(4000);
        cy.get('#tutorial-play-button').click();
        cy.get('#user-play-button').click();
        cy.wait(4000);
        cy.get('#user-play-button').click();
    })

    // The oscillator control is a Nexus-rendered <select> inside #osc-select.
    // These previously targeted #waveform-select and #select-oscillator, which
    // do not exist in the markup.
    it('Should select an incorrect option from the dropdown menu and submit the answer', function() {
        cy.get('#osc-select select').select('Waveform 1');
        cy.get('#user-play-button').click();
        cy.wait(2000);
        cy.get('#user-play-button').click();
        cy.get('#check-answer').click();
        cy.contains('Incorrect!! Try playing the example again');
    })
    it('Should select the correct option from the dropdown menu and submit the answer', function() {
        cy.get('#osc-select select').select('Waveform 2');
        cy.get('#user-play-button').click();
        cy.wait(2000);
        cy.get('#user-play-button').click();
        cy.get('#check-answer').click();
        cy.contains('Correct!!');
    })
})
