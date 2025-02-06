import os
import re

# Define paths
cwd = os.getcwd()  # Current working directory
media_dir = os.path.join(cwd, 'Media')  # Media directory path
output_file = os.path.join(cwd, 'mediadates.html')  # Output HTML file path

# Regular expression to match filenames with affixes and capture the base name
pattern = re.compile(r'^(.*?)(_\d+)?\.(jpg|mp4)$')

# Function to format filenames as per the given rules
def format_filename(filename):
    # Split filename by '-'
    parts = filename.split('-')

    # Replace the first two hyphens with periods and the last two with colons
    if len(parts) > 4:
        return '.'.join(parts[:2]) + ':' + ':'.join(parts[2:])
    elif len(parts) == 4:
        return '.'.join(parts[:2]) + ':' + ':'.join(parts[2:])
    elif len(parts) == 3:
        return '.'.join(parts[:2]) + ':' + parts[2]
    elif len(parts) == 2:
        return '.'.join(parts)
    else:
        return filename

# Function to process files in reverse order and generate HTML content
def generate_html():
    with open(output_file, 'w') as f_out:
        files = os.listdir(media_dir)
        # Reverse the list of files
        files.reverse()
        
        for file_name in files:
            match = pattern.match(file_name)
            if match:
                base_name, affix, ext = match.groups()

                # Process filenames with an affix of _1 and exclude others
                if affix is None or affix == '_1':
                    formatted_name = format_filename(base_name)
                    f_out.write(f'\t\t\t\t\t<p class="{base_name}">{formatted_name}</p>\n')

# Run the HTML generation in reverse order
generate_html()

print(f"HTML file generated at {output_file}")
