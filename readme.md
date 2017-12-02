# SmartHome backend

## Működés

1. Minden 5 mp-ben lekérjük a szenzor adatokat. És minden szenzorra elvégezzük az alábbiakat:
 * Ha 3 mp-en belül (time-out) nem érkezik válasz, akkor bejegyzünk egy kommunikációs hibát.
 * Ha 3 x 5 mp-nél régebbi valamelyik adat, akkor bejegyzünk egy kommunikációs hibát az adott node-hoz, de használjuk az adatot.
 * Ha a változás az előző értékhez képest túl nagy, bejegyzünk egy adat hibát, és nem használjuk fel azt az adatot.
 * betesszük a legutóbb használt

## Környezet

Node 6.x és 7.x alatt nincs szükség a webpack.config.js-ben a babel-loader-re, de ha régebbi nodejs alatt is akarjuk futtatni, akkor kell. Pl. D-Link NAS alatt 0.10.24-es nodejs van.
