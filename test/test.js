/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Check whether an element is a finite number
	isFiniteNumber = require( 'validate.io-finite' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	quantile = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'distributions-weibull-quantile', function tests() {

	it( 'should export a function', function test() {
		expect( quantile ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				quantile( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				quantile( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				quantile( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				quantile( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( quantile( values[ i ] ) ) );
		}
	});

	it( 'should compute the Weibull quantile when provided a number', function test() {
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
			});

			var actual;
			for ( var i = 0; i < data.length; i++ ) {
				actual =  quantile( data[ i ], {
					'lambda': validationData.lambda,
		'k': validationData.k
				});
				if ( isFiniteNumber( actual ) && isFiniteNumber( expected[ i ] ) ) {
					assert.closeTo( actual, expected[ i ] , 1e-12 );
				}
			}
	});

	it( 'should evaluate the Weibull quantile when provided a plain array', function test() {

		var validationData = require( './fixtures/array.json' ),
			data,
			actual,
			expected,
			i;

		// make copy of data array to prevent mutation of validationData
		data = validationData.data.slice();
		expected = validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		});

		actual = quantile( data, {
			'lambda': validationData.lambda,
		'k': validationData.k
		});
		assert.notEqual( actual, data );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-12 );
			}
		}
		// Mutate...
		actual = quantile( data, {
			'copy': false,
			'lambda': validationData.lambda,
		'k': validationData.k
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < data.length; i++ ) {
			if ( isFiniteNumber( data[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( data[ i ], expected[ i ], 1e-12 );
			}
		}
	});

	it( 'should evaluate the quantle function of the Weibull distribution when provided a typed array', function test() {
		var validationData = require( './fixtures/typedarray.json' ),
			data,
			actual,
			expected,
			i;

		data = new Float32Array( validationData.data );

		expected = new Float64Array( validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}) );

		actual = quantile( data, {
			'lambda': validationData.lambda,
			'k': validationData.k
		});
		assert.notEqual( actual, data );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-6 );
			}
		}

		// Mutate:
		actual = quantile( data, {
			'copy': false,
			'lambda': validationData.lambda,
		'k': validationData.k
		});
		expected = new Float32Array( validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}) );
		assert.strictEqual( actual, data );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-6 );
			}
		}
	});

	it( 'should evaluate the Weibull quantile function element-wise and return an array of a specific type', function test() {

		var validationData = require( './fixtures/array.json' ),
			// make copy of data array to prevent mutation of validationData
			data = validationData.data.slice(),
			actual,
			expected,
			i;

		expected = new Float32Array( validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}) );

		actual = quantile( data, {
			'dtype': 'float32',
			'lambda': validationData.lambda,
			'k': validationData.k
		});

		assert.notEqual( actual, data );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-12 );
			}
		}
	});

	it( 'should evaluate the Weibull quantile function element-wise using an accessor', function test() {
		var validationData = require( './fixtures/accessor.json' ),
			data,
			actual,
			expected,
			i;

		data = validationData.data.map( function( e, i ) {
			return [ i, e ];
		});

		expected = validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		});

		actual = quantile( data, {
			'accessor': getValue,
			'lambda': validationData.lambda,
			'k': validationData.k
		});
		assert.notEqual( actual, data );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-12 );
			}
		}

		// Mutate:
		actual = quantile( data, {
			'accessor': getValue,
			'copy': false,
			'lambda': validationData.lambda,
			'k': validationData.k
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < actual.length; i++ ) {
			if ( isFiniteNumber( actual[ i ] ) && isFiniteNumber( expected[ i ] ) ) {
				assert.closeTo( actual[ i ], expected[ i ], 1e-12 );
			}
		}

		function getValue( d ) {
			return d[ 1 ];
		}
	});

	it( 'should evaluate the Weibull quantile function element-wise and deep set', function test() {
		var validationData = require( './fixtures/deepset.json' ),
				data,
				actual,
				expected,
				i;

		data = validationData.data.map( function( e ) {
			return {'x': [ i, e ]};
		});

		actual = quantile( data, {
			'path': 'x.1',
			'lambda': validationData.lambda,
			'k': validationData.k
		});

		expected = validationData.expected
			.map( function( d ) {
				if (d === 'Inf' ) {
					return Number.POSITIVE_INFINITY;
				}
				if ( d === '-Inf' ) {
					return Number.NEGATIVE_INFINITY;
				}
				return d;
			})
			.map( function( e ) {
				return {'x': [ i, e ]};
			});

		assert.strictEqual( actual, data );

		for ( i = 0; i < data.length; i++ ) {
			if ( isFiniteNumber( data[ i ].x[ 1 ] ) && isFiniteNumber( expected[ i ].x[ 1 ] ) ) {
				assert.closeTo( data[ i ].x[ 1 ], expected[ i ].x[ 1 ], 1e-12 );
			}
		}

		// Specify a path with a custom separator...
		data = validationData.data.map( function( e ) {
			return {'x': [ i, e ]};
		});
		actual = quantile( data, {
			'path': 'x/1',
			'sep': '/',
			'lambda': validationData.lambda,
			'k': validationData.k
		});
		assert.strictEqual( actual, data );

		for ( i = 0; i < data.length; i++ ) {
			if ( isFiniteNumber( data[ i ].x[ 1 ] ) && isFiniteNumber( expected[ i ].x[ 1 ] ) ) {
				assert.closeTo( data[ i ].x[ 1 ], expected[ i ].x[ 1 ], 1e-12, 'custom separator' );
			}
		}
	});

	it( 'should evaluate the Weibull quantile function element-wise when provided a matrix', function test() {
		var validationData = require( './fixtures/matrix.json' ),
			mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( validationData.data );
		d2 = new Float64Array( validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}) );

		mat = matrix( d1, [5,5], 'float64' );
		out = quantile( mat, {
			'lambda': validationData.lambda,
		'k': validationData.k
		});

		for ( i = 0; i < out.length; i++ ) {
			if ( isFiniteNumber( out.data[ i ] ) && isFiniteNumber( d2[ i ] ) ) {
				assert.closeTo( out.data[ i ], d2[ i], 1e-12 );
			}
		}

		// Mutate...
		out = quantile( mat, {
			'copy': false,
			'lambda': validationData.lambda,
		'k': validationData.k
		});
		assert.strictEqual( mat, out );

		for ( i = 0; i < out.length; i++ ) {
			if ( isFiniteNumber( out.data[ i ] ) && isFiniteNumber( d2[ i ] ) ) {
				assert.closeTo( out.data[ i ], d2[ i ], 1e-12 );
			}
		}
	});

	it( 'should evaluate the Weibull quantile function element-wise and return a matrix of a specific type', function test() {
		var validationData = require( './fixtures/matrix.json' ),
			mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( validationData.data );
		d2 = new Float32Array( validationData.expected.map( function( d ) {
			if (d === 'Inf' ) {
				return Number.POSITIVE_INFINITY;
			}
			if ( d === '-Inf' ) {
				return Number.NEGATIVE_INFINITY;
			}
			return d;
		}) );

		mat = matrix( d1, [5,5], 'float64' );
		out = quantile( mat, {
			'dtype': 'float32',
			'lambda': validationData.lambda,
		'k': validationData.k
		});

		assert.strictEqual( out.dtype, 'float32' );

		for ( i = 0; i < out.length; i++ ) {
			if ( isFiniteNumber( out.data[ i ] ) && isFiniteNumber( d2[ i ] ) ) {
				assert.closeTo( out.data[ i ], d2[ i ], 1e-12 );
			}
		}
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( quantile( [] ), [] );
		assert.deepEqual( quantile( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( quantile( new Int8Array() ), new Float64Array() );
	});

});
