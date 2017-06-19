var scl = 12;
var lifespan = 80;
var game;
var population;
var tmp_lifespan = lifespan;
var gensize = 1.5;

function setup() {
	createCanvas(601, 601);
	game = new CellularAutomata(scl);
	var s = floor(game.size/gensize)*floor(game.size/gensize);
	population = new Population(s)
	population.setRandomToGame(game);
	frameRate(30);
}

function draw() {
	if(tmp_lifespan == 0) {
		population.evaluate();
		population.selection();
		game.clear();
		population.setToGame(game);
		tmp_lifespan = lifespan;
	} else {
		game.show();
		game.nextGeneration();
		tmp_lifespan--;
	}
}

function Population(numOfGenes) {
	this.patterns = [];
	this.popsize = 100;
	this.numOfGenes = numOfGenes;
	this.matingpool = [];

	for(var i=0; i<this.popsize; i++) {
		this.patterns[i] = new Indiv(numOfGenes);
	}

	this.setToGame = function(cellaut) {
		var maxfit = 0;
		var index = 0;
		for(var i=0; i<this.patterns.length; i++) {
			if(this.patterns[i].fitness > maxfit) {
				maxfit = this.patterns[i].fitness;
				index = i;
			}
		}

		this.patterns[index].setToAut(cellaut);
	}

	this.setRandomToGame = function(cellaut) {
		this.patterns[floor(random(0, this.popsize))].setToAut(cellaut);
	}

	this.evaluate = function() {
		var maxfit = 0;
		for(var i=0; i<this.popsize; i++) {
			this.patterns[i].calcFitness();
			if(this.patterns[i].fitness > maxfit) {
				maxfit = this.patterns[i].fitness;
			}
		}

		for(var i=0; i<this.popsize; i++) {
			this.patterns[i].fitness /= maxfit;
		}

		this.matingpool = [];

		for(var i=0; i<this.popsize; i++) {
			var n = this.patterns[i].fitness * 100;
			for(var j=0; j<n; j++) {
				this.matingpool.push(this.patterns[i]);
			}
		}
	}

	this.selection = function() {
		var newPatterns = [];
		for(var i=0; i<this.patterns.length; i++) {
			var parentA = random(this.matingpool).dna;
			var parentB = random(this.matingpool).dna;
			var child = parentA.crossover(parentB);
			child.mutate();
			newPatterns[i] = new Indiv(numOfGenes, child);
		}
		this.patterns = newPatterns;
	}
}

function DNA(numOfGenes, genes) {
	this.genes = [];
	if(genes) {
		this.genes = genes;
	} else {
		this.genes = [];
		for(var i=0; i<numOfGenes; i++) {
			this.genes[i] = round(random(0, 1)) == 0 ? true : false;
		}
	}
	
	this.crossover = function(partner) {
		var newgenes = [];
		var mid = floor(random(this.genes.length));
		for(var i=0; i<this.genes.length; i++) {
			if(i > mid) {
				newgenes[i] = this.genes[i];
			} else {
				newgenes[i] = partner.genes[i];
			}
		}

		return new DNA(this.genes.length, newgenes);
	}

	this.mutate = function() {
		for(var i=0; i<this.genes.length; i++) {
			if(random(1) < 0.01) {
				if(this.genes[i]) {
					this.genes[i] = false;
				} else {
					this.genes[i] = true;
				}
			}
		}
	}
}

function Indiv(numOfGenes, dna) {
	if(dna) {
		this.dna = dna;
	} else {
		this.dna = new DNA(numOfGenes);
	}
	this.fitness;

	this.calcFitness = function() {
		var cellaut = new CellularAutomata(scl);
		this.setToAut(cellaut);
		for(var i=0; i<lifespan; i++) {
			cellaut.nextGeneration();
		}
		this.fitness = cellaut.distance();
	}

	this.setToAut = function(cellaut) {
		var k=0;
		for(var i=0; i<5/*floor(cellaut.size/gensize)*/; i++) {
			for(var j=0; j<5/*floor(cellaut.size/gensize)*/; j++) {
				cellaut.setCell(i, j, this.dna.genes[k]);
				k++;
			}
		}
	}
}