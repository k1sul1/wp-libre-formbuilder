<?php

// @codingStandardsIgnoreStart
class WP_Libre_Formbuilder {
// @codingStandardsIgnoreEnd
  public static $instance;
  protected $fields;

  public static function instance() {
    if (is_null(self::$instance)) {
      self::$instance = new WP_Libre_Formbuilder();
    }

    return self::$instance;
  }

  public function __construct() {
    add_action("init", [$this, "registerCPT"]);

    add_filter("user_can_richedit", function ($x) {
      if (isset($GLOBALS["post"]) && $GLOBALS["post"]->post_type === "wplfb-field") {
        return false;
      }

      return $x;
    });

    add_action("save_post", function ($post_id, $post) {
      if ($post->post_type === "wplfb-field") {
        $template = !empty($_POST["wplfb-field-template"]) ? $_POST["wplfb-field-template"] : "";
        $label = !empty($_POST["wplfb-field-label"]) ? $_POST["wplfb-field-label"] : false;

        update_post_meta($post_id, "wplfb-field-template", $template);
        update_post_meta($post_id, "wplfb-field-label", $label);
      }

      if ($post->post_type === "wplf-form") {
        $state = !empty($_POST["wplfb-state"])
          ? wp_json_encode($_POST["wplfb-state"], JSON_UNESCAPED_UNICODE)
          : "";
        $enabled = !empty($_POST["wplfb-enabled"])
          ? sanitize_text_field($_POST["wplfb-enabled"])
          : "0";

        update_post_meta($post_id, "wplfb-state", $state);
        update_post_meta($post_id, "wplfb-enabled", $enabled);
      }
    }, 10, 2);

    add_action("add_meta_boxes", [$this, "tamperMetaBoxes"]);
    add_action("rest_api_init", [$this, "registerRESTRoutes"]);

    $this->registerDefaultFields();
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

  public function render_settings_page() {
    ?>
    <div class="wplfb-settings-page">
      <h1>WP Libre Formbuilder settings</h1>
      <p>
        There's nothing here, yet.
      </p>
      <p>
        Leave an issue on what should be controllable here if you'd like.
      </p>
    </div>
    <?php
  }

  public function tamperMetaBoxes() {
    add_meta_box(
      "wplfb_field_options",
      "Field",
      function ($post) {
        ?>
      <section>
        <h3>Field</h3>

        <label>
          <strong>Field HTML</strong>

          <textarea name="content"><?=$post->post_content;?></textarea>
        </label>

        <p>
          Put the HTML that you want to be editable in the textarea above.
          Only the first HTML tag is used, if you require wrapping HTML around the field, use a field template.
        </p>

        <h4>Field attributes</h4>
        <p>
          By default, all attributes on the input will render as editable text inputs
          in the builder, with a few exceptions:
        </p>

        <ul>
          <li>
            <strong>type</strong>: not rendered at all
          </li>
          <li>
            <strong>required</strong>: rendered as checkbox
          </li>
        </ul>

        <p>You can configure each attribute to your liking using JSON. Pass the JSON in wplfbAttributes attribute.</p>
        <pre><code>{
  "attributeName": {
    "type": "checkbox",
    "readOnly": false,
    "hidden": false
  }
}
</code></pre>

        <ul>
          <li>
            <strong>type</strong>: change the input type of the attribute. Available values:<br>
            <ul>
              <li>checkbox</li>
              <li>text</li>
            </ul>
          </li>
          <li>
            <strong>readOnly</strong>: if set to true, will render the attribute as unchangeable
          </li>
          <li>
            <strong>hidden</strong>: if set to true, will not render the attribute at all
          </li>
        </ul>

        <h4>Example</h4>

        <pre><code><?=htmlspecialchars( // Linters...
          '<textarea name="message" maxlength="500" value="Say something" custom required wplfbAttributes=\'{
  "custom": {
    "type": "checkbox",
    "readOnly": false,
    "hidden": false
  }
}\'></textarea>'
                    ); ?></code></pre>

      </section>

      <section>
        <h3>Field template</h3>

        <label>
          <strong>Template HTML</strong>

          <textarea name="wplfb-field-template"><?=get_post_meta($post->ID, "wplfb-field-template", true)?></textarea>
        </label>

        <p>
          If you want to use the field template feature, make sure that you add an element with
          the class wplfb-field-container, or your field will not work.<br><br>

          Although the template isn't editable from the builder, nothing prevents you from
          using features like dynamic values and multilinguality placeholders.
        </p>

        <h4>Example</h4>
        <pre><code><?=(htmlspecialchars('<div class="wplfb-input">
  <div class="wplfb-field-container"></div>
</div>')); ?></code></pre>
      </section>

      <section>
        <h3>Field label</h3>

        <label>
          <strong>Label</strong>
          <input
            name="wplfb-field-label"
            placeholder="Leave empty to disable"
            value="<?=get_post_meta($post->ID, "wplfb-field-label", true)?>">
        </label>

        <p>
          Currently only "nested" labels are supported. Should you use a label
          <em>(and you should!)</em>, the field will be nested inside the label.
        </p>
      </section>
        <?php
      },
      "wplfb-field",
      "advanced",
      "high",
      [$GLOBALS["post"]]
    );

    add_meta_box(
      "wplfb_form_metabox",
      "Form builder",
      function ($post) { ?>
        <div id="wplfb_buildarea">
          <p>WP Libre Formbuilder is loading...</p>
        </div>

        <div id="wplfb_tools">
          <!-- Only used for saving state, it's not read from here -->
          <input class="hidden" type="text" name="wplfb-state">
          <!-- Same with this -->
          <input type="hidden" name="wplfb-enabled" value="0">
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
  }

  /**
   * For whatever reason $_POST and $request->get_body_params() are empty.
   * This goes around that.
   */
  public function getRequestBody() {
    // Maybe do error handling.
    return json_decode(file_get_contents('php://input'));
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
      ]);

      if (!$ok) {
        // The key already exists; do not add it again or overwrite it.
        // Combine with a huge notice in field edit page.
        update_post_meta($p->ID, "wplfb-field-override", true);
      }
    }

    // Allow user to filter the result.
    $fields = apply_filters("wplfb-available-fields", $this->fields, $codefields);

    return new WP_REST_Response([
      "fields" => $fields,
    ]);
  }

  public function registerDefaultFields() {
    $fields = [
      "C0" => [
        "name" => "Wrapper",
        "field" => '<div class="wplfb-wrapper" id="wrapper_#"><div class="wplfb-child-container"></div></div>',
        // "template" => null,
        // "label" => null,
      ],

      "C1" => [
        "name" => "Text",
        "field" => '<input type="text" required name="textinput" class="" placeholder="Name"
          wplfbAttributes=\'{ "type": { "hidden": true } }\'>',
        "template" => '<div class="wplfb-input"><div class="wplfb-field-container"></div></div>',
        "label" => "Default label",
      ],

      "C2" => [
        "name" => "Email",
        "field" => '<input type="email" required name="email" class="" placeholder="someone@example.com"
          wplfbAttributes=\'{ "type": { "hidden": true } }\'>',
        "template" => '<div class="wplfb-input"><div class="wplfb-field-container"></div></div>',
        "label" => "Enter your email address",
      ],

      "C3" => [
        "name" => "Password",
        "field" => '<input type="password" required name="password" class="" placeholder="hunter2"
          wplfbAttributes=\'{ "type": { "hidden": true } }\'>',
        "template" => '<div class="wplfb-input"><div class="wplfb-field-container"></div></div>',
        "label" => "Enter your password",
      ],

      "C4" => [
        "name" => "Submit",
        "field" => '<input type="submit" class="" value="Submit">',
      ]
    ];

    foreach ($fields as $index => $value) {
      $this->addField(array_merge($value, [
        "key" => $index,
      ]));
    }
  }

  public function addField($data = []) {
    $data = array_merge([
      "key" => null,
      "name" => null,
      "field" => null,
      "template" => null,
      "label" => null,
    ], $data);
    if (empty($data)) {
      throw new Exception("You must supply the field data");
    } elseif (empty($data["key"])) {
      throw new Exception("Field key is mandatory. Numerical keys *will* override database entries.");
    } elseif (empty($data["name"])) {
      // throw new Exception("Field name is mandatory");
    } elseif (empty($data["field"])) {
      throw new Exception("Field is mandatory");
    } elseif (!isset($data["template"])) {
      // throw new Exception("Field template is mandatory");
    } elseif (!isset($data["label"])) {
      // throw new Exception("Field label is mandatory");
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
