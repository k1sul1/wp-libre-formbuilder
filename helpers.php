<?php
namespace WPLFB;

/**
 * Converts *sensible* things into booleans and throws when things aren't sensible.
 *
 * @param mixed $data
 * @return boolean
 * @throws
 */
function booleanify($data) {
  return (bool) $data;
}


