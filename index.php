<?php
/**
 * Plugin name: WP Libre Formbuilder
 * Plugin URI: https://github.com/k1sul1/wp-libre-form
 * Description: Formbuilder for WP Libre Form
 * Version: 1.0.1
 * Author: @k1sul1
 * Author URI: https://github.com/k1sul1/
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl.html
 * Text Domain: wp-libre-formbuilder
 *
 */

if (!defined("ABSPATH")) {
  die("You're not supposed to be here.");
}

function wplfb_version_problems() {
  $php_version = phpversion();
  $wp_version = $GLOBALS["wp_version"];
  $is_56 = version_compare($php_version, 5.6, ">=");
  $is_70 = version_compare($php_version, 7.0, ">=");

  $php_ok = $is_56 || $is_70;
  $wp_ok = version_compare($wp_version, 4.7, ">=");
  $message = "";

  if (!$php_ok) {
    $message .= "Minimum PHP version required is 5.6. Yours is {$php_version}. ";
  } elseif (!$wp_ok) {
    $message .= "Minimum WP version required is 4.7. Yours is {$wp_version}. ";
  }

  if (empty($message)) {
    return false;
  }

  return $message;
}

function wplfb_activation_hook() {
  $version_troubles = wplfb_version_problems();

  if ($version_troubles) {
    deactivate_plugins(basename(__FILE__));
    wp_die($version_troubles);
  }

  add_action("shutdown", "flush_rewrite_rules");
}

register_activation_hook(__FILE__, "wplfb_activation_hook");
register_deactivation_hook(__FILE__, "flush_rewrite_rules");

$version_troubles = wplfb_version_problems();
if ($version_troubles) {
  deactivate_plugins(basename(__FILE__));
  wp_die($version_troubles);
} else {
  require_once "init.php";
}
