// parameters

var mutationProb = 0.6; // %60

var geneticCodingSize = 20;

var populationSize = 10; // 20 power 2


// global var
var generation = 0;








function Population(populationSize, geneticCodingSize) {
    this.chromosomePopulation = [];
    for(var i = 0; i < populationSize; i++){
        this.chromosomePopulation[i] = new Chromosome(geneticCodingSize);
    }
}

Population.prototype.getFittestChromosome = function(){
    return this.chromosomePopulation.reduce(function (prev, current, currentIndex) {
        return prev.calcFitness() >= current.calcFitness() ? prev : current;
    });
};

Population.prototype.getSecondFittestChromosome = function(){
    var fittestChromosomeScoreIndex = this.chromosomePopulation.indexOf(this.getFittestChromosome());
    var chromosomePopulationCopy = this.chromosomePopulation.slice(); // this copy isn't needed

    var chromosomesPopulationWithFittestRemoved =
        chromosomePopulationCopy.concat(chromosomePopulationCopy.slice(0, fittestChromosomeScoreIndex),
        chromosomePopulationCopy.slice(fittestChromosomeScoreIndex + 1, chromosomePopulationCopy.length));

    return chromosomesPopulationWithFittestRemoved.reduce(function (prev, current, currentIndex) {
        return prev.calcFitness() >= current.calcFitness() ? prev : current;
    });
};

Population.prototype.getLeastFittest = function(){
    return this.chromosomePopulation.reduce(function (prev, current, currentIndex) {
        return prev.calcFitness() <= current.calcFitness() ? prev : current;
    })
};

Population.prototype.replaceLeastFittestWithOffSpring = function(offSpring){
   var indexOfLeastFittest = this.chromosomePopulation.indexOf(this.getLeastFittest());
   this.chromosomePopulation[indexOfLeastFittest] = offSpring;
};


function Chromosome(length, customGenes){
    this.length = length;
    this.genes = customGenes || [];
    if(customGenes == undefined)
        for(var i = 0; i < length; i++){
            this.genes[i] = generateRandomBit();
        }
}

// cross over
Chromosome.prototype.createOffSpring = function(otherChromosome){
    var offSpringGenes = [];
    var cutOffPoint = Math.floor(Math.random() * this.genes.length);
    for(var i = 0; i < this.genes.length; i++){
        if(i < cutOffPoint){
            offSpringGenes[i] = this.genes[i];
        }else{
            offSpringGenes[i] = otherChromosome.genes[i];
        }
    }

    return new Chromosome(otherChromosome.genes.length, offSpringGenes);
};

Chromosome.prototype.mutateOneBit = function(){
    var randomIndex = Math.floor(Math.random() * this.genes.length);
    this.genes[randomIndex] = flipBit(this.genes[randomIndex]);
};

Chromosome.prototype.calcFitness = function(){
    var score = 0;
    for(var i = 0; i < this.genes.length; i++){
        if(this.genes[i] == 1)
            score++;
    }
    return score;
};

function generateRandomBit(){
    return Math.round(Math.random());
}

// accept 0 or 1 argument
function flipBit(bit){
    if(bit == 0){
        return 1;
    }
    return 0;
}



// genetic algorithm main

// function runSimulation() {

// init population
var population = new Population(populationSize, geneticCodingSize);

function runSimulation(){

    // window.innerHTML = "";
    generation++;

    // selection
    var fittest = population.getFittestChromosome();
    var secondFittest = population.getSecondFittestChromosome();

    // cross-over
    var offSpring = fittest.createOffSpring(secondFittest);
    // console.log("off spring");
    // console.log(offSpring);

    // mutation
    var randomOutOf100 = Math.floor(Math.random() * 100);
    if (randomOutOf100 <= mutationProb * 100)
        offSpring.mutateOneBit();

    // add offSpring into population and remove least fittest
    population.replaceLeastFittestWithOffSpring(offSpring);
}

// while (population.getFittestChromosome().calcFitness() < geneticCodingSize) {
//
//
//
//     runSimulation();
// }



function simulate(){
    if(population.getFittestChromosome().calcFitness() < geneticCodingSize) {
        runSimulation();
        document.body.innerHTML = prettyPrint(population.chromosomePopulation);
        window.requestAnimationFrame(simulate)
    }else{
        window.cancelAnimationFrame(simulate);
    }

}


window.requestAnimationFrame(simulate);




function prettyPrint(chromosomePopulation){
    var string = "Generation: " + generation;
    string += "</br> </br>";
    chromosomePopulation.forEach(function(chromosome){
        string += "[";
        chromosome.genes.forEach(function(gene){
            string += gene + ", "
        });
        string += "]";
        string += " </br>"
    })
    return string;
}
// }

// runSimulation();


console.log("solution found at generation " + generation);
console.log("here is fittest solution " + population.getFittestChromosome().genes);

