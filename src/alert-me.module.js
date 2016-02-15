angular.module('alert-me', [])

/**
 * At start check if element is
 * in the document body
 */
.run(function($document) {
  // check if element is in page
  if( !$document.find('alert-me').length ) {
    return $document[0].body.appendChild( $document[0].createElement('alert-me') );
  }
})
