// level2.js
class Level2Game {
    constructor() {
        this.movesLeft = 6;
        this.selectedColor = null;
        this.currentSelection = ['', '', ''];
        // Fixed solution for level 2
        this.solution = ['purple', 'orange', 'green'];
        this.setupGame();
    }

    setupGame() {
        // Color selection
        document.querySelector('.colour_picker').addEventListener('click', (e) => {
            if (e.target.classList.contains('color')) {
                this.selectedColor = e.target.dataset.color;
                // Visual feedback for selected color
                document.querySelectorAll('.color').forEach(btn => 
                    btn.style.border = btn.dataset.color === this.selectedColor ? '2px solid black' : 'none'
                );
            }
        });

        // Circle clicking
        document.querySelectorAll('.circle').forEach((circle, index) => {
            circle.addEventListener('click', () => {
                if (this.selectedColor) {
                    circle.style.backgroundColor = this.selectedColor;
                    this.currentSelection[index] = this.selectedColor;
                }
            });
        });

        // Submit button
        document.getElementById('submit').addEventListener('click', () => this.handleSubmit());

        // Exit button
        document.getElementById('exit').addEventListener('click', () => {
            this.showModal('exit');
        });
    }

    handleSubmit() {
        if (this.currentSelection.includes('')) {
            this.showModal('incomplete');
            return;
        }

        const { correctColor, correctPosition } = this.checkGuess();
        this.addMoveRecord(correctColor, correctPosition);
        this.movesLeft--;
        this.updateMovesDisplay();

        if (correctPosition === 3) {
            this.showModal('levelComplete');
        } else if (this.movesLeft === 0) {
            this.showModal('gameOver');
        }
    }

    checkGuess() {
        let correctColor = 0;
        let correctPosition = 0;
        const solutionCopy = [...this.solution];
        const guessCopy = [...this.currentSelection];

        for (let i = 0; i < this.solution.length; i++) {
            if (guessCopy[i] === solutionCopy[i]) {
                correctPosition++;
                solutionCopy[i] = null;
                guessCopy[i] = null;
            }
        }
        for (let i = 0; i < guessCopy.length; i++) {
            if (guessCopy[i] === null) continue;
            const colorIndex = solutionCopy.indexOf(guessCopy[i]);
            if (colorIndex !== -1) {
                correctColor++;
                solutionCopy[colorIndex] = null;
            }
        }

        return { correctColor, correctPosition };
    }
    showModal(type) {
        const modalContent = {
            incomplete: {
                title: 'Incomplete Selection',
                message: 'please fill all circles before submitting!',
                buttons: [{ text: 'OK', action: 'close' }]
            },
            levelComplete: {
                title: 'Level 2 Complete!',
                message: 'Congratulations!',
                buttons: [{ text: 'Next Level', action: 'nextLevel' }]
            },
            gameOver: {
                title: 'Game Over',
                message: 'Out of moves! try again?',
                buttons: [{ text: 'Try Again', action: 'retry' }]
            },
            exit: {
                title: 'Exit Game',
                message: 'Are you sure you want to exit?',
                buttons: [
                    { text: 'Yes', action: 'exit' },
                    { text: 'No', action: 'close' }
                ]
            }
        };
        this.createAndShowModal(modalContent[type]);
    }

    createAndShowModal(config) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${config.title}</h2>
                <p>${config.message}</p>
                <div class="modal-buttons">
                    ${config.buttons.map(btn => 
                        `<button class="modal-button" data-action="${btn.action}">${btn.text}</button>`
                    ).join('')}
                </div>
            </div>
        `;

        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-button')) {
                const action = e.target.dataset.action;
                modal.remove();
                
                switch (action) {
                    case 'nextLevel':
                        window.location.reload();
                        break;
                    case 'retry':
                        window.location.reload();
                        break;
                    case 'exit':
                        window.location.href = 'easy.html';
                        break;
                }
            }
        });
        document.body.appendChild(modal);
    }
    updateMovesDisplay() {
        document.getElementById('moves').textContent = this.movesLeft;
    }
    addMoveRecord(correctColor, correctPosition) {
        const moveRecord = document.createElement('li');
        moveRecord.textContent = `Correct color: ${correctColor}, Correct color and position: ${correctPosition}`;
        document.getElementById('moves-list').appendChild(moveRecord);
    }
}
const game = new Level2Game();