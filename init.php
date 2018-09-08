<?php
$package = json_decode(file_get_contents("package.json", "r"));
$manifest = json_decode(file_get_contents("builder/asset-manifest.json", "r"));

require_once "classes/class.wp-libre-formbuilder.php";

add_action("admin_enqueue_scripts", function ($hook) use ($package, $manifest) {
  global $post;

  // make sure we're on the correct view
  if ($hook !== 'post-new.php' && $hook !== 'post.php') {
    return;
  }

  if (!in_array($post->post_type, ['wplf-form', 'wplfb-field'])) {
    return;
  }

  $path = plugin_dir_url(__FILE__) . "/builder/";
  $version = $package->version;

  // wp_enqueue_style("wplfb-css", $path . "main.css", false, $version);
  wp_enqueue_style("wplfb-css", $path . $manifest->{"main.css"}, [], $version);
  wp_enqueue_script("wplfb-js", $path . $manifest->{"main.js"}, [], $version, true);

  $active = get_post_meta($post->ID, "wplfb-enabled", true);
  $state = stripslashes(get_post_meta($post->ID, "wplfb-state", true));

  // Can only pass strings
  wp_localize_script("wplfb-js", "wplfb", [
    "isAdmin" => "1",
    "state" => $state,
    "active" => !empty($active) && $active === "1" ? 1 : 0,
    "restURL" => rest_url(),
  ]);
});


if (function_exists("wplf")) {
  add_action("plugins_loaded", function () {
    $wplf = wplf();
    $builder = WP_Libre_Formbuilder::instance();

    $wplf->plugins->register([
      "name" => "Formbuilder",
      "description" => "Visual editor for the HTML impaired.",
      "link" => "https://github.com/k1sul1/wp-libre-formbuilder",
      "version" => WPLFB_VERSION,
      "instance" => $builder,
      "settings_page" => [$builder, "render_settings_page"],
    ]);
  });
} else {
  // Pre 1.5
  WP_Libre_Formbuilder::instance();
}

