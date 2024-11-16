import os

# Set the current working directory
cwd = os.getcwd()

# Folder containing the TXT files
posts_folder = os.path.join(cwd, 'posts')

# Output HTML file
output_file = os.path.join(cwd, 'posts_output.html')

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
            # Read each line in the file
            for line in f:
                # Strip the line of leading/trailing whitespace
                stripped_line = line.rstrip('\n')

                # Wrap the line in <span> with the class and add 5 tabs
                output.write(f'\t\t\t\t\t\t\t<span class="post-content {class_name}">{stripped_line}</span>\n')