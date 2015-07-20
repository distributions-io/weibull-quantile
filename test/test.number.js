/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Check whether an element is a finite number
	isFiniteNumber = require( 'validate.io-finite' ),

	// Check whether an element is `NaN`
	isnan = require( 'validate.io-nan' ),	

	// Module to be tested:
	quantile = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'number quantile', function tests() {

	var	validationData = require( './fixtures/number.json' ),
		data = validationData.data,
		expected = validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}),
		lambda = validationData.lambda,
		k = validationData.k;

	it( 'should export a function', function test() {
		expect( quantile ).to.be.a( 'function' );
	});

	it( 'should evaluate the quantile function of the Weibull distribution', function test() {
		var actual;
		for ( var i = 0; i < data.length; i++ ) {
			actual =  quantile( data[ i ], lambda, k );
			if ( isFiniteNumber( actual ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual, expected[ i ] , 1e-12 );
			}
		}
	});

	it( 'should return `NaN` if provided `NaN` as input', function test() {
		assert.isTrue( isnan( quantile( NaN, lambda, k ) ) );
	});

	it( 'should return `NaN` if provided a number outside [0,1]', function test() {
		assert.isTrue( isnan( quantile( 1.1, lambda, k ) ) );
		assert.isTrue( isnan( quantile( -0.1, lambda, k ) ) );
	});

});
