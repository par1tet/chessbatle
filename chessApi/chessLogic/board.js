import { allPieces } from './pieces.js'

export class Board{// Данный класс реализует доску
    field;
    
    constructor(field){
        this.field = Object.assign([], field)
    }

    getField(){
        let newField = []
        for (let i = 0;i < this.field.length;i++){
            newField.push([...this.field[i]])
        }
        return newField
    }

    setField(value){
        if (Array.isArray(value)){
            this.field = Object.assign([], value);
        }else{
            const IncorrectField = new Error("It's field incorrect")
            throw IncorrectField
        }
    }

    refreshField(){
        this.setField([
            ['Rb','Nb','Bb','Qb','Kb','Bb','Nb','Rb',],
            ['pb','pb','pb','pb','pb','pb','pb','pb',],
            ['  ','  ','  ','  ','  ','  ','  ','  ',],
            ['  ','  ','  ','  ','  ','  ','  ','  ',],
            ['  ','  ','  ','  ','  ','  ','  ','  ',],
            ['  ','  ','  ','  ','  ','  ','  ','  ',],
            ['pw','pw','pw','pw','pw','pw','pw','pw',],
            ['Rw','Nw','Bw','Qw','Kw','Bw','Nw','Rw',],
        ])
    }

    parametresOfMove(move, isMoving = 'white'){
        // Данная функция разделяет ход из шахматной нотации, на обьект js который позволяет сделать ход
        let pieceMove = '' // Какая фигура ходит
        let tempField = Object.assign([], this.getField());// Поле для того что тестить

        // Код проверяющий на то какая фигура ходит
        allPieces.forEach(Piece => {
            let currentPiece = new Piece()
            if (move[0] === currentPiece.notationName){
                pieceMove = currentPiece.notationName;
            }
        })
        if(pieceMove === ''){
            pieceMove = 'p'
        }
        pieceMove += isMoving[0]
        // ----------------------

        let cellMove = ''// Клетка куда ходит фигура
        let advancedInformation = ''// Дополнительная информация о ходе

        // Код который говорит на какую клетку ход

        if ((''+(+(move[2])) === 'NaN')){
            // Не обращайте внимание на такое страшное условие, но он работает
            advancedInformation += move[1]
            cellMove += move[2]
            cellMove += move[3]
        }else{
            cellMove += move[1]
            cellMove += move[2]
        }

        // ----------------------

        // Перевод в координаты клетки

        let coordsIn = [
            Math.abs((+cellMove[1]) - 8),
            (+((cellMove[0].charCodeAt(0)) - 97))
        ]

        // Выяснение фигуры которая ходит

        let candidateMovePieces = []

        tempField.forEach((cellRow, xCoord) => {
            cellRow.forEach((cell, yCoord) => {
                if (cell === pieceMove){
                    candidateMovePieces.push({
                        "gameCoodsX":Math.abs((xCoord - 8)),
                        "gameCoodsY":(yCoord + 1),
                        "arrayCoordsX":xCoord,
                        "arrayCoordsY":yCoord,
                        "notationName": tempField[yCoord][xCoord][0]
                    })
                }
            })
        })

        // ----------------------

        // Выеснение какая именно фигура ходит
        if (candidateMovePieces.length >= 1){
            for (let i = 0;i < candidateMovePieces.length;i++){
                let currentPiece = 0
                for (let k = 0;k < allPieces.length;k++){
                    if ((new allPieces[k]).notationName === candidateMovePieces[i].notationName){
                        currentPiece = new allPieces[k]
                        break;
                    }
                }

                if (currentPiece.notationName === pieceMove[0]){
                    candidateMovePieces.forEach(candPiece => {
                        let coordsOut = [candPiece.arrayCoordsX, candPiece.arrayCoordsY]

                        if (currentPiece.toCanMove(coordsOut,coordsIn)){
                            tempField[coordsIn[0]][coordsIn[1]] = tempField[coordsOut[0]][coordsOut[1]]
                            tempField[coordsOut[0]][coordsOut[1]] = '  '
                            this.setField(tempField)

                            return true
                        }else{
                            return false
                        }
                    })
                }
            }
        }
    }

    moveOfPieceAllInfo(coordsIn, coordsOut, notationName, isMoving){
        const pieceMove = new allPieces[notationName]()
        if (pieceMove.toCanMove(this.field, coordsOut, coordsIn, isMoving)){
            let tempField = this.getField()

            tempField[coordsIn[0]][coordsIn[1]] = tempField[coordsOut[0]][coordsOut[1]]
            tempField[coordsOut[0]][coordsOut[1]] = '  '

            // console.log(this.itsCheckForSide(isMoving,tempField))
            // console.log(this.itsCheckForCounterSide(isMoving,tempField))
            if(this.itsCheckForCounterSide(isMoving,tempField).isCheck){
                return false
            }else{
                this.setField(tempField)
                return true
            }
        }else{
            return false
        }
    }

    itsCheck(coordsOut){
        const checked = {
            "isCheck": false,
            "cell": [0,6]
        }

        const pieceMove = new allPieces[((this.getField())[coordsOut[0]][coordsOut[1]][0])]()

        this.getField().forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                // console.log(cell)
                if (cell === '  ') return 0;

                if (cell[1] !== ((this.getField())[coordsOut[0]][coordsOut[1]])[1]){
                    // console.log(cell)
                    if (cell[0] === 'K'){
                        
                        if (cell[1] === 'w'){
                            checked.isCheck = pieceMove.toCanMove(this.getField(), coordsOut, [indexRow,indexColumn], 'black')
                        }else{
                            checked.isCheck = pieceMove.toCanMove(this.getField(), coordsOut, [indexRow,indexColumn], 'white')
                        }
                        checked.cell = [indexRow,indexColumn]
                    }
                }
            })
        })

        return checked
    }

    itsCheckForCounterSide(side,field){
        const checked = {
            "isCheck": false,
            "cell": [0,6]
        }

        // console.log(field)

        // let counterSide = 'white'
        // if (side === 'white') counterSide = 'black'

        field.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                // console.log(cell)
                if (cell === `K${side[0]}`){
                    checked.cell[0] = indexRow
                    checked.cell[1] = indexColumn
                }
            })
        })

        for (let i = 0;i < field.length;i++){
            for (let k = 0;k < field[0].length;k++){
                const cell = field[i][k]
                if (cell === '  ') continue;
                if (cell[1] !== side[0]){
                    // console.log(cell)
                    // console.log(side)
                    // console.log(cell)
                    const pieceMove = new allPieces[`${cell[0]}`]()

                    // console.log([i, k]);
                    // console.log(field[i][k]);
                    // console.log(checked.cell)
                    // console.log(pieceMove)

                    // console.log(pieceMove.toCanMove(field, [i, k], checked.cell, side))
                    if(pieceMove.toCanMove(field, [i, k], checked.cell, side)){
                        checked.isCheck = true
                        return checked
                    }
                }
            }
        }

        return checked
    }

    itsCheckForSide(side,field){
        const checked = {
            "isCheck": false,
            "cell": [0,6]
        }

        // console.log(field)

        let counterSide = 'white'
        if (side === 'white') counterSide = 'black'

        field.forEach((row, indexRow) => {
            row.forEach((cell, indexColumn) => {
                // console.log(cell)
                if (cell === `K${counterSide[0]}`){
                    checked.cell[0] = indexRow
                    checked.cell[1] = indexColumn
                }
            })
        })

        for (let i = 0;i < field.length;i++){
            for (let k = 0;k < field[0].length;k++){
                const cell = field[i][k]
                if (cell === '  ') continue;
                if (cell[1] === side[0]){
                    // console.log(cell)
                    // console.log(side)
                    // console.log(cell)
                    const pieceMove = new allPieces[`${cell[0]}`]()

                    // console.log([i, k]);
                    // console.log(field[i][k]);
                    // console.log(checked.cell)
                    // console.log(pieceMove)

                    // console.log(pieceMove.toCanMove(field, [i, k], checked.cell, counterSide))
                    if(pieceMove.toCanMove(field, [i, k], checked.cell, counterSide)){
                        checked.isCheck = true
                        return checked
                    }
                }
            }
        }

        return checked
    }

    fromCoordsInMove(coordsOut, coordsIn){
        let move = ''

        move += this.field[coordsOut[0]][coordsOut[1]][0]
        move += String.fromCharCode(coordsIn[1] + 97)
        move += Math.abs(coordsIn[0] - 8)

        return move
    }
}