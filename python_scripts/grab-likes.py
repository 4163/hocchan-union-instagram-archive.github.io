import os

# Set the current working directory
cwd = os.getcwd()

# Folder containing the JSON files
json_folder = os.path.join(cwd, 'json_files')

# Output HTML file
output_file = os.path.join(cwd, 'likefolder.html')

# Function to find the first non-null like_count
def find_like_count(content):
    start_pos = 0
    while True:
        try:
            # Search for the next occurrence of "like_count"
            start_index = content.index('"like_count":', start_pos) + len('"like_count":')
            end_index = content.index(',', start_index)
            like_count = content[start_index:end_index].strip()

            # If the like_count is not null, return it
            if like_count != 'null':
                return int(like_count)  # Convert to integer for formatting

            # Update the start position to search for the next like_count
            start_pos = end_index
        except ValueError:
            # If no more "like_count" is found, return None
            return None

# Open the output HTML file for writing
with open(output_file, 'w', encoding='utf-8') as output:
    # Get the list of JSON files and sort them in reverse order
    json_files = sorted([f for f in os.listdir(json_folder) if f.endswith('.json')], reverse=True)
    
    # Iterate over each sorted file in the 'json' folder
    for filename in json_files:
        file_path = os.path.join(json_folder, filename)
        
        # Open the JSON file as text
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the first non-null "like_count"
        like_count = find_like_count(content)

        # If a like_count was found, write it to the output file
        if like_count is not None:
            # Format the like_count with commas
            formatted_like_count = f'{like_count:,}'

            # Remove the file extension from the filename for the class
            class_name = os.path.splitext(filename)[0]

            # Write the result in the specified format to the HTML file
            output.write(f'\t\t\t\t\t<p class="likes {class_name}">{formatted_like_count}<strong> likes</strong></p>\n')
        else:
            # Optionally handle if no valid like_count is found
            print(f'No valid like_count found in {filename}')
