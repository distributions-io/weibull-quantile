'use strict';

// FUNCTIONS //

var ln = Math.log,
	pow = Math.pow;


// PARTIAL //

/**
* FUNCTION: partial( lambda, k )
*	Partially applies shape parameter `lambda` and scale parameter `k` and returns a function for evaluating the quantile function for a Weibull distribution.
*
* @param {Number} lambda - shape parameter
* @param {Number} k - scale parameter
* @returns {Function} quantile function
*/
function partial( lambda, k ) {

	/**
	* FUNCTION: quantile( p )
	*	Evaluates the quantile function for a Weibull distribution.
	*
	* @private
	* @param {Number} p - input value
	* @returns {Number} evaluated quantile function
	*/
	return function quantile( p ) {
		if ( p !== p || p < 0 || p > 1 ) {
			return NaN;
		}
		return lambda * pow( -ln( 1 - p ) , 1/k );
	};
} // end FUNCTION partial()


// EXPORTS //

module.exports = partial;
