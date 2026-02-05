use serde::Deserialize;
use swc_core::{
    common::{SourceMapper, Span, DUMMY_SP},
    ecma::{
        ast::{
            IdentName, JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXElement,
            JSXOpeningElement, Lit, Program, Str,
        },
        visit::{VisitMut, VisitMutWith},
    },
    plugin::{
        metadata::TransformPluginMetadataContextKind, plugin_transform,
        proxies::TransformPluginProgramMetadata,
    },
};

#[derive(Deserialize, Default, Clone)]
struct Config {
    #[serde(default = "default_attr")]
    attr: String,

    #[serde(default)]
    exclude: Vec<String>,
}

fn default_attr() -> String {
    "data-source".to_string()
}

fn should_exclude(filename: &Option<String>, exclude_patterns: &[String]) -> bool {
    filename
        .as_ref()
        .is_some_and(|fname| exclude_patterns.iter().any(|p| fname.contains(p)))
}

struct DomSourceInjector<'a> {
    filename: Option<String>,
    config: Config,
    metadata: &'a TransformPluginProgramMetadata,
}

impl DomSourceInjector<'_> {
    fn span_to_line_col(&self, span: Span) -> (usize, usize) {
        let loc = self.metadata.source_map.lookup_char_pos(span.lo);
        (loc.line, loc.col_display)
    }

    fn has_attr(opening: &JSXOpeningElement, attr_name: &str) -> bool {
        opening.attrs.iter().any(|a| {
            matches!(
                a,
                JSXAttrOrSpread::JSXAttr(JSXAttr {
                    name: JSXAttrName::Ident(i),
                    ..
                }) if i.sym.as_ref() == attr_name
            )
        })
    }

    fn make_attr(&self, value: &str) -> JSXAttrOrSpread {
        JSXAttrOrSpread::JSXAttr(JSXAttr {
            span: DUMMY_SP,
            name: JSXAttrName::Ident(IdentName::new(self.config.attr.clone().into(), DUMMY_SP)),
            value: Some(JSXAttrValue::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: value.into(),
                raw: None,
            }))),
        })
    }

    fn inject_attr(&self, opening: &mut JSXOpeningElement, span: Span) {
        if Self::has_attr(opening, &self.config.attr) {
            return;
        }

        let filename = self.filename.as_deref().unwrap_or("unknown");
        let (line, col) = self.span_to_line_col(span);
        let value = format!("{filename}:{line}:{col}");

        opening.attrs.push(self.make_attr(&value));
    }
}

impl VisitMut for DomSourceInjector<'_> {
    fn visit_mut_jsx_element(&mut self, n: &mut JSXElement) {
        n.visit_mut_children_with(self);
        self.inject_attr(&mut n.opening, n.span);
    }
}

#[plugin_transform]
pub fn transform(mut program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    let config: Config = serde_json::from_str(
        &metadata
            .get_transform_plugin_config()
            .unwrap_or_else(|| "{}".to_string()),
    )
    .unwrap_or_default();

    let filename = metadata
        .get_context(&TransformPluginMetadataContextKind::Filename)
        .map(|s| s.to_string());

    if should_exclude(&filename, &config.exclude) {
        return program;
    }

    program.visit_mut_with(&mut DomSourceInjector {
        filename,
        config,
        metadata: &metadata,
    });

    program
}
