window.ChessMod = {};

window.ChessMod.runCodeBefore = function () {
    window.PuddingMod.runCodeBefore();
    console.log("Adding Chess Mode (Replacing Shield)");
    chess_icon = "https://i.postimg.cc/ZqK0CB95/bn.png"
    var images = document.querySelectorAll('#trophy')[0].children[15].src = chess_icon;
    //var myImage = images[15];
    console.log(images);

    trophy_jsname = document.querySelector('img[src$="trophy_00.png"]').getAttribute("jsname")
    window.trophy_src = `document.querySelector('img[jsname="${trophy_jsname}"]').src `

    fetch('https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeChess/main/ChessCapture.mp3')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    window.capture_sound = new Audio();
    window.capture_sound.src = URL.createObjectURL(new Blob([buffer]));
    //window.capture_sound.play();
  })
  .catch(error => console.error('Error loading sound:', error));

   // window.capture_sound = new Audio('');

}


window.ChessMod.alterSnakeCode = function (code) {
    code = window.PuddingMod.alterSnakeCode(code);
    console.log("Coding Chess Mode into the game");

    // window.wrook has been set when adding the fruit back in pudding fruit.js
    window.wqueen = window.wrook - 1;
    window.wpawn = window.wrook - 2;
    window.wknight = window.wrook - 3;
    window.wking = window.wrook - 4;
    window.wbishop = window.wrook - 5;
    window.brook = window.wrook - 6;
    window.bqueen = window.wrook - 7;
    window.bpawn = window.wrook - 8;
    window.bknight = window.wrook - 9;
    window.bking = window.wrook - 10;
    window.bbishop = window.wrook - 11;

    window.PiecesDict = {
        [window.wrook] : "https://i.postimg.cc/kgwg3Jj3/wr.png",
        [window.wqueen]: "https://i.postimg.cc/mgTg5zyy/wq.png",
        [window.wpawn] : "https://i.postimg.cc/VsbvrcNn/wp.png",
        [window.wknight] : "https://i.postimg.cc/ncbzqws5/wn.png",
        [window.wking]   : "https://i.postimg.cc/4ytxrp0B/wk.png",
        [window.wbishop] : "https://i.postimg.cc/nc4L2YBL/wb.png",
        [window.brook]   : "https://i.postimg.cc/fL1b288V/br.png",
        [window.bqueen]  : "https://i.postimg.cc/g0SjRzRq/bq.png",
        [window.bpawn]   : "https://i.postimg.cc/fLVLfGf4/bp.png",
        [window.bknight] : "https://i.postimg.cc/ZqK0CB95/bn.png",
        [window.bking]   : "https://i.postimg.cc/zGNyYP8W/bk.png",
        [window.bbishop] : "https://i.postimg.cc/NG8bwZw7/bb.png"
    }

    window.updateTrophySRC = function updateTrophySRC(type) {
        eval(window.trophy_src + `= window.PiecesDict[`+type+`]`);
    }

    window.head_pos = { y: 0, x: 0 }
    window.head_dir = "RIGHT"
    window.head_state = "OPEN"
    window.head_color = "NONE"
    window.color_turn = "w"
    window.just_ate = "fruit"

    head_stuff_regex = new RegExp(/=function\(a,b\){if\(!\([a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8}\.[a-zA-Z0-9_$]{1,8}/)
    head_stuff_all = code.match(head_stuff_regex)[0]
    //head_pos_letter = "?"
    head_dir_letter = "b" // hardcoded, probably bad!
    inject_head_stuff = `${head_stuff_all.split("{")[0]}{
    //
    window.head_pos = a.ka.oa.ka; 
    window.everything_stuff = a.ka.oa;
    window.head_dir = ${head_dir_letter}; 
    //console.log(window.head_dir);

    ${head_stuff_all.split("{")[1]}`

    code = code.assertReplace(head_stuff_all, inject_head_stuff);

    window.calculateDistance = function calculateDistance(headPos, applePos) {
        x2 = applePos.x;
        y2 = applePos.y;
        x1 = headPos.x;
        y1 = headPos.y;
        deltaX = x2 - x1;
        deltaY = y2 - y1;
      
        // Calculate the Euclidean distance
        distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      
        return distance;
      }

    window.capture_attempt = function capture_attempt(x, y) {
        for (let index = 0; index < window.appleArray.length; index++) {
            if (window.appleArray[index].isPiece && window.appleArray[index].pos.x == x && window.appleArray[index].pos.y == y && window.head_color != window.appleArray[index].ChessColor) {
                window.head_state = "OPEN"
                if (window.selectedFruit == 22) {
                    randomNumber = Math.floor(Math.random() * 51 + 1) % 52;
                    finalResult = randomNumber === 22 ? (randomNumber + 1) % 52 : randomNumber;
                    window.appleArray[index].type = finalResult;
                } else {
                    window.appleArray[index].type = window.selectedFruit; 
                }
                window.appleArray[index].isPiece = false;
                window.shield_empty_all();
                
                if (!window.muted) {
                    window.capture_sound.play();
                }
                return true;
                break;
            }
        }
        return false;
    }

    window.capture_loop = function capture_loop(headPos, possibleMoves) {
        for (let index = 0; index < possibleMoves.length; index++) {
            const element = possibleMoves[index];
                if(window.capture_attempt(headPos.x + element.dx, headPos.y - element.dy)){
                    break;
                }
            }
    }

    window.pawn_open = function pawn_open(headPos) {
        const possibleMoves = [
            { dx: -1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 }
          ];

          window.capture_loop(headPos, possibleMoves)
    }

    window.king_open = function king_open(headPos) {
        const possibleMoves = [
            { dx: -1, dy: -1 },
            { dx: -1, dy: 1 },
            { dx: 1, dy: 1 },
            { dx: 1, dy: -1 },
            { dx: 0, dy: -1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: 1 }
          ];

          window.capture_loop(headPos, possibleMoves)
    }

    function getClosestPiecesToRook(rookPos, pieces) {
        const closestPieces = {
          up: { piece: null, distance: Infinity },
          down: { piece: null, distance: Infinity },
          left: { piece: null, distance: Infinity },
          right: { piece: null, distance: Infinity },
        };
      
        pieces.forEach(piece => {
          const distance = Math.abs(piece.pos.x - rookPos.x) + Math.abs(piece.pos.y - rookPos.y);
      
          if (piece.pos.x === rookPos.x && piece.pos.y < rookPos.y && distance < closestPieces.up.distance) {
            closestPieces.up = { piece, distance };
          } else if (piece.pos.x === rookPos.x && piece.pos.y > rookPos.y && distance < closestPieces.down.distance) {
            closestPieces.down = { piece, distance };
          } else if (piece.pos.y === rookPos.y && piece.pos.x < rookPos.x && distance < closestPieces.left.distance) {
            closestPieces.left = { piece, distance };
          } else if (piece.pos.y === rookPos.y && piece.pos.x > rookPos.x && distance < closestPieces.right.distance) {
            closestPieces.right = { piece, distance };
          }
        });
      
        // Convert the object values to an array and return only the 'piece' property
        return Object.values(closestPieces).map(({ piece }) => piece).filter(piece => piece !== null);
      }

    window.rook_open = function rook_open(headPos) {
        closestPieces = getClosestPiecesToRook(headPos, window.appleArray)
        for (let index = 0; index < closestPieces.length; index++) {
            const element = closestPieces[index];
            if(element.ChessColor != window.head_color){
                window.capture_attempt(element.pos.x, element.pos.y)
                return true;
            }
        }
        return false;
    }


    function getDistance(dx, dy) {
        return Math.abs(dx) + Math.abs(dy);
      }      

    function getClosestPiecesToBishop(bishopPos, pieces) {
        const closestPieces = {};
      
        pieces.forEach(piece => {
          const dx = piece.pos.x - bishopPos.x;
          const dy = piece.pos.y - bishopPos.y;
      
          // Ensure the piece is on the diagonal line that a bishop can travel
          if (Math.abs(dx) === Math.abs(dy)) {
            const direction = (dx < 0 ? 'left-' : 'right-') + (dy < 0 ? 'up' : 'down');
      
            if (!closestPieces[direction] || getDistance(dx, dy) < getDistance(closestPieces[direction].x - bishopPos.x, closestPieces[direction].y - bishopPos.y)) {
              closestPieces[direction] = piece;
            }
          }
        });
      
        return Object.values(closestPieces).sort((a, b) => getDistance(a.x - bishopPos.x, a.y - bishopPos.y) - getDistance(b.x - bishopPos.x, b.y - bishopPos.y));
      }

    window.bishop_open = function bishop_open(headPos) {
        closestPieces = getClosestPiecesToBishop(headPos, window.appleArray)
        
        for (let index = 0; index < closestPieces.length; index++) {
            const element = closestPieces[index];
            
            if(element.ChessColor != window.head_color){
                window.capture_attempt(element.pos.x, element.pos.y)
                return true;
            }
        }
        return false;
    }

    window.knight_open = function knight_open(headPos) {

        const possibleMoves = [
            { dx: -1, dy: 2 },
            { dx: -2, dy: 1 },
            { dx: -2, dy: -1 },
            { dx: -1, dy: -2 },
            { dx: 2, dy: 1 },
            { dx: 1, dy: 2 },
            { dx: 1, dy: -2 },
            { dx: 2, dy: -1 }
          ];

        window.capture_loop(headPos, possibleMoves)
          
    }


    tick_func_regex = new RegExp(/\.prototype\.tick=function\(\)\{/)
    tick_func = code.match(tick_func_regex)[0]
    
    tick_func_inject = `${tick_func}
    //console.log(window.head_pos[0]);
    window.shield_all(); 
    switch (window.head_state) {
        case 'pawn':
            window.pawn_open(window.head_pos[0]);
            break;
        case 'rook':
            window.rook_open(window.head_pos[0]);
            break;
        case 'bishop':
            window.bishop_open(window.head_pos[0]);
            break;
        case 'knight':
            window.knight_open(window.head_pos[0]);
            break;
        case 'king':
            window.king_open(window.head_pos[0]);
            break;
        case 'queen':
            if(!window.rook_open(window.head_pos[0])){
                window.bishop_open(window.head_pos[0]);
            }
            break;
        case 'OPEN':
        default:
            window.shield_empty_all();
            break;
    }
    `

    

    code = code.assertReplace(tick_func, tick_func_inject);

    // Gain control of appleArray + make shield mode start with double the apples
    code = code.assertReplace(/var a=[a-zA-Z0-9_$]{1,8}\(this\.settings\)/,
    `window.appleArray = this.ka;
    window.oldAppleArr = window.appleArray.slice();

    window.head_dir = "RIGHT"
    window.head_state = "OPEN"
    window.head_color = "NONE"
    window.color_turn = "w"
    window.just_ate = "fruit"
    
    switch(window.timeKeeper.getCurrentSetting("size")){
        default:
        case 0:
            window.Size = {width: 16, height: 14}
        break;
        case 1:
            window.Size = {width: 9, height: 8}
        break;
        case 2:
            window.Size = {width: 23, height: 20}
        break;
    }
    $& || window.CurrentModeNum === 15`)

    window.shield_array_name = code.match(/\(this\.settings,15\)&&[a-z]\.[a-zA-Z0-9_$]{1,8}&&[a-zA-Z0-9_$]{1,8}\(this/)[0].split(".")[2].split("&")[0]

    deathscreen_trophy = new RegExp(/a\.settings\.[a-zA-Z0-9_$]{1,8}=".*png"\);/)
    ds_trophy = code.match(deathscreen_trophy)[0].split("=")[0]
    deathscreen_trophy_code = `$&
    if(window.CurrentModeNum === 15) {
        ${ds_trophy}="${chess_icon}"
        window.dice_doubler = 2;
    } else {
        window.dice_doubler = 1;
    }
    `
    code = code.assertReplace(deathscreen_trophy, deathscreen_trophy_code);

    code = code.assertReplace(/Math\.ceil\(6\*Math\.random\(\)\)/gm, `$& * window.dice_doubler`);

    code = code.assertReplace(/if\([a-zA-Z0-9_$]{1,8}\(this.settings,2\)&&0/gm, `
    window.randomize_pieces();
    $&`)

    window.selectedFruit = 0;
    code = code.assertReplace(/case "apple":/gm, `$&
    if(d==22){
        window.selectedFruit=22
        break;
    }
    window.selectedFruit=`)

    code = code.assertReplace(/this\.muted=!/gm, `window.muted=$&`);

    window.shield_all = function shield_all() {
        eval(`window.appleArray.forEach(apple => {
                apple.` + shield_array_name + ` = new Set(['UP', 'DOWN', 'LEFT', 'RIGHT'])
            });`)
    }

    window.shield_empty_all = function shield_empty_all() {
        eval(`window.appleArray.forEach(apple => {
                apple.` + shield_array_name + ` = undefined
            });`)
    }

    window.randomize_pieces = function randomize_pieces() {
       
        for (let index = 0; index < window.appleArray.length; index++) {
            const element = window.appleArray[index];
            element.ChessPiece = window.getRandomPiece()
            element.ChessColor = window.color_turn
            element.isPiece = true
            eval(`element.type = window.`+window.color_turn+element.ChessPiece);
            window.SwitchTurn();
        }
        
    }

    window.SwitchTurn = function SwitchTurn() {
        if (window.color_turn == 'b') {
            window.color_turn = 'w'
        }
        else {
            window.color_turn = 'b'
        }
    }

    window.getRandomPiece = function getRandomPiece() {
        const randomNumber = Math.floor(Math.random() * 16) + 1;
      
        if (randomNumber <= 8) {
          return 'pawn';
        } else if (randomNumber <= 10) {
          return 'knight';
        } else if (randomNumber <= 12) {
          return 'bishop';
        } else if (randomNumber <= 14) {
          return 'rook';
        } else if (randomNumber === 15) {
          return 'queen';
        } else {
          return 'king';
        }
    }

    moveAppleFunc_regex = new RegExp(/var [a-zA-Z0-9_$]{1,8}=function\(a,b,c\){b=new/gm)
    moveAppleFunc_name = code.match(moveAppleFunc_regex)[0].split(" ")[1].split("=")[0]
    

    //code = code.assertReplace(moveAppleFunc_regex, moveAppleFunc_code);

    window.fruitEaten = function fruitEaten(appleEaten) {
        tempApple = {...appleEaten};
        tempApple.ChessPiece = window.getRandomPiece();
        tempApple.ChessColor = window.color_turn;
        tempApple.isPiece = true;
        tempApple.lastAdded = true;
        tempApple.pos.x = -1;
        eval(`tempApple.type = window.`+window.color_turn+element.ChessPiece);
        window.SwitchTurn();
        window.appleArray.push(tempApple)
        //eval(`push_result = ${moveAppleFunc_name}(this, 0, 0)`)
        //push_result = window.moveAppleIndexTrueNull(appleArray.length-1,true,null)
        push_result=true;
        if(push_result){// Make this apple that will soon change position into a new piece
            for (let index = 0; index < window.appleArray.length; index++) {
                const element = window.appleArray[index];
                if (appleEaten.pos.x == element.pos.x && appleEaten.pos.y == element.pos.y) {
                    element.ChessPiece = window.getRandomPiece()
                    element.ChessColor = window.color_turn
                    element.isPiece = true
                    eval(`element.type = window.`+window.color_turn+element.ChessPiece);
                    window.SwitchTurn();
                } 
            }
        }
    }

    after_reset_regex = new RegExp(/if\([a-zA-Z0-9_$]{1,8}\(this.settings,15.*pos\)};/)
    after_reset_code = code.match(after_reset_regex)[0]

    randomize_pieces_code = `${after_reset_code.split(")")[0]})){

        window.randomize_pieces();

for${after_reset_code.split("}")[0].split("for")[1]}
window.shield_empty_all();
}}`


    catchError(after_reset_regex, code)
    code = code.assertReplace(after_reset_regex, randomize_pieces_code);

    window.getUniqueItemsFromFirstList = function getUniqueItemsFromFirstList(list1, list2) {
        return Array.from(new Set(list1.filter(item => !new Set(list2).has(item))));
      }
    
    window.findApple = function findApple(headPos, appleArray) {
        for (let index = 0; index < appleArray.length; index++) {
            const element = appleArray[index];
            if(element.pos.x == headPos.x && element.pos.y == headPos.y){
                element.myIndex = index;
                return element
            }
        }
    }

    // This function gives spawn radius and other shit
    apple_spawn_repos_regex = new RegExp(/[a-zA-Z0-9$]{1,4}=function\(a,b,c\){if\([a-zA-Z0-9$]{1,4}\.[a-zA-Z0-9$]{1,4}\[/)
    appspawn_func = code.match(apple_spawn_repos_regex)[0].split("{")
    appspawn_func_name = appspawn_func[0].split("=")[0]
    appspawn_code =`${appspawn_func[0]}{
        if(window.CurrentModeNum === 15) {
            if(window.just_ate == 'piece'){
                return;
            }
        }
    ${appspawn_func[1]}
    `
    code = code.assertReplace(apple_spawn_repos_regex, appspawn_code);

    // Avoid adding score for non-fruit eats
    score_regex = new RegExp(/;this.[a-zA-Z0-9$]{1,4}\+\+;/)
    score_match = code.match(score_regex)[0]
    //console.log(score_match)
    score_code = `;
    if(window.CurrentModeNum === 15) {
        
        appleEaten = window.findApple(window.head_pos[0], window.appleArray)
        //
        if(!appleEaten.isPiece){
            window.just_ate = 'fruit'
            ${score_match}
            // Change the apple was eaten to a random piece
            // Spawn extra piece - if fails - splice the apple that was eaten
            if(window.timeKeeper.getCurrentSetting("count") != 3)
            { 
                window.fruitEaten(appleEaten)
            }
        } else {
            window.just_ate = 'piece'
            if(window.timeKeeper.getCurrentSetting("count") != 3)
            { 
                window.appleArray.splice(appleEaten.myIndex, 1) 
            }
            window.head_state = appleEaten.ChessPiece
            window.updateTrophySRC(appleEaten.type)
            window.head_color = appleEaten.ChessColor
            //window.head_pos.pop(); // Very lazy, wrong place to have this
            window.shield_all();
        }
    } else 
    {
        ${score_match}
    };
    `

    code = code.assertReplace(score_regex, score_code);


    // This should fix the part where shields are removed when I don't want them to be
    shiledClear_regex = new RegExp(/\)&&\([a-zA-Z0-9$]{1,4}\(this\.[a-zA-Z0-9$]{1,4},[a-zA-Z0-9$]{1,4}\)/)
    shiledClear_stuff = code.match(shiledClear_regex)[0]
    shiledClear_code = shiledClear_stuff.substring(0, 3) + "false&&" + shiledClear_stuff.substring(3);
    code = code.assertReplace(shiledClear_regex, shiledClear_code);

    snakeLength = code.match(/this.[a-zA-Z0-9$]{1,4}.[a-zA-Z0-9$]{1,4}\+=1;/gm)[0]
    snakeLength_code = `$&
    if(window.CurrentModeNum === 15) {
        if(window.findApple(window.head_pos[0], window.appleArray).isPiece){
            ${snakeLength.split("+")[0]}-=1;
        }
    };
    `
    code = code.assertReplace(snakeLength, snakeLength_code);

    //code = code.assertReplace(/var d=Kgk\(this.settings\)/gm, `
    //$&`)

    // Ternary shit - has something to do with changing apple re-position and spawn radius after eating
    // \([a-zA-Z0-9$]{1,4}\(this.[a-zA-Z0-9$]{1,4},[a-zA-Z0-9$]{1,4},[a-zA-Z0-9$]{1,4}\)

    // Inside that same function
    // [a-zA-Z0-9$]{1,4}=function\(a,b,c\){if\([a-zA-Z0-9$]{1,4}\.[a-zA-Z0-9$]{1,4}\[


    // use this to spawn radius new piece

    //

    newPiece_regex = new RegExp(/[a-zA-Z0-9$]{1,4}=this\.[a-zA-Z0-9$]{1,4}\([a-zA-Z0-9$]{1,4},![a-zA-Z0-9$]{1,4},null\)/gm)
    newPiece_stuff = code.match(newPiece_regex)[0]
    newPiece_call_final = newPiece_stuff.split('=')[1] // this.JEd(uc,!op,null)
    newPiece_call_final = newPiece_call_final.split("(")[0] + "(respawnIndex," + newPiece_call_final.split(",")[1] + ",null)"// this.JEd(window.appleArray.length-1,!op,null)
    newPiece_code = `${newPiece_stuff};
    
    for (let index = 0; index < window.appleArray.length; index++) {
        const element = window.appleArray[index];
        if (element.lastAdded) {
            var respawnIndex = index;
            element.lastAdded = false;
            break;
        } 
    }

    if(typeof respawnIndex !== 'undefined') {
        if(!${newPiece_call_final}){
            ${newPiece_stuff.split('=')[0]} = false;
            window.appleArray.splice(respawnIndex, 1);
        }
        respawnIndex = undefined;
    }

    `

    code = code.assertReplace(newPiece_regex, newPiece_code);


    // gj=this\.JEd\(uc,!op,null\) 

    // Avoid making the snake longer for non-fruit eats
    
    // This crap has nothing to do with snake length?!
    snek_len_regex = new RegExp(/this\.[a-zA-Z0-9$]{1,4}\.[a-zA-Z0-9$]{1,4}\.push/)
    snek_len_code = ` 
    if(window.just_ate == "fruit")$&`

    code = code.assertReplace(snek_len_regex, snek_len_code);
    // THIS CODE DOESN'T WORK 

    // for each apple - the set of shields it has is under the array "Vaa"
    // the structure is simple, each shield has a direction {"UP", "DOWN", "LEFT", "RIGHT"}
    // in chess mode I should either set Vaa to "false" when it's open
    // or set it to the full set when it's fully shielded - hopefully borders won't be an issue
    // but it's possible to take them into account, given board size can be tested for
    // for each apple I need to manually roll a chess piece
    // an alternate between making it white/black
    // 

// This functions draws shields
// Parameter "c" is the shield array to draw - trace it and learn how to update it
    //code = code.assertReplace(/xfk=function\(a,b,c,d,e\){/, `$& 
  //  `)

    //Mhk.prototype.tick = function() {

    // Todo

    // Gain control of apple array - locations + types + states (white, black, open)
    // Apple array has the array of shields around each apple
    // Make functions for all pieces using apple location and head location
    // Gain access to apple eaten function - crucial
    // Understand how shields work - placing and removing shields is a must
    // Pieces attempt to unlock every tick - get into tick function for that
    // "Shield all" when snake head state isn't "open"
    // 

    mode_regex = new RegExp(/case "trophy"\:/)
    mode_get_code = `case "trophy":d=15;`
    code = code.assertReplace(mode_regex, mode_get_code);

    reset_regex = new RegExp(/;this\.reset\(\)/)

    catchError(reset_regex, code)
    code = code.assertReplace(reset_regex, `;if (!window.FIRSTCLICKDONE) {window.clickSettings()};this.reset();`);

    window.final_code = code;

    return code;
}


window.ChessMod.runCodeAfter = function () {
    let modIndicator = document.createElement('div');
    modIndicator.style = 'position:absolute;font-family:roboto;color:white;font-size:14px;padding-top:4px;padding-left:30px;user-select: none;';
    modIndicator.textContent = 'Chess Mod';
    let canvasNode = document.getElementsByClassName('jNB0Ic')[0];
    document.getElementsByClassName('EjCLSb')[0].insertBefore(modIndicator, canvasNode);

    window.FIRSTCLICKDONE = false;

    function unclickSettings(){
        let settingsButton = document.querySelector('img[jsaction="AFvrle"]');
        if(settingsButton) {settingsButton.click();}
        if (!window.FIRSTCLICKDONE) {
            window.FIRSTCLICKDONE = true // Will become true forever.
            let actualPlayButton = document.querySelector('div[jsaction="JrrOHc"]');
            if(actualPlayButton) {actualPlayButton.click();}
        }
        return;
    }

     window.clickSettings = function clickSettings() {
        let settingsButton = document.querySelector('div[jsaction="rxqFXd"]');
        if(settingsButton) {settingsButton.click();}
        unclickSettings();

        return;
    }

    

  };