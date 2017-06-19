function CellularAutomata(size) {
	this.size = floor((width-1)/size);
	this.cellsize = size;
	this.board = [];
	for(var i=0; i<this.size; i++) {
		for(var j=0; j<this.size; j++) {
			this.board[i*(this.size)+j] = false;
		}
	}

	this.gencount = 1;

	this.setRandomValues = function() {
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				this.board[i*(this.size)+j] = round(random(0,3)) == 0 ? true : false;
			}
		}
	}

	this.clear = function() {
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				this.board[i*(this.size)+j] = false;
			}
		}
	}

	this.distance = function() {
		var dist = -1;
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				if(this.board[i*(this.size)+j]) {
					if(floor(sqrt(i*i+j*j)) > dist) {
						dist = floor(sqrt(i*i+j*j));
					}
				}
			}
		}

		return dist;
	}

	/*this.distance = function() {
		var s = 0;
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				if(this.board[i*(this.size)+j]) {
					s++;
				}
			}
		}

		return s;
	}*/

	/*this.distance = function() {
		var dist = this.size*this.size;
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				if(!this.board[i*(this.size)+j]) {
					dist--;
				}
			}
		}

		return dist;
	}*/

	this.show = function() {
		stroke(0);
		strokeWeight(1);
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				if(this.board[i*(this.size)+j]) {
					fill(0);
				} else {
					fill(255);
				}
				rect(i*this.cellsize, j*this.cellsize, this.cellsize, this.cellsize);
			}
		}
	}

	this.cellValue = function(x, y) {
		if(x<0 || x>=this.size || y<0 || y>=this.size) {
			return false;
		}
		if(this.board[x*(this.size) + y] == true) {
			return true;
		} else {
			return false;
		}
	}

	this.setCell = function(x, y, newcell) {
		this.board[x*(this.size) + y] = newcell;
	}

	this.numofNeighbors = function(x, y) {
		var sum = 0;
		if(this.cellValue(x-1, y-1)) sum++;
		if(this.cellValue(x, y-1)) sum++;
		if(this.cellValue(x+1, y-1)) sum++;
		if(this.cellValue(x-1, y)) sum++;
		if(this.cellValue(x+1, y)) sum++;
		if(this.cellValue(x-1, y+1)) sum++;
		if(this.cellValue(x, y+1)) sum++;
		if(this.cellValue(x+1, y+1)) sum++;
		return sum;
	}

	this.nextGeneration = function() {
		var newgeneration = [];
		for(var i=0; i<this.size; i++) {
			for(var j=0; j<this.size; j++) {
				if(this.board[i*(this.size)+j]) {
					if(this.numofNeighbors(i, j) != 2 && this.numofNeighbors(i, j) != 3) {
						newgeneration[i*(this.size)+j] = false;
					} else {
						newgeneration[i*(this.size)+j] = true;
					}
				}
				if(!this.board[i*(this.size)+j]) {
					if(this.numofNeighbors(i, j) == 3) {
						newgeneration[i*(this.size)+j] = true;
					} else {
						newgeneration[i*(this.size)+j] = false;
					}
				}
			}
		}
		this.board = newgeneration;
		this.gencount++;
	}

}