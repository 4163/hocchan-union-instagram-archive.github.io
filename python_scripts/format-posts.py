import os

# Set the current working directory
cwd = os.getcwd()

# Folder containing the TXT files
posts_folder = os.path.join(cwd, 'posts')

# Output HTML file
output_file = os.path.join(cwd, 'posts_output.html')

# Ensure the folder exists
if not os.path.exists(posts_folder):
    print(f"Error: The folder '{posts_folder}' does not exist.")
    os.makedirs(posts_folder)  # Create the folder if missing
    print(f"Created the folder '{posts_folder}'. Please add .txt files and run the script again.")
    exit(1)  # Stop execution after creating the folder

# Open the output HTML file for writing
with open(output_file, 'w', encoding='utf-8') as output:
    # Get the list of TXT files and sort them in reverse order
    txt_files = sorted([f for f in os.listdir(posts_folder) if f.endswith('.txt')], reverse=True)
    
    # Iterate over each file in the 'posts' folder
    for filename in txt_files:
        file_path = os.path.join(posts_folder, filename)

        # Remove the file extension for the class
        class_name = os.path.splitext(filename)[0]

        # Open the TXT file for reading
        with open(file_path, 'r', encoding='utf-8') as f:
            # Read all lines and strip newline characters
            lines = [line.rstrip('\n') for line in f]

            # Format lines with `<br>` (excluding last line)
            formatted_lines = [f"{line}<br>" if i < len(lines) - 1 else line for i, line in enumerate(lines)]

            # Join lines with correct indentation
            content = ''.join(formatted_lines)

            # Write formatted span block with line breaks
            output.write(f'\t\t\t\t<span class="{class_name}">')  # Open span with newline
            output.write(f'{content}')  # Content with correct indentation
            output.write(f'</span>\n')  # Close span with newline
