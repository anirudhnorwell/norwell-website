import os
import re

def rename_files_in_directory(root_dir):
    for root, dirs, files in os.walk(root_dir):
        for filename in files:
            if ' ' in filename:
                old_path = os.path.join(root, filename)
                new_filename = filename.replace(' ', '_')
                new_path = os.path.join(root, new_filename)
                os.rename(old_path, new_path)
                print(f"Renamed: {old_path} -> {new_path}")

# Start from the images directory
images_dir = os.path.join(os.path.dirname(__file__), 'images')
rename_files_in_directory(images_dir)
print("File renaming completed!")
