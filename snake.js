var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;
  
var snake = {
  x: 160,
  y: 160,
  
  //velocidade da cobra. move um comprimento de grade a cada quadro na direção x ou y
  dx: grid,
  dy: 0,
  
  // acompanhe todas as grades que o corpo da cobra ocupa
  cells: [],
  
  // comprimento da cobra. cresce ao comer uma maçã
  maxCells: 4
};
var apple = {
  x: 320,
  y: 320
};

// função de de gerar  números inteiros aleatórios em um intervalo específico
// @ver https://stackoverflow.com/a/1527820/2124254
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function loop() {
  requestAnimationFrame(loop);

  // loop de jogo lento para 15 fps em vez de 60 (60/15 = 4) ou seja cada grade = 4
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);

  // mover cobra por sua velocidade 
  snake.x += snake.dx;
  snake.y += snake.dy;

  //  a posição da cobra horizontalmente na borda da tela
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  
  //  a posição da cobra verticalmente na borda da tela
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  // manter o controle de onde a cobra esteve. frente da matriz é sempre a cabeça
  snake.cells.unshift({x: snake.x, y: snake.y});

  // remover células à medida que nos afastamos delas
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // desenhar maçã
  let color = context.createLinearGradient(0,0,170,0);
  color.addColorStop(0, "green");
  color.addColorStop(0.5, "red");
  color.addColorStop(1, "brown");
  context.fillStyle = color;
  context.fillRect(apple.x, apple.y, grid-1, grid-1);

  // desenhar cobra uma célula de cada vez
  let color2 = context.createLinearGradient(10,10,400,10);
  color2.addColorStop(0, "orange");
  color2.addColorStop(0.5, "yellow");
  color2.addColorStop(1, "green");
  context.fillStyle = color2;
  snake.cells.forEach(function(cell, index) {
    
    // desenhar 1 px menor que a grade cria um efeito de grade no corpo da cobra para que você possa ver seu tamanho
    context.fillRect(cell.x, cell.y, grid-1, grid-1);  

    // colisão cobra e maçã
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      // tamanho do mapa em grades 
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }

    // verifique a colisão com todas as células após esta  (modifica o bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {
      
      // colisao da cobra do eixo x em y ou o contrario
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;

        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
      }
    }
  });
}


document.addEventListener('keydown', function(e) {
  /*de acordo co os clicks do teclado para mover a cobra, evite que a cobra retroceda sobre si mesma, verificando se ela está
   ainda não está se movendo no mesmo eixo (pressionando para a esquerda enquanto se move esquerda não fará nada, e pressionar direita enquanto move para esquerda não deveria deixar você colidir com seu próprio corpo)*/

  // mover para esquerda
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -grid;
    snake.dy = 0;
  }
  // mover para sima
  else if (e.which === 38 && snake.dy === 0) {
    snake.dy = -grid;
    snake.dx = 0;
  }
  // mover para direita
  else if (e.which === 39 && snake.dx === 0) {
    snake.dx = grid;
    snake.dy = 0;
  }
  // mover para baixo
  else if (e.which === 40 && snake.dy === 0) {
    snake.dy = grid;
    snake.dx = 0;
  }
});

// iniciar jogo
requestAnimationFrame(loop);