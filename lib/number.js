'use strict';

// FUNCTIONS //

var ln = Math.log,
	pow = Math.pow;


// QUANTILE //

/**
* FUNCTION: quantile( p, lambda, k )
*	Evaluates the quantile function for a Weibull distribution with shape parameter `lambda` and scale parameter `k` at a probability `p`.
*
* @param {Number} p - input value
* @param {Number} lambda - shape parameter
* @param {Number} k - scale parameter
* @returns {Number} evaluated quantile function
*/
function quantile( p, lambda, k ) {
	if ( p !== p || p < 0 || p > 1 ) {
		return NaN;
	}
	return lambda * pow( -ln( 1 - p ) , 1/k );
} // end FUNCTION quantile()


// EXPORTS //

module.exports = quantile;
