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
  error_log($data);
  if (is_bool($data)) {
    return $data;
  } else if (is_string($data)) {
    switch (strtolower($data)) {
      case "true":
        return true;
      break;

      case "false":
        return false;
      break;
    }
  } else if (is_numeric($data)) {
    // For once typecasting is good for something.
    if ($data == 0) {
      return false;
    } else if ($data == 1) {
      return true;
    }
  }

  throw new Exception("Unable to transform $data into boolean");
}


