options( digits = 16 );
library( jsonlite );


lambda = 0.5
k = 0.5
probs = c( 0, 0.25, 0.5, 0.75, 1 )
y = qweibull( probs, k, lambda )

cat( y, sep = ",\n" )

data = list(
	lambda = lambda,
	k = k,
	data = probs,
	expected = y
)

write( toJSON( data, digits = 16, auto_unbox = TRUE ), "./test/fixtures/number.json" )
