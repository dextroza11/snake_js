var FIELD_SIZE_X = 20;
var FIELD_SIZE_Y = 20;
var SNAKE_SPEED = 300;
var snake = [];
var direction = "x-"
var gameIsRunning =  false;
var snake_timer;
var food_timer;
var foodCreated;
var score = 0;
var countBarier = 3;
var bariers = [];
var scoreHTML =  document.querySelector('.game-score_num');
var apple = document.getElementById('apple');
//var danger  = document.getElementById('danger');

var properties = {

}

function init() {
    prepareGameField();
    document.querySelector('.snake-start').addEventListener('click', startGame);
    document.querySelector('.snake-renew').addEventListener('click', refreshGame);
    addEventListener('keydown', changeDirection);

    //startGame();
    
    
}


function respawn(){
    var start_coord_x = Math.floor(FIELD_SIZE_X/2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y/2);
    
    var snake_head = document.querySelector(`[data-cell ='${start_coord_x}-${start_coord_y}']`);
    snake_head.classList.add('snake-unit');

    var snake_tail = document.querySelector(`[data-cell ='${start_coord_x - 1}-${start_coord_y}']`);
    snake_tail.classList.add('snake-unit');
    snake.push(snake_head, snake_tail);
    
}


function safeCoordx(coord_x){
    if(coord_x == -1 && (direction == 'x-' || direction == 'y-' )){
        return FIELD_SIZE_X ;
    }
    else if(coord_x == FIELD_SIZE_X  && (direction == 'x+' || direction == 'y+' )){
        return -1;
    }
    else{
        return coord_x;
    }
}


function move(){
    var snake_head = snake[snake.length - 1];
    var new_unit;
    var snake_coords = snake_head.dataset.cell.split('-');
    var coords_x = safeCoordx(parseInt(snake_coords[0]));
    
    var coords_y = safeCoordx(parseInt(snake_coords[1]));
    console.log(coords_x, coords_y);
    
    if(direction == 'x-'){
        new_unit = document.querySelector(`[data-cell ='${coords_x - 1}-${coords_y}']`);
        
    }
    else if(direction == 'x+'){
        new_unit = document.querySelector(`[data-cell ='${coords_x + 1}-${coords_y}']`);
        console.log(`[data-cell ='${coords_x + 1}-${coords_y}'`);
    }
    else if(direction == 'y-'){
        new_unit = document.querySelector(`[data-cell ='${coords_x}-${coords_y - 1}']`);
        
    }

    else if(direction == 'y+'){

        new_unit = document.querySelector(`[data-cell ='${coords_x}-${coords_y + 1}']`);
        
    }
    


    
    if(!isSnakeUnit(new_unit) && new_unit != null && !haveBarier(new_unit)){
        new_unit.classList.add('snake-unit');
        snake.push(new_unit);

        if(!haveFood(new_unit)){
            var removed = snake.splice(0,1)[0];        
            removed.classList.remove('snake-unit', 'food-unit');
    
        }
    
        
    }
    else{
        finishTheGame();
    }
    

}

function haveBarier(unit){
    return unit.classList.contains('barier-unit');
}

function haveFood(unit){
    var check = false;
    var isSnakeEating = unit.classList.contains('food-unit');
    if(isSnakeEating ){
        check = true;
        createFood();
        score++;
        scoreHTML.innerText = score;

    }
    return check;

}

function isSnakeUnit(unit) {
    var check = false;

    if (snake.includes(unit)) {
        check = true;
    }
    return check;

}

function finishTheGame(){
    alert(`the end, score: ${score}`);
    gameIsRunning = false;
    clearInterval(snake_timer);
    clearInterval(barier_timer);
}

function changeDirection(e) {
    console.log(e.keyCode);
    switch (e.keyCode) {
        case 37: //left
            if (direction != "y+"){
                direction = "y-";
            }
        break;
        case 38:  //up
            if(direction != "x+")
            {
                direction = "x-";
            }
        break;
        case 39: //right
            if(direction != 'y-')
            {
                direction = 'y+'
            }
        break;
        case 40:  //down
            if(direction != 'x-'){
                direction = 'x+'
                console.log(direction);
            }
        break;
    }

}

function refreshGame(){
    location.reload();
}

function createBarier(){

    
    for (let i = 0; i < countBarier; i++) {
        var barier_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var barier_y = Math.floor(Math.random() * FIELD_SIZE_Y);
        barier_cell = document.querySelector(`[data-cell ='${barier_x}-${barier_y}']`);
        if (!isSnake(barier_cell)) {
            danger = document.createElement('i');
            danger.classList.add('fa-skull-crossbones');
            danger.classList.add('red');
            danger.classList.add('fas')
            barier_cell.classList.add('barier-unit');
            barier_cell.appendChild(danger);
            bariers.push(barier_cell);
            console.log(barier_cell);
        }
    }

}

function refreshBarier(){
    
    
    for(let i = 0; i < countBarier; i++)
    {

        
        barier = bariers.pop();
        console.log(barier);
    
        barier.innerHTML = " ";
        // var child = barier.querySelector('fa-skull-crossbones red fas');
        // console.log(child);
        // barier.removeChild(child);
        barier.classList.remove('barier-unit');
    }
    createBarier();

    
}

function createFood(){
    var food = false;
    var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
    var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);
    console.log(food_x,food_y);
    food_cell = document.querySelector(`[data-cell ='${food_x}-${food_y}']`);
    
    
    
    if(!isSnake(food_cell)){
        food_cell.classList.add('food-unit');
        food_cell.appendChild(apple);
        foodCreated = true;
    }
    
}

function isSnake(cell){
    return cell.classList.contains('snake-unit');
}



function startGame (){
    
    gameIsRunning = true;
    respawn();
    createFood();  
    createBarier();  
    snake_timer = setInterval(move, 500);
    barier_timer = setInterval(refreshBarier, 10000);
   // setInterval(createFood, food_timer);
   
}



function prepareGameField(){
    var game_table = document.createElement('table');
    game_table.classList.add('game-table');
    for( i = 0; i < FIELD_SIZE_X; i++){
        var row = document.createElement('tr');
        row.classList.add('game-table-row');
        row.dataset.row = i;


        for(j = 0; j < FIELD_SIZE_Y; j++){
            var cell = document.createElement('td');
            cell.classList.add('game-table-cell')
            cell.dataset.cell = i + '-' + j;
            row.appendChild(cell);
        }
        game_table.appendChild(row);

        
    }
    var snake_field = document.querySelector('.snake-field');
    snake_field.appendChild(game_table);
}




window.onload = init;
