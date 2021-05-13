const TypeDoc = require('typedoc');
const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

const rootPackage = 'smarthome';
const pathPrefix = '/assistant/smarthome/reference/local';

const app = new TypeDoc.Application();

// Parse options from tsconfig.json / typedoc.json files
app.options.addReader(new TypeDoc.TSConfigReader());
app.options.addReader(new TypeDoc.TypeDocReader());

const result = app.bootstrap({
  theme: 'docgen/theme/',
});
// Convert all d.ts files in config
const inputFiles = result.inputFiles.filter((item) => item.match(/d.ts/));

const project = app.convert(inputFiles);
if (project) {
  // Generate HTML docs and populate paths in the project
  const outputDir = app.options.getValue('out');
  app.generateDocs(project, outputDir);

  // Parse module tree and generate _toc.yaml
  const yamlDoc = generateToc(project);
  fs.writeFileSync(`${outputDir}/_toc.yaml`, yamlDoc);
  console.log('Generated _toc.yaml');
}

/**
 * Output the _toc.yaml for navigation
 * @param {TypeDoc.ProjectReflection} project
 */
function generateToc(project) {
  // Collect top-level namespaces
  const topLevel = project.findReflectionByName(rootPackage);
  const packages = [processNamespace(topLevel, false)];
  const subpackages = topLevel.groups.find((element) => element.title === 'Namespaces');
  // Traverse project nodes
  subpackages.children.forEach((element) => {
    packages.push(processNamespace(element, true));
  });

  // Return YAML doc
  return YAML.stringify({
    toc: packages,
  }, {
    indentSeq: false,
  });
}

/**
 * Recursively process tree of namespaces, outputting elements of each
 * @param {TypeDoc.Reflection} namespace
 * @param {boolean} nested
 */
function processNamespace(namespace, nested) {
  const node = nodeForElement(namespace, false);
  // Process elements within this namespace
  const enums = namespace.groups.find((element) =>
    element.title === 'Enumerations');
  const classes = namespace.groups.find((element) =>
    element.title === 'Classes');
  const interfaces = namespace.groups.find((element) =>
    element.title === 'Interfaces');
  const subpackages = namespace.groups.find((element) =>
    element.title === 'Namespaces');
  if (enums || classes || interfaces || subpackages) {
    node.section = [];
  }

  if (enums) {
    node.section.push({heading: 'Enums'});
    node.section = node.section.concat(enums.children.map((element) =>
      nodeForElement(element, true)));
  }
  if (classes) {
    node.section.push({heading: 'Classes'});
    node.section = node.section.concat(classes.children.map((element) =>
      nodeForElement(element, true)));
  }
  if (interfaces) {
    node.section.push({heading: 'Interfaces'});
    node.section = node.section.concat(interfaces.children.map((element) =>
      nodeForElement(element, true)));
  }

  // Explore nested namespaces
  if (nested && subpackages) {
    node.section = node.section.concat(subpackages.children.map((element) =>
      processNamespace(element)));
  }

  return node;
}

/**
 * Return the required properties for each node
 * @param {TypeDoc.Reflection} element
 * @param {boolean} short
 */
function nodeForElement(element, short) {
  // Parse path to trim file extensions
  const parsed = path.parse(element.url);
  return {
    title: short ? element.name : element.getFullName(),
    path: path.join(pathPrefix, parsed.dir, parsed.name),
  }
}
