options( digits = 16 );
library( jsonlite );


lambda = 4
k = 3
probs = seq( 0, 1, 0.1 )
y = qweibull( probs, k, lambda )

cat( y, sep = ",\n" )

data = list(
	lambda = lambda,
	k = k,
	data = probs,
	expected = y
)

write( toJSON( data, digits = 16, auto_unbox = TRUE ), "./test/fixtures/accessor.json" )
