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
})

server.listen(PORT, () => {
    console.log(`server has been started. Port is ${PORT}`)
})

app.get('/get_field', (req,res) => {
    res.send({
        "field": board.getField()
    })
})

app.get('/refresh_field', (req,res) => {
    res.send({
        "field": board.refreshField()
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
        const move = board.fromCoordsInMove(req.body.coordsOut, req.body.coordsIn)
        const toCanMove = chessAPIMain.makeMove(board, move, req.body.coordsOut, req.body.coordsIn, req.body.piece, chessAPIMain.whoismove)
        let itsCheck = ''
        if (toCanMove){
            itsCheck = chessAPIMain.itsCheck(req.body.coordsIn, board.field)
            if (chessAPIMain.whoismove === 'white'){
                chessAPIMain.whoismove = 'black'
            }else{
                chessAPIMain.whoismove = 'white'
            }
        }

        res.send({
            "move":move,
            "toCanMove": toCanMove,
            "context":{
                "checked": itsCheck
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