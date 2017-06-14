<?php

class WP_Libre_Formbuilder {
  public static $instance;

  public static function instance() {
    if (is_null(self::$instance)) {
      self::$instance = new WP_Libre_Formbuilder();
    }

    return self::$instance;
  }

  public function __construct() {
    add_action("init", [$this, "registerCPT"]);

    add_filter("user_can_richedit", function($x) {
      if ($GLOBALS["post"]->post_type === "wplfb-field") {
        return false;
      }

      return $x;
    });

    add_action("add_meta_boxes", [$this, "tamperMetaBoxes"]);
  }

  public function registerCPT() {
    register_post_type("wplfb-field", apply_filters("wplfb_cpt_args", [
      "labels" => [
        "name" => _x("Form fields", "post type general name", "wp-libre-formbuilder"),
        "singular_name" => _x("Form field", "post type singular name", "wp-libre-formbuilder")
      ],
      "public" => false,
      "show_ui" => true,
      "show_in_menu" => "edit.php?post_type=wplf-form",
      "capability_type" => apply_filters("wplfb_cpt_capability_type", "post"),
      "capabilities" => apply_filters("wplfb_cpt_capabilities", []),
      "supports" => apply_filters("wplfb_cpt_supports", [
        "title",
        "editor",
        "custom-fields",
        "revisions"
      ]),
      "taxonomies" => apply_filters("wplfb_cpt_taxonomies", []),
      "show_in_rest" => true
    ]));
  }

  public function tamperMetaBoxes() {
    add_meta_box(
      "wplfb_metabox",
      "Form builder",
      function($post) {
        ?>
        <?php
        var_dump($post);
      },
      "wplfb-field",
      "advanced",
      "high",
      [$GLOBALS["post"]]
    );

    add_meta_box(
      "wplfb_buildarea",
      "Form builder",
      function() {
        echo "Hello!";
      },
      "wplf-form",
      "advanced",
      "high"
    );
  }
}
