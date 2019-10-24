QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("test chromosome instantation creates genes as bits", function( assert ){
    var chromosome = new Chromosome(10);
    assert.equal(chromosome.genes.length, 10);

    for(var i = 0; i < chromosome.length; i++){
        assert.ok(chromosome.genes[0] == 0 || chromosome.genes[0] == 1)
    }
});


QUnit.test("test offspring crossover from parents is mostly unique from parents", function( assert ){
    var chromosomeParent1 = new Chromosome(5);
    console.log(chromosomeParent1);
    var chromosomeParent2 = new Chromosome(5);
    console.log(chromosomeParent2);

    var offSpringChromosome = chromosomeParent1.createOffSpring(chromosomeParent2);
    assert.notDeepEqual(offSpringChromosome, chromosomeParent1);
    assert.notDeepEqual(offSpringChromosome, chromosomeParent2);
    console.log(offSpringChromosome);
});

QUnit.test("test fitness score of chromosome works correctly", function ( assert ){
    var chromosome = new Chromosome(10);
    var countOfOneBits = 0;
    for(var i = 0; i < chromosome.genes.length; i++){
        if (chromosome.genes[i] == 1)
            countOfOneBits++;
    }
    assert.ok(chromosome.calcFitness() === countOfOneBits);
});

QUnit.test("test mutate one bit in chromosome works", function ( assert ){
    var originalChromosome = new Chromosome(10);
    var originalChromosomeCopy = JSON.parse(JSON.stringify(originalChromosome));
    // note: can't call methods on json obj it appears
    assert.deepEqual(originalChromosome.genes, originalChromosomeCopy.genes);
    originalChromosome.mutateOneBit();
    assert.notDeepEqual(originalChromosome.genes, originalChromosomeCopy.genes);
});


