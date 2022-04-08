<html>
	<canvas id="field" width="500" height="500"></canvas>
	<style>
      canvas { border: 1px solid black; }
    </style>	
	
	<script>
		const canvas = document.getElementById('field');
        const ctx = canvas.getContext('2d');
		const emptyBlockColour = '#E6E6FA'; //цвет пустого блока
		const gameBlockSize = 20;           //длина стороны блока
		const intBetween = 3;               //интервал между блоками
		const fieldX = 10;                  //положение игрового поля по Х
		const fieldY = 20;                  //положение игрового поля по Y
		const fieldCountRows = 10;    	    //количество строк на игровом поле
		const fieldCountColumns = 10;		//количество колонок на игровом поле
				
		let scores = 0;						//набрано очков
		let gameField = [];					//игровое поле 
		let taskFigures = [];				//текущее задание (3 фигуры)
		let indexSelectFigure = -1;			//индекс выбранной фигуры
		let offsetSelectFigure = 0;			//сдвиг фигуры, если она начинается с пустого блока
		
		let lastOffsetX = 0; 				//последнее положение курсора по Х
		let lastOffsetY = 0; 				//последнее положение курсора по Y
		
		startGame();
				
		function GameBlock(x, y, color=emptyBlockColour){
			this.x = x;
			this.y = y;
			this.color = color;
			this.baseX = x;
			this.baseY = y;
			this.centerX = x + gameBlockSize / 2; 
			this.centerY = y + gameBlockSize / 2; 
		}
		
		function startGame(){
			scores = 0;
			fillGameField(fieldCountRows, fieldCountColumns); 
			fillTaskFigures();			
			indexSelectFigure = -1;
			
			drawScene();
		}
		
		function fillGameField(width, height){
			gameField = [];
			
			for (let i=0; i<width; i++){
				gameField.push([]);
				for (let j=0; j<height; j++){
					gameField[i].push(new GameBlock(fieldX + j * (gameBlockSize+intBetween), fieldY + i * (gameBlockSize+intBetween)));	
				}
			}
			
			return gameField;
		}
		
		function fillTaskFigures(){
			taskFigures = [];
			listOfFigures = [0, 1, 21, 22, 31, 32, 41, 42, 51, 52, 61, 62, 63, 64, 71, 72, 73, 74, 81, 82, 83, 84];
			
			let posX = fieldX;
			let posY = fieldY + fieldCountRows*(gameBlockSize+intBetween) + 20;	
			randNumberFigure = listOfFigures[Math.trunc(Math.random()*listOfFigures.length)];
			taskFigures.push(createFigure(randNumberFigure, posX, posY));
			
			posX = posX + taskFigures[0][0].length*(gameBlockSize+intBetween) + 20;
			randNumberFigure = listOfFigures[Math.trunc(Math.random()*listOfFigures.length)];
			taskFigures.push(createFigure(randNumberFigure, posX, posY));
			
			posX = posX + taskFigures[1][0].length*(gameBlockSize+intBetween) + 20;
			randNumberFigure = listOfFigures[Math.trunc(Math.random()*listOfFigures.length)];
			taskFigures.push(createFigure(randNumberFigure, posX, posY));
		}
		
		function createFigure(typeOfFigure, posX, posY){
			let figure = [];
						
			if (typeOfFigure == 0){ //квадрат (4)
				figure = [
					[
						new GameBlock(posX, posY, 'green'),
						new GameBlock(posX+gameBlockSize+intBetween, posY, 'green')
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, 'green'),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, 'green')
					]				
				];
			}else if (typeOfFigure == 1){  //квадрат (1)
				figure = [[new GameBlock(posX, posY, '#7B68EE')]];
			
			}else if (typeOfFigure == 21){  //палка (2)
				figure = createFigureStick(posX, posY, 2, '#F4A460');
			}else if (typeOfFigure == 22){  //палка вертикальная (2)
				figure = createFigureStickVert(posX, posY, 2, '#F4A460');			
			}else if (typeOfFigure == 31){  //палка (3)
				figure = createFigureStick(posX, posY, 3, '#D2691E');
			}else if (typeOfFigure == 32){  //палка вертикальная (3)
				figure = createFigureStickVert(posX, posY, 3, '#D2691E');				
			}else if (typeOfFigure == 41){  //палка (4)
				figure = createFigureStick(posX, posY, 4, '#1E90FF');
			}else if (typeOfFigure == 42){  //палка вертикальная (4)
				figure = createFigureStickVert(posX, posY, 4, '#1E90FF');				
			}else if (typeOfFigure == 51){  //палка (5)
				figure = createFigureStick(posX, posY, 5, '#EE82EE');
			}else if (typeOfFigure == 52){  //палка вертикальная (5)
				figure = createFigureStickVert(posX, posY, 5, '#EE82EE');
				
			}else if (typeOfFigure == 61){ //уголок ЛВ (3)	
				figure = [
					[
						new GameBlock(posX, posY, '#00FFFF'),
						new GameBlock(posX+gameBlockSize+intBetween, posY, '#00FFFF')
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, '#00FFFF'),
						undefined
					]
				];
			}else if (typeOfFigure == 62){ //уголок ПВ (3)	
				figure = [
					[
						new GameBlock(posX, posY, '#00FFFF'),
						new GameBlock(posX+gameBlockSize+intBetween, posY, '#00FFFF')
					],
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, '#00FFFF')
					]
				];
			}else if (typeOfFigure == 63){ //уголок ПН (3)	
				figure = [
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY, '#00FFFF')
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, '#00FFFF'),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, '#00FFFF')
					]
				];
			}else if (typeOfFigure == 64){ //уголок ЛН (3)	
				figure = [
					[
						new GameBlock(posX, posY, '#00FFFF'),
						undefined
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, '#00FFFF'),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, '#00FFFF')
					]
				];
				
			}else if (typeOfFigure == 71){ //уголок ЛВ (5)	
				currColor = '#00FFFF';
				figure = [
					[
						new GameBlock(posX, posY, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY, currColor)
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, currColor),
						undefined,
						undefined
					],
					[
						new GameBlock(posX, posY+(gameBlockSize+intBetween)*2, currColor),
						undefined,
						undefined
					]
				];
			}else if (typeOfFigure == 72){ //уголок ПВ (5)	
				currColor = '#00FFFF';
				figure = [
					[
						new GameBlock(posX, posY, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY, currColor)
					],
					[
						undefined,
						undefined,
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+gameBlockSize+intBetween, currColor)
					],
					[
						undefined,
						undefined,
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+(gameBlockSize+intBetween)*2, currColor)
					]
				];
			}else if (typeOfFigure == 73){ //уголок ПН (5)	
				currColor = '#00FFFF';
				figure = [
					[
						undefined,
						undefined,
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY, currColor)
					],
					[
						undefined,
						undefined,
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+gameBlockSize+intBetween, currColor)
					],
					[
						new GameBlock(posX, posY+(gameBlockSize+intBetween)*2, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY+(gameBlockSize+intBetween)*2, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+(gameBlockSize+intBetween)*2, currColor)
					]
				];
			}else if (typeOfFigure == 74){ //уголок ЛН (5)	
				currColor = '#00FFFF';
				figure = [
					[
						new GameBlock(posX, posY, currColor),
						undefined,
						undefined
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, currColor),
						undefined,
						undefined
					],
					[
						new GameBlock(posX, posY+(gameBlockSize+intBetween)*2, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY+(gameBlockSize+intBetween)*2, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+(gameBlockSize+intBetween)*2, currColor)
					]
				];
			
			}else if (typeOfFigure == 81){ //хреновина вверх (4)
				currColor = 'red';
				figure = [
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY, currColor),
						undefined
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY+gameBlockSize+intBetween, currColor)
					]
				];
			}else if (typeOfFigure == 82){ //хреновина вправо (4)
				currColor = 'red';
				figure = [
					[
						new GameBlock(posX, posY, currColor),		
						undefined
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, currColor)
					],
					[
						new GameBlock(posX, posY+(gameBlockSize+intBetween)*2, currColor),
						undefined
					]
				];
			}else if (typeOfFigure == 83){ //хреновина вниз (4)
				currColor = 'red';
				figure = [
					[
						new GameBlock(posX, posY, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY, currColor),
						new GameBlock(posX+(gameBlockSize+intBetween)*2, posY, currColor)
					],
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, currColor),
						undefined
					]
				];
			}else if (typeOfFigure == 84){ //хреновина влево (4)
				currColor = 'red';
				figure = [
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY, currColor)
					],
					[
						new GameBlock(posX, posY+gameBlockSize+intBetween, currColor),
						new GameBlock(posX+gameBlockSize+intBetween, posY+gameBlockSize+intBetween, currColor)
					],
					[
						undefined,
						new GameBlock(posX+gameBlockSize+intBetween, posY+(gameBlockSize+intBetween)*2, currColor)
					]
				];
			}

			return figure;
		}
		
		function createFigureStick(posX, posY, size, color){
			figure = [];
			
			let currPosX = posX;
			figure.push([]);
			for (i=0; i<size; i++){
				figure[0].push(new GameBlock(currPosX, posY, color));
				currPosX += gameBlockSize+intBetween; 
			}
			
			return figure;
		}
		
		function createFigureStickVert(posX, posY, size, color){
			figure = [];
			
			let currPosY = posY;				
				for (i=0; i<size; i++){
					figure.push([]);
					figure[i].push(new GameBlock(posX, currPosY, color));
					currPosY += gameBlockSize+intBetween; 
				}
			
			return figure;
		}
		
		function drawScene(){
			ctx.clearRect(0, 0, canvas.width, canvas.height); 
			drawGameField();
			drawTaskFigures();
			drawScores();			
		}
				
		function drawGameField(){
			for (let i=0; i<gameField.length; i++){
				for (let j=0; j<gameField[i].length; j++){
					ctx.fillStyle = gameField[i][j].color;
					ctx.fillRect(gameField[i][j].x, gameField[i][j].y, gameBlockSize, gameBlockSize); 
				}
			}
		}
		
		function drawTaskFigures(){
			for (indexFigure=0; indexFigure<taskFigures.length; indexFigure++){
				currFigure = taskFigures[indexFigure];
			
				for (let i=0; i<currFigure.length; i++){
					for (let j=0; j<currFigure[i].length; j++){
						if (currFigure[i][j] != undefined){
							ctx.fillStyle = currFigure[i][j].color;
							ctx.fillRect(currFigure[i][j].x, currFigure[i][j].y, gameBlockSize, gameBlockSize); 
						}
					}
				}						
			}
		}
		
		function drawScores(){
			ctx.font = "20px Comic Sans MS";
			ctx.fillStyle = "black";
			ctx.fillText("Scores: " + scores, 250, 20);
		}
		
		function getBlockCoord(clickInfo){
			let cursorX = clickInfo.clientX - canvas.offsetLeft;
			let cursorY = clickInfo.clientY - canvas.offsetTop;
			let halfDistanation = (gameBlockSize + intBetween) / 2;
			
			if (indexSelectFigure != -1 && taskFigures[indexSelectFigure].length > 0 && taskFigures[indexSelectFigure][0].length > 0){
				offsetSelectFigure = 0; 
				
				for (let i=0; i<taskFigures[indexSelectFigure][0].length; i++){
					if (taskFigures[indexSelectFigure][0][i] != undefined){
						offsetSelectFigure = i;
						break;
					}
				}
				
				cursorX = taskFigures[indexSelectFigure][0][offsetSelectFigure].centerX;
				cursorY = taskFigures[indexSelectFigure][0][offsetSelectFigure].centerY;				
			}
			
			for (let i=0; i<gameField.length; i++){
				for (let j=0; j<gameField[i].length; j++){
					let currBlock = gameField[i][j];
					
					if (Math.abs(cursorX-currBlock.centerX) <= halfDistanation
						&& Math.abs(cursorY-currBlock.centerY) <= halfDistanation){
						console.log('block: ' + i + ' ' + j);
						return [i, j];
					}
				}
			}
			
			return [];
		}
		
		function getSelectedTaskFigure(clickInfo){
			let cursorX = clickInfo.clientX - canvas.offsetLeft;
			let cursorY = clickInfo.clientY - canvas.offsetTop;	
			let foundIndexFigure = -1;
			
			taskFigures.forEach(
				function(currFigure, index, array){
					for (let i=0; i<currFigure.length; i++){
						for (let j=0; j<currFigure[i].length; j++){
							let currBlock = currFigure[i][j];
					
							if (currBlock != undefined
								&& cursorX >= currBlock.x 
								&& cursorY >= currBlock.y
								&& cursorX <= currBlock.x + gameBlockSize + intBetween
								&& cursorY <= currBlock.y + gameBlockSize + intBetween
							){
								foundIndexFigure = index;
								return;
							}
						}
					}			
				}	
			);
			
			return foundIndexFigure;		
		}
		
		function getBackFigure(){
			figure = taskFigures[indexSelectFigure];
			
			for (let i=0; i<figure.length; i++){
				for (let j=0; j<figure.length; j++){
					if (figure[i][j] != undefined){
						figure[i][j].x = figure[i][j].baseX;
						figure[i][j].y = figure[i][j].baseY;
					}
				}
			}
		}
		
		function checkAndInsertFigure(selectedBlockCoord, needInsert = true){
			canInsert = true;
			figure = taskFigures[indexSelectFigure];
			gameFieldI = selectedBlockCoord[0];
			gameFieldJ = selectedBlockCoord[1];
			
			for (let i=0; i<figure.length; i++){
				for (let j=0; j<figure.length; j++){
					if (figure[i][j] != undefined){
						if (i+gameFieldI >= gameField.length 
							|| j+gameFieldJ-offsetSelectFigure >= gameField[0].length 
							|| gameField[i+gameFieldI][j+gameFieldJ-offsetSelectFigure].color != emptyBlockColour)
						{
							canInsert = false;
							break;
						}
					}
				}
			}
			
			if (canInsert && needInsert){
				for (let i=0; i<figure.length; i++){
					for (let j=0; j<figure[i].length; j++){
						if (figure[i][j] != undefined){
							gameField[i+gameFieldI][j+gameFieldJ-offsetSelectFigure].color = figure[i][j].color;
							scores++;
						}
					}
				}
				taskFigures[indexSelectFigure] = [];
			}							
	
			return canInsert;
		}
		
		function checkTaskFiguresEmpty(){
			for (i=0; i<taskFigures.length; i++){
				if (taskFigures[i].length > 0){
					return false;
				}
			}
			
			return true;
		}
		
		function clearRows(){				
			let rowsToClean = [];
			let columnsToClean = [];
			
			for (let i=0; i<gameField.length; i++){
				let canCleanRow = true;
				let canCleanColumn = true;
				
				for (let j=0; j<gameField[i].length; j++){
					if (canCleanRow && gameField[i][j].color === emptyBlockColour){
						canCleanRow = false;
					}
					if (canCleanColumn && gameField[j][i].color === emptyBlockColour){
						canCleanColumn = false;
					}
				}
				
				if (canCleanRow){
					rowsToClean.push(i);		
				}
				
				if (canCleanColumn){
					columnsToClean.push(i);		
				}
			}
			
			for (let i=0; i<rowsToClean.length; i++){
				for (let j=0; j<gameField.length; j++){
					gameField[rowsToClean[i]][j].color = emptyBlockColour;
				}	
				scores += gameField.length;
			}
			for (let i=0; i<columnsToClean.length; i++){
				for (let j=0; j<gameField[0].length; j++){
					gameField[j][columnsToClean[i]].color = emptyBlockColour;
				}	
				scores += gameField[0].length;
			}
		}
				
		document.onmouseup = function(clickInfo){
			if (indexSelectFigure != -1){
				selectedBlockCoord = getBlockCoord(clickInfo); 
				if (selectedBlockCoord.length === 2 && checkAndInsertFigure(selectedBlockCoord)){
					clearRows();
					if (checkTaskFiguresEmpty()){
						fillTaskFigures();				
					}
				}else{	
					getBackFigure();
				}
				drawScene();
			}
			
			indexSelectFigure = -1;
		}		
		
		document.onmousedown = function(clickInfo){
			indexSelectFigure = getSelectedTaskFigure(clickInfo); 
		}
		
		document.onmousemove = function(event){
			let currOffsetX = event.offsetX - canvas.offsetLeft;
			let currOffsetY = event.offsetY - canvas.offsetTop;
			let incX = currOffsetX - lastOffsetX;
			let incY = currOffsetY - lastOffsetY;
			
			if (indexSelectFigure != -1){
				currFigure = taskFigures[indexSelectFigure];
				for (let i=0; i<currFigure.length; i++){
					for (let j=0; j<currFigure[i].length; j++){
						if (currFigure[i][j] != undefined){
							currFigure[i][j].x = currFigure[i][j].x + incX;
							currFigure[i][j].y = currFigure[i][j].y + incY;	
							currFigure[i][j].centerX = currFigure[i][j].x + gameBlockSize / 2;
							currFigure[i][j].centerY = currFigure[i][j].y + gameBlockSize / 2;	
						}
					}
				}
				drawScene();	
			}
			
			lastOffsetX = event.offsetX - canvas.offsetLeft;
			lastOffsetY = event.offsetY - canvas.offsetTop;
		}
		
	</script>
</html>
