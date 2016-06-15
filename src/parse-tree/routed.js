var TokenTypes = require('./../TokenTypes');
var RoutedTokens = require('./../RoutedTokens');
var E = require('./../exceptions');
var routedE = E.routed;

/**
 * The routing logic.
 *
 * parse-tree:
 * <opening-brace><routed-token>(:<token>)<closing-brace>
 */
module.exports = function routed(tokenizer, openingToken, state) {
    var routeToken = tokenizer.next();
    var named = false;
    var name = '';

    // ensure the routed token is a valid ident.
    switch (routeToken.token) {
        case RoutedTokens.integers:
        case RoutedTokens.ranges:
        case RoutedTokens.keys:
            //valid
            break;
        default:
            E.throwError(routedE.invalid, tokenizer);
            break;
    }

    // Now its time for colon or ending brace.
    var next = tokenizer.next();

    // we are parsing a named identifier.
    if (next.type === TokenTypes.colon) {
        named = true;

        // Get the token name or a white space character.
        next = tokenizer.next();

        // Skip over preceeding white space
        while (next.type === TokenTypes.space) {
            next = tokenizer.next();
        }

        if (next.type !== TokenTypes.token) {
            E.throwError(routedE.invalid, tokenizer);
        }
        name = next.token;

        // Move to the closing brace or white space character
        next = tokenizer.next();

        // Skip over any white space to get to the closing brace
        while (next.type === TokenTypes.space) {
            next = tokenizer.next();
        }
    }

    // must close with a brace.

    if (next.type === TokenTypes.closingBrace) {
        var outputToken = {
            type: routeToken.token,
            named: named,
            name: name
        };
        state.indexer[state.indexer.length] = outputToken;
    }

    // closing brace expected
    else {
        E.throwError(routedE.invalid, tokenizer);
    }

};
