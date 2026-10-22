use super::*;
use swc_core::{
    common::{FileName, SourceMap},
    ecma::{
        parser::{lexer::Lexer, EsSyntax, Parser, StringInput, Syntax},
        visit::{Visit, VisitWith},
    },
};

#[derive(Default)]
struct Attributes(Vec<Vec<(String, String)>>);

impl Visit for Attributes {
    fn visit_jsx_opening_element(&mut self, opening: &JSXOpeningElement) {
        self.0.push(
            opening
                .attrs
                .iter()
                .filter_map(|attr| match attr {
                    JSXAttrOrSpread::JSXAttr(JSXAttr {
                        name: JSXAttrName::Ident(name),
                        value: Some(JSXAttrValue::Str(value)),
                        ..
                    }) => Some((
                        name.sym.to_string(),
                        value.value.to_string_lossy().into_owned(),
                    )),
                    _ => None,
                })
                .collect(),
        );
        opening.visit_children_with(self);
    }
}

fn attributes(source: &str, filename: Option<&str>, config: &str, passes: usize) -> Attributes {
    let source_map = SourceMap::default();
    let file = source_map.new_source_file(
        FileName::Custom(filename.unwrap_or("test.jsx").into()).into(),
        source.to_owned(),
    );
    let lexer = Lexer::new(
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*file),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    let mut program = parser.parse_program().expect("valid JSX fixture");
    assert!(parser.take_errors().is_empty());
    for _ in 0..passes {
        program = transform_with_source_map(
            program,
            filename.map(str::to_owned),
            serde_json::from_str(config).unwrap(),
            &source_map,
        );
    }
    let mut attrs = Attributes::default();
    program.visit_with(&mut attrs);
    attrs
}

#[test]
fn injects_source_locations_into_nested_host_elements() {
    let attrs = attributes("<div>\n  <span />\n</div>", Some("app/page.jsx"), "{}", 1);
    assert_eq!(
        attrs.0,
        vec![
            vec![("data-source".into(), "app/page.jsx:1:0".into())],
            vec![("data-source".into(), "app/page.jsx:2:2".into())],
        ]
    );
}

#[test]
fn honors_custom_attribute_and_preserves_existing_values() {
    let attrs = attributes(
        "<div data-origin=\"manual\"><span /></div>",
        Some("app/page.jsx"),
        r#"{"attr":"data-origin"}"#,
        2,
    );
    assert_eq!(
        attrs.0,
        vec![
            vec![("data-origin".into(), "manual".into())],
            vec![("data-origin".into(), "app/page.jsx:1:26".into())],
        ]
    );
}

#[test]
fn excludes_matching_paths_and_keeps_other_files() {
    let config = r#"{"exclude":["components/ui", "generated/"]}"#;
    for filename in [
        "/project/components/ui/button.jsx",
        "/project/generated/icon.jsx",
    ] {
        let attrs = attributes("<div><span /></div>", Some(filename), config, 1);
        assert_eq!(attrs.0, vec![vec![], vec![]]);
    }
    let attrs = attributes("<div />", Some("/project/components/button.jsx"), config, 1);
    assert_eq!(attrs.0[0][0].1, "/project/components/button.jsx:1:0");
}

#[test]
fn handles_missing_filename() {
    let attrs = attributes("<div />", None, r#"{"exclude":["components/ui"]}"#, 1);
    assert_eq!(attrs.0[0][0].1, "unknown:1:0");
}

#[test]
fn preserves_component_call_site_attributes() {
    // Existing releases also annotate components so they can forward the caller's source.
    let attrs = attributes(
        "<Button><UI.Icon /></Button>",
        Some("app/page.jsx"),
        "{}",
        1,
    );
    assert_eq!(
        attrs.0,
        vec![
            vec![("data-source".into(), "app/page.jsx:1:0".into())],
            vec![("data-source".into(), "app/page.jsx:1:8".into())],
        ]
    );
}
