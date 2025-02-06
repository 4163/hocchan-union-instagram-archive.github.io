import os

def generate_media_html(folder_path='Media'):
    # Get all files in the specified directory
    files = os.listdir(folder_path)
    
    # Filter for image and video files (you can modify these extensions if needed)
    media_files = [f for f in files if f.endswith(('.jpg', '.jpeg', '.png', '.mp4'))]
    
    # Sort filenames in reverse order
    media_files.sort(reverse=True)

    # Prepare the HTML output
    html_content = []

    for filename in media_files:
        # Get the base name and date from the filename
        base_name = filename.split('.')[0]  # Get the base name without the extension
        parts = base_name.split('_')  # Split the base name by '_'
        date_part = "_".join(parts[:-1]) if len(parts) > 1 and parts[-1].isdigit() else base_name

        if len(parts) > 1 and parts[-1].isdigit():  # Check if the last part is a digit
            affix = int(parts[-1])
            class_name = f'main-sub-post {date_part}' if affix == 1 else f'sub-post {date_part}'  # Class for affixed filenames
            data_affix = f'data-affix="{affix}"'  # Create data-affix attribute
        else:
            class_name = f'main-post {date_part}'  # Class for non-affixed filenames
            data_affix = ''  # No data-affix attribute for non-affixed

        # Create the HTML structure for the media file
        if filename.endswith(('.jpg', '.jpeg', '.png')):  # Check if it's an image
            html_content.append(f'\t\t\t<img src="{folder_path}/{filename}" class="{class_name}" {data_affix} />')
        elif filename.endswith('.mp4'):  # Check if it's a video
            html_content.append(f'\t\t\t<video controls class="{class_name}" {data_affix}>')
            html_content.append(f'\t\t\t\t<source src="{folder_path}/{filename}" />')
            html_content.append('\t\t\t\tYour browser does not support the video tag.')
            html_content.append('\t\t\t</video>')

    # Write the HTML content to the file without surrounding structure
    with open('mediafolder.html', 'w', encoding='utf-8') as f:
        for line in html_content:
            f.write(f'{line}\n')

# Run the function to generate the HTML
generate_media_html()