# !/bin/sh
# Generate reference docs for publishing to developers.google.com

# Run TypeDoc
rm -rf docs/
./node_modules/.bin/typedoc index.d.ts --theme docgen/theme/

# Remove unnecessary files
rm -f docs/assets/css/main.css.map
rm -rf docs/assets/js/

# Add navigation
cp docgen/_toc.yaml docs/