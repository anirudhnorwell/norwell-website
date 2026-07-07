import re

# Read the asset-manifest.js file
with open('asset-manifest.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace directory names with spaces to underscores
replacements = {
    'images/Bottles/Fridge Bottles': 'images/Bottles/Fridge_Bottles',
    'images/Bottles/Gym Bottles': 'images/Bottles/Gym_Bottles',
    'images/Bottles/Hot and Cold Bottles': 'images/Bottles/Hot_and_Cold_Bottles',
    'images/Bottles/Sipper Bottles': 'images/Bottles/Sipper_Bottles',
    'images/Bottles/Travel Bottles': 'images/Bottles/Travel_Bottles',
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Write the updated content back
with open('asset-manifest.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Directory paths updated successfully!")
