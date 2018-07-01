<?php

class WP_Libre_Formbuilder {
  const ERR_FORM_ID_EMPTY = 'You must supply a form id.';
  const FORM_SAVED = 'Form saved succesfully.';

  public static $instance;
  public $fields;

  public static function instance() {
    if (is_null(self::$instance)) {
      self::$instance = new WP_Libre_Formbuilder();
    }

    return self::$instance;
  }

  public function __construct() {
    add_action("init", [$this, "registerCPT"]);

    add_filter("user_can_richedit", function($x) {
      if (isset($GLOBALS["post"]) && $GLOBALS["post"]->post_type === "wplfb-field") {
        return false;
      }

      return $x;
    });

    add_action("save_post", function($post_id, $post) {
      if ($post->post_type === "wplfb-field") {
        $template = !empty($_POST["wplfb-field-template"]) ? $_POST["wplfb-field-template"] : "";
        $label = !empty($_POST["wplfb-field-label"]) ? $_POST["wplfb-field-label"] : false;

        update_post_meta($post_id, "wplfb-field-template", $template);
        update_post_meta($post_id, "wplfb-field-label", $label);
      }

      if ($post->post_type === "wplf-form") {
        $state = !empty($_POST["wplfb-state"]) ? $_POST["wplfb-state"] : "";

        update_post_meta($post_id, "wplfb-state", $state);
      }
    }, 10, 2);

    add_action("add_meta_boxes", [$this, "tamperMetaBoxes"]);
    add_action("rest_api_init", [$this, "registerRESTRoutes"]);
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
      "wplfb_field_options",
      "Field options",
      function($post) {
      ?>
      <label>
        <strong>Field template</strong>
        <textarea name="wplfb-field-template"><?=get_post_meta($post->ID, "wplfb-field-template", true)?></textarea>
      </label><br>

      <label>
        <strong>Field label</strong>
        <input name="wplfb-field-label" value="<?=get_post_meta($post->ID, "wplfb-field-label", true)?>">
      </label><br>

      <label>
      <?php
        var_dump($post);
      },
      "wplfb-field",
      "advanced",
      "high",
      [$GLOBALS["post"]]
    );

    add_meta_box(
      "wplfb_form_metabox",
      "Form builder",
      function($post) { ?>
        <div id="wplfb_buildarea">

        </div>

        <div id="wplfb_tools">
          <label>
            <strong>State</strong>
            <input class="text" type="text" name="wplfb-state" value="<?=get_post_meta($post->ID, "wplfb-state", true)?>">
          </label>
        </div>
      <?php },
      "wplf-form",
      "advanced",
      "high",
      [$GLOBALS["post"]]
    );
  }

  public function registerRESTRoutes() {
    register_rest_route("wplfb", "/fields", [
      "methods" => "GET",
      "callback" => function (WP_REST_Request $request) {
        return $this->getFields($request);
      },
    ]);

    register_rest_route("wplfb", "/forms/forms", [
      "methods" => "GET",
      "callback" => function (WP_REST_Request $request) {
        return $this->getForms($request);
      },
    ]);

    register_rest_route("wplfb", "/forms/form", [
      "methods" => "GET",
      "callback" => function (WP_REST_Request $request) {
        return $this->getForm($request);
      },
    ]);

    register_rest_route("wplfb", "/forms/form", [
      "methods" => "POST",
      "callback" => function (WP_REST_Request $request) {
        return $this->saveForm($request);
      },
    ]);
  }

  public function getForms(WP_REST_Request $request) {
    // require auth for this
    $plist = get_posts([
      "post_type" => "wplf-form",
      "posts_per_page" => -1
    ]);

    foreach ($plist as $p) {
      $result[] = [
        "form" => $p,
        "fields" => get_post_meta($p->ID, "wplfb_fields", true)
      ];
    }

    return new WP_REST_Response($result);
  }

  public function getForm(WP_REST_Request $request) {
    $form_id = $request->get_param("form_id");

    if (is_null($form_id)) {
      return new WP_REST_Response([
        "error" => self::ERR_FORM_ID_EMPTY
      ]);
    }

    $p = get_post((int) $form_id);

    return new WP_REST_Response([
      "form" => $p,
      "fields" => get_post_meta($p->ID, "wplfb_fields", true)
    ]);
  }

  /**
   * For whatever reason $_POST and $request->get_body_params() are empty.
   * This goes around that.
   */
  public function getRequestBody() {
    // Maybe do error handling.
    return json_decode(file_get_contents('php://input'));
  }

  public function saveForm(WP_REST_Request $request) {
    $form_id = $request->get_param("form_id");
    $params = $this->getRequestBody();
    $fields = !empty($params->fields) ? $params->fields : false;
    $html = !empty($params->html) ? $params->html : false;

    if (!$fields) {
      return new WP_REST_Response([
        "error" => "No tree provided.",
      ]);
    }

    $is_insert = is_null($form_id);

    // Stop messing with the HTML!
    remove_all_filters("content_save_pre");

    $args = [
      "ID" => !$is_insert ? $form_id : 0,
      "post_content" => $html,
      "post_type" => "wplf-form",
      "post_status" => "publish",
    ];

    $fn = !$is_insert
      ? "wp_update_post"
      : "wp_insert_post";
    $insert = $fn($args);

    if (!is_wp_error($insert) && $insert !== 0) {
      update_post_meta($insert, "wplfb_fields", $fields); // Sanitize?
      return new WP_REST_Response([
        "success" => self::FORM_SAVED,
        "fields" => $fields
      ]);
    } else {
      return new WP_REST_Response([
        "error" => $insert
      ]);
    }
  }

  public function getField(WP_REST_Request $request) {

  }

  public function getFields(WP_REST_Request $request) {
    $codefields = apply_filters("wplfb-available-code-fields", $this->fields);
    // Pass later later with callback; does not contain fields from DB

    // Querying the DB is expensive, so fields from the DB are not loaded until necessary.
    $plist = get_posts(["post_type" => "wplfb-field", "posts_per_page" => -1]);
    foreach ($plist as $p) {
      $ok = $this->addField([
        "key" => $p->ID,
        "name" => $p->post_title,
        "field" => $p->post_content,
        "template" => get_post_meta($p->ID, "wplfb-field-template", true),
        "label" => get_post_meta($p->ID, "wplfb-field-label", true),
        // "takesChildren" => \WPLFB\booleanify(get_post_meta($p->ID, "wplfb-field-children", true)),
      ]);

      if (!$ok) {
        // The key already exists; do not add it again or overwrite it.
        // Combine with a huge notice in field edit page.
        update_post_meta($p->ID, "wplfb-field-override", true);
      } else {
        // I'd love to store the DOM in meta ($ok["dom"]) but I do not want to do it every time.
      }
    }

    // Allow user to filter the result.
    $fields = apply_filters("wplfb-available-fields", $this->fields, $codefields);

    return new WP_REST_Response([
      "fields" => $fields,
    ]);
  }

  public function addField($data = []) {
    if (empty($data)) {
      throw new Exception("You must supply the field data");
    } else if (empty($data["key"])) {
      throw new Exception("Field key is mandatory. Numerical keys *will* override database entries.");
    } else if (empty($data["name"])) {
      throw new Exception("Field name is mandatory");
    } else if (empty($data["field"])) {
      throw new Exception("Field is mandatory (html)");
    } else if (!isset($data["template"])) {
      throw new Exception("Field template is mandatory");
    } else if (!isset($data["label"])) {
      throw new Exception("Field label is mandatory");
    }

    if (!empty($this->fields[$data["key"]])) {
      return false;
    }

    $this->fields[$data["key"]] = [
      "name" => apply_filters("wplfb-field-name", $data["name"], $data),
      "field" => apply_filters("wplfb-field-field", $data["field"], $data),
      "template" => apply_filters("wplfb-field-template", $data["template"], $data),
      "label" => apply_filters("wplfb-field-label", $data["label"], $data),
    ]; // PHP casts it into an array if it's null.

    return $this->fields[$data["key"]];
  }
}
