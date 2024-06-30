import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import { board, chessAPIMain } from '../chessLogic/chess.js'
import { Server } from 'socket.io'
import { createServer } from 'http'

const PORT = process.env.PORT || 8000

let corsOptions = {
    origin: [
        'http://localhost:3000',
        'http://192.168.0.110:3000'
    ],
    methods: ["GET", "POST"],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors:corsOptions,
});


app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

io.on("connection", socket => {
    // console.log(socket.id)

    socket.on('make_move', data => {
        // console.log(data)
        socket.broadcast.emit("do_make_move", {
            "whoismove":chessAPIMain.whoismove
        })
        socket.emit("do_make_move", {
            "whoismove":chessAPIMain.whoismove
        })
    })

    socket.on('check', data => {
        // console.log(data)
        socket.broadcast.emit("do_check", data)
        socket.emit("do_check", data)
    })
})

server.listen(PORT, () => {
    console.log(`server has been started. Port is ${PORT}`)
})

app.get('/get_field', (req,res) => {
    res.send({
        "field": board.getField(),
        "context":{
            "checked": chessAPIMain.context.checked
        }
    })
})

app.get('/refresh_field', (req,res) => {
    chessAPIMain.context.checked = {'isCheck':false, cell:[0,0]}
    res.send({
        "field": board.refreshField(),
        "context":{
            "checked": chessAPIMain.context.checked
        }
    })
})

app.post('/can_to_move', (req,res) => {
    if (req.body.coordsIn[0] === req.body.coordsOut[0] && req.body.coordsIn[1] === req.body.coordsOut[1]){
        res.send({
            "move":'',
            "toCanMove": false,
        })
        return 0
    }else{
        const toCanMove = chessAPIMain.makeMove(board, req.body.coordsOut, req.body.coordsIn, req.body.piece, chessAPIMain.whoismove)
        let itsCheck = ''
        let itsCheckMate = false
        if (toCanMove){
            itsCheck = chessAPIMain.itsCheck(req.body.coordsIn, board.field)
            chessAPIMain.context.checked = itsCheck
            if (chessAPIMain.whoismove === 'white'){
                chessAPIMain.whoismove = 'black'
            }else{
                chessAPIMain.whoismove = 'white'
            }
            if(itsCheck.isCheck){
                itsCheckMate = chessAPIMain.itsCheckMate(chessAPIMain.whoismove, board.field)
            }
        }
        res.send({
            "toCanMove": toCanMove,
            "context":{
                "checked": itsCheck,
                "checkMate": itsCheckMate
            }
        })
    }
})

app.get('/get_whoismove', (req,res) => {
    res.send({
        "whoismove":chessAPIMain.whoismove
    })
})

app.post('/set_whoismove', (req,res) => {
    chessAPIMain.whoismove = req.body.value
    res.send({
        "whoismove":chessAPIMain.whoismove
    })
})

app.post('/getAllPossibleMovesOfPiece', (req,res) => {
    // console.log(req.body.coordsOut)
    res.send({
        "allPossbleMoves":chessAPIMain.getAllPossibleMovesOfPiece(req.body.coordsOut)
    })
})