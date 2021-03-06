options( digits = 16 );
library( jsonlite );

lambda = 5
k = 1
probs = 0:24 / 25
y = qweibull( probs, k, lambda )

cat( y, sep = ",\n" )

data = list(
	lambda = lambda,
	k = k,
	data = probs,
	expected = y
)


write( toJSON( data, digits = 16, auto_unbox = TRUE ), "./test/fixtures/matrix.json" )
