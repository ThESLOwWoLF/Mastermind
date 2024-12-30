class Level1Game {
    constructor() {
        this.movesLeft = 5;
        this.selectedColor = null;
        this.currentSelection = ['', ''];
        this.solution = ['purple', 'orange'];
        this.setupGame();
    }

    setupGame() {
        document.querySelector('.colour_picker').addEventListener('click', (e) => {
            if (e.target.classList.contains('color')) {
                this.selectedColor = e.target.dataset.color;
                document.querySelectorAll('.color').forEach(btn => 
                    btn.style.border = btn.dataset.color === this.selectedColor ? '2px solid black' : 'none'
                );
            }
        });

        document.querySelectorAll('.circle').forEach((circle, index) => {
            circle.addEventListener('click', () => {
                if (this.selectedColor) {
                    circle.style.backgroundColor = this.selectedColor;
                    this.currentSelection[index] = this.selectedColor;
                }
            });
        });

        document.getElementById('submit').addEventListener('click', () => this.handleSubmit());
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
        if (correctPosition === 2) {
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
                message: 'Please fill all circles before submitting!',
                buttons: [{ text: 'OK', action: 'close' }]
            },
            levelComplete: {
                title: 'Level 1 Complete!',
                message: 'Congratulations! Ready for level 2?',
                buttons: [{ text: 'Next Level', action: 'nextLevel' }]
            },
            gameOver: {
                title: 'Game Over',
                message: 'Out of moves! Would you like to try again?',
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
                        window.location.href = 'level2.html';
                        break;
                    case 'retry':
                        window.location.reload();
                        break;
                    case 'exit':
                        window.location.href = 'index.html';
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
const game = new Level1Game();