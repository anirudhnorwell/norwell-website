import re

# Read the asset-manifest.js file
with open('asset-manifest.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all spaces in file paths with underscores
# This will match paths like "Drinking Man.png" and convert to "Drinking_Man.png"
content = re.sub(r'images/[^\s"]+\s+[^\s"]+', lambda m: m.group(0).replace(' ', '_'), content)

# Write the updated content back
with open('asset-manifest.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Image file paths updated successfully!")
