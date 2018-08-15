<?php
/**
 * Plugin name: WP Libre Formbuilder
 * Plugin URI: https://github.com/k1sul1/wp-libre-form
 * Description: Formbuilder for WP Libre Form
 * Version: 1.0
 * Author: @k1sul1
 * Author URI: https://github.com/k1sul1/
 * License: GPLv2
 * License URI: https://www.gnu.org/licenses/gpl.html
 * Text Domain: wp-libre-formbuilder
 *
 */

$package = json_decode(file_get_contents("package.json", "r"));
$manifest = json_decode(file_get_contents("builder/asset-manifest.json", "r"));

register_activation_hook(__FILE__, function () {
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

  if (!empty($message)) {
    deactivate_plugins(basename(__FILE__));
    wp_die($message);
  }

  add_action("shutdown", "flush_rewrite_rules");
});

register_deactivation_hook(__FILE__, "flush_rewrite_rules");

add_action("admin_enqueue_scripts", function () use ($package, $manifest) {
  $path = plugin_dir_url(__FILE__) . "/builder/";
  $version = $package->version;

  // wp_enqueue_style("wplfb-css", $path . "main.css", false, $version);
  wp_enqueue_style("wplfb-css", $path . $manifest->{"main.css"}, [], $version);
  wp_enqueue_script("wplfb-js", $path . $manifest->{"main.js"}, [], $version, true);
});

if (function_exists('xdebug_disable')) {
  // Those fugly HTML tables sure do not help when dealing with REST..
  xdebug_disable();
}


require_once "classes/class.wp-libre-formbuilder.php";
WP_Libre_Formbuilder::instance();
