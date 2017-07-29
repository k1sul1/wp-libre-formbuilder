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
      if ($GLOBALS["post"]->post_type === "wplfb-field") {
        return false;
      }

      return $x;
    });

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

  public function registerRESTRoutes() {
    register_rest_route("wplfb", "/fields", [
      "methods" => "GET",
      "callback" => function (WP_REST_Request $request) {
        return $this->getFields($request);
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

  public function getForm(WP_REST_Request $request) {
    $form_id = 55; // Temp.
    if (is_null($form_id)) {
      return new WP_REST_Response([
        "error" => self::ERR_FORM_ID_EMPTY
      ]);
    }

    $p = get_post($form_id);

    return new WP_REST_Response([
      "post" => $p,
      "fields" => get_post_meta($p->ID, "wplfb_fields", true)
    ]);
  }

  public function saveForm(WP_REST_Request $request) {
    $form_id = 55; // Temp.

    // Do not check for null. Create a new one.
    // if (is_null($form_id)) {
      // return new WP_REST_Response([
        // "error" => self::ERR_FORM_ID_EMPTY
      // ]);
    // }

    $params = $request->get_body_params();
    $fields = $params["fields"];


    update_post_meta($form_id, "wplfb_fields", $fields); // Sanitize?
    $insert = wp_insert_post([
      "ID" => !is_null($form_id) ? $form_id : 0,
      "post_content" => $this->generateHTML($fields)
    ]);

    if (!is_wp_error($insert) && $insert !== 0) {
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
        "html" => $p->post_content,
        "children" => get_post_meta($p->ID, "wplfb-field-children", true)
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
    } else if (empty($data["html"])) {
      throw new Exception("Field html is mandatory");
    } else if (!isset($data["children"])) {
      throw new Exception("You must spesify whether the field takes children");
    }

    if (!empty($this->fields[$data["key"]])) {
      return false;
    }

    $this->fields[$data["key"]] = [
      "name" => apply_filters("wplfb-field-name", $data["name"], $data),
      "html" => apply_filters("wplfb-field-html", $data["html"], $data),
      "dom" => apply_filters("wplfb-field-dom", $this->generateDOM($data["html"]), $data),
      "children" => apply_filters("wplfb-field-children", \WPLFB\booleanify($data["children"]), $data),
    ]; // PHP casts it into an array if it's null.

    return $this->fields[$data["key"]];
  }

  public function generateDOM($html = '') {
    $DOM = new DOMDocument();
    $DOM->loadHTML($html, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

    $parseNode = function($node, $parseNode) {
      $parseAttrs = function($el){
        $attrs = false;

        if ($el->attributes) {
          $attrs = [];
          foreach ($el->attributes as $attr) {
            $attrs[$attr->name] = $attr->value;
          }
        }

        return $attrs;
      };


      return [
        "element" => !empty($node->tagName) ? $node->tagName : "TextNode",
        "textContent" => !empty($node->textContent) ? $node->textContent : false,
        "attributes" => $parseAttrs($node),
        "children" => $node->firstChild ? $parseNode($node->firstChild, $parseNode) : false,
      ];
    };

    return $parseNode($DOM->firstChild, $parseNode);
  }

  public function generateHTML($json = '') {
    // This is absolutely horrible and was written in about 30 seconds for a poc.
    // Rewrite completely.
    $obj = json_decode($json);
    $shorts = ["br", "img"]; // Add all.
    $html = "";

    foreach ($obj as $key => $value) {
      $is_short = in_array($key, $shorts);
      $mayClose = $is_short ? "/" : "";
      $html .= "<$key $attrs $mayClose>";
      $html .= ""; // Add children here.
      $html .= !$is_short ? "</$key>" : "";
    }

    return $html;
  }
}
