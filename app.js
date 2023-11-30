// DOMConetentLoaded to ensure the whole html file is loaded before reading javascript code
document.addEventListener('DOMContentLoaded', () => {
    //finding the grid from html referencing the class name
    const grid = document.querySelector('.grid')
    let width = 10
    //can be determined by user input to change the 'level'
    let bombAmount = 20
    let flags = 0
    let squares =  []
    let isGameOver = false
    

    //create board
    function createBoard() {
        //get shuffled bomb array with random bombs
        //using input method of Array pass throught the bomb ammount
        const bombsArray = Array(bombAmount).fill('bomb')
        //passing through the 'empty' squares 'valid moves'
        const emptyArray = Array(width*width - bombAmount).fill('valid')
       
        //join the arrays together
        const gameArray =emptyArray.concat(bombsArray)
       
        //make the placements random
        const shuffledArray = gameArray.sort(() => Math.random() -0.5)
        

        //repeat untill there is 100 squares
        for (let i = 0; i < width*width; i++){
            //creatinf the squares (100 divs)
            const square = document.createElement('div')
            //give each square an id
            square.setAttribute('id', i)
            //adding shuffled array as classes to the squares
             // adding valid or bomb to each i populated and decided by the shuffled Array
            square.classList.add(shuffledArray[i])
            //add the square to the grid - appendChild through as a parameter
            grid.appendChild(square)
            //add squares to the array
            squares.push(square)

            //normal click - onlcik envoke a function called click and into pass the parameter square
            square.addEventListener('click', function(e){
                click(square)

            })
            //cntrl and left cick
            //passing an event through the function - oncontextmenu is an inbuilt fucntion
            square.oncontextmenu = function(e) {
                //prevents the default action happening -- i.e outside the space of the game
                e.preventDefault()
                //passes through the square that the user has cntrl left clicked
                addFlag(square)

            }

        }
        //add numbers 
        for (let i = 0; i < squares.length; i++){
            //checking for boundaries - as these boxes connect to fewer other boxes?
            //if divisible by the width and leaves a remainder of 0 is left
            const isLeftEdge = (i % width === 0)
            //if divisible by the width and leaves a remainder of -1 is right
            const isRightEdge = (i % width === width-1)
            // checking if the sqaure we are looping over is valid?
            if (squares[i].classList.contains('valid')){
                let total = 0
                //if the sqaure > 0 and not at lefts/ rights edge . 
                //then checks if sqaure borders a bomb if it is it adds 1 to total
                if (i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')) total ++
                if (i > 9 && !isRightEdge && squares[i+1 -width].classList.contains('bomb')) total ++
                if (i > 10 && squares[i -width].classList.contains('bomb')) total ++
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total ++
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total ++
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total ++
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total ++
                if (i < 89 && squares[i +width].classList.contains('bomb')) total ++
        

                squares[i].setAttribute('data', total)
              
            }

             

        }
    }
    //calling the create board function
    createBoard()

    //add a flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains("checked") && (flags < bombAmount)){
            if (!square.classList.contains('flag')){
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags ++
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML =  ''
                flags --
            }

        }
    }

    //clcik on square actions - defines click function and passes through the square clicked
    function click(square){
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')){
            //gameover function 
            gameOver(square)
        }   else {
            let total = square.getAttribute('data')
            if (total !=0)  {
                square.classList.add('checked')
                //displays total
                square.innerHTML = total
                //break cycle
                return
            }
            // recursion to fill out empty spaces to numbers when an empty space is 'clicked'
            checkSquare(square, currentId)

        }
        //if sqaure has no 'value' and is just an empty square
        square.classList.add('checked')
    }

    //check neighbouring squares once square is 'clicked'
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width -1)

        //set time out - important so all checks are performed before recursion
        setTimeout(() => {
            if  (currentId > 0 && !isLeftEdge){
                //gets id of square to the left of it
                const newId = squares[parseInt(currentId) - 1].id
                //asign id to new square so we can pass it back through the click function.
                // this will continue to check it again. 
                //if it passes continues through loop, if it gets returned in the click function the loop stops 
                const newSquare = document.getElementById(newId)
                //passes the new squaree to the click() function as a parameter
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId) + 1 - width].id

                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)

            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1- width].id
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id
               
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) +width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }
    

    //game over function - informs user, shows bombs
    function gameOver(sqaure){
        console.log('Game Over')
        isGameOver = true

        //shows all bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')){
                square.innerHTML = '💣'
            }
        })

    }

    //check for win
    function checkForWin (){
        let matches = 0
        for (let i = 0; i < squares.length; i++){
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')){
                matches ++
            }
            if (matches === bombAmount) {
                window.alert('YOU WIN!')
                isGameOver = true
            }
        }
    }




    
})