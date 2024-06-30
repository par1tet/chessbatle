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

    moveOfPieceAllInfo(coordsIn, coordsOut, notationName, isMoving){
        const pieceMove = new allPieces[notationName]()

        for (let i = 0;i < pieceMove.toCanMoves.length;i++){
            let doMove = (pieceMove.toCanMoves[i])(this.getField(), coordsOut, coordsIn, isMoving)

            if (doMove !== false){
                let tempField = doMove(this.getField(), coordsOut, coordsIn)
                // console.log(this.itsCheckForSide(isMoving,tempField))
                // console.log(this.itsCheckForCounterSide(isMoving,tempField))
                if(this.itsCheckForCounterSide(isMoving,tempField).isCheck){
                    continue
                }else{
                    // console.log(pieceMove.getAllPossibleMoves(this.field,coordsOut,isMoving))
                    this.setField(tempField)
                    return true
                }
            }
        }
        return false
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
                        
                        pieceMove.toCanMoves.forEach(toCanMove => {
                            if (cell[1] === 'w'){
                                checked.isCheck = toCanMove(this.getField(), coordsOut, [indexRow,indexColumn], 'black')
                            }else{
                                checked.isCheck = toCanMove(this.getField(), coordsOut, [indexRow,indexColumn], 'white')
                            }
                        })
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
                    for (let l = 0;l < pieceMove.toCanMoves.length;l++){
                        if(pieceMove.toCanMoves[l](field, [i, k], checked.cell, side)){
                            checked.isCheck = true
                            return checked
                        }
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

    getAllPossibleMovesOfPiece(coordsOut, whoismoving){
        const newPiece = new allPieces[this.getField()[coordsOut[0]][coordsOut[1]][0]]
        let tempField = this.getField()
        let returnMoves = []
        // console.log(newPiece)
        // console.log(arguments)
        let posibleMoves = newPiece.getAllPossibleMoves(this.getField(), coordsOut, whoismoving)

        posibleMoves.forEach(move => {
            tempField[move[0]][move[1]] = tempField[coordsOut[0]][coordsOut[1]]
            tempField[coordsOut[0]][coordsOut[1]] = '  '
            
            if(!(this.itsCheckForCounterSide(whoismoving,tempField).isCheck)){
                returnMoves.push(move)
            }

            tempField = this.getField()
        })

        return returnMoves
    }
}